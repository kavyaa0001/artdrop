with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re

# Find galeria
m_gal = re.search(r'<section[^>]*id="galeria"[^>]*>', html)
if m_gal:
    start = m_gal.start()
    print("=== GALERIA SECTION ===")
    print(html[start:start+1200])

# Find pricing (oferta)
m_off = re.search(r'<section[^>]*id="oferta"[^>]*>', html)
if m_off:
    start = m_off.start()
    print("\n=== OFERTA / PRICING SECTION ===")
    print(html[start:start+1200])
