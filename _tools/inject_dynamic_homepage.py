with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

target = 'import { initAuth, injectAuthModal } from "./js/auth.js";'
replacement = 'import { initAuth, injectAuthModal } from "./js/auth.js";\n  import "./js/dynamic-homepage.js";'

if 'import "./js/dynamic-homepage.js";' not in html:
    html = html.replace(target, replacement)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("[OK] Injected dynamic-homepage.js into index.html")
else:
    print("[INFO] Already injected")
