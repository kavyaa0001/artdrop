import re
import os

with open('artvia_raw.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

print(f"Length of HTML: {len(html)}")

# Find all relative links to fonts, css, js, images
css_files = set(re.findall(r'href=["\']([^"\']+\.css[^"\']*)["\']', html, re.I))
font_files = set(re.findall(r'href=["\']([^"\']+\.woff2?[^"\']*)["\']', html, re.I))
font_urls = set(re.findall(r'url\(["\']?([^)"\']+\.woff2?[^)"\']*)["\']?\)', html, re.I))
font_files.update(font_urls)

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

print("\n--- CSS Files ---")
for c in sorted(css_files):
    print(c)

print("\n--- Font Files ---")
for f in sorted(font_files):
    print(f)

print("\n--- Scripts ---")
for s in sorted(scripts):
    print(s)

print(f"\n--- Total Images: {len(all_images)} ---")
for img in sorted(all_images):
    print(img)
