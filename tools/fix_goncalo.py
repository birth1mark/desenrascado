import numpy as np
from PIL import Image

assets_dir = "/home/pedro/Projects/desenrascado/assets"
im_g_orig = Image.open(f"{assets_dir}/portrait_goncalo.png").convert("RGBA")
arr_orig = np.array(im_g_orig)

im_g_home = Image.open(f"{assets_dir}/portrait_goncalo_home.png").convert("RGBA")
arr_home = np.array(im_g_home)

# Restore all pixels outside the central shirt area: x < 30 or x > 92 or y < 76
for y in range(128):
    for x in range(128):
        if x < 32 or x > 90 or y < 78:
            arr_home[y, x] = arr_orig[y, x]

Image.fromarray(arr_home).save(f"{assets_dir}/portrait_goncalo_home.png")

# Also update preview
from PIL import ImageDraw
comp = Image.new("RGBA", (128 * 5 + 40, 150), (15, 23, 42, 255))
d = ImageDraw.Draw(comp)
for idx, (p, name) in enumerate([
    ("Cátia", "portrait_catia_home.png"),
    ("Marta", "portrait_marta_home.png"),
    ("Zulmira", "portrait_zulmira_home.png"),
    ("Rui", "portrait_rui_home.png"),
    ("Gonçalo", "portrait_goncalo_home.png")
]):
    ox = 10 + idx * 134
    im = Image.open(f"{assets_dir}/{name}")
    comp.paste(im, (ox, 8))
    d.text((ox + 4, 138), p, fill=(250, 204, 21, 255))

comp.save("/home/pedro/.gemini/antigravity-cli/brain/f8dfaf40-46b8-4851-bb9f-8d4902a5a358/preview_recolor_portraits.png")
print("Fixed Goncalo!")
