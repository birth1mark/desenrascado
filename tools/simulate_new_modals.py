import os
import numpy as np
from PIL import Image, ImageDraw, ImageFont

art_dir = "/tmp/desenrascado_preview"
assets_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "assets"))

# Load interior images
banco_int = Image.open(f'{assets_dir}/interiors/banco.png').convert('RGBA')
loja_int = Image.open(f'{assets_dir}/interiors/loja_roupa.png').convert('RGBA')

# For casa, load tier 0 and tier 4 portrait bg as background base or procedural
tier0_bg = Image.open(f'{assets_dir}/portrait_casa_tier0_bg.png').resize((640, 295), Image.NEAREST).convert('RGBA')
tier4_bg = Image.open(f'{assets_dir}/portrait_casa_tier4_bg.png').resize((640, 295), Image.NEAREST).convert('RGBA')

# Busts & portrait backgrounds
bust_sheet = Image.open(f'{assets_dir}/portraits_bust_sheet.png')
alcoviteiro_bust = bust_sheet.crop((0, 128, 128, 256))
zulmira_bust = Image.open(f'{assets_dir}/portrait_zulmira_bust.png')
ze_bust = bust_sheet.crop((384, 128, 512, 256))

banco_port_bg = Image.open(f'{assets_dir}/portrait_banco_bg.png').convert('RGBA')
zulmira_port_bg = Image.open(f'{assets_dir}/portrait_zulmira_bg.png').convert('RGBA')

test_configs = [
    {
        'id': 'banco',
        'name': 'CAIXA / BANCO — BANCA & CRÉDITO',
        'interior': banco_int,
        'port_bg': banco_port_bg,
        'bust': alcoviteiro_bust,
        'npc_name': 'Dr. Alcoviteiro',
        'npc_role': 'Diretor de Agência Bancária',
        'quote': '«No meu banco, cada cêntimo rende com rigor pombalino. Quer depositar ou contrair crédito?»',
        'box_bg': (15, 23, 42, int(255 * 0.58)),
        'border': (250, 204, 21, 255),
        'accent': (250, 204, 21, 255),
        'header_bg': (133, 77, 14, 255),
        'actions': [
            ("💬 Falar c/ Dr. Alcoviteiro", "Conversa sobre crédito, finanças e segredos bancários."),
            ("Microcrédito de Emergência (+50€)", "Juros diários de 5%. Resolve aflições imediatas."),
            ("Depósito a Prazo (Poupança)", "Aplica o teu capital a render 2% ao dia."),
            ("Pagar Dívidas Bancárias", "Liquida empréstimos para evitar penhoras judiciais.")
        ]
    },
    {
        'id': 'loja_roupa',
        'name': 'MODAS CHIADO — ALFAIATARIA TRADICIONAL',
        'interior': loja_int,
        'port_bg': zulmira_port_bg,
        'bust': zulmira_bust,
        'npc_name': 'D. Zulmira',
        'npc_role': 'Mestre Alfaiate do Chiado',
        'quote': '«Entra, meu querido! Uma indumentária bem cortada abre portas até na Assembleia...»',
        'box_bg': (32, 10, 22, int(255 * 0.58)),
        'border': (219, 39, 119, 255),
        'accent': (244, 114, 182, 255),
        'header_bg': (131, 24, 67, 255),
        'actions': [
            ("💬 Conversar c/ D. Zulmira", "Segredos da alta costura, bisbilhotices do Chiado e cortejo."),
            ("Fato Executivo à Medida (180€)", "Corte impecável para entrevistas de topo e alta sociedade."),
            ("Hoodie Tech Startup (45€)", "Estilo informal para programadores e estágios IEFP."),
            ("Remendar Fato (Agulha & Linha)", "Repara a durabilidade da indumentária atual.")
        ]
    },
    {
        'id': 'casa_t0',
        'name': 'O TEU TETO — BANCO DE JARDIM NO ROSSIO',
        'interior': tier0_bg,
        'port_bg': Image.open(f'{assets_dir}/portrait_casa_tier0_bg.png').convert('RGBA'),
        'bust': ze_bust,
        'npc_name': 'Zé Desenrasca',
        'npc_role': 'Ao Relento · Lisboa Noturna',
        'quote': '«O banco de jardim é duro e o relento gela os ossos, mas as estrelas de Lisboa são minhas.»',
        'box_bg': (2, 6, 23, int(255 * 0.58)),
        'border': (100, 116, 139, 255),
        'accent': (56, 189, 248, 255),
        'header_bg': (30, 41, 59, 255),
        'actions': [
            ("Dormitar no Banco", "Descanso leve ao relento. +5 Sanidade."),
            ("Comer Atum de Conserva", "Latas na despensa. +45 Nutrição."),
            ("Passar Noite no Rossio", "Passa a noite ao relento até à manhã seguinte."),
            ("📖 Dossiê: Quem é Quem", "Consultar o códex de contactos e reputação.")
        ]
    },
    {
        'id': 'casa_t4',
        'name': 'O TEU TETO — T1 POMBALINO NO CHIADO (PALACETE)',
        'interior': tier4_bg,
        'port_bg': Image.open(f'{assets_dir}/portrait_casa_tier4_bg.png').convert('RGBA'),
        'bust': ze_bust,
        'npc_name': 'Zé Desenrasca',
        'npc_role': 'Aristocrata Urbano · Vista Tejo',
        'quote': '«Do Rossio ao Chiado, a vista sobre o Tejo compensou cada imperial e cada cadeira no Técnico.»',
        'box_bg': (34, 26, 14, int(255 * 0.58)),
        'border': (234, 179, 8, 255),
        'accent': (250, 204, 21, 255),
        'header_bg': (133, 77, 14, 255),
        'actions': [
            ("Sesta Reparadora no Sofá", "Descanso de luxo no Chiado. +35 Sanidade."),
            ("Jantar Gourmet na Varanda", "Refeição requintada com vista para o Tejo. +60 Nutrição."),
            ("Dormir até ao Meio-Dia", "Dormir profundamente e recuperar todas as energias."),
            ("📖 Dossiê: Quem é Quem", "Consultar o códex de contactos e reputação.")
        ]
    }
]

for cfg in test_configs:
    canv = Image.new('RGBA', (640, 360), (10, 15, 25, 255))
    
    # 1. Background interior
    canv.paste(cfg['interior'], (0, 0))
    
    # HUD placeholder
    hud = Image.new('RGBA', (640, 65), (15, 23, 42, 255))
    h_draw = ImageDraw.Draw(hud)
    h_draw.line([(0, 0), (640, 0)], fill=(51, 65, 85, 255), width=2)
    h_draw.text((20, 20), "BARRA DE HUD E AÇÕES INFERIORES (y: 295..360)", fill=(148, 163, 184))
    canv.paste(hud, (0, 295))
    
    # 2. Vignette (0.20 instead of 0.32)
    vignette = Image.new('RGBA', (640, 295), (0, 0, 0, int(255 * 0.20)))
    canv = Image.alpha_composite(canv, Image.new('RGBA', (640, 360), (0,0,0,0)))
    canv.paste(vignette, (0, 0), vignette)
    
    # 3. Modal container
    mx, my, mw, mh = 40, 10, 560, 275
    modal_layer = Image.new('RGBA', (640, 360), (0, 0, 0, 0))
    m_draw = ImageDraw.Draw(modal_layer)
    
    # Container box with themed translucency
    m_draw.rectangle([mx, my, mx+mw, my+mh], fill=cfg['box_bg'], outline=cfg['border'], width=2)
    
    # Decorative corner brackets
    for cx, cy in [(mx, my), (mx+mw, my), (mx, my+mh), (mx+mw, my+mh)]:
        m_draw.rectangle([cx-3, cy-3, cx+3, cy+3], fill=cfg['accent'])
        
    # Header bar
    m_draw.rectangle([mx, my, mx+mw, my+32], fill=cfg['header_bg'])
    m_draw.line([(mx, my+32), (mx+mw, my+32)], fill=cfg['accent'], width=1)
    
    # Tape measure dashed trim for Modas Chiado!
    if cfg['id'] == 'loja_roupa':
        for tx in range(mx+4, mx+mw-4, 8):
            m_draw.line([(tx, my+31), (tx+4, my+31)], fill=(254, 240, 138, 255), width=2)
            m_draw.line([(tx, my+mh-1), (tx+4, my+mh-1)], fill=(254, 240, 138, 255), width=2)
            
    # Header text
    m_draw.text((mx + 14, my + 10), cfg['name'], fill=(255, 255, 255))
    m_draw.text((mx + mw - 24, my + 8), "✕", fill=(239, 68, 68))
    
    # Left column: portrait (px=54, py=48, size=100)
    px, py, psize = mx + 14, my + 38, 100
    m_draw.rectangle([px-2, py-2, px+psize+2, py+psize+2], fill=(9, 13, 22, 255), outline=cfg['accent'], width=1)
    
    # Composite portrait
    port_comp = Image.alpha_composite(cfg['port_bg'].resize((psize, psize), Image.NEAREST), cfg['bust'].resize((psize, psize), Image.NEAREST))
    modal_layer.paste(port_comp, (px, py))
    
    # NPC name & role
    m_draw.text((px + 4, py + psize + 6), cfg['npc_name'], fill=(255, 255, 255))
    m_draw.text((px + 4, py + psize + 18), cfg['npc_role'], fill=(148, 163, 184))
    
    # Quote box
    qy, qw, qh = py + psize + 30, psize + 16, 76
    m_draw.rectangle([px - 4, qy, px - 4 + qw, qy + qh], fill=(9, 13, 22, int(255 * 0.70)), outline=(51, 65, 85, 255))
    m_draw.text((px + 2, qy + 6), cfg['quote'][:40], fill=(203, 213, 225))
    m_draw.text((px + 2, qy + 20), cfg['quote'][40:80], fill=(203, 213, 225))
    m_draw.text((px + 2, qy + 34), cfg['quote'][80:120], fill=(203, 213, 225))
    
    # Right column: action cards
    ax, aw = mx + 138, mw - 152
    cardH, cardGap = 41, 5
    startY = my + 38
    
    for idx, (label, desc) in enumerate(cfg['actions']):
        ay = startY + idx * (cardH + cardGap)
        # Translucent card background
        m_draw.rectangle([ax, ay, ax + aw, ay + cardH], fill=(15, 23, 42, int(255 * 0.65)), outline=(51, 65, 85, int(255 * 0.75)))
        # Left accent line
        m_draw.rectangle([ax, ay, ax + 3, ay + cardH], fill=cfg['accent'])
        # Action label & desc
        m_draw.text((ax + 12, ay + 6), label, fill=(255, 255, 255))
        m_draw.text((ax + 12, ay + 22), desc[:55], fill=(148, 163, 184))
        # Button on right
        btnW, btnH = 96, 24
        btnX = ax + aw - btnW - 8
        btnY = ay + int((cardH - btnH) / 2)
        m_draw.rectangle([btnX, btnY, btnX + btnW, btnY + btnH], fill=(16, 185, 129, 255))
        m_draw.text((btnX + 16, btnY + 5), "ESCOLHER", fill=(255, 255, 255))
        
    canv = Image.alpha_composite(canv, modal_layer)
    out_path = f"{art_dir}/new_modal_{cfg['id']}.png"
    canv.save(out_path)
    print(f"Saved {out_path}")

