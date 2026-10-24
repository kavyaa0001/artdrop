from PIL import Image

for name in ['images/artvia-logo.webp', 'images/artvia-logo-footer.webp']:
    try:
        im = Image.open(name)
        print(name, im.format, im.size, im.mode)
    except Exception as e:
        print(name, e)
