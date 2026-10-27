# The Asli motif kit

One ornament language for the homepage, pulled from the client's eight reference images (27 Oct 2026). The goal is **consistent but distinctive**: every section speaks the same vocabulary of fine gold line, cusped arches and set stones, and each one uses it differently.

- **Code:** [`css/motifs.css`](../css/motifs.css) (utilities and tokens), [`assets/img/motifs.svg`](../assets/img/motifs.svg) (sprite).
- **Geometry:** [`tools/assets/motifs.mjs`](../tools/assets/motifs.mjs) generates the tiles, the sprite and the niche paths; [`tools/assets/footer-skyline.mjs`](../tools/assets/footer-skyline.mjs) draws the footer skyline.
- **Specimen sheet:** [`docs/motifs.html`](motifs.html) (open it through `server.js`).

## 1. What each reference gives us

| # | Reference | Structure | In the kit |
|---|---|---|---|
| 1 | Embroidered jharokha | Ogee-crowned **cusped arch**; nested frame bands; a grid of floral niches; a central lattice window; a **beaded plinth** | `m-arch-ogee`, `.mn-m-beads` |
| 2 | Miniature corner border | Ornament packed into the **corners and the base** (paisley, lotus, peacock, chhatri domes) around a large empty cream field; gold filigree fading out | The composition rule (§2); `m-paisley`, `m-lotus` for corner clusters |
| 3 | Sandstone niche with marble inlay | A rectangle in a double rule; a **multifoil arch line**; a lotus finial at the apex; lily tendrils in the spandrels | `m-arch-cusped`, `m-niche`, `m-tendril`, `m-lotus` |
| 4 | Flat nested arches | Two **flat silhouettes**, a scalloped outer arch and a cusped inner arch, in two tones, with the content centred | `.mn-m-arch` mask; `.mn-m-scallop` edge |
| 5 | Pietra-dura lotus vine | A mirror-symmetric gold scroll lattice with lotus blooms in stone colours | `.mn-m-vine` |
| 6 | Motif sheet | A **vocabulary**: vertical stitch border, tree-of-life vine, sprig, stripe, wave scroll, arch-with-tree, diagonal buti lattice, multi-layer borders | The kit's taxonomy (borders / verticals / fills / centrepieces); `m-stitch`, `m-sprig`, `.mn-m-lattice` |
| 7 | Inlay study plate | The **stone palette** (marble, lapis, carnelian, jasper, malachite, onyx); a horizontal inlay border; fine rules and plate labels | `--stone-*` tokens; `.mn-m-inlay` |
| 8 | Brown skyline | **Three depth tiers** (pale back, mid, dark front) on a dark ground band; landmarks spaced with palms; birds; Kakatiya Kala Thoranam at the end | The footer skyline band |

## 2. Rules

1. **Gold line on cream.** Strokes are 1px-ish gold (`--gold`, `--gold-light` on dark). Fills stay flat and quiet: cream, sand `#efe2cd`, or the skyline browns.
2. **Stones are dots, never fields.** Lapis, carnelian and malachite appear only as set stones, no more than about 3% of any surface.
3. **Ornament frames, never fills.** Corners, edges, seams and the space around a heading, as in reference 2. The content field stays clear (`.mn-m-fade`).
4. **Two arches only:** the existing pointed Mughal arch (Quick Experiences, testimonials) and the new cusped multifoil. Don't invent a third.
5. **It draws itself.** Strokes carry `pathLength="1"`. Tween `strokeDashoffset` 1 → 0 with `autoRound: false`, once, when the motif enters. Reduced motion shows it complete.
6. **One accent per section.** Pick one motif per section so the page stays restrained. The khatam jaali stays the recurring texture.

## 3. Tokens (`css/base.css`)

| Token | Value | Use |
|---|---|---|
| `--stone-lapis` | `#2c4a7e` | set stones |
| `--stone-carnelian` | `#b4532f` | set stones |
| `--stone-malachite` | `#2f6e52` | set stones |
| `--stone-jasper` | `#d39a3a` | reserved |
| `--sky-far` / `--sky-mid` / `--sky-near` | `#e2cbab` / `#bf916a` / `#7a4b36` | skyline tiers |
| `--sky-ground` / `--sky-glow` | `#4d3024` / `#efdcc2` | ground band, horizon glow, lit openings |

## 4. The kit

| Kind | Name | How |
|---|---|---|
| Border | `.mn-m-inlay` | A 2rem strip: two rules and a vine set with stones |
| Border | `.mn-m-beads` | A 1.2rem beaded plinth |
| Edge | `.mn-m-scallop` | Cusped lobes in `currentColor`; set `color` to the neighbouring background |
| Fill | `.mn-m-vine`, `.mn-m-lattice`, `.mn-m-jaali` | An absolute layer, opacity `--m-o` (default .14); add `.mn-m-fade` to clear the centre |
| Mask | `.mn-m-arch` | Cusped-arch mask for photos (400 × 500 box, like the pointed arch) |
| Symbol | `m-arch-cusped`, `m-arch-ogee`, `m-niche`, `m-lotus`, `m-tendril`, `m-paisley`, `m-rosette`, `m-sprig`, `m-stitch` | `<svg class="mn-m-sym" viewBox="…"><use href="assets/img/motifs.svg#m-lotus"/></svg>`; colour from `color`, line from `stroke-width`; tween the `<use>`'s `stroke-dashoffset` to draw |

Built so far with the kit: **the footer** (cusped edge, inlay seam, skyline band).

## 5. Proposed placements (not built; one section at a time, when named)

Visible section numbers as in PROJECT-CONTEXT §3.

| # | Section | Proposal |
|---|---|---|
| 2 | Statement | A short `.mn-m-inlay` under the attribution instead of a plain rule |
| 4 | Conventions | `m-rosette` as the date marker on each card |
| 5 | Hyderabad, Your Way | `m-arch-ogee` hairline framing the big panel's heading |
| 6 | Numbers | Cusped-arch corners (`m-tendril` pairs) on the boxed card, over the existing jaali |
| 7 | Private Access | `m-niche` hairline around the doors before they open |
| 9 | Quick Experiences | A `.mn-m-beads` plinth under the rail |
| 10 | Originals | `.mn-m-vine` (fade) behind the right-hand panel |
| 11 | Testimonials | Set stones (`--stone-*`) on the tab timers |
| 12 | Featured Brands | `m-lotus` replaces the gold rule on each tile |
| 13 | Co-curated | A paisley + lotus corner cluster (reference 2) in the section's top corner |
| 14 | Reels | `.mn-m-scallop` top edge on the marquee band |
