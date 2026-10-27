with open('collection/index.html', encoding='utf-8') as f:
    c = f.read()

c = c.replace('href="fonts/', 'href="/fonts/')
c = c.replace('url("fonts/', 'url("/fonts/')
c = c.replace('href="css/', 'href="/css/')
c = c.replace('src="images/', 'src="/images/')
c = c.replace('href="images/', 'href="/images/')
c = c.replace('data-src="images/', 'data-src="/images/')

with open('collection/index.html', 'w', encoding='utf-8') as f:
    f.write(c)

print('Updated asset paths in collection/index.html')
