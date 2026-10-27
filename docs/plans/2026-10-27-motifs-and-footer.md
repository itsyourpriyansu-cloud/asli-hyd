# Plan: Asli motif system + "Hyderabad skyline" footer

> **Amended during the build (27 Oct 2026):** after seeing the first version (footer replaced by a logo niche over the skyline), the user asked for the recommended option instead: **keep the existing footer content and add the skyline band beneath it**, with only "Design by Envizon" on its ground band. The niche was removed from the footer (it stays in the kit as `m-niche`). The sprite is an external file (`assets/img/motifs.svg`) rather than inline in `index.html`. Section 4 below describes the first version; see PROJECT-CONTEXT §3 for what shipped.

## Context

The user shared 8 reference images (an embroidered jharokha, a miniature-style corner border, a sandstone niche with marble inlay, flat nested arches, a pietra-dura lotus vine, a chikan/block-print motif sheet, a Taj-style inlay study plate, and a brown layered Hyderabad skyline). They want:
1. The ideas and structure pulled out of the images, so the landing page can use **one consistent and distinctive ornament language**.
2. A **new footer that replaces the current one entirely**: a minimal, traditional, artistic skyline (structured like image 8), animated, with no extra text, and a **"Design by Envizon"** credit linking to `https://envizonstudio.com`.

Decisions from the user: replace the footer; build the **motif library + footer now** and apply the motifs to other sections later, one section at a time when named; use the **gold + inlay accents** palette, with the skyline in layered warm browns on cream.

## 1. What the images give us (analysis, recorded in `docs/MOTIFS.md`)

| # | Reference | Structure extracted | Becomes |
|---|---|---|---|
| 1 | Embroidered jharokha | Ogee-crowned **cusped arch** → nested frame bands → grid of floral niches → central lattice window → **beaded plinth** strip | `arch-ogee` symbol; beaded divider |
| 2 | Miniature corner border | Ornament packed into the **corners and base**, a large empty cream field for content; paisley, lotus, peacock, chhatri domes; gold filigree fading out | Rule: ornament frames the content and never fills the field. Corner-cluster composition |
| 3 | Sandstone niche, marble inlay | Rectangle frame (double rule) → **multifoil arch line** → lotus finial at the apex → lily tendrils in the spandrels | `arch-cusped`, `lotus-finial` and `tendril` symbols; the footer's logo niche |
| 4 | Flat nested arches | Two **flat silhouettes** (scalloped outer, cusped inner), two tones, content centred | Flat two-tone arch for text windows and buttons |
| 5 | Pietra-dura lotus vine | Mirror-symmetric gold scroll lattice with lotus blooms in stone colours | `vine` all-over tile (low opacity) |
| 6 | Motif sheet | A *vocabulary*: vertical stitch border, tree-of-life vine, sprig, stripe, wave scroll, arch-with-tree, diagonal buti lattice, multi-layer borders | The kit's taxonomy: **borders / verticals / fills / centrepieces** |
| 7 | Inlay study plate | **Stone palette** (marble, lapis, carnelian, jasper, malachite, onyx); a horizontal inlay border strip; fine rules and roman-numeral plate labels | Stone accent tokens; `inlay` border |
| 8 | Brown skyline | **3 depth tiers** (pale back, mid, dark front) + a dark ground band; landmarks spaced with palms; birds; ends with Kakatiya Kala Thoranam | The footer |

**System rules** (consistent but distinctive): fine gold line on cream; ornament in corners, edges and seams only; stone colours appear only as tiny inlay dots (no more than about 3% of any surface); every arch is either the existing pointed Mughal arch or the new cusped multifoil; motifs draw themselves (pathLength stroke) when they enter, and render complete with reduced motion.

## 2. Tokens (added to `css/base.css` `:root`)

- Stones: `--stone-lapis #2c4a7e`, `--stone-carnelian #b4532f`, `--stone-malachite #2f6e52`, `--stone-jasper #d39a3a`.
- Skyline: `--sky-far #e2cbab`, `--sky-mid #bf916a`, `--sky-near #7a4b36`, `--sky-ground #4d3024`, `--sky-glow #efdcc2`.
- `--footer-bg` (only footer.css uses it): `#e8f3e5` → `var(--cream)`.

## 3. Motif kit (new; nothing in existing sections changes)

- **`css/motifs.css`** (CRLF, banner comments, linked after sections.css): utilities built from SVG data-URIs:
  - `.mn-m-inlay` (horizontal strip: gold vine with stone dots, repeat-x);
  - `.mn-m-beads` (beaded plinth);
  - `.mn-m-scallop` (cusped edge mask for a section's top or bottom edge);
  - `.mn-m-vine` (pietra-dura tile);
  - `.mn-m-lattice` (diagonal buti);
  - `.mn-m-jaali` (the existing khatam tile as a utility, for new uses only; existing copies stay as they are);
  - `--m-arch-cusped` (mask URL, like the current pointed-arch mask).
- **SVG sprite** (hidden `<svg>` at the top of `<body>` in `index.html`): `<symbol>`s for `m-arch-cusped`, `m-arch-ogee`, `m-lotus`, `m-tendril`, `m-paisley`, `m-rosette` (khatam star), `m-sprig`, `m-stitch`. Used as `<svg><use href="#m-…"/></svg>`. Every stroke uses `pathLength="1"` so the existing draw pattern works.
- **`docs/motifs.html`**: a specimen sheet (laid out like image 6) showing every motif at size with its class or symbol name, for review and picking. Uses `../css/base.css` and `../css/motifs.css`; `noindex`.
- **`docs/MOTIFS.md`**: the analysis above, the rules, the tokens, and a **per-section proposal map** for later rounds. Proposals only, for example: an inlay seam where two cream sections meet without a curtain; a cusped arch on the numbers card corners; a vine tile behind the Originals panel; a paisley corner cluster in Co-curated; scalloped top edges on cards. Nothing in the map is built now.

## 4. Footer: "Hyderabad, at dusk"

Replace the inner markup of `<footer class="mn-footer">` (`index.html` ~1010–1043) and rewrite `css/footer.css`.

**Composition, top to bottom (all on cream):**
1. **Inlay seam:** a full-width `.mn-m-inlay` strip, gold vine and stone dots, with a scalloped edge above it. It marks the move from the dark closing CTA to the cream footer.
2. **Logo niche** (images 3 and 4): a flat pale-sand cusped arch, with a fine gold multifoil arch line, a lotus finial and mirrored spandrel tendrils inside it. The **Asli logo** sits in the arch (`asli-logo-trimmed.png`, links to `/`).
3. **Skyline band** (image 8 structure, new original SVG; one inline SVG, viewBox about 2400×560, ground at the bottom):
   - **Far tier** (`--sky-far`): Golconda fort on its hill, the Qutb Shahi tomb domes, the Osmania High Court domes, the HITEC towers, the Durgam Cheruvu cable-stay pylon.
   - **Mid tier** (`--sky-mid`): Mecca Masjid, Chowmahalla, the Telangana Assembly, palms.
   - **Near tier** (`--sky-near`): Charminar (the focal point, left of centre), the Buddha on Hussain Sagar with water lines, Kakatiya Kala Thoranam (closes the right end, as in the reference), palms.
   - **Sky details:** a pale gold sun disc behind Charminar, and 5 birds.
   - Landmark proportions are adapted from the existing "400 years" skyline paths (`index.html` 448–481), closed into silhouettes and scaled.
   - `aria-hidden`; the footer gets an accessible label instead.
4. **Ground band** (`--sky-ground`, about 5.6rem): one quiet row in cream at 60–70%: `© 2026 Asli Hyderabad` · `Photo credits` (kept: CC BY/BY-SA photos need a reachable credit, `credits.html`) · `Design by Envizon` (`https://envizonstudio.com`, `target="_blank" rel="noopener"`, gold hairline underline that draws on hover).

**Removed** (the user chose to replace the footer entirely): the tagline, the contact list, the three link columns, the Privacy/Terms placeholders and Partner login. The header still carries contact details and navigation.

**Motion** (`js/motion.js`, a new IIFE in the all-sizes area near Heritage; `prefers-reduced-motion` already exits early, so everything shows complete):
- **Entrance**, once, when the footer top is below 85% of the viewport height:
  - the inlay strip draws outward from the centre (clip-path), and the stone dots pop in a stagger;
  - the gold arch line draws (`strokeDashoffset 1→0`, `autoRound: false`), the lotus blooms (scale .6→1) and the tendrils draw;
  - the logo rises in.
- **Scrubbed depth:**
  - a ScrollTrigger on the footer (`start 'top bottom'`, `end 'bottom bottom'`, `scrub`) raises the tiers from the ground at different rates: far 90px, mid 55px, near 25px, then all reach 0;
  - the sun rises 60px;
  - so the city "stands up" as you reach the end of the page, and scrolling back reverses it.
- **Ambient** (CSS keyframes, paused by `animation-play-state` while off screen via an IntersectionObserver in `components.js`):
  - the birds glide slowly and flap their wings (scaleY);
  - the Hussain Sagar water lines shimmer (dash offset);
  - after the rise, a few gold window lamps in the near tier fade in.
  - All ambient effects are off with reduced motion.

**Responsive:**
- ≥1025px: the full band, about 34–40vh.
- 750–1024px: the same band, shorter.
- ≤749px: the skyline SVG is `preserveAspectRatio="xMidYMax slice"` at a fixed height (about 22rem), centred so Charminar, the Buddha and the Thoranam stay in view; the niche is smaller; the ground row stacks into 2 centred lines.
- No horizontal scroll at any width.

## 5. Files

| File | Change |
|---|---|
| `index.html` (LF) | Hidden SVG sprite after `<body>`; footer markup replaced; `css/motifs.css` link |
| `css/base.css` | Stone and skyline tokens; `--footer-bg` → cream |
| `css/motifs.css` | **New**: the motif utilities |
| `css/footer.css` | Rewritten for the new footer |
| `js/motion.js` | Footer entrance + scrubbed tiers (new IIFE, existing code untouched) |
| `js/components.js` | Pause ambient animation off screen (small IO block) |
| `docs/MOTIFS.md`, `docs/motifs.html` | **New**: analysis, rules, specimen sheet, section proposal map |
| `docs/PROJECT-CONTEXT.md` | Footer row in the section map; motif kit under Reusable patterns |
| `tools/test/footer.mjs` | **New** suite |
| `docs/plans/2026-10-27-motifs-and-footer.md` | This plan, archived on approval |

No new third-party imagery: every motif and the skyline are original SVG drawn for this site, so there are no SOURCES entries to add.

## 6. Verification

1. `node server.js <own port>`; `node --check js/*.js`.
2. New `tools/test/footer.mjs` (on `cdp.mjs`), at 1440×900, 1280×720 and 390×844 (touch):
   - walk to the page bottom;
   - assert the arch path `strokeDashoffset` is 0, every tier's transform is at rest, and the logo is visible;
   - Envizon link `href`/`target`/`rel` are correct, and Photo credits resolves (200);
   - `docW === vw`; console clean;
   - a `--reduce` run renders everything complete with no ambient animation;
   - scroll back up 400px and check the tiers lowered (scrub reverses).
3. `shot.mjs`-style screenshots of the footer at the 3 sizes, plus `docs/motifs.html` at 1440. Look at every screenshot myself.
4. Re-run `tools/test/finale.mjs` (Heritage is the footer's neighbour) and spot-check that the page above is unchanged.
5. Report: what changed (links), what the user sees, test results, open items (other sections waiting for the user to name them).
