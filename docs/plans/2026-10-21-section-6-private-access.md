# Plan: Section 6 (Collector slot) → "Private Access"

## Context
Section 6 in `index.html` (`[data-sec="collector"]`, ~line 403) is still template copy: "The Nomen Collector / Quiet luxury speaks softly", the Nomen monogram, and a placeholder flower image (`assets/img/collector.jpg`).

Its layout is a full-bleed image with a centred two-line heading, an eyebrow and the mark, and no link. In the scroll sequence it rises as a curtain over section 5, holds for a short pause, and then section 7 wipes in from the right while it slides left. It is the page's one "breath" moment: big, quiet, cinematic.

### Flow so far
| # | Section | What the visitor gets |
|---|---|---|
| 1 | Hero | The promise |
| 2 | Statement | The belief |
| 3 | Two Paths | Choose: explore the city, or here for an event |
| 3b | Conventions | The event path, served |
| 4 | Hyderabad, Your Way | The explore path: six themes, then tours |
| 5 | (still template) | Natural fit: **Asli Originals** (§6.2 of WIREFRAME-CONTENT.md) |
| 6 | **this slot** | |
| 7 | City, "Rooted in the City" | Who Asli is |

Section 5 fits Originals because there are 4 Originals for the 4 slideshow images and 4 numbered steps, and they read as a weekly rhythm: Sunday dawn, Saturday table, Friday night, monthly table.

## Recommendation: Section 6 = Private Access teaser
1. **It's the header CTA nobody explains.** The wireframe's persistent header CTA is "REQUEST PRIVATE ACCESS →", but nothing on the page says what that is. Section 6 gives it a meaning and a second, mid-page entry point.
2. **The layout already says "exclusive".** A dark full-bleed image, one centred line, and a held pause suit "by request only" far better than a card grid would.
3. **It completes the offer.** Section 5 is the open, scheduled end (Originals, anyone can book). Section 6 is the rare, request-only end. Section 7 then answers "who makes this possible?".

### Content
The copy comes from the wireframe §11, fitted to the slot's limits (eyebrow ≤ 26 chars, heading 2 lines of ≤ 32 chars).

| Slot | Copy |
|---|---|
| Eyebrow | Private Access · By Request |
| Heading | Hyderabad, / *behind closed doors.* |
| Sub-line (new, small) | Rare encounters. Remarkable people. |
| Link (new) | Request Access → (same target as the header CTA) |
| Mark | Replace the Nomen monogram (`#i-mark`) with the Asli mark (`assets/brand/asli-logo-white.png`), or drop it |

No names of people (Gopichand, Vinita Pittie and others) go here. They need written consent first (§11 notes), and the teaser works without them.

### Image
Replace `assets/img/collector.jpg` (2400×1350, dark and calm in the centre). Brief: a pair of carved haveli or palace doors, slightly ajar, with warm light spilling through the gap. The doors split on the vertical centre line; that matters for the animation below. Add a Gemini prompt for it to `GEMINI-IMAGE-PROMPTS.md`.

### Motion: "the doors open"
The animation acts out the headline instead of reusing the generic scale-in.
- In `js/motion.js`, collector block (~line 384): the image layer is cut into two halves. Both are the same `<img>`, clipped `inset(0 50% 0 0)` and `inset(0 0 0 50%)`.
- While the section holds (the existing `dwell(S.collector, S.city, .35)`), the scroll moves the halves apart: `x: ∓14vw`, with a slight `rotateY(±8deg)` for depth.
- Behind them is a warm, blurred "interior" layer (the same image, scaled 1.15, brightness up). The heading, sub-line and link fade in from blur through the gap (reuse the current `scale 1.12 → 1, blur 6 → 0` tween).
- The section 7 wipe that follows is unchanged.
- At ≤1024px there is no pin: the doors part once, on a timer, when the section is 30% into view (`once()` helper). With reduced motion the doors are already open.

## Files
- `index.html`, section 6: copy, link, mark, and the second image layer.
- `css/sections.css`, `.mn-ed--mark` block (~line 717): styles for the sub-line and link, and the door half layers.
- `js/motion.js`, collector block: the door timeline driven by scroll during the dwell, plus the small-screen fallback.
- `GEMINI-IMAGE-PROMPTS.md`: the door image prompt.
- `assets/img/collector.jpg`: replaced with the new image.

## Verification
- `npm start`: scroll from section 4 through 7 on desktop. Check that the curtain rises, the doors part during the pause, the text reads clearly, and the section 7 wipe still lines up.
- At 1024px and 390px, check the timed open and that nothing overflows sideways.
- With reduced motion on, the doors are open and the text is visible straight away.
- The link reaches the same URL as the header CTA.

## Open questions (client)
- The Private Access URL: `/private-access`, or `/contact` for now, as on the live site?
- Is the Asli mark wanted under the heading, or should it be dropped?
