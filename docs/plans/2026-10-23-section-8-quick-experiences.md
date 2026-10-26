# Plan: Section 8 becomes Quick Experiences (list left, animated visual right)

## Context
Section 8, the "A Closer Look / Made by Hand, Not by Machine" handbag spinner, is generic. It is replaced with the wireframe's **Quick Experiences** (§9.2 of WIREFRAME-CONTENT.md).

The layout follows the user's reference: **the list on the left, an animated visual on the right, and item 1 already selected and fully shown when the section scrolls in.**

The 3D spinner goes, but the section's place in the stack (the sideways wipe in over the city section, then the held pin) is kept.

## Content (wireframe data, all 14 items)
- **Title:** "A little Hyderabad, wherever you are."
- **One body line:** "Short-format cultural experiences for hotels, conferences, events and private celebrations."
- **No eyebrow.**
- **List rows (number · name · duration):**

| # | Experience | Duration |
|---|---|---|
| 01 | Cheriyal Mask Making | 45–60 min |
| 02 | Lac Bangle Making | 30–45 min |
| 03 | Bidri Art Workshop | 45–60 min |
| 04 | Pearl Jewellery Making | 30–45 min |
| 05 | Block Printing | 45–60 min |
| 06 | Pochampally Ikat Experience | 30–45 min |
| 07 | Deccani Calligraphy | 30–45 min |
| 08 | Telangana Folk Performance | 20–30 min |
| 09 | Perini Dance | 20–30 min |
| 10 | Oggu Katha | 20–30 min |
| 11 | Deccan Music / Sufi Evening | 45–60 min |
| 12 | Hyderabad Pearl Bar | 1–2 Hours |
| 13 | Hyderabad Bangle Bar | 1–2 Hours |
| 14 | Deccan Craft Table | 2–3 Hours |

- **Right panel, per item:**
  - the photo
  - a one-line description (I write these; the wireframe has none)
  - the duration and "From ₹ on request" (no price is known yet)
  - one **Book now →** link
- **BOOK NOW appears only on the active row and in the panel**, not on all 14 rows. This follows the "keep them even simpler" note and the user's preference for minimal CTAs.

## Images (properly licensed, from Wikimedia Commons; all checked to be at least 1000px on the short side)

| Item | Candidate | Licence |
|---|---|---|
| Cheriyal | Cheriyal mask paintings.jpg | CC BY-SA 3.0 |
| Lac bangle | Lac Bangle Making, Laad Bazaar, Hyderabad.jpg | CC BY-SA 4.0 |
| Bidri | Making Bidriware.jpg | CC BY-SA 4.0 |
| Pearl jewellery | Hyderabad pearls.jpg | CC BY 2.0 |
| Block printing | Close up of Block Printing at Halasur village.jpg | CC BY 2.0 |
| Pochampally | Pochampalli Ikat saree.jpg / Loom for weaving.jpg | CC BY-SA 4.0 / CC0 |
| Calligraphy | Copy of the divan of Nasir Khusraw, created in 1621 at Hyderabad.jpg | Public domain |
| Folk performance | Dappu Artists in Telangana … 2022 | CC BY-SA 4.0 |
| Perini | Perini Sivatandavam Dance Of Telangana (WikiConference 2023) | CC BY 3.0 |
| Oggu Katha | Oggu Katha (Telangana) performers at WCI 2023 | CC BY-SA 4.0 |
| Sufi evening | Sufi Night 2016.jpg | CC BY-SA 4.0 |
| Pearl bar | Laad Bazaar Pearls, Charminar | CC BY 2.0 |
| Bangle bar | Glass Bangles at Laad Bazaar, Hyderabad.jpg | CC BY-SA 4.0 |
| Craft table | Shilparamam, arts and crafts village in hyderabad.jpg | CC BY-SA 4.0 |

- **Before use:** I look at each candidate (contact sheet) and swap in a sibling from the same Commons search if one is weak.
- **Processing:** Pillow crops each to a 4:5 portrait at 1200×1500, with a gentle, consistent warm grade, saved as progressive JPEG (about 150–250 KB). Output goes to `assets/img/quick/*.jpg`.
- **Attribution:** CC BY / BY-SA requires credit. Each panel shows a tiny credit line ("Photo: Author · CC BY-SA 4.0", linked to the Commons page), and all sources are listed in `assets/img/quick/SOURCES.md`.
- **No video:** none of these crafts has a properly licensed video. Instead, the stills get a slow Ken Burns drift, so the panel feels alive like a video without breaking licences.

## Design
- **Background:** cream `#f4eee4`, so the section reads clearly against the ink city sweep it wipes over. A faint gold khatam jaali (the same SVG data-URI as the numbers card) sits behind the right half only, at about .12 opacity.
- **Left column (about 42% wide):**
  - **Title:** Cormorant Garamond 300 (same scale as the other section titles), then the body line in Jost.
  - **List:** 14 hairline-divided rows. Each row shows the number (Jost, gold), the name (Cormorant, `clamp(1.05rem, 1.35vw, 1.4rem)`) and the duration right-aligned (Jost small caps). Row height scales with `clamp(…, 4.2vh, …)`, so all 14 fit in 100svh at 1440×900 and 1280×720.
  - **Inactive rows:** ink at 45%.
  - **Active row:**
    - full ink;
    - a gold rule grows from the left (`scaleX`, `--ease`);
    - the name shifts 8px right;
    - **Book now →** slides in where the duration was.
- **Right column: the animated visual.** The photo sits inside a **Mughal arch frame** (Charminar / Qutb Shahi pointed arch) used as a `clip-path` (an SVG `<clipPath>`).
  - **On each switch (the "SVG animation"):**
    1. The **gold arch outline draws itself** (`stroke-dashoffset`, 0.9s, `--ease`), with a second inner hairline arch trailing by 0.15s.
    2. The new photo reveals **up from the base of the arch** (clip-path `inset`, 0.8s), over the previous one.
    3. The photo runs a slow Ken Burns (scale 1.08 → 1, plus a drift, 6s).
    4. The caption block (number, name, description, duration, Book now) rises in with the existing `maskReveal` style.
  - **When the section is idle** the arch outline keeps a very slow shimmer. Its gradient stroke offset moves; this is subtle.
- **Selection:**
  - Hover or focus on a row selects it on desktop; click or tap selects it on all devices.
  - Up and down arrows move between rows when the list has focus.
  - Rows are `<button role="tab">` with `aria-selected`, and the panel is `role="tabpanel"` with `aria-live="polite"`.
  - Hovering the list never flickers: switching is debounced to 90ms, and the latest selection wins.
- **First item by default:**
  - Item 01 is rendered active in the HTML, so the right panel is complete before the wipe even starts.
  - On every entry from above (ScrollTrigger `onEnter` / `onEnterBack` of the pin), the section resets to 01 and replays the arch draw. That way the user always lands on "01 Cheriyal Mask Making" fully drawn as the wipe settles.

## Motion / code changes
- **index.html:** replace the inner content of `<section class="mn-sec mn-sec--spinner" data-sec="spinner">` (around line 487–530). The section itself and `data-sec="spinner"` stay, so the stack order, `zIndex`, `dwell` and `curtain` wiring are untouched. The new root is `<div class="mn-quick" data-quick>`, containing:
  - the head;
  - the list (`ol` of buttons with `data-img`, `data-desc`, `data-dur`, `data-credit`);
  - the panel (arch SVG with clipPath, two stacked `img` layers, the caption).
  - Images use `loading="lazy"` except item 01.
- **js/motion.js (desktop spinner block):** change the `$('.mn-spinner', S.spinner)` target to `$('.mn-quick', S.spinner)`. Everything else stays: the same sideways `clipPath` wipe plus `y`, the city parallax, `riseDriven` and `dwell(S.spinner, null, .75, null, true)`. When the wipe completes, the timeline's `onProgress`/end calls `window.mnQuick && mnQuick.intro()`, so the arch draws as the section lands. The mobile branch gets no pin; a `once()` trigger calls `intro()` at 60% in view.
- **js/components.js:**
  - Remove `initSpinner` (around line 412–575) and its call.
  - Add `initQuick()`: the select(i) logic, the double-buffered image layers, the arch draw via `getTotalLength()`, the debounce, the keyboard handling, `window.mnQuick = { select, intro }`, and preloading the next 2 images on hover.
  - It waits on `mnPreloader.done` like the other blocks.
- **css/sections.css:**
  - Remove the `.mn-spinner*` rules (around line 1033).
  - Add the `.mn-quick*` rules: a grid of 42/58, collapsing to one column at ≤1024px with the arch panel (4:5) on top and the same vertical list below it. Tapping a row updates the panel and scrolls it into view only if the panel is off-screen.
  - `prefers-reduced-motion`: no Ken Burns, no draw (the outline is shown complete), crossfades only.
- **Cleanup:** delete the six `assets/video/spinner-*.mp4` references from the markup. The files can stay on disk; I won't delete them unless asked.

## Files
- `index.html`
- `css/sections.css`
- `js/components.js`
- `js/motion.js` (one selector plus the intro hook)
- **New:** `assets/img/quick/` (14 JPEGs plus SOURCES.md)

## Verification
1. Start my own `node server.js` on a free port. I won't touch any server I didn't start.
2. **Headless Chrome (CDP) script `quick.mjs`**, at 1440×900, 1280×720 and 375×812:
   - scroll through the city section into section 8;
   - screenshots at 0/50/100% of the wipe and during the hold;
   - assert that row 01 has `aria-selected=true`, its image is loaded, and the arch path's `stroke-dashoffset` is about 0 at hold;
   - assert that all 14 rows fit without overflow at 1280×720.
3. **Hover/click rows 05 and 14:** the panel image, caption and credit change; there is no flicker on rapid hover across all rows (sample the final state).
4. **Scroll past and back up into the section:** it resets to 01.
5. **Mobile:** tapping a row updates the panel, and there is no horizontal scroll.
6. **Regression:** check that there are no console errors (`initSpinner` gone, nothing referencing `.mn-spinner`). Re-run the existing suites: `sky.mjs`/`band.mjs` (city before), `themes.mjs`, `scrub2.mjs`, `pre-cast.mjs`. Check reduced motion.
