> **Requested 7 Nov 2026 ("plan it out and make it work"); built the same day.** It revises `2026-11-07-conventions-card-rail.md`.

# Conventions (section 4): a minimal, 100vh, scroll-driven card rail

## Context
After the first card-rail build, the user asked for these changes:
- **Cards:** quieter and image-led. Remove the "Delegate experiences available" pill. The button rests inactive and only turns white on hover. The dates and other text are smaller.
- **Card size:** bigger cards with smaller gaps, for a luxury feel.
- **Height:** the whole section fits in 100vh.
- **Content:** at least 10 conventions, carried left to right by the page scroll (GSAP).
- **No eyebrows anywhere on the site.**
- **Charminar:** an Antigravity prompt for a background-free Charminar image to replace the line drawing.

## Content
Real, upcoming events only, so the past-event filter never empties the rail. Asli is not the organiser; dates come from public listings and are marked tentative unless the organiser confirmed them. In date order:

| Event | Dates | Venue | Source |
|---|---|---|---|
| GANSID International Congress 2026 | 23–25 Oct 2026 | HICC & Novotel | live site (past: removed by the filter) |
| APAC Summit 2026 | 28–30 Oct 2026 | Hyderabad | live site (past: removed) |
| NDE 2026 (ISNT 36th annual conference, with AeroNDT 2026) | 15–17 Nov 2026 | HITEX | ICNDT calendar |
| AVAR 2026 Cyber Security Conference | 02–04 Dec 2026 | Hyderabad | live site |
| Telangana Rising Global Summit 2026 | 07–09 Dec 2026 | Bharat Future City | live site |
| PHOTONICS 2026 (17th Intl. Conference on Fiber Optics & Photonics) | 09–13 Dec 2026 | IIT Hyderabad | photonics2026.iith.ac.in |
| SEC 2026 (15th Structural Engineering Convention) | 20–23 Dec 2026 | IIT Hyderabad | civil.iith.ac.in/SEC2026 |
| ICCA Global Summit 2027 | 10–14 Jan 2027 | HITEX | live site |
| BioAsia 2027 | 15–17 Feb 2027 | HITEX | live site |
| IEEE APSCON 2027 | 15–17 Mar 2027 | Hyderabad | IEEE Sensors Council listings |
| Vaccines World Summit 2027 | 17–18 Mar 2027 | Hyderabad | IMAPAC brochure |
| Hyderabad Jewellery, Pearl & Gem Fair 2027 | 07–09 May 2027 | HITEX | event listings |

**Card photos:** the client's own photos (`assets/site-photos/`), cropped to 960×1200. The new cards use:
- the lit Charminar minaret (the GANSID file);
- the Buddha at dusk;
- the food trail;
- delegates at the Statue of Equality;
- Charminar lit at night;
- delegates in the Laad Bazaar.

## Design
- **Section:** exactly one screen tall (`100svh`). Rows: the header (title, sub-line, "All conventions"), then the rail, which fills the remaining height.
  - The cards take their size from that height (2:3), with a 1.2rem gap.
  - The Charminar sits to the right of the header and the cards overlap its base.
  - The gold rule and the eyebrow are gone.
- **Card:** the photo at full strength, with soft ink gradients at the top (for the date) and bottom (for the text).
  - **Top:** "15–17 Nov 2026 · Tentative" in small spaced caps.
  - **Bottom:** the name (Cormorant, about 2rem), the venue with the pin, and a ghost button (a faint outline with dim text).
  - **Hover / focus:** the button fills cream with ink text, and the photo eases in by 3%. There is no lift.
- **Desktop (≥1025px):** the section pins. After a short pause, the page scroll moves the rail from right to left until the last card meets the column edge, then pauses again (the Quick Experiences pattern). The cards run off the right edge of the screen.
- **≤1024px, and reduced motion:** a native swipe rail with snap. The arrows show only with a mouse and only when the rail overflows (never while scroll-driven).
- **Eyebrows:** removed from Conventions, Hyderabad Your Way, Private Access, Rooted and Originals, along with their dead CSS and JS selectors.

## Charminar image (Antigravity prompt)
- Save the generated image as `assets/img/conventions/charminar.png`: a transparent PNG, 4:5, at least 1200×1500.
- It will replace the line Charminar (the `<g>` in `.mn-conv__art`). The gold arch outlines stay behind it.
- The prompt is in the hand-over message and in `GEMINI-IMAGE-PROMPTS.md`.

## Verification
- `tools/test/conventions.mjs`, rewritten. It checks:
  - 10 upcoming cards in date order;
  - no serial numbers;
  - no eyebrow anywhere;
  - a 100vh section;
  - the desktop pin carrying the rail to its last card;
  - the ghost button filling on hover;
  - native swipe on tablets and phones;
  - reduced motion using the arrows;
  - no sideways page scroll;
  - a clean console.
- `shot.mjs` at 1440, 1280, 768 and 390.
- The neighbours (`cats`, `collection-a`, `collector`, `city`, `collection-b`) after the eyebrow removal.
