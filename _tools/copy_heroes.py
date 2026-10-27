import shutil
import os

src_dir = r"C:\Users\Kavya\.gemini\antigravity\brain\abe30d99-062a-4fcf-b6b1-b5adeb20dc2d\.user_uploaded"
dest_dir = r"d:\DATAS AND CODES\ArtDrop\images\uploads"

mapping = {
    "media_1793120444974_223a45f7.jpg": "sidhu-moose-wala.jpg",
    "media_1793120444964_2a0e5a83.jpg": "honey-singh-glory.jpg",
    "media_1793120445017_b1396218.jpg": "karan-aujla.jpg",
    "media_1793120444959_c43af00b.jpg": "allstar-smile.jpg"
}

for src_name, dest_name in mapping.items():
    src_path = os.path.join(src_dir, src_name)
    dest_path = os.path.join(dest_dir, dest_name)
    shutil.copyfile(src_path, dest_path)
    print(f"Copied {src_name} -> {dest_name} (Size: {os.path.getsize(dest_path)} bytes)")
