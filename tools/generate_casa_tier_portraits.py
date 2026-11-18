import numpy as np
from PIL import Image, ImageDraw

def create_tier0():
    # Tier 0: Banco de Jardim no Rossio
    im = Image.new('RGB', (128, 128), (2, 6, 23))
    d = ImageDraw.Draw(im)
    
    # Sky gradient
    for y in range(80):
        t = y / 80.0
        r = int(2 * (1-t) + 13 * t)
        g = int(6 * (1-t) + 24 * t)
        b = int(23 * (1-t) + 56 * t)
        d.line([(0, y), (127, y)], fill=(r, g, b))
        
    # Stars
    np.random.seed(42)
    for _ in range(25):
        sx = np.random.randint(0, 128)
        sy = np.random.randint(0, 65)
        d.point((sx, sy), fill=(255, 255, 255))
        
    # Skyline silhouettes (Convento do Carmo)
    skyline = [(0, 75), (20, 75), (28, 55), (38, 55), (42, 75), (70, 75), (82, 50), (95, 50), (105, 75), (128, 75), (128, 90), (0, 90)]
    d.polygon(skyline, fill=(6, 11, 24))
    
    # Yellow lit windows
    for wx, wy in [(22, 65), (85, 60), (92, 60)]:
        d.rectangle([wx, wy, wx+3, wy+5], fill=(253, 224, 71))
        
    # Ground cobblestone
    for y in range(88, 128):
        c = 30 + ((y * 7) % 15)
        d.line([(0, y), (127, y)], fill=(c, c+5, c+15))
        
    # Lamppost (left side x=18)
    d.line([(18, 15), (18, 110)], fill=(6, 78, 59), width=3)
    d.polygon([(12, 18), (24, 18), (20, 32), (16, 32)], fill=(254, 240, 138)) # Glass
    d.polygon([(10, 18), (26, 18), (18, 8)], fill=(2, 44, 34)) # Cap
    # Warm glow around lamp
    for r in range(24, 4, -4):
        d.ellipse([18-r, 22-r, 18+r, 22+r], outline=(251, 191, 36), width=1)
        
    # Park bench (x=45..120, y=75..110)
    for ry in range(80, 98, 4):
        d.rectangle([45, ry, 120, ry+2], fill=(180, 83, 9))
    # Seat
    for ry in range(98, 108, 3):
        d.rectangle([42, ry, 122, ry+2], fill=(146, 64, 14))
    # Legs (iron)
    d.rectangle([50, 95, 54, 118], fill=(2, 44, 34))
    d.rectangle([112, 95, 116, 118], fill=(2, 44, 34))
    # Newspaper & cardboard blanket
    d.rectangle([55, 90, 95, 100], fill=(202, 138, 4))
    d.rectangle([60, 88, 90, 97], fill=(226, 232, 240))
    for ly in range(90, 96, 2):
        d.line([(63, ly), (87, ly)], fill=(51, 65, 85))
        
    return im

def create_tier1():
    # Tier 1: Beliche em Arroios
    im = Image.new('RGB', (128, 128), (30, 41, 59))
    d = ImageDraw.Draw(im)
    
    # Wall with damp patch
    d.rectangle([0, 0, 128, 80], fill=(30, 41, 59))
    d.ellipse([15, 20, 50, 45], fill=(20, 28, 42)) # damp stain
    
    # Ceiling fluorescent light
    d.rectangle([35, 6, 93, 10], fill=(241, 245, 249))
    d.rectangle([25, 4, 103, 12], outline=(148, 163, 184))
    
    # Clothesline strung across
    d.line([(5, 28), (123, 34)], fill=(203, 213, 225), width=1)
    # Socks and shirts drying
    items = [(15, 8, 16, (239, 68, 68)), (32, 6, 12, (56, 189, 248)), (48, 10, 18, (245, 158, 11)),
             (68, 7, 14, (255, 255, 255)), (88, 9, 15, (34, 197, 94)), (106, 8, 14, (244, 63, 94))]
    for ix, iw, ih, ic in items:
        d.rectangle([ix, 30, ix+iw, 30+ih], fill=ic, outline=(15, 23, 42))
        
    # Floor linoleum
    d.rectangle([0, 80, 128, 128], fill=(15, 23, 42))
    for fy in range(86, 128, 12):
        d.line([(0, fy), (127, fy)], fill=(30, 41, 59))
        
    # Bunk bed frame on right (x=68..124)
    d.rectangle([68, 20, 73, 120], fill=(100, 116, 139))
    d.rectangle([120, 20, 125, 120], fill=(100, 116, 139))
    # Top bunk
    d.rectangle([68, 52, 124, 58], fill=(71, 85, 105))
    d.rectangle([73, 46, 120, 52], fill=(220, 38, 38)) # Red blanket
    d.rectangle([74, 43, 88, 48], fill=(255, 255, 255)) # Pillow
    # Bottom bunk
    d.rectangle([68, 96, 124, 102], fill=(71, 85, 105))
    d.rectangle([73, 90, 120, 96], fill=(22, 163, 74)) # Green blanket
    d.rectangle([74, 87, 88, 92], fill=(255, 255, 255))
    # Ladder rungs
    for ry in range(35, 115, 14):
        d.rectangle([112, ry, 120, ry+2], fill=(148, 163, 184))
        
    # Left bed (partial)
    d.rectangle([2, 55, 6, 120], fill=(100, 116, 139))
    d.rectangle([6, 92, 35, 102], fill=(59, 130, 246))
    return im

def create_tier2():
    # Tier 2: Quarto Individual nos Anjos
    im = Image.new('RGB', (128, 128), (40, 30, 45))
    d = ImageDraw.Draw(im)
    
    # Wall painted warm pastel ochre
    for y in range(80):
        t = y / 80.0
        d.line([(0, y), (127, y)], fill=(int(85 - 15*t), int(60 - 10*t), int(75 - 12*t)))
        
    # Picture frame on wall (Lisbon tram 28)
    d.rectangle([18, 16, 46, 38], fill=(245, 158, 11), outline=(120, 53, 15))
    d.rectangle([22, 22, 42, 34], fill=(254, 240, 138)) # Tram body
    d.rectangle([24, 24, 40, 28], fill=(30, 41, 59)) # Windows
    
    # Bookshelf (x=85..120, y=14..45)
    d.rectangle([85, 14, 120, 45], fill=(120, 53, 15), outline=(69, 26, 3))
    d.rectangle([88, 22, 117, 24], fill=(180, 83, 9))
    d.rectangle([88, 36, 117, 38], fill=(180, 83, 9))
    # Colorful books
    books = [(90, 8, 12, (220, 38, 38)), (95, 6, 14, (37, 99, 235)), (100, 7, 13, (22, 163, 74)),
             (90, 8, 11, (234, 179, 8)), (100, 10, 11, (168, 85, 247))]
    for bx, bw, bh, bc in books:
        d.rectangle([bx, 36-bh, bx+bw, 36], fill=bc)
        
    # Parquet floor
    d.rectangle([0, 80, 128, 128], fill=(146, 64, 14))
    for fy in range(82, 128, 8):
        d.line([(0, fy), (127, fy)], fill=(120, 53, 15))
        for fx in range((fy%16)*2, 128, 16):
            d.line([(fx, fy), (fx, fy+8)], fill=(180, 83, 9))
            
    # Wooden bed (center-left)
    d.rectangle([8, 65, 82, 112], fill=(180, 83, 9), outline=(120, 53, 15))
    d.rectangle([12, 60, 20, 75], fill=(120, 53, 15)) # Headboard
    d.rectangle([18, 68, 80, 106], fill=(59, 130, 246)) # Blue cozy duvet
    d.rectangle([18, 65, 34, 76], fill=(255, 255, 255)) # Pillow
    
    # Bedside table with lamp (x=88..116, y=65..110)
    d.rectangle([88, 75, 116, 110], fill=(120, 53, 15), outline=(69, 26, 3))
    # Lamp
    d.rectangle([100, 62, 104, 75], fill=(217, 119, 6)) # Brass stem
    d.polygon([(94, 62), (110, 62), (106, 50), (98, 50)], fill=(251, 191, 36)) # Amber shade
    # Lamp glow
    for r in range(18, 4, -4):
        d.ellipse([102-r, 55-r, 102+r, 55+r], outline=(254, 240, 138))
        
    return im

def create_tier3():
    # Tier 3: T0 Típico em Alfama
    im = Image.new('RGB', (128, 128), (20, 35, 60))
    d = ImageDraw.Draw(im)
    
    # Wall with blue and white Portuguese azulejos
    d.rectangle([0, 0, 128, 82], fill=(240, 245, 255))
    for ay in range(0, 80, 16):
        for ax in range(0, 128, 16):
            d.rectangle([ax, ay, ax+15, ay+15], outline=(29, 78, 216))
            # Azulejo floral/diamond motif
            d.rectangle([ax+4, ay+4, ax+11, ay+11], fill=(37, 99, 235))
            d.rectangle([ax+6, ay+6, ax+9, ay+9], fill=(240, 245, 255))
            d.point((ax+7, ay+7), fill=(29, 78, 216))
            
    # Terracotta floor
    d.rectangle([0, 82, 128, 128], fill=(180, 83, 9))
    for fy in range(82, 128, 12):
        d.line([(0, fy), (127, fy)], fill=(120, 53, 15))
        for fx in range((fy%24), 128, 20):
            d.line([(fx, fy), (fx, fy+12)], fill=(146, 64, 14))
            
    # Arched stone window on left (x=10..42, y=12..65)
    d.rectangle([10, 25, 42, 65], fill=(56, 189, 248)) # Tagus sky
    d.ellipse([10, 12, 42, 38], fill=(56, 189, 248))
    # Red Alfama terracotta rooftops visible through window
    d.polygon([(10, 55), (25, 42), (42, 55)], fill=(220, 38, 38))
    d.rectangle([10, 55, 42, 65], fill=(14, 165, 233)) # Tagus River
    # Window stone frame
    d.arc([10, 12, 42, 38], 180, 360, fill=(203, 213, 225), width=2)
    d.line([(10, 25), (10, 65)], fill=(203, 213, 225), width=2)
    d.line([(42, 25), (42, 65)], fill=(203, 213, 225), width=2)
    d.line([(8, 65), (44, 65)], fill=(148, 163, 184), width=3)
    
    # Portuguese Guitar (Guitarra de Fado) on wall (x=98..118, y=14..60)
    # Neck & tuning head
    d.line([(108, 14), (108, 36)], fill=(180, 83, 9), width=3)
    d.polygon([(104, 14), (112, 14), (108, 20)], fill=(234, 179, 8)) # Fan tuners
    # Pear-shaped body
    d.ellipse([100, 34, 116, 56], fill=(217, 119, 6), outline=(120, 53, 15), width=2)
    d.ellipse([106, 42, 110, 46], fill=(30, 41, 59)) # Rosette
    
    # Rustic wooden bed with embroidered quilt
    d.rectangle([40, 68, 124, 118], fill=(120, 53, 15), outline=(69, 26, 3))
    d.rectangle([45, 72, 120, 112], fill=(244, 63, 94)) # Floral pink quilt
    d.rectangle([48, 68, 66, 80], fill=(255, 255, 255)) # Embroidered pillow
    
    return im

def create_tier4():
    # Tier 4: T1 Pombalino no Chiado (Palacete)
    im = Image.new('RGB', (128, 128), (35, 25, 45))
    d = ImageDraw.Draw(im)
    
    # Rich gold & royal blue damask wall
    for y in range(80):
        d.line([(0, y), (127, y)], fill=(int(45 + 10*(y%4)), int(30 + 8*(y%4)), int(55 + 12*(y%4))))
    # Damask patterns
    for dy in range(12, 75, 18):
        for dx in range(10, 120, 24):
            d.polygon([(dx, dy-5), (dx+5, dy), (dx, dy+5), (dx-5, dy)], outline=(202, 138, 4))
            
    # Ornate white stucco plaster molding on ceiling
    d.rectangle([0, 0, 128, 8], fill=(248, 250, 252))
    for sx in range(0, 128, 8):
        d.arc([sx, 4, sx+8, 12], 0, 180, fill=(203, 213, 225))
        
    # Grand French balcony window with golden curtains (x=28..100, y=8..95)
    # Outside view: Sunset over Tagus River and 25 de Abril Bridge
    for y in range(8, 90):
        t = (y - 8) / 82.0
        r = int(245*(1-t) + 217*t)
        g = int(158*(1-t) + 70*t)
        b = int(11*(1-t) + 80*t)
        d.line([(42, y), (86, y)], fill=(r, g, b))
    # Red 25 de Abril bridge silhouette
    d.line([(42, 60), (86, 60)], fill=(185, 28, 28), width=2)
    d.line([(58, 45), (58, 68)], fill=(185, 28, 28), width=2)
    d.line([(72, 45), (72, 68)], fill=(185, 28, 28), width=2)
    # Tagus water with sunset shimmer
    d.rectangle([42, 68, 86, 90], fill=(2, 132, 199))
    d.line([(46, 75), (82, 75)], fill=(253, 224, 71)) # Golden shimmer
    # White Cacilheiro boat
    d.rectangle([60, 70, 72, 74], fill=(234, 88, 12))
    d.rectangle([62, 68, 68, 70], fill=(255, 255, 255))
    
    # Grand gold velvet curtains on sides
    d.polygon([(26, 8), (44, 8), (38, 90), (24, 90)], fill=(202, 138, 4), outline=(133, 77, 14))
    d.polygon([(102, 8), (84, 8), (90, 90), (104, 90)], fill=(202, 138, 4), outline=(133, 77, 14))
    # Golden tassels
    d.ellipse([34, 52, 40, 58], fill=(250, 204, 21))
    d.ellipse([88, 52, 94, 58], fill=(250, 204, 21))
    # French balcony door frame & wrought iron railing
    d.rectangle([40, 8, 88, 92], outline=(255, 255, 255), width=2)
    d.line([(64, 8), (64, 92)], fill=(255, 255, 255), width=2)
    # Iron balcony railing
    for ix in range(40, 88, 6):
        d.line([(ix, 78), (ix, 92)], fill=(15, 23, 42), width=1)
    d.line([(38, 78), (90, 78)], fill=(15, 23, 42), width=2)
    
    # Herringbone parquet wood floor
    d.rectangle([0, 92, 128, 128], fill=(180, 83, 9))
    for fy in range(92, 128, 6):
        d.line([(0, fy), (127, fy)], fill=(120, 53, 15))
        for fx in range((fy%12)*2, 128, 12):
            d.line([(fx, fy), (fx+6, fy+6)], fill=(217, 119, 6))
            
    # Crystal chandelier at top center
    d.polygon([(62, 8), (66, 8), (64, 16)], fill=(250, 204, 21))
    d.ellipse([58, 16, 70, 24], fill=(254, 240, 138), outline=(250, 204, 21))
    
    return im

tiers = [create_tier0(), create_tier1(), create_tier2(), create_tier3(), create_tier4()]

# Save individual tier files and quantize to 128 colors with Floyd-Steinberg pixel art dithering
for idx, im in enumerate(tiers):
    px_im = im.quantize(colors=128, dither=Image.Dither.FLOYDSTEINBERG).convert('RGB')
    p = f'/home/pedro/Projects/desenrascado/assets/portrait_casa_tier{idx}_bg.png'
    px_im.save(p)
    print(f'Saved {p}')

# Create a combined comparison image
comb = Image.new('RGB', (128 * 5, 128))
for idx, im in enumerate(tiers):
    comb.paste(im, (idx * 128, 0))
comb.resize((128 * 5 * 2, 256), Image.NEAREST).save('/home/pedro/.gemini/antigravity-cli/brain/f8dfaf40-46b8-4851-bb9f-8d4902a5a358/casa_5_tiers_portraits.png')
print('Saved casa_5_tiers_portraits.png')
