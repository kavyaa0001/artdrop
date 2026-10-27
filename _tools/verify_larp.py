import urllib.request

larp_images = [
    'pool-table-tapestry-lounge.jpg',
    'siri-alarm-sleeping-on-me.jpg',
    'doberman-cybertruck-estate.jpg',
    'gold-rolex-dom-perignon.jpg',
    'winning-is-the-only-option.jpg'
]

for img in larp_images:
    url = f"http://127.0.0.1:8000/images/uploads/{img}"
    try:
        req = urllib.request.urlopen(url)
        print(f"{img}: STATUS {req.status}, Content-Length: {req.headers.get('Content-Length')}")
    except Exception as e:
        print(f"{img}: ERROR {e}")

# Check count of wallpaper items in collection.html
with open('collection.html', encoding='utf-8') as f:
    c = f.read()
    item_count = c.count('class="wallpaper-item')
    print(f"Total wallpaper items in collection.html: {item_count}")
    larp_count = c.count('data-category="Larp"')
    print(f"Larp items in collection.html: {larp_count}")
    heroes_count = c.count('data-category="Heroes"')
    print(f"Heroes items in collection.html: {heroes_count}")
