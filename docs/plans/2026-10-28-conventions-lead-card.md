# Conventions (3b): bigger cards, no empty left side

> **Superseded on 28 Oct 2026** by the editorial index redesign (numbered rows + framed photo, no pin); see PROJECT-CONTEXT §3. Kept for history.

## Context
On desktop, the Conventions carousel shows a small current card (26vw) in the middle, with the next cards stacked top-right. Previous cards stack bottom-left, but on the first card (01) there are none, so a large empty area sits under the heading on the left (the user's screenshot at 1911px). The user wants bigger images so that empty area goes, and a clean, balanced composition. Tablet and phone already use 84vw cards with no gap, so they stay as they are.

## Design (desktop ≥1025px only)
A **lead card** layout: the current card becomes large and sits directly under the heading, on the same left edge (the gutter). Upcoming cards wait top-right, and a passed card slides out down-left and fades. The left side is always filled, from card 01 to the last one.

| | Now | New |
|---|---|---|
| Card width | 26vw | `min(44vw, 70svh)`: 630px at 1440×900, 504px at 1280×720, 756px at 1920×1080 |
| Current card | x 37vw, y 34% | x = gutter (aligned with the heading), y 37% |
| Next-1 / next-2 | x 70 / 85vw, y 10 / 5% | gutter + 51vw / + 71vw, y 10 / 4% (next-2 peeks off the right edge) |
| Previous | visible stack bottom-left | slides down-left (−40vw, 72%) and fades to 0 |
| Arrows | centred under the card at 37vw | centred under the lead card, 5% from the bottom |
| Date / venue | bottom-right | unchanged |
| Jaali mask | clears heading + middle card | one clearing that covers the heading and the lead card |

The `min(…, 70svh)` keeps the card, its title and the arrows clear of each other on short screens (1280×720). The diagonal scroll motion stays (top-right → lead → out bottom-left), with no new effects.

## Code changes
- **`css/sections.css`** (section 3b block):
  - `.mn-conv` `--card-w: min(44vw, 70svh)`.
  - Desktop slot vars: `is-current`, `is-next-1/2`, `is-prev-1/2`, `is-gone-*` get the new x/y, with x including `var(--gutter)`. This only affects reduced motion on desktop; the ≤1024px slots are untouched.
  - `.mn-conv__nav`: `left: calc(var(--gutter) + var(--card-w) / 2)` and `bottom: 5%`.
  - `.mn-conv__bg` mask: re-aim the clearing at the heading + lead card.
- **`js/components.js`** (conventions IIFE):
  - Update the `KEYS` path to match the new slots (d −3…3: x −.60/−.60/−.40/0/.51/.71/.95, y .90/.90/.72/.37/.10/.04/0, o 0/0/0/1/1/1/0).
  - `scrub()` adds the gutter (read from `.mn-conv__head`'s computed `left`) to every card's x, so the lead card lines up exactly with the heading at every width.
- **`js/motion.js`**: no change (it only feeds progress into `mnConv.scrub`).
- **Docs**: the PROJECT-CONTEXT §3 row for Conventions, the MOTIFS.md jaali note, and this plan archived as `docs/plans/2026-10-28-conventions-lead-card.md`.

## Verification
Run headless Chrome via `tools/test/cdp.mjs` (scratch script), walking into the pinned section:
- **1440×900, 1280×720, 1920×1080, 1025×768:**
  - Screenshots at card 01, mid-scroll and the last card.
  - Assert that the lead card's left edge equals the heading's left edge (±2px).
  - Assert that the card top clears the heading's bottom, the title clears the arrows, and the next card doesn't overlap the lead card.
  - Check with the longest title ("Telangana Rising Global Summit 2026").
- **Reduced motion (1440):** the discrete slots match the same layout and the arrows step cards.
- **390×844 and 768×1024:** unchanged from before. No sideways scroll anywhere, and the console is clean.
- Run the `hero.mjs` and `footer.mjs` suites as regression checks.

Nothing gets pushed until you say so.
