import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Find buttons
buttons = re.findall(r'<button[^>]*>.*?</button>', html, re.DOTALL)
print(f"Total buttons: {len(buttons)}")
for b in buttons[:5]:
    print("Button:", b[:200])

# Find links with button-like classes
cta_links = re.findall(r'<a[^>]+href=["\'](?:https://go\.centerpag\.com[^"\']*)["\'][^>]*>.*?</a>', html, re.DOTALL)
print(f"\nTotal CTA links: {len(cta_links)}")
for c in cta_links:
    print("CTA Link:", c[:250])
