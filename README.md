# Elvee Jewels — redesigned static website

A modern-luxury redesign of the Elvee Jewels site, built as plain HTML, CSS and JavaScript with no build step required to view it.

## Preview

```bash
node tools/serve.js
# open http://localhost:4173
```

Or simply open `index.html` in a browser (a local server is recommended so relative paths and form links behave normally).

## Pages

| File | Page |
| --- | --- |
| `index.html` | Home |
| `about.html` | About Us |
| `careers.html` | Careers |
| `contact.html` | Contact Us |
| `terms.html` | Terms and Conditions |
| `customer-services.html` | Customer Services |
| `appointment.html` | Book an Appointment |
| `customize.html` | Customize |
| `faq.html` | FAQ |

Also included: `robots.txt` and `sitemap.xml`.

## Source files

- `tools/build.js` — single source of truth for the shared header, footer, SEO head tags and all page content. Run `node tools/build.js` after editing it to regenerate the static HTML files.
- `tools/serve.js` — tiny zero-dependency local static server.
- `assets/css/styles.css` — all styling, responsive rules and motion preferences.
- `assets/js/main.js` — carousel, scroll reveals, counters, mobile nav, progress bar, back-to-top and form handling.
- `assets/images/` — locally stored copies of the original site's logo, banners and slider images, so nothing depends on a remote host.

## Issues fixed from the original site

- **Broken API call / console error** — removed; the site is fully static and makes no runtime API requests.
- **Blocked third-party webfont** — replaced with a system font stack (no external font fetch).
- **Images that failed to load** — downloaded locally, given explicit dimensions, alt text, lazy loading and a gradient fallback for hero slides.
- **Mixed/insecure asset references** — all assets are local relative paths.
- **Missing `<main>` landmark** — added on every page, plus a skip link.
- **Buttons without accessible names** — carousel controls, mobile menu and back-to-top all have labels; brand links have accessible names matching their visible text.
- **Low-contrast text** — corrected the gold-on-dark footer brand detail.
- **SEO basics** — per-page titles, meta descriptions, Open Graph tags, JSON-LD, robots.txt and sitemap.xml.
- **Forms that went nowhere** — forms validate inline and open the visitor's email app with the message prefilled to `info@elvee.in`. No backend required.

Lighthouse on the homepage: **Accessibility 100, Best Practices 100, SEO 100**, with no console errors across all nine pages.

## Animations added

- Crossfading hero carousel with slow Ken Burns zoom, arrows, dots, autoplay, hover/focus pause and keyboard arrows.
- Scroll-triggered fade-and-rise reveals with staggered delays.
- Count-up statistics.
- Animated specialty marquee.
- Card hover lift with a gold shine sweep.
- Hover zoom-in on all content images and hero slides, clipped inside their frames.
- Interactive collections explorer on the homepage: accessible tabs swap large preview imagery, copy, spec chips and CTAs with a crossfade.
- Animated side-curve rails with flowing dashed paths and floating ring/diamond/dot shapes.
- Large drifting arcs in the hero and page headers, plus curved outlines on section edges.
- Animated scroll-progress bar and back-to-top button.
- FAQ accordion icon animation.
- Form status feedback and button micro-interactions.

All motion is disabled automatically when the visitor has **Reduce Motion** enabled in their operating system.

## Customisation notes

- Brand colours, fonts and the corner-radius scale (`--radius-sm: 8px`, `--radius-md: 16px`, `--radius-lg: 24px`) live in the `:root` block at the top of `assets/css/styles.css`. Small buttons/controls use 8px, standard buttons and framed images 16px, and large images/hero/social tiles 24px. Circular controls intentionally keep `50%`.
- Contact details appear in `tools/build.js` (`brand` object) — edit there and regenerate.
- The Terms page contains clearly marked placeholder legal copy; replace it with approved wording before launch.
- Social links currently point to the platform homepages. Replace them with the real Elvee profile URLs in `tools/build.js`.
- If deploying under a subpath, adjust asset paths and the `url` values in `sitemap.xml`.
