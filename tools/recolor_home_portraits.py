import numpy as np
from PIL import Image, ImageDraw

assets_dir = "/home/pedro/Projects/desenrascado/assets"
art_dir = "/home/pedro/.gemini/antigravity-cli/brain/f8dfaf40-46b8-4851-bb9f-8d4902a5a358"

# 1. CÁTIA
# Original has green vest (high G) and blue sleeves.
im_c = Image.open(f"{assets_dir}/portrait_catia.png").convert("RGBA")
arr_c = np.array(im_c, dtype=np.float32)

for y in range(70, 128):
    for x in range(0, 128):
        r, g, b, a = arr_c[y, x]
        # Skin detection (face/neck) - preserve!
        is_skin = (r > 190 and g > 130 and b > 90 and r > g and g > b and (r - b) > 40)
        # Hair detection - preserve!
        is_hair = (r < 80 and g < 55 and b < 45) or (r < 110 and g < 75 and b < 60 and abs(r - g) < 35)
        # Background shelves detection - preserve!
        is_bg = (x < 22 or x > 106) and (y < 95 or (r > 150 and g > 150))
        
        if not is_skin and not is_hair and not is_bg and y >= 76:
            # Check if this pixel is part of the clothes (vest or sleeve)
            is_green = (g > r * 0.95 and g > b * 1.05 and g > 60)
            is_yellow = (r > 160 and g > 140 and b < 90) # vest trim
            is_blue = (b > r and b > 50 and y > 82)
            
            if is_green or is_yellow or is_blue:
                lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255.0
                # Transform to dusty rose / soft lavender loungewear
                # Base hue: RGB(225, 120, 160)
                rose_r = min(255.0, lum * 260.0 + 20.0)
                rose_g = min(255.0, lum * 140.0 + 15.0)
                rose_b = min(255.0, lum * 180.0 + 25.0)
                arr_c[y, x] = [rose_r, rose_g, rose_b, 255.0]

im_c_out = Image.fromarray(arr_c.astype(np.uint8))
im_c_out.save(f"{assets_dir}/portrait_catia_home.png")


# 2. MARTA
# Original has dark blue/grey tech jacket and headphones
im_m = Image.open(f"{assets_dir}/portrait_marta.png").convert("RGBA")
arr_m = np.array(im_m, dtype=np.float32)

for y in range(74, 128):
    for x in range(0, 128):
        r, g, b, a = arr_m[y, x]
        is_skin = (r > 140 and g > 80 and b > 40 and r > g and g > b)
        is_hair = (r < 65 and g < 45 and b < 35)
        is_bg = (x < 18 or x > 110) and (y < 95)
        
        if not is_skin and not is_hair and not is_bg and y >= 80:
            lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255.0
            # Transform to soft ocean teal knit loungewear
            # Base hue: RGB(14, 140, 160)
            teal_r = min(255.0, lum * 60.0 + 10.0)
            teal_g = min(255.0, lum * 210.0 + 35.0)
            teal_b = min(255.0, lum * 230.0 + 40.0)
            arr_m[y, x] = [teal_r, teal_g, teal_b, 255.0]

im_m_out = Image.fromarray(arr_m.astype(np.uint8))
im_m_out.save(f"{assets_dir}/portrait_marta_home.png")


# 3. ZULMIRA
# Original has black blazer and top
im_z = Image.open(f"{assets_dir}/portrait_zulmira.png").convert("RGBA")
arr_z = np.array(im_z, dtype=np.float32)

for y in range(72, 128):
    for x in range(0, 128):
        r, g, b, a = arr_z[y, x]
        is_skin = (r > 180 and g > 120 and b > 90 and r > g and g > b)
        is_hair = (abs(r - g) < 20 and abs(g - b) < 20 and (r > 80 or (r < 70 and y < 82))) # silver/grey hair
        is_bg = (x < 24 or x > 104) and (y < 95)
        
        if not is_skin and not is_hair and not is_bg and y >= 80:
            lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255.0
            # Silk robe in deep burgundy / wine (#9f1239)
            wine_r = min(255.0, lum * 280.0 + 45.0)
            wine_g = min(255.0, lum * 45.0 + 8.0)
            wine_b = min(255.0, lum * 95.0 + 15.0)
            arr_z[y, x] = [wine_r, wine_g, wine_b, 255.0]

im_z_out = Image.fromarray(arr_z.astype(np.uint8))
im_z_out.save(f"{assets_dir}/portrait_zulmira_home.png")


# 4. RUI
# Original has bright green cyclist windbreaker
im_r = Image.open(f"{assets_dir}/portrait_rui.png").convert("RGBA")
arr_r = np.array(im_r, dtype=np.float32)

for y in range(70, 128):
    for x in range(0, 128):
        r, g, b, a = arr_r[y, x]
        is_skin = (r > 190 and g > 120 and b > 80 and r > g and g > b)
        is_hair = (r < 75 and g < 50 and b < 40)
        is_bg = (x < 20 or x > 108) and (y < 90)
        
        # Detect the bright green cycling jacket
        is_green = (g > r * 1.05 and g > b * 1.05 and g > 70) or (r > 180 and g > 180 and b < 80)
        
        if (is_green or (y >= 88 and not is_skin and not is_hair and not is_bg)):
            lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255.0
            # Heather grey athletic tank top
            grey_val = min(255.0, lum * 180.0 + 55.0)
            arr_r[y, x] = [grey_val * 0.95, grey_val, grey_val * 1.08, 255.0]

im_r_out = Image.fromarray(arr_r.astype(np.uint8))
im_r_out.save(f"{assets_dir}/portrait_rui_home.png")


# 5. GONÇALO
# Original has black academic suit and tie
im_g = Image.open(f"{assets_dir}/portrait_goncalo.png").convert("RGBA")
arr_g = np.array(im_g, dtype=np.float32)

for y in range(72, 128):
    for x in range(0, 128):
        r, g, b, a = arr_g[y, x]
        is_skin = (r > 170 and g > 100 and b > 70 and r > g and g > b)
        is_hair = (r < 75 and g < 50 and b < 40)
        is_bg = (x < 22 or x > 106) and (y < 95)
        
        # Black suit & tie
        is_suit = (r < 80 and g < 80 and b < 85 and y >= 82)
        is_white_shirt = (r > 180 and g > 180 and b > 180 and y >= 80)
        
        if (is_suit or is_white_shirt) and not is_skin and not is_hair and not is_bg:
            lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255.0
            # Cream linen open shirt
            linen_r = min(255.0, lum * 140.0 + 115.0)
            linen_g = min(255.0, lum * 135.0 + 108.0)
            linen_b = min(255.0, lum * 120.0 + 95.0)
            arr_g[y, x] = [linen_r, linen_g, linen_b, 255.0]

im_g_out = Image.fromarray(arr_g.astype(np.uint8))
im_g_out.save(f"{assets_dir}/portrait_goncalo_home.png")

# Composite preview
comp = Image.new("RGBA", (128 * 5 + 40, 150), (15, 23, 42, 255))
d = ImageDraw.Draw(comp)
for idx, (p, im) in enumerate([
    ("Cátia", im_c_out),
    ("Marta", im_m_out),
    ("Zulmira", im_z_out),
    ("Rui", im_r_out),
    ("Gonçalo", im_g_out)
]):
    ox = 10 + idx * 134
    comp.paste(im, (ox, 8))
    d.text((ox + 4, 138), p, fill=(250, 204, 21, 255))

comp.save(f"{art_dir}/preview_recolor_portraits.png")
print("Saved preview_recolor_portraits.png")
