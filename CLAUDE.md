# Asli Hyderabad homepage: instructions for Claude

A single-page homepage for **Asli Hyderabad** (aslihyd.in), built section by section on a GSAP/Lenis template ("Maison Nomen", hence the `mn-` classes). Plain HTML/CSS/JS, no build step.

**Before any work, read [`docs/PROJECT-CONTEXT.md`](docs/PROJECT-CONTEXT.md).** It has the section map, the code architecture, the design system, asset sources and licensing, the testing workflow, gotchas and the backlog. Content briefs: [`WIREFRAME-CONTENT.md`](WIREFRAME-CONTENT.md) (the client's wireframe) and [`LIVE-SITE-AUDIT.md`](LIVE-SITE-AUDIT.md) (the live site's data).

## Run

```
node server.js 8655     # http://127.0.0.1:8655  (Range support for video; use your own port and stop only servers you started)
```

## How the user works (non-negotiable)

1. **One section at a time.** The user names a section by screenshot, by "next section", or by its **visible position counted from the top**. Map it with the table in PROJECT-CONTEXT §3. **If there is any doubt, ask which section before editing.** Never edit a section the user did not name.
2. **`/plan` (or "plan this") means plan mode first.**
   - Research the wireframe, the live audit, the existing code and online assets.
   - Write a plan with Context / Content / Design / Code changes / Files / Verification.
   - Get approval before building.
   - Archive the approved plan in `docs/plans/YYYY-MM-DD-topic.md`.
3. **Without `/plan`, just do it.** Small edits go straight in.
4. **Keep what works.** Don't regress other sections' effects. When reusing a component, generalise it and test every instance.
5. **Verify in headless Chrome before reporting.**
   - Use `tools/test/shot.mjs` and the suites in `tools/test/`.
   - Look at the screenshots at 1440×900, 1280×720 and 390×844.
   - The console must be clean.
6. **Report briefly and honestly:** what changed (file links), what the user will see, what was tested, and any open decisions.

## Standing preferences

- **No eyebrows or extra CTAs** unless the wireframe or the user asks; the user keeps removing them.
- **Cream / ink / gold** (`#f4eee4` / `#2e3937` / `#c59a5b`, dark gold `#a97835` for text on cream). Cormorant Garamond headings with an *italic dark-gold second half*; Jost for UI. Ease `cubic-bezier(.22,1,.36,1)`.
- Reuse the **khatam jaali** pattern and Mughal-arch / fine-gold-line motifs. Restrained and premium, with room to breathe.
- **Real Hyderabad imagery, properly licensed.**
  - Use Wikimedia Commons (no NC/ND), Mixkit or Coverr.
  - **Never YouTube.** Pexels and Pixabay block scripts.
  - Inspect photos at full size: post-2019 Charminar shots usually show scaffolding.
  - Record every credit in `assets/img/SOURCES.md`, `assets/img/quick/SOURCES.md` or `VIDEO-SOURCES.md`.
- Copy comes from the wireframe and the live site. If you write copy, say so. Prices are unknown: use "Price on request".
- The user sometimes edits files by hand. Re-read before editing and never revert their changes.

## Code rules

- **`data-sec` names drive `js/motion.js`** (pins, curtains, sideways wipes). Replace a section's content inside its existing `<section data-sec="…">`. Some slots keep old names: Quick Experiences is `data-sec="spinner"`, Originals is `collection-b`, Numbers is `commission`, Private Access is `collector`, Testimonials is `materials`, Featured Brands is `logos`, Co-curated is `worlds`, Reels is `social`, the closing CTA is `heritage`.
- **Where code goes:**
  - `js/components.js`: UI behaviour.
  - `js/motion.js`: scroll choreography inside `gsap.matchMedia` blocks (≥1025px / ≤1024px / all), each pushing cleanups.
  - `prefers-reduced-motion` must still render everything complete.
- **Match the surrounding code:** `mn-` BEM classes, short "why" comments, a banner comment per section in `css/sections.css`. 1rem = 10px.
- **Line endings:** CSS/JS files are **CRLF**, `index.html` is **LF**. Preserve them when splicing with scripts.
- Inner-page links (`/originals/…`, `/experiences/…`) are placeholders and 404 locally. That is expected.
- Scratch files and screenshots go in the session scratchpad, not the repo.
