import os
from PIL import Image

src_dir = r"C:\Users\Kavya\.gemini\antigravity\brain\abe30d99-062a-4fcf-b6b1-b5adeb20dc2d\.user_uploaded"
images = [
    "media_1793121021348_7c431b0a.jpg",
    "media_1793121021361_96ab1a1b.jpg",
    "media_1793121021368_0a553046.jpg",
    "media_1793121021378_efabdb36.jpg",
    "media_1793121021438_e3fe7525.jpg"
]

for img_name in images:
    path = os.path.join(src_dir, img_name)
    if os.path.exists(path):
        im = Image.open(path)
        print(f"{img_name}: {im.size}, mode={im.mode}")
    else:
        print(f"NOT FOUND: {path}")
