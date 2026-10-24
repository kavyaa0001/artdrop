import re

THEME_CSS = """
/* ==========================================================================
   CUSTOM THEME: WHITE BACKGROUND & BLACK TEXT
   ========================================================================== */
:root {
  --background: #ffffff !important;
  --foreground: #000000 !important;
  --card: #ffffff !important;
  --card-foreground: #000000 !important;
  --popover: #ffffff !important;
  --popover-foreground: #000000 !important;
  --primary: #000000 !important;
  --primary-foreground: #ffffff !important;
  --secondary: #f4f4f5 !important;
  --secondary-foreground: #000000 !important;
  --muted: #f4f4f5 !important;
  --muted-foreground: #3f3f46 !important;
  --accent: #000000 !important;
  --accent-foreground: #ffffff !important;
  --destructive: #000000 !important;
  --destructive-foreground: #ffffff !important;
  --border: rgba(0, 0, 0, 0.15) !important;
  --input: #e4e4e7 !important;
  --ring: #000000 !important;
  --gold: #000000 !important;
  --gold-soft: rgba(0, 0, 0, 0.1) !important;
  --grad-hero: #ffffff !important;
  --grad-gold: linear-gradient(135deg, #000000, #27272a, #52525b) !important;
  --artvia-ivory: #ffffff !important;
  --artvia-muted: #3f3f46 !important;
  --artvia-gold: #000000 !important;
  --artvia-gold-soft: rgba(0, 0, 0, 0.1) !important;
  --artvia-black: #ffffff !important;
  --color-background: #ffffff !important;
  --color-foreground: #000000 !important;
}

/* Base page background: Pure White */
html,
body,
main,
.site-content,
.bg-hero,
section,
footer {
  background-color: #ffffff !important;
  background-image: none !important;
  color: #000000 !important;
}

/* ALL text elements: Pure Black */
body,
h1, h2, h3, h4, h5, h6,
p, span, a, label, strong, b, em, i, dt, dd, summary,
.text-foreground,
.text-muted-foreground,
.text-white,
.text-gold,
[class*="text-foreground"],
[class*="text-white"],
[class*="text-muted"],
[class*="text-gold"] {
  color: #000000 !important;
}

/* Highlighted font italic styling */
.font-serif-italic.text-gold,
.text-gold {
  color: #000000 !important;
}

/* Link hover */
a:hover {
  color: #52525b !important;
}

/* Background utility classes that were dark */
.bg-background,
.bg-background\\/70,
.bg-background\\/90,
.bg-card\\/85 {
  background-color: #ffffff !important;
}

/* Cards & containers: White with clean subtle borders */
[class*="bg-card"],
[class*="rounded-3xl"][class*="border"],
[class*="rounded-2xl"][class*="border"] {
  background-color: #ffffff !important;
  border-color: rgba(0, 0, 0, 0.15) !important;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.07) !important;
}

/* Primary CTA Buttons (Black background with White text for maximum luxury contrast) */
.bg-gold {
  background-color: #000000 !important;
  color: #ffffff !important;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3) !important;
}
.bg-gold:hover {
  background-color: #27272a !important;
  color: #ffffff !important;
}
.bg-gold * {
  color: #ffffff !important;
}

/* Secondary CTA Buttons */
[class*="border-foreground"] {
  border-color: rgba(0, 0, 0, 0.35) !important;
  color: #000000 !important;
}
[class*="border-foreground"]:hover {
  border-color: #000000 !important;
  background-color: #f4f4f5 !important;
}

/* Sticky floating bottom bar */
.fixed.inset-x-0.bottom-0 .bg-background\\/90 {
  background-color: #ffffff !important;
  border: 1px solid rgba(0, 0, 0, 0.15) !important;
  box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.15) !important;
}
.fixed.inset-x-0.bottom-0 span {
  color: #000000 !important;
}

/* FAQ Accordion */
.faq-item {
  background: #ffffff !important;
  border-color: rgba(0, 0, 0, 0.15) !important;
  box-shadow: 0 10px 25px -10px rgba(0, 0, 0, 0.06) !important;
  color: #000000 !important;
}
.faq-item:hover {
  border-color: rgba(0, 0, 0, 0.35) !important;
  box-shadow: 0 14px 30px -10px rgba(0, 0, 0, 0.1) !important;
}
.faq-item[open] {
  background: #fafafa !important;
  border-color: rgba(0, 0, 0, 0.3) !important;
}
.faq-question {
  color: #000000 !important;
}
.faq-answer p {
  color: #27272a !important;
}
.faq-icon::before,
.faq-icon::after {
  background: #000000 !important;
}
.faq-glow {
  opacity: 0 !important;
}

/* Testimonial carousel prev/next controls */
#testimonial-prev,
#testimonial-next {
  background-color: #ffffff !important;
  border: 1px solid rgba(0, 0, 0, 0.2) !important;
  color: #000000 !important;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08) !important;
}
#testimonial-prev svg,
#testimonial-next svg {
  stroke: #000000 !important;
}
#testimonial-dots button.bg-gold {
  background-color: #000000 !important;
}
#testimonial-dots button.bg-white\\/30 {
  background-color: rgba(0, 0, 0, 0.2) !important;
}

/* SVGs and icons */
svg {
  color: #000000;
}
svg path[stroke="currentColor"],
svg[stroke="currentColor"] {
  stroke: #000000 !important;
}

/* Before / After Slider */
#ba-handle-line {
  background-color: #000000 !important;
}
#ba-handle-dot {
  background-color: #ffffff !important;
  border: 2px solid #000000 !important;
  color: #000000 !important;
}
#ba-handle-dot svg {
  stroke: #000000 !important;
}

/* Logo contrast on white */
header img, footer img {
  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.1));
}
"""

def update_css():
    with open('css/styles.css', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Strip any previous custom theme block
    marker = "/* === CUSTOM THEME"
    if marker in content:
        content = content[:content.find(marker)]
    
    content += "\n\n/* === CUSTOM THEME: WHITE BACKGROUND & BLACK TEXT === */\n" + THEME_CSS
    
    with open('css/styles.css', 'w', encoding='utf-8') as f:
        f.write(content)
    print("[OK] Updated css/styles.css")

def update_index():
    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    style_tag = f'<style id="theme-white-black">{THEME_CSS}</style>'
    
    # Remove older theme tags if present
    html = re.sub(r'<style id="theme-white-[^"]+">.*?</style>', '', html, flags=re.DOTALL)
    
    html = html.replace('</head>', f'{style_tag}</head>')

    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("[OK] Updated index.html")

def update_subpages():
    for page in ['help/index.html', 'privacy/index.html', 'terms/index.html']:
        with open(page, 'r', encoding='utf-8') as f:
            html = f.read()
            
        subpage_theme = """
<style id="subpage-theme-white-black">
  :root {
    --background: #ffffff !important;
    --foreground: #000000 !important;
    --card: #ffffff !important;
    --muted-foreground: #3f3f46 !important;
    --gold: #000000 !important;
    --border: rgba(0, 0, 0, 0.15) !important;
    --grad-hero: #ffffff !important;
    --grad-gold: linear-gradient(135deg, #000000, #27272a, #52525b) !important;
  }
  html, body, main {
    background: #ffffff !important;
    color: #000000 !important;
  }
  h1 {
    color: #000000 !important;
    background: none !important;
    -webkit-text-fill-color: #000000 !important;
  }
  h2, h3, h4, p, span, li, a, label {
    color: #000000 !important;
  }
  a:hover {
    color: #52525b !important;
  }
  .faq-item {
    border: 1px solid rgba(0, 0, 0, 0.15) !important;
    background: #ffffff !important;
    color: #000000 !important;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05) !important;
  }
  .faq-item h3 {
    color: #000000 !important;
  }
  .faq-item p {
    color: #27272a !important;
  }
</style>
"""
        html = re.sub(r'<style id="subpage-[^"]+">.*?</style>', '', html, flags=re.DOTALL)
        html = html.replace('</head>', f'{subpage_theme.strip()}</head>')
            
        with open(page, 'w', encoding='utf-8') as f:
            f.write(html)
        print(f"[OK] Updated {page}")

if __name__ == '__main__':
    update_css()
    update_index()
    update_subpages()
