# Asli Hyderabad: remaining inner pages, every CTA, and one-step content replacement

## Context
The 59 inner pages are built, but an audit of every button and link found these gaps:
- The 15 Co-curated and 14 Quick experiences have **no page of their own**. Each is one line on a list, and clicking goes straight to the booking form.
- The 8 service pages are the old site's text as long paragraphs. Their "Choose your option" chips **look clickable but do nothing**.
- Featured Brands have no pages. The old site only has a junk placeholder ("TELUGU EXPERIECE / XYZ").
- Privacy, Terms, Follow on Instagram and 4 social icons are `href="#"`, so they jump to the top of the page.

**Outcome:** every card and button leads somewhere real. All placeholder copy is in one place and listed, so real content is a simple swap.

Goes from 59 to **99 pages**: 15 Co-curated, 14 Quick, 9 Brands, Privacy, Terms.

## Content (what I write, and what I will not invent)
Sources, in order: old site crawl (9 Nov) → wireframe → my own copy. Copy that stays from the old site keeps its meaning.

| Pages | Built from | Each page has |
|---|---|---|
| **8 Services** (rebuilt) | Old site text, every point kept, broken into structure | Intro · options, each with what it suits (from the old text) · How it works, 3–4 steps · What to tell us · Confirmed before booking / Charged separately · Related services |
| **15 Co-curated** (new) | Wireframe §8.2 "what guests come for" + my copy | About · How it unfolds, 3–4 steps · What's included · Best for · Good to know · 3 related |
| **14 Quick** (new) | Wireframe §9.2 durations + existing lines + my copy | The same, plus "Where it works": hotels, restaurants, conferences, events, corporate, private celebrations (wireframe) |
| **9 Brands** (new) | Wireframe category + public facts I verify first, e.g. [Karachi Bakery and Paradise 1953, Niloufer 1978](https://www.voxspace.in/2018/05/15/paradise-karachi-niloufer/) | About the brand · The experience with Asli · Related tours |
| **Privacy, Terms** (new, draft) | How the site really works: no accounts, no tracking or cookies in the code, enquiries go through WhatsApp or email | Short plain text. **A lawyer should review before launch** |

**Not invented:** prices, menus, named people, car models, group limits, cancellation rules, or durations the sources do not give. Those read "Confirmed when you book" or "Price on request".

## How real content gets replaced
1. All copy stays in `data/*.json`, one record per page. Replace the text and run `node tools/build-pages.mjs`.
2. Every record with my copy gets `"draft": true`, including what I wrote earlier (Young Innovators, 6 conventions, 2 Originals, 4 Quick).
3. The build writes **`docs/CONTENT-TO-REPLACE.md`**: a checklist of every draft page and its data file. Removing the flag removes it from the list. Visitors never see the flag.
4. Prices: any record can take a `"price"` field. Without one it shows "Price on request".
5. Images use one field per record, so a real photo is a one-line change.

## Every CTA
| Where | Now | After |
|---|---|---|
| Homepage Quick cards (10) | jump to a spot on the list page | open that experience's page |
| Homepage Co-curated cards (7) | jump to a spot on the list page | open that experience's page |
| List pages: Co-curated, Quick | straight to the form with no details | open the detail page, which has the Book button |
| Service options (3 chips each) | do nothing | each books that option: `/book-now?experience=…&option=…`, shown in the request |
| Service list, "Ask Asli" | works | no change |
| Convention "During" rows | jump to list page | open the Quick page |
| Conventions already ended (GANSID, APAC) | still read "Tentative" | short "This event has ended" note, week plan stays |
| Brand tiles on `/partners` | only the name links | whole tile opens the Brand page |
| Homepage Private Access, Request Access | `/contact`, blank | `/private-access`, which shows what you are requesting and has the button |
| Co-curated note, "Add to your itinerary" | plain text | links to Custom Itinerary, as the wireframe's "Explore itineraries" |
| Privacy, Terms | `#` | new pages |
| Footer Instagram, Facebook, LinkedIn, YouTube | `#` | removed until real links exist (markup kept in a comment); WhatsApp stays |
| Reels, Follow on Instagram | `#` | "See the gallery" → `/gallery`, until the real handle comes |

Homepage "Book now" and "Book experience" labels stay, because they are the wireframe's words. The detail page has Book as its main button.

## Design
- **Experience and Brand page top (new):** Co-curated and Quick photos are portrait (720–1040 wide) and would blur full-screen. So the top is a dark ink panel with faint jaali, title on the left with gold italic second half, and the photo inside the existing gold Mughal arch on the right. Brand partner logo in white top left, as on the cards. Phones stack it. The white header works unchanged, and **no new photos are needed**.
- **Below the top:** reuse what exists: facts bar, sticky booking card and phone bottom bar, route thread for the steps, two-column lists, arch cards for related items.
- **Services:** same layout. Options become outlined cards. Related services use the existing list rows.
- **Legal:** simple reading column on cream, plain top, one heading.
- Brand pages use photos already licensed and credited in `assets/img/pages/gal`. Commons only if a brand has no fit.
- No eyebrows; one Book action per page; cream, ink and gold.

## Code changes
- `tools/build-pages.mjs`:
  - `portraitHero()`, one experience template for both types, a brand template, a legal template, a richer service template.
  - `sitemap.xml` and `robots.txt` from the written page list.
  - Draft checklist output.
  - Self-check also fails on any `href="#"`.
  - `privacy` and `terms` added to generated folders.
- `data/offers.json`, `services.json`, `partners.json` extended; new `data/legal.json`; draft flags on existing records.
- `js/components.js`: read `?option=` into the notes field; "event has ended" note using the existing date logic.
- `css/pages.css`: portrait top, option cards, legal column.
- `index.html`, links only: 17 card links, Request Access, Instagram link, footer socials, Privacy, Terms.
- `vercel.json`: none needed. Old `#` card links keep working as list anchors stay.

## Files
- **New:** `data/legal.json`, `docs/CONTENT-TO-REPLACE.md`, `sitemap.xml`, `robots.txt`, generated `experiences/co-curated/*`, `experiences/quick/*`, `partners/*`, `privacy/`, `terms/`.
- **Changed:** as listed above, plus `tools/test/pages.mjs`, `CLAUDE.md` (generated folders), `docs/PROJECT-CONTEXT.md`, `docs/CONTENT-FLOW.md` §5.
- **Plan archive:** `docs/plans/2026-11-09-inner-pages-phase-2.md`.

## Order
1. Write the content into `data/`, verifying brand facts.
2. Templates and CSS.
3. Wire every CTA.
4. Build, test, look at screenshots, update docs.

## Verification
- Build self-check: no broken link, image or anchor, and no `href="#"` on any of the 99 pages or the homepage.
- `tools/test/pages.mjs`: all 99 pages at 1440×900, 1280×720, 390×844 for clean console, no sideways scroll, one `h1`, no eyebrows, images load, reduced motion complete.
- New interaction checks: option chip prefills the form and appears in the WhatsApp text; card → detail → Book carries the right experience; ended-event note; phone bottom bar does not cover the footer.
- Homepage suites: `conventions`, `arcade`, `originals`, `voices`, `finale`, `footer`, `skyline`, `hero`.
- Look at screenshots of each new template at 1440, 1280, 834 and 390.

## Not doing (say if you want any)
- Homepage Add-ons section and Health & Wellbeing section: homepage work, wireframe items not yet requested.
- An About page: neither the wireframe nor the old site has one.
- Payment or online booking, and a form backend: WhatsApp and email stay.
- New reels, new service photos, past-convention pages, structured data (JSON-LD).

## Needs the client before launch
Real copy, prices, social links, a lawyer's review of Privacy and Terms, written permission from the 9 brands (their new pages make this more important), and consent for the 3 named Private Access guests.
