# 0xwi11iam — Personal Portfolio & Project Showcase

Dark, minimalist portfolio site for **William Jiang (0xwi11iam)** — security researcher,
systems programmer, and AI red-teaming architect based in Hong Kong.

## Stack

- Static HTML + CSS + vanilla JS (no build step)
- **Instrument Serif** (Google Fonts) for headings
- **Gotham Medium** (local `.otf` in `Gotham Medium/`) for body text
- CSS custom properties for full theming
- Deployed on Vercel with clean URLs

## Project structure

```
├── index.html          # Landing: hero, stats, project grid, stack, philosophy
├── projects.html       # Full 6-project deep dive
├── about.html          # Researcher profile, philosophy, capabilities
├── styles/main.css     # Design system + responsive styles
├── assets/js/main.js   # Typewriter, reveal, filters, nav, terminal boot
├── assets/favicon.svg  # Brand mark
├── Gotham Medium/      # Local Gotham Medium.otf (self-hosted)
└── vercel.json         # Clean URLs, security headers, caching
```

## Local preview

`python3 -m http.server` serves files but does **not** rewrite `/projects` → `projects.html`
(clean URLs are a Vercel feature). For clean URLs locally, use:

```bash
npx serve .
```

Then visit `http://localhost:3000` — links like `/projects` and `/about` resolve correctly.

