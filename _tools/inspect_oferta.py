import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('index.html', encoding='utf-8') as f:
    text = f.read()

idx = text.find('id="oferta"')
if idx != -1:
    print(text[idx+1000:idx+3500])
