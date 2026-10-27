import os
from PIL import Image

src_dir = r"C:\Users\Kavya\.gemini\antigravity\brain\abe30d99-062a-4fcf-b6b1-b5adeb20dc2d\.user_uploaded"
images = [
    "media_1793120444959_c43af00b.jpg",
    "media_1793120444964_2a0e5a83.jpg",
    "media_1793120444974_223a45f7.jpg",
    "media_1793120445017_b1396218.jpg"
]

for img_name in images:
    path = os.path.join(src_dir, img_name)
    if os.path.exists(path):
        im = Image.open(path)
        print(f"{img_name}: {im.size}, mode={im.mode}")
    else:
        print(f"NOT FOUND: {path}")
