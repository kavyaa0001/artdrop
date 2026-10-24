with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re

# Find all marquee items
items = re.findall(r'<div class="relative w-\[240px\] shrink-0 sm:w-\[300px\] md:w-\[360px\]">.*?</div></div></div></div></div>', html, re.DOTALL)
print(f"Total marquee items in index.html: {len(items)}")

# Find all image srcs inside animate-marquee
m = re.search(r'class="flex w-max items-center gap-12 sm:gap-16 md:gap-24 animate-marquee">(.*?)</div>\s*</div>', html, re.DOTALL)
if m:
    imgs = re.findall(r'src="([^"]+)"', m.group(1))
    print("Unique images in marquee:", len(set(imgs)))
    for img in sorted(set(imgs)):
        print(" ", img)
