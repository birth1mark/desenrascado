<?php
/**
 * DESENRASCADO — Registo Nacional de Despejados (API de Leaderboard)
 * Backend blindado com SQLite3 isolado, sem dependências externas.
 */

// Desativar exibição de erros para não expor caminhos internos
ini_set('display_errors', '0');
error_reporting(0);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Referrer-Policy: strict-origin-when-cross-origin');

// 1. Validação Estrita de CORS (Apenas origens autorizadas)
$allowedOrigins = [
    'https://desenrascado.pormenores.net',
    'https://pormenores.net',
    'http://localhost:8080',
    'http://127.0.0.1:8080'
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// 2. Base de Dados Isolada Fora da Raiz Web (Impossível de descarregar via HTTP)
$serverDbDir = '/home/pedrori1/desenrascado_data';
if (is_dir($serverDbDir)) {
    $dbPath = $serverDbDir . '/leaderboard.sqlite';
} else {
    // Ambiente local de desenvolvimento
    $localDir = __DIR__ . '/../data';
    if (!is_dir($localDir)) @mkdir($localDir, 0755, true);
    $dbPath = $localDir . '/leaderboard.sqlite';
}

try {
    $db = new PDO("sqlite:$dbPath");
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

    // Schema seguro com índices
    $db->exec("
        CREATE TABLE IF NOT EXISTS leaderboard (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            days INTEGER NOT NULL,
            money INTEGER NOT NULL,
            cause TEXT,
            ip_hash TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        CREATE INDEX IF NOT EXISTS idx_score ON leaderboard (days DESC, money DESC);
    ");

    // Seed inicial seguro se a tabela estiver vazia
    $count = $db->query("SELECT COUNT(*) FROM leaderboard")->fetchColumn();
    if ($count == 0) {
        $seedStmt = $db->prepare("INSERT INTO leaderboard (name, days, money, cause, created_at) VALUES (?, ?, ?, ?, datetime('now', ?))");
        $seeds = [
            ["Ti Zé da Tasca", 42, 4850, "Sobrevivente Lendário", "-5 days"],
            ["Nómada em Alfama", 27, 2150, "Subida da Euribor", "-4 days"],
            ["Estagiário do IST", 21, 840, "Burnout Existencial", "-3 days"],
            ["Senhorio da Graça", 14, 1600, "Cobrança Semanal", "-2 days"],
            ["Turista do Elétrico 28", 8, 310, "Perdido na Calçada", "-1 days"]
        ];
        foreach ($seeds as $s) {
            $seedStmt->execute($s);
        }
    }

    // Leitura: GET (Cache amigável, apenas top 10)
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $stmt = $db->query("
            SELECT name, days, money, cause, strftime('%d/%m/%Y', created_at) as date
            FROM leaderboard
            ORDER BY days DESC, money DESC, id ASC
            LIMIT 10
        ");
        $scores = $stmt->fetchAll();
        echo json_encode(['status' => 'ok', 'scores' => $scores]);
        exit;
    }

    // Escrita: POST (Validação estrita)
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Limitar tamanho máximo do pedido a 4 KB
        if (isset($_SERVER['CONTENT_LENGTH']) && (int)$_SERVER['CONTENT_LENGTH'] > 4096) {
            http_response_code(413);
            echo json_encode(['status' => 'error', 'message' => 'Pedido demasiado grande']);
            exit;
        }

        $raw = file_get_contents('php://input');
        if (strlen($raw) > 4096) {
            http_response_code(413);
            echo json_encode(['status' => 'error', 'message' => 'Payload excedeu o limite']);
            exit;
        }

        $data = json_decode($raw, true);
        if (!$data || !is_array($data)) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'JSON inválido']);
            exit;
        }

        // Honeypot anti-bot
        if (!empty($data['website']) || !empty($data['email'])) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Pedido rejeitado']);
            exit;
        }

        // 3. Sanitização e Validação Estrita Anti-XSS & Anti-Injeção
        // Permitir apenas caracteres alfanuméricos, espaços, pontos, hífens
        $rawName = $data['name'] ?? '';
        $cleanName = preg_replace('/[^\p{L}\p{N}\s\.\-_]/u', '', (string)$rawName);
        $cleanName = trim(preg_replace('/\s+/', ' ', $cleanName));

        if (empty($cleanName)) {
            $cleanName = 'Cidadão Anónimo';
        }
        $name = mb_substr($cleanName, 0, 16, 'UTF-8');

        // Validação numérica rígida
        $days = filter_var($data['days'] ?? 1, FILTER_VALIDATE_INT, [
            'options' => ['min_range' => 1, 'max_range' => 999, 'default' => 1]
        ]);

        $money = filter_var($data['money'] ?? 0, FILTER_VALIDATE_INT, [
            'options' => ['min_range' => 0, 'max_range' => 999999, 'default' => 0]
        ]);

        $rawCause = $data['cause'] ?? 'Despejado pelo Senhorio';
        $cleanCause = preg_replace('/[^\p{L}\p{N}\s\.\-_]/u', '', (string)$rawCause);
        $cleanCause = trim(preg_replace('/\s+/', ' ', $cleanCause));
        $cause = mb_substr($cleanCause, 0, 32, 'UTF-8');

        // 4. Rate-Limiting por IP Hash
        $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
        $ipHash = hash('sha256', $ip . 'desenrascado_salt_v3_2026');

        $rateCheck = $db->prepare("SELECT COUNT(*) FROM leaderboard WHERE ip_hash = :ip AND created_at > datetime('now', '-20 seconds')");
        $rateCheck->bindValue(':ip', $ipHash, PDO::PARAM_STR);
        $rateCheck->execute();

        if ($rateCheck->fetchColumn() > 0) {
            http_response_code(429);
            echo json_encode(['status' => 'error', 'message' => 'Aguarde 20 segundos antes de enviar novo recorde.']);
            exit;
        }

        // 5. Inserção Segura com Parâmetros Tipados
        $insert = $db->prepare("INSERT INTO leaderboard (name, days, money, cause, ip_hash) VALUES (:name, :days, :money, :cause, :ip)");
        $insert->bindValue(':name', $name, PDO::PARAM_STR);
        $insert->bindValue(':days', $days, PDO::PARAM_INT);
        $insert->bindValue(':money', $money, PDO::PARAM_INT);
        $insert->bindValue(':cause', $cause, PDO::PARAM_STR);
        $insert->bindValue(':ip', $ipHash, PDO::PARAM_STR);
        $insert->execute();

        // 6. Prevenção de Esgotamento de Disco (Auto-pruning)
        // Mantém apenas os 100 melhores registos de sempre (ficheiro nunca ultrapassa ~30 KB)
        $db->exec("DELETE FROM leaderboard WHERE id NOT IN (SELECT id FROM leaderboard ORDER BY days DESC, money DESC LIMIT 100)");

        // Calcular posição no ranking
        $rankStmt = $db->prepare("SELECT COUNT(*) + 1 as rank FROM leaderboard WHERE days > :days OR (days = :days AND money > :money)");
        $rankStmt->bindValue(':days', $days, PDO::PARAM_INT);
        $rankStmt->bindValue(':money', $money, PDO::PARAM_INT);
        $rankStmt->execute();
        $rank = (int)$rankStmt->fetchColumn();

        // Devolver top 10
        $topStmt = $db->query("
            SELECT name, days, money, cause, strftime('%d/%m/%Y', created_at) as date
            FROM leaderboard
            ORDER BY days DESC, money DESC, id ASC
            LIMIT 10
        ");
        $scores = $topStmt->fetchAll();

        echo json_encode([
            'status' => 'ok',
            'rank' => $rank,
            'message' => 'Recorde registado com sucesso!',
            'scores' => $scores
        ]);
        exit;
    }

    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Método não permitido']);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Erro interno ao processar']);
}
