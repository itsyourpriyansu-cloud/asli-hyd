# Asli Hyderabad: all inner pages (59 static pages)

## Context
The homepage is finished, but every inner link (`/tours/…`, `/conventions/…`, `/originals/…`, `/services`, `/contact`, …) 404s, and the Quick Experience and Co-curated cards go nowhere (CONTENT-FLOW §8.6). The old site aslihyd.in holds the real content. I re-checked it on 9 Nov: same inventory as the October audit (14 tours, 10 conventions, 8 services, 1 Original, 1 placeholder partner). The audit only summarises some copy, so the full text gets re-crawled.

Outcome: every link on the site lands on a finished page in the homepage's language (cream / ink / gold, Cormorant + Jost, jaali, arches, fine gold lines), on phone, tablet and desktop.

**Decided with you:** forms send through WhatsApp + email · Private Access shows the 5 unnamed encounters (3 named ones in the data, switched off until consent) · build everything in one go.

## Pages (59)
| Area | URLs | Count | Content source |
|---|---|---|---|
| Tours | `/tours`, `/tours/<slug>` | 1 + 15 | 14 live tours in full (About, Highlights, Included, Good to know, facts). Young Innovators is new (wireframe line + my short copy) |
| Themes | `/experiences/<theme>` | 6 | Live intro text verbatim, galleries, tours in that theme |
| Offers | `/experiences/co-curated`, `/experiences/quick` | 2 | Wireframe's 15 and 14; homepage descriptions; I write what's missing |
| Conventions | `/conventions`, `/conventions/<slug>` | 1 + 12 | The homepage's 12 events; live descriptions and tour lists for 6; I write short ones for the 6 the live site lacks. "Not the organiser" disclaimer on all |
| Originals | `/originals`, `/originals/<slug>` | 1 + 6 | Wireframe §6.4 for 4; homepage copy expanded for Ramzan Nights and Festival Hyderabad |
| Services | `/services`, `/services/<slug>` | 1 + 8 | Live text in full, wireframe duration options, "Need something else? Ask Asli" |
| Others | `/partners`, `/private-access`, `/gallery`, `/contact`, `/book-now`, `404` | 6 | Wireframe + live |

**Copy rules:** live text stays word for word except typo fixes (audit §7.6). Display names follow the wireframe, as the homepage does ("Old Hyderabad", "Crafted Hyderabad"); URLs keep the live slugs. Boilerplate intros and admin text from the old site are dropped. All prices read "Price on request". No eyebrows, so the live tagline lines sit *under* the title. One booking action per page. My report lists every piece of copy I wrote.

## Architecture: static pages from one generator
Hand-copying 59 pages would drift, and the site has no build step on deploy. So, like `tools/assets/credits.py`, one script writes plain HTML that gets committed. Vercel deploys it as it does today.

- `data/*.json`: one file per content type (tours, themes, conventions, originals, services, offers, partners, private-access, gallery). The crawl script is throwaway (scratchpad); the JSON is the source of truth.
- `tools/build-pages.mjs` (Node, no dependencies): template functions + HTML escaping; writes `tours/<slug>/index.html` and so on.
  - **Header, icon sprite and footer are sliced out of `index.html` at build time**, so there is one source and no copies. It rewrites `assets/…` to `/assets/…`, and `#co-curated`, `#quick-experiences`, `#private-access`, `#featured-brands` to their new pages.
  - Each page gets its own title, meta description and Open Graph image.
  - **Self-check:** the build fails if any internal link or image on any page (homepage included) doesn't resolve.
- `server.js`: one small change so `/tours` serves `tours/index.html`.
- `vercel.json`: redirects so old URLs keep working: `/tours/:slug/book` → `/book-now?experience=:slug`, the 4 past conventions → `/conventions`, the placeholder partner → `/partners`.

### Shared JS and CSS (reuse, no duplicates)
- `js/motion.js` is loaded on inner pages for Lenis and the footer skyline.
  - The two home `mm.add` blocks become home-only by swapping their media query for `not all` off the homepage (one token each, so no re-indenting).
  - `scrollTo(0,0)` and manual scroll restoration become home-only, so the back button and `#anchors` work on inner pages.
  - New small block: `[data-rise]` reveals, the hero arch opening, the route thread. All set by JS only, so no-JS and reduced motion render everything complete.
- `js/components.js` keeps header, drawer, dropdowns and footer as they are. Add:
  - `if (!rail) return;` so the existing past-event filter also runs on `/conventions`;
  - tour theme filter;
  - gallery lightbox on native `<dialog>`;
  - hero video gate (off for reduced motion and data saver);
  - the enquiry form handler.
- `css/pages.css`: new, with a banner comment per template. Inner pages load fonts, base, header, sections, motifs, footer and pages; **no preloader on inner pages**.

### Forms
Two forms, one handler. Native validation first, then it opens `wa.me/919392149872` with the request written out, and shows: "WhatsApp has opened with your request. Press Send there to reach us", plus a `mailto:` link with the same text.
- **Plan My Hyderabad** (`/book-now`): experience dropdown with groups for Tours, Originals, Co-curated, Quick and Services (fixes audit #17); name, email, phone, guests, date, notes. `?experience=<slug>` preselects, so every Book button lands here.
- **Contact:** name, email, phone, message. `?topic=` prefills it (used by Request Access and the convention chips).

Nothing is stored.

## Design by template
Everything opens on a full-bleed image under the transparent header, title in two halves with the second in italic gold (matching the homepage on photo grounds).

| Template | Signature moment | Layout |
|---|---|---|
| **Page hero (all)** | The image opens out of a cusped Mughal arch on load, then gentle parallax | Title bottom-left, tagline under it, `svh` height, fade for legibility |
| **Tours list** | Arch-topped cards (the Quick Experiences card), rise in by row | Theme tabs (6 + Evening); 3 / 2 / 1 columns |
| **Tour detail** | **The route thread:** a gold line draws down the numbered highlights with the scroll, each stop lighting as it passes | Facts bar → About → thread → Included / Good to know → gallery → 3 related tours. Glass outlined booking card sticky on desktop (the Two Paths card); fixed bottom bar on phones, safe-area aware |
| **Theme** | Homepage's looping theme video as the hero | Live heading + paragraph with jaali behind, photo gallery with captions, tours in the theme, one CTA |
| **Conventions list** | Reuses the homepage's dark 2:3 event cards as a grid; past events drop out | Grid + "Need something else?" chips |
| **Convention detail** | **"Your conference week":** a Before · During · After timeline on one gold line | Before/After = half and full-day tours. During (empty on the live site) = 20–60 min Quick Experiences. Chips → `/contact?topic=` |
| **Originals list** | **The week at a glance:** Sunday dawn, Saturday table, Friday night, monthly, seasonal, as a calendar strip | Large alternating cards |
| **Original detail** | Homepage's looping video hero; the schedule set large in Cormorant ("Every Sunday · 6:30 AM") | The experience / Best for / Includes / Meeting point, one CTA ("Book this Sunday") |
| **Co-curated / Quick** | Bento (15) from the homepage; arch cards (14) | Every description visible without hover; each has an `id` the homepage cards link to |
| **Services** | Hairline editorial list; the row's photo appears on hover (shown inline on touch) | Detail: live text + duration chips |
| **Partners** | Homepage's tile grid at full size | Each tile links to its paired experience |
| **Private Access** | Dark page, door photo from the homepage teaser | 5 encounters as a numbered list, "By request only" note, Request Access |
| **Gallery** | Masonry that doesn't repeat, keyboard lightbox with captions | Real guest and delegate photos first |
| **Contact / Book** | Split: dusk Charminar photo + form | Stacks on phones, 44px targets, correct input types |

**All devices:** no information behind hover; 3 breakpoints as on the homepage (≥1025 / 750–1024 / ≤749); hero `srcset` at 1000 and 1920 wide; lazy loading with `width`/`height` set; no sideways scroll.

## Images
Order of preference: the client's real group photos (strongest proof) → Wikimedia Commons (no NC/ND) → Mixkit/Coverr. Each goes through contact sheet, full-size inspection (no scaffolding, watermarks, close-up children), crop, credit.

| Group | Plan |
|---|---|
| Tours | Client's 2400px `tour-*`; Commons replaces Village Life (500×333) and adds 3 gallery shots per tour. Checked: Shilparamam 293 results, Ramoji 663, Birla Mandir 561, Statue of Equality 27, Kanha 15, Hussain Sagar night 11 |
| Themes | Homepage clips as heroes; Commons replaces low-res Qutb Shahi and Perini, and fills the 3 empty galleries (Business, Wellness, Learning) |
| Conventions | Client's delegate photos and existing cards; Commons HICC / HITEX for the 6 new events |
| Originals, Quick, Co-curated, Partners | Existing homepage assets; Commons for the 8 co-curated and 4 quick without photos |
| Services | Client's 8 images kept (audit: AI-styled, temporary; Commons has little for these subjects) |

Output in `assets/img/pages/` (hero 1920 and 1000 wide, card 720×900). `tools/assets/cardcrop.py` gets optional width/height arguments. Every credit goes in `assets/img/SOURCES.md`, then re-run `credits.py`.

## Files
- **New:** `data/*.json`, `tools/build-pages.mjs`, `css/pages.css`, `tools/test/pages.mjs`, generated page folders (`tours/`, `experiences/`, `conventions/`, `originals/`, `services/`, `partners/`, `private-access/`, `gallery/`, `contact/`, `book-now/`, `404.html`), `assets/img/pages/`.
- **Changed:** `server.js`, `vercel.json`, `js/motion.js`, `js/components.js`, `tools/assets/cardcrop.py`, `assets/img/SOURCES.md`, `credits.html`.
- **`index.html`, links only:** 10 Quick cards → `/experiences/quick#…`, 7 Co-curated cards → `/experiences/co-curated#…`. No other homepage change.
- **Docs:** archive this plan as `docs/plans/2026-11-09-inner-pages.md`; update PROJECT-CONTEXT, CONTENT-FLOW §5, and the "placeholders 404" line in CLAUDE.md (add: re-run the build after editing the header, footer or data).

## Order
1. Crawl all 63 live pages → `data/*.json`, typos fixed.
2. Generator, shared shell, server, motion and components guards.
3. Templates and `pages.css`, one at a time.
4. Source, crop and credit images.
5. Wire the homepage card links, run the build and its link check.
6. Full test pass, docs.

## Verification
- **Build self-check:** zero broken internal links or missing images across all 59 pages + homepage. `node --check` on JS.
- **`tools/test/pages.mjs`** (on `tools/test/cdp.mjs`), every page at 1440×900, 1280×720, 390×844:
  - console clean, `docW === vw`, one `h1`, no `[class*="eyebrow"]`, images load;
  - reduced motion shows everything.
- **Interactions:**
  - tour filter;
  - form validation and correct WhatsApp text (stubbed `window.open`), `?experience=` and `?topic=` prefill;
  - lightbox keyboard open, arrows, Esc;
  - past-event filter on `/conventions`;
  - back button keeps position; `#anchor` landing;
  - phone bottom bar doesn't cover the footer; drawer works.
- **Look at screenshots** of every template at 1440×900, 1280×720, 834×1112, 390×844.
- **Homepage regression** (motion.js changed): `conventions`, `arcade`, `originals`, `voices`, `finale`, `footer`, `skyline`, `hero` suites, plus a homepage console check.

## Skipped on purpose
Privacy and Terms (need the client's legal text; links stay inert) · `/tours/<slug>/book` pages (one form + redirect) · partner detail pages (only placeholder data exists) · past-convention detail pages · sitemap and JSON-LD.
