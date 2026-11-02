# Conventions (section 4, `data-sec="conventions"`): the Velaa "world of its own" treatment

> **Approved 2 Nov 2026 and built.** Changes made during the build:
> - Line 2 arrives at 45% of the stage, not 25%: at 25% it was already showing when the heading first stuck.
> - The column parallax is ±160px, not ±120px, so it is visible over a 4-card section.
> - Tablets (750–1024px) put the heading on top like phones, still with two offset columns. A floating heading crossed the captions there, and touch has no hover to clear it.
> - `css/` and `js/` are LF on disk now (not CRLF as the older docs say), so the edits are LF.

## Context
You want Conventions (4th visible section, "In Hyderabad for a *Convention?*") rebuilt as Velaa's third section (velaaprivateisland.com), with a proper card interaction.

What I measured on Velaa at 1440×900:
- A dark navy band. The heading stays fixed in the middle of the screen while you scroll through about 2.5 screens.
- Two columns of tall photos (568×897 each, a 96px gutter) scroll up behind it. The right column starts about 100px lower, and the two columns move at different speeds (the left one has an extra parallax of about −320px), so the photos slide past each other.
- Halfway through, a second line fades in under the heading: "A place you don't just visit. / *You belong.*"
- **On Velaa the photos are not links: clicking one does nothing.** "Clicking the cards should work" therefore needs a new design for us. Here each photo becomes a convention card that opens that convention's page.

## Content (no new copy)
- **Line 1:** "In Hyderabad for a *Convention?*" (as now).
- **Line 2:** "Find your event. *Discover Hyderabad around it.*" This is the live site's own sub-line (LIVE-SITE-AUDIT §4), and it plays the part of Velaa's second line.
- **Cards:** the 6 events already in `index.html`, with their names, dates, venues, tentative tags and `/conventions/<slug>` links. The existing script still removes past events. As of today (2 Nov) that leaves 4: AVAR, Telangana Rising, ICCA and BioAsia.
- **Link:** "All conventions" stays, centred under the cards. It already exists, so this is not a new CTA.
- **No eyebrow.**

## Design
- **Colours:** an ink `#2e3937` band in place of Velaa's navy, between the cream sections 3 and 5. The heading is cream, with the italic half in gold-light `#d8b77d`. Behind it sits the faint khatam jaali that is there now.
- **Heading:** stays in the middle of the screen in front of the cards, like Velaa's.
  - It uses `pointer-events: none`, so it never blocks a click.
  - It gets a soft dark text-shadow, and the photos rest at about 85% brightness. Our skies are near-white (the Chowmahalla shot), so cream text needs both to stay readable.
- **Cards:** two columns with an offset, like Velaa. Odd-numbered cards go on the left; even ones start lower on the right.
  - Each card is one `<a>`: a photo, then below it the number, the name (Cormorant, cream), the dates · venue (small caps, gold-light), the tentative tag and a ↗ arrow.
  - Photos are **4:5**, not Velaa's 2:3. Our delegate-group photos are landscape group shots, and 2:3 would cut the groups in half (Telangana Rising has 8 people across the frame).
- **Interaction:**
  - **Hover or keyboard focus on a card:**
    - its photo goes to full brightness and zooms in slowly (to 1.04);
    - a fine gold inner frame draws round it;
    - the arrow moves;
    - the other cards dim to about 40%;
    - the floating heading fades to about 15% so the card reads clearly.
  - **Clicking or tapping a card** opens `/conventions/<slug>`. These are placeholder links that 404 locally, as expected.
- **Phones (≤749px):** a single column with no floating heading. The heading and line 2 sit at the top and the cards follow, with their captions always shown.
- **Tablets (750–1024px):** the desktop layout, slightly smaller.

## Code changes
- **`index.html`:** replace the inside of the existing `<section data-sec="conventions" data-conventions>`. It becomes the jaali background, then a sticky `.mn-conv__head` (h2 + `.mn-conv__more` line), then `ol.mn-conv__list > li.mn-conv__item[data-end] > a.mn-conv__card`, then `.mn-conv__all`. The desktop frame/shots/caption block goes, because the cards carry their own photos. Keep LF line endings.
- **`css/sections.css`:** rewrite the 3b block and its banner comment (CRLF).
  - The section uses `overflow: clip`, not `hidden`. `overflow: hidden` would turn it into a scroll container and stop the sticky heading from working.
  - The heading and the list share one grid cell. The head is `position: sticky; top: 0; height: 100vh` and centred with flex.
  - The list is a 2-column grid; `:nth-child(even)` gets a `margin-top` offset.
  - Hover dimming is pure CSS: `.mn-conv:has(.mn-conv__card:hover, .mn-conv__card:focus-visible)`.
  - Reduced motion: line 2 is shown and nothing transforms.
- **`js/components.js`:** shrink the conventions block to what is still needed: remove past events and renumber. The frame/caption/`activate` code is deleted.
- **`js/motion.js`:** replace `conventionsIntro` (it is not in the pin chain, so nothing else depends on it).
  - The cards rise in on entry; the reveal animates the inner `<a>`.
  - At ≥750px, one scrubbed tween on the even `<li>`s, `y: +120 → −120` across the section, gives Velaa's two-speed columns.
  - A ScrollTrigger toggles `is-more` at about 35% through the section to bring in line 2.
  - All of this goes inside the existing `gsap.matchMedia` blocks with cleanups; reduced motion is already handled by the early exit.
- **Images:** new 4:5 crops at 960×1200, made from the 2400×1350 originals in `assets/site-photos/conv-*.jpg` with a horizontal centre chosen per photo. They replace the 1200×675 files in `assets/img/conventions/`, which nothing else uses. They are the client's own photos, so no credit change is needed.
- **`tools/test/conventions.mjs`:** rewrite it for the new behaviour.
- **`docs/PROJECT-CONTEXT.md`:** update §3, row 4.
- **Archive:** save this plan as `docs/plans/2026-11-02-conventions-velaa.md`.

## Verification
- `node --check js/*.js`.
- **`tools/test/conventions.mjs`** at 1440×900, 1280×720, 1920×1080 and 390×844 checks that:
  - past events are removed and the rest are numbered 01–04;
  - the heading's centre stays at about vh/2 at two scroll depths;
  - line 2 is hidden at the start and shown later;
  - the even cards move against the odd ones as you scroll;
  - hovering card 2 dims the others and the heading;
  - keyboard focus does the same;
  - clicking a card goes to its `href`;
  - phones get one column and a static heading;
  - reduced motion shows everything;
  - `docW === vw` and the console is clean.
- **`shot.mjs … conventions`** at 1440×900, 1280×720 and 390×844. I'll look at the screenshots myself, especially heading readability over the bright skies.
- **Neighbours:** the section's height changes, so I'll re-run `originals`, `arcade`, `skyline`, `voices`, `finale` and `footer`, plus a shot of `cats` and `collection-a` on either side.
