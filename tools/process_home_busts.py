import os
import numpy as np
from PIL import Image

brain_dir = "/tmp/desenrascado_preview"
assets_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "assets"))

files = {
    'catia': f"{brain_dir}/bust_catia_home_1795013100668.jpg",
    'marta': f"{brain_dir}/bust_marta_home_1795013099742.jpg",
    'zulmira': f"{brain_dir}/bust_zulmira_home_1795013105828.jpg",
    'rui': f"{brain_dir}/bust_rui_home_1795013110855.jpg",
    'goncalo': f"{brain_dir}/bust_goncalo_home_1795013121276.jpg"
}

def extract_bust(src_path, name):
    im = Image.open(src_path).convert('RGB')
    im128 = im.resize((128, 128), Image.Resampling.LANCZOS)
    arr = np.array(im128)
    
    # Detect magenta background: high R (>160), low G (<100), high B (>160)
    # or distance to pure magenta [255, 0, 255]
    diff_magenta = np.sqrt(
        (arr[:, :, 0].astype(float) - 255)**2 +
        (arr[:, :, 1].astype(float) - 0)**2 +
        (arr[:, :, 2].astype(float) - 255)**2
    )
    
    # Also check corners for actual background color
    corners = [arr[0, 0], arr[0, 127], arr[127, 0], arr[127, 127]]
    bg_color = np.median(corners, axis=0)
    diff_bg = np.sqrt(np.sum((arr.astype(float) - bg_color)**2, axis=2))
    
    # A pixel is background if diff_magenta < 110 or diff_bg < 65
    is_bg = (diff_magenta < 120) | (diff_bg < 65)
    
    # Flood-fill from borders to prevent accidental transparent spots inside clothes
    # background connected to edges:
    # We can do a simple border-connected mask
    mask_bg = np.zeros((128, 128), dtype=bool)
    from collections import deque
    q = deque()
    for x in range(128):
        if is_bg[0, x]: q.append((0, x)); mask_bg[0, x] = True
        if is_bg[127, x]: q.append((127, x)); mask_bg[127, x] = True
    for y in range(128):
        if is_bg[y, 0]: q.append((y, 0)); mask_bg[y, 0] = True
        if is_bg[y, 127]: q.append((y, 127)); mask_bg[y, 127] = True
        
    while q:
        cy, cx = q.popleft()
        for dy, dx in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            ny, nx = cy + dy, cx + dx
            if 0 <= ny < 128 and 0 <= nx < 128:
                if not mask_bg[ny, nx] and is_bg[ny, nx]:
                    mask_bg[ny, nx] = True
                    q.append((ny, nx))
                    
    # Create RGBA image
    rgba = np.zeros((128, 128, 4), dtype=np.uint8)
    rgba[:, :, :3] = arr
    rgba[:, :, 3] = np.where(mask_bg, 0, 255).astype(np.uint8)
    
    out_im = Image.fromarray(rgba, 'RGBA')
    out_path = f"{assets_dir}/bust_{name}_home.png"
    out_im.save(out_path)
    print(f"Extracted bust for {name} -> {out_path} (transparent pixels: {(rgba[:,:,3]==0).sum()})")
    return out_im

extracted = {}
for name, p in files.items():
    extracted[name] = extract_bust(p, name)

# Save a comparison preview of all 5 extracted busts over a dark neutral checkerboard
preview = Image.new('RGBA', (128 * 5, 128), (20, 25, 35, 255))
for i, name in enumerate(['catia', 'marta', 'zulmira', 'rui', 'goncalo']):
    preview.paste(extracted[name], (i * 128, 0), extracted[name])

preview.resize((128 * 5 * 2, 256), Image.NEAREST).save(f"{brain_dir}/extracted_home_busts_preview.png")
print(f"Saved {brain_dir}/extracted_home_busts_preview.png")
