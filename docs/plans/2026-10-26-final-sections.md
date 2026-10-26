# Plan: finish the homepage (sections 12–15) and fix the loose ends

## Context
After the testimonials (visible 11), four template slots still show "Maison Nomen" placeholder content: `worlds`, `heritage`, `social` and `logos`. The user asked for the remaining sections to be planned and finished properly:
- an **Instagram section with autoplaying reels**;
- a **partners section with real company logos**, with no gaps;
- everything else researched from the wireframe and the live-site audit.

Decisions made (AskUserQuestion):
- Use the recommended four sections, in wireframe order.
- Instagram handle: **@aslihyderabad**, a placeholder for the client to confirm.
- Partners: **the wireframe's 9 brands**.

The page tail becomes:

| Visible | Slot (`data-sec`, kept) | New content | Wireframe |
|---|---|---|---|
| 12 | `logos` (moved up) | **Featured Brands of Hyderabad**: 9 real logos | 06 |
| 13 | `worlds` | **Co-curated Experiences**: the 7 homepage signature experiences with those brands | 07 |
| 14 | `social` | **@aslihyderabad**: a marquee of autoplaying 9:16 reels | 09, in reel form |
| 15 | `heritage` (moved last) | **Your Hyderabad starts here**: Plan My Hyderabad in 3 steps, plus contact | 12 + 14 |

These four sections are normal-flow; none is pinned. Their only choreography is the "all sizes" reveal blocks in `js/motion.js`. They can therefore be **reordered in `index.html` safely**, which is not true of the pinned/curtain chain above them. Each block in motion.js finds its section by `data-sec` or class, so order doesn't matter.

## Content (wireframe + live audit; any copy I write is marked *mine*)

**12 · Featured Brands of Hyderabad** (wireframe §7)
- Title: "Featured brands *of Hyderabad.*"
- Sub: "Handpicked names that represent the best of Hyderabad."
- Body: the wireframe doc line, shortened.
- One link: "Explore all featured brands" → `/partners` (placeholder).
- No eyebrow.
- Tiles, each logo + NAME + italic category from the wireframe:

| Brand | Category |
|---|---|
| Taj Falaknuma Palace | Heritage Hospitality |
| Anaganaga | Contemporary Telugu Dining |
| Niloufer Café | Heritage Chai & Café |
| Goyaz | Fine Jewellery |
| Ramoji Film City | Film & Entertainment |
| Hyderabad Convention Centre | Conventions & Events |
| Paista | Lifestyle & Curated Shopping |
| Concu | Wellness Experience |
| Escape Estates | Countryside & Estate |

**13 · Co-curated Experiences** (wireframe §8.1, §8.3)
- Title: "Small experiences. *Big memories.*" (the cleaner mockup-2 headline).
- Body: "Fifteen short, immersive experiences crafted with our Featured Brands, made for curious travellers and memorable moments."
- One link: "View all 15 experiences".
- 7 cards from §8.3: High Tea, Hyderabad · Taj Falaknuma; Chai Time, Hyderabad · Niloufer; A Telugu Table · Anaganaga; The Hyderabad Pearl Experience · Goyaz; Behind the Screen · Ramoji; A Day in the Deccan · Escape Estates; Reset in Hyderabad · Concu.
- Each card has its wireframe card line, "Price on request" and "Book experience →".
- `id="co-curated"`, so the existing header and footer links work.

**14 · @aslihyderabad reels**
- Heading: "@aslihyderabad" (a placeholder handle, flagged). Link: "Follow on Instagram" (inert until the client gives a URL).
- 8 reels, each a 9:16 muted loop with a short caption (*mine*, describing the moment, never claiming a location the footage isn't from):
  - Irani chai, poured right
  - Old city, from above (client's own Hyderabad drone footage)
  - Festival nights
  - Street food after dark
  - An offering of light
  - Dance in the old style
  - Jewellery and bangles
  - Friends around the table

**15 · Your Hyderabad starts here** (heritage template: full-bleed photo, centred heading + link, body + 3-step timeline)
- Heading: "Your Hyderabad *starts here.*"
- Link: "Plan My Hyderabad" → `/book-now` (the live site's CTA, and the wireframe title).
- Timeline (*mine*, built from the live "Custom Hyderabad Itinerary" service):
  1. Tell us: dates, group, interests
  2. We shape it: a day-by-day plan
  3. We host you: from arrival to the last chai
- Body: "+91 93921 49872 · WhatsApp · sahana@aslihyd.in" (wireframe §15's contact details).

## Design
Everything uses cream/ink/gold, Cormorant headings with an italic dark-gold (`#a97835`) second half, Jost UI and the `cubic-bezier(.22,1,.36,1)` ease.

- **12 Brands, split layout.**
  - Left: title, sub, body, link. Right: a **3×3 grid** of square white tiles with a hairline border, so all 9 logos are visible at once with nothing hidden in a carousel.
  - Each tile holds the logo (an ink-monochrome version, which turns to the brand's colours on hover or focus), then the name in small caps, a short gold rule and the italic category.
  - As in the wireframe mockup, faint gold line drawings of Charminar and Chowmahalla sit in the corners, reusing those outlines from the skyline SVG.
  - Phone: 2-column grid, with the 9th tile centred.
- **13 Co-curated, a bento grid.** Desktop is 5 columns × 2 rows: High Tea is the large 2×2 card and the other 6 fill 3×2. This is deliberately unlike the explorer grids and the arcade rail.
  - Each card: a photo with an ink gradient at the foot, the partner logo in white at top-left (the same logo files as section 12), and the name in white serif at bottom-left.
  - On hover or focus the card line and "Book experience →" rise in, as on the arcade cards.
  - Phone: the big card full width, then a 2-column grid. Touch shows the line and CTA without hover.
- **14 Reels.** Template marquee (`mn-social__track`, CSS `mn-marquee`), now with `<video>` reel cards.
  - Cards are about 30rem tall at 9:16, with square corners to match the site, a small white reel glyph top-right and the caption bottom-left over a gradient.
  - The marquee pauses on hover or focus. Each video plays only while on screen and pauses off it.
  - Reduced motion or data-saver: no marquee (the row scrolls) and posters only.
- **15 CTA.** Template heritage: a warm full-bleed Hyderabad photo (new, licensed, checked at full size: no scaffolding, no watermark) with an ink scrim. The existing timeline animation draws step by step.

## Assets (licensed, credited; the standard process in PROJECT-CONTEXT §6)
- **Logos (9).** From each brand's official website or official social profile: SVG where offered, else the largest PNG.
  - Processing (Python, scratchpad): trim, then make an ink-monochrome and a colour version.
  - Files go in `assets/img/brands/`. Record each in `assets/img/SOURCES.md` as "trademark of X, used with permission pending", per wireframe §7.
  - **Risk:** Paista, Concu and Escape Estates have no easily found official sites. If a brand's logo can't be found from an official source, that tile gets a clean typographic wordmark (the name set in a neutral serif) flagged "logo to be supplied by the client". Nothing is invented to look like a real logo, and it's listed in the report.
- **Co-curated photos (7)**, cropped to card ratios with `cardcrop.py`:
  - Commons: Falaknuma interior or high tea; Niloufer chai and bun maska (Teja011, already vetted); a Telugu thali; pearls; a Deccan countryside or estate landscape.
  - The client's own photos: `site-photos/cinema-ramoji.jpg` or `cinema-baahubali-set.jpg`, and `way-wellness.jpeg` or a Commons meditation photo.
  - None of these may repeat an image already used on the page.
- **Reels (8 × about 1 MB).** 608×1080 centre crops, as 6–8 s seamless loops (`loopclip.sh`, then an ffmpeg crop; H.264, no audio) plus a poster JPG, in `assets/video/reels/`. Sources:
  - existing licensed loops: Coverr chai, friends laughing, street food, fire ceremony; Mixkit Diwali offering; the client's drone footage (cropped clear of the @Drone_Venkat watermark);
  - 2 new Mixkit clips: "young woman in traditional Indian attire performs a captivating dance" and "woman using jewelry on her hand and face posing".
  - All recorded in `VIDEO-SOURCES.md`. No YouTube, Pexels or Pixabay.
- **CTA photo (1).** Commons, 2400 px. Candidates: Golconda at sunset, Chowmahalla lit at night, or Charminar at dusk, checked for scaffolding.

## Code changes
- **`index.html`**
  - Replace the content inside the four existing `<section data-sec>` wrappers, keeping the `data-sec` names.
  - Reorder to `logos → worlds → social → heritage`.
  - Add `id="co-curated"` and `id="quick-experiences"` (on the `spinner` section). Both are currently dead links in the header and footer.
  - Footer: add a **"Photo credits"** link.
- **`css/sections.css`**: replace the four template banners with new banner blocks (12–15), in the new page order. CRLF line endings.
- **`js/components.js`**
  - Replace the social-marquee generator, which builds `social-N.jpg` cells, with: duplicate the reel cells once for a seamless loop (clones `aria-hidden`, `tabindex=-1`), and play or pause each video with an IntersectionObserver.
  - Pause the marquee on hover or focus. Reduced motion or data-saver: posters, no autoplay.
  - Logo tiles and bento cards need no JS (CSS hover and focus).
  - Add a small **in-page anchor handler**: `a[href^="#id"]` → `mnLenis.scrollTo(target, {offset: -header})`. Today a click on `#private-access` is a native jump, which fights Lenis.
- **`js/motion.js`** ("all sizes" blocks):
  - Rewrite the `worlds` block (heading stagger, bento cards rise staggered, light image parallax using `parallax()`).
  - Rewrite the `logos` block (tiles rise staggered; corner drawings draw with `pathLength`, `autoRound: false`).
  - Keep the `heritage` block as is (parallax, intro stagger, timeline), with the same markup classes.
  - The social section needs nothing beyond the CSS marquee.
- **New `credits.html`**: a static page using the site's CSS that lists every third-party photo and clip credit (generated from the three SOURCES files). This satisfies the CC BY / BY-SA "visible credit" requirement now that the on-page credits were removed.
- **Docs**
  - `docs/PROJECT-CONTEXT.md`: section map rows 12–15, the new patterns, open items (brand permissions, Instagram URL, logos still to be supplied).
  - `tools/README.md`: the new test.
  - Archive this plan as `docs/plans/2026-10-26-final-sections.md`.
- **Not touched**: sections 1–11 (except adding the `id` on `spinner`), the header and the loader.

## Verification
1. `node --check js/*.js`; confirm line endings (CSS/JS CRLF, HTML LF).
2. **New suite `tools/test/finale.mjs`** (on `cdp.mjs`):
   - **Brands:** 9 tiles, every logo loaded (`naturalWidth > 0`), hover swaps to colour, the grid fits at 1440/1280/390.
   - **Co-curated:** 7 cards, all images loaded; hover and focus show the line and CTA; touch shows them without hover.
   - **Reels:** on-screen videos play and off-screen ones are paused, the marquee pauses on hover, reduced motion gives posters and no autoplay.
   - **CTA:** the timeline draws.
   - **Anchors:** `#co-curated`, `#quick-experiences` and `#private-access` land with the section top under the header.
   - `docW === vw` at every size, and the console is clean.
3. Re-run the neighbouring suites: `voices.mjs` (testimonials curtain sits directly above), `arcade.mjs`, `skyline.mjs`, `originals.mjs`.
4. Screenshots of each new section at 1440×900, 1280×720 and 390×844 (plus mid-hover), looked at before reporting.
5. Open `credits.html` and check it lists every file in the SOURCES files.

## Open items to report
- Written permission from all 9 brands and the 3 named testimonial guests (wireframe §7, §11).
- The real Instagram URL.
- Any logo shown as a wordmark placeholder.
- The reels are licensed Indian stock plus the client's drone shot; real Asli reels should replace them.
- Prices stay "Price on request".
