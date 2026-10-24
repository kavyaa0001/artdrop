import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Find all links pointing to centerpag or oferta or with button-like classes
links = re.findall(r'<a[^>]+(?:href="[^"]*(?:centerpag|oferta)[^"]*"|class="[^"]*rounded-full[^"]*")[^>]*>.*?</a>', text, re.DOTALL | re.I)

print(f"Total CTA buttons found: {len(links)}")
for i, l in enumerate(links):
    print(f"\n--- CTA {i+1} ---")
    print(l[:250])
