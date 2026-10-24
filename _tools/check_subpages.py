import re
import os

pages = ['help/index.html', 'privacy/index.html', 'terms/index.html']
for page in pages:
    if os.path.exists(page):
        with open(page, 'r', encoding='utf-8', errors='ignore') as f:
            c = f.read()
            imgs = re.findall(r'src=["\']([^"\']+)["\']', c)
            links = re.findall(r'href=["\']([^"\']+)["\']', c)
            print(f"=== {page} ===")
            print("Images:", imgs)
            print("Links:", [l for l in links if not l.startswith('#')][:10])
