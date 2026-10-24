import numpy as np
from PIL import Image

src_path = r"C:\Users\Kavya\.gemini\antigravity\brain\abe30d99-062a-4fcf-b6b1-b5adeb20dc2d\.user_uploaded\media_1792432118635_c5e50b36.jpg"

im = Image.open(src_path).convert("RGB")
arr = np.array(im, dtype=np.float32)

# Calculate luminance
# L = 0.299 * R + 0.587 * G + 0.114 * B
lum = 0.299 * arr[:, :, 0] + 0.587 * arr[:, :, 1] + 0.114 * arr[:, :, 2]

# Create Alpha channel
# White (lum >= 250) -> alpha = 0
# Black (lum <= 30) -> alpha = 255
# Smooth transition in between
high_thresh = 248.0
low_thresh = 35.0

alpha = np.zeros_like(lum)
mask_mid = (lum < high_thresh) & (lum > low_thresh)
alpha[lum <= low_thresh] = 255.0
alpha[mask_mid] = 255.0 * ((high_thresh - lum[mask_mid]) / (high_thresh - low_thresh))

# Smooth curve for alpha
alpha = np.clip(alpha, 0, 255).astype(np.uint8)

# Output image: pure black RGB with calculated alpha
rgba = np.zeros((im.height, im.width, 4), dtype=np.uint8)
rgba[:, :, 0] = 0   # R
rgba[:, :, 1] = 0   # G
rgba[:, :, 2] = 0   # B
rgba[:, :, 3] = alpha # A

logo_trans = Image.fromarray(rgba, mode="RGBA")

# Find bounding box of non-transparent content
bbox = logo_trans.getbbox()
print(f"Bounding box: {bbox}")

# Crop to content with small padding
pad = 24
crop_box = (
    max(0, bbox[0] - pad),
    max(0, bbox[1] - pad),
    min(logo_trans.width, bbox[2] + pad),
    min(logo_trans.height, bbox[3] + pad)
)
logo_cropped = logo_trans.crop(crop_box)
print(f"Cropped logo size: {logo_cropped.size}")

# Save full transparent logo
logo_cropped.save("images/artdrop-logo.png", format="PNG")
logo_cropped.save("images/artvia-logo.webp", format="WEBP", quality=100, lossless=True)
logo_cropped.save("images/artvia-logo-footer.webp", format="WEBP", quality=100, lossless=True)

# Also create square favicon
# Extract the emblem (circle monogram) without text for favicon
# Let's inspect where the text starts
emblem_box = (
    crop_box[0],
    crop_box[1],
    crop_box[2],
    int(crop_box[1] + (crop_box[3] - crop_box[1]) * 0.82)
)
emblem = logo_trans.crop(emblem_box)
emblem_bbox = emblem.getbbox()
if emblem_bbox:
    emblem = emblem.crop(emblem_bbox)
    # Make square
    max_side = max(emblem.width, emblem.height) + 16
    fav = Image.new("RGBA", (max_side, max_side), (0, 0, 0, 0))
    fav.paste(emblem, ((max_side - emblem.width) // 2, (max_side - emblem.height) // 2))
    fav_128 = fav.resize((128, 128), Image.Resampling.LANCZOS)
    fav_128.save("images/favicon.png", format="PNG")
    print("Favicon updated!")

print("All logos processed and saved!")
