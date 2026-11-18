import numpy as np
from PIL import Image, ImageDraw, ImageFilter

assets_dir = "/home/pedro/Projects/desenrascado/assets"
art_dir = "/home/pedro/.gemini/antigravity-cli/brain/f8dfaf40-46b8-4851-bb9f-8d4902a5a358"

# 1. CÁTIA HOME
# Replace grocery apron/green uniform with warm cozy lavender/rose camisole with spaghetti straps & bare shoulders
im_catia = Image.open(f"{assets_dir}/portrait_catia.png").convert("RGBA")
arr_c = np.array(im_catia)

# The vest is green (high G, low R/B) from y=80 downwards, x from 20 to 110
for y in range(80, 128):
    for x in range(16, 112):
        r, g, b, a = arr_c[y, x]
        # Detect the green uniform / yellow stripes
        is_green_vest = (g > 85 and g > r * 1.05 and g > b * 1.1) or (r > 150 and g > 150 and b < 60) # yellow trim
        is_blue_sleeve = (b > 80 and b > r * 1.1 and b > g * 0.9)
        
        # Upper shoulder area (y between 78 and 92, x < 40 or x > 88): replace with natural skin tone
        dist_center = abs(x - 64)
        if y < 94 and dist_center > 24 and dist_center < 48:
            # Bare shoulder / clavicle skin
            # Sample skin gradient
            skin_base = np.array([245, 178, 128], dtype=np.float32)
            shade = 1.0 - (y - 78) * 0.015 - (dist_center - 24) * 0.008
            arr_c[y, x] = [int(skin_base[0] * shade), int(skin_base[1] * shade), int(skin_base[2] * shade), 255]
            
        elif is_green_vest or is_blue_sleeve or y >= 94:
            # Camisole body (ribbed dusty rose / soft lavender)
            # Center scoop neckline: skin between x: 50..78 down to y: 95
            is_cleavage_zone = (dist_center < 16 and y < 96) or (dist_center < 10 and y < 100)
            if is_cleavage_zone:
                skin_base = np.array([245, 175, 126], dtype=np.float32)
                shade = 0.96 - (y - 80) * 0.012
                if dist_center < 2 and y > 94: # cleavage shadow
                    shade *= 0.82
                arr_c[y, x] = [int(skin_base[0] * shade), int(skin_base[1] * shade), int(skin_base[2] * shade), 255]
            else:
                # Soft rose / pastel heather fabric
                rib = 1.08 if (x % 3 == 0) else (0.94 if (x % 3 == 1) else 1.0)
                fold = 1.0 + np.sin(x * 0.15 + y * 0.1) * 0.08
                lum = max(0.5, min(1.2, fold * rib * (1.0 - (y - 94) * 0.006)))
                
                # Base camisole color: soft dusty mauve/rose
                base_color = np.array([219, 112, 147], dtype=np.float32) # medium violet red / dusty rose
                if x < 44 or x > 84:
                    base_color = np.array([199, 92, 127], dtype=np.float32) # deeper at sides
                arr_c[y, x] = [int(min(255, base_color[0] * lum)), int(min(255, base_color[1] * lum)), int(min(255, base_color[2] * lum)), 255]

# Spaghetti straps
for sy in range(78, 95):
    for sx in [41, 42, 86, 87]:
        arr_c[sy, sx] = [235, 130, 165, 255]

im_catia_home = Image.fromarray(arr_c)
im_catia_home.save(f"{assets_dir}/portrait_catia_home.png")
print("Saved portrait_catia_home.png")


# 2. MARTA HOME
# Marta: relaxed oversized teal loungewear, softer indoor lighting
im_marta = Image.open(f"{assets_dir}/portrait_marta.png").convert("RGBA")
arr_m = np.array(im_marta)

# Replace dark heavy hoodie (y > 78) with soft cozy teal/petrol knit loungewear
for y in range(80, 128):
    for x in range(16, 112):
        r, g, b, a = arr_m[y, x]
        dist_c = abs(x - 64)
        
        # Soft slouchy neckline: open slightly on right shoulder (x > 75, y < 90)
        is_off_shoulder = (x > 76 and x < 94 and y < 89)
        if is_off_shoulder:
            skin_base = np.array([182, 108, 62], dtype=np.float32) # Marta's tanned skin
            shade = 0.95 - (y - 80) * 0.015
            arr_m[y, x] = [int(skin_base[0] * shade), int(skin_base[1] * shade), int(skin_base[2] * shade), 255]
        elif (dist_c < 18 and y < 87):
            # Neck center skin
            skin_base = np.array([175, 98, 54], dtype=np.float32)
            arr_m[y, x] = [int(skin_base[0]), int(skin_base[1]), int(skin_base[2]), 255]
        else:
            # Soft cozy knit sweater (teal / sea green)
            knit = 1.06 if ((x + y) % 4 < 2) else 0.94
            fold = 1.0 + np.sin(x * 0.18 + y * 0.12) * 0.1
            lum = max(0.55, min(1.25, fold * knit * (1.0 - (y - 85) * 0.005)))
            
            base_col = np.array([14, 116, 144], dtype=np.float32) # #0e7490 (rich ocean teal)
            if dist_c > 35:
                base_col = np.array([15, 90, 115], dtype=np.float32)
            arr_m[y, x] = [int(min(255, base_col[0] * lum)), int(min(255, base_col[1] * lum)), int(min(255, base_col[2] * lum)), 255]

# Add delicate black inner strap on right shoulder
for sy in range(80, 90):
    for sx in [84, 85]:
        arr_m[sy, sx] = [20, 25, 35, 255]

im_marta_home = Image.fromarray(arr_m)
im_marta_home.save(f"{assets_dir}/portrait_marta_home.png")
print("Saved portrait_marta_home.png")


# 3. ZULMIRA HOME
# Opulent burgundy silk robe de chambre with black lace and golden sash
im_zulmira = Image.open(f"{assets_dir}/portrait_zulmira.png").convert("RGBA")
arr_z = np.array(im_zulmira)

for y in range(78, 128):
    for x in range(16, 112):
        dist_c = abs(x - 64)
        
        # Sensual V-neck opening: skin showing down to y=98
        is_v_neck = (dist_c < (y - 72) * 0.42 and y <= 98)
        if is_v_neck:
            skin_base = np.array([245, 185, 142], dtype=np.float32) # Zulmira fair skin
            shade = 0.98 - (y - 75) * 0.012
            if dist_c < 2 and y > 90:
                shade *= 0.85 # cleavage line
            arr_z[y, x] = [int(skin_base[0] * shade), int(skin_base[1] * shade), int(skin_base[2] * shade), 255]
            
        elif y >= 114 and y <= 122 and dist_c < 28:
            # Golden silk sash at waist
            sash_col = np.array([245, 158, 11], dtype=np.float32)
            arr_z[y, x] = [int(sash_col[0]), int(sash_col[1]), int(sash_col[2]), 255]
            
        else:
            # Silk robe in deep burgundy / wine
            silk_sheen = 1.0 + np.sin(x * 0.22 - y * 0.08) * 0.18
            lum = max(0.5, min(1.3, silk_sheen * (1.0 - (y - 80) * 0.005)))
            
            # Base color: deep wine red (#881337 / #9f1239)
            base_col = np.array([140, 20, 50], dtype=np.float32)
            if dist_c > 32:
                base_col = np.array([100, 14, 38], dtype=np.float32)
            arr_z[y, x] = [int(min(255, base_col[0] * lum)), int(min(255, base_col[1] * lum)), int(min(255, base_col[2] * lum)), 255]

# Black lace along the V-neck edge
for y in range(78, 99):
    edge_x1 = int(64 - (y - 72) * 0.42)
    edge_x2 = int(64 + (y - 72) * 0.42)
    for lx in [edge_x1, edge_x1 - 1, edge_x2, edge_x2 + 1]:
        if 0 <= lx < 128:
            arr_z[y, lx] = [25, 20, 30, 255]

im_zulmira_home = Image.fromarray(arr_z)
im_zulmira_home.save(f"{assets_dir}/portrait_zulmira_home.png")
print("Saved portrait_zulmira_home.png")


# 4. RUI HOME
# Remove green cycling windbreaker and replace with heather-grey athletic tank top
im_rui = Image.open(f"{assets_dir}/portrait_rui.png").convert("RGBA")
arr_r = np.array(im_rui)

for y in range(75, 128):
    for x in range(16, 112):
        dist_c = abs(x - 64)
        
        # Toned shoulders and wide neck (bare arms/shoulders for x < 40 or x > 88, y < 105)
        is_bare_arm = (dist_c > 26 and y < 98) or (dist_c > 32 and y < 115)
        is_neck_open = (dist_c < 20 and y < 86)
        
        if is_bare_arm or is_neck_open:
            skin_base = np.array([244, 168, 112], dtype=np.float32) # Rui athletic tan
            shade = 0.98 - (y - 75) * 0.008 - (dist_c - 20) * 0.006
            arr_r[y, x] = [int(max(0, min(255, skin_base[0] * shade))), int(max(0, min(255, skin_base[1] * shade))), int(max(0, min(255, skin_base[2] * shade))), 255]
            
        else:
            # Heather grey ribbed sports tank top
            rib = 1.05 if (x % 3 == 0) else 0.95
            fold = 1.0 + np.sin(x * 0.2 + y * 0.15) * 0.08
            lum = max(0.6, min(1.2, fold * rib * (1.0 - (y - 85) * 0.005)))
            
            base_col = np.array([148, 163, 184], dtype=np.float32) # slate-400
            arr_r[y, x] = [int(min(255, base_col[0] * lum)), int(min(255, base_col[1] * lum)), int(min(255, base_col[2] * lum)), 255]

# Tank top straps
for sy in range(82, 92):
    for sx in [38, 39, 40, 88, 89, 90]:
        arr_r[sy, sx] = [130, 145, 165, 255]

im_rui_home = Image.fromarray(arr_r)
im_rui_home.save(f"{assets_dir}/portrait_rui_home.png")
print("Saved portrait_rui_home.png")


# 5. GONÇALO HOME
# Replace black suit and tie with open-collar relaxed cream/linen shirt
im_goncalo = Image.open(f"{assets_dir}/portrait_goncalo.png").convert("RGBA")
arr_g = np.array(im_goncalo)

for y in range(74, 128):
    for x in range(16, 112):
        dist_c = abs(x - 64)
        
        # Deep unbuttoned collar showing chest (x: 54..74 down to y: 94)
        is_open_chest = (dist_c < 9 and y < 94) or (dist_c < 16 and y < 86)
        if is_open_chest:
            skin_base = np.array([215, 130, 95], dtype=np.float32) # Gonçalo skin
            shade = 0.95 - (y - 74) * 0.012
            arr_g[y, x] = [int(skin_base[0] * shade), int(skin_base[1] * shade), int(skin_base[2] * shade), 255]
            
        else:
            # Cream linen shirt with soft flowing folds
            fold = 1.0 + np.sin(x * 0.14 + y * 0.1) * 0.14
            lum = max(0.65, min(1.2, fold * (1.0 - (y - 80) * 0.004)))
            
            base_col = np.array([245, 238, 220], dtype=np.float32) # warm ivory linen
            if dist_c > 32:
                base_col = np.array([215, 205, 185], dtype=np.float32)
            arr_g[y, x] = [int(min(255, base_col[0] * lum)), int(min(255, base_col[1] * lum)), int(min(255, base_col[2] * lum)), 255]

# Linen collar points
for cy in range(80, 92):
    arr_g[cy, 52] = [255, 250, 240, 255]
    arr_g[cy, 76] = [255, 250, 240, 255]

im_goncalo_home = Image.fromarray(arr_g)
im_goncalo_home.save(f"{assets_dir}/portrait_goncalo_home.png")
print("Saved portrait_goncalo_home.png")

# Generate composite preview for audit
comp = Image.new("RGBA", (128 * 5 + 40, 150), (15, 23, 42, 255))
d = ImageDraw.Draw(comp)
for idx, (p, im) in enumerate([
    ("Cátia", im_catia_home),
    ("Marta", im_marta_home),
    ("Zulmira", im_zulmira_home),
    ("Rui", im_rui_home),
    ("Gonçalo", im_goncalo_home)
]):
    ox = 10 + idx * 134
    comp.paste(im, (ox, 8))
    d.text((ox + 4, 138), p, fill=(250, 204, 21, 255))

comp.save(f"{art_dir}/preview_home_portraits_hd.png")
print("Saved preview_home_portraits_hd.png")
