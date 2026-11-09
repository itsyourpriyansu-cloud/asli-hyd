# Asli Hyderabad: inner pages, visual, content and CTA pass

## Context
All 99 inner pages exist and every link works, but they read as a first pass. An audit of `tools/build-pages.mjs`, `css/pages.css` and `data/*.json` found:

| Problem | Evidence |
|---|---|
| Pages dead-end | Gallery, Tours list, Themes, Conventions detail, Originals detail, Partners list and Co-curated list have no closing action. Originals detail links to nothing else |
| No action at the top | Heroes hold only a title and a line. The first CTA comes after a full screen of photo |
| Booking form is buried | `/book-now` and `/contact` open with an 84svh photo, so the form starts below the fold. Both use the same heading |
| Convention pages are near clones | All 12 list the same tours and the same 6 quick experiences, with nothing for the delegate's field |
| Boilerplate | "Date, timing and venue are confirmed when you book" on all 29 experiences; "Asli Hyderabad host" on all 15 co-curated |
| Itineraries are bare | Stops are names only ("Mecca Masjid"), with no time or description. Facts bars say "Time: On request" |
| Visual monotony | Most detail pages run hero, then two columns of hairline lists, in one cream tone. The motif kit is barely used. No proof (numbers, guest words), no FAQ |
| Private Access is a dead list | The 5 encounters are plain text with one shared button |
| Gallery is thin | 17 photos shown, 95 already licensed and cropped in `assets/img/pages/gal` |
| Repeated noise | "Price on request" on every card and twice on each detail page |

**Outcome:** every page has a clear job, real depth in every section, a rhythm of tones and ornament, and one obvious next step at each stage.

**Decisions taken from your brief and standing rules**
- CTAs are added because you asked. Rule: **one solid button per screen**, and any second action is an underline link.
- Dummy copy is fine. All of it is flagged `"draft"`, so it lands in `docs/CONTENT-TO-REPLACE.md`.
- Old-site text stays and new text is added around it.
- Prices stay "Price on request" (CLAUDE.md).
- **Not faked even as dummy:** guest testimonials (only the 4 real ones, verbatim), named people, partnership claims about real brands, and cancellation or refund terms ("Confirmed when you book").

## Design: shared blocks (each used on many templates)
| Block | What it looks like | Built from |
|---|---|---|
| Hero sizes + actions | 84svh for detail, 62svh for lists, 44svh for forms. Solid button + underline link under the line | existing `hero()`, `.mn-btn`, `.mn-ulink` |
| Breadcrumb | Thin row on cream *below* the hero, so it can't read as an eyebrow | new, small |
| Why it's special | 3 columns under fine gold rules, one lotus or rosette accent | `.mn-m-sym` |
| Timed itinerary | The gold route thread with time, stop name and one line each. A note says timings are illustrative | extends `route()` |
| Photo mosaic | One large photo + 2–3 small, opens the lightbox | `galleryGrid()` option |
| Guest word band | Ink band with jaali, one real quote and arch portrait | `.mn-m-jaali`, testimonial photos |
| Proof strip | The homepage's four numbers on one line | homepage figures |
| FAQ | Hairline accordion, keyboard-friendly | native `<details>` |
| How it works | 3 numbered steps | reuses week-line styles |
| Closing band | Ink, cusped edge, jaali, heading, one button + WhatsApp link | `--m-arch-cusped`, `.mn-m-scallop` |

**Page rhythm:** cream, then tint, then ink, then cream, with at most one motif per section (MOTIFS.md rule 6). Colours, type and easing are unchanged. Cards lose the repeated price and gain a clear "Explore →".

## Content and CTA, section by section
Top action is the hero button. Every page ends in the closing band unless noted.

### Tours
**List:** Hero · theme tabs + 15 cards (→ detail) · How hosting works (→ Custom Itinerary) · Guest word · Closing: "Can't find your day? Build it."

**Detail (15):**
| Section | Content | Action |
|---|---|---|
| Hero | Title, tagline | **Book this tour** · See the route ↓ |
| Facts | Duration, format, best time, group size (price leaves this bar) | |
| About | Old-site text, larger lead | |
| Why it's special | 3 points, new | |
| The route | Timed stops, one line each, new | Customise this route |
| Included / Not included | Old list + new "not included" | |
| Good to know | Old list | |
| Along the way | Mosaic | Full gallery |
| Guest word, FAQ (4) | Real quote; shared + tour-specific | Ask a question |
| You may also like | 3 related | All tours |
| Closing | Private departure or custom plan | **Plan my Hyderabad** |

Sticky booking card and phone bar stay.

### Themes (6)
Video hero (**See the routes ↓**) · Intro · What to expect (3) · Mosaic · Hosted routes · Small experiences in this theme (co-curated and quick, new cross-links) · Guest word · Closing: "Customise a Heritage day".

### Co-curated + Quick
**Lists:** Hero · bento or arch cards · Where it works, for Quick (→ "Bring it to your event") · How to book · Closing.

**Detail (29):** Portrait hero (**Book**) · Facts · About · Why guests love it (new) · How it unfolds, one line per step (new) · Included / Good to know, boilerplate cut to what is specific · Best for / Where it works · FAQ · More like this · Closing.

### Conventions
**List:** Hero · Event grid · For organisers, new (→ "Plan a delegate programme") · Need something else chips · Closing.

**Detail (12):** Hero (**Plan my conference week**, prefilled with the event) · Intro + status · **Picked for your field**, new: 3 tours chosen per sector with a reason (pharma → Genome Valley, tech → Innovation Circuit, jewellery → pearls) · Your conference week · Delegate logistics, new: groups, venue pickup, short slots · Chips · FAQ · Closing: group booking. This fixes the clones.

### Originals
**List:** Hero · Calendar · Alternating cards, each with Explore + Book · How an Original works · Closing.

**Detail (6):** Hero (**Book this Sunday**, etc.) · When · Intro · Timed schedule (new) · Experience / Best for · Included / Meeting point · Why only here (new) · Other Originals (new) · FAQ · Closing.

### Services
**List:** Hero · Rows · How add-ons work · Need something else (Ask Asli) · Closing.

**Detail (8):** Hero (**service CTA**) · About · Options (each books that option) · How it works · Tell us / Confirmed / Separate · FAQ (new) · Goes well with · Closing.

### Partners, Private Access, Gallery
- **Partners list:** Hero · Tiles · Become a Featured Brand (→ contact, prefilled) · Closing. Tiles keep opening the brands' sites, as now.
- **Partner detail (9):** Hero · Facts · About · With Asli · Keep exploring · Closing.
- **Private Access:** Dark page. Each of the 5 encounters becomes a card with fuller copy and its own **Request this** (prefilled) · How access works, 4 steps · By request only. The 3 named guests stay switched off.
- **Gallery:** About 48 photos from the licensed set · People / Places / Food / Craft tabs · Closing: "Be in the next one".

### Booking and support
- **Book Now:** Short hero · form first · a card that shows the chosen experience (photo, duration) · What happens next · Conventions added to the dropdown. No closing band.
- **Contact:** Short hero · 4 route cards (book, delegation, partner, press), each prefilled · Form + details · FAQ (3). No closing band.
- **404:** Tours, Experiences and Contact links. **Privacy/Terms:** no change.

## Code changes
- `tools/build-pages.mjs`: the blocks above as small functions, wired into each template. Book-now dropdown gains Conventions and data for the summary card. Draft list gains Themes and Private Access. New self-checks: fail on a literal `undefined` in any page, or on a page missing its closing band that isn't exempt.
- `css/pages.css`: a banner comment per block; hero variants; mosaic.
- `js/components.js`, three small additions:
  - generalise the tour filter so the gallery can use it (the status line gets its noun from the markup);
  - re-measure ScrollTrigger when an FAQ opens;
  - fill the booking summary card.
  - The phone booking bar also hides over the closing band, so two buttons never stack.
- `js/motion.js`: expected no change. `[data-rise]` and `[data-route]` carry over.
- **`index.html` and homepage CSS: not touched.** Your uncommitted edits there are safe.

## Files
- **New:** `data/faq.json` (shared questions), `data/proof.json` (numbers + the 4 real quotes).
- **Changed:** `tools/build-pages.mjs`, `css/pages.css`, `js/components.js`, `tools/test/pages.mjs`, every `data/*.json` except `legal.json`, `docs/PROJECT-CONTEXT.md`.
- **Generated (rebuilt):** all inner-page folders, `sitemap.xml`, `docs/CONTENT-TO-REPLACE.md`.
- **Archive:** `docs/plans/2026-11-09-inner-pages-ux.md`.

## Order
1. Baseline screenshots of each template. Plan mode is read-only, so this audit comes from code and data, not from looking at the pages.
2. Shared blocks, then the Tour detail page as the pilot. Check it at all sizes before rolling out.
3. Remaining templates, one at a time.
4. Write the dummy content, one data file at a time (about 80 records).
5. Tests, full screenshot review, docs.

## Verification
- `node tools/build-pages.mjs`: no broken links, anchors or images, no `href="#"`, no `undefined`, closing band present. `node --check js/*.js`.
- `tools/test/pages.mjs`: every page at 1440×900, 1280×720, 390×844 for clean console, no sideways scroll, one `h1`, no eyebrows, images load, 44px targets (extended to new buttons), reduced motion complete.
- New checks: hero button leads to the right place on each template; FAQ works by keyboard; gallery filter; Book summary card follows `?experience=` and the dropdown; convention prefill reaches the WhatsApp text; "Request this" prefill; phone bar hides over the closing band; the 12 convention pages differ.
- Screenshots of every template at 1440, 1280, 834 and 390, reviewed by eye.
- Homepage suites, because `components.js` is shared: `conventions`, `arcade`, `originals`, `voices`, `finale`, `footer`, `skyline`, `hero`.

## Not doing (say if you want any)
Sticky in-page section nav · real or dummy prices · online payment or a form backend · maps · search · packaged service bundles · JSON-LD · new photo sourcing (the licensed set covers this; I'll flag any gap).

## Before launch (client)
Real copy to replace the drafts, prices, and written consent from the testimonial guests. Their quotes will now appear on many more pages, so this matters more.
