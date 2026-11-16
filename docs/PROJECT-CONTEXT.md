# Asli Hyderabad homepage: project context and handoff

The working memory of this build: what the site is, how the user wants to work, what each section does, how the code fits together, where the assets came from, how to check work, and what is left. Read it fully before changing anything. `CLAUDE.md` (repo root) is the short version.

Last updated: 27 Oct 2026, after the motif kit and the footer's skyline band (see [`MOTIFS.md`](MOTIFS.md)).

---

## 1. What this is

- **Client:** Asli Hyderabad (aslihyd.in). It is a Hyderabad hosting company: curated tours, conference-delegate programmes, signature "Originals", private access to people and places, short cultural experiences. Contact on the site: Sahana, sahana@aslihyd.in, +91 93921 49872.
- **This repo:** a single-page **homepage** prototype in plain HTML/CSS/JS with GSAP 3.12.5 + ScrollTrigger, all local (no CDN), on **native scroll** (Lenis and the pinned, stacked sections were removed in v3, 16 Nov 2026, at the client's request for lighter movement between sections). It began as a luxury-embroidery template called **"Maison Nomen"**, and every `mn-` class name comes from it. We are re-skinning it **section by section**.
- **Sources of truth for content:**
  - [`WIREFRAME-CONTENT.md`](../WIREFRAME-CONTENT.md): everything in the client's wireframe PDF (15 homepage sections, tables, copy, open questions). It is the **brief**.
  - [`LIVE-SITE-AUDIT.md`](../LIVE-SITE-AUDIT.md): a crawl of the live aslihyd.in (tours, conventions, themes, services, numbers, testimonials, photo inventory, logo).
  - [`GEMINI-IMAGE-PROMPTS.md`](../GEMINI-IMAGE-PROMPTS.md): prompts for client-generated replacements of the section 4 card images.
  - [`VIDEO-SOURCES.md`](../VIDEO-SOURCES.md), [`assets/img/SOURCES.md`](../assets/img/SOURCES.md), [`assets/img/quick/SOURCES.md`](../assets/img/quick/SOURCES.md): every third-party clip and photo, with licence.
  - [`SITE-OUTLINE.md`](../SITE-OUTLINE.md): the **template-era** asset brief. All of its sections are now outdated: every template slot has been rebuilt. Keep it for history only.
  - [`docs/plans/`](plans/): the approved plans from earlier steps (history and rationale).
  - [`CONTENT-FLOW.md`](CONTENT-FLOW.md): the homepage's story top to bottom: acts, copy, link map, journeys, wireframe vs built.

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

- **No eyebrows anywhere, minimal CTAs.** On 7 Nov 2026 the user removed every eyebrow on the site (`.mn-eyebrow` and the per-section eyebrow rules are deleted; `tools/test/home.mjs` fails if any `[class*="eyebrow"]` returns). Do not add an eyebrow, kicker or second CTA.
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

`data-sec` names are **load-bearing**: `js/motion.js` finds each section's one-shot reveals by these names (since v3 nothing pins, stacks or wipes). Replace a section's *content*, keep its `<section data-sec="…">` wrapper, and update the selector in motion.js if the inner root class changes. The v3 order and brief: [`plans/2026-11-16-client-feedback-v3.md`](plans/2026-11-16-client-feedback-v3.md).

| Visible # | Code comment | `data-sec` | Content now | Status |
|---|---|---|---|---|
| — | loader | `#mn-pre` | Intro loader: 5 Hyderabad images open one by one inside a logo-colour border; "Hyderabad is *Regal / Crafted / Inventive / Serene / Welcoming*"; cream background with a drifting gold jaali; morphs into the hero | done |
| 1 | 1. HERO | `hero` | Drone video, "Experience **Asli = Real** Hyderabad" set in Cormorant Garamond Light, always three left-aligned lines ("Experience" / "Asli = Real" / "Hyderabad"), 96px on desktop, 80px tablet, min(72px, 15vw) phone; dark overlay + bottom gradient, **no CTA, no eyebrow** | done |
| 2 | 2. 6 WAYS TO EXPERIENCE HYDERABAD | `collection-a` | **16 Nov 2026: the windows now have a cusped (multifoil) dome**, the motifs.css arch: an SVG cap mask sized in `cqw` (each `<li>` is a container) over a body 3% narrower each side, so the lowest lobes overhang; the gold hairline is a masked layer that follows the dome; the keyboard ring sits on the `<li>`. v3 (client: "simple, near-vertical windows"): "6 ways to *experience Hyderabad.*" + "All tours". Six tall arch-topped windows (`.mn-way`, soft border-radius arch with an inset gold hairline), one per theme, each one link to `/experiences/<theme>`. Hover or keyboard focus plays the theme loop (`[data-preview]`) and brings up the line and "Explore"; touch shows the line. 6 in a row desktop, 3×2 tablet, 2×3 phone. The old card explorer (`[data-themes]`) is gone. Test: `tools/test/home.mjs` | done |
| 3 | 3. FEATURED TOURS | `tours` (new) | v3: "Featured *tours.*" + "All tours". Theme tabs (`.mn-tabs.mn-tabs--icons`, `[data-filter-root]`): centred pills, each with its `i-theme-*` glyph (no Evening tab on the homepage since 16 Nov; Hyderabad by Night shows under All). Then the 12 most booked tours (the wireframe's 13 minus Young Innovators) as small arch cards (`.mn-tour`, reusing `.mn-arcade__media/__arch`), four to a row, three on tablets; phones a swipe rail about 1.4 cards wide. **Desktop shows two rows (8)**; the **"View more tours"** button (`[data-more]`, components.js) opens the rest, recounts after each filter and moves focus to the first new card. Card (16 Nov): the duration with a clock in the pill on the photo, name, the core line with a pin, a hairline, then "Explore" on the left. Images `assets/img/pages/tours/<slug>-card.jpg` | done |
| 4 | 4. CONVENTIONS | `conventions` | **16 Nov 2026:** no longer one screen tall; the cards share the Featured Tours grid (same `.mn-wrap` container, four to a row with the same gap, three on tablets, 74% on phones, 2:3) and the arrows are `.mn-railbtns` beside the Find pill (`.mn-conv__actions`). Earlier: one-screen card rail (2:3 cards sized from the rail's height), heading left, no eyebrow. v3: no pin; the rail swipes at every size (arrows on mouse screens, auto-advance on phones). The old "All conventions" link is now the **"Find your event \| Nov 2026"** pill (`.mn-conv__find`), which opens the **events calendar**, a native `<dialog id="mn-finder">` built from the rail cards by components.js: month grid with event dots, today ringed, the picked day gold; type checkboxes (from each card's `data-type`: conference / exhibition / summit; only types with events show); search across all months; rows with thumbnail, date, name, venue, type, Explore; an empty month offers the next event. Phones: a full-screen sheet that scrolls as one column, compact month, type chips in one row, pinned close button. Past events (by `data-end`) are removed. Test: `tools/test/home.mjs` | done |
| 5 | 5. ASLI HYDERABAD IN NUMBERS | `commission` (`id="trusted"`) | v3 ("no need to waste an entire page"): a slim cream band, "Asli Hyderabad in numbers" and five figures between fine gold rules, counting up once: 30+ experience partners & local businesses, 275+ curated destination experiences, 15+ hotels & hospitality partners, 35+ corporate & institutional clients, 20+ licensed tour leaders & local experts (client's reference image; also in `data/proof.json`). Phones 2+2+1 | done |
| 6 | 6. PRIVATE ACCESS | `collector` | "Hyderabad, *behind closed doors.*" v3.1: full bleed, edge to edge, one screen tall (max 100rem); nothing slides over it (the client saw it "clubbed and overlapping" before). Doors swing open once onto the durbar hall. Placeholder until the client sends the content | done (client content to come) |
| 7 | 7. ROOTED IN HYDERABAD | `city` | Since 16 Nov 2026 only the ink band (the editorial pair "Four centuries of a city, *hosted by people who call it home.*" with the Qutb Shahi / Charminar / HITEC City crossfade was removed at the user's request; `assets/img/rooted-*.jpg` are now unused): the ink band "Four centuries, *one city.*" (centred) with the **"400 years in one line"** skyline, which draws once, landmark by landmark, at every size (it glides sideways on smaller screens). Each landmark has a **pin**: a dotted leader from the ground to a gold diamond on the axis at its `data-x`, year and name below. v3.1 redrew the Hussain Sagar Buddha (rock, plinth, lotus, robed figure) and HITEC City (Cyber Towers between two towers) | done |
| 8 | 8. QUICK EXPERIENCES | `spinner` (old name kept) | "A little Hyderabad, *wherever you are.*" **Arcade rail** of the 10 experiences as arch cards with Workshops / Performances buttons. v3: a native swipe rail at every size with prev/next arrows (`.mn-railbtns`) on mouse screens; arches draw once. The earlier list version is in `docs/backups/quick-experiences-v1/` | done |
| 9 | 9. FEATURED BRANDS | `logos` (old name kept) | **16 Nov 2026: one brand only, Anaganaga** (user's choice), a larger solo tile (`.mn-brands__grid--solo`): official emblem from anaganaga.kitchen (`assets/img/brands/anaganaga(-ink).svg`, ink at rest, brand red #DE271F on hover), category "Telugu Culture & Cuisine", the whole tile links to https://anaganaga.kitchen/. The name is visually hidden (the emblem carries the wordmark). The other eight logos stay in `assets/img/brands/`, unused. Before: "Featured brands *of Hyderabad.*" Copy left, a 3×3 grid of white tiles right: official logo (ink at rest, brand colours on hover), name, gold rule, italic category; faint Charminar and Chowmahalla drawings. Taj Falaknuma, Café Niloufer, Goyaz, Ramoji, HICC are the wireframe's; Paradise, Heartfulness, Karachi Bakery, Shilparamam replace four whose logos could not be sourced (the user chose this). Unchanged in v3. Phones (v3.1): a compact 3×3 grid of logo + name tiles; the category line and the second paragraph are hidden | done (brand permissions needed) |
| 10 | 10. ASLI ORIGINALS / CURATED EXPERIENCES WITH PARTNERS | `worlds` (`id="co-curated"`) | v3 (replaces both the Originals explorer and the co-curated bento): "Asli Originals / *Curated Experiences with Partners*" + "View all experiences". A row of 13 9:16 **shorts** (`.mn-short`): 7 co-curated experiences with their partner's white logo, 6 Originals tagged "An Asli Original", alternating. The bar above: partner logo chips that filter the row (`[data-filter-root]`, "All" and "Asli Originals" too) and rail arrows on mouse screens. A card with a clip previews it on hover, or on touch while on screen (`[data-preview="auto"]`); 9 have clips (`assets/video/shorts/` + five reels), 4 show their photo. About 5 visible desktop. Phones (v3.1): one card with a peek of the next (62vw), soft pill filters that fade at the edge, no arrows, no play glyph | done (client's own shorts to come) |
| 11 | 11. TESTIMONIALS | `materials` (old name kept) | v3: a real section heading above the stage, "Asli Hyderabad, *in their words.*" (moved out of the card; v3.1 centred, `.mn-head--center`, on the loader's khatam jaali with a cream glow, `.mn-voices__pattern`), and the section now follows the shorts. The 4 live-site testimonials (verbatim): a backdrop per guest, a toned portrait in a gold Mughal arch, the quote in the boxed card; the guests along the bottom are tabs whose gold hairline is a 10 s timer | done |
| 12 | 12. @ASLIHYD REELS | `social` | **16 Nov 2026:** Instagram is **@aslihyd** (`https://www.instagram.com/aslihyd/`) here, in the footer and in the floating contact; the head's link is now "Follow on Instagram". All eight reels are now Asli's own: the drone montage, three World Tourism Day 2026 clips (`reels/wtd-*`) and four guest reels (`reels/asli-*`), 432×768, about 0.8–2.4 MB each. Eight 9:16 muted loops in a CSS marquee (cloned once by components.js); only on-screen reels play; pauses on hover/focus; reduced motion or data-saver: posters, no marquee. Kept as its own section in v3 (user's choice). The handle is a placeholder | done (handle + real reels to come) |
| 13 | 13. YOUR HYDERABAD STARTS HERE | `heritage` (`id="plan"`) | v3 (client: a cleaner image, the text must read): an editorial split on cream. Left: "Your Hyderabad *starts here.*", one line, "Plan My Hyderabad", then the 3-step timeline and the contact line. Right: a Qutb Shahi tomb (`assets/img/cta-qutb-shahi.jpg`, Commons CC BY 4.0) in the Mughal arch, jaali behind it. Stacked on tablets and phones | done |
| — | footer | `.mn-footer` | **Quiet and still** (11 Nov; the skyline, inlay seam and cusped edge were removed at the user's request, old version on branch `v1`). Cream: brand column (logo, line, phone, email, place, social icons) and 3 link columns, then a fine gold rule over the legal row (legal + Privacy/Terms left, **Design by Envizon** right). Social icons are **Phosphor Icons, light weight** (MIT), inlined in the sprite as `i-ph-instagram/facebook/whatsapp`. WhatsApp goes to `wa.me/919392149872` (the old site's only social link). Instagram and Facebook go to `@aslihyderabad` (instagram.com/aslihyderabad, facebook.com/aslihyderabad): the user chose these unverified handles on 11 Nov, so confirm them with the client. Test: `tools/test/footer.mjs` | done (confirm the @aslihyderabad handles) |
| — | floating contact | `[data-fab]` (inside the footer markup so every page shares it) | Fixed bottom right on every page (11 Nov, from the user's widget code, re-styled): an ink toggle with a gold ring opens a column of cream rings with cream labels, filling gold on hover; one soft gold pulse after load. **Call** (`tel:+919392149872`), **WhatsApp** (`wa.me/919392149872`), **Instagram** and **Facebook** are shown; Instagram and Facebook use the footer's `@aslihyderabad` addresses until the client sends the real links (change them in both places in `index.html`). X, LinkedIn and YouTube are in the markup but stay `hidden` until their URL is set in `CONTACT` in `js/components.js`. Escape, outside click and the Hide button close it; closed buttons are `inert`. Lifts above the inner-page phone booking bar (`:has`). Icons: Phosphor light in the sprite. Test: `tools/test/footer.mjs` | done (real Instagram/Facebook links to come) |
| — | header | `[data-header]` | Asli logo, **Home** (first link and first drawer item; `aria-current="page"` on the homepage, stripped for inner pages by build-pages.mjs), Experiences + Plan dropdowns, links; transparent over the hero, frosted after scroll | done |

### What is still missing from the wireframe

The wireframe has 15 sections (see WIREFRAME-CONTENT.md §1). Built differently or not built:

| Wireframe section | Status |
|---|---|
| 03 Featured Tours | Built in v3 (section 3), 12 of the 13 |
| 08a Add-ons | Not built (8 live services, §9.1); linked from the header and footer |
| 09 Experience Asli: In Pictures | Covered by the reels (section 14) |
| 10 Private Access | The teaser (section 7) is built; the full table of 8 needs the named people's consent |
| 11 Health & Wellbeing | Not built (title only in the wireframe); Wellness is one of the 6 ways and the Reset short in section 10 |

## 4. Code architecture

```
index.html            every section in order; the inline <head> script adds html.is-preloading (8 s failsafe)
css/fonts.css         Cormorant Garamond + Jost (self-hosted)
css/base.css          tokens, reset, buttons (.mn-btn), underline links (.mn-ulink), .mn-wrap
css/header.css        header, dropdowns, mobile drawer
css/preloader.css     the intro loader
css/sections.css      every section, in page order, each under a numbered banner comment
css/footer.css
css/pages.css         inner pages only, one banner comment per template
js/vendor/            gsap, ScrollTrigger (pinned versions, local)
js/preloader.js       loader timeline; exposes window.mnPreloader {active, done}; dispatches 'mn:preloaded'
js/components.js      UI behaviour: header, dropdowns, slideshows, preview clips ([data-preview]), swipe rails
                      (initRail / [data-rail]), conventions past-event filter + auto-advance, the events calendar
                      (#mn-finder), filter tabs ([data-filter-root]), steps accordion, marquee, Quick Experiences
                      rail (window.mnArcade {update, goTo})
js/motion.js          one-shot scroll reveals on native scroll (no pins, no smooth-scroll library)
server.js             static server with HTTP Range (needed for video)
tools/                test harness + asset scripts (see tools/README.md)
tools/build-pages.mjs writes the 59 inner pages from data/*.json; slices the header, sprite and footer out of index.html
data/*.json           inner-page content, the source of truth (tours, themes, conventions, originals, services, offers, partners, private-access, gallery, faq, proof)
tours/ experiences/ conventions/ originals/ services/ partners/ private-access/ gallery/ contact/ book-now/ 404.html
                      GENERATED: edit data/ or the templates, then run `node tools/build-pages.mjs`. It deletes and rewrites these folders.
assets/img/pages/     inner-page crops (hero 1920 + 1000, card 720x900, gallery full + thumb)
```

**Inner pages.** Re-run the build after any change to the header, footer or `data/`; it exits 1 if an internal link, anchor or image on any page does not resolve, if a template prints `undefined`, or if a page has no closing band (Private Access, Book Now, Contact, Privacy, Terms and 404 are exempt). Page blocks are small functions in `tools/build-pages.mjs`: `hero` (sizes `mid`, `short`; `cta`, `link`), `whyBlock`, `route` (stops may be `{ at, name, line }`), `galleryGrid` (`mosaic`), `faqBlock`/`faqSec` (native `<details>`), `howSteps`, `proofStrip`, `voice`, `endBand`. CTA rule: one solid button per screen, any second action an underline link. Shared copy lives in `data/faq.json` (questions, How it works steps, delegate logistics); the homepage numbers (five since v3) and the 4 verbatim guest quotes are repeated in `data/proof.json`, so change them in both places. Plan: `docs/plans/2026-11-09-inner-pages-ux.md`. They load components.js and motion.js but no preloader. motion.js runs its homepage reveals only when `body` lacks `.mn-pg`, and adds the hero arch opening, `[data-rise]` reveals and the route thread. Forms open WhatsApp with the request written out plus a `mailto:` fallback, so nothing is stored and the guest must press Send. `node tools/test/pages.mjs <base> <absOut>` checks every page at three sizes and the interactions.

Script order matters: gsap, ScrollTrigger, then **preloader.js, components.js, motion.js**. components.js defines `window.mnArcade` before motion.js uses it. Anything that must wait for the loader awaits `window.mnPreloader.done`.

### motion.js essentials

v3 (16 Nov 2026) rewrote it for native scroll: **no Lenis, no pins, curtains, wipes or z-index stack**. Every effect runs once as its content arrives, the same at every screen size:
- the hero headline char sweep after the loader;
- `[data-rise]` / `[data-rise-item]`: one `ScrollTrigger.batch` lifts section heads and card lists in as they reach 92% of the viewport (skipped with `?review`; clears its inline styles afterwards so CSS hover transforms still work);
- the numbers strip counts up and each "+" lands; the Private Access doors open; the skyline draws (and glides on smaller screens); the Quick Experiences and Featured Tours arches draw; the brand drawings; the testimonial arch and tabs; the CTA timeline;
- inner pages: hero parallax and arch, route thread.

Helpers: `sec(name)`, `once(test, fn)` (runs `fn` the first time `test` passes while scrolling), `inView(el, at)`, `parallax` (inner pages), `splitText(el)`. Blocks that differ by size still use `gsap.matchMedia` and push their cleanups. With `prefers-reduced-motion`, motion.js exits early: everything must render complete and usable with no JS motion; components check `reduceMotion` too (no preview clips, no Ken Burns, no auto-advance).

Scroll lock: `html.is-locked { overflow: hidden }` (base.css) under the mobile drawer, the lightbox and the events calendar. In-page anchors use `scrollIntoView` (smooth unless reduced motion) and land on the section top, since the header hides on the way down.

### Reusable patterns

**Section head** (`.mn-head`, v3): `h2.mn-head__title` (serif, italic gold-ink `em` second half, `.mn-head__slash` for "A / B") left, one `.mn-ulink` right; it wraps under the title on phones. Used by 6 ways, Featured Tours, the shorts and the testimonials.

**Filter tabs** (`[data-filter-root]`, components.js): buttons with `data-filter` and `aria-pressed`, cards with `data-tags`, a `[data-filter-status]` live region ("N tours shown"; the noun comes from `data-filter-noun`). It hides cards with `hidden` and dispatches a bubbling `mn:filtered`. Styled as `.mn-tab` / `.mn-chip` on the homepage (same look as the inner pages' `.mn-pg-tabs`).

**Swipe rails** (`[data-rail=".item"]` root, `[data-rail-track]`, optional `[data-rail-prev]` / `[data-rail-next]`, components.js `initRail`): toggles `is-scrollable` on the root, disables the arrows at each end, steps one visible item, resets on `mn:filtered`. `.mn-railbtns` / `.mn-railbtn` only show with a mouse and while the rail overflows. Used by Featured Tours (phones), Quick Experiences and the shorts; the conventions rail uses the same function with its own arrows.

**Preview clips** (`[data-preview]` on a link that contains a `video[data-src]`): hover or keyboard focus sets the `src` and plays; the host gets `is-playing` while it plays (CSS fades the video in over the photo). `[data-preview="auto"]` also plays while on screen on touch devices. Never with reduced motion or data-saver.

**Events calendar** (`#mn-finder`, components.js IIFE): reads the conventions rail cards (`time[datetime]`, `data-end`, name, venue, image, link, `data-type`), so the events live in one place. Opens with `showModal()` + `is-locked`; Esc, the close button and a backdrop click close it and hand focus back.

**Quick Experiences, the arcade rail** (`[data-arcade]`, `.mn-arcade`):
- an `ol.mn-arcade__track` of 10 `.mn-arcade__card`s (`data-group` = `workshops` / `performances`), each one link: arch photo (Mughal arch mask), description, number, name, and a foot where Book now replaces the duration on hover;
- `.mn-arcade__rail` scrolls natively at every size (v3), with the `.mn-railbtns` arrows; `goTo(card)` scrolls the rail;
- `mnArcade.update(x)` sets `--p` (the gold progress line) and underlines the group of the card at the left edge;
- touch devices (`hover: none` / `pointer: coarse`) show the description and Book now under each card instead of on hover.


**Testimonials** (`[data-voices]`, `.mn-ed--voices`, in the `materials` slot):
- stacked layers per guest, all toggled by `is-active` together: `.mn-voices__bg` (backdrop), `.mn-voices__face` (arch portrait), `.mn-voices__quote` (`role=tabpanel`) and the `role=tab` buttons;
- quotes share one grid cell so the card keeps the tallest quote's height; hidden quotes are `inert`;
- the timer is the active tab's `.mn-voices__bar::after` CSS animation (`--dur`); its `animationend` moves to the next guest. `is-auto` turns it on (never with reduced motion), `is-paused` freezes it;
- the tabs carry `.mn-step` so the existing steps reveal animates them; dim their contents, not the tab (the reveal sets the tab's opacity);
- portraits are 800×1000 with headroom for the arch; backdrops 2000×1250.

**Featured Brands** (`.mn-brands`, in the `logos` slot): each `.mn-brand` tile stacks `img.mn-brand__ink` and `img.mn-brand__colour` in `.mn-brand__logo` (absolute, centred, each keeps its proportions); hover swaps their opacity. Logo files: `assets/img/brands/{name}.png` + `{name}-ink.png`, made per logo (silhouette, darkness-based or custom) because the sources differ. The tile reveal clears its transform afterwards so the CSS hover lift still works.

**Shorts** (`.mn-shorts`, `worlds` slot): `ul.mn-shorts__rail` of `li.mn-short[data-tags]`, each `a.mn-short__link` (9:16) with `img.mn-short__img` (720×900 photo), optional `video.mn-short__video[data-src]` + `.mn-short__play`, then `.mn-short__partner` (brand ink PNG turned white with `filter: brightness(0) invert(1)`) or `.mn-short__tag` "An Asli Original", and the name + "with …" line. Clips: 608×1080, 30 fps, H.264, no audio, `+faststart`. The **`.mn-cc` card** is kept in sections.css for the inner pages' offer grids.

**Reels marquee** (`[data-reels]`, `social` slot): `ul.mn-social__track` of `li.mn-reel` (9:16, `video` with `preload="none"` + poster). Items carry `margin-right` (not `gap`) so the clone + `translateX(-50%)` loop has no jump. An IntersectionObserver plays and pauses each video. Clips in `assets/video/reels/` (608×1080).

**In-page anchors**: components.js turns any `a[href="#id"]` click into `scrollIntoView`; the mobile drawer closes itself (and unlocks the page) first.

**Motif kit** (`css/motifs.css`, sprite `assets/img/motifs.svg`, rules and per-section proposals in [`MOTIFS.md`](MOTIFS.md), specimen `docs/motifs.html`): inlay and bead borders, a cusped edge, vine / lattice / jaali fills, a cusped-arch mask and `<symbol>`s (cusped and ogee arches, niche, lotus, tendril, paisley, rosette, sprig, stitch). Geometry comes from `tools/assets/motifs.mjs`; the footer skyline from `tools/assets/footer-skyline.mjs --splice index.html`. Only the footer uses it so far; apply it to other sections one at a time when the user names them.

**Credits page**: `credits.html` is generated by `tools/assets/credits.py` from the three SOURCES files (headings and tables only). Re-run it after any credit change.

**Inner-page booking card** (`bookCard` in `tools/build-pages.mjs`, `.mn-pg-book`): name, price, a spec table of key facts with gold icons (`rows: [label, value, sprite id]`; tours: Duration, Time, Format, Min. guests, Available, as on the old site; Originals: When, Timing, Length/Note, meeting point; experiences: their fact rows + Available; services: Options, Available), up to four inclusions (`incl`, hidden on desktop screens under 820px tall), the CTA and a one-line note. On desktop the main column's `.mn-pg-facts` strip is hidden as a repeat; on tablets and phones the card is the bottom bar (name, price, CTA) and the strip shows.

**Editorial blocks** (`.mn-ed`, with modifiers `--overlay`, `--split`, `--fixed`, `--bottom`, `--dark`, `--numbers`, `--rooted`) with `.mn-ed__media` / `.mn-ed__frame` / `.mn-ed__content`. Used by Private Access, Rooted and the testimonials.

**Khatam jaali**: copy the exact SVG data-URI (gold `%23c59a5b` stroke, 64px tile) from `.mn-arcade::before` or the numbers card in sections.css. Use it at low opacity with a radial mask.

### Conventions

- 1rem = 10px (`html { font-size: 62.5% }`). Desktop is ≥1025px, tablet 750–1024px, phone ≤749px.
- Class names are BEM with the `mn-` prefix. Comment density matches the surrounding code: short "why" comments, banner comments per section.
- **Line endings:**
  - All of `css/`, `js/` and `index.html` are **LF** (checked 7 Nov 2026; older notes said CRLF for CSS/JS).
  - When splicing with scripts, keep each file's style.
  - The Edit tool preserves line endings; Python writes need `newline=''` and explicit `\r\n`.
- Inner pages exist and are generated (see section 4); `/tours` etc. resolve through `server.js` locally and Vercel in production. `href="#"` links are made inert by components.js.
- The client's live-site paths are used where they exist (see LIVE-SITE-AUDIT.md §3 sitemap).

## 5. Design system

| Token | Value | Use |
|---|---|---|
| `--cream` | `#f4eee4` | page background |
| `--ink` | `#2a2420` (warm charcoal; was cool `#2e3937` before version 2) | text, dark UI (`--ink-70`, `--ink-45` for softer text) |
| `--gold` | `#c59a5b` | Asli accent, rules, arches, jaali stroke |
| `--gold-light` | `#d8b77d` | gold on dark backgrounds |
| `--gold-ink` | `#8a5f22` (4.9:1 on cream; was `#a97835`, 3.4:1) | gold text on cream (readable): italics in headings, eyebrows, "Book now" |
| `--logo-*` (preloader) / `--rb-*` (base) | the Asli logo's rainbow letters | loader border, used sparingly |
| `--muted` | `#72675d` (4.8:1 on cream) | credits, small print |

- **Type:** Cormorant Garamond 300/400 for headings, with an *italic* second half in dark gold (for example "A little Hyderabad, *wherever you are.*"). Jost for UI and body. Uppercase labels use letter-spacing 0.14–0.2em. Section titles run about `clamp(3.8rem, 3.3vw, 6.4rem)`.
- **Ease:** `--ease: cubic-bezier(.22, 1, .36, 1)`. GSAP uses `power2/3.out` for reveals and `expo.out` for ticks.
- **Imagery:** warm, natural light. A light consistent grade is fine (slight warmth, contrast about 1.03–1.07). For a bright sky next to the cream page, add a warm graduated filter (see the city image).

## 6. Assets and licensing

- Folders:
  - `assets/img/`: themes, conventions, originals, quick, art (sepia + colourised prints), numbers, rooted-*, brand.
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
- Unused leftovers, kept until the user asks to delete them: `assets/video/spinner-*.mp4` and the `collection-b/` images (template); since v3 also `assets/img/cta-taramati.jpg` (old CTA), the numbers slideshow images, and the Originals explorer's 1920×1080 loops in `assets/video/originals/` (the shorts use 608×1080 cuts of two of them).

## 7. Checking work

```
node server.js 8655                                  # your own port; never stop a server you did not start
node tools/test/shot.mjs http://127.0.0.1:8655/ <ABS_OUT> <data-sec> 1440x900 1280x720 390x844
node tools/test/home.mjs http://127.0.0.1:8655/ <ABS_OUT>      # v3 order, 6 ways, tours, calendar, numbers, shorts, phone
node tools/test/hero.mjs http://127.0.0.1:8655/ <ABS_OUT>
node tools/test/skyline.mjs http://127.0.0.1:8655/ <ABS_OUT>
node tools/test/finale.mjs http://127.0.0.1:8655/ <ABS_OUT>
node tools/test/voices.mjs http://127.0.0.1:8655/ <ABS_OUT>
node tools/test/footer.mjs http://127.0.0.1:8655/ <ABS_OUT>
node tools/test/pages.mjs http://127.0.0.1:8655/ <ABS_OUT>     # every inner page, slow (about 10 min)
```

Suites for retired versions (the pinned conventions rail and arcade, the card explorers) are in `tools/test/legacy/`.

- Write a focused suite on `tools/test/cdp.mjs` for any new interaction. Cover desktop hover/keyboard, the phone tap flow, reduced motion, `docW === vw` (no horizontal scroll) and a clean console.
- Sections no longer chain (v3), but shared components do: after changing `.mn-head`, the filter tabs, `initRail` or `[data-preview]`, re-run `home.mjs` and look at every instance.
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
- **Keyboard previews activate on `:focus-visible` only** (a tap also focuses; on Android that fired before the click in the old explorers). `[data-preview]` keeps that rule.
- A border-radius in % on an inset `::after` follows the inset box, so the 6 ways hairline arch keeps the window's shape at every size.
- The header hides while scrolling down, so a `scroll-margin-top` for it would leave a strip of the previous section showing: anchors land at the section top.

## 9. Open items to raise with the user or client

1. **Written permission** from the 9 featured brands (logos and names) and the 3 named testimonial guests.
2. **Brand list**: the client's wireframe named Anaganaga, Paista, Concu and Escape Estates; no official logos could be found (Paista and Escape Estates don't appear publicly; the only "Concu" found is Conçu, a cake boutique). The user approved swapping in Paradise, Karachi Bakery, Heartfulness and Shilparamam. The co-curated pairings follow the grid.
3. **Instagram and other socials**: the real handles and URLs. `@aslihyderabad` is a placeholder. Until the handle exists, the reels link goes to `/gallery` (the Instagram link is in a comment beside it) and the footer's Instagram, Facebook, LinkedIn and YouTube icons are commented out (the live site lists no social accounts).
4. **Real Asli reels and shorts** to replace the licensed stock (only the drone montage is Hyderabad footage). Five reel clips also appear in the shorts row until then.
4a. **Private Access content** (the client said they will send it) and the **hero video master** (ask: 1920×1080 or larger, 10–20 s seamless loop, no watermark, about 8 MB or less as H.264; optional 1080×1920 cut for phones; the current file is 1280×720, 12.7 s, 5.9 MB, with the @Drone_Venkat watermark).
5. Prices for everything ("Price on request" for now).
6. A clean hero drone master (watermark), and Hyderabad-shot footage for the explorers.
7. A vector Asli logo.
8. Inner pages: built 9 Nov 2026 (100 in all since 16 Nov: **`/faq`**, the general FAQ, from `data/faq.json` `general`: the client's 11 questions with copy edited for the site, one optional link per answer, linked from the Plan menu, the drawer and the footer). Every piece of placeholder copy is listed in `docs/CONTENT-TO-REPLACE.md`, generated by the build. Still needed: a lawyer's review of the draft Privacy and Terms, written consent before showing the 3 named Private Access guests (`show: false` in `data/private-access.json`), and confirmation of rights for the site photos (the service images look AI-generated).
9. The wireframe author's note: launch with 4 Originals. The user chose 6; keep 6 unless told otherwise.
