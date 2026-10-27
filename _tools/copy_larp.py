import shutil
import os

src_dir = r"C:\Users\Kavya\.gemini\antigravity\brain\abe30d99-062a-4fcf-b6b1-b5adeb20dc2d\.user_uploaded"
dest_dir = r"d:\DATAS AND CODES\ArtDrop\images\uploads"

mapping = {
    "media_1793121021348_7c431b0a.jpg": "pool-table-tapestry-lounge.jpg",
    "media_1793121021361_96ab1a1b.jpg": "siri-alarm-sleeping-on-me.jpg",
    "media_1793121021368_0a553046.jpg": "doberman-cybertruck-estate.jpg",
    "media_1793121021378_efabdb36.jpg": "gold-rolex-dom-perignon.jpg",
    "media_1793121021438_e3fe7525.jpg": "winning-is-the-only-option.jpg"
}

for src_name, dest_name in mapping.items():
    src_path = os.path.join(src_dir, src_name)
    dest_path = os.path.join(dest_dir, dest_name)
    shutil.copyfile(src_path, dest_path)
    print(f"Copied {src_name} -> {dest_name} ({os.path.getsize(dest_path)} bytes)")
