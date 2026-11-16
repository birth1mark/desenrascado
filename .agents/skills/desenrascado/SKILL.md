---
name: desenrascado
description: >-
  Complete architecture, game mechanics, LucasArts 16-bit pixel art guidelines, world coordinates,
  asset cache-busting, and deployment protocols for O Desenrascado (Sobrevivência Urbana em Lisboa em 16-bit).
  Use whenever developing, modifying, styling, balancing, or deploying the Desenrascado retro RPG adventure.
---

# O Desenrascado — Manual de Engenharia e Desenvolvimento

## 1. Visão Geral do Projeto
- **Título**: *O Desenrascado — Sobrevivência Urbana em Lisboa (16-bit)*
- **Conceito**: Simulador retro de sobrevivência urbana, carreira e finanças em Lisboa, com estética de aventura gráfica 16-bit LucasArts SCUMM (ao estilo de *Monkey Island 2*, *Fate of Atlantis* e *Day of the Tentacle*).
- **Repositório Git**: `birth1mark/desenrascado` (`https://github.com/birth1mark/desenrascado.git`)
- **URL em Produção**: `https://desenrascado.pormenores.net/`
- **Servidor Remoto**: Host SSH `webtuga` (`webtuga:desenrascado.pormenores.net/`)
- **Identidade do Autor**: Manter sempre `birth1mark` (`birth1mark@users.noreply.github.com`) em commits, pull requests, comentários e documentação pública. Nunca divulgar nomes reais ou dados locais privados da máquina.

---

## 2. Arquitetura Técnica e Stack
- **Zero-Dependency SPA**: Jogo 100% contido em `index.html` (HTML5 Canvas 2D + Web Audio API). Não requer Node.js, `npm install`, nem passos de compilação.
- **Resoluções e Viewports**:
  - **Canvas Virtual**: `640 x 360` px (proporção 16:9).
  - **Mundo de Jogo (Tabuleiro)**: `640 x 295` px (`assets/board.png`).
  - **Barra de HUD e Ações**: 65 px inferiores (`y: 295..360`).
  - **Rendering**: `image-rendering: pixelated; image-rendering: crisp-edges;` para preservar pixel art perfeito em ecrãs Retina e 4K.

---

## 3. Geografia do Mundo e Coordenadas do Tabuleiro (640x295)
O tabuleiro é contínuo e dividido nos seguintes marcos lisboetas de este a oeste:

1. **Instituto Superior Técnico (IST)** (`x: 0..148`, fachada e escadaria `x: 35..100`):
   - Fachada neoclássica com torre sineira, colunas, relógio e escadaria de pedra monumental.
   - Passeio com calçada portuguesa ondulada (*mar largo*) sob a escadaria (`x: 0..148, y: 196..218`).
   - O passeio termina a `x: 148` com lancil de cantaria e canto arredondado de 90° com moldura de cantaria clara.
   - Candeeiro histórico em ferro fundido verde e lanterna dourada a `x: 126..134`.
   - Arbusto verdejante em canteiro de pedra atrás do candeeiro a `x: 115..145, y: 155..190`.

2. **IEFP — Instituto de Emprego e Formação Profissional** (`x: 148..221`):
   - Fachada tradicional com azulejos azuis e portas verdes.
   - **Regra do Pavimento**: À frente do IEFP e do Banco (`x: 148..307, y: 188..218`) é estritamente **empedrado de rua / paralelepípedos** de Lisboa. **NUNCA** colocar calçada decorativa aqui. A rua separa os dois passeios elevados e deixa as entradas amplamente desimpedidas.
   - **NPC**: Mariana (recrutadora sénior do IEFP, 45 anos, loura, experiente e profissional).
   - Ações: Inscrição em cursos de reconversão profissional, estágios IEFP e subsídios.

3. **Banco & Multibanco (ATM)** (`x: 221..307`):
   - Fachada neoclássica com colunas e terminal Multibanco iluminado a azul.
   - Pavimento frontal: Empedrado de rua limpo.
   - Ações: Microcréditos de emergência, depósitos a prazo a render juros e pagamento de dívidas.

4. **Modas Chiado (Pronto a Vestir)** (`x: 307..423`):
   - Loja tradicional de vestuário com toldo às riscas bordô/bege e montra iluminada.
   - O passeio direito elevado com calçada portuguesa inicia a `x: 307` com lancil arredondado de 90° (`y: 195..218`), espelhando perfeitamente o canto do IST (`x: 148`).
   - Ações: Compra de indumentárias (fato executivo, hoodie tech startup, casual de rua) que alteram a Reputação e o sucesso em entrevistas de emprego.

5. **Pingo Doce (Supermercado de Bairro)** (`x: 423..528`):
   - Toldo verde vivo, montra de mercearia e caixas de fruta/legumes no passeio (`x: 485..530`).
   - Ações: Comprar bens essenciais (latas de atum, maçãs, azeite virgem, pão fresco) para combater a fome e recuperar energia.

6. **Tasca Ti Zé** (`x: 528..640`):
   - Taberna típica com fachada de madeira, esplanada exterior com mesas de madeira e clientes a conviver (`x: 555..620`).
   - **NPC**: Ti Zé (taberneiro carismático de bigode e avental).
   - Ações: Bitoque com ovo a cavalo, imperial fresca, café curto e conversa de balcão para recuperar sanidade mental e energia.

7. **Elétrico 28** (`y: 222..235`):
   - Carro elétrico amarelo tradicional que circula nos carris da calçada de paralelepípedos.
   - Tocar/clicar no elétrico aciona o sino característico ("plim-plim") sintetizado em Web Audio API.

8. **Promenade Ribeirinha & Acampada pela Habitação** (`x: 285..330, y: 237..260`):
   - Tendas e faixas de protesto ("CASA P/ TODOS") situadas estritamente no murete da promenade junto ao rio Tejo.
   - **Regra Crítica**: Nunca colocar a acampada na rua ou em cima do IEFP/Banco. Deve ficar na promenade marginal junto à água sem obstruir edifícios ou caminhos pedonais.
   - **NPC**: Inês (ativista do movimento pelo direito à habitação).

9. **Rio Tejo & Frente Ribeirinha** (`y: 260..295`):
   - Cacilheiro laranja da Transtejo a navegar no Tejo, veleiro tradicional e Ponte 25 de Abril emoldurados pelo pôr-do-sol de Lisboa.

---

## 4. Diretrizes Estéticas e Filosofia LucasArts 16-Bit
1. **Calçada Portuguesa ("Mar Largo")**:
   - Padrão ondulado sinusoidal de 3 fitas contínuas em basalto negro e calcário creme/bege.
   - Deve ser harmoniosa, com ritmo e altura idênticos em ambos os passeios (IST e Chiado/Pingo/Tasca).
   - NUNCA cortar as ondas horizontalmente na base nem deixar costuras verticais.
   - Enquadrada por moldura de cantaria clara e lancil de pedra com chanfro de luz e sombra de contacto.
2. **Diálogos e NPCs**:
   - Diálogos interativos em árvore SCUMM, com texto flutuante em cores associadas a cada personagem (estilo LucasArts).
   - Retratos 16-bit expressivos (`assets/portraits_sheet.png` e `assets/portrait_iefp.png`).
3. **Interface e Botões**:
   - Todos os botões superiores, modais e caixas de diálogo devem estar matematicamente centrados na horizontal.
   - Os botões mantêm largura/estabilidade visual para não saltarem quando o texto interno é atualizado.

---

## 5. Sistemas de Jogo e Mecânicas
- **Atributos do Jogador**:
  - `dinheiro` (€): Saldo em carteira.
  - `energia` (0..100): Gasta com trabalho e estudo; recuperada dormindo em Casa ou na Tasca.
  - `fome` (0..100): Sobe com o tempo; saciada no Pingo Doce ou Tasca.
  - `stress` (0..100): Sobe com falta de dinheiro e trabalho; aliviado no Miradouro, dormir ou imperial na Tasca.
  - `conhecimento` (0..100): Nível académico/técnico.
  - `reputacao` (0..100): Credibilidade profissional, influenciada por roupas e projetos entregues.
  - `aptidaoMusical` (0..100): Habilidade musical desenvolvida praticando no Miradouro (inicia muito baixa e sobe progressivamente com a prática).
- **Curriculum do Jogador & Cadeiras do IST**:
  - Ao matricular-se num curso no IST (ex: Engenharia Informática), o curso é composto por cadeiras curriculares individuais (ex: Algoritmos, Arquitetura de Sistemas, Redes).
  - Cada sessão de estudo avança o progresso de cadeiras específicas.
  - O jogador pode consultar o seu *Curriculum Vitae* para ver cadeiras concluídas e pendentes.
  - O diploma só é outorgado quando todas as cadeiras do plano forem concluídas.
- **Trabalho nos Vários Locais**:
  - Todos os estabelecimentos comerciais e culturais (Tasca, Supermercado, Startup Hub, Banco, Modas Chiado, tocar no Miradouro) oferecem trabalhos/gigs adaptados às qualificações e indumentária.
  - Exceções: IEFP (centro de formação e estágios) e Casa (descanso).
- **Ciclo Semanal do Senhorio**:
  - A renda vence a cada 7 dias de jogo.
  - A falha no pagamento e esgotamento da sanidade gera uma **Certidão Oficial de Despejo** em alta resolução (1080x1920 px, 9:16) com carimbo do ministério, estatísticas da partida e integração direta com Web Share API.

---

## 6. Sistema de Áudio (Web Audio API)
- 100% sintetizado procedimentalmente (sem ficheiros de áudio externos):
  - Sino do Elétrico 28: Tom duplo metálico em FM (880 Hz / 1174 Hz).
  - Caixa registadora / moedas: Varrimento rápido de frequências agudas.
  - Passos: Ruído filtrado dinamicamente consoante o chão (paralelepípedo vs calçada).
  - Cordas de guitarra no Miradouro: Arpeggios harmónicos filtrados.
  - Água do Tejo: Ruído rosa com filtro passa-baixo.

---

## 7. Protocolo de Cache-Busting e Versionamento de Assets
Na linha ~2240 de `index.html` reside a constante:
```javascript
const ASSET_VER = '3.4';
```
**REGRA MANDATÓRIA**: Sempre que qualquer ficheiro em `assets/` for alterado (`board.png`, spritesheet, interiores, portraits), deves **incrementar obrigatoriamente** `ASSET_VER` (ex: `'3.4'` -> `'3.5'`). Isto força os browsers e a CDN do LiteSpeed a descarregarem imediatamente a versão nova.

---

## 8. Protocolo de Verificação e Deploy
Antes de publicar:
1. Validar sintaxe JavaScript e JSON-LD:
   ```bash
   node -e "
   const fs = require('fs');
   const html = fs.readFileSync('index.html', 'utf8');
   new Function(html.match(/<script(?![^>]*ld\+json)[^>]*>([\s\S]*?)<\/script>/i)[1]);
   console.log('JS Válido!');
   "
   ```
2. Commit e push:
   ```bash
   git commit -am "tipo(escopo): mensagem descritiva"
   git push origin main
   ```
3. Deploy para servidor de produção (`webtuga`):
   ```bash
   scp index.html webtuga:desenrascado.pormenores.net/
   scp assets/board.png webtuga:desenrascado.pormenores.net/assets/
   ```
4. Verificação live com `curl`:
   ```bash
   curl -sI "https://desenrascado.pormenores.net/assets/board.png?v=${ASSET_VER}"
   ```
