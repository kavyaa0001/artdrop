import re

for fname in ['index.html', 'collection.html', 'mobile-wallpapers.html']:
    with open(fname, encoding='utf-8') as f:
        c = f.read()
    links = re.findall(r'<a\s+[^>]*href=["\']([^"\']+)["\'][^>]*>', c)
    print(f"--- {fname} ---")
    for link in links:
        if 'oferta' in link or 'checkout' in link or 'payment' in link:
            print(link)
