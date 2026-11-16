# Homepage v3: client feedback round (16 Nov 2026)

## Context
The client (Vi, on WhatsApp) went through the homepage section by section. In short:
- The hero stays as it is.
- Hyderabad, Your Way becomes "6 ways to experience Hyderabad" as tall vertical windows.
- A Featured Tours section is added: 12 tours, 4 per row.
- Conventions keeps its rail and gets a calendar "Find your event" finder.
- Numbers shrinks to one slim line.
- Private Access is separated from the section that overlaps it.
- Originals and the co-curated bento are removed. They come back as one 9:16 "shorts" section, Asli Originals / Curated Experiences with Partners.
- Testimonials get a real heading and move after the partners.
- The CTA gets a cleaner image with readable text.

The user also asked for lighter scrolling (no heavy Lenis, easy movement between sections), a fresh UX-led take on the references rather than copies, careful phone layouts, and **no git actions**.

Decisions already taken:
- **12 tours:** the wireframe's 13 minus Young Innovators.
- **Lenis:** removed. Native scroll.
- **Reels marquee:** kept, as its own section.
- **Featured Brands:** unchanged apart from its new position.

## New page order
| # | Section | `data-sec` | Change |
|---|---|---|---|
| 1 | Hero | `hero` | none (no more pin) |
| 2 | 6 ways to experience Hyderabad | `collection-a` | rebuilt |
| 3 | **Featured Tours** | `tours` (new) | new |
| 4 | Conventions + calendar | `conventions` | finder added, no pin |
| 5 | Asli Hyderabad in numbers | `commission` | slim strip |
| 6 | Private Access | `collector` | standalone, no overlap |
| 7 | Rooted in Hyderabad | `city` | content kept; sweep → draw-once band |
| 8 | Quick Experiences | `spinner` | content kept; native rail + arrows |
| – | ~~Originals~~ | `collection-b` | **removed** |
| 9 | Featured Brands | `logos` | unchanged |
| 10 | **Asli Originals / Curated Experiences with Partners** (shorts) | `worlds` (`id="co-curated"`) | replaces the bento |
| 11 | Testimonials | `materials` | heading added, moved here |
| 12 | @aslihyderabad reels | `social` | unchanged, moved after testimonials |
| 13 | CTA | `heritage` | new image, legible text |

Rooted (7) and Quick Experiences (8) were not mentioned by the client. Their content stays the same. Only their scroll-driven motion changes, as part of the "lighter scroll" request.

## Motion: lighter, native scroll
- **Remove Lenis:**
  - delete the `<script>` tag in `index.html` and in the shared page template in `tools/build-pages.mjs`;
  - delete the Lenis block in `js/motion.js` (lines 29–49);
  - delete `js/vendor/lenis*`.
- **Replace `window.mnLenis` calls** in `js/components.js`:
  - in-page anchors (line ~422), the theme click (removed anyway) and the testimonial tab (line ~343) use `el.scrollIntoView({behavior: reduce ? 'auto' : 'smooth'})`;
  - add `scroll-margin-top` on sections for the header;
  - the drawer and the preloader lock scroll with `html { overflow: hidden }` instead of `lenis.stop()`.
- **Delete the desktop choreography** in `js/motion.js` (`mm.add('(min-width: 1025px)')`): the hero pin, the conventions driven rail, `curtain()`, `dwell()`, the city/spinner sideways wipes, the spinner hold, the testimonials curtain and the z-index stack.
- **Keep the one-shot reveals, now at all sizes:**
  - section heads rise;
  - card staggers;
  - number count-up;
  - Private Access doors open once;
  - skyline band draws once (move the ≤1024 block to all sizes);
  - Quick Experience arches draw once;
  - brand line drawings;
  - CTA timeline.
- Reduced motion still renders everything complete.

## Section by section

### 2. 6 ways to experience Hyderabad (`collection-a`)
- **Heading:** "6 ways to *experience Hyderabad.*" (client's words, with the italic gold half), plus the existing "All tours" link on the right.
- **Design:** six tall "windows": portrait panels with a soft Mughal-arch top and a fine inset gold hairline. Each panel is one link to `/experiences/<theme>`.
  - At rest: the photo and the theme name (Cormorant) at the foot.
  - On hover/focus: the theme loop plays (existing `assets/video/themes/*.mp4`), the image eases 1.04, and the tagline plus "Explore →" rise in.
  - No width change, so nothing animates layout.
- **Layout by screen:**
  - Desktop: 6 in a row, about 2:5.
  - Tablet: 3×2.
  - Phone: 2×3 at 3:4, so all six fit about one screen with no hidden swipe. On touch devices the tagline is always visible and there is no video.
- **Removed:** the big panel explorer (`[data-themes]` JS block in `components.js` ~143–238, its CSS, the theme tabs and the `i-theme-*` symbols if unused).
- **Reused:** the existing `hoverVideo()` helper (`components.js:128`) and the existing card images.

### 3. Featured Tours (new `data-sec="tours"`, after section 2)
- **Heading:** "Featured *tours.*" with an "All tours" link → `/tours`.
- **Tabs:** All · Heritage · Culture · Cinema · Business · Learning · Wellness · Evening, built with the existing **`[data-filter-root]` filter** (`components.js:480`). It works as-is on the homepage and announces "N tours shown".
- **Cards:** smaller arch ("dome") cards, **4 per row × 3 rows**. Each has:
  - the arch photo (reuse `.mn-arcade__media/__img/__arch` + `archSvg` markup);
  - the name;
  - a one-line `tagline` from `data/tours.json`;
  - a meta row with the duration and "Explore →".
  - Each card links to `/tours/<slug>`. No prices.
- **The 12 tours:** Royal Hyderabad, Kingdom of Golconda, Old Hyderabad, Hyderabad on a Plate, Crafted Hyderabad, Village Life, Pochampally Weaves, Statue of Equality, Inside Ramoji, HITEC Hyderabad, Kanha Retreat, Hyderabad by Night. Images: the existing `assets/img/pages/tours/<slug>-card.jpg`.
- **Layout by screen:**
  - Tablet: 3 per row.
  - Phone: one swipe rail (about 1.4 cards visible, snap) under scrollable tabs, so 12 cards don't become 6 screens of scrolling.

### 4. Conventions + "Find your event" calendar
- **Kept:** the rail, cards and heading.
- **Motion:** no pin. The rail swipes natively everywhere, with the existing prev/next arrows (`is-scrollable`) on desktop. Phone auto-advance stays.
- **Header right:** the old "All conventions" link becomes the pill **[📅 Find your event | Nov 2026 ▾]** (gold-ink and cream, as in the reference). On phones it sits full width under the heading.
- **The finder:** a native `<dialog>`, the same pattern as the gallery lightbox, so it traps focus, closes on Esc and returns focus.
  - **Left column:** "Hyderabad events calendar", then a month grid. Prev/next months; a dot on event days; today ringed; the chosen day filled gold. Below it, type filter checkboxes, showing only the types that have events: Conferences & Conventions, Exhibitions & Trade Shows, Government & Industry Summits.
  - **Right column:** "Events in Hyderabad | November 2026", a search box (event, venue, keyword; searches every month) and rows. Each row has a thumbnail, date pill, name, venue, type tag and "Explore →" to the convention page. "All conventions" sits at the foot.
  - **Empty month:** "Nothing this month. Next: <event> →", one clear action.
  - **Phone:** full-screen sheet. A compact calendar sits on top, filters become chips, and the list fills the rest.
- **Data:** read from the rail cards already in the DOM (dates, name, venue, image, link). Each `<li>` gets a new `data-type`. Past events are already removed by the existing code, so there's no duplicate data.
- **Left out on purpose:** the reference's bookmark icon (nothing to save to) and festival/sports events (none exist; nothing invented).

### 5. Asli Hyderabad in numbers (`commission`)
- A slim cream band, about 22–26rem tall: the caption "Asli Hyderabad in numbers" (small tracked caps), then **5 figures** separated by fine gold rules. Each figure is a Cormorant number with a gold "+" and a small uppercase label.
- The overlay photo, paragraph and button are removed.
- **Figures, from the client's reference:**
  - 30+ Experience partners & local businesses
  - 275+ Curated destination experiences delivered
  - 15+ Hotels & hospitality partners
  - 35+ Corporate & institutional clients
  - 20+ Licensed tour leaders & local experts
- The existing count-up is kept.
- Phone: 2+2+1, centred.
- The same numbers go into `data/proof.json` for the inner-page proof strip, then a rebuild.

### 6. Private Access (`collector`)
- Its own section, about 80svh, with clear space above and below.
- The curtain/dwell that slid the next section over it is gone. I read that overlap as what the client meant by "clubbed with Add-ons and overlapping".
- The current doors image, heading and "Request Access" stay as a placeholder until the client sends content. The doors open once when the section is in view.

### 10. Asli Originals / Curated Experiences with Partners (`worlds` slot, `id="co-curated"`)
- **Heading:** "Asli Originals / *Curated Experiences with Partners*".
- **Partner logo strip:** acts as the filter, using the `[data-filter-root]` component again. The buttons are All · Asli Originals · Taj Falaknuma · Paradise · Café Niloufer · Goyaz · Shilparamam · Ramoji · Heartfulness, using the existing `assets/img/brands/*-ink.png`. It scrolls sideways with arrows when it overflows.
- **Cards:** 13 cards at 9:16:
  - 7 co-curated experiences, each with its partner;
  - 6 Originals, tagged "An Asli Original".
  - Each card has its name, "with <partner>" and a play glyph.
  - It plays a muted preview on hover (desktop) or while on screen (touch). This reuses the IntersectionObserver pattern of the reels marquee.
  - Each card links to `/experiences/co-curated/<slug>` or `/originals/<slug>`.
- **Layout:** desktop about 5 visible, with arrows. Phone about 2.2 visible, swipe with snap.
- **Clips:**
  - the 6 Originals loops cropped to 608×1080, the same pipeline as the reels;
  - for the partner cards, the closest licensed loop (chai → Niloufer, pearls → Goyaz, cinema → Ramoji, wellness → Heartfulness). Otherwise the card's photo with a slow zoom and no play glyph.
  - Stored in `assets/video/shorts/`, with credits in `VIDEO-SOURCES.md`.
- **Removed:** the bento markup and CSS, plus the `collection-b` Originals section markup.

### 11. Testimonials (`materials`)
- Moved after the shorts.
- A proper section heading above the stage, on the cream page: "Asli Hyderabad, *in their words.*", taken out of the card.
- With no curtain, it no longer runs into the section above. The layout is otherwise unchanged.

### 13. CTA (`heritage`)
- A new, calm editorial image with open space for the text: a licensed Commons shortlist (Qutb Shahi domes or Chowmahalla in soft light), checked at full size.
- Text placed on the quiet part, with a measured scrim so the heading, link and contact line pass AA. A test checks this.
- The steps timeline is kept. The credit goes in `assets/img/SOURCES.md`, then `credits.py` is re-run.

### 1. Hero
No code change. The video specs the client asked for go in my report:
- the current file is 1280×720, H.264 High, 30 fps, 12.7 s loop, 5.9 MB, no audio;
- the ask: 1920×1080 or larger, 10–20 s seamless loop, no watermark, ≤ 8 MB web export, plus an optional 1080×1920 cut for phones.

## Files
- `index.html`: sections 2–13 as above, new order. LF line endings.
- `css/sections.css`: new banners (Six ways, Featured Tours, Event finder, Numbers strip, Shorts). Delete the explorer, bento, numbers overlay and desktop sweep rules. Add `scroll-margin-top`.
- `js/components.js`: event finder, shorts preview playback, windows hover video. Remove the explorer and every `mnLenis` call.
- `js/motion.js`: remove Lenis and the desktop pin block; move the reveals to all sizes.
- `js/preloader.js`: native scroll lock if it touches Lenis.
- `tools/build-pages.mjs`: drop the Lenis script.
- `data/proof.json`: the new numbers. Then `node tools/build-pages.mjs`.
- Assets: `assets/video/shorts/*`, the new CTA image, credits, and `node tools/assets/credits.py`.
- Docs:
  - `docs/PROJECT-CONTEXT.md`: section map, motion and gotchas.
  - `CLAUDE.md`: slot names. `tours` is new, `collection-b` is gone, `worlds` is now the shorts.
  - Archive this plan as `docs/plans/2026-11-16-client-feedback-v3.md`.
- **No git commands.**

## Verification
- `node --check js/*.js`; `node server.js <port>`.
- **Tests to update:**
  - `conventions.mjs`: no driven rail; the finder opens, changes month, selects a day, searches, filters, closes on Esc and returns focus; phone sheet.
  - `arcade.mjs`: native rail and arrows on desktop.
  - `skyline.mjs`: the band draws once at every size.
  - `voices.mjs`: the heading exists and sits after the shorts.
  - `finale.mjs`: CTA text contrast.
- **Tests to replace:** `originals.mjs` with `home.mjs`, covering:
  - section order;
  - the windows' hover video and the phone 2×3 grid;
  - tour tabs filter and the 12 cards;
  - shorts filter and preview playback;
  - the numbers strip count-up;
  - `docW === vw` and a clean console at every size;
  - reduced motion renders everything.
- **Also run:** `footer.mjs`, `pages.mjs` (inner pages after the Lenis removal and proof change) and the build's link check.
- **Screenshots:** `shot.mjs` at 1440×900, 1280×720, 820×1180 and 390×844. I'll look at each section myself before reporting.

## Copy I write (I'll flag it in the report)
- "Featured *tours.*"
- The finder's labels and empty state.
- "An Asli Original".
- The numbers caption, taken from the client's image.
