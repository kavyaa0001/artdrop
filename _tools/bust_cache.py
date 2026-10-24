with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('src="images/artvia-logo.webp"', 'src="images/artvia-logo.webp?v=2"')
content = content.replace('src="images/artvia-logo-footer.webp"', 'src="images/artvia-logo-footer.webp?v=2"')
content = content.replace('href="images/favicon.png"', 'href="images/favicon.png?v=2"')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("[OK] Added cache buster to index.html logo tags")
