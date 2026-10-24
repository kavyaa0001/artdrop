import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Replace the header with spacious, elegant navigation and "Get Access" button
old_header_pattern = r'<header.*?</header>'

new_header = '''<header class="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 border-b border-black/5">
  <a href="/" class="flex items-center">
    <img src="images/artvia-logo.webp?v=2" alt="ArtDrop Wallpapers" class="h-16 md:h-20 w-auto">
  </a>
  
  <!-- Beautifully spaced, non-clumped navigation -->
  <nav class="hidden md:flex items-center gap-10 lg:gap-14 text-xs lg:text-sm font-extrabold uppercase tracking-[0.25em] text-black">
    <a href="#galeria" class="hover:opacity-50 transition px-2 py-1">Gallery</a>
    <a href="#manifesto" class="hover:opacity-50 transition px-2 py-1">Manifesto</a>
    <a href="#pack" class="hover:opacity-50 transition px-2 py-1">The Pack</a>
    <a href="#faq" class="hover:opacity-50 transition px-2 py-1">FAQ</a>
  </nav>

  <!-- Clean Direct CTA (No login barrier) -->
  <div class="flex items-center gap-4">
    <button type="button" class="btn-open-checkout rounded-full bg-black px-6 py-2.5 text-xs font-extrabold uppercase tracking-widest text-white shadow-md hover:bg-neutral-800 hover:scale-105 transition cursor-pointer">
      Get Access
    </button>
  </div>
</header>'''

html = re.sub(old_header_pattern, new_header, html, flags=re.DOTALL)
print("[OK] Replaced header")

# 2. Replace bottom module scripts to load checkout.js instead of auth.js
old_script_pattern = r'<script type="module">\s*import\s*\{\s*initAuth.*?</script>'

new_script = '''<script type="module">
  import { initCheckout } from "./js/checkout.js";
  import "./js/dynamic-homepage.js";
  
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCheckout);
  } else {
    initCheckout();
  }
</script>'''

html = re.sub(old_script_pattern, new_script, html, flags=re.DOTALL)
print("[OK] Replaced bottom module scripts")

# 3. Ensure CTA buttons in pricing section have distinct classes/triggers
html = html.replace('href="https://go.centerpag.com/PPU38CQG2J1"', 'href="#checkout-essential" class="btn-open-checkout"')
html = html.replace('href="https://go.centerpag.com/PPU38CQG2H6"', 'href="#checkout-vip" class="btn-open-checkout"')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("[OK] All fixes applied to index.html successfully!")
