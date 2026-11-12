<?php
/**
 * DESENRASCADO — Registo Nacional de Despejados (API de Leaderboard)
 * Backend SQLite3 ultra-leve, sem dependências externas.
 */

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

// Permitir CORS local e no próprio domínio
$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
header("Access-Control-Allow-Origin: $origin");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$dbPath = __DIR__ . '/../data/leaderboard.sqlite';

try {
    $db = new PDO("sqlite:$dbPath");
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

    // Criar tabela se não existir
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

    // Verificar se a tabela está vazia e preencher com registos fictícios históricos de Lisboa
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

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $raw = file_get_contents('php://input');
        $data = json_decode($raw, true);

        if (!$data || !is_array($data)) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'JSON inválido']);
            exit;
        }

        // Sanitização e validação
        $name = trim(strip_tags($data['name'] ?? ''));
        if (empty($name)) {
            $name = 'Cidadão Anónimo';
        }
        $name = mb_substr($name, 0, 18, 'UTF-8');

        $days = (int)($data['days'] ?? 1);
        if ($days < 1) $days = 1;
        if ($days > 999) $days = 999;

        $money = (int)($data['money'] ?? 0);
        if ($money < 0) $money = 0;
        if ($money > 999999) $money = 999999;

        $cause = trim(strip_tags($data['cause'] ?? 'Despejado pelo Senhorio'));
        $cause = mb_substr($cause, 0, 36, 'UTF-8');

        $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
        $ipHash = hash('sha256', $ip . 'desenrascado_salt_2026');

        // Rate limiting: máximo 1 submissão a cada 15 segundos por IP
        $rateCheck = $db->prepare("SELECT COUNT(*) FROM leaderboard WHERE ip_hash = ? AND created_at > datetime('now', '-15 seconds')");
        $rateCheck->execute([$ipHash]);
        if ($rateCheck->fetchColumn() > 0) {
            http_response_code(429);
            echo json_encode(['status' => 'error', 'message' => 'Calma! Aguarda alguns segundos antes de submeter outro recorde.']);
            exit;
        }

        // Inserir pontuação
        $insert = $db->prepare("INSERT INTO leaderboard (name, days, money, cause, ip_hash) VALUES (?, ?, ?, ?, ?)");
        $insert->execute([$name, $days, $money, $cause, $ipHash]);

        // Calcular posição no ranking
        $rankStmt = $db->prepare("SELECT COUNT(*) + 1 as rank FROM leaderboard WHERE days > ? OR (days = ? AND money > ?)");
        $rankStmt->execute([$days, $days, $money]);
        $rank = (int)$rankStmt->fetchColumn();

        // Devolver ranking atualizado
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

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Erro interno ao processar a tabela de recordes']);
}
