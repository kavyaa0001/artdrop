files = ['index.html', 'help/index.html', 'privacy/index.html', 'terms/index.html']

for fn in files:
    with open(fn, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = content.replace('alt="Artvia Wallpapers"', 'alt="ArtDrop Wallpapers"')
    
    with open(fn, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"[OK] Updated alt in {fn}")
