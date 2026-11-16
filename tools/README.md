# tools/

Scripts used to build and check this site. Nothing here ships to the browser.

## Serving the site

```
node server.js 8655        # pick a free port; the default 8642 may already be the user's own server
```

Use `server.js`, not `python -m http.server`: the videos need HTTP Range support. Only stop servers you started yourself.

## test/: headless Chrome checks

Plain Node 22+ (built-in `fetch`/`WebSocket`) driving local Chrome over CDP. There are no npm installs. Always pass an **absolute** output directory.

| Script | What it checks |
|---|---|
| `cdp.mjs` | The shared harness: `launch()`, `load(w,h,{touch,reduce})`, `walkTo()`, `pageTop()`, `rect()`, `ensureVisible()`, `hover/click/tap/key`, `shot()`, `logs` (console errors). |
| `shot.mjs` | Screenshots one section (`data-sec`) at any viewports after walking down to it. Use it for every visual change. |
| `home.mjs` | The v3 homepage (16 Nov 2026): section order; 6 ways (six windows in a row, hover plays the loop; phone 2×3); Featured Tours (12 cards, 4 to a row, tabs filter and announce; phone swipe rail); conventions (upcoming only, date order, no eyebrow, no pin) and the events calendar (opens on the first event's month, day pick, cross-month search, type filter, Esc returns focus; phone full-screen sheet with a pinned close); the numbers strip counts and stays slim; Private Access clear of the next section; Quick Experiences and shorts arrows; shorts partner filter and previews (hover; on screen on touch); testimonials heading; CTA ink on cream; reduced motion; no horizontal scroll; clean console. |
| `skyline.mjs` | Section 8's "400 years in one line": the landmarks open strictly left to right, only once on screen, part-way (not popping), all open while the band is in view, and stay drawn on scroll-back (draw once since v3); reduced motion fully drawn; phone band draws once and glides to the bridge. Replaces `legacy/skyline-*.mjs`, which check the old single-path drawing. |
| `finale.mjs` | Featured Brands, reels and the CTA: every brand logo loads; reveals finish; hover swaps a logo to colour; on-screen reels play and off-screen ones are paused; the marquee pauses on hover; the CTA timeline draws inside the screen; `#co-curated`, `#quick-experiences`, `#private-access` glide to their sections; reduced motion; phone; `credits.html` lists every new asset. |
| `voices.mjs` | Section 11, testimonials (`materials` slot): arch drawn and the photo stage under the heading fits one viewport at 1440×900 and 1280×720, the timer advances with all layers in step, hover pauses, click and arrow keys, reduced motion, phone tap, no horizontal scroll at phone and tablet. |
| `hero.mjs` | Section 1 headline in Cormorant Garamond Light at 1440, 1280, 1025, 768 and 390 wide: font loaded on it, exactly three left-aligned lines inside the screen, the letter sweep finishes, the accessible name reads as one phrase; reduced motion. |
| `footer.mjs` | The footer: content intact (logo, contact, five social icons, three link columns, legal row and credits on the ground band); one screen tall on desktop with the content clear of the buildings; the cusped edge meets the closing CTA; the inlay unrolls; the three tiers rise to rest and the lamps light at the end of the page, and lower again on scroll-back; ambient loops run on screen; no horizontal scroll (1440, 1280, phone); reduced motion complete and still. |
| `legacy/*` | Earlier one-off suites, kept for reference: section 4 themes, the conventions carousel (+ swipe), the skyline (desktop sweep + mobile band), the preloader screencast (+ `preloader-summary.py`), the Two Paths colour bubble, the numbers card; and since v3 `conventions-pinned.mjs`, `arcade-pinned.mjs` and `explorers-v2.mjs` (the pinned rails and the card explorers; they fail against v3 by design). They are standalone (own CDP code) and take `<url> <outDir>`. Their header comments are copy-pasted and not accurate; read the code. |

```
node tools/test/shot.mjs http://127.0.0.1:8655/ C:/abs/out worlds 1440x900 1280x720 390x844
node tools/test/home.mjs http://127.0.0.1:8655/ C:/abs/out
node tools/test/skyline.mjs http://127.0.0.1:8655/ C:/abs/out
node tools/test/finale.mjs http://127.0.0.1:8655/ C:/abs/out
node tools/test/voices.mjs http://127.0.0.1:8655/ C:/abs/out
node tools/test/footer.mjs http://127.0.0.1:8655/ C:/abs/out
node tools/test/hero.mjs http://127.0.0.1:8655/ C:/abs/out
```

Lessons baked into the harness:
- `load()` waits for the page to finish parsing before waiting on the loader. Without that, a cold load can start the walk while scrolling is still locked.
- **Walk, don't jump.** The reveals, pins and `once()` triggers only fire while scrolling through a section.
- Pinned or wiped sections (`city`, `spinner`) are only "landed" when the section's top reaches 0. Their inner panel starts translated, so measure the section, not the panel.
- **Touch emulation is sticky.** After a `{touch:true}` load, hover media can stay off. Run desktop checks first, or in a fresh `launch()`.
- **Bring elements into view before hovering.** Pointer events outside the viewport do nothing. On phones the card rows scroll sideways, so pick a card that is on screen.
- Links to inner pages (`/originals/...`, `/experiences/...`) 404 locally. That is expected; filter them out of `logs`.

## assets/: finding and preparing media

| Script | Use |
|---|---|
| `commons.py` | Wikimedia Commons. `search <outDir> <minSide> "q1" "q2"` writes thumbnails, `meta.json` and `grid.jpg` (a contact sheet: **look at it** before choosing). `get "File:…" <dst> [width]` downloads and prints the credit JSON. |
| `cardcrop.py` | Cover-crops a photo to 720×840 around a focal point: `cardcrop.py <src> <dst> <fx> <fy>` (0–1). This is the card size for sections 4 and 9. |
| `sheet.py` | Labelled contact sheets for files sharing a prefix. |
| `coverr.py` | Free Coverr clips for search terms, with the renditions that really exist. Download via `https://cdn.coverr.co/videos/<id>/1080p.mp4` (`curl -L`). |
| `mixkit_hd.py` / `mixkit_tag.py` | Mixkit clips by tag page, and which have 1080p/2160p. Download via `https://assets.mixkit.co/videos/<id>/<id>-1080.mp4`. |
| `loopclip.sh` | Turns a source clip into a 9 s seamless loop + poster: `bash tools/assets/loopclip.sh <src> <start> <dst.mp4>`. |
| `credits.py` | Builds `credits.html` (the footer's Photo credits page) from the three SOURCES files: `python -I tools/assets/credits.py`. Re-run after any credit change. |
| `ddcolor.py`, `colorize.py` | Colourise the sepia Raja Deen Dayal prints for the section-3 colour bubble (DDColor ONNX / OpenCV DNN; models not included). |

Record every photo in `assets/img/SOURCES.md` (or `assets/img/quick/SOURCES.md`) and every clip in `VIDEO-SOURCES.md`.

Sourcing rules:
- **No YouTube downloads.**
- No NC/ND licences.
- Pexels and Pixabay block scripts; Coverr, Mixkit and Commons work.
- Run downloaded files through Python with `-I`, and keep downloads in their own folder.

## make_placeholders.py

From the original template: it regenerates labelled placeholder media. It is mostly obsolete now that real assets are in, but sections 10–14 still use its output.
