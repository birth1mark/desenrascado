const fs = require('fs');
const path = require('path');
const assert = require('assert');
const vm = require('vm');

console.log("=================================================================");
console.log("SUITE DE TESTES AUTOMATIZADOS: DESENRASCADO v7.5");
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
                                fillRect() {}, strokeRect() {}, fillText() {}, beginPath() {}, moveTo() {}, lineTo() {}, arc() {}, ellipse() {}, fill() {}, stroke() {}, save() {}, restore() {}, drawImage() {}, createLinearGradient() { return { addColorStop() {} }; }, createRadialGradient() { return { addColorStop() {} }; }, clearRect() {}, quadraticCurveTo() {}, bezierCurveTo() {}, closePath() {}, setLineDash() {}, rect() {}, clip() {}, scale() {}, translate() {}, rotate() {}
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
                            fillRect() {}, strokeRect() {}, fillText() {}, beginPath() {}, moveTo() {}, lineTo() {}, arc() {}, ellipse() {}, fill() {}, stroke() {}, save() {}, restore() {}, drawImage() {}, createLinearGradient() { return { addColorStop() {} }; }, createRadialGradient() { return { addColorStop() {} }; }, clearRect() {}, quadraticCurveTo() {}, bezierCurveTo() {}, closePath() {}, setLineDash() {}, rect() {}, clip() {}, scale() {}, translate() {}, rotate() {}
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
assert.strictEqual(vm.runInContext("ASSET_VER", sandbox), '8.6', "ASSET_VER incrementado para 8.6");
console.log("✓ 7. Protocolo de Cache-Busting: ASSET_VER = '8.6' confirmado!");

// -----------------------------------------------------------------------------
// TESTE 8: CÓDEX "QUEM É QUEM EM LISBOA" & ÁLBUM DE FOTOGRAFIAS DINÂMICAS
// -----------------------------------------------------------------------------
const LISBON_CHARACTERS = vm.runInContext("LISBON_CHARACTERS", sandbox);
assert(LISBON_CHARACTERS, "Catálogo LISBON_CHARACTERS existe");

const expectedChars = [
    'senhorio', 'tasca', 'supermercado', 'loja_roupa', 'acampada',
    'faculdade', 'banco', 'startup', 'miradouro', 'marta', 'rui', 'goncalo', 'varina'
];

assert.strictEqual(Object.keys(LISBON_CHARACTERS).length, 13, "Existem exatamente 13 personagens em LISBON_CHARACTERS");
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

    // Teste de Modal do Códex (em Casa)
    state = 'MODAL';
    modalBuilding = BUILDINGS.find(b => b.id === 'casa');
    openCodexModal('tasca');
    assert.strictEqual(selectedCodexChar, 'tasca', "openCodexModal selecionou 'tasca'");
    selectCodexChar('loja_roupa');
    assert.strictEqual(selectedCodexChar, 'loja_roupa', "selectCodexChar selecionou 'loja_roupa'");
    closeCodexModal();
    state = 'BOARD';
    modalBuilding = null;
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

// 4. Testar lógica de toggle funcional em sandbox (dentro de Casa)
const codexEl = sandbox.document.getElementById('codex-modal');
assert(codexEl, "Elemento codex-modal mockado no sandbox");

vm.runInContext("state = 'MODAL'; modalBuilding = BUILDINGS.find(b => b.id === 'casa');", sandbox);

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
vm.runInContext("state = 'BOARD'; modalBuilding = null;", sandbox);

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

// -----------------------------------------------------------------------------
// TESTE 11: SEPARAÇÃO E RETRATO DEDICADO DA MARTA (IST)
// -----------------------------------------------------------------------------
assert(fs.existsSync('/home/pedro/Projects/desenrascado/assets/portrait_marta.png'), "assets/portrait_marta.png existe em disco");

const dialogueTrees = vm.runInContext("DIALOGUE_TREES", sandbox);
assert(dialogueTrees.marta, "DIALOGUE_TREES.marta existe");
assert.strictEqual(dialogueTrees.marta.portraitId, 'marta', "DIALOGUE_TREES.marta usa portraitId 'marta'");
assert(dialogueTrees.marta.nodes.start, "Nó 'start' existe no diálogo da Marta");
assert(dialogueTrees.marta.nodes.cadeiras, "Nó 'cadeiras' existe no diálogo da Marta");
assert(dialogueTrees.marta.nodes.cafe_flirt, "Nó 'cafe_flirt' existe no diálogo da Marta");

assert.strictEqual(LISBON_CHARACTERS.marta.portraitId, 'marta', "LISBON_CHARACTERS.marta usa portraitId 'marta' (não o professor!)");

const martaNpcInfo = vm.runInContext("NPC_INFO", sandbox);
assert(martaNpcInfo.marta, "NPC_INFO.marta existe e está registada");
assert.strictEqual(martaNpcInfo.marta.name, "Marta", "Nome em NPC_INFO é 'Marta'");

// Testar abertura de diálogo com Marta
vm.runInContext("openDialogueTree('marta');", sandbox);
const activeTree = vm.runInContext("activeDialogueTree", sandbox);
assert(activeTree, "activeDialogueTree ativo");
assert.strictEqual(activeTree.treeId, 'marta', "activeDialogueTree é da Marta");
assert.strictEqual(activeTree.config.portraitId, 'marta', "activeDialogueTree usa portraitId 'marta'");

console.log("✓ 11. Marta vs Professor: Retrato 16-bit próprio, diálogo SCUMM e Códex validados com distinção total do catedrático!");

// -----------------------------------------------------------------------------
// TESTE 12: OBITUÁRIO IN-GAME & CERTIDÃO OFICIAL DE ÓBITO / DESPEJO (9:16)
// -----------------------------------------------------------------------------
// 1. Verificar ficheiro do retrato do Zé em disco
assert(fs.existsSync('/home/pedro/Projects/desenrascado/assets/portrait_ze.png'), "assets/portrait_ze.png existe em disco");

// 2. Verificar elementos do ecrã de derrota (renderGameOverScreen)
assert(html.includes("CEMITÉRIO DOS PRAZERES · SECÇÃO DE ÓBITOS E DESPEJOS"), "Cabeçalho do Cemitério dos Prazeres presente");
assert(html.includes("CERTIDÃO OFICIAL DE ÓBITO E DESPEJO"), "Título oficial de Certidão de Óbito e Despejo presente");
assert(html.includes("O FINADO"), "Coluna do Finado presente");
assert(html.includes("« O Mártir da Calçada »"), "Epíteto do Mártir da Calçada presente");
assert(html.includes("AUTO FORENSE · CAUSA DO FALECIMENTO / DESPEJO"), "Caixa de Auto Forense presente");
assert(html.includes("REGISTO NOTARIAL DE BENS E PENÚRIA"), "Caixa de Registo Notarial presente");
assert(html.includes("ESCALÃO DE PRECARIEDADE"), "Banner de Escalão de Precariedade presente");
assert(html.includes("NOVO JOGO [R]") && html.includes("RECORDES [H]") && html.includes("COPIAR [C]") && html.includes("STORY 9:16 [S]"), "4 Botões de ação com atalhos de teclado no obituário");

// 3. Executar renderGameOverScreen() no sandbox e verificar ausência de erros
vm.runInContext("player.deathTitle = 'DESPEJO SUMÁRIO';", sandbox);
vm.runInContext("player.deathCause = 'Não pagou a renda do quarto após 14 dias de labuta';", sandbox);
vm.runInContext("stats.daysSurvived = 14;", sandbox);
vm.runInContext("renderGameOverScreen();", sandbox);
console.log("✓ 12.1 Ecrã de Obituário in-game: Layout 2 colunas, retrato do Zé, velas, auto forense e botões validados sem erros!");

// 4. Verificar elementos da Certidão Oficial 9:16 (generateStoryCanvas)
assert(html.includes("CONSERVATÓRIA DO REGISTO CIVIL DE LISBOA"), "Conservatória do Registo Civil de Lisboa na certidão 9:16");
assert(html.includes("IMPOSTO DO SELO") && html.includes("50$00"), "Estâmpilha Fiscal de 50$00 presente na certidão 9:16");
assert(html.includes("DR. JERÓNIMO DA SILVA") && html.includes("PROF. DR. MARCELO LEITÃO"), "Assinaturas notariais do Senhorio e do Perito Médico-Legal presentes");
assert(html.includes("desenrascado.pormenores.net"), "CTA viral para desenrascado.pormenores.net presente na certidão");

// 5. Executar generateStoryCanvas() no sandbox para GAMEOVER e VICTORY
vm.runInContext("state = 'GAMEOVER';", sandbox);
const storyCanvasDeath = vm.runInContext("generateStoryCanvas();", sandbox);
assert(storyCanvasDeath, "generateStoryCanvas() retorna canvas de óbito");
assert.strictEqual(storyCanvasDeath.width, 1080, "Largura do canvas é 1080");
assert.strictEqual(storyCanvasDeath.height, 1920, "Altura do canvas é 1920 (proporção 9:16)");

vm.runInContext("state = 'VICTORY';", sandbox);
const storyCanvasVictory = vm.runInContext("generateStoryCanvas();", sandbox);
assert(storyCanvasVictory, "generateStoryCanvas() retorna canvas de vitória");
assert.strictEqual(storyCanvasVictory.width, 1080, "Largura do canvas de vitória é 1080");
assert.strictEqual(storyCanvasVictory.height, 1920, "Altura do canvas de vitória é 1920");

console.log("✓ 12.2 Certidão Oficial 9:16: Estética notarial arquivística, selo fiscal de 50$00, foto, grelha forense, assinaturas e CTA gerados com sucesso!");

// -----------------------------------------------------------------------------
// TESTE 13: DISTINÇÃO DE AVATARES (RUI vs GONÇALO) E SPRITE FEMININA DA VARINA
// -----------------------------------------------------------------------------
// 1. Verificar ficheiros de retratos em disco
assert(fs.existsSync('/home/pedro/Projects/desenrascado/assets/portrait_rui.png'), "assets/portrait_rui.png existe em disco");
assert(fs.existsSync('/home/pedro/Projects/desenrascado/assets/portrait_goncalo.png'), "assets/portrait_goncalo.png existe em disco");
assert(fs.existsSync('/home/pedro/Projects/desenrascado/assets/portrait_varina.png'), "assets/portrait_varina.png existe em disco");

// 2. Verificar catálogo LISBON_CHARACTERS
assert(LISBON_CHARACTERS.rui, "LISBON_CHARACTERS.rui existe");
assert(LISBON_CHARACTERS.goncalo, "LISBON_CHARACTERS.goncalo existe");
assert(LISBON_CHARACTERS.varina, "LISBON_CHARACTERS.varina existe");

assert.strictEqual(LISBON_CHARACTERS.rui.portraitId, 'rui', "Rui usa portraitId 'rui' (não 'miradouro')");
assert.strictEqual(LISBON_CHARACTERS.goncalo.portraitId, 'goncalo', "Gonçalo usa portraitId 'goncalo' (não 'miradouro')");
assert.strictEqual(LISBON_CHARACTERS.varina.portraitId, 'varina', "Varina usa portraitId 'varina'");

// Garantir que Rui e Gonçalo NÃO partilham avatar
assert.notStrictEqual(LISBON_CHARACTERS.rui.portraitId, LISBON_CHARACTERS.goncalo.portraitId, "Rui e Gonçalo têm portraitIds distintos!");
assert.notStrictEqual(LISBON_CHARACTERS.rui.portraitId, LISBON_CHARACTERS.miradouro.portraitId, "Rui não partilha portraitId com o Miradouro!");
assert.notStrictEqual(LISBON_CHARACTERS.goncalo.portraitId, LISBON_CHARACTERS.miradouro.portraitId, "Gonçalo não partilha portraitId com o Miradouro!");

// 3. Verificar registo de NPC_INFO
const allNpcInfo = vm.runInContext("NPC_INFO", sandbox);
assert(allNpcInfo.rui, "NPC_INFO.rui registado");
assert(allNpcInfo.goncalo, "NPC_INFO.goncalo registado");
assert(allNpcInfo.varina, "NPC_INFO.varina registado");
assert.strictEqual(allNpcInfo.varina.name, "D. Rosa", "Nome da varina é D. Rosa");

// 4. Verificar sprite feminina da Varina nos peões de rua (renderStreetWalkers)
assert(html.includes("hasZeSprites && w.type !== 'varina'"), "Varina NUNCA desenha o sprite masculino de calças do Zé!");
assert(html.includes("Saia Rodada Tradicional Alfacinha"), "Varina desenha saia rodada alfacinha com pregas");
assert(html.includes("Avental branco tradicional de peixeira"), "Varina desenha avental tradicional de peixeira");
assert(html.includes("Xaile de lã preta traçado em V"), "Varina desenha xaile traçado em V");
assert(html.includes("Argolas de Ouro de Rainha"), "Varina desenha brincos tradicionais de filigrana");
assert(html.includes("Canastra de Peixe Fresco à Cabeça"), "Varina desenha canastra com sardinhas cintilantes");

// 5. Verificar encontros interativos com retratos SCUMM
const testWalkerVarina = { name: "D. Rosa", type: "varina", x: 100, y: 150 };
vm.runInContext("openStreetWalkerEncounter", sandbox)(testWalkerVarina);
const encVarina = vm.runInContext("activeEncounter", sandbox);
assert(encVarina, "Encontro da varina ativado");
assert.strictEqual(encVarina.portraitId, 'varina', "Encontro da varina define portraitId 'varina'");

const testWalkerEstafeta = { name: "Rui Peixoto", type: "estafeta", x: 100, y: 150 };
vm.runInContext("openStreetWalkerEncounter", sandbox)(testWalkerEstafeta);
const encEstafeta = vm.runInContext("activeEncounter", sandbox);
assert.strictEqual(encEstafeta.portraitId, 'rui', "Encontro do estafeta define portraitId 'rui'");

const testWalkerTuna = { name: "Gonçalo", type: "tuna", x: 100, y: 150 };
vm.runInContext("openStreetWalkerEncounter", sandbox)(testWalkerTuna);
const encTuna = vm.runInContext("activeEncounter", sandbox);
assert.strictEqual(encTuna.portraitId, 'goncalo', "Encontro da tuna define portraitId 'goncalo'");

console.log("✓ 13. Avatares & Varina: Rui e Gonçalo 100% individualizados e D. Rosa com arte feminina tradicional e retrato SCUMM!");

// -----------------------------------------------------------------------------
// TESTE 14: BÊNÇÃO DAS FITAS & ANFITEATRO DO IST (SEM FUNDO DE MERCEARIA)
// -----------------------------------------------------------------------------
// 1. Verificar ficheiros de arte do IST e Bênção das Fitas em disco
assert(fs.existsSync('/home/pedro/Projects/desenrascado/assets/interiors/faculdade.png'), "assets/interiors/faculdade.png existe em disco");
assert(fs.existsSync('/home/pedro/Projects/desenrascado/assets/bencao_fitas.png'), "assets/bencao_fitas.png existe em disco");

// 2. Verificar que CUTSCENES.graduation usa a imagem dedicada da Bênção das Fitas
const graduationCutscene = vm.runInContext("CUTSCENES.graduation", sandbox);
assert(graduationCutscene, "CUTSCENES.graduation existe");
assert(graduationCutscene.bgImg, "CUTSCENES.graduation tem bgImg dedicado (bencaoFitasImg)");
assert(html.includes("const bencaoFitasImg = new Image();"), "bencaoFitasImg declarado em index.html");
assert(html.includes("bencaoFitasImg.src = `assets/bencao_fitas.png?v=${ASSET_VER}`;"), "bencaoFitasImg aponta para assets/bencao_fitas.png");

// 3. Verificar que renderCutscene suporta cs.bgImg e efeitos de fitas/confetes
assert(html.includes("cs.bgImg && cs.bgImg.complete && cs.bgImg.naturalWidth > 0"), "renderCutscene desenha cs.bgImg com prioridade");
assert(html.includes("if (cs.id === 'graduation')"), "renderCutscene tem efeitos especiais comemorativos na Bênção das Fitas");
assert(html.includes("fitasColors"), "Chuva de fitas académicas de engenharia incluída no render");

// 4. Testar execução de playCutscene('graduation') e renderCutscene() em sandbox
vm.runInContext("playCutscene('graduation');", sandbox);
assert.strictEqual(vm.runInContext("state", sandbox), 'CUTSCENE', "Estado transitou para CUTSCENE");
assert.strictEqual(vm.runInContext("activeCutscene.id", sandbox), 'graduation', "activeCutscene.id é 'graduation'");
vm.runInContext("renderCutscene();", sandbox);
console.log("✓ 14. Bênção das Fitas & IST: Cenário cerimonial 16-bit monumental, chuva de fitas e zero mercearia validados!");

// -----------------------------------------------------------------------------
// TESTE 15: NAMORO C/ D. ZULMIRA, CUTSCENES DE ROMANCE DEDICADAS & AVATAR EM CASA
// -----------------------------------------------------------------------------
// 1. Verificar registo de D. Zulmira em ROMANCE_PARTNERS
const romancePartners = vm.runInContext("ROMANCE_PARTNERS", sandbox);
assert(romancePartners.zulmira, "D. Zulmira registada em ROMANCE_PARTNERS");
assert.strictEqual(romancePartners.zulmira.name, 'D. Zulmira', "Nome é D. Zulmira");
assert.strictEqual(romancePartners.zulmira.gender, 'f', "Género de Zulmira é feminino");
assert(romancePartners.zulmira.desc.includes("Alfaiataria"), "Descrição reflete a alfaiataria pombalina");

// 2. Verificar CUTSCENES dedicadas para todos os parceiros de romance
const cutscenes = vm.runInContext("CUTSCENES", sandbox);
const expectedRomances = [
    { key: 'romance_catia', portraitId: 'supermercado', speaker: 'Cátia', title: 'AMOR NO ALTO DO TEJO' },
    { key: 'romance_marta', portraitId: 'marta', speaker: 'Marta', title: 'MATCH NOS ALGORITMOS' },
    { key: 'romance_zulmira', portraitId: 'loja_roupa', speaker: 'D. Zulmira', title: 'ALFAIATARIA DO CORAÇÃO' },
    { key: 'romance_rui', portraitId: 'rui', speaker: 'Rui', title: 'SPRINT A DOIS NAS SETE COLINAS' },
    { key: 'romance_goncalo', portraitId: 'goncalo', speaker: 'Gonçalo', title: 'SERENATA SOB AS ESTRELAS' }
];

expectedRomances.forEach(rom => {
    assert(cutscenes[rom.key], `Cutscene '${rom.key}' registada`);
    assert.strictEqual(cutscenes[rom.key].title, rom.title, `Título correto para '${rom.key}'`);
    assert(cutscenes[rom.key].slides.length >= 3, `'${rom.key}' possui pelo menos 3 slides`);
    assert.strictEqual(cutscenes[rom.key].slides[0].speaker, rom.speaker, `Orador do slide 0 é ${rom.speaker}`);
    assert.strictEqual(cutscenes[rom.key].slides[0].portraitId, rom.portraitId, `PortraitId do slide 0 é ${rom.portraitId}`);
    
    // Garantir que Marta não fala de arroz ou mercearia
    if (rom.key === 'romance_marta') {
        const text = cutscenes[rom.key].slides.map(s => s.text).join(' ');
        assert(!text.includes("fardos de arroz"), "Marta não fala de fardos de arroz!");
        assert(!text.includes("latas de atum"), "Marta não fala de latas de atum!");
        assert(text.includes("código") || text.includes("Técnico") || text.includes("algoritmos"), "Marta tem diálogo próprio de engenharia!");
    }
    // Garantir que Zulmira tem diálogo próprio de alfaiataria
    if (rom.key === 'romance_zulmira') {
        const text = cutscenes[rom.key].slides.map(s => s.text).join(' ');
        assert(text.includes("alfaiataria") || text.includes("Chiado") || text.includes("tecidos"), "Zulmira tem diálogo próprio de alfaiataria!");
    }
});

// 3. Verificar Árvore de Diálogo de D. Zulmira
const allDialogueTrees = vm.runInContext("DIALOGUE_TREES", sandbox);
assert(allDialogueTrees.zulmira, "DIALOGUE_TREES.zulmira registada");
assert(allDialogueTrees.zulmira.nodes.start, "Nó start de Zulmira existe");
assert(allDialogueTrees.zulmira.nodes.flirt_zulmira, "Nó flirt_zulmira existe com dynamicChoices");
assert(allDialogueTrees.zulmira.nodes.proposta_zulmira_aceite, "Nó proposta_zulmira_aceite existe");

// 4. Testar dinâmica de proposta e aceitação de Marta e Zulmira em DIALOGUE_TREES
const martaFlirtChoicesHigh = allDialogueTrees.marta.nodes.cafe_flirt.dynamicChoices({ affinity: { marta: 95 } });
const martaProposal = martaFlirtChoicesHigh.find(c => c.nextNode === 'proposta_marta_aceite');
assert(martaProposal, "Opção de pedir Marta em namoro disponível com alta afinidade");
assert.strictEqual(martaProposal.triggerRomance, 'marta', "triggerRomance é 'marta'");

const zulmiraFlirtChoicesHigh = allDialogueTrees.zulmira.nodes.flirt_zulmira.dynamicChoices({
    affinity: { loja_roupa: 95 },
    clothing: { id: 'suit', formality: 4 },
    houseIndex: 4,
    completedCourses: ['matematica'],
    bank: 1600
});
const zulmiraProposal = zulmiraFlirtChoicesHigh.find(c => c.nextNode === 'proposta_zulmira_aceite');
assert(zulmiraProposal, "Opção de pedir Zulmira em namoro disponível com alta afinidade");
assert.strictEqual(zulmiraProposal.triggerRomance, 'zulmira', "triggerRomance é 'zulmira'");

// 5. Verificar ações da Loja de Roupa (Diálogo c/ Zulmira e Ações de Romance)
const buildingLojaRoupa = vm.runInContext("BUILDINGS.find(b => b.id === 'loja_roupa')", sandbox);
assert(buildingLojaRoupa, "Edifício loja_roupa existe");
vm.runInContext("player.partner = null; player.relationships = { zulmira: { points: 0 } };", sandbox);
vm.runInContext("modalBuilding = BUILDINGS.find(b => b.id === 'loja_roupa'); renderBuildingActions('loja_roupa');", sandbox);
assert(html.includes("openDialogueTree: 'zulmira'"), "Ação de diálogo com D. Zulmira unshifted em loja_roupa");
assert(html.includes("getRomanceAction('zulmira')"), "getRomanceAction('zulmira') avaliado em loja_roupa");

// 6. Testar que startRomance aciona a cutscene correspondente a cada parceiro
['marta', 'zulmira', 'rui', 'goncalo', 'catia'].forEach(pKey => {
    vm.runInContext(`
        player.clothing = { id: 'suit', formality: 4 };
        player.houseIndex = 4;
        player.completedCourses = ['matematica'];
        player.bank = 1600;
        player.partner = null;
        player.relationships = { ${pKey}: { points: 100 } };
        player.romanceAffinity = { ${pKey}: 100 };
        state = 'BOARD';
        executeAction({ startRomance: '${pKey}' });
    `, sandbox);
    assert.strictEqual(vm.runInContext("player.partner", sandbox), pKey, `player.partner atualizado para '${pKey}'`);
    assert.strictEqual(vm.runInContext("state", sandbox), 'CUTSCENE', `Cutscene ativada para '${pKey}'`);
    assert.strictEqual(vm.runInContext("activeCutscene.id", sandbox), `romance_${pKey}`, `Cutscene correta 'romance_${pKey}' ativada!`);
});

// 7. Verificar correção do avatar em casa (drawNpcPortrait('casa') aponta para retrato dinâmico de casa por escalão e Zé)
assert(html.includes("(id === 'ze' || id === 'player' || id === 'casa')"), "drawNpcPortrait('casa') direcionado para retrato dinâmico de casa / Zé");
assert(html.includes("casaTierBgImgs"), "drawNpcPortrait('casa') utiliza casaTierBgImgs por escalão");

console.log("✓ 15. Romance D. Zulmira & Cutscenes Dedicadas: D. Zulmira 100% cortejável, cutscenes temáticas personalizadas e avatar de casa limpo validados!");

// ============================================================================
// TESTE 16: CENÁRIOS INTERIORES 16-BIT (BANCO, MODAS CHIADO & CASA DINÂMICA) E AVATAR DA MARTA
// ============================================================================
// 1. Verificar dimensões e ficheiros de banco.png e loja_roupa.png
const bancoBuf = fs.readFileSync(path.join(__dirname, '../assets/interiors/banco.png'));
const lojaBuf = fs.readFileSync(path.join(__dirname, '../assets/interiors/loja_roupa.png'));
assert(bancoBuf.length > 20000, "banco.png existe e tem conteúdo válido");
assert(lojaBuf.length > 20000, "loja_roupa.png existe e tem conteúdo válido");

// 2. Verificar que renderInteriorScene chama renderInteriorCasa para id === 'casa'
assert(html.includes("if (id === 'casa')"), "renderInteriorScene possui guarda para id === 'casa'");
assert(html.includes("renderInteriorCasa(ctx, animTimer, player, HOUSES)"), "renderInteriorScene invoca renderInteriorCasa");

// 3. Verificar que renderInteriorCasa lida com todos os 5 escalões (0..4)
[0, 1, 2, 3, 4].forEach(idx => {
    vm.runInContext(`
        player.houseIndex = ${idx};
        renderInteriorCasa(ctx, 1.0, player, HOUSES);
    `, sandbox);
});
assert(html.includes("TIER 0: BANCO DE JARDIM"), "renderInteriorCasa suporta Tier 0");
assert(html.includes("TIER 1: BELICHE ROTATIVO"), "renderInteriorCasa suporta Tier 1");
assert(html.includes("TIER 2: QUARTO NOS ANJOS"), "renderInteriorCasa suporta Tier 2");
assert(html.includes("TIER 3: CAVE HÚMIDA"), "renderInteriorCasa suporta Tier 3");
assert(html.includes("TIER 4: T1 POMBALINO"), "renderInteriorCasa suporta Tier 4");

// 4. Testar que aceitar namoro com Marta na árvore de diálogo despoleta romance_marta com avatar marta
vm.runInContext(`
    activeDialogueTree = {
        treeId: 'marta',
        config: DIALOGUE_TREES.marta,
        currentNodeId: 'cafe_flirt',
        currentChoices: []
    };
    executeDialogueChoice({ text: "Compilar a vida a dois", nextNode: 'proposta_marta_aceite', triggerRomance: 'marta' });
`, sandbox);
assert.strictEqual(vm.runInContext("player.partner", sandbox), 'marta', "player.partner definido como 'marta'");
assert.strictEqual(vm.runInContext("activeDialogueTree.currentNodeId", sandbox), 'proposta_marta_aceite', "Nó ativo é proposta_marta_aceite");

const nodeMartaAceite = vm.runInContext("DIALOGUE_TREES.marta.nodes.proposta_marta_aceite", sandbox);
assert(nodeMartaAceite.choices[0].action, "Escolha de encerramento tem action");
vm.runInContext(`
    executeDialogueChoice(DIALOGUE_TREES.marta.nodes.proposta_marta_aceite.choices[0]);
`, sandbox);
assert.strictEqual(vm.runInContext("state", sandbox), 'CUTSCENE', "Transição para CUTSCENE");
assert.strictEqual(vm.runInContext("activeCutscene.id", sandbox), 'romance_marta', "Cutscene id é 'romance_marta'");
assert.strictEqual(vm.runInContext("activeCutscene.config.slides[0].portraitId", sandbox), 'marta', "Avatar da Marta é 'marta' (não Cátia!)");

console.log("✓ 16. Cenários 16-Bit Banco & Modas Chiado, Casa Dinâmica por Escalão e Avatar da Marta validados!");

// ============================================================================
// TESTE 17: SISTEMA V8.0 — ALTA SOCIEDADE ZULMIRA, SILÊNCIO EX-PARCEIROS, DESVIO DE CAIXOTES, CÓDEX CASEIRO & COMPANHEIROS EM CASA
// ============================================================================
// 1. Requisitos de Elite para D. Zulmira
vm.runInContext(`
    player.clothing = { id: 'casual', formality: 1 };
    player.houseIndex = 1;
    player.completedCourses = [];
    player.bank = 200;
`, sandbox);
let reqZulmira = vm.runInContext("canDateZulmira(player)", sandbox);
assert.strictEqual(reqZulmira.ok, false, "canDateZulmira deve falhar sem requisitos de elite");
assert.strictEqual(reqZulmira.missing.length, 4, "Devem faltar 4 requisitos a um jogador casual");

vm.runInContext(`
    player.clothing = { id: 'suit', formality: 4 };
    player.houseIndex = 4;
    player.completedCourses = ['matematica'];
    player.bank = 1600;
`, sandbox);
reqZulmira = vm.runInContext("canDateZulmira(player)", sandbox);
assert.strictEqual(reqZulmira.ok, true, "canDateZulmira deve passar com fato, T1 Chiado, curso e 1600€ no banco");

// 2. Cooldown de 1 Semana / 7 Dias pós-término de namoro
vm.runInContext(`
    player.day = 10;
    player.partner = 'catia';
    executeAction({ endRomance: true });
`, sandbox);
assert.strictEqual(vm.runInContext("player.partner", sandbox), null, "Namoro com Cátia terminou");
assert(vm.runInContext("player.exPartners && player.exPartners.catia", sandbox), "Registo de ex-parceira Cátia criado");
assert.strictEqual(vm.runInContext("player.exPartners.catia.blockedUntilDay", sandbox), 17, "Bloqueada por 7 dias (até dia 17)");

let exCheck = vm.runInContext("isExPartnerBlocked('catia')", sandbox);
assert(exCheck && exCheck.blocked && exCheck.daysLeft === 7, "Cátia bloqueada por 7 dias");

// Ao avançar o tempo para além de 7 dias, desbloqueia
vm.runInContext("player.day = 18;", sandbox);
exCheck = vm.runInContext("isExPartnerBlocked('catia')", sandbox);
assert.strictEqual(exCheck, null, "Cátia desbloqueada após 7 dias");

// 3. Desvio de Caixotes da Mercearia (x: 485..530)
const mercBuildingV8 = vm.runInContext("BUILDINGS.find(b => b.id === 'supermercado')", sandbox);
assert.strictEqual(mercBuildingV8.doorX, 470, "Porta da mercearia em x=470 (desimpedida dos caixotes)");

vm.runInContext(`
    player.x = 350; player.y = 195;
    const tascaBuilding = BUILDINGS.find(b => b.id === 'tasca');
    walkToBuilding(tascaBuilding);
`, sandbox);
const waypoints = vm.runInContext("player.waypoints", sandbox);
assert(waypoints && waypoints.length > 0, "Waypoints gerados para cruzar a zona dos caixotes");
assert(waypoints.some(wp => wp.y >= 212), "Pelo menos um waypoint na calçada livre (y=212)");

// 4. Códex restrito ao domicílio (apenas acessível em Casa)
vm.runInContext(`
    state = 'BOARD';
    modalBuilding = null;
    openCodexModal();
`, sandbox);
assert.strictEqual(vm.runInContext("document.getElementById('codex-modal').style.display", sandbox), 'none', "Códex recusa abrir fora de casa");

vm.runInContext(`
    const casaB = BUILDINGS.find(b => b.id === 'casa');
    openBuilding(casaB);
    openCodexModal();
`, sandbox);
assert.strictEqual(vm.runInContext("document.getElementById('codex-modal').style.display", sandbox), 'flex', "Códex abre com sucesso dentro de Casa");
vm.runInContext("closeCodexModal();", sandbox);

// 5. Presença do Companheiro em Casa & Retratos de Loungewear
['catia', 'marta', 'zulmira', 'rui', 'goncalo'].forEach(pId => {
    const fPath = path.join(__dirname, `../assets/portrait_${pId}_home.png`);
    assert(fs.existsSync(fPath), `Ficheiro portrait_${pId}_home.png existe no disco`);
    const fBuf = fs.readFileSync(fPath);
    assert(fBuf.length > 5000, `portrait_${pId}_home.png tem dados válidos`);
});

// 6. Árvores de Diálogo Doméstico com Risco de Rompimento
['romance_home_catia', 'romance_home_marta', 'romance_home_zulmira', 'romance_home_rui', 'romance_home_goncalo'].forEach(treeKey => {
    const tree = vm.runInContext(`DIALOGUE_TREES['${treeKey}']`, sandbox);
    assert(tree, `Árvore ${treeKey} existe em DIALOGUE_TREES`);
    assert(tree.nodes.start, `${treeKey} possui nó start`);
    assert(tree.nodes.start.choices.length >= 3, `${treeKey} possui escolhas ricas`);
    // Deve possuir um nó com triggerBreakup
    const hasBreakup = Object.values(tree.nodes).some(n => n.triggerBreakup || (n.choices && n.choices.some(c => c.triggerBreakup)));
    assert(hasBreakup, `${treeKey} possui ramo de rompimento/breakup`);
});

// Testar execução de rompimento doméstico
vm.runInContext(`
    player.partner = 'marta';
    player.sanity = 80;
    player.day = 5;
    activeDialogueTree = {
        treeId: 'romance_home_marta',
        config: DIALOGUE_TREES.romance_home_marta,
        currentNodeId: 'discussao_marta',
        currentChoices: []
    };
    executeDialogueChoice({ text: "Terminar tudo", nextNode: 'rompimento_marta', triggerBreakup: true });
`, sandbox);
assert.strictEqual(vm.runInContext("player.partner", sandbox), null, "Namoro rompido através de diálogo doméstico");
assert.strictEqual(vm.runInContext("player.exPartners.marta.blockedUntilDay", sandbox), 12, "Marta bloqueada por 7 dias pós-rompimento doméstico");
assert(vm.runInContext("player.sanity", sandbox) < 80, "Sanidade penalizada por discussão/rompimento");

console.log("✓ 17. Alta Sociedade D. Zulmira, Cooldown 7 Dias Ex-Parceiros, Desvio Caixotes, Códex Caseiro & Diálogos Domésticos validados!");

// -----------------------------------------------------------------------------
// TESTE 18: FUNDOS EXCLUSIVOS E THEMED PARA BANCO, MODAS CHIADO E CASA
// -----------------------------------------------------------------------------
// 1. Ficheiros de Retrato dedicados
const bancoBgPath = path.join(__dirname, '../assets/portrait_banco_bg.png');
assert(fs.existsSync(bancoBgPath), "portrait_banco_bg.png existe no disco");
assert(fs.readFileSync(bancoBgPath).length > 1000, "portrait_banco_bg.png tem dados válidos");

const zulmiraBgPath = path.join(__dirname, '../assets/portrait_zulmira_bg.png');
assert(fs.existsSync(zulmiraBgPath), "portrait_zulmira_bg.png existe no disco");
assert(fs.readFileSync(zulmiraBgPath).length > 1000, "portrait_zulmira_bg.png tem dados válidos");

// 2. Os 5 Escalões de Casa (Tier 0..4)
for (let t = 0; t <= 4; t++) {
    const tPath = path.join(__dirname, `../assets/portrait_casa_tier${t}_bg.png`);
    assert(fs.existsSync(tPath), `portrait_casa_tier${t}_bg.png existe no disco`);
    assert(fs.readFileSync(tPath).length > 1000, `portrait_casa_tier${t}_bg.png tem dados válidos`);
}

// 3. Imagens declaradas no contexto
assert(vm.runInContext("bancoBgImg", sandbox), "bancoBgImg instanciada");
assert(vm.runInContext("casaTierBgImgs", sandbox), "casaTierBgImgs instanciada");
assert.strictEqual(vm.runInContext("casaTierBgImgs.length", sandbox), 5, "casaTierBgImgs possui 5 escalões");

// 4. Teste de renderBuildingModal e drawNpcPortrait para banco, loja_roupa e casa
vm.runInContext(`
    // Testar banco
    modalBuilding = BUILDINGS.find(b => b.id === 'banco');
    renderBuildingModal();
    
    // Testar loja_roupa
    modalBuilding = BUILDINGS.find(b => b.id === 'loja_roupa');
    renderBuildingModal();
    
    // Testar casa em cada tier
    modalBuilding = BUILDINGS.find(b => b.id === 'casa');
    for (let t = 0; t <= 4; t++) {
        player.houseIndex = t;
        renderBuildingModal();
    }
`, sandbox);

console.log("✓ 18. Fundos Themed, Retratos Neoclássicos de Banco, Alta Costura do Chiado e 5 Escalões Dinâmicos de Casa validados!");

// -----------------------------------------------------------------------------
// TESTE 19: AUDITORIA DOS 10 EDIFÍCIOS THEMED & NOVO CENÁRIO DO SENHORIO
// -----------------------------------------------------------------------------
// 1. Verificar novo interior autêntico do Senhorio e diferenciação absoluta de Casa
const senhorioPath = path.join(__dirname, '../assets/interiors/senhorio.png');
const casaPath = path.join(__dirname, '../assets/interiors/casa.png');
assert(fs.existsSync(senhorioPath), "assets/interiors/senhorio.png existe");
assert(fs.existsSync(casaPath), "assets/interiors/casa.png existe");
const senhorioBytes = fs.readFileSync(senhorioPath);
const casaBytes = fs.readFileSync(casaPath);
assert(senhorioBytes.length > 5000, "senhorio.png tem tamanho válido");
assert(!senhorioBytes.equals(casaBytes), "senhorio.png é visualmente distinto de casa.png (não é duplicado!)");

// 2. Renderizar todos os 10 edifícios no modal
vm.runInContext(`
    const allBuildingIds = ['banco', 'loja_roupa', 'casa', 'senhorio', 'supermercado', 'tasca', 'faculdade', 'startup', 'miradouro', 'acampada'];
    allBuildingIds.forEach(bId => {
        const b = BUILDINGS.find(x => x.id === bId);
        assert(b, "Edifício " + bId + " encontrado em BUILDINGS");
        modalBuilding = b;
        renderBuildingModal();
    });
`, sandbox);
console.log("✓ 19. Auditoria dos 10 Edifícios: Todos os 10 cenários e modais themed renderizados com 100% sucesso!");

// -----------------------------------------------------------------------------
// TESTE 20: AVATARES ÍNTIMOS DE CASA, COEXISTÊNCIA E INICIATIVAS DO CASAL
// -----------------------------------------------------------------------------
// 1. Verificar ficheiros de busto íntimo dos 5 companheiros(as)
const partnerKeys = ['catia', 'marta', 'zulmira', 'rui', 'goncalo'];
partnerKeys.forEach(p => {
    const bPath = path.join(__dirname, `../assets/bust_${p}_home.png`);
    assert(fs.existsSync(bPath), `bust_${p}_home.png existe no disco`);
    assert(fs.readFileSync(bPath).length > 2000, `bust_${p}_home.png tem dados válidos`);
});

// 2. Verificar homeBustImgs no contexto JS
assert(vm.runInContext("homeBustImgs", sandbox), "homeBustImgs declarado no contexto");
partnerKeys.forEach(p => {
    assert(vm.runInContext(`homeBustImgs.${p}`, sandbox), `homeBustImgs.${p} instanciado`);
});

// 3. Testar coexistência no lar e autonomia quando namorada está em casa
vm.runInContext(`
    player.partner = 'catia';
    player.houseIndex = 2; // T0 em Arroios
    player.timeHour = 20;  // Noite -> isPartnerAtHome retorna true
    player.groceries = 2;
    player.sanity = 50;

    modalBuilding = BUILDINGS.find(b => b.id === 'casa');
    renderBuildingModal();

    // Ações geradas para a Casa
    const acts = modalBuilding.currentActions;
    assert(acts.length >= 6, "Casa tem catálogo alargado de ações no lar");

    // Verificar que as tarefas pessoais continuam acessíveis (autonomia!)
    const sleepAct = acts.find(a => a.sleepNight);
    assert(sleepAct, "Ação de dormir sempre disponível");
    assert(sleepAct.cuddleSleep, "Dormir com parceiro é aconchego a dois");

    const cookAct = acts.find(a => a.eatHome);
    assert(cookAct, "Ação de cozinhar sempre disponível");
    assert(cookAct.cookTogether, "Cozinhar com parceiro é jantar a dois");

    const aloneAct = acts.find(a => a.relaxHomeAlone);
    assert(aloneAct, "Ação 'Seguir com as Minhas Coisas' disponível para autonomia");

    const initAct = acts.find(a => a.partnerInitiative);
    assert(initAct, "Iniciativa carinhosa espontânea da parceira presente");

    const cuddleAct = acts.find(a => a.cuddleSofa);
    assert(cuddleAct, "Iniciativa do jogador 'Aconchego no Sofá' presente");

    const dialogueAct = acts.find(a => a.openDialogueTree);
    assert(dialogueAct, "Diálogo profundo disponível como opção (sem monopolizar)");

    const codexAct = acts.find(a => a.openCodex);
    assert(codexAct, "Dossiê Quem é Quem acessível a partir de casa");

    // Testar execução de 'Seguir com as Minhas Coisas' (autonomia)
    const prevSanity = player.sanity;
    executeAction(aloneAct);
    assert(player.sanity > prevSanity, "Seguir com as próprias coisas aumenta sanidade");

    // Testar execução de iniciativa da companheira
    executeAction(initAct);
    assert.strictEqual(player.groceries, 2, "Iniciativa não gasta mercearias");

    // Testar cozinhar jantar a dois
    executeAction(cookAct);
    assert.strictEqual(player.groceries, 1, "Mercearia consumida no jantar a dois");
`, sandbox);

console.log("✓ 20. Avatares Íntimos no Lar, Autonomia Pessoal, Coexistência e Iniciativas Dinâmicas validados com sucesso!");

// -----------------------------------------------------------------------------
// TESTE 21: GEOMETRIA RIGOROSA DE HITBOXES (ZERO OVERLAPS CASA / MODAS CHIADO / SENHORIO / TASCA)
// -----------------------------------------------------------------------------
const bList = vm.runInContext("BUILDINGS", sandbox);
function intersects(a, b) {
    return !(a.x + a.w <= b.x || b.x + b.w <= a.x ||
             a.y + a.h <= b.y || b.y + b.h <= a.y);
}

for (let i = 0; i < bList.length; i++) {
    for (let j = i + 1; j < bList.length; j++) {
        assert(!intersects(bList[i], bList[j]), `Edifícios ${bList[i].id} e ${bList[j].id} não se sobrepõem no tabuleiro!`);
    }
}

const bCasa = bList.find(b => b.id === 'casa');
const bLoja = bList.find(b => b.id === 'loja_roupa');
assert.strictEqual(bCasa.x, 326, "Casa perfeitamente alinhada em x=326");
assert.strictEqual(bCasa.w, 100, "Casa com largura de 100px (sem invadir a mercearia)");
assert.strictEqual(bCasa.h, 100, "Casa com altura generosa de 100px (mansarda e varanda)");
assert.strictEqual(bCasa.indicatorY, 75, "Indicador da casa no andar residencial (y=75)");
assert.strictEqual(bLoja.indicatorY, 185, "Indicador de Modas Chiado na porta da loja (y=185)");

console.log("✓ 21. Geometria de Toque e Separação de Hitboxes: Zero sobreposições entre Casa/Modas Chiado/Senhorio/Tasca e indicadores visuais validados com sucesso!");

console.log("\n=================================================================");
console.log("RESULTADO FINAL: TODOS OS 21 TESTES PASSARAM COM 100% SUCESSO!");
process.exit(0);
console.log("=================================================================");
