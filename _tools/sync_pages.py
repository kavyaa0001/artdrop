import os

# Sync collection/index.html from collection.html
with open('collection.html', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('href="fonts/', 'href="/fonts/')
c = c.replace('url("fonts/', 'url="/fonts/')
c = c.replace('href="css/', 'href="/css/')
c = c.replace('src="images/', 'src="/images/')
c = c.replace('href="images/', 'href="/images/')
c = c.replace('data-src="images/', 'data-src="/images/')

with open('collection/index.html', 'w', encoding='utf-8') as f:
    f.write(c)

print('Successfully synced collection/index.html')

# Sync mobile-wallpapers/index.html from mobile-wallpapers.html
with open('mobile-wallpapers.html', 'r', encoding='utf-8') as f:
    m = f.read()

m = m.replace('href="fonts/', 'href="/fonts/')
m = m.replace('url("fonts/', 'url="/fonts/')
m = m.replace('href="css/', 'href="/css/')
m = m.replace('src="images/', 'src="/images/')
m = m.replace('href="images/', 'href="/images/')

with open('mobile-wallpapers/index.html', 'w', encoding='utf-8') as f:
    f.write(m)

print('Successfully synced mobile-wallpapers/index.html')
