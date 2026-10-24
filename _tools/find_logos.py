import re
import glob

fpaths = ['index.html', 'help/index.html', 'privacy/index.html', 'terms/index.html', 'css/styles.css']

for fpath in fpaths:
    with open(fpath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    matches = re.findall(r'[^"\'<>\n]*logo[^"\'<>\n]*', content, re.I)
    print(f"=== {fpath} ===")
    for m in set(matches):
        print(" ", m.strip())
