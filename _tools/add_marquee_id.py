with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

target = 'class="flex w-max items-center gap-12 sm:gap-16 md:gap-24 animate-marquee"'
replacement = 'id="hero-marquee-track" class="flex w-max items-center gap-12 sm:gap-16 md:gap-24 animate-marquee"'

if target in html:
    html = html.replace(target, replacement)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("[OK] Added id='hero-marquee-track' to index.html")
elif 'id="hero-marquee-track"' in html:
    print("[INFO] Already contains id='hero-marquee-track'")
else:
    print("[WARN] Target not found")
