from PIL import Image

assets_dir = "/home/pedro/Projects/desenrascado/assets"
# Default to Tier 2 (cozy Lisbon bedroom) or Tier 1 for fallback
t_bg = Image.open(f"{assets_dir}/portrait_casa_tier2_bg.png").convert('RGBA')

names = ['catia', 'marta', 'zulmira', 'rui', 'goncalo']

for name in names:
    bust = Image.open(f"{assets_dir}/bust_{name}_home.png").convert('RGBA')
    comp = Image.alpha_composite(t_bg.copy(), bust)
    out_path = f"{assets_dir}/portrait_{name}_home.png"
    comp.save(out_path)
    print(f"Pre-composited fallback for {name} -> {out_path}")

