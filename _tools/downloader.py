import os
import re
import urllib.request
import urllib.error
import concurrent.futures

BASE_URL = "https://artvia.pro/"

def download_file(rel_path):
    url = BASE_URL + rel_path
    local_path = os.path.join(os.getcwd(), rel_path.replace('/', os.sep))
    os.makedirs(os.path.dirname(local_path), exist_ok=True)
    
    if os.path.exists(local_path) and os.path.getsize(local_path) > 0:
        return f"[SKIP] {rel_path} already exists ({os.path.getsize(local_path)} bytes)"
    
    req = urllib.request.Request(url, headers={
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    })
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            content = resp.read()
            with open(local_path, 'wb') as f:
                f.write(content)
            return f"[OK] {rel_path} ({len(content)} bytes)"
    except Exception as e:
        return f"[ERR] {rel_path}: {e}"

def main():
    with open('artvia_raw.html', 'r', encoding='utf-8', errors='ignore') as f:
        html = f.read()

    # CSS
    css_files = set(re.findall(r'href=["\']([^"\']+\.css[^"\']*)["\']', html, re.I))
    # Fonts
    font_files = set(re.findall(r'href=["\']([^"\']+\.woff2?[^"\']*)["\']', html, re.I))
    font_urls = set(re.findall(r'url\(["\']?([^)"\']+\.woff2?[^)"\']*)["\']?\)', html, re.I))
    font_files.update(font_urls)
    # Scripts
    scripts = set(re.findall(r'src=["\']([^"\']+\.js[^"\']*)["\']', html, re.I))
    # Images
    img_srcs = set(re.findall(r'src=["\'](images/[^"\']+)["\']', html, re.I))
    img_hrefs = set(re.findall(r'href=["\'](images/[^"\']+)["\']', html, re.I))
    img_content = set(re.findall(r'content=["\'](images/[^"\']+)["\']', html, re.I))
    img_srcsets = set(re.findall(r'srcset=["\']([^"\']+)["\']', html, re.I))

    all_images = set(img_srcs) | set(img_hrefs) | set(img_content)
    for ss in img_srcsets:
        parts = [p.strip().split()[0] for p in ss.split(',') if p.strip()]
        for p in parts:
            if p.startswith('images/'):
                all_images.add(p)

    # Also check css/styles.css for urls
    if os.path.exists('css/styles.css'):
        with open('css/styles.css', 'r', encoding='utf-8', errors='ignore') as f:
            css = f.read()
            css_urls = re.findall(r'url\(([^)]+)\)', css)
            for u in css_urls:
                u = u.strip('\'" ')
                if not u.startswith('data:') and not u.startswith('http'):
                    # relative path to css/styles.css, so if it's ../fonts/... or fonts/...
                    clean_u = u.lstrip('/')
                    if clean_u.startswith('../'):
                        clean_u = clean_u[3:]
                    if clean_u.startswith('fonts/'):
                        font_files.add(clean_u)
                    elif clean_u.startswith('images/'):
                        all_images.add(clean_u)

    all_assets = sorted(list(css_files | font_files | scripts | all_images))
    print(f"Total assets to download: {len(all_assets)}")

    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
        results = executor.map(download_file, all_assets)
        for r in results:
            print(r)

if __name__ == '__main__':
    main()
