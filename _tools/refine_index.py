with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Update backRedirectUrl to work relatively everywhere
html = html.replace("var backRedirectUrl = '/#oferta';", "var backRedirectUrl = '#oferta';")

# 2. Update YouTube poster image to local downloaded image
html = html.replace('src="https://i.ytimg.com/vi/fyIfHxzRoHE/hqdefault.jpg"', 'src="images/hqdefault.jpg"')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("index.html refined successfully!")
