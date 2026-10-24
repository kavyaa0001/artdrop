with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

old_script = '''<script type="module">
  import { initAuth, injectAuthModal } from "./js/auth.js";
  document.addEventListener("DOMContentLoaded", () => {
    injectAuthModal();
    initAuth();
  });
</script>'''

new_script = '''<script type="module">
  import { initAuth, injectAuthModal } from "./js/auth.js";
  function startAuth() {
    injectAuthModal();
    initAuth();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startAuth);
  } else {
    startAuth();
  }
</script>'''

if old_script in html:
    html = html.replace(old_script, new_script)
    print("[OK] Replaced old auth script in index.html")
else:
    import re
    html = re.sub(r'<script type="module">\s*import\s*\{\s*initAuth.*?</script>', new_script, html, flags=re.DOTALL)
    print("[OK] Replaced via regex in index.html")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
