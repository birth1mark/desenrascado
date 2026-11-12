# 🎲 Desenrascado — Sobrevivência Urbana em Lisboa (16-bit)

> **Simulador retro de sobrevivência urbana e finanças em Lisboa.**  
> Joga ao vivo em: **[https://desenrascado.pormenores.net](https://desenrascado.pormenores.net)**

---

## 🎮 Sobre o Jogo

**Desenrascado** é um jogo de tabuleiro retro em formato 16-bit, construído de raiz em HTML5 Canvas 2D sem qualquer dependência externa ou motor pesado. 

Passado na selva imobiliária e económica de Lisboa, encarnas um cidadão comum que tenta equilibrar as contas, a sanidade mental e a sobrevivência diária enquanto o implacável **Senhorio** exige rendas astronómicas a cada 7 dias.

### 🌟 Destaques & Mecânicas

- **🎨 Estética Retro 16-bit**:
  - Padrão procedural de **Calçada Portuguesa** ("Mar Largo" do Rossio) pré-renderizado em offscreen canvas para fluidez a 60 FPS.
  - Avatar pixel-art animado com expressões dinâmicas (olhos tontos quando faminto, gota de suor sob stress financeiro, bolhas de pensamento de café).
  - Som chiptune retro sintetizado dinamicamente via **Web Audio API** (passos, moedas, avisos e fanfarras).

- **🗺️ Tabuleiro com 7 Locais Icónicos de Lisboa**:
  1. 🏢 **O Senhorio**: Paga a renda semanal (500 € a 850 €) ou negoceia uma extensão arriscada.
  2. 🍷 **Tasca do Ti Zé**: Bitoque, imperial e conversa de balcão para recuperar sanidade e energia.
  3. 💻 **Startup Hub / Cowork**: Faz freelas de backend e candidata-te a bolsas Web3 para ganhar euros.
  4. 🎓 **Politecnia & Formação**: Tira cursos e certificações para aumentar a tua taxa horária e valor no mercado.
  5. 🛒 **Supermercado de Bairro**: Alimenta-te com latas de atum ou azeite gourmet.
  6. 🏦 **Caixa & Microcrédito**: Pede empréstimos de emergência ou deposita poupanças a render juros.
  7. 🌅 **Miradouro do Tejo**: Apanha sol e contempla o rio para recuperar sanidade a custo zero.

- **📜 Certidão Oficial de Despejo (Instagram / WhatsApp Stories)**:
  - Quando a renda falha e a sanidade chega a zero, o motor gera dinamicamente uma imagem em alta resolução **1080×1920 px (9:16)** formatada como um documento burocrático oficial do *"Ministério do Desenrasque e Despejo Acelerado"*.
  - Inclui selo carimbado, carimbo de chapa, estatísticas reais da partida (dias sobrevividos, bitoques consumidos, rendas pagas) e um roast mordaz gerado processualmente.
  - Integração com a **Web Share API** para partilha direta com um clique em Instagram Stories, WhatsApp Status, X e Telegram.

---

## 🚀 Como Correr Localmente

O jogo é uma Single-Page Application (SPA) 100% autónoma, contida num único ficheiro `index.html`. Não requer `npm install`, nem Node.js, nem build steps.

Basta clonar e abrir no browser:

```bash
git clone https://github.com/birth1mark/desenrascado.git
cd desenrascado

# Abre diretamente no browser:
open index.html # macOS
xdg-open index.html # Linux

# Ou corre um servidor estático local:
python3 -m http.server 8080
```

Navega para `http://localhost:8080`.

---

## 🛠️ Stack Tecnológica

- **Frontend / Rendering**: HTML5 Canvas 2D (com pipeline de offscreen rendering para a calçada e tiles).
- **Áudio**: Web Audio API pura (osciladores synth square/triangle/noise sem ficheiros MP3 externos).
- **Tipografia**: Google Fonts (*Press Start 2P* para elementos arcade + *Plus Jakarta Sans* para clareza em mobile).
- **Social / Sharing**: HTML Canvas Export (`toBlob`) + Web Share API / download direto da certidão.
- **Arquitetura**: Máquina de estados finita determinística (sem frameworks externas, zero overhead).

---

## 👤 Autor

Desenvolvido por **Pedro Ribeiro** ([birth1mark](https://github.com/birth1mark)).  
Portfolio & Engenharia: [pormenores.net](https://pormenores.net)

---

## 📄 Licença

Distribuído sob licença [MIT](LICENSE).
