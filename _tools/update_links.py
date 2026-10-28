with open('index.html', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('href="/checkout/essential.html"', 'href="/checkout/index.html?bundle=essential"')
c = c.replace('href="/checkout/complete.html"', 'href="/checkout/index.html?bundle=complete"')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(c)

print('Updated index.html checkout links!')
