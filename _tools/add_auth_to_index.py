import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Update Header to include header-auth-container
old_nav = '<nav class="hidden items-center gap-10 text-[13px] uppercase tracking-[0.25em] text-foreground/80 md:flex"><a href="#galeria" class="hover:text-gold">Gallery</a><a href="#manifesto" class="hover:text-gold">Manifesto</a><a href="#pack" class="hover:text-gold">The Pack</a><a href="#faq" class="hover:text-gold">FAQ</a></nav>'

new_nav = '''<div class="flex items-center gap-6 md:gap-8">
  <nav class="hidden items-center gap-8 text-[13px] uppercase tracking-[0.25em] text-foreground/80 md:flex">
    <a href="#galeria" class="hover:text-black">Gallery</a>
    <a href="#manifesto" class="hover:text-black">Manifesto</a>
    <a href="#pack" class="hover:text-black">The Pack</a>
    <a href="#faq" class="hover:text-black">FAQ</a>
  </nav>
  <div id="header-auth-container"></div>
</div>'''

if old_nav in html:
    html = html.replace(old_nav, new_nav)
    print("[OK] Replaced header nav with auth container")
else:
    print("[WARN] old_nav not found exactly, using regex")
    html = re.sub(r'<nav class="hidden items-center[^>]*>.*?</nav>', new_nav, html, flags=re.DOTALL)

# 2. Add auth script module before </body>
auth_script = '''
<script type="module">
  import { initAuth, injectAuthModal } from "./js/auth.js";
  document.addEventListener("DOMContentLoaded", () => {
    injectAuthModal();
    initAuth();
  });
</script>
</body>
'''

if 'import { initAuth, injectAuthModal } from "./js/auth.js";' not in html:
    html = html.replace('</body>', auth_script)
    print("[OK] Injected auth module script")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("[OK] index.html updated successfully with Auth!")
