# Quick Experiences v1: list + Mughal arch (backup)

This is the version of section 9 (Quick Experiences, `data-sec="spinner"`) as it stood on 26 Oct 2026, before the arcade rail replaced it as the default.

**Retired on 26 Oct 2026.** The arcade rail replaced it and all v1 code was removed from the site. This folder is the only copy.

These files are the frozen copy:

| File | Where it lived in the site |
|---|---|
| `section.html` | The `<section data-sec="spinner">` markup in `index.html` (the `.mn-quick` block) |
| `quick.css` | The "8. Quick Experiences" block in `css/sections.css` |
| `components-quick.js` | `initQuick` and `window.mnQuick` at the end of `js/components.js` |
| `motion-quick.js` | The two Quick Experiences blocks in `js/motion.js` (desktop wipe + hold, and phone intro) |

## Bringing v1 back

1. Put `section.html` back inside `<section data-sec="spinner">` in `index.html`, in place of the `.mn-arcade` block.
2. Add `quick.css` to `css/sections.css` in place of the "8. Quick Experiences" arcade block.
3. Add `components-quick.js` to `js/components.js` in place of the arcade block (`initArcade`).
4. Put the two blocks in `motion-quick.js` back into `js/motion.js`, in place of the arcade blocks.
5. Run `tools/test/legacy/quick-experiences-v1.mjs`, then the Originals and testimonials suites.

Keep CRLF line endings in the CSS and JS files.
