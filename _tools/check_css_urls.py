import re
import os

with open('css/styles.css', 'r', encoding='utf-8', errors='ignore') as f:
    css = f.read()

urls = re.findall(r'url\(([^)]+)\)', css)
for u in set(urls):
    u_clean = u.strip('\'" ')
    if not u_clean.startswith('data:') and not u_clean.startswith('http'):
        # In css/styles.css, relative paths are relative to css/
        resolved = os.path.normpath(os.path.join('css', u_clean))
        exists = os.path.exists(resolved)
        print(f"CSS url: {u_clean} -> {resolved} (exists: {exists})")
