# ArtDrop - Wallpapers (Exact 1:1 Website Clone)

An exact 1:1, pixel-perfect clone of **[artdrop.pro](https://artdrop.pro/)**.

---

## 🚀 Features & Included Sections

1. **Exact Design & Aesthetic**:
   - Impasto oil-painting gallery aesthetic, dark luxury theme, gold accents, and serif headings.
   - Exact typography with loaded Google variable web fonts (`Karla` & `Cormorant Garamond`).

2. **Full Interactivity & Dynamic Components**:
   - **Hero Infinite Marquee Showcase**: Continuous animated gallery displaying mockups on laptops and phones with real-time CSS animations.
   - **Interactive Before & After Comparison Slider**: Interactive draggable handle comparing standard wallpapers vs ArtDrop impasto texture.
   - **YouTube Video Facade**: Fast lightweight placeholder with full embed video player on click.
   - **Customer Reviews Carousel**: Auto-playing testimonial carousel with next/previous controls and pagination dots.
   - **Interactive FAQ Accordion**: Expandable FAQ items with smooth animations and auto-collapse.
   - **Sticky Floating Offer Bar**: Bottom bar with countdown/trigger revealing smoothly on scroll.

3. **Complete Asset Suite (100% Local & Self-Contained)**:
   - All 93+ WebP / JPG images (both standard and `-mobile` responsive versions).
   - High-fidelity vector logos & badges.
   - Local WOFF2 font files for zero layout shift.
   - Compiled Tailwind production stylesheet (`css/styles.css`).

4. **Included Subpages**:
   - `help/index.html` (Help Center / FAQ)
   - `privacy/index.html` (Privacy Policy)
   - `terms/index.html` (Terms of Service)

---

## 📁 Project Structure

```
ArtDrop/
├── index.html                   # Main Landing Page
├── css/
│   └── styles.css               # Full Stylesheet
├── fonts/
│   ├── cormorant-garamond-latin-wght-italic.woff2
│   ├── cormorant-garamond-latin-wght-normal.woff2
│   └── karla-latin-wght-normal.woff2
├── images/                      # 93+ High Quality WebP/JPG/PNG Images
├── js/
│   └── pixel.js
├── help/
│   └── index.html               # Help / Support Page
├── privacy/
│   └── index.html               # Privacy Policy Page
├── terms/
│   └── index.html               # Terms of Service Page
├── start_server.bat             # 1-Click Server Launcher
└── README.md
```

---

## ⚡ How to Run

### Method 1: Double-Click (Windows)
Double-click [`start_server.bat`](start_server.bat) to launch the server at `http://localhost:8000`.

### Method 2: Python HTTP Server (CLI)
Open terminal in this directory and run:
```bash
python -m http.server 8000
```
Then open [http://localhost:8000](http://localhost:8000) in your browser.

### Method 3: Direct File Opening
You can also directly double-click [`index.html`](index.html) to open it in any web browser.
