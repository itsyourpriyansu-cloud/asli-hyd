# Asli Hyd: Homepage Outline, Asset Brief, Link Map & Design System

This document is the brief for filling the homepage build in this folder.
Every slot below maps to a file path or a text block in `index.html`, so assets and copy can be produced in parallel and dropped in without code changes.

> **Fill-in markers:** `[PRODUCT]` = what Asli Hyd sells; `[COLLECTION A/B/C]` = collection names.
> Character limits come from the current layout. Copy that stays within them will not break lines or overlap.

---

## 0. Production order

1. **Brand basics:** final name lockup, logo mark (SVG), palette decision (section 5.1), collection names.
2. **Shoot plan:** one studio day (products, swatches, turntables) and one location/atelier day (people, craft, city, heritage). Shot list in section 3.
3. **Copy:** write against the character limits in section 2.
4. **Edit and export:** to the specs in section 3.4, then drop the files over the placeholders.
5. **Inner pages:** build them from the link map (section 4).

---

## 1. Page skeleton at a glance

| # | Section | Job on the page | Main assets | Primary link |
|---|---|---|---|---|
| H | Header | Navigation, brand, utilities | Logo mark SVG | Home |
| 1 | Hero | First impression, brand promise | 1 loop video + poster | none |
| 2 | Statement | Brand belief in one paragraph | none | none |
| 3 | Categories | Split into the two main shopping paths | 2 tall images | Category pages |
| 4 | Collection A | Showcase 6 products + collection mood | 5 promo stills, 1 hover video, 12 product images | Collection A |
| 5 | Commission / Bespoke | Custom-order offer + 4-step process | 4 wide stills (slideshow) | Bespoke page |
| 6 | Collector / Persona | Emotional line about the customer | 1 wide image | none |
| 7 | City / Origin | Hyderabad story | 1 portrait image | Shop all |
| 8 | Spinner | Close-up craft proof, interactive | 6 turntable videos + 6 swatches | Product page |
| 9 | Collection B | Second product showcase | Same set as Collection A | Collection B |
| 10 | Materials / Values | Sustainability or quality pillars | 1 wide image | Values page |
| 11 | Three Worlds | Three collection families | 3 portrait images + 3 hover videos | Collections A/B/C |
| 12 | Heritage | Lineage and timeline | 1 wide image | Our Story |
| 13 | Social | Instagram feed feel | 10 portrait images | Instagram |
| 14 | Partners / Press | Trust signals | 3 logos (SVG) | none |
| F | Footer | Newsletter, links, address | Logo mark | Various |

---

## 2. Section-by-section outline

Each section lists: **Layout**, **Motion**, **Content slots** (with limits), **Assets**, **Links**.

### H. Header

- **Layout:** left nav (4 links) · centred logo mark + wordmark · right: Log in, Cart (0), currency, outlined **Enquire** button. On tablet and phone this becomes a burger menu + cart + account icons.
- **Motion:** transparent over the hero, frosted white after 40px of scroll, hides on scroll down and returns on scroll up.
- **Content:** 4 nav labels (≤ 20 chars each, uppercase), wordmark (≤ 14 chars), CTA label (≤ 10 chars).
- **Assets:** logo mark SVG (single colour, `currentColor`, about 40×38 viewBox). Favicon SVG.
- **Links:** Bespoke · Our Story · The Founder/Artisans · Shop · Account · Cart · Enquire → Bespoke appointment form.

### 1. Hero

- **Layout:** full-screen video. Eyebrow + one-line heading sit **bottom-left**.
- **Motion:** heading un-blurs letter by letter on load. On scroll the hero holds, drifts up and fades as the next section covers it.
- **Content:**
  - Eyebrow: ≤ 30 chars, e.g. `ASLI HYD • est. 20XX`
  - Heading: **≤ 24 chars** (one line on desktop), e.g. "The True Taste of Hyderabad" (direction only)
- **Assets:** `assets/video/hero.mp4` + `assets/img/hero.jpg` (the poster: first frame of the video).
- **Art direction:** slow, cinematic, no hard cuts. Keep the **lower-left third calm and darker** for the text. 10–15 s seamless loop.
- **Links:** none.

### 2. Statement

- **Layout:** large serif paragraph on cream, left-aligned, with a small attribution line below.
- **Motion:** a soft mask sweeps down while the text un-blurs. Then it holds, fades and blurs while the category tiles grow out of it.
- **Content:** paragraph **35–50 words**, with 2 short phrases in *italics* for emphasis. Attribution ≤ 40 chars (e.g. "— Founder, Asli Hyd").
- **Assets:** none.
- **Direction:** what makes it *asli* (authentic): origin, hands, time, refusal to shortcut.

### 3. Categories (2 tiles)

- **Layout:** two tall side-by-side tiles. Title top-left, description + "View More" bottom-right.
- **Motion:** grows from 60% to full size out of the statement, then holds briefly. Hovering widens a tile.
- **Content per tile:** title **1–2 words (≤ 14 chars)**, description **≤ 70 chars**, link label "View More".
- **Assets:** `category-handbags.jpg`, `category-small-goods.jpg` (rename freely, but update `index.html`), **1200×1600** portrait.
- **Art direction:** tile 1 has white text, so use a **darker top-left area**. Tile 2 has dark text, so use a **light, airy image**. Hero product centred, plenty of headroom.
- **Links:** Category 1 page, Category 2 page.

### 4. Collection A showcase · 9. Collection B showcase

- **Layout:** centred title + "Discover". Below it, a tall promo panel (left on A, right on B) next to a 3×2 product grid.
- **Motion:** the section rises in through a mask; cards stagger up. The promo slideshow crossfades every 4.5 s and plays a video on hover. Product cards swap to a detail image on hover and show the name and type.
- **Content:** collection title **≤ 30 chars**. Promo heading ≤ 28 chars (2 lines). 6 × product name **≤ 22 chars** + type line **≤ 42 chars** (e.g. "Hand-finished [PRODUCT] | [Collection]").
- **Assets (per collection):**
  - `collection-x/promo-1..5.jpg`: 900×1400 portrait mood shots (5)
  - `video/collection-x.mp4`: portrait 2:3, 6–10 s loop (1)
  - `collection-x/product-1..6.jpg`: **720×840**, product on a plain `#f0eee9` background, centred, same scale across all 6
  - `collection-x/product-1..6-detail.jpg`: 720×840 close-up of texture/detail (hover state)
- **Links:** "Discover" + promo → Collection page. Each card → its product page.

### 5. Commission / Bespoke

- **Layout:** full-bleed slideshow (4 images). White boxed card on the **left** with heading, body and button. A row of 4 numbered steps along the bottom.
- **Motion:** rises as a curtain over Collection A. The card scales in; the steps stagger in while the section holds.
- **Content:**
  - Heading ≤ 40 chars; the italic second half goes on its own line (e.g. "A piece made *only for you.*")
  - Body **35–50 words**
  - Button ≤ 22 chars (e.g. "Begin a Commission")
  - 4 steps: roman numeral + title **≤ 14 chars** + description **≤ 60 chars**
- **Assets:** `commission-1..4.jpg`, **1920×1280**. The card covers the left 40%, so keep the **subject on the right half**. Show process moments: consultation, sketch, making, packaging.
- **Links:** Button → Bespoke page `#appointment`.

### 6. Collector / Persona

- **Layout:** full-bleed image with centred heading (2 lines), small uppercase eyebrow and the logo mark below.
- **Motion:** curtain rise; text settles from 112% scale.
- **Content:** heading **2 lines, ≤ 32 chars each**. Eyebrow ≤ 26 chars (e.g. "The Asli Hyd Customer").
- **Assets:** `collector.jpg` **2400×1350**: a person or lifestyle scene, **calm/darker centre**, 20% dark overlay applied in code.
- **Links:** none.

### 7. City / Origin (Hyderabad)

- **Layout:** split: portrait image left, text right (eyebrow, big heading, body, text link) aligned to the bottom.
- **Motion:** wipes in from the right behind a white sweep while the previous section slides left.
- **Content:** eyebrow ≤ 24 chars ("Born in Hyderabad"). Heading **≤ 55 chars**. Body **30–45 words**. Link ≤ 26 chars.
- **Assets:** `city.jpg` **1200×1800** portrait: architecture or street detail. The image is cropped toward the **bottom-left**, so keep the subject low.
- **Links:** "Discover the Collection" → Shop all.

### 8. Spinner (interactive close-up)

- **Layout:** full-screen video stage. 6 swatches + name label at the top. Eyebrow + heading bottom-left, 3 stat pills on the right, "View Piece" button bottom-centre.
- **Motion:** sideways wipe in, then holds. Drag left/right to rotate the product. A swatch click cross-wipes to that colourway at the same rotation angle.
- **Content:** eyebrow ≤ 20 chars. Heading **≤ 32 chars** (3 lines max). 3 stats: number/word (≤ 8 chars) + label (≤ 22 chars, uppercase), e.g. "1,200 · hand-finished steps", "One · per batch", "100% · Hyderabad-made". 6 swatch names ≤ 22 chars + a per-swatch stat value.
- **Assets:**
  - `video/spinner-1..6.mp4`: **one full 360° turntable rotation per clip**, 3–5 s, 1280×720 (or 1920×1080). Seamless loop, background **#d9d7d6** (or the chosen equivalent).
  - **Critical:** all 6 clips must start at the **same angle**, run the **same duration** and keep the **same framing**, because swapping colourways keeps the current time.
  - Keyframe every 6 frames (`-g 6`) so drag-scrubbing is smooth.
  - `img/swatch-1..6.jpg`: 240×240 texture crops of each colourway.
- **Links:** "View Piece" → the selected product page (one URL per swatch).

### 10. Materials / Values

- **Layout:** mirror of Commission: the boxed card sits on the **right**; 4 check-marked pillars along the bottom.
- **Motion:** rises as a curtain over Collection B; card scales in; pillars stagger in.
- **Content:** eyebrow ≤ 20 chars. Heading ≤ 45 chars. Body **30–45 words**. Button ≤ 14 chars. 4 pillars: title **≤ 20 chars** + description **≤ 50 chars** (2 short lines).
- **Assets:** `materials.jpg` **2400×1350**. The card covers the right 40%, so keep the **subject on the left**. Raw materials, ingredients or craft tools.
- **Links:** Button → Values / Sustainability page.

### 11. Three Worlds

- **Layout:** centred title + intro, then 3 portrait cards (image, title, description, "Explore X" link).
- **Motion:** images parallax inside their frames; heading staggers in; each card plays a video on hover.
- **Content:** title ≤ 34 chars. Intro **20–30 words**. Per card: name **1 word**, description **12–18 words**, link "Explore [Name]".
- **Assets:** `world-1..3.jpg` **900×1350** + `video/world-1..3.mp4` portrait 6–10 s loops. One look per collection family; make them feel distinct but related.
- **Links:** Each card → its collection page (A / B / C).

### 12. Heritage

- **Layout:** full-bleed image. Centred eyebrow + heading + link. Bottom row: paragraph on the left, 3-point timeline on the right.
- **Motion:** background parallax; intro staggers in; the timeline draws dot → line → dot once fully visible.
- **Content:** eyebrow ≤ 16 chars ("Since 19XX"). Heading **≤ 42 chars**. Link ≤ 24 chars. Body **35–50 words**. 3 milestones: year + label **≤ 18 chars**.
- **Assets:** `heritage.jpg` **1920×1440**: archival, family or old-city feel. A 40% dark-green tint is applied in code. The image is cropped toward the **right side**.
- **Links:** "Discover our Story" → Our Story page.

### 13. Social marquee

- **Layout:** centred handle + "Follow on Instagram", then an auto-scrolling strip of 10 tall images (pauses on hover).
- **Content:** handle (e.g. `@aslihyd`), link label.
- **Assets:** `social-1..10.jpg` **900×1350**. Mix product, people and detail shots, alternating light and dark for rhythm.
- **Links:** handle + every image → Instagram profile (new tab).

### 14. Partners / Press

- **Layout:** centred heading + sub-line, then a row of 3 logos.
- **Content:** heading ≤ 36 chars. Sub-line ≤ 120 chars.
- **Assets:** `partner-1..3.svg`, single colour (ink `#2e3937`), about 240×120 artboards. **Use only with permission.**
- **Links:** none (or the press article, if any).

### F. Footer

- **Layout:** newsletter heading + email field + Subscribe on the left; 4 link columns on the right. Bottom bar: legal + policy links · logo mark · credit.
- **Content:** heading **≤ 60 chars**. Columns: Collections · The House · Services · Visit Us (address, hours).
- **Links:** see section 4.

---

## 3. Asset production list

### 3.1 Totals

| Type | Count | Notes |
|---|---|---|
| Videos | **15** | 1 hero, 2 collection hovers, 6 spinner turntables, 3 worlds hovers, 3 optional extras (mobile hero cut, etc.) |
| Large lifestyle stills | **10** | hero poster, 4 commission, collector, city, materials, heritage, 2 categories |
| Collection promo stills | **10** | 5 per collection |
| Product packshots | **24** | 6 products × 2 views × 2 collections |
| Worlds stills | **3** | |
| Social images | **10** | |
| Swatches | **6** | |
| Logos / marks | **5** | brand mark, favicon, 3 partners |

### 3.2 Studio shoot (one day)

- 12 products × front packshot + detail, on a seamless `#f0eee9` background with identical lighting and scale
- 6 turntable rotations (motorised turntable, locked-off camera, same start angle)
- 6 swatch macro crops
- 2 category hero shots (one dark/moody, one light/airy)

### 3.3 Location / atelier shoot (one day)

- Hero loop (signature Hyderabad + product moment)
- 4 bespoke-process moments (consult, sketch, make, pack)
- Persona/lifestyle (collector)
- City detail (portrait), heritage/archival feel
- 2 × 5 collection mood stills + 2 hover loops; 3 worlds stills + 3 loops
- 10 social-style frames

### 3.4 Export specs

| Asset | Format | Size | Target weight |
|---|---|---|---|
| Hero video | MP4 H.264, no audio, `+faststart` | 1920×1080, 24/25 fps, 10–15 s loop | ≤ 6 MB |
| Hover loops | MP4 H.264, no audio | 720×1080 (2:3), 6–10 s | ≤ 2.5 MB |
| Spinner | MP4 H.264, `-g 6`, no audio | 1280×720, 3–5 s, 1 full turn | ≤ 1.5 MB each |
| Wide images | JPEG q80 (or WebP) | 2400×1350 / 1920×1280 | ≤ 450 KB |
| Portrait images | JPEG q80 | 900×1400 / 1200×1800 | ≤ 300 KB |
| Packshots | JPEG q82 | 720×840 | ≤ 120 KB |
| Logos / marks | SVG, single colour | — | — |

Example ffmpeg export: `ffmpeg -i in.mov -an -c:v libx264 -crf 23 -preset slow -pix_fmt yuv420p -movflags +faststart out.mp4`. Add `-g 6` for spinner clips.

---

## 4. Link map (sitemap)

```
/                          Home (this build)
/shop                      All products               ← "Shop", City link, footer
/collections/category-1    Category 1                 ← Category tile 1, footer
/collections/category-2    Category 2                 ← Category tile 2, footer
/collections/a             Collection A               ← Section 4, Worlds card 1
/collections/b             Collection B               ← Section 9, Worlds card 2
/collections/c             Collection C               ← Worlds card 3
/products/<handle>         Product page               ← every card + spinner "View Piece"
/bespoke                   Bespoke / commissions      ← nav, Commission button, footer
/bespoke#appointment       Appointment form           ← "Enquire", footer
/our-story                 Story + heritage           ← nav, Heritage link, footer
/artisans                  Founder / makers           ← nav, footer
/values                    Materials & values         ← Materials button, footer
/visit                     Store / studio, hours      ← footer
/care                      Customer care              ← footer
/faq                       FAQ                        ← footer
/policies/privacy · /policies/terms                   ← footer bottom
/account · /cart                                      ← header
External: Instagram profile, mailto: contact address
```

Until the inner pages exist, all links stay `href="#"` (inert by design).

---

## 5. Design system

### 5.1 Colour tokens (in `css/base.css`)

| Token | Current value | Role |
|---|---|---|
| `--cream` | `#f4eee4` | Page background |
| `--ink` | `#2e3937` | Primary text, dark buttons |
| `--muted` | `#707c7a` | Eyebrows, secondary text |
| `--hairline` | `rgba(46,57,55,.22)` | Dividers, borders |
| `--tile` | `#f0eee9` | Product card background (match the packshot background) |
| `--footer-bg` | `#e8f3e5` | Footer |
| spinner bg | `#d9d7d6` | Spinner stage (match the turntable background) |
| `--white` | `#ffffff` | Text on images, boxed cards |

**Re-theming for Asli Hyd (optional direction):** keep the structure and swap only the values. For example, a warm Hyderabadi set: sandstone cream background, deep emerald or Bidri-black ink, pearl white cards, an antique-gold accent for the clasp, links and hover states. Swatch and packshot backgrounds must change together with `--tile`.

### 5.2 Typography

| Style | Font | Size (desktop → phone) | Used in |
|---|---|---|---|
| Display | Cormorant Garamond 300 | 100 → 58 px | Hero |
| H1 | Cormorant Garamond 300 | 70 → 40–48 px | Statement, City, Collector, Spinner, Heritage, Footer |
| H2 | Cormorant Garamond 300 | 50 → 32 px | Boxed cards, promo panels |
| H3 | Cormorant Garamond 400 | 34 → 32 px | Section titles (collections, worlds, social, partners) |
| H4 | Cormorant Garamond 400 | 26 px | Step / pillar titles |
| Year / col title | Cormorant Garamond 400 | 22 px | Timeline, footer columns |
| Body | Jost 400 | 16 / 24 px | Paragraphs, links |
| Small | Jost 400 | 14–15 px | Card types, descriptions |
| Label | Jost 500, uppercase, 0.14em | 13 px | Nav, buttons, stat labels |

To swap fonts, change `--serif` / `--sans` in `css/base.css` and replace the files in `assets/fonts`.

### 5.3 Layout & spacing

- Root size: 1rem = 10px. Max container 1680px.
- Gutters: 70px desktop · 40px tablet sections · 20–24px phone.
- Breakpoints: **≤ 749** phone · **750–1024** tablet · **≥ 1025** desktop (full motion).
- Section padding: 224px (statement) · 140px (collections) · 120px (worlds) · 100px (social, partners).
- Grid gaps: 6px between media tiles and cards.
- Radii: 2px buttons/inputs · 25px stat pills · round swatches.

### 5.4 Components

Outlined button (dark / light) · solid submit button · underline text link (line retracts on hover) · product card (image swap + info reveal) · promo panel (slideshow + hover video) · boxed white card · step (numeral or check) · stat pill (frosted glass) · swatch (dock magnify) · timeline · marquee cell · glass drag cursor.

### 5.5 Motion tokens

- Ease: `cubic-bezier(.22, 1, .36, 1)` (CSS) / `power2.out` (GSAP reveals).
- Reveal: 0.9–1.1 s, stagger 0.12–0.15 s, starting from 18–56 px below with 6–8 px blur.
- Smooth scroll: Lenis, duration 1.4, wheel multiplier 0.7, wheel delta capped at 140.
- Hover: 0.4–0.6 s fades; 1.4 s image zoom to 1.04.
- `prefers-reduced-motion`: all choreography off.

### 5.6 Image direction (summary)

Warm, natural light; restrained palette; texture and hands over hard-sell product angles. Leave room where text sits:

| Section | Keep calm / clear |
|---|---|
| Hero | bottom-left |
| Commission | left (card) |
| Materials | right (card) |
| Collector | centre |
| City | subject low |
| Heritage | subject on the right |

---

## 6. Open questions to settle before the shoot

1. What exactly is Asli Hyd's `[PRODUCT]`? This decides the spinner (turntable) and packshots.
2. Two showcase collections plus a third in "Three Worlds": are there 3 collections?
3. Is there a bespoke/custom-order service? If not, Section 5 becomes "How it's made".
4. Real founding year and milestones for Heritage?
5. Which partner, press or retailer logos can be shown with permission?
6. Palette: keep the current cream/ink or move to a Hyderabadi palette?
