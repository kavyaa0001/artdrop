import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

m = re.search(r'class="[^"]*fixed inset-x-0 bottom-0[^"]*"', html)
if m:
    start = m.start()
    print(html[start-50:start+600])
