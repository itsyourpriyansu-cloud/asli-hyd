# Asli Hyderabad homepage: project context and handoff

The working memory of this build: what the site is, how the user wants to work, what each section does, how the code fits together, where the assets came from, how to check work, and what is left. Read it fully before changing anything. `CLAUDE.md` (repo root) is the short version.

Last updated: 27 Oct 2026, after the motif kit and the footer's skyline band (see [`MOTIFS.md`](MOTIFS.md)).

---

## 1. What this is

- **Client:** Asli Hyderabad (aslihyd.in). It is a Hyderabad hosting company: curated tours, conference-delegate programmes, signature "Originals", private access to people and places, short cultural experiences. Contact on the site: Sahana, sahana@aslihyd.in, +91 93921 49872.
- **This repo:** a single-page **homepage** prototype in plain HTML/CSS/JS with GSAP 3.12.5 + ScrollTrigger and Lenis 1.1.13, all local (no CDN). It began as a luxury-embroidery template called **"Maison Nomen"**, and every `mn-` class name comes from it. We are re-skinning it **section by section**, keeping its motion system.
- **Sources of truth for content:**
  - [`WIREFRAME-CONTENT.md`](../WIREFRAME-CONTENT.md): everything in the client's wireframe PDF (15 homepage sections, tables, copy, open questions). It is the **brief**.
  - [`LIVE-SITE-AUDIT.md`](../LIVE-SITE-AUDIT.md): a crawl of the live aslihyd.in (tours, conventions, themes, services, numbers, testimonials, photo inventory, logo).
  - [`GEMINI-IMAGE-PROMPTS.md`](../GEMINI-IMAGE-PROMPTS.md): prompts for client-generated replacements of the section 4 card images.
  - [`VIDEO-SOURCES.md`](../VIDEO-SOURCES.md), [`assets/img/SOURCES.md`](../assets/img/SOURCES.md), [`assets/img/quick/SOURCES.md`](../assets/img/quick/SOURCES.md): every third-party clip and photo, with licence.
  - [`SITE-OUTLINE.md`](../SITE-OUTLINE.md): the **template-era** asset brief. All of its sections are now outdated: every template slot has been rebuilt. Keep it for history only.
  - [`docs/plans/`](plans/): the approved plans from earlier steps (history and rationale).

## 2. How the user works (follow this exactly)

The user directs the build one section at a time, usually with a screenshot plus a short instruction. The flow that has worked:

1. **Identify the exact section.**
   - The user often says "this section", "the next section" or "the 5th section". They count **visible sections from the top** (see the map in section 3: "5th" = Hyderabad, Your Way). Earlier they also used the code's comment numbers ("section 8" = the old spinner).
   - Match the screenshot or the content to the map.
   - **If there is any doubt, ask before editing.**
   - Never touch a section the user did not name. Once a change to section 3 was meant for the loader, and the user was rightly angry. The change was fully reverted.
2. **`/plan` means plan first.**
   - When the message contains `/plan`, or says "plan", enter plan mode.
   - Research the content (wireframe, live audit, existing code) and the assets (search online).
   - Write the plan with: Context, Content, Design, Motion/code changes, Files, Verification.
   - Then exit plan mode for approval. Build only after approval.
   - Archive the approved plan into `docs/plans/YYYY-MM-DD-<topic>.md`.
3. **Without `/plan`, just build it.** For small or clear requests (remove an eyebrow, swap an image, fix spacing), do it directly. Report briefly.
4. **Keep everything that already works.**
   - Do not regress effects, motion or interactions in other sections.
   - When reusing a component (for example, the section 4 explorer for section 9), generalise the code so both instances work, then test both.
5. **Verify in a real browser before reporting.**
   - Run the headless Chrome suites in `tools/test/`.
   - Look at the screenshots yourself (desktop 1440×900 and 1280×720, phone 390×844).
   - Check the console is clean. Only then report.
   - Report outcomes faithfully: say what was tested, what failed and what was skipped.
6. **Report in plain terms.**
   - Say what changed (with file links), what the user will see, and any decisions or open items.
   - No long preamble. Tables are welcome for content lists.

### Standing preferences (learned from feedback)

- **Minimal eyebrows and CTAs.** The user repeatedly removed eyebrows and extra buttons (hero: no CTA, no eyebrow; the section 9 panel: schedule eyebrow removed). Do not add an eyebrow, kicker or second CTA unless the wireframe or the user asks for it. Section headers that already have one (sections 4 and 9) keep it.
- **Premium, Hyderabadi, editorial.**
  - Use the cream/ink/gold system.
  - Use Cormorant Garamond for display and Jost for UI.
  - Use the Mughal **khatam jaali** pattern as the recurring ornament (numbers card, skyline sweep, loader, Quick Experiences).
  - Use Mughal arch shapes and fine gold lines.
  - Be restrained, not busy.
- **Real Hyderabad imagery, properly licensed.**
  - Prefer actual Hyderabad places, food and people over generic stock.
  - Check photos at full size for problems: **Charminar is shown with restoration scaffolding** in most recent photos; also check for watermarks, low quality and identifiable children up close.
  - **Never download from YouTube.**
  - Record a credit for every file.
- **Breathing room.** When the user says "improve the UI", they mean more spacing, a clearer hierarchy and less clutter, with the same interaction.
- **Data comes from the wireframe and the live site.** Where the wireframe has no copy, write short, concrete copy in the site's voice and say that you wrote it. Prices are unknown: use "Price on request" (the wireframe's `₹____`).
- The user sometimes edits files themselves (for example, they commented out the Quick Experiences intro paragraph). **Respect manual edits.** Read the file before editing, never revert their changes, and mention what you noticed.

## 3. Section map

`data-sec` names are **load-bearing**: `js/motion.js` pins, stacks and wipes sections by these names. Replace a section's *content*, keep its `<section data-sec="…">` wrapper, and update the one selector in motion.js if the inner root class changes.

| Visible # | Code comment | `data-sec` | Content now | Status |
|---|---|---|---|---|
| — | loader | `#mn-pre` | Intro loader: 5 Hyderabad images open one by one inside a logo-colour border; "Hyderabad is *Regal / Crafted / Inventive / Serene / Welcoming*"; cream background with a drifting gold jaali; morphs into the hero | done |
| 1 | 1. HERO | `hero` | Drone video, "Experience **Asli = Real** Hyderabad" set in Cormorant Garamond Light, always three left-aligned lines ("Experience" / "Asli = Real" / "Hyderabad"), 96px on desktop, 80px tablet, min(72px, 15vw) phone; dark overlay + bottom gradient, **no CTA, no eyebrow** | done |
| 2 | 2. STATEMENT | `statement` | "Irani chai at dawn, attar in the old bazaars, palaces that still remember the Nizams. This is Hyderabad, hosted the asli way." — Sahana. Letters ink from faint to full with the scroll; hand-drawn marker loops (`.mn-ring`, one Asli logo colour each) draw round the four key words as they ink; each svg's viewBox is matched to its word | done |
| 3 | 3. TWO PATHS | `cats` | "Explore Hyderabad" / "Here for an Event" tiles: sepia Raja Deen Dayal Nizam-court photographs; a WebGL blob reveals the colourised version under the pointer (`js/cats-reveal.js`), and a click floods colour then follows the link | done |
| 4 | 3b. CONVENTIONS | `conventions` | "In Hyderabad for a *Convention?*" An editorial index (the event/agenda list pattern): heading row with "All conventions" right; numbered rows (Cormorant name, dates · venue · tentative tag) on hairlines. ≥1200px: hover/focus puts a row in focus (ink name, gold numeral and rule) and brings its photo into a double gold frame beside the list, with an italic caption naming the place; below 1200px one column, a thumbnail per row. Rows rise in on entry; no pin. Data from aslihyd.in/conventions; past events (by `data-end`) are removed and the rest renumbered; faint jaali behind. Test: `tools/test/conventions.mjs` | done |
| 5 | 4. HYDERABAD, YOUR WAY | `collection-a` (+`data-themes`) | **Card explorer**: 6 theme cards (Heritage, Culture, Cinema, Business, Wellness, Learning); hover/focus/tap brings a theme into the big left panel with a looping video, heading, hosted routes and a CTA; other cards dim | done |
| 6 | 5. TRUSTED WITH HYDERABAD | `commission` | "Asli Hyderabad, *in numbers.*" Overlay editorial: slideshow of real Asli groups, a boxed card with a khatam jaali behind it (no border), figures that count up with a "+" landing | done (testimonials not yet) |
| 7 | 6. PRIVATE ACCESS | `collector` | "Hyderabad, *behind closed doors.*" Teaser: two carved doors swing open onto a chandeliered durbar hall (live-site photo `assets/site-photos/tour-nizams-legacy-golconda.jpg`), then the line settles | done (the full table of 8 is not built) |
| 8 | 7. ROOTED IN HYDERABAD | `city` | Split editorial "Four centuries of a city, *hosted by people who call it home.*" Image: golden-hour Golconda Durbar Hall rampart (`rooted-golconda.jpg`). The sideways ink sweep carries the **"400 years in one line"** skyline SVG (Golconda 1518 → Durgam Cheruvu 2020): seven landmark groups, each opening up (outline, details, then year and name) as the sweep carries it on screen, driven by its on-screen position so scrolling back closes it; on phones it is a band that draws once, landmark by landmark, while it glides | done |
| 9 | 8. QUICK EXPERIENCES | `spinner` (old name kept) | "A little Hyderabad, *wherever you are.*" **Arcade rail**: the 10 experiences as arch-topped photo cards in one rail, with buttons for Workshops (01–06) and Performances (07–10). On desktop the section holds and the page scroll carries the rail sideways; on phones, tablets and with reduced motion the rail swipes natively. Hover or focus shows the description and swaps the duration for Book now. The earlier list + arch version was retired on 26 Oct (copy in `docs/backups/quick-experiences-v1/`) | done |
| 10 | 9. ASLI HYDERABAD ORIGINALS | `collection-b` (+`data-themes`) | "Only in Hyderabad. Only with Asli." The section 4 explorer **mirrored** (panel right): Hyderabad at Dawn, Welcome Hyderabad, Hyderabad After Dark, The Hyderabad Table, + Ramzan Nights, Festival Hyderabad (two seasonal ones the user asked for) | done |
| 11 | 10. TRUSTED WITH HYDERABAD | `materials` (old name kept) | "Asli Hyderabad, *in their words.*" The 4 live-site testimonials (verbatim). Per guest: a Hyderabad backdrop tied to their story, a toned portrait in a gold Mughal arch, and the quote in the boxed card; the 4 guests along the bottom are tabs whose gold hairline is a 10 s auto-advance timer (pauses on hover/focus/off screen) | done |
| 12 | 12. FEATURED BRANDS | `logos` (moved up, old name kept) | "Featured brands *of Hyderabad.*" Copy left, a 3×3 grid of white tiles right: official logo (ink at rest, brand colours on hover), name, gold rule, italic category. Faint Charminar and Chowmahalla line drawings in the corners draw themselves. Taj Falaknuma, Café Niloufer, Goyaz, Ramoji, HICC are the wireframe's; Paradise, Heartfulness, Karachi Bakery, Shilparamam replace four wireframe names whose logos could not be sourced (the user chose this) | done (brand permissions needed) |
| 13 | 13. CO-CURATED EXPERIENCES | `worlds` (`id="co-curated"`) | "Small experiences. *Big memories.*" A bento grid (5 cols × 2 rows, High Tea is 2×2): 7 of the wireframe's 15 signature experiences, each paired with a brand from section 12 (white partner logo top-left). Hover or focus shows the line and "Book experience"; phones get a swipe rail with everything shown | done |
| 14 | 14. @ASLIHYDERABAD REELS | `social` | Eight 9:16 muted loops in a CSS marquee (cloned once by components.js); only on-screen reels play; marquee pauses on hover/focus; reduced motion or data-saver: posters, no marquee. The handle is a placeholder | done (handle + real reels to come) |
| 15 | 15. YOUR HYDERABAD STARTS HERE | `heritage` (moved last, `id="plan"`) | Closing CTA over Taramati Baradari lit at night: heading, "Plan My Hyderabad", contact line, and a 3-step timeline (Tell us your dates · We shape the days · We host you) | done |
| — | footer | `.mn-footer` | **One screen tall** (desktop). A cream cusped edge bites into the closing CTA, then an inlay seam. Brand column (logo, line, phone, email, place, **social icons**: Instagram, Facebook, LinkedIn, YouTube as placeholders, WhatsApp live) and 3 link columns sit in the sky. **"Hyderabad, at dusk"**, the skyline in three depth tiers, is the background along the foot, in date order like section 8: Golconda, Qutb Shahi tombs, Charminar against the sun, Mecca Masjid, Chowmahalla + Khilwat clock tower, High Court, Assembly, the Buddha on Hussain Sagar (to scale), HITEC Cyber Towers, the Durgam Cheruvu extradosed bridge (two short pylons). It stands on the ground band: legal + Privacy/Terms left; Photo credits, Partner login and **Design by Envizon** (envizonstudio.com) right. The tiers rise as the skyline comes into view and the lamps come on; birds and the lakes loop on screen; tablets and phones pan the skyline | done (social account URLs needed) |
| — | header | `[data-header]` | Asli logo, Experiences + Plan dropdowns, links; transparent over the hero, frosted after scroll | done |

### What is still missing from the wireframe

The wireframe has 15 sections (see WIREFRAME-CONTENT.md §1). Built differently or not built:

| Wireframe section | Status |
|---|---|
| 03 Featured Tours | Not a section of its own; tours are surfaced as routes in section 5's panel. 13 tours ready in §4 |
| 08a Add-ons | Not built (8 live services, §9.1); linked from the header and footer |
| 09 Experience Asli: In Pictures | Covered by the reels (section 14) |
| 10 Private Access | The teaser (section 7) is built; the full table of 8 needs the named people's consent |
| 11 Health & Wellbeing | Not built (title only in the wireframe); Wellness lives in section 5 and the Reset card in section 13 |

## 4. Code architecture

```
index.html            every section in order; the inline <head> script adds html.is-preloading (8 s failsafe)
css/fonts.css         Cormorant Garamond + Jost (self-hosted)
css/base.css          tokens, reset, buttons (.mn-btn), underline links (.mn-ulink), .mn-wrap
css/header.css        header, dropdowns, mobile drawer
css/preloader.css     the intro loader
css/sections.css      every section, in page order, each under a numbered banner comment
css/footer.css
js/vendor/            gsap, ScrollTrigger, lenis (pinned versions, local)
js/preloader.js       loader timeline; exposes window.mnPreloader {active, done}; dispatches 'mn:preloaded'
js/components.js      UI behaviour with no scroll choreography: header, dropdowns, slideshows, hover videos,
                      card explorer ([data-themes], both instances), conventions carousel (window.mnConv),
                      steps accordion, marquee, Quick Experiences rail (window.mnArcade {update, goTo, driver})
js/motion.js          Lenis + all scroll choreography (gsap.matchMedia: desktop >=1025px / <=1024px / all sizes)
js/cats-reveal.js     section 3 WebGL colour reveal
server.js             static server with HTTP Range (needed for video)
tools/                test harness + asset scripts (see tools/README.md)
```

Script order matters: gsap, ScrollTrigger, lenis, then **preloader.js, components.js, motion.js**, then cats-reveal.js. components.js defines `window.mnArcade` before motion.js uses it. Anything that must wait for the loader awaits `window.mnPreloader.done`.

### motion.js essentials

Desktop (`mm.add('(min-width: 1025px)')`) builds the stacked sequence:
- Sections pin, and the next one slides over as a **curtain**.
- Editorial sections **wipe in sideways** (city, then spinner).
- **Collections** rise in through a mask while their cards stagger.

Helpers, all in motion.js:

| Helper | What it does |
|---|---|
| `sec(name)` | Gets a section by `data-sec` |
| `pageTop(el)`, `settleAt(el)` | Measure where a section sits and where it settles |
| `once(test, fn)` | Runs `fn` the first time `test` passes while scrolling |
| `riseDriven(el, tl, onProgress)` | Drives a paused timeline from 0 to 1 as `el`'s top rises from the viewport bottom to its top |
| `curtain(prevWrap, wrap, opts)` | The curtain rise |
| `dwell(wrap, next, extra, onEnter, spacing)` | Pins a section for a hold |
| `parallax(holder, layer, scale, amp)` | Parallax inside a frame |
| `maskReveal(el, dir, dur, blur)` | Mask-and-blur reveal |
| `splitText(el, 'char'/'word')` | Splits text for per-letter animation |
| `boxReveal`, `stepsReveal` | Card and steps reveals |

Each matchMedia block pushes cleanup functions; keep that pattern so resizing across 1024px works.

The **stack order** is set with `gsap.set(S.x, {zIndex})` near the top of the desktop block. The **wipe chain** is `dwell(S.city, S.spinner, .25)`, then the spinner wipe plus its hold (a pin as long as the rail's travel, with the track scrubbed sideways), then `curtain(S.colB, S.materials, …)`.

Mobile (`max-width: 1024px`): lighter parallax, steps reveals, the skyline band draws once, the Quick Experiences arches draw once in view. With `prefers-reduced-motion`, motion.js exits early: everything must render complete and usable with no JS motion. Components check `reduceMotion` too (still images instead of video, no Ken Burns).

### Reusable patterns

**Card explorer** (`[data-themes]`, sections 4 and 9).

Markup:
- `.mn-collection__layout` (add `--right` to put the panel on the right);
- the panel: `.mn-promo[data-theme-panel]`, containing:
  - a slideshow;
  - `img[data-theme-still]`;
  - `video[data-theme-video]`;
  - one `.mn-themes__state[data-state]` per card plus `intro`;
- the cards: `.mn-card[data-theme][data-video][data-video-pos][data-poster]`, each with two images (the main image and an `--alt` hover image).

Behaviour (components.js):
- hover activates a card after a 120ms intent delay;
- keyboard focus activates only with `:focus-visible`, because a tap also focuses;
- on touch, the first tap previews and scrolls the panel into view; the second tap follows the link;
- video plays only while the section is on screen;
- reduced motion or data-saver shows the still image instead of video.

CSS is scoped under `[data-themes]`. Card images are **720×840**. Clips are 1920×1080, about 9 s seamless loops, about 3 MB.

**Quick Experiences, the arcade rail** (`[data-arcade]`, `.mn-arcade`):
- an `ol.mn-arcade__track` of 10 `.mn-arcade__card`s (`data-group` = `workshops` / `performances`), each one link: arch photo (Mughal arch mask), description, number, name, and a foot where Book now replaces the duration on hover;
- `.mn-arcade__rail` scrolls natively; on desktop motion.js adds `is-driven`, pins the section and scrubs the track's `x`, and sets `window.mnArcade.driver` so `goTo(card)` scrolls the page instead of the rail;
- `mnArcade.update(x)` sets `--p` (the gold progress line) and underlines the group of the card at the left edge;
- touch devices (`hover: none` / `pointer: coarse`) show the description and Book now under each card instead of on hover.


**Testimonials** (`[data-voices]`, `.mn-ed--voices`, in the `materials` slot):
- stacked layers per guest, all toggled by `is-active` together: `.mn-voices__bg` (backdrop), `.mn-voices__face` (arch portrait), `.mn-voices__quote` (`role=tabpanel`) and the `role=tab` buttons;
- quotes share one grid cell so the card keeps the tallest quote's height; hidden quotes are `inert`;
- the timer is the active tab's `.mn-voices__bar::after` CSS animation (`--dur`); its `animationend` moves to the next guest. `is-auto` turns it on (never with reduced motion), `is-paused` freezes it;
- the tabs carry `.mn-step` so the existing steps reveal animates them; dim their contents, not the tab (the reveal sets the tab's opacity);
- portraits are 800×1000 with headroom for the arch; backdrops 2000×1250.

**Featured Brands** (`.mn-brands`, in the `logos` slot): each `.mn-brand` tile stacks `img.mn-brand__ink` and `img.mn-brand__colour` in `.mn-brand__logo` (absolute, centred, each keeps its proportions); hover swaps their opacity. Logo files: `assets/img/brands/{name}.png` + `{name}-ink.png`, made per logo (silhouette, darkness-based or custom) because the sources differ. The tile reveal clears its transform afterwards so the CSS hover lift still works.

**Co-curated bento** (`.mn-cocur`, `worlds` slot): `ul.mn-cocur__grid` (5 columns) of `li.mn-cc` 4:5 cards, the first `.mn-cc--hero` spanning 2×2. Partner logos reuse the brand ink PNGs, turned white with `filter: brightness(0) invert(1)`. Photos in `assets/img/co-curated/` (1000×1250 hero, 720×900 others).

**Reels marquee** (`[data-reels]`, `social` slot): `ul.mn-social__track` of `li.mn-reel` (9:16, `video` with `preload="none"` + poster). Items carry `margin-right` (not `gap`) so the clone + `translateX(-50%)` loop has no jump. An IntersectionObserver plays and pauses each video. Clips in `assets/video/reels/` (608×1080).

**In-page anchors**: components.js turns any `a[href="#id"]` click into `mnLenis.scrollTo(target)`; the mobile drawer closes itself (and restarts Lenis) first.

**Motif kit** (`css/motifs.css`, sprite `assets/img/motifs.svg`, rules and per-section proposals in [`MOTIFS.md`](MOTIFS.md), specimen `docs/motifs.html`): inlay and bead borders, a cusped edge, vine / lattice / jaali fills, a cusped-arch mask and `<symbol>`s (cusped and ogee arches, niche, lotus, tendril, paisley, rosette, sprig, stitch). Geometry comes from `tools/assets/motifs.mjs`; the footer skyline from `tools/assets/footer-skyline.mjs --splice index.html`. Only the footer uses it so far; apply it to other sections one at a time when the user names them.

**Credits page**: `credits.html` is generated by `tools/assets/credits.py` from the three SOURCES files (headings and tables only). Re-run it after any credit change.

**Editorial blocks** (`.mn-ed`, with modifiers `--overlay`, `--split`, `--fixed`, `--bottom`, `--dark`, `--numbers`, `--rooted`) with `.mn-ed__media` / `.mn-ed__frame` / `.mn-ed__content`. Used by sections 6–8 and the template's Materials.

**Khatam jaali**: copy the exact SVG data-URI (gold `%23c59a5b` stroke, 64px tile) from `.mn-arcade::before` or the numbers card in sections.css. Use it at low opacity with a radial mask.

### Conventions

- 1rem = 10px (`html { font-size: 62.5% }`). Desktop is ≥1025px, tablet 750–1024px, phone ≤749px.
- Class names are BEM with the `mn-` prefix. Comment density matches the surrounding code: short "why" comments, banner comments per section.
- **Line endings:**
  - `css/*.css` and `js/*.js` are **CRLF**; `index.html` is **LF**.
  - When splicing with scripts, keep each file's style.
  - The Edit tool preserves line endings; Python writes need `newline=''` and explicit `\r\n`.
- All links to inner pages (`/originals/...`, `/experiences/...`, `/tours/...`) are placeholders that 404 locally. `href="#"` links are made inert by components.js.
- The client's live-site paths are used where they exist (see LIVE-SITE-AUDIT.md §3 sitemap).

## 5. Design system

| Token | Value | Use |
|---|---|---|
| `--cream` | `#f4eee4` | page background |
| `--ink` | `#2e3937` | text, dark UI (`--ink-70`, `--ink-45` for softer text) |
| `--gold` | `#c59a5b` | Asli accent, rules, arches, jaali stroke |
| `--gold-light` | `#d8b77d` | gold on dark backgrounds |
| dark gold | `#a97835` | gold text on cream (readable): italics in headings, eyebrows, "Book now" |
| `--logo-*` (preloader) / `--rb-*` (base) | the Asli logo's rainbow letters | loader border, statement loops, used sparingly |
| `--muted` | `#707c7a` | credits, small print |

- **Type:** Cormorant Garamond 300/400 for headings, with an *italic* second half in dark gold (for example "A little Hyderabad, *wherever you are.*"). Jost for UI and body. Uppercase labels use letter-spacing 0.14–0.2em. Section titles run about `clamp(3.8rem, 3.3vw, 6.4rem)`.
- **Ease:** `--ease: cubic-bezier(.22, 1, .36, 1)`. GSAP uses `power2/3.out` for reveals and `expo.out` for ticks.
- **Imagery:** warm, natural light. A light consistent grade is fine (slight warmth, contrast about 1.03–1.07). For a bright sky next to the cream page, add a warm graduated filter (see the city image).

## 6. Assets and licensing

- Folders:
  - `assets/img/`: themes, conventions, originals, quick, art (sepia + colourised prints), numbers, rooted-golconda, brand.
  - `assets/site-photos/`: photos downloaded from the live aslihyd.in (the client's own: tours, conventions, groups). Use these first when they fit.
  - `assets/video/`: hero, themes, originals.
  - `assets/brand/`: the Asli logo, a 200×60 PNG. The client has not supplied a vector.
- **Sources that work from scripts:**
  - Wikimedia Commons (CC0/PD/CC BY/CC BY-SA);
  - Mixkit (free licence, no credit);
  - Coverr (free licence, no credit, no AI training).
- **Sources that block scripts:** Pexels and Pixabay return 403. YouTube is forbidden; the user asked, and it is a copyright problem.
- **Process:**
  1. Search with `tools/assets/commons.py` / `coverr.py` / `mixkit_hd.py`.
  2. **Look at the contact sheet.**
  3. Inspect the shortlist at full size.
  4. Crop or grade (`cardcrop.py` for 720×840 cards).
  5. Make loops with `loopclip.sh`.
  6. Record the credit (Commons `get` prints JSON) in the right SOURCES file.
- **Credits:** CC BY / BY-SA photos need a visible credit on the site. No credits are shown on the page (the user removed them from Quick Experiences and the testimonials). Everything is listed in the SOURCES files and published on `credits.html` (footer link **Photo credits**), generated by `tools/assets/credits.py`.
- **Flags for the client:**
  - The hero/heritage drone footage carries an **@Drone_Venkat** watermark; it needs permission or a clean master.
  - The stock clips are Indian or neutral footage, but not filmed in Hyderabad.
  - The section 4 card images have Gemini prompts for replacement.
- The `assets/video/spinner-*.mp4` files and the `collection-b/` images are unused leftovers of the template. Keep them unless the user asks to delete them.

## 7. Checking work

```
node server.js 8655                                  # your own port; never stop a server you did not start
node tools/test/shot.mjs http://127.0.0.1:8655/ <ABS_OUT> <data-sec> 1440x900 1280x720 390x844
node tools/test/originals.mjs http://127.0.0.1:8655/ <ABS_OUT>
node tools/test/arcade.mjs http://127.0.0.1:8655/ <ABS_OUT>
node tools/test/skyline.mjs http://127.0.0.1:8655/ <ABS_OUT>
node tools/test/finale.mjs http://127.0.0.1:8655/ <ABS_OUT>
node tools/test/voices.mjs http://127.0.0.1:8655/ <ABS_OUT>
node tools/test/footer.mjs http://127.0.0.1:8655/ <ABS_OUT>
```

- Write a focused suite on `tools/test/cdp.mjs` for any new interaction. Cover desktop hover/keyboard, the phone tap flow, reduced motion, `docW === vw` (no horizontal scroll) and a clean console.
- Re-run the suites for neighbouring sections, because sections are chained: city → spinner → collection-b → materials.
- Put temporary files and screenshots in the session scratchpad, not the repo.
- `node --check js/*.js` after JS edits.

## 8. Gotchas we hit

- **Drawing a `pathLength="1"` path with GSAP needs `autoRound: false`.** GSAP rounds px values by default, so a `strokeDashoffset` tween from 1 to 0 snaps between the two instead of drawing. Every dash tween in motion.js sets it.
- **No `vector-effect: non-scaling-stroke` on paths that are drawn with a dash.** Chrome measures a non-scaling stroke's dashes in screen pixels, so a dash sized in SVG units ends early or late. The skyline sets its stroke width in SVG units per context (`--sw`) instead.

- Charminar photos taken after 2019 mostly show **restoration scaffolding**. Check at full size.
- The Coverr CDN redirects everything. A HEAD check "succeeds" for missing files; check with a ranged GET (`tools/assets/coverr.py` does this).
- `ffmpeg` inside a `while read` loop eats stdin. Always pass `-nostdin`. `xfade` output needs `format=yuv420p` for x264.
- Use Python with `-I` on anything that reads downloaded files. Windows long paths broke a venv once: put venvs under `%TEMP%`.
- Chrome needs an absolute `--user-data-dir`. Relative output paths silently fail to launch.
- Headless hover tests need the element **inside the viewport**. Touch emulation sticks for the rest of that browser session.
- **Section 4's tap-to-preview was broken on Android** (focus fired before click). It is now fixed for both explorers by activating on `:focus-visible` only. Keep that.
- In the city section on desktop, the image panel starts translated (`y: -vh`) inside the wipe. Measure the **section** top to know when it has landed.

## 9. Open items to raise with the user or client

1. **Written permission** from the 9 featured brands (logos and names) and the 3 named testimonial guests.
2. **Brand list**: the client's wireframe named Anaganaga, Paista, Concu and Escape Estates; no official logos could be found (Paista and Escape Estates don't appear publicly; the only "Concu" found is Conçu, a cake boutique). The user approved swapping in Paradise, Karachi Bakery, Heartfulness and Shilparamam. The co-curated pairings follow the grid.
3. **Instagram and other socials**: the real handles and URLs. `@aslihyderabad` is a placeholder and "Follow on Instagram" is inert; the footer's Instagram, Facebook, LinkedIn and YouTube icons are `href="#"` too (the live site lists no social accounts).
4. **Real Asli reels** to replace the licensed stock (only the drone montage is Hyderabad footage).
5. Prices for everything ("Price on request" for now).
6. A clean hero drone master (watermark), and Hyderabad-shot footage for the explorers.
7. A vector Asli logo.
8. Inner pages: every link is a placeholder.
9. The wireframe author's note: launch with 4 Originals. The user chose 6; keep 6 unless told otherwise.
