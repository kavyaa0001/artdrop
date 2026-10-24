import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

sections = re.findall(r'<section[^>]*class=["\']([^"\']+)["\']', html)
for i, s in enumerate(sections):
    print(f"Section {i+1}: {s}")

divs_with_bg = re.findall(r'<div[^>]*class=["\']([^"\']*bg-[^"\']*)["\']', html)
print(f"\nTotal divs with bg-: {len(divs_with_bg)}")
for d in divs_with_bg[:15]:
    print("Div bg:", d)
