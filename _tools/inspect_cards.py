import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Let's inspect sections around 'oferta' (pricing) and 'pack' and 'manifesto' and testimonials
for section_name in ['oferta', 'pack', 'manifesto', 'testimonial']:
    idx = html.find(section_name)
    if idx != -1:
        print(f"=== {section_name.upper()} ===")
        print(html[idx-100:idx+400])
        print("\n")
