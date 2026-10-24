import urllib.request
import os

pages = ['help/index.html', 'privacy/index.html', 'terms/index.html']

for page in pages:
    url = f"https://artvia.pro/{page}"
    local_path = os.path.join(os.getcwd(), page.replace('/', os.sep))
    os.makedirs(os.path.dirname(local_path), exist_ok=True)
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req) as resp:
            content = resp.read()
            with open(local_path, 'wb') as f:
                f.write(content)
            print(f"[OK] {page} ({len(content)} bytes)")
    except Exception as e:
        print(f"[ERR] {page}: {e}")
