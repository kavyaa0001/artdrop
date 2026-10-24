with open('admin/index.html', 'r', encoding='utf-8') as f:
    admin_html = f.read()

with open('index.html', 'r', encoding='utf-8') as f:
    index_html = f.read()

admin_ids = [
    'tab-btn-orders', 'tab-btn-upload', 'tab-btn-marquee', 'tab-btn-list', 'tab-btn-pricing', 'tab-btn-users',
    'tab-content-orders', 'tab-content-upload', 'tab-content-marquee', 'tab-content-list', 'tab-content-pricing', 'tab-content-users',
    'tab-marquee-count', 'marquee-active-badge', 'marquee-active-grid', 'marquee-available-badge', 'marquee-available-grid',
    'wp-show-marquee', 'btn-seed-catalog'
]

all_ok = True
for aid in admin_ids:
    if f'id="{aid}"' in admin_html:
        print(f'[OK] admin/index.html has id="{aid}"')
    else:
        print(f'[FAIL] admin/index.html MISSING id="{aid}"')
        all_ok = False

if 'id="hero-marquee-track"' in index_html:
    print('[OK] index.html has id="hero-marquee-track"')
else:
    print('[FAIL] index.html MISSING id="hero-marquee-track"')
    all_ok = False

if all_ok:
    print('\nALL REQUIRED IDS VERIFIED SUCCESSFULLY!')
