import re

THEME_CSS = """
/* ==========================================================================
   CUSTOM THEME: WHITE BACKGROUND & RED TEXT
   ========================================================================== */
:root {
  --background: #ffffff !important;
  --foreground: #dc2626 !important;
  --card: #ffffff !important;
  --card-foreground: #dc2626 !important;
  --popover: #ffffff !important;
  --popover-foreground: #dc2626 !important;
  --primary: #dc2626 !important;
  --primary-foreground: #ffffff !important;
  --secondary: #fff1f2 !important;
  --secondary-foreground: #dc2626 !important;
  --muted: #fef2f2 !important;
  --muted-foreground: #ef4444 !important;
  --accent: #dc2626 !important;
  --accent-foreground: #ffffff !important;
  --destructive: #b91c1c !important;
  --destructive-foreground: #ffffff !important;
  --border: rgba(220, 38, 38, 0.2) !important;
  --input: #fee2e2 !important;
  --ring: #dc2626 !important;
  --gold: #dc2626 !important;
  --gold-soft: rgba(220, 38, 38, 0.15) !important;
  --grad-hero: #ffffff !important;
  --grad-gold: linear-gradient(135deg, #dc2626, #ef4444, #b91c1c) !important;
  --artvia-ivory: #ffffff !important;
  --artvia-muted: #ef4444 !important;
  --artvia-gold: #dc2626 !important;
  --artvia-gold-soft: rgba(220, 38, 38, 0.15) !important;
  --artvia-black: #ffffff !important;
  --color-background: #ffffff !important;
  --color-foreground: #dc2626 !important;
}

/* Base page background & text */
html,
body,
main,
.site-content,
.bg-hero,
section,
footer {
  background-color: #ffffff !important;
  background-image: none !important;
  color: #dc2626 !important;
}

/* All headings, paragraphs, labels, spans, links to RED */
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
  color: #dc2626 !important;
}

/* Italic highlights */
.font-serif-italic.text-gold,
.text-gold {
  color: #b91c1c !important;
}

/* Link hover */
a:hover {
  color: #991b1b !important;
}

/* Containers & backgrounds that were dark */
.bg-background,
.bg-background\\/70,
.bg-background\\/90,
.bg-card\\/85 {
  background-color: #ffffff !important;
}

/* Section Cards / Packaging / Boxes */
[class*="bg-card"],
[class*="rounded-3xl"][class*="border"],
[class*="rounded-2xl"][class*="border"] {
  background-color: #ffffff !important;
  border-color: rgba(220, 38, 38, 0.25) !important;
  box-shadow: 0 10px 30px -10px rgba(220, 38, 38, 0.08) !important;
}

/* Primary CTA Buttons */
.bg-gold {
  background-color: #dc2626 !important;
  color: #ffffff !important;
  box-shadow: 0 12px 28px -6px rgba(220, 38, 38, 0.45) !important;
}
.bg-gold:hover {
  background-color: #b91c1c !important;
  color: #ffffff !important;
}
.bg-gold * {
  color: #ffffff !important;
}

/* Secondary CTA Buttons */
[class*="border-foreground"] {
  border-color: rgba(220, 38, 38, 0.4) !important;
  color: #dc2626 !important;
}
[class*="border-foreground"]:hover {
  border-color: #dc2626 !important;
  background-color: #fff1f2 !important;
}

/* Sticky floating bottom bar */
.fixed.inset-x-0.bottom-0 .bg-background\\/90 {
  background-color: #ffffff !important;
  border: 1px solid rgba(220, 38, 38, 0.3) !important;
  box-shadow: 0 10px 30px -5px rgba(220, 38, 38, 0.25) !important;
}
.fixed.inset-x-0.bottom-0 span {
  color: #dc2626 !important;
}

/* FAQ Accordion Styling */
.faq-item {
  background: #ffffff !important;
  border-color: rgba(220, 38, 38, 0.3) !important;
  box-shadow: 0 10px 25px -10px rgba(220, 38, 38, 0.12) !important;
  color: #dc2626 !important;
}
.faq-item:hover {
  border-color: rgba(220, 38, 38, 0.6) !important;
  box-shadow: 0 14px 30px -10px rgba(220, 38, 38, 0.2) !important;
}
.faq-item[open] {
  background: #fff8f8 !important;
  border-color: rgba(220, 38, 38, 0.5) !important;
}
.faq-question {
  color: #dc2626 !important;
}
.faq-answer p {
  color: #b91c1c !important;
}
.faq-icon::before,
.faq-icon::after {
  background: #dc2626 !important;
}
.faq-glow {
  opacity: 0 !important;
}

/* Testimonial slider prev/next controls */
#testimonial-prev,
#testimonial-next {
  background-color: #ffffff !important;
  border: 1px solid rgba(220, 38, 38, 0.35) !important;
  color: #dc2626 !important;
  box-shadow: 0 4px 14px rgba(220, 38, 38, 0.15) !important;
}
#testimonial-prev svg,
#testimonial-next svg {
  stroke: #dc2626 !important;
}
#testimonial-dots button.bg-gold {
  background-color: #dc2626 !important;
}
#testimonial-dots button.bg-white\\/30 {
  background-color: rgba(220, 38, 38, 0.25) !important;
}

/* SVGs and icons */
svg {
  color: #dc2626;
}
svg path[stroke="currentColor"],
svg[stroke="currentColor"] {
  stroke: #dc2626 !important;
}

/* Before / After Slider */
#ba-handle-line {
  background-color: #dc2626 !important;
}
#ba-handle-dot {
  background-color: #ffffff !important;
  border: 2px solid #dc2626 !important;
  color: #dc2626 !important;
}
#ba-handle-dot svg {
  stroke: #dc2626 !important;
}

/* Logo red tint if desired */
header img, footer img {
  filter: drop-shadow(0 2px 8px rgba(220, 38, 38, 0.15));
}
"""

def apply_to_styles_css():
    with open('css/styles.css', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove previous theme block if exists
    marker = "/* === CUSTOM THEME"
    if marker in content:
        content = content[:content.find(marker)]
    
    content += "\n\n/* === CUSTOM THEME: WHITE BACKGROUND & RED TEXT === */\n" + THEME_CSS
    
    with open('css/styles.css', 'w', encoding='utf-8') as f:
        f.write(content)
    print("[OK] Updated css/styles.css")

def apply_to_index_html():
    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # Insert <style id="theme-white-red"> before </head>
    style_tag = f'<style id="theme-white-red">{THEME_CSS}</style>'
    
    if '<style id="theme-white-red">' in html:
        # replace existing
        html = re.sub(r'<style id="theme-white-red">.*?</style>', style_tag, html, flags=re.DOTALL)
    else:
        html = html.replace('</head>', f'{style_tag}</head>')

    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("[OK] Updated index.html with theme style tag")

def apply_to_subpages():
    for page in ['help/index.html', 'privacy/index.html', 'terms/index.html']:
        with open(page, 'r', encoding='utf-8') as f:
            html = f.read()
            
        subpage_theme = """
<style id="subpage-white-red-theme">
  :root {
    --background: #ffffff !important;
    --foreground: #dc2626 !important;
    --card: #ffffff !important;
    --muted-foreground: #ef4444 !important;
    --gold: #dc2626 !important;
    --border: rgba(220, 38, 38, 0.25) !important;
    --grad-hero: #ffffff !important;
    --grad-gold: linear-gradient(135deg, #dc2626, #ef4444, #b91c1c) !important;
  }
  html, body, main {
    background: #ffffff !important;
    color: #dc2626 !important;
  }
  h1 {
    color: #dc2626 !important;
    background: none !important;
    -webkit-text-fill-color: #dc2626 !important;
  }
  h2, h3, h4, p, span, li, a, label {
    color: #dc2626 !important;
  }
  a:hover {
    color: #991b1b !important;
  }
  .faq-item {
    border: 1px solid rgba(220, 38, 38, 0.25) !important;
    background: #ffffff !important;
    color: #dc2626 !important;
    box-shadow: 0 4px 15px rgba(220, 38, 38, 0.08) !important;
  }
  .faq-item h3 {
    color: #dc2626 !important;
  }
  .faq-item p {
    color: #b91c1c !important;
  }
</style>
"""
        if '<style id="subpage-white-red-theme">' in html:
            html = re.sub(r'<style id="subpage-white-red-theme">.*?</style>', subpage_theme.strip(), html, flags=re.DOTALL)
        else:
            html = html.replace('</head>', f'{subpage_theme.strip()}</head>')
            
        with open(page, 'w', encoding='utf-8') as f:
            f.write(html)
        print(f"[OK] Updated {page}")

if __name__ == '__main__':
    apply_to_styles_css()
    apply_to_index_html()
    apply_to_subpages()
