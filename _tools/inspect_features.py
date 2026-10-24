import re

with open('artvia_raw.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

# Find all script tags
inline_scripts = re.findall(r'<script(?![^>]*src=)[^>]*>(.*?)</script>', html, re.DOTALL | re.I)
print(f"Total inline scripts: {len(inline_scripts)}")
for i, s in enumerate(inline_scripts):
    print(f"\n--- Inline script {i+1} (length: {len(s)}) ---")
    print(s[:300] + ('...' if len(s) > 300 else ''))

# Find all sections / main tags / IDs
sections = re.findall(r'<(section|div|header|footer)[^>]*(?:id|class)=["\'][^"\']+["\'][^>]*>', html, re.I)
print(f"\nTotal structural tags: {len(sections)}")

# Find all IDs
ids = re.findall(r'id=["\']([^"\']+)["\']', html, re.I)
print(f"\nAll IDs: {sorted(set(ids))}")

# Find all links
links = re.findall(r'href=["\']([^"\']+)["\']', html, re.I)
non_asset_links = [l for l in links if not any(l.endswith(ext) for ext in ['.css', '.woff2', '.png', '.jpg', '.webp'])]
print(f"\nNavigation & external links: {sorted(set(non_asset_links))}")
