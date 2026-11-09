> **Approved 7 Nov 2026.**

# Conventions (section 4, `data-sec="conventions"`): cream card rail after the reference

Branch: `version-2` (uncommitted palette work is already in the tree). Archive this plan as `docs/plans/2026-11-07-conventions-card-rail.md` once approved.

## Context
The current Conventions section is the "Velaa" ink band: a floating mid-screen heading over two staggered columns of large photos, each captioned with a serial number (01, 02 …). You want:
- **no serial numbers on the cards**;
- a clearer, more usable layout after your reference image: heading on the left, Charminar in an arch on the right, then a row of dark event cards. Each card has a date badge, title, venue, a "delegate experiences" pill and an "Explore Convention" button;
- **a proper mobile layout**.

Decisions you made:
- cream background with dark cards;
- the Charminar as a gold line drawing in a Mughal arch;
- the client's real delegate photos kept;
- the eyebrow and the per-card button both included.

## Content (no new copy except the reference's button label)
- Eyebrow: **Conventions in Hyderabad** (the live site's eyebrow, audit §4).
- Heading: **In Hyderabad / for a *Convention?*** (italic half in `--gold-ink`).
- Sub-line: **Find your event. / *Discover Hyderabad around it.***
- Cards: the same 6 events, links and `data-end` dates as now.
  - The existing script still removes past events. Today (7 Nov) that leaves AVAR, Telangana Rising, ICCA and BioAsia: 4 cards, one row on desktop.
  - Each card shows: the date badge ("02–04" / "DEC 2026"), the name, a pin with the venue, and "Tentative dates" where the event has that tag now.
  - The pill reads **Delegate experiences available** (live-site wording).
  - The button reads **Explore Convention →** (from your reference).
- "All conventions" stays under the rail. It already exists.

## Design (current design system)
- **Section:** `--cream` background with the faint khatam jaali kept at the edges (`.mn-m-jaali`, as now). Generous padding: `clamp(9.6rem, 9vw, 14rem)` top and bottom.
- **Header (desktop):** two columns.
  - **Left:** the eyebrow (`.mn-eyebrow`, gold-ink), then the title (Cormorant 300, about `clamp(4.4rem, 4.4vw, 7.2rem)`, ink), then the sub-line (Cormorant, about 2.8rem), then a 6.4rem gold hairline rule.
  - **Right:** `.mn-conv__art`, an inline SVG about 46rem tall:
    - a cusped-arch outline, reusing the `#m-arch-cusped` geometry from `assets/img/motifs.svg`, in gold at low opacity;
    - inside it, a Charminar in fine gold line. Start from the Featured Brands Charminar path (`index.html:1258`), scaled up, and add detail strokes so it holds at this size: minaret balconies, the upper arcade, domes.
    - The cards' top edge overlaps the arch's base by about 6rem, so the monument "stands behind" the rail, as in the reference.
- **Cards** (`.mn-conv__card`, one link each):
  - Warm-charcoal `--ink` card, 2:3, radius .4rem. The photo fills it (`object-fit: cover`) with an ink gradient over the lower 60%.
  - **Date badge** top-left: an ink box with a gold-light hairline border, the day range in Cormorant 2.4rem cream, and the month and year in Jost 1.1rem, uppercase, gold-light.
  - **Bottom:**
    - the name (Cormorant 2.6rem, cream);
    - the venue line with a pin icon (a new `i-pin` symbol in the page's inline sprite, next to `i-chev`);
    - "Tentative dates" (small, gold-light);
    - the pill (gold-tint background, gold-light text);
    - a full-width cream button span styled like `.mn-btn` (ink text). It is part of the card's single link, not a second link.
  - **Hover / `:focus-visible`:** the card lifts by .6rem, the photo zooms to 1.04, and the button turns gold. The focus ring is a gold-light outline. The old "dim the other cards and the heading" rule goes with the old layout.
- **Rail:**
  - `ol.mn-conv__rail`: a horizontal grid, `grid-auto-flow: column`, with scroll-snap. Desktop shows 4 columns.
  - Prev/next round buttons (cream circle, ink arrow, soft shadow) sit at the rail's ends. They show **only when the rail overflows** (`is-scrollable`), are disabled at each end and hidden on touch.
  - With today's 4 events there's no arrow on desktop; arrows appear when more events are live, or on tablets.
- **Tablet (750–1024):** the header stacks, the art becomes a smaller drawing at the header's right, and the rail shows about 2.4 cards (swipe + snap).
- **Phone (≤749):**
  - The header is full width.
  - The art is about 50vw, right-aligned, tucked under the sub-line, with the cards overlapping its base.
  - The rail shows one card at about 82vw with the next one peeking. Native swipe with snap, a gutter-aligned scroll padding, and no sideways page scroll.
  - "All conventions" sits left-aligned.

## Code changes
- **`index.html` (LF):** rewrite the inside of `<section data-sec="conventions" data-conventions>`:
  - update the comment;
  - add the eyebrow, header and art SVG;
  - restructure the cards: remove `.mn-conv__num`; add a `<time>` date badge, the venue with the pin, the tag, the pill and the button span;
  - add the prev/next buttons (`aria-label`, `aria-controls` pointing at the rail);
  - add `i-pin` to the inline sprite.
- **`css/sections.css` (CRLF):** replace the "3b. Conventions" block with the new rules and a banner comment. Remove the sticky-heading, `is-more`, two-column and `:has()` dimming rules. Use only tokens (`--cream`, `--ink`, `--gold`, `--gold-light`, `--gold-ink`, `--ease`).
- **`js/components.js` (CRLF):** in the existing Conventions IIFE:
  - drop the renumbering line;
  - add the rail controls: toggle `is-scrollable` when `scrollWidth > clientWidth`, enable/disable prev and next on scroll and resize, and on click `rail.scrollBy` one card plus the gap (`auto` under reduced motion).
- **`js/motion.js` (CRLF):**
  - Delete the `mm.add('(min-width: 750px)')` column parallax and the `is-more` ScrollTrigger.
  - Rewrite `conventionsIntro`:
    - the art paths draw (`strokeDashoffset` 1→0, `autoRound: false`, the same pattern as the Featured Brands drawing at `motion.js:782`);
    - the header rises;
    - the cards rise in with a stagger, `once`, when the rail enters.
  - The CSS default leaves the paths drawn, so reduced motion shows everything complete.
- **`tools/test/conventions.mjs`:** rewrite it for the new behaviour (see Verification).
- **Docs:** update the `docs/PROJECT-CONTEXT.md` §3 row 4 (and `docs/CONTENT-FLOW.md` if it describes this section). Archive this plan.

## Files
`index.html`, `css/sections.css`, `js/components.js`, `js/motion.js`, `tools/test/conventions.mjs`, `docs/PROJECT-CONTEXT.md`, `docs/plans/2026-11-07-conventions-card-rail.md` (new).

## Verification
- `node --check js/components.js js/motion.js`.
- `node server.js 8671`, then `node tools/test/conventions.mjs http://127.0.0.1:8671/ <scratch>`. The rewritten suite checks:
  - past events are removed, the rest are in order, and **no serial numbers** appear (no `.mn-conv__num`, no `NN` labels);
  - at 1440 and 1280, the 4 cards share one row and the arrows are hidden;
  - with 2 cloned extra cards, the arrows show, next scrolls the rail by one card, prev is disabled at the start, and the arrows hide on touch;
  - hover and focus-visible lift the card;
  - a click opens `/conventions/<slug>`;
  - 768: about 2.4 cards with swipe;
  - 390: one card at about 82vw with the next peeking;
  - `docW === vw` at every size;
  - the cards rise in and the art draws;
  - reduced motion: everything visible and drawn;
  - a clean console.
- `node tools/test/shot.mjs … conventions 1440x900 1280x720 768x1024 390x844`, and look at every shot.
- Neighbours: `shot.mjs` on `cats` and `collection-a` at 1440 and 390, to check the cream join to section 5 and that nothing else moved.
