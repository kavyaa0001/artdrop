import os
import shutil
from PIL import Image

src_dir = r"C:\Users\Kavya\.gemini\antigravity\brain\abe30d99-062a-4fcf-b6b1-b5adeb20dc2d\.user_uploaded"
dest_dir = r"d:\DATAS AND CODES\ArtDrop\images\uploads"

mapping = {
    "media_1793121416754_e47608f5.jpg": "riva-speedboat-yacht-mediterranean.jpg",
    "media_1793121416762_52f2d5d5.jpg": "neon-green-matcha-cups-splatter.jpg",
    "media_1793121416804_3ccb4081.jpg": "lv-ski-resort-cable-car.jpg"
}

for src_name, dest_name in mapping.items():
    src_path = os.path.join(src_dir, src_name)
    dest_path = os.path.join(dest_dir, dest_name)
    if os.path.exists(src_path):
        im = Image.open(src_path)
        print(f"{src_name}: size={im.size}, mode={im.mode}")
        shutil.copyfile(src_path, dest_path)
        print(f"Copied -> {dest_name} ({os.path.getsize(dest_path)} bytes)")
    else:
        print(f"NOT FOUND: {src_path}")
