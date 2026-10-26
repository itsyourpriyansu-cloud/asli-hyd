# Plan: Wavy colour reveal on the "Two Paths" tiles

## Context
Section 3 of `index.html` (`[data-sec="cats"]`, lines ~206-225) has two tiles: "Explore Hyderabad" (`/tours`) and "Here for an Event" (`/conventions`). Their images (`assets/img/art-old-city.jpg`, `assets/img/art-chowmahalla.jpg`) are real 1880s sepia prints, so the sepia is in the pixels, not a CSS filter.

Goal:
1. **Hover:** a soft, wavy-edged spotlight follows the cursor and shows the same photo **in colour** inside it. It lags slightly behind the cursor and stretches in the direction of movement.
2. **Click:** the spotlight spreads in waves from the click point until the whole tile is in colour, then the page goes to the tile's link.

**Colour source (decided): AI-colourised copies of the same two photos.**
- `assets/img/art-old-city-color.jpg`: exactly 2000×1434
- `assets/img/art-chowmahalla-color.jpg`: exactly 1614×2000

They must keep the same size and framing so the colour lines up with the sepia. The user generates them from prompts I add to `GEMINI-IMAGE-PROMPTS.md`. Until a file exists, the colour texture fails to load, so the hover effect stays off for that tile and a click simply goes to the link. Nothing looks broken.

## Chosen technique: a small WebGL effect driven by GSAP, with no new library
- CSS `mask` or `clip-path` can't give a living, wavy edge. An SVG `feTurbulence` filter can, but it is slow on full-screen images.
- A small fragment shader draws the colour layer with alpha = a wavy mask: `smoothstep` on the distance to the cursor, with the edge pushed in and out by animated fbm noise. Near the edge it also bends the colour image slightly, like ripples on water.
- GSAP (already in `js/vendor/gsap.min.js`) drives every uniform: `quickTo` for the trailing cursor, and tweens for the radius, wave amplitude and the click spread.
- The sepia `<img>` stays visible underneath, and the canvas only draws colour on top. If WebGL or the colour image fails, the tile looks exactly as it does today.

## Files
- **New `js/cats-reveal.js`**, a vanilla IIFE in the same style as `motion.js`:
  - For each `.mn-cats__tile`: inject `<canvas class="mn-cats__gl">` into `.mn-cats__media` before its `::after` shade, so the text gradient still sits on top.
  - Each frame, read the `<img>` rect relative to the canvas and send it to the shader. Cover-fit with `--pos` is done in the shader, so it follows the desktop 54vw centred image, the grid-widen on hover, and the mobile `parallax()` in `motion.js` with no changes there.
  - Load the colour texture lazily, with an IntersectionObserver at about 1 viewport ahead.
  - Render only while a tile is hovered or animating; the loop stops when idle.
  - Hover: on pointerenter, radius 0 → ~20% of the tile's short side (`expo.out`, 0.9s). On pointerleave it goes back to 0 (`power3.inOut`, 0.6s). The cursor follows via `gsap.quickTo(..., {duration: .55, ease: 'power3'})`, and the velocity feeds a stretch uniform.
  - Click on `.mn-cats__cover` or `.mn-cats__link`: `preventDefault`, then one timeline:
    - radius grows to the tile diagonal × 1.15 from the click point (`power3.inOut`, ~1.2s)
    - wave amplitude rises and then settles
    - image scales 1 → 1.05
    - `.mn-cats__content` fades and blurs out
    - the other tile dims
    - when it finishes, `location.href = href`
  - Ctrl/Cmd/Shift/middle-click keep their normal behaviour. A keyboard Enter on the link runs the spread from the tile's centre. Reduced motion or no WebGL: navigate at once.
  - `pageshow` (back/forward cache): reset uniforms and opacity so returning to the page shows sepia again.
- **`css/sections.css`** (category tiles block, ~line 140): `.mn-cats__gl { position:absolute; inset:0; width:100%; height:100%; pointer-events:none; }`. Also set `cursor: pointer` on the tile.
- **`index.html`**: add `data-color="assets/img/art-old-city-color.jpg"` (and the Chowmahalla equivalent) on each `.mn-cats__img`. Add `<script src="js/cats-reveal.js"></script>` after `motion.js`.
- **`GEMINI-IMAGE-PROMPTS.md`**: add a "Section 3: Two Paths colourised" section covering:
  - Attach the original and ask: "Colourise this photograph realistically. Do not move, add, remove, crop or redraw anything; keep every edge in place."
  - Period-true palette hints for each photo:
    - Old City: Charminar lime-plaster cream, Mecca Masjid grey granite, pale blue sky, dusty ochre street, green trees, white and saffron turbans
    - Chowmahalla: ivory stucco, gilt, crimson and gold drapes, crystal chandeliers, warm lamplight
  - Export at the exact original pixel size, as JPEG at q≈82.
  - Check alignment by stacking the colour image over the original in any editor at 50% opacity: there should be no double edges.
  - If Gemini shifts the framing, use a dedicated colourising tool (e.g. Palette.fm or DeOldify), which keeps the geometry.

## Verification
- `node server.js`, then open http://127.0.0.1:8642 and scroll to the tiles.
- Hover: the colour spotlight follows the cursor with a wavy, living edge and stays lined up with the sepia image (no ghosting at buildings or minarets), including while the grid widens.
- Click: colour spreads over the whole tile, then the page goes to `/tours` or `/conventions`. Those pages don't exist in this repo yet, so the server returns 404 there; that's expected.
- Back button: the tile is sepia again. Ctrl+click opens a new tab without the animation.
- At 1024px and below (mouse emulation), hover is off and a tap runs the spread and then navigates. Check that `prefers-reduced-motion` skips the animation.
- DevTools Performance: no rAF work when nothing is hovered.
