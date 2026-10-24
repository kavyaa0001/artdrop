import os
import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Check all img src
srcs = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', html)
# 2. Check all srcset
srcsets = re.findall(r'srcset=["\']([^"\']+)["\']', html)
for ss in srcsets:
    for item in ss.split(','):
        if item.strip():
            srcs.append(item.strip().split()[0])

# 3. Check link href for fonts/css/favicon
links = re.findall(r'<link[^>]+href=["\']([^"\']+)["\']', html)
for l in links:
    if not l.startswith('http') and not l.startswith('//'):
        srcs.append(l)

missing = []
for file_rel in set(srcs):
    clean = file_rel.split('?')[0].split('#')[0].lstrip('/')
    if not clean:
        continue
    if not os.path.exists(clean):
        missing.append(clean)

print(f"Total referenced local files checked: {len(set(srcs))}")
if missing:
    print(f"Missing {len(missing)} files: {missing}")
else:
    print("SUCCESS: 100% of referenced images, styles, fonts, and favicons exist locally!")
