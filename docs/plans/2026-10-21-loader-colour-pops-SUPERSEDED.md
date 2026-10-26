# Plan: Loader "pop of colour" from the Asli logo

## Context
The intro loader (`#mn-pre`; `css/preloader.css`, `js/preloader.js`) currently runs like this:
1. The stage is plain ink (`--ink #2e3937`).
2. Five frames open from the centre, one every 0.5s: Heritage, Culture, Business, Wellness, then the hero still.
3. Meanwhile "Hyderabad is ___" rolls one word per frame: Regal, Crafted, Inventive, Serene, Welcoming.
4. The ink wipes up and the last frame grows into the hero.

**Goal:** each time a frame opens, the background bursts into a new colour taken from the Asli logo, so the intro plays like the logo's rainbow. Nothing else changes: same images, words, timings, wipe, morph and hand-off.

## Logo palette
Measured from `assets/brand/asli-logo-trimmed.png`: one colour per letter of HYDERABAD, plus black for "Asli" and "Visitor Experiences".

| Letter | Colour | Hex |
|---|---|---|
| H | yellow | `#FEDF00` |
| Y | orange | `#F78320` |
| D | red | `#F01B24` |
| E | plum | `#900871` |
| R | blue | `#0063A4` |
| A | sky | `#369ED9` |
| B | teal | `#04B89F` |
| A | green | `#00A750` |
| D | lime | `#8DC83F` |

## Sequence (one colour per frame, matched to the image and its word)

| t | Frame · word | Background | Lead "HYDERABAD IS" (small, needs ≥4.5:1) | Word (large italic, needs ≥3:1) |
|---|---|---|---|---|
| 0.0s | Chowmahalla · *Regal* | plum `#900871` | white, 8.5:1 | yellow, 6.4:1 |
| 0.5s | Pearls · *Crafted* | orange `#F78320` | black `#111`, 7.4:1 | plum, 3.3:1 |
| 1.0s | HITEC City · *Inventive* | blue `#0063A4` | white, 6.3:1 | yellow, 4.7:1 |
| 1.5s | Kanha · *Serene* | green `#00A750` | black, 6.0:1 | black, 6.0:1 |
| 2.0s | The city · *Welcoming* | yellow `#FEDF00` (the logo's first letter) | black, 14.2:1 | plum, 6.4:1 |

The stage stays ink until the first frame opens, so the first pop is ink → plum. The yellow then wipes up at 2.5s exactly as the ink does now, revealing the hero.

## The "pop" motion
A colour crossfade would feel flat. Each colour instead **bursts outward from behind the opening image**, echoing the image's own centre-out reveal:
- **Layers:** five colour layers stacked inside `.mn-pre__bg`, above the ink base. Each starts as `clip-path: circle(R0 at 50% 50%)`, where R0 is half the frame size, so the circle is hidden behind the frame.
- **Burst:** at the same moment its frame starts opening (`i × imageDelay`), layer i tweens to `circle(Rmax)`, where Rmax is half the viewport diagonal plus 40px. The tween takes 0.9s with `expo.out`: quicker than the image's 1.5s `power4.out`, so the colour lands as the image settles.
- **Stacking:** each new layer sits above the last, so every pop covers the previous colour.
- **Text:**
  - The lead colour tweens through a CSS variable `--pre-fg` (0.35s) at the same moment.
  - Each word keeps a fixed colour on its own span, so the existing roll animation is untouched.
- **Wipe:** the layers sit inside `.mn-pre__bg`, so the existing wipe takes them all with it. No change there.

## Files (nothing else touched)
- **`index.html`**: five empty `<span class="mn-pre__pop">` inside `.mn-pre__bg` (~line 38).
- **`css/preloader.css`**:
  - Palette tokens on `.mn-pre`.
  - `.mn-pre__pop` layers (absolute, full size, `clip-path: circle(0 …)`, `will-change: clip-path`), each coloured via `:nth-child`.
  - `.mn-pre__lead { color: var(--pre-fg, var(--white-80)); }`.
  - Per-word colours via `.mn-pre__col span:nth-child(n)`.
- **`js/preloader.js`**:
  - Collect `.mn-pre__pop` and set R0 for each.
  - Inside the existing `frames.forEach` loop, add two tweens at the same `t`: the circle burst and the `--pre-fg` colour.
  - Rmax and R0 are function-based, so they're measured at run time and work at any screen size.

## Unchanged by design
- Image list, words and their order, and every value in the `T` timing table.
- The wipe, the morph and the hero hand-off.
- The failsafe and the reduced-motion skip: there's no loader at all with reduced motion.
- Mobile: the same sequence. The circle radius is measured from the viewport, so it covers the screen at any size.

## Verification
- `npm start`, then reload a few times. Check:
  - Every pop starts exactly as its frame starts opening and fills the screen edge to edge.
  - The words and lead text read clearly on each colour.
  - The yellow wipes up into the hero with no ink flash.
- Headless Chrome: capture a frame just after each 0.5s step at 1440×810 and 390×844 to confirm the colour and text pairs.
- Hard-reload with the cache disabled: if the first image arrives late (the 600ms wait), the stage stays ink until frame 0 opens.
