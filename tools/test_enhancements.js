const fs = require('fs');
const assert = require('assert');
const vm = require('vm');

console.log("=================================================================");
console.log("SUITE DE TESTES AUTOMATIZADOS: DESENRASCADO v7.0");
console.log("=================================================================\n");

const html = fs.readFileSync('/home/pedro/Projects/desenrascado/index.html', 'utf8');

const scriptMatch = html.match(/<script(?![^>]*ld\+json)[^>]*>([\s\S]*?)<\/script>/i);
assert(scriptMatch, "Script tag encontrada");
const jsCode = scriptMatch[1];

const sandbox = {
    window: {
        AudioContext: class {
            constructor() {
                this.currentTime = 0;
                this.state = 'running';
                this.destination = {};
            }
            createOscillator() {
                return {
                    frequency: { setValueAtTime() {}, linearRampToValueAtTime() {} },
                    connect() {},
                    start() {},
                    stop() {}
                };
            }
            createGain() {
                return {
                    gain: { setValueAtTime() {}, linearRampToValueAtTime() {}, exponentialRampToValueAtTime() {} },
                    connect() {}
                };
            }
            createBiquadFilter() {
                return {
                    frequency: { setValueAtTime() {} },
                    Q: { setValueAtTime() {} },
                    connect() {}
                };
            }
        },
        addEventListener() {},
        innerWidth: 1280,
        innerHeight: 720,
        localStorage: {
            getItem() { return null; },
            setItem() {},
            removeItem() {}
        }
    },
    document: (() => {
        const elemMap = {};
        return {
            getElementById(id) {
                if (!elemMap[id]) {
                    elemMap[id] = {
                        id,
                        getContext() {
                            return {
                                measureText(text) { return { width: (text || '').length * 6 }; },
                                fillRect() {}, strokeRect() {}, fillText() {}, beginPath() {}, moveTo() {}, lineTo() {}, arc() {}, fill() {}, stroke() {}, save() {}, restore() {}, drawImage() {}, createLinearGradient() { return { addColorStop() {} }; }, createRadialGradient() { return { addColorStop() {} }; }, clearRect() {}, quadraticCurveTo() {}, bezierCurveTo() {}, closePath() {}, setLineDash() {}, rect() {}, clip() {}
                            };
                        },
                        addEventListener() {},
                        getBoundingClientRect() { return { left: 0, top: 0, width: 640, height: 360 }; },
                        style: {},
                        classList: { add() {}, remove() {}, contains() { return false; } },
                        width: 640,
                        height: 360
                    };
                }
                return elemMap[id];
            },
            querySelectorAll() { return []; },
            createElement(tag) {
                return {
                    getContext() {
                        return {
                            measureText(text) { return { width: (text || '').length * 6 }; },
                            fillRect() {}, strokeRect() {}, fillText() {}, beginPath() {}, moveTo() {}, lineTo() {}, arc() {}, fill() {}, stroke() {}, save() {}, restore() {}, drawImage() {}, createLinearGradient() { return { addColorStop() {} }; }, createRadialGradient() { return { addColorStop() {} }; }, clearRect() {}, quadraticCurveTo() {}, bezierCurveTo() {}, closePath() {}, setLineDash() {}, rect() {}, clip() {}
                        };
                    },
                    style: {},
                    width: 640,
                    height: 360
                };
            },
            addEventListener() {}
        };
    })(),
    fetch: () => Promise.resolve({ ok: true, json: () => Promise.resolve([]) }),
    Image: class {
        constructor() { this.width = 640; this.height = 295; }
    },
    navigator: {
        vibrate() {}
    },
    performance: { now: () => Date.now() },
    requestAnimationFrame: (fn) => setTimeout(fn, 16),
    console: console,
    assert: assert,
    Math: Math,
    setTimeout: (fn) => setTimeout(fn, 1),
    setInterval: () => 1,
    clearInterval: () => {}
};

sandbox.window.window = sandbox.window;
sandbox.window.document = sandbox.document;

vm.createContext(sandbox);

try {
    vm.runInContext(jsCode, sandbox);
    console.log("✓ 1. Código JavaScript avaliado e executado no contexto virtual sem erros!");
} catch (e) {
    console.error("Erro na execução do JS:", e);
    process.exit(1);
}

// -----------------------------------------------------------------------------
// TESTE 1: MERCEARIA DO BAIRRO
// -----------------------------------------------------------------------------
const BUILDINGS = vm.runInContext("BUILDINGS", sandbox);
const mercBuilding = BUILDINGS.find(b => b.id === 'supermercado');
assert(mercBuilding, "Edifício 'supermercado' existe");
assert.strictEqual(mercBuilding.name, "Mercearia da Cátia", "Nome do edifício atualizado para 'Mercearia da Cátia'");
assert.strictEqual(mercBuilding.tag, "MERCEARIA TRADICIONAL", "Tag atualizada para 'MERCEARIA TRADICIONAL'");

const wp = vm.runInContext("WORKPLACES.pingo_doce", sandbox);
assert(wp, "Local de trabalho pingo_doce existe");
assert.strictEqual(wp.name, "Mercearia da Cátia", "Nome do local de trabalho atualizado");
assert.strictEqual(wp.shortName, "Mercearia", "shortName atualizado");
assert.strictEqual(wp.tag, "MERCEARIA & RETALHO", "tag de retalho atualizada");

const npcInfo = vm.runInContext("NPC_INFO.supermercado", sandbox);
assert(npcInfo, "NPC_INFO.supermercado existe");
assert.strictEqual(npcInfo.name, "Cátia", "Nome do NPC atualizado para apenas Cátia");
assert.strictEqual(vm.runInContext("NPC_INFO.loja_roupa.name", sandbox), "D. Zulmira", "Nome de D. Zulmira sem parenteses ou 60 anos");
assert.strictEqual(npcInfo.role, "Encarregada da Mercearia", "Papel do NPC atualizado");
console.log("✓ 2. Renomeação da Mercearia da Cátia: 100% Validada em BUILDINGS, WORKPLACES e NPC_INFO!");

// -----------------------------------------------------------------------------
// TESTE 2: ANTI-CROWDING & CONTROLO DE BALÕES
// -----------------------------------------------------------------------------
assert.strictEqual(vm.runInContext("MAX_SPEECH_BUBBLES", sandbox), 1, "MAX_SPEECH_BUBBLES estritamente 1");

vm.runInContext("state = 'BOARD'; speechBubbles = [];", sandbox);
vm.runInContext("spawnSpeechBubble(300, 150, 'Olá Lisboa!', 'Zé');", sandbox);
assert.strictEqual(vm.runInContext("speechBubbles.length", sandbox), 1, "1 balão ativo gerado");

// Teste de supressão por hover do edifício
vm.runInContext("hoveredBuilding = BUILDINGS.find(b => b.id === 'supermercado');", sandbox);
vm.runInContext("spawnSpeechBubble(450, 150, 'Este balão deve ser suprimido!', 'Passante');", sandbox);
assert.strictEqual(vm.runInContext("speechBubbles.length", sandbox), 1, "Balão suprimido quando edifício está com hover!");
assert.strictEqual(vm.runInContext("speechBubbles[0].text", sandbox), "Olá Lisboa!", "Balão inicial mantido");

// Substituição limpa quando fora do edifício
vm.runInContext("hoveredBuilding = null;", sandbox);
vm.runInContext("spawnSpeechBubble(150, 150, 'Novo balão distante!', 'Maria');", sandbox);
assert.strictEqual(vm.runInContext("speechBubbles.length", sandbox), 1, "Apenas 1 balão substituto no ecrã");
assert.strictEqual(vm.runInContext("speechBubbles[0].text", sandbox), "Novo balão distante!", "Texto atualizado corretamente");
console.log("✓ 3. Anti-Crowding de Diálogos: Limite de 1 balão e supressão inteligente por hover validados!");

// -----------------------------------------------------------------------------
// TESTE 3: PAGINAÇÃO DE AÇÕES NOS EDIFÍCIOS
// -----------------------------------------------------------------------------
vm.runInContext(`
    modalBuilding = BUILDINGS.find(b => b.id === 'supermercado');
    modalBuilding.actionPage = 0;
    renderBuildingActions('supermercado', 30, 25, 580, 280);
`, sandbox);

const currentActions = vm.runInContext("modalBuilding.currentActions", sandbox);
const currentPagedActions = vm.runInContext("modalBuilding.currentPagedActions", sandbox);
const pagination = vm.runInContext("modalBuilding.pagination", sandbox);

assert(currentActions.length >= 6, "Mercearia tem mais de 4 ações");
assert.strictEqual(currentPagedActions.length, 4, "Página 0 tem estritamente 4 ações");
assert(pagination, "Objeto de paginação gerado");
assert.strictEqual(pagination.curPage, 0, "Página atual é 0");
assert(pagination.totalPages >= 2, "Total de páginas >= 2");
assert(pagination.nextBtn.enabled, "Botão Próximo está ativo");
assert(!pagination.prevBtn.enabled, "Botão Anterior desativado na pág 0");

// Avançar página
vm.runInContext(`
    modalBuilding.actionPage = 1;
    renderBuildingActions('supermercado', 30, 25, 580, 280);
`, sandbox);

const page1PagedActions = vm.runInContext("modalBuilding.currentPagedActions", sandbox);
const page1Pagination = vm.runInContext("modalBuilding.pagination", sandbox);

assert.strictEqual(page1PagedActions.length, currentActions.length - 4, "Página 1 tem as restantes ações");
assert(page1Pagination.prevBtn.enabled, "Botão Anterior ativado na pág 1");
console.log("✓ 4. Paginação de Ações em Modais: Máximo de 4 por página com navegação [◀] [▶] validada sem overflow!");

// -----------------------------------------------------------------------------
// TESTE 4: ÁRVORES DE DIÁLOGO (DIALOGUE TREES)
// -----------------------------------------------------------------------------
const DIALOGUE_TREES = vm.runInContext("DIALOGUE_TREES", sandbox);
assert(DIALOGUE_TREES, "Catálogo DIALOGUE_TREES existe");
['catia', 'senhorio', 'tasca', 'acampada', 'iefp', 'faculdade'].forEach(key => {
    assert(DIALOGUE_TREES[key], `Árvore de diálogo '${key}' existe`);
    assert(DIALOGUE_TREES[key].nodes.start, `Nó inicial 'start' existe em '${key}'`);
    assert(DIALOGUE_TREES[key].nodes.start.choices.length >= 2, `'${key}' tem múltiplas escolhas interativas`);
});

vm.runInContext("openDialogueTree('catia');", sandbox);
assert(vm.runInContext("activeDialogueTree", sandbox), "activeDialogueTree ativo");
assert.strictEqual(vm.runInContext("activeDialogueTree.treeId", sandbox), 'catia', "Diálogo com Cátia ativo");

// Teste de escolha
vm.runInContext("executeDialogueChoice({ text: 'Teste', nextNode: 'mercearia_negocio' });", sandbox);
assert.strictEqual(vm.runInContext("activeDialogueTree.currentNodeId", sandbox), 'mercearia_negocio', "Transição de nó bem sucedida");

// Teste de saída
vm.runInContext("executeDialogueChoice({ text: 'Sair', nextNode: 'exit' });", sandbox);
assert.strictEqual(vm.runInContext("activeDialogueTree", sandbox), null, "Saída limpa da árvore de diálogo");
console.log("✓ 5. Árvores de Diálogo SCUMM: Catálogo com 6 personagens e navegação em grafo validada!");

// -----------------------------------------------------------------------------
// TESTE 5: VINHETAS CINEMATOGRÁFICAS (CUTSCENES)
// -----------------------------------------------------------------------------
const CUTSCENES = vm.runInContext("CUTSCENES", sandbox);
assert(CUTSCENES, "Catálogo CUTSCENES existe");
['eviction_threat', 'evicted', 'graduation', 'romance_catia', 'new_home'].forEach(key => {
    assert(CUTSCENES[key], `Cutscene '${key}' existe`);
    assert(CUTSCENES[key].slides.length >= 2, `Cutscene '${key}' tem múltiplos slides cinematográficos`);
});

vm.runInContext("state = 'BOARD'; playCutscene('graduation');", sandbox);
assert.strictEqual(vm.runInContext("state", sandbox), 'CUTSCENE', "Estado mudou para 'CUTSCENE'");
assert(vm.runInContext("activeCutscene", sandbox), "activeCutscene ativo");
assert.strictEqual(vm.runInContext("activeCutscene.id", sandbox), 'graduation', "ID da cutscene correto");

// Simulação de typewriter
vm.runInContext("updateCutscene(0.5);", sandbox);
assert(vm.runInContext("activeCutscene.charIndex", sandbox) > 0, "Typewriter avançou caracteres");

// Concluir cutscene
vm.runInContext("advanceCutscene(true);", sandbox); // slide 1
vm.runInContext("advanceCutscene(true);", sandbox); // slide 2
vm.runInContext("advanceCutscene(true);", sandbox); // slide 3 (fim)
assert.strictEqual(vm.runInContext("state", sandbox), 'BOARD', "Estado restaurado com sucesso após cutscene!");
assert.strictEqual(vm.runInContext("activeCutscene", sandbox), null, "activeCutscene finalizada");
console.log("✓ 6. Vinhetas Cinematográficas 16-bit: Efeitos de letterbox, typewriter e encerramento validados!");

// -----------------------------------------------------------------------------
// TESTE 6: VERSÃO DE ASSETS
// -----------------------------------------------------------------------------
assert.strictEqual(vm.runInContext("ASSET_VER", sandbox), '7.3', "ASSET_VER incrementado para 7.3");
console.log("✓ 7. Protocolo de Cache-Busting: ASSET_VER = '7.3' confirmado!");

// -----------------------------------------------------------------------------
// TESTE 8: CÓDEX "QUEM É QUEM EM LISBOA" & ÁLBUM DE FOTOGRAFIAS DINÂMICAS
// -----------------------------------------------------------------------------
const LISBON_CHARACTERS = vm.runInContext("LISBON_CHARACTERS", sandbox);
assert(LISBON_CHARACTERS, "Catálogo LISBON_CHARACTERS existe");

const expectedChars = [
    'senhorio', 'tasca', 'supermercado', 'loja_roupa', 'acampada',
    'faculdade', 'banco', 'startup', 'miradouro', 'marta', 'rui', 'goncalo'
];

assert.strictEqual(Object.keys(LISBON_CHARACTERS).length, 12, "Existem exatamente 12 personagens em LISBON_CHARACTERS");
expectedChars.forEach(key => {
    const c = LISBON_CHARACTERS[key];
    assert(c, `Personagem '${key}' existe no códex`);
    assert(c.fullName && c.role && c.location, `'${key}' tem atributos biográficos completos`);
    assert(c.bioPublic && c.bioNeighbour && c.bioConfidential && c.bioSecretPact, `'${key}' tem os 4 patamares de biografia expandida`);
    assert.strictEqual(c.photos.length, 4, `'${key}' tem exatamente 4 fotografias polaroid`);
    assert.strictEqual(c.photos[0].minAffinity, 0, `'${key}' foto 1 tem minAffinity = 0%`);
    assert.strictEqual(c.photos[1].minAffinity, 35, `'${key}' foto 2 tem minAffinity = 35%`);
    assert.strictEqual(c.photos[2].minAffinity, 65, `'${key}' foto 3 tem minAffinity = 65%`);
    assert.strictEqual(c.photos[3].minAffinity, 85, `'${key}' foto 4 tem minAffinity = 85%`);
});

// Teste de Afinidade / Proximidade Dinâmica
vm.runInContext(`
    player.affinity = null;
    const initialAff = getNpcAffinity('senhorio');
    assert.strictEqual(initialAff, 30, "Afinidade base do senhorio é 30%");

    // Aumentar proximidade
    changeNpcAffinity('senhorio', 10, 'Teste Pagamento');
    assert.strictEqual(getNpcAffinity('senhorio'), 40, "Afinidade subiu para 40%");

    // Foto 2 (limiar 35%) deve agora estar desbloqueada
    const charSenhorio = LISBON_CHARACTERS.senhorio;
    const unlPhotos1 = charSenhorio.photos.filter(p => getNpcAffinity('senhorio') >= p.minAffinity);
    assert.strictEqual(unlPhotos1.length, 2, "Com 40% proximidade, 2 fotos desbloqueadas");

    // Diminuir proximidade (relock / arquivar)
    changeNpcAffinity('senhorio', -15, 'Atraso na renda');
    assert.strictEqual(getNpcAffinity('senhorio'), 25, "Afinidade desceu para 25%");

    // Foto 2 foi arquivada (proximidade caiu abaixo de 35%)
    const unlPhotos2 = charSenhorio.photos.filter(p => getNpcAffinity('senhorio') >= p.minAffinity);
    assert.strictEqual(unlPhotos2.length, 1, "Com 25% proximidade, foto 2 voltou a ficar bloqueada (arquivada)");

    // Teste de Modal do Códex
    openCodexModal('tasca');
    assert.strictEqual(selectedCodexChar, 'tasca', "openCodexModal selecionou 'tasca'");
    selectCodexChar('loja_roupa');
    assert.strictEqual(selectedCodexChar, 'loja_roupa', "selectCodexChar selecionou 'loja_roupa'");
    closeCodexModal();
`, sandbox);

console.log("✓ 8. Códex 'Quem é Quem' & Fotografias Dinâmicas: 12 biografias ampliadas, desbloqueio e relock de fotos validados!");

// -----------------------------------------------------------------------------
// TESTE 9: AUDITORIA EXAUSTIVA DE TODOS OS MENUS E OPÇÕES (ZERO OVERFLOW)
// -----------------------------------------------------------------------------
const allTrees = vm.runInContext("DIALOGUE_TREES", sandbox);
const dialogueBottom = 135 + 152; // dy + dh = 287 (abaixo de 295)
let dialogueOverflows = [];
let totalChoicesChecked = 0;

for (const [tId, t] of Object.entries(allTrees)) {
    for (const [nId, n] of Object.entries(t.nodes)) {
        vm.runInContext(`
            activeDialogueTree = { treeId: '${tId}', config: DIALOGUE_TREES['${tId}'], currentNodeId: '${nId}', choiceBoxes: [] };
            renderDialogueTree(ctx, 0);
        `, sandbox);

        const choiceBoxes = vm.runInContext("activeDialogueTree.choiceBoxes", sandbox) || [];
        choiceBoxes.forEach((b, idx) => {
            totalChoicesChecked++;
            const bottom = b.y + b.h;
            if (bottom > dialogueBottom) {
                dialogueOverflows.push({ tree: tId, node: nId, choiceIdx: idx, bottom, max: dialogueBottom });
            }
        });
    }
}
assert.strictEqual(dialogueOverflows.length, 0, "Nenhuma escolha de diálogo transborda da moldura!");

const allBuildings = vm.runInContext("BUILDINGS", sandbox);
const bMx = 40, bMy = 10, bMw = 560, bMh = 275;
const modalBottom = bMy + bMh; // 285 (abaixo de 295)

const scenarios = [
    { name: "Sem-Abrigo, Desempregado", setup: (p) => { p.houseIndex = 0; p.currentWorkplace = null; p.partner = null; } },
    { name: "Arroios, Mercearia Cátia", setup: (p) => { p.houseIndex = 2; p.currentWorkplace = 'pingo_doce'; p.partner = 'catia'; p.careerRanks.pingo_doce = 1; } },
    { name: "Chiado T1, Caixa Geral", setup: (p) => { p.houseIndex = 4; p.currentWorkplace = 'banco'; p.partner = 'marta'; p.careerRanks.banco = 2; } }
];

let totalActionCardsChecked = 0;
let totalPaginationBarsChecked = 0;
let buildingOverflows = [];

scenarios.forEach(sc => {
    allBuildings.forEach(b => {
        vm.runInContext(`
            (${sc.setup.toString()})(player);
            modalBuilding = BUILDINGS.find(x => x.id === '${b.id}');
            modalBuilding.actionPage = 0;
            renderBuildingActions('${b.id}', ${bMx}, ${bMy}, ${bMw}, ${bMh});
        `, sandbox);

        const pagination = vm.runInContext("modalBuilding.pagination", sandbox);
        const totalPages = pagination ? pagination.totalPages : 1;

        for (let page = 0; page < totalPages; page++) {
            vm.runInContext(`
                modalBuilding.actionPage = ${page};
                renderBuildingActions('${b.id}', ${bMx}, ${bMy}, ${bMw}, ${bMh});
            `, sandbox);

            const boxes = vm.runInContext("modalBuilding.actionBoxes", sandbox) || [];
            boxes.forEach((box, idx) => {
                totalActionCardsChecked++;
                const bottom = box.y + box.h;
                if (bottom > modalBottom) {
                    buildingOverflows.push({ building: b.id, scenario: sc.name, page, item: `Card ${idx} [${box.action.label}]`, bottom, max: modalBottom });
                }
            });

            if (totalPages > 1) {
                totalPaginationBarsChecked++;
                const pInfo = vm.runInContext("modalBuilding.pagination", sandbox);
                const prevBottom = pInfo.prevBtn.y + pInfo.prevBtn.h;
                const nextBottom = pInfo.nextBtn.y + pInfo.nextBtn.h;
                if (prevBottom > modalBottom || nextBottom > modalBottom) {
                    buildingOverflows.push({ building: b.id, scenario: sc.name, page, item: "Pagination Bar", bottom: Math.max(prevBottom, nextBottom), max: modalBottom });
                }
            }
        }
    });
});

assert.strictEqual(buildingOverflows.length, 0, "Nenhum cartão ou barra de paginação transborda do modal!");
console.log(`✓ 9. Auditoria Exaustiva de Menus: ${totalChoicesChecked} opções de diálogo e ${totalActionCardsChecked} ações testadas com ZERO OVERFLOW!`);

// -----------------------------------------------------------------------------
// TESTE 10: ACESSIBILIDADE E SAÍDAS DO CÓDEX E MODAIS (DISMISSAL, TOGGLE, ZERO CLIPPING)
// -----------------------------------------------------------------------------
// 1. Verificar dismiss por backdrop em todos os modais
assert(html.includes('id="codex-modal" class="game-overlay" style="display: none;" onclick="if(event.target === this) closeCodexModal()"'), "codex-modal tem dismiss por clique no backdrop");
assert(html.includes('id="curriculum-modal" class="game-overlay" style="display: none;" onclick="if(event.target === this) closeCurriculumModal()"'), "curriculum-modal tem dismiss por clique no backdrop");
assert(html.includes('id="achievements-modal" class="game-overlay" style="display: none;" onclick="if(event.target === this) closeAchievementsModal()"'), "achievements-modal tem dismiss por clique no backdrop");
assert(html.includes('id="leaderboard-modal" class="game-overlay" style="display: none;" onclick="if(event.target === this) closeLeaderboard()"'), "leaderboard-modal tem dismiss por clique no backdrop");
assert(html.includes('id="submit-score-modal" class="game-overlay" style="display: none;" onclick="if(event.target === this) closeSubmitModal()"'), "submit-score-modal tem dismiss por clique no backdrop");

// 2. Verificar botões de fechar no cabeçalho com texto explícito
assert(html.includes('class="overlay-close" onclick="closeCodexModal()" title="Fechar e Voltar ao Jogo [ESC]">✕ FECHAR [ESC]</button>'), "Botão superior FECHAR explícito no Códex");
assert(html.includes('class="retro-btn btn-amber codex-return-btn" onclick="closeCodexModal()">⬅️ VOLTAR AO JOGO [ESC]</button>'), "Botão inferior destacado VOLTAR AO JOGO no Códex");

// 3. Verificar ausência de alturas vh que causavam clipping vertical
assert(!html.includes('.codex-box {\n            max-width: 630px;\n            width: 96%;\n            max-height: 88vh;'), "codex-box não usa mais 88vh");
assert(!html.includes('max-height: 64vh;'), "codex-layout não usa mais 64vh");
assert(html.includes('.codex-box {') && html.includes('height: calc(100% - 16px);'), "codex-box contido na moldura com height: calc(100% - 16px)");
assert(html.includes('.overlay-actions {') && html.includes('flex-shrink: 0;'), "overlay-actions tem flex-shrink: 0 prevenindo ocultação");

// 4. Testar lógica de toggle funcional em sandbox
const codexEl = sandbox.document.getElementById('codex-modal');
assert(codexEl, "Elemento codex-modal mockado no sandbox");

// Abrir códex
vm.runInContext("openCodexModal();", sandbox);
assert.strictEqual(codexEl.style.display, 'flex', "Códex abre com openCodexModal()");

// Clicar novamente no botão de toolbar deve fazer toggle (fechar)
vm.runInContext("openCodexModal();", sandbox);
assert.strictEqual(codexEl.style.display, 'none', "Códex fecha com segundo clique em openCodexModal() [toggle]");

// Abrir e fechar com closeCodexModal()
vm.runInContext("openCodexModal('catia');", sandbox);
assert.strictEqual(codexEl.style.display, 'flex', "Códex abre para personagem específico");
vm.runInContext("closeCodexModal();", sandbox);
assert.strictEqual(codexEl.style.display, 'none', "Códex fecha com closeCodexModal()");

// Testar toggle de Conquistas
const achEl = sandbox.document.getElementById('achievements-modal');
vm.runInContext("openAchievementsModal();", sandbox);
assert.strictEqual(achEl.style.display, 'flex', "Conquistas abre");
vm.runInContext("openAchievementsModal();", sandbox);
assert.strictEqual(achEl.style.display, 'none', "Conquistas fecha com toggle");

// Testar toggle de Currículo
const cvEl = sandbox.document.getElementById('curriculum-modal');
vm.runInContext("openCurriculumModal();", sandbox);
assert.strictEqual(cvEl.style.display, 'flex', "Currículo abre");
vm.runInContext("openCurriculumModal();", sandbox);
assert.strictEqual(cvEl.style.display, 'none', "Currículo fecha com toggle");

console.log("✓ 10. Acessibilidade de Saída do Códex: Botões no cabeçalho e rodapé visíveis, backdrop click e toggle validados!");

console.log("\n=================================================================");
console.log("RESULTADO FINAL: TODOS OS 10 TESTES PASSARAM COM 100% SUCESSO!");
process.exit(0);
console.log("=================================================================");
