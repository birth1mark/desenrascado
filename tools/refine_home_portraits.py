import numpy as np
from PIL import Image

assets_dir = "/home/pedro/Projects/desenrascado/assets"
art_dir = "/home/pedro/.gemini/antigravity-cli/brain/f8dfaf40-46b8-4851-bb9f-8d4902a5a358"

# 1. CÁTIA: Remove grocery name badge (x: 75..95, y: 115..126)
im_c = Image.open(f"{assets_dir}/portrait_catia_home.png").convert("RGBA")
arr_c = np.array(im_c, dtype=np.uint8)

# Name badge area
for y in range(112, 128):
    for x in range(70, 98):
        # Sample surrounding fabric color
        # Replace white/yellow badge pixels with the dusty rose vest fabric
        r, g, b, a = arr_c[y, x]
        if r > 150 and g > 130: # badge white/gold
            # Sample from (y, x - 15)
            arr_c[y, x] = arr_c[y, x - 18]

Image.fromarray(arr_c).save(f"{assets_dir}/portrait_catia_home.png")


# 2. ZULMIRA: Clean throat skin (y: 72..85, x: 54..74)
im_z = Image.open(f"{assets_dir}/portrait_zulmira_home.png").convert("RGBA")
arr_z = np.array(im_z, dtype=np.uint8)

# Original skin from portrait_zulmira.png
orig_z = np.array(Image.open(f"{assets_dir}/portrait_zulmira.png").convert("RGBA"))
for y in range(70, 87):
    for x in range(52, 76):
        # Restore natural neck skin
        arr_z[y, x] = orig_z[y, x]

Image.fromarray(arr_z).save(f"{assets_dir}/portrait_zulmira_home.png")


# 3. GONÇALO: Transform black coat and suit into soft cream linen shirt
im_g = Image.open(f"{assets_dir}/portrait_goncalo.png").convert("RGBA")
arr_g = np.array(im_g, dtype=np.float32)

for y in range(74, 128):
    for x in range(0, 128):
        r, g, b, a = arr_g[y, x]
        is_skin = (r > 150 and g > 90 and b > 65 and r > g and g > b and (r - b) > 40)
        is_hair = (r < 75 and g < 50 and b < 40 and y < 85)
        is_bg = (x < 18 or x > 110) and (y < 95)
        is_guitar = (x > 88 and y > 95 and r > 130 and g > 70 and b < 50)
        
        # Black academic cape, coat, tie
        is_black_clothes = (r < 65 and g < 65 and b < 70 and y >= 78)
        is_white_shirt = (r > 160 and g > 160 and b > 165 and y >= 78)
        
        if (is_black_clothes or is_white_shirt) and not is_skin and not is_hair and not is_bg and not is_guitar:
            lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255.0
            # Transform to relaxed cream/ivory linen shirt
            # Natural linen: warm ivory RGB(242, 235, 218)
            linen_r = min(255.0, lum * 90.0 + 165.0)
            linen_g = min(255.0, lum * 85.0 + 158.0)
            linen_b = min(255.0, lum * 70.0 + 145.0)
            arr_g[y, x] = [linen_r, linen_g, linen_b, 255.0]

Image.fromarray(arr_g.astype(np.uint8)).save(f"{assets_dir}/portrait_goncalo_home.png")

# Regenerate preview
im_c_out = Image.open(f"{assets_dir}/portrait_catia_home.png")
im_m_out = Image.open(f"{assets_dir}/portrait_marta_home.png")
im_z_out = Image.open(f"{assets_dir}/portrait_zulmira_home.png")
im_r_out = Image.open(f"{assets_dir}/portrait_rui_home.png")
im_g_out = Image.open(f"{assets_dir}/portrait_goncalo_home.png")

from PIL import ImageDraw
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
print("Saved updated preview_recolor_portraits.png")
