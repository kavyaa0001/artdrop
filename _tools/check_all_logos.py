import re

files = ['index.html', 'help/index.html', 'privacy/index.html', 'terms/index.html']
for fn in files:
    with open(fn, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check all img tags
    img_tags = re.findall(r'<img[^>]+logo[^>]*>', content, re.I)
    print(f"=== {fn} ===")
    for img in img_tags:
        print(" ", img)
