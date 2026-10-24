with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('id="galeria"')
if idx != -1:
    section = text[idx:idx+3000]
    grid_idx = section.find('class="mt-')
    print('Section after galeria:')
    print(section[:1500])
