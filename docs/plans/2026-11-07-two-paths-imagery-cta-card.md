# Section 3 "Two Paths": new generated imagery + outlined CTA card

## Context
Visible section 3 (`data-sec="cats"`, [index.html:265-296](index.html), CSS [sections.css:142-240](css/sections.css)). Today it shows two 1880s Raja Deen Dayal sepia prints with a WebGL colour reveal on hover ([js/cats-reveal.js](js/cats-reveal.js)). Two problems:
1. **Imagery doesn't sell either path.** An 1880s street and an empty 1880s drawing room look like an archive, not a luxury host. The event tile shows no event.
2. **The CTA floats.** The description and the "Discover Tours" underline link sit loose over a busy photo and rely on a text shadow to stay legible.

Goal: one matched pair of generated images that reads as *"your day in the city / your evening around the conference"*, and the description and CTA grouped in a fine outlined glass card. **Keep the sepia → colour reveal**, the grow-in, the hover-widen and the click flood. They all keep working because we only swap image files and wrap two elements.

## Imagery

### The idea
**Morning and evening, one shoot.** Left: the Old City at first light, privately. Right: a palace courtyard at blue hour, set for a delegate dinner. Same lens, same grade, so the pair reads as one story: *explore by day, celebrate by night.*

### Keep the reveal and get perfect alignment for free
Generate **only the colour image** for each tile. Derive the rest-state warm monochrome from it with one ffmpeg command, so the two layers line up pixel for pixel (the old prints needed Gemini to colourise without shifting anything, which was fragile):
```
ffmpeg -nostdin -i explore-color.jpg -vf "colorchannelmixer=.393:.769:.189:0:.349:.686:.168:0:.272:.534:.131,eq=contrast=1.04:saturation=.85" -q:v 3 explore.jpg
```
Same for `event`. At rest: a warm sepia print. On hover the colour blooms through, which now shows something worth seeing (lamplight, marigolds, a lit palace).

### Format and safe zones (from the real tile boxes)
Tile image boxes range from 0.72 (phone) to 1.09 (1920 desktop, tablet) wide-to-tall. So:
- **Generate 1:1, 2048×2048**; export colour JPEG q≈82, sRGB.
- Key subject inside the **central 70% of width and 80% of height**.
- **Top 22%:** calm sky or ceiling (the 64-80px title sits top-left).
- **Bottom-right ~40%×28%:** quiet and darker (the CTA card sits there).
- `--pos` on each `<img>` fine-tunes the crop afterwards.

### Shared style block (paste into both prompts)
> Editorial luxury travel photograph for a high-end Hyderabad, India, hosting brand, in the spirit of Aman and Condé Nast Traveller photography. Photorealistic, full-frame camera, 35mm lens, natural and practical light only, gentle depth of field. Restrained, rich colour: warm sandstone, ivory lime plaster, aged brass, deep green, soft indigo, with lifted shadows and fine film grain. Calm composition with generous negative space: the top fifth of the frame is clean sky or ceiling, and the lower-right corner is quiet and slightly darker. Square 1:1, 2048×2048. People are seen from behind or in profile at a distance; no recognisable faces.

**Negative line (end of both):**
> Avoid: text, letters, signage, logos, watermarks, scaffolding, construction, modern vehicles, plastic chairs, crowds, tourists posing, selfie sticks, HDR, oversaturation, harsh midday light, CGI look, distorted or asymmetric architecture, extra minarets, extra fingers.

### Tile 1: Explore Hyderabad, "The Old City, before it wakes"
> [STYLE] The Charminar in Hyderabad at first light, seen straight down a narrow, freshly swept lane of Laad Bazaar. The monument fills the upper-centre of the frame: four slender minarets, each with a small dome, and a great central arch, in weathered cream lime plaster glowing pale gold in low sunrise light, with soft mist around its base. Wooden shopfronts line both sides with shutters half open. On the left, a bangle seller arranges stacks of jewel-toned glass bangles under a warm bulb. In the middle distance a local host in a crisp white kurta walks with two guests in linen toward the monument, all seen from behind, small in the frame. A few pigeons lift off the stones. The lower-right foreground is a shaded shop step in soft shadow. Sky clean pale gold-blue. Quiet, privileged, the city just for you. [NEGATIVE]

### Tile 2: Here for an Event, "The delegate dinner, at a palace"
> [STYLE] The main courtyard of a Nizam-era palace in Hyderabad (in the style of Chowmahalla Palace) at blue hour. A white neoclassical façade with tall arched windows and fine stucco mouldings, lit warm from within, reflected in a long rectangular pool with a quiet fountain. Beside the pool, one long banquet table dressed in ivory linen, set for about twenty-four guests: brass candelabra with lit candles, low runners of marigold and white roses, crystal glassware catching the light. A handful of delegates in evening wear arrive along the pool's edge, seen from behind and in profile, small in the frame; one host in a cream sherwani welcomes them. Deep indigo sky across the top of the frame. The lower-right foreground is calm dark water and stone. Elegant, celebratory, unhurried. [NEGATIVE]

**Check before use:** Charminar must have exactly four minarets and one great arch per face; no scaffolding. Overlay check is not needed (the sepia is derived).

## CTA card (built now; works with the current images too)

```
                                  ┌──────────────────────────────┐
                                  │ Palaces, bazaars, kitchens   │  Jost 1.6, cream 90%
                                  │ and studios, hosted by those │
                                  │ who know them.               │
                                  │ ──────────────────────────── │  gold-light hairline, 45%
                                  │ DISCOVER TOURS            →  │  Jost 1.1 caps .16em
                                  └──────────────────────────────┘
```
- `.mn-cats__card`: 1px `rgba(244,238,228,.32)` hairline, radius `.2rem` (as `.mn-conv__btn`), `background: rgba(20,16,14,.28)`, `backdrop-filter: blur(10px)`, padding `2.4rem 2.8rem 2rem`, width `clamp(30rem, 24vw, 38rem)`, bottom-right inset `3.6vw / 5.6%`.
- No text shadow inside the card; the glass carries legibility. The bottom shade gradient lightens a little.
- **Tile hover** (or link focus-visible): border → `--gold-light`, the divider brightens, the arrow nudges 4px right. Ease `var(--ease)`, .5s. Focus ring: 2px `--gold-light` on the card.
- **Tablet:** the card sits bottom-left under the title column, width 36.3rem (the current column width). **Phone:** full width minus the 2rem gutters, at the bottom.
- Copy unchanged: same description, "Discover Tours" / "Find My Event". No new CTA, no eyebrow.

## Code changes
- **index.html** (cats only): wrap `.mn-cats__desc` + `.mn-cats__link` in `<div class="mn-cats__card">`. Change the link class from `mn-ulink` to `mn-cats__cta`. Add `<span aria-hidden="true">→</span>`. When the images land: point `src` / `data-color` at `assets/img/paths/{explore,event}.jpg` / `-color.jpg`, rewrite the alts and the source comments, and keep `width`/`height` at 2048.
- **css/sections.css** (section 3 banner only): replace the absolute desc/link positioning with the card. Update the ≤1024 and ≤749 rules. Nothing else moves.
- **No JS change.** cats-reveal.js already fades `.mn-cats__content` on click (the card goes with it). The cover link and the link's `pointer-events:auto` are unchanged. The motion.js grow-in targets `.mn-cats` and the tiles only.
- **Docs:** replace "Section 3" in [GEMINI-IMAGE-PROMPTS.md](GEMINI-IMAGE-PROMPTS.md) with the prompts above. Add an "AI-generated (Gemini), client-owned" entry in `assets/img/SOURCES.md` and re-run `tools/assets/credits.py`. Update the row 3 description in PROJECT-CONTEXT. Archive this plan as `docs/plans/2026-11-07-two-paths-imagery-cta-card.md`.
- The old `art-*.jpg` files stay unused on disk (the house rule for template leftovers).

## Order
1. **Now:** the CTA card + the prompts doc. Test with the current prints.
2. **When you send the two colour images:** ffmpeg derives the sepia, I wire the files and tune `--pos`, then re-test.

## Verification
- `node server.js <port>`, then `node tools/test/shot.mjs http://127.0.0.1:<port>/ <scratch> cats 1440x900 1280x720 390x844`, plus 834x1112 for tablet and `--reduce`. Look at every shot.
- A small CDP check (scratch, on `tools/test/cdp.mjs`):
  - hovering a tile turns the card border gold;
  - Tab to the link shows the focus ring;
  - clicking floods colour and fades the card (reveal still works);
  - `docW === vw`;
  - the console is clean.
- Mid-scroll shot of the statement → cats grow-in: the card's backdrop blur must look right while the grid scales and blurs.
- Re-run `tools/test/conventions.mjs` (the next section is pinned right after the cats hold).
