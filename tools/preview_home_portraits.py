import os
from PIL import Image, ImageDraw

art_dir = "/home/pedro/.gemini/antigravity-cli/brain/f8dfaf40-46b8-4851-bb9f-8d4902a5a358"
assets_dir = "/home/pedro/Projects/desenrascado/assets"

# Create a composite canvas for the 5 partners: Cátia, Marta, Zulmira, Rui, Gonçalo
# Each 128x128
w, h = 128, 128
canvas = Image.new("RGBA", (w * 5 + 40, h + 50), (15, 23, 42, 255))
draw = ImageDraw.Draw(canvas)

partners = ['catia', 'marta', 'zulmira', 'rui', 'goncalo']
labels = ['Cátia (Camisola Alças)', 'Marta (Lounge & Óculos)', 'Zulmira (Robe de Seda)', 'Rui (Regata Treino)', 'Gonçalo (Linho Descontraído)']

for i, p in enumerate(partners):
    ox = 10 + i * (w + 6)
    oy = 10
    
    # Base image
    if p == 'catia':
        bg = Image.open(f"{assets_dir}/portrait_catia_bg.png").convert("RGBA")
        bust = Image.open(f"{assets_dir}/portrait_catia_bust.png").convert("RGBA")
        img = Image.alpha_composite(bg, bust)
    elif p == 'zulmira':
        bg = Image.open(f"{assets_dir}/portrait_zulmira_bg.png").convert("RGBA")
        bust = Image.open(f"{assets_dir}/portrait_zulmira_bust.png").convert("RGBA")
        img = Image.alpha_composite(bg, bust)
    elif p == 'marta':
        img = Image.open(f"{assets_dir}/portrait_marta.png").convert("RGBA")
    elif p == 'rui':
        img = Image.open(f"{assets_dir}/portrait_rui.png").convert("RGBA")
    elif p == 'goncalo':
        img = Image.open(f"{assets_dir}/portrait_goncalo.png").convert("RGBA")
    
    img = img.resize((128, 128), Image.Resampling.NEAREST)
    
    # Now create loungewear overlay in PIL
    overlay = Image.new("RGBA", (128, 128), (0, 0, 0, 0))
    odraw = ImageDraw.Draw(overlay)
    
    if p == 'catia':
        # Cozy ribbed pastel pink/lavender camisole
        # Spaghetti straps
        odraw.rectangle([42, 75, 45, 90], fill=(244, 114, 182, 255))
        odraw.rectangle([82, 75, 85, 90], fill=(244, 114, 182, 255))
        # Scoop neckline & camisole body
        odraw.polygon([(36, 92), (48, 98), (64, 101), (80, 98), (92, 92), (98, 128), (30, 128)], fill=(244, 114, 182, 255))
        # Inner shading & cleavage / ribbing
        odraw.polygon([(46, 96), (64, 100), (82, 96), (88, 128), (40, 128)], fill=(251, 207, 232, 255))
        odraw.line([(64, 100), (64, 120)], fill=(219, 39, 119, 200), width=1)
        for rx in range(44, 86, 4):
            odraw.line([(rx, 102), (rx, 128)], fill=(244, 114, 182, 120), width=1)
        # Gold chain & heart
        odraw.line([(58, 88), (64, 95), (70, 88)], fill=(250, 204, 21, 255), width=1)
        odraw.rectangle([63, 95, 65, 97], fill=(250, 204, 21, 255))
        
    elif p == 'marta':
        # Oversized slouchy off-shoulder teal sweater + reading glasses
        # Slouchy neckline falling off right shoulder
        odraw.polygon([(32, 80), (60, 86), (92, 95), (96, 128), (28, 128)], fill=(13, 148, 136, 255))
        odraw.polygon([(36, 84), (60, 90), (88, 97), (94, 128), (32, 128)], fill=(20, 184, 166, 255))
        # Exposed inner black tank strap on right shoulder
        odraw.rectangle([84, 82, 87, 94], fill=(15, 23, 42, 255))
        # Folds
        for fx in range(40, 88, 6):
            odraw.line([(fx, 94), (fx + 2, 128)], fill=(15, 118, 110, 180), width=1)
        # Tortoiseshell / dark reading glasses on Marta's face
        # Eyes are roughly around (52, 48) and (68, 48)
        odraw.rectangle([48, 44, 58, 52], outline=(30, 41, 59, 255), width=2)
        odraw.rectangle([64, 44, 74, 52], outline=(30, 41, 59, 255), width=2)
        odraw.line([(58, 47), (64, 47)], fill=(30, 41, 59, 255), width=2)
        # Ceramic mug held in corner
        odraw.rectangle([94, 106, 112, 124], fill=(241, 245, 249, 255), outline=(148, 163, 184, 255))
        odraw.rectangle([112, 110, 116, 120], outline=(148, 163, 184, 255))
        odraw.rectangle([96, 108, 110, 112], fill=(120, 53, 15, 255)) # Coffee/tea
        
    elif p == 'zulmira':
        # Sensual ruby-red silk robe de chambre with black chantilly lace trim
        # Plunging wrap V-neck
        odraw.polygon([(26, 82), (60, 108), (60, 128), (24, 128)], fill=(136, 19, 55, 255))
        odraw.polygon([(102, 82), (58, 108), (58, 128), (104, 128)], fill=(159, 18, 57, 255))
        # Silk sheen highlights
        odraw.line([(32, 86), (58, 106)], fill=(225, 29, 72, 220), width=2)
        odraw.line([(96, 86), (62, 106)], fill=(225, 29, 72, 220), width=2)
        # Black lace trim along collar edges
        for ly in range(84, 108, 3):
            odraw.rectangle([30 + (ly - 84) * 1.1 - 2, ly, 30 + (ly - 84) * 1.1 + 2, ly + 2], fill=(15, 23, 42, 230))
            odraw.rectangle([98 - (ly - 84) * 1.4 - 2, ly, 98 - (ly - 84) * 1.4 + 2, ly + 2], fill=(15, 23, 42, 230))
        # Golden silk belt / sash
        odraw.rectangle([48, 116, 80, 122], fill=(245, 158, 11, 255))
        odraw.rectangle([54, 122, 62, 128], fill=(217, 119, 6, 255))
        # Crystal wine glass in hand
        odraw.polygon([(96, 98), (108, 98), (104, 110), (100, 110)], fill=(159, 18, 57, 220), outline=(255, 255, 255, 180))
        odraw.line([(102, 110), (102, 120)], fill=(255, 255, 255, 200), width=1)
        odraw.line([(98, 120), (106, 120)], fill=(255, 255, 255, 200), width=1)
        
    elif p == 'rui':
        # Heather grey ribbed athletic tank top
        odraw.polygon([(36, 80), (46, 88), (82, 88), (92, 80), (96, 128), (32, 128)], fill=(100, 116, 139, 255))
        odraw.polygon([(40, 84), (48, 90), (80, 90), (88, 84), (92, 128), (36, 128)], fill=(148, 163, 184, 255))
        # Ribbing & athletic chest line
        odraw.line([(64, 92), (64, 118)], fill=(71, 85, 105, 180), width=1)
        for rx in range(46, 84, 5):
            odraw.line([(rx, 92), (rx, 128)], fill=(100, 116, 139, 100), width=1)
            
    elif p == 'goncalo':
        # Cream linen open shirt
        odraw.polygon([(30, 80), (52, 98), (52, 128), (28, 128)], fill=(254, 243, 199, 255))
        odraw.polygon([(98, 80), (74, 98), (74, 128), (100, 128)], fill=(253, 230, 138, 255))
        # Open collar flaps
        odraw.polygon([(32, 82), (54, 92), (44, 100)], fill=(254, 252, 232, 255))
        odraw.polygon([(96, 82), (74, 92), (84, 100)], fill=(254, 252, 232, 255))
        # Chest shadow
        odraw.polygon([(52, 92), (74, 92), (63, 106)], fill=(180, 83, 9, 80))
        # Soft folds
        odraw.line([(38, 102), (38, 128)], fill=(217, 119, 6, 120), width=1)
        odraw.line([(90, 102), (90, 128)], fill=(217, 119, 6, 120), width=1)
        
    combined = Image.alpha_composite(img, overlay)
    canvas.paste(combined, (ox, oy))
    draw.text((ox + 4, oy + h + 8), p.capitalize(), fill=(250, 204, 21, 255))

out_path = f"{art_dir}/preview_home_portraits.png"
canvas.save(out_path)
print("Saved preview to:", out_path)
