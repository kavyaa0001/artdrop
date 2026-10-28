import os

keywords = ['karanpw.live@gmail.com', 'oferta', 'btn-open-checkout', 'checkout-modal', 'payment']

for root, dirs, files in os.walk('.'):
    if '.git' in root or '.system_generated' in root:
        continue
    for f in files:
        if f.endswith(('.html', '.js', '.py')):
            path = os.path.join(root, f)
            try:
                with open(path, 'r', encoding='utf-8') as fp:
                    content = fp.read()
                    for kw in keywords:
                        if kw in content:
                            count = content.count(kw)
                            print(f"{path}: found '{kw}' ({count} times)")
            except Exception as e:
                pass
