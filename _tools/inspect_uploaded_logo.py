from PIL import Image
import numpy as np

src_path = r"C:\Users\Kavya\.gemini\antigravity\brain\abe30d99-062a-4fcf-b6b1-b5adeb20dc2d\.user_uploaded\media_1792432118635_c5e50b36.jpg"

im = Image.open(src_path).convert("RGB")
print(f"Loaded image size: {im.size}, mode: {im.mode}")

# Inspect corners to see background color
corners = [
    im.getpixel((0, 0)),
    im.getpixel((im.width - 1, 0)),
    im.getpixel((0, im.height - 1)),
    im.getpixel((im.width - 1, im.height - 1))
]
print(f"Corner pixels: {corners}")
