# Plan: Asli Hyderabad inner pages (map, page count, content and build order)

> **Status (27 Oct 2026): saved for later, not yet approved for building.** The user will say when to start. Nothing below has been built.

## Context

All 15 homepage sections are built, but every link off the homepage is still a placeholder. Live-site paths (`/tours/…`, `/originals/…`) 404 locally, 20 links are `href="#"`, and 4 are in-page anchors that should become real pages. This plan:
- maps every link and CTA in `index.html` to a page;
- groups the targets into templates and counts them;
- outlines each page type's content from the wireframe, the live audit and the homepage data;
- proposes the URL scheme, a shared design and code approach, and a phased build.

**It builds nothing.** Once approved, it is archived as `docs/plans/2026-10-27-inner-pages.md`. Each phase below is then built when the user calls it, one template at a time, each with a single exemplar page for review first.

Sources: `index.html` (149 `<a>` links, 48 distinct targets), `WIREFRAME-CONTENT.md`, `LIVE-SITE-AUDIT.md` §2–5, and `docs/PROJECT-CONTEXT.md` §3–9.

---

## 1. CTA → page map

Section numbers are the visible numbers from PROJECT-CONTEXT §3. **Bold targets** are changes from the current `href`. Templates are defined in §2.

### Header (desktop) and mobile drawer
| Source | Label(s) | Current href | → Page | Template |
|---|---|---|---|---|
| Header logo, drawer, footer logo | "Asli Hyderabad, home" | `/` | Home | — |
| Experiences ▸ By interest (and drawer) | Heritage · Culture · Cinema · Business · Wellness · Learning | `/experiences/{theme}` | 6 theme pages | Theme |
| Experiences ▸ Asli signatures (and drawer) | All Tours | `/tours` | Tours listing | Listing |
| ″ | Co-curated Experiences | `#co-curated` | **`/co-curated`** | Listing |
| ″ | Quick Experiences | `#quick-experiences` | **`/quick-experiences`** | Listing |
| ″ | Private Access | `#private-access` | **`/private-access`** | One-off (request) |
| Header (and drawer) | Originals | `/originals` | Originals listing | Listing |
| Header (and drawer) | Conventions | `/conventions` | Conventions listing | Listing |
| Plan ▸ (and drawer) | Plan My Hyderabad | `/book-now` | Plan My Hyderabad | Form |
| Plan ▸ (and drawer) | Add-ons & Services | `/services` | Add-ons listing | Listing |
| Plan ▸ | Custom Itinerary | `/services/custom-hyderabad-itinerary` | Service detail | Service |
| Plan ▸ (and drawer "Contact") | Contact Us | `/contact` | Contact | Form |
| Drawer only | Experiences (group head) | `/tours` | Tours listing | Listing |
| Drawer only | Gallery | `/gallery` | Gallery | One-off |
| Header CTA, drawer CTA | Private Access | `#private-access` | **`/private-access`** (the wireframe's header CTA reads "Request Private Access →") | One-off |
| Header icon, drawer | WhatsApp · phone · email | `wa.me` / `tel:` / `mailto:` | external | — |

### Homepage sections
| # | Section | Label(s) | Current href | → Page | Template |
|---|---|---|---|---|---|
| 1–2 | Hero, Statement | (no links) | — | — | — |
| 3 | Two Paths | "Explore Hyderabad" tile + "Discover Tours" | `/tours` | Tours listing | Listing |
| 3 | Two Paths | "Here for an Event" tile + "Find My Event" | `/conventions` | Conventions listing | Listing |
| 4 | Conventions | All conventions | `/conventions` | Conventions listing | Listing |
| 4 | Conventions | 6 cards (image + title) and the venue line: GANSID · APAC Summit · AVAR · Telangana Rising · ICCA · BioAsia | `/conventions/{slug}` | 6 convention hubs | Convention |
| 5 | Hyderabad, Your Way | All tours · View all tours | `/tours` | Tours listing | Listing |
| 5 | ″ panel routes | Royal Hyderabad · Kingdom of Golconda · Old Hyderabad · Hyderabad on a Plate · Crafted Hyderabad · Pochampally Weaves · Inside Ramoji · HITEC Hyderabad (×2: Business and Learning) · Kanha Retreat | `/tours/{live slug}` | 9 tour details | Tour |
| 5 | ″ | Explore {Theme} ×6, and the 6 theme cards | `/experiences/{theme}` | Theme pages | Theme |
| 6 | Numbers | Plan My Hyderabad | `/book-now` | Plan My Hyderabad | Form |
| 7 | Private Access | Request Access | `/contact` | **`/private-access#request`** | One-off |
| 8 | Rooted | Explore all tours | `/tours` | Tours listing | Listing |
| 9 | Quick Experiences | 10 cards: Cheriyal Mask · Lac Bangle · Bidri · Pearl Jewellery · Pochampally Ikat · Deccani Calligraphy · Folk Performance · Perini · Oggu Katha · Sufi Evening | `#` | **`/quick-experiences#{slug}`** | Listing |
| 10 | Originals | All Originals · View all Originals | `/originals` | Originals listing | Listing |
| 10 | ″ | Book this Sunday / Saturday / Friday · View the next table · Join a Ramzan night · See festival dates, plus the 6 cards | `/originals/{slug}` | 6 Original details | Original |
| 11 | Testimonials | (tabs only) | — | — | — |
| 12 | Featured Brands | Explore all featured brands (the tiles are not links) | `/partners` | Brands listing | Listing |
| 13 | Co-curated | View all 15 experiences | `/experiences/co-curated` | **`/co-curated`** | Listing |
| 13 | ″ | 7 cards: High Tea · Chai Time · Great Hyderabad Tasting · Pearl Experience · Behind the Screen · Made in Hyderabad · Reset | `#` | **`/co-curated#{slug}`** | Listing |
| 14 | Reels | Follow on Instagram | `#` | external Instagram URL (client to supply) | — |
| 15 | Closing CTA | Plan My Hyderabad (plus phone, WhatsApp, email) | `/book-now` | Plan My Hyderabad | Form |

### Footer
| Column | Label(s) | Current href | → Page |
|---|---|---|---|
| Contact block | phone · WhatsApp us · email | external | — |
| Experiences | 6 themes · All Tours | `/experiences/{theme}`, `/tours` | Theme pages, Tours listing |
| Asli Signatures | Asli Originals | `/originals` | Originals listing |
| ″ | Co-curated · Private Access · Quick Experiences | `#…` | **`/co-curated` · `/private-access` · `/quick-experiences`** |
| ″ | Featured Brands | `#featured-brands` | **`/partners`** |
| Plan Your Visit | Plan My Hyderabad · Conventions · Add-ons & Services · Custom Itinerary · Gallery · Contact Us | live paths | as above |
| Bottom row | Privacy Policy · Terms & Conditions | `#` | **`/privacy` · `/terms`** |
| ″ | Photo credits | `credits.html` | Credits (exists; generated) |
| ″ | Partner login | `/login` | Login (see decision D6) |

### Live paths the homepage doesn't link to, which still need pages
- 6 tours: Statue of Equality, Village Life, Hyderabad by Night, Spiritual Circuit, Sacred Journey, and the new Young Innovators. They are reached from `/tours` and the theme pages.
- 4 past conventions, kept as proof that Asli hosts real events.
- `/tours/{slug}/book` (live booking URLs) becomes a redirect to `/book-now?experience={slug}`, with no page of its own.

### Links that collapse into one page
- `#private-access` (×5) and section 7's "Request Access" (`/contact`) → `/private-access`.
- `#quick-experiences` (×3) and the 10 quick cards → `/quick-experiences`.
- `#co-curated` (×3), `/experiences/co-curated` and the 7 co-curated cards → `/co-curated`.
- `#featured-brands` and `/partners` → `/partners`.
- Every "Book / Plan" CTA → one shared enquiry form, pre-set by `?experience=` or `?type=` (a slug only, never personal data), embedded on the detail page or on `/book-now`.

---

## 2. Page types and count

| Template | Pages | Count |
|---|---|---|
| **A. Listing** (one shell, variants per collection) | `/tours` · `/conventions` · `/originals` · `/services` · `/partners` · `/co-curated` · `/quick-experiences` | 7 |
| **B. Theme** | `/experiences/{heritage, culture, cinema, business, wellness, learning}` | 6 |
| **C. Tour detail** | 14 live + Young Innovators | 15 |
| **D. Convention hub** | 6 upcoming + 4 past | 10 |
| **E. Original detail** | dawn · welcome · after-dark · table · ramzan · festival | 6 |
| **F. Service (add-on) detail** | 8 live services | 8 |
| **G. Enquiry / form** | `/book-now` (Plan My Hyderabad) · `/contact` | 2 |
| **H. Private Access** (listing + request in one page) | `/private-access` | 1 |
| **I. Editorial / utility** | `/gallery` · `/privacy` · `/terms` · `/login` · `404` · `credits` (restyle) | 6 |
| **Total** | | **61 pages from 9 templates** |

**Deferred (phase 5, client-dependent; not counted):**
- co-curated details ×15: wait for the reels and partner copy;
- brand details ×9: wait for brand permissions;
- quick-experience details ×14: the content is thin, so the listing's anchored entries carry it.

That would add up to 38 more pages on templates C/E. Until then, each card links to its anchored entry on the listing, and the entry has a Book button.

---

## 3. Content outlines per page type

The rules from CLAUDE.md apply to every page:
- Copy comes from the wireframe and the live site. Copy I write is marked *(ours)* and listed in each phase report.
- Prices read "Price on request".
- No eyebrows or second CTAs beyond those listed here.

### A. Listing (shared shell)
- **Head:** H1 in Cormorant with an italic dark-gold second half, a one-line intro and filter chips where useful.
- **Grid:** a card grid that reuses the homepage card for each collection.
- **Foot:** one closing band, "Plan My Hyderabad" plus contact.

| Page | H1 / intro | Cards and filters |
|---|---|---|
| `/tours` | "Hyderabad, *hosted.*" with the live sub-line "A selected set of hosted routes through heritage, culture, business, cinema, wellness and learning." | 15 tour cards (wireframe display name, theme, Half/Full/Evening, "Private · Small Group · Group"). Theme filter chips: Heritage · Culture · Cinema · Business · Wellness · Learning (+ Evening, see Q5) |
| `/conventions` | "In Hyderabad for a *Convention?*" / "Find your event. Discover Hyderabad around it." (live) | **Upcoming**: the 6 cards with dates, venue and a "Tentative" tag, auto-sorted by `data-end` like the homepage carousel. **Past**: the 4 as a quieter list. Ends with the "not the organiser" disclaimer |
| `/originals` | "Only in Hyderabad. *Only with Asli.*" / "Signature recurring experiences, created and curated by Asli Hyderabad." (wireframe) | A weekly-rhythm strip (Sun 6:30 · Sat 11:00 · Fri 7:00 · Monthly · Seasonal) and 6 tall cards with schedule line and Explore |
| `/services` | "Add-ons" / "Everything you need to experience Hyderabad, seamlessly." (wireframe §9.1) | 8 rows: name, live tagline line, duration options as chips, and Book now (Plan now for Custom Itinerary). Closing "Need something else?" chips (group transport · restaurant reservations · gifting · celebrations · translators · private access · delegate assistance) and **Ask Asli** → `/contact` |
| `/partners` | "Featured brands *of Hyderabad.*" / "Handpicked names that represent the best of Hyderabad." plus the wireframe body | The 9 brand tiles from section 12 (same markup), each with its co-curated pairing. Footer strip "Curated with care. Experienced by you." (wireframe) |
| `/co-curated` | "Small experiences. *Big memories.*" plus the wireframe body | All 15 (wireframe §8.2): number, name, partner category (and partner logo where permitted), the "what guests come for" line and **Book experience**. The 7 homepage photos plus 8 new images. Footer note "Book any experience on its own or add it to your Asli Hyderabad itinerary." → `/book-now` |
| `/quick-experiences` | "A little Hyderabad, *wherever you are.*" / "Short-format cultural experiences for hotels, restaurants, conferences, events, corporate gatherings and private celebrations." (wireframe) | 14 entries in three groups: Workshops 7 (adds Block Printing) · Performances 4 · Bars & tables 3 (Pearl Bar, Bangle Bar, Deccan Craft Table, copy *(ours)*). Arch photo, duration, description, Book now opens the **venue enquiry** (venue, event type, headcount, date) |

### B. Theme page `/experiences/{theme}`
1. **Hero:** the theme's looping video (`assets/video/themes/{theme}.mp4`, still for reduced motion). H1 is the live intro heading, e.g. "Hyderabad, *through the centuries.*", with the card tagline under it.
2. **Intro:** the live intro paragraph, verbatim (audit §5.2).
3. **Tours in this theme:** tour cards.
4. **Gallery:**
   - Heritage, Culture and Cinema use the live galleries (captions given in the audit).
   - Business, Wellness and Learning use theme images plus Commons photos.
5. **Also in this theme:** related Originals, co-curated and quick experiences, e.g.:
   - Culture: Welcome Hyderabad, Chai Time, the workshops;
   - Wellness: Kanha, Reset, Heartfulness.
6. **Closing band:** Customise this → `/book-now?type=custom`; Request Private Access → `/private-access` (the live page's two secondary CTAs).

**Wellness doubles as wireframe 11, "Health & Wellbeing"** (title only in the wireframe). Its scope is open question Q11.

### C. Tour detail `/tours/{live slug}`
1. **Hero:** the tour photo (`assets/site-photos/tour-*.jpg`). H1 is the wireframe display name (e.g. "Kingdom of Golconda"), with the live tagline line under it.
2. **Facts strip:** Duration (Half/Full Day) · Format "Private · Small Group · Group" · Time · Min guests · **Price on request**.
3. **Body** (stacked sections, not the live tabs), with a sticky booking card on desktop:
   - About: live copy, re-crawled verbatim;
   - Highlights: numbered list;
   - What's included;
   - Good to know.
4. **Pairs well with:** 2–3 add-ons (Photographer, Chauffeur, Language Guide) and 2 related tours.
5. **Booking card / form:** the date + guests booking form, pre-set to this tour.

Content fixes taken from the audit: typos ("It's Crafts", "earls"), the Golconda/Nizam mix-up (split per wireframe §6.1), Statue of Equality's theme (Q5), and Village Life's 500 px photo (replace from Commons). Young Innovators needs full copy *(ours)*, built from the Learning theme and the T-Works/T-Hub material.

### D. Convention hub `/conventions/{slug}`
1. **Hero:** card image. Title, dates, venue, a "Tentative dates" tag where flagged, the description, and the "not the organiser" disclaimer.
2. **01 Before & After the conference:** "Full-day and half-day experiences for delegates arriving early or staying longer." Tour cards.
3. **02 During the conference:** "Experiences designed to fit around your conference schedule." Never empty, unlike the live site's admin message: evening Originals (After Dark), Hyderabad by Night, and co-curated and quick experiences.
4. **More of Hyderabad:** Tours · Asli Originals · Add-ons. This fixes the live "Experiences → /services" mislabel.
5. **Need something else?** Chips (Accommodation · Airport & Transport · Medical Assistance · Wellness · Private & Group · Other) feed the enquiry form, with `type=convention` and the event pre-set.
6. **Past events:** an "This event has ended" banner plus the upcoming list. The page is kept as proof.

### E. Original detail `/originals/{slug}`
Content is wireframe §6.4, complete for the first four:
1. **Hero:** the Original's loop (`assets/video/originals/*.mp4`). H1 is the name; the tagline sits under it.
2. **Schedule bar:** day · time · duration. JS computes the next date (e.g. "Next: Sun 2 Nov").
3. **Intro.**
4. **The experience** (list) · **Best for** · **Includes** · **Meeting point / Venue** · "From: Price on request".
5. **CTA:** the wireframe label ("Book this Sunday →", etc.) opens the booking form, pre-set to this Original and its next date.
6. **The Hyderabad Table** only: a "Next table" block (venue · theme · date to be announced) and the edition examples.
7. **Ramzan Nights and Festival Hyderabad:** full copy *(ours)*, built on the homepage panel lines. They use a "Seasonal · dates announced" bar instead of a weekly schedule.
8. **Other Originals:** a strip of cards.

### F. Service detail `/services/{slug}`
1. **Hero:** live image. ⚠ AI-styled; flag it and swap in real photos when the client has them.
2. H1 and the live tagline line.
3. **About this service:** live, multi-paragraph, re-crawled verbatim.
4. **Options:** duration chips from the wireframe (e.g. 4 h / 8 h / Full Day).
5. **How it works:** 3 steps reusing section 15's timeline (*ours*).
6. **Booking form** with a duration select.
7. **Other add-ons** strip.

Custom Itinerary's CTA reads "Plan now" and links to `/book-now`.

### G. Forms
- **`/book-now`, Plan My Hyderabad.** H1 "Let's curate *your Hyderabad.*" (live). Section 15's 3-step timeline sits above the form.
  - Fields: what interests you (themes, tours, Originals, co-curated, multi-select), dates, group size and type (leisure / delegate / corporate / student), hotel, add-ons wanted, notes.
  - Pre-set by `?experience=`.
- **`/contact`.** H1 "Let's plan *something memorable.*" (live).
  - Left: "Talk to the Asli team" with phone, WhatsApp, email and location.
  - Right: name, email, mobile and message. The reply note reads "We usually reply … within one working day."

### H. Private Access `/private-access`
1. **Hero:** reuses section 7's doors-and-durbar-hall image. H1 "Hyderabad, *behind closed doors.*" / "Rare encounters. Remarkable people."
2. **The 8 encounters:** wireframe §11, numbered rows (Gopichand · Vinita Pittie's Haveli · Thota Vaikuntam · Meet Tollywood · Future City · Genome Valley · Founders · Coffee with an Insider).
   - ⚠ The named people need consent. Until it comes, the build uses a toggle that renders an anonymised title (e.g. "Badminton with a national coach") and place imagery, never portraits.
   - Film & Studio Access and Documentary & Editorial Access appear as a sub-line, or as 2 extra cards (Q10).
3. **By request only:** the disclaimer, verbatim.
4. **`#request` form:** which encounter, who you are, purpose, dates.

### I. Editorial / utility
- **`/gallery`:** "Hyderabad *through our lens.*" A masonry of the real Asli group and delegate photos (`site-photos`, `numbers-*`, the conventions), with a lightbox. It replaces the live 5-photo loop and the admin text.
- **`/privacy`, `/terms`:** a simple long-form page. **The client or their lawyer must supply the text.** We build the template with clearly marked placeholder headings.
- **`/login`:** D6.
- **`404`:** "This lane is still being *built.*" plus links to Tours, Originals and Plan. Inner placeholders land here instead of a bare "Not found".
- **`credits`:** keep the `credits.py` output, give it the shared header and footer, and add the new pages' image credits.

---

## 4. Sitemap and URL scheme

Live paths are kept wherever they exist. New paths are short and flat.

```
/                                    home (index.html, unchanged location)
/tours                               ← live      /tours/{live slug} ×15 (+ young-innovators)
                                                 /tours/{slug}/book → 301 /book-now?experience={slug}
/experiences/{theme} ×6              ← live
/conventions                         ← live      /conventions/{slug} ×10
/originals                           ← live      /originals/{slug} ×6 (welcome-hyderabad is live)
/services                            ← live      /services/{slug} ×8
/partners                            ← live (brand details deferred)
/co-curated              NEW  (homepage "/experiences/co-curated" is re-pointed; avoids colliding with themes)
/quick-experiences       NEW
/private-access          NEW
/book-now · /contact · /gallery · /login   ← live
/privacy · /terms        NEW
/credits                 (credits.html stays; /credits works via clean URLs)
```

- **Slugs:** keep the live tour slugs (SEO and existing links) and show the wireframe names. The homepage already does this. Q3 asks the client to confirm.
- **Files:** each page is a folder with an `index.html` (e.g. `tours/old-hyderabad/index.html`), which works on any static host.
  - Local: `server.js` gains a fallback: `/x` serves `/x/index.html`, then `/x.html`.
  - Vercel: `vercel.json` gets `trailingSlash: false` and the `/tours/:slug/book` redirect.

---

## 5. Design approach (reuse the homepage system)

- **Tokens and type:** cream/ink/gold, dark gold `#a97835` for text on cream, Cormorant headings with an italic dark-gold second half, Jost UI, and `--ease`. All of it comes from the existing `css/base.css`.
- **Page skeleton:** dark hero (image or loop) → cream body on `.mn-wrap` → one closing band (the section 15 look: dark photo, heading, "Plan My Hyderabad", contact) → footer.
  - Forms, legal and 404 get a short cream hero instead.
- **Header:**
  - The same markup on every page.
  - Pages with a dark hero use `is-overlay` (transparent, then frosted after scroll, as now).
  - Cream-hero pages start in the frosted state.
- **Ornament:**
  - the khatam jaali at low opacity behind the facts strip, the booking card and the closing band (exact SVG data-URI from `.mn-arcade::before`);
  - fine gold hairlines between sections;
  - Mughal-arch masks on Original, quick-experience and private-access imagery (`.mn-arcade` arch mask).
- **Reused components:**
  - theme `.mn-card`;
  - `.mn-arcade__card` (quick);
  - `.mn-cc` (co-curated);
  - `.mn-brand` tile;
  - `.mn-conv__card`;
  - `.mn-timeline` (3 steps);
  - `.mn-btn` / `.mn-ulink`.
- **Motion** (calm; one restrained reveal each, never homepage-style pins):
  - hero image slow scale and mask reveal;
  - H1 split-word rise;
  - `[data-reveal]` fade-up with stagger for cards and rows;
  - a sticky booking card on desktop;
  - Lenis smooth scroll.
  - Reduced motion: everything renders complete, with no JS motion and stills instead of loops.
- **No loader** on inner pages. It stays a homepage moment.

---

## 6. Code changes

1. **Generator, not hand copies.** 61 pages that share a header and footer can't be maintained by hand.
   - `tools/pages/build.mjs` (Node, no dependencies) reads `data/*.json` and emits static HTML with template-literal functions, one per template. The output is committed.
   - This follows the `credits.py` → `credits.html` precedent: the site itself stays build-free.
   - The header and footer are **extracted from `index.html`** between its `HEADER`/`FOOTER` banner comments, so the homepage remains the single source and the user's hand edits flow through.
   - Inner pages use root-absolute paths (`/css/…`, `/assets/…`).
2. **Data:** `data/tours.json`, `themes.json`, `conventions.json`, `originals.json`, `services.json`, `co-curated.json`, `quick.json`, `private-access.json` and `brands.json`.
   - Sources: the wireframe, the audit, the homepage markup, and a re-crawl of the live tour and service pages for verbatim About copy.
   - Each item records its image and its credit.
3. **`css/pages.css`** (CRLF): inner-page layout and new components, with a banner comment per template.
   - It loads after `base.css`, `header.css` and `footer.css`.
   - For reused homepage cards: if their rules are scoped under a section class in `sections.css`, move those rules into a shared block there (keeping the selectors). The homepage suites must still pass.
4. **`js/page.js`** (CRLF): Lenis (same settings as `motion.js`), exposing `window.mnLenis` for components.js anchors; the reveals listed above; the next-date calculation for Originals; and form pre-set from the query string.
   - It is wrapped in `gsap.matchMedia` with cleanups, and exits on reduced motion.
   - `motion.js` is not touched.
5. **`js/components.js`:** audit its null guards so it runs on pages without homepage sections (most blocks already return early; check `heroVideo` and the explorer). Add:
   - a small **form** behaviour: validation, pre-set and success state;
   - the gallery lightbox.
6. **Forms:** one `.mn-form` component with variants `plan`, `booking`, `venue`, `access`, `contact` and `convention`. It submits nowhere until a backend is chosen (D4): validation and a success state only.
7. **SEO** (fixes live audit §7.13): the generator writes `<title>` ("{Page} | Asli Hyderabad"), a meta description, Open Graph tags, the icon, a canonical link and `sitemap.xml`.
8. **Homepage wire-up (end of phase 3; `href`s only, no visual change):**
   - header and drawer anchors and CTA → new pages;
   - section 7 Request Access, section 9 cards, section 13 link and cards → new pages;
   - footer anchors, Privacy and Terms → new pages.

   This touches the header, footer and sections 7, 9 and 13, so approving this plan approves exactly these `href` edits and nothing else in those sections.

## Files
- **New:**
  - `tools/pages/build.mjs`, `data/*.json`, `css/pages.css`, `js/page.js`, `404.html`;
  - the generated `tours/`, `experiences/`, `conventions/`, `originals/`, `services/`, `partners/`, `co-curated/`, `quick-experiences/`, `private-access/`, `book-now/`, `contact/`, `gallery/`, `privacy/`, `terms/`, `login/` folders;
  - `sitemap.xml`, `tools/test/pages.mjs`.
- **Edited:**
  - `server.js` (clean-URL fallback);
  - `vercel.json`;
  - `js/components.js` (guards, form, lightbox);
  - `css/sections.css` (only if card rules need sharing);
  - `index.html` (`href`s only, phase 3);
  - `tools/assets/credits.py` (shared chrome, new credits);
  - `assets/img/SOURCES.md`;
  - `docs/PROJECT-CONTEXT.md` (new §: inner pages);
  - `CLAUDE.md` (generator command).

---

## 7. Build order

Each phase starts with one exemplar page per template for the user to review, then fills in the rest from data.

| Phase | Scope | Pages | Why first |
|---|---|---|---|
| **0 · Foundation** | generator, data skeleton, page shell (header and footer from index.html), `pages.css`, `page.js`, server and Vercel URLs, 404, `pages.mjs` test. **Exemplar: `/tours/old-hyderabad`** for design sign-off | 1 + 404 | everything depends on it |
| **1 · Explore** | `/tours` + 15 tours, 6 themes, `/book-now`, `/contact` | 23 | most-linked targets (`/tours` ×9, themes ×30); the core "Explore Hyderabad" journey and both live forms |
| **2 · Events and signatures** | `/conventions` + 10 hubs, `/originals` + 6 details | 18 | section 3's second path and section 10; APAC (28–30 Oct) and AVAR (Dec) are live now |
| **3 · New offers** | `/private-access`, `/quick-experiences`, `/co-curated`, `/services` + 8, `/partners`; **homepage wire-up** | 13 | replaces all anchors and `#` cards; content partly ours, and consent-sensitive |
| **4 · Utility** | `/gallery`, `/privacy`, `/terms`, `/login`, credits restyle, `sitemap.xml`/SEO pass | 5 | low traffic; legal text needed from the client |
| **5 · Later** | co-curated ×15, brand ×9, quick ×14 details; form backend; prices | (38) | blocked on reels, permissions, backend |

## Decisions (recommendations are built in; change any on approval)
- **D1:** generator plus JSON, committed static output (above).
- **D2:** co-curated at `/co-curated`, not `/experiences/co-curated`.
- **D3:** co-curated, quick and brand items: anchored listing entries now, detail pages later.
- **D4:** forms have no backend in the prototype. The client chooses: their Laravel endpoints, a form service, or a Vercel function.
- **D5:** private-access names are anonymised until consent arrives.
- **D6:** `/login`: the audit flags a public login link as a risk. Recommendation: point the footer link at the client's existing Laravel `/login` (no page built here), or drop it. A styled shell only if the client wants one.

## Open questions for the client (to add to PROJECT-CONTEXT §9)
- **Q3:** wireframe names in URLs? (We recommend keeping the live slugs.)
- **Q4:** Spiritual Circuit and Sacred Journey: keep them? (We'd keep them, unfeatured.)
- **Q5:** Is Evening a 7th theme, and is Statue of Equality Heritage or Culture?
- **Q10:** Film & Studio and Documentary access: separate cards?
- **Q11:** Health & Wellbeing: experiences only, or medical travel too?

Also outstanding: prices, the form backend, legal copy, brand and person consents, and the Instagram URL.

---

## Verification (per phase)
- `node --check js/*.js tools/pages/build.mjs`.
- Run `node tools/pages/build.mjs`, then check that `git diff` shows only the expected generated files.
- New `tools/test/pages.mjs` (on `tools/test/cdp.mjs`) visits **every generated page** at 1440×900, 1280×720 and 390×844, and checks:
  - HTTP 200;
  - a clean console;
  - `docW === vw`;
  - every internal `href` resolving to a generated file, an anchor that exists, or an allowed external link;
  - the header dropdowns and drawer working;
  - forms validating and showing the success state;
  - reduced motion rendering complete.
- `tools/test/shot.mjs` screenshots of each template's exemplar at the 3 sizes, inspected by eye.
- After any change to `components.js`, `sections.css` or `index.html`: re-run the homepage suites (`originals`, `arcade`, `skyline`, `finale`, `voices`) plus `shot.mjs` for the touched sections.
- Phase 0: check the clean URLs on a Vercel preview (`/tours` and `/tours/` both serve the page, and the `/tours/x/book` redirect works).

## After approval
1. Archive this plan as `docs/plans/2026-10-27-inner-pages.md`.
2. Leave a short hand-over note in the shared session-notes folder.
3. Build nothing until the user calls Phase 0.
