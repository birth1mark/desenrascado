# O Desenrascado — Diretrizes do Agente & Regras do Projeto

Bem-vindo ao projeto **O Desenrascado — Sobrevivência Urbana em Lisboa (16-bit)**.
Este ficheiro é a fonte da verdade para o desenvolvimento, manutenção e evolução deste projeto. Qualquer agente ou programador que trabalhe neste repositório DEVE seguir rigorosamente estas diretrizes.

---

## 1. Identidade e Repositórios
- **Título**: *O Desenrascado — Sobrevivência Urbana em Lisboa (16-bit)*
- **Repositório Git**: `birth1mark/desenrascado` (`https://github.com/birth1mark/desenrascado.git`)
- **Produção (Live)**: `https://desenrascado.pt/` (via Cloudflare Worker `desenrascado` reverse proxy)
- **Servidor Remoto (Origem WebTuga)**: `webtuga:desenrascado.pormenores.net/`
- **Identidade do Autor**: Manter sempre `birth1mark` (`birth1mark@users.noreply.github.com`). Nunca vazar nomes reais pessoais ou caminhos de diretório privados da máquina de desenvolvimento.

---

## 2. Arquitetura Técnica
- **Zero Dependências Externas**: Single-Page Application (SPA) pura contida em `index.html`. Sem Webpack, sem Vite, sem npm, sem frameworks pesadas.
- **Canvas Resolution**:
  - Resolução virtual interna: **640 x 360** (16:9).
  - Viewport do Tabuleiro (Mundo): **640 x 295** (`assets/board.png`).
  - Viewport da Barra Inferior (HUD/Comandos): **65 px** (`y: 295..360`).
  - Rendering CSS: `image-rendering: pixelated; image-rendering: crisp-edges;`.

---

## 3. Coordenadas e Geografia do Tabuleiro (640x295)
1. **Instituto Superior Técnico (IST)** (`x: 0..148`, escadaria `x: 35..100`):
   - Fachada neoclássica monumental com torre sineira e relógio.
   - Passeio de calçada portuguesa (*mar largo*) sob as escadas (`x: 0..148, y: 196..218`).
   - Termina a `x: 148` com lancil de cantaria e canto arredondado de 90° com moldura de cantaria clara.
   - Candeeiro histórico a `x: 126..134` e canteiro com arbusto verdejante a `x: 115..145, y: 155..190`.
2. **IEFP — Emprego e Formação** (`x: 148..221`):
   - Fachada de azulejos azuis e portas verdes.
   - **Chão Frontal**: Estritamente **empedrado de rua / paralelepípedos** (`x: 148..307, y: 188..218`). **NUNCA** colocar calçada decorativa aqui. O empedrado de rua separa os passeios e mantém a praça cívica aberta.
   - **NPC**: Mariana (recrutadora sénior, 45 anos, loura, experiente e acolhedora).
3. **Banco & Multibanco** (`x: 221..307`):
   - Fachada neoclássica com colunas e ecrã azul de Multibanco.
   - Chão frontal: Empedrado de rua limpo.
4. **Modas Chiado (Pronto a Vestir)** (`x: 307..423`):
   - Toldo às riscas e montras.
   - Passeio direito com calçada portuguesa inicia a `x: 307` com canto arredondado de 90° (`y: 195..218`), espelhando perfeitamente o canto do IST.
5. **Pingo Doce (Supermercado)** (`x: 423..528`):
   - Toldo verde com bancas de caixas de fruta/legumes no passeio (`x: 485..530`).
6. **Tasca Ti Zé** (`x: 528..640`):
   - Esplanada com mesas de madeira e clientes lisboetas (`x: 555..620`).
   - NPC: Ti Zé (taberneiro).
7. **Elétrico 28** (`y: 222..235`):
   - Carro elétrico amarelo tradicional sobre carris de rua.
   - Ao tocar/clicar, toca o sino sintetizado em Web Audio ("plim-plim").
8. **Promenade Ribeirinha & Acampada pela Habitação** (`x: 285..330, y: 237..260`):
   - Situada no murete de cantaria da marginal do rio Tejo.
   - **Regra**: Nunca colocar na rua nem sobre edifícios. NPC: Inês.
9. **Rio Tejo & Margem Sul** (`y: 260..295`):
   - Cacilheiro laranja da Transtejo, veleiro e Ponte 25 de Abril ao pôr-do-sol dourado.

---

## 4. Filosofia Estética LucasArts SCUMM 16-Bit
- **Arte dos Cenários e Calçadas**:
  - Calçada portuguesa com padrão ondulado contínuo (*mar largo*), 3 fitas sinusoidais de basalto e calcário, lancil de cantaria e moldura clara de enquadramento.
  - Nunca cortar as ondas na horizontal na base nem criar costuras verticais.
  - Tons quentes de fim de tarde lisboeta (terracota, âmbar, azul azulejo, verde azeitona).
- **Diálogos e Retratos**:
  - Árvores de diálogo interativas estilo SCUMM com texto flutuante em cores específicas por personagem.
  - Retratos expressivos de 16-bit (`assets/portraits_sheet.png` e `assets/portrait_iefp.png`).
- **Interface Centrada e Estável**:
  - Botões superiores e modais matematicamente centrados na horizontal, mantendo larguras estáveis para evitar saltos visuais ao mudar o texto.

---

## 5. Mecânicas e Sistemas Centrais
- **Estatísticas do Jogador**: `dinheiro` (€), `energia` (0-100), `fome` (0-100), `stress` (0-100), `conhecimento` (0-100), `reputacao` (0-100), `musicSkill` (0-100, perícia musical à guitarra portuguesa).
- **Curriculum do Jogador & Cadeiras do IST**:
  - O jogador matricula-se em cursos no IST (ex: Engenharia Informática).
  - O curso é constituído por cadeiras curriculares individuais (ex: Algoritmos, Arquitetura, Redes).
  - Cada sessão de estudo avança cadeiras específicas até serem concluídas.
  - O jogador pode abrir o seu *Curriculum Vitae* para auditar as cadeiras feitas e por fazer.
- **Trabalho nos Vários Locais**:
  - Todos os locais exceto o IEFP (formação) e a Casa (descanso) oferecem trabalho/biscates adequados à indumentária e nível educativo do jogador.
  - Tocar no Miradouro desenvolve a `musicSkill`, começando muito baixa (caloiro) e exigindo progressão lenta e autêntica de prática regular para evoluir.
- **Renda do Senhorio**:
  - Renda semanal obrigatória (a cada 7 dias).
  - Falha no pagamento e esgotamento da sanidade gera a **Certidão Oficial de Despejo** em alta resolução (1080x1920 px, 9:16) com integração Web Share.

---

## 6. Sistema de Áudio (Web Audio API)
- Efeitos 100% sintetizados em tempo real via osciladores e filtros:
  - Sino do elétrico (FM duplo tom 880/1174 Hz)
  - Moedas e caixa registadora
  - Passos diferenciados (calçada vs paralelepípedos)
  - Guitarra acústica no Miradouro
  - Ambiente do Tejo (ruído rosa passa-baixo)

---

## 7. Protocolo de Versionamento de Assets (Cache-Busting)
Linha ~2240 de `index.html`:
```javascript
const ASSET_VER = '3.4';
```
**REGRA MANDATÓRIA**: Sempre que qualquer asset dentro de `assets/` for editado, deves **incrementar obrigatoriamente** `ASSET_VER` (ex: `'3.4'` -> `'3.5'`).

---

## 8. Protocolo de Deploy e Validação
1. Validar sintaxe JS e JSON-LD antes de qualquer commit:
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
   git commit -am "feat/fix: mensagem clara"
   git push origin main
   ```
3. Deploy para servidor de produção (`webtuga`):
   ```bash
   scp index.html webtuga:desenrascado.pormenores.net/
   scp assets/<ficheiro> webtuga:desenrascado.pormenores.net/assets/
   ```
4. Confirmar live:
   ```bash
   curl -sI "https://desenrascado.pt/assets/board.png?v=${ASSET_VER}"
   ```
