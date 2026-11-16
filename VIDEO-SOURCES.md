# Section 4 Theme Videos: Sources and Licences

These are the looping clips that play in the large "Hyderabad, Your Way" panel when a theme card is active. Each file is in `assets/video/themes/{theme}.mp4`, with a matching `{theme}.jpg` poster.

| Theme | File | Source | Original | Licence |
|---|---|---|---|---|
| Heritage | `heritage.mp4` (1280×720, 9.7 s, 3.2 MB) | Client's own hero footage (`assets/video/hero-hyderabad.mp4`), cut from 4.0 s onward to skip the burned-in "HYDERABAD" title | Hyderabad aerial montage (Charminar, Ramoji, Durgam Cheruvu, Ganesh festival) | Client footage. It carries an **@Drone_Venkat** watermark, so get written permission or a clean master |
| Culture | `culture.mp4` (1920×1080, 5.4 s, 1.3 MB) | [Mixkit #50772: Hands carefully lift a Diwali offering with candles burning](https://mixkit.co/free-stock-video/hands-carefully-lifts-a-diwali-offering-with-canddle-burning-50772/) | 1920×1080 | [Mixkit Stock Video Free License](https://mixkit.co/license/#videoFree) |
| Cinema | `cinema.mp4` (1920×1080, 8.0 s, 2.0 MB) | [Mixkit #49646: A young woman filming with a retro film camera](https://mixkit.co/free-stock-video/a-young-smiling-woman-filming-a-video-by-the-lake-49646/) | 1920×1080 | Mixkit Stock Video Free License |
| Business | `business.mp4` (1920×1080, 9.0 s, 3.6 MB) | [Mixkit #49845: Aerial view of the glass corporate buildings of a big city](https://mixkit.co/free-stock-video/aerial-view-of-the-glass-corporate-buildings-of-a-big-49845/) | 1920×1080 | Mixkit Stock Video Free License |
| Wellness | `wellness.mp4` (1920×1080, 7.8 s, 1.6 MB) | [Mixkit #4529: Woman doing yoga in a Hindu dress](https://mixkit.co/free-stock-video/woman-doing-yoga-in-a-hindu-dress-4529/) | 1920×1080 | Mixkit Stock Video Free License |
| Learning | `learning.mp4` (1920×1080, 9.0 s, 2.9 MB) | [Mixkit #4519: Students walking in a university](https://mixkit.co/free-stock-video/students-walking-in-a-university-4519/) | 1920×1080 | Mixkit Stock Video Free License |

**Mixkit licence in brief:** free for commercial and personal projects, with no attribution required. You may not redistribute the clips as standalone stock footage. Keep a copy of this file with the project.

## How the clips were prepared
- Trimmed, then looped with a 1-second crossfade from the end back to the start, so the loop has no visible jump.
- H.264 High profile, yuv420p, no audio, CRF 26 (Business at CRF 29), `+faststart` so playback starts quickly. Posters taken at 0.5 s.
- A clip is only downloaded when its theme is first activated, and only plays while the section is on screen.

## Why not YouTube
YouTube's terms forbid downloading videos, and the footage belongs to its creators, so re-hosting it on a commercial site would infringe copyright. To use a specific YouTube creator's Hyderabad footage, license it directly from that creator.

## Recommended upgrades before launch
The stock clips are high quality but **not filmed in Hyderabad** (apart from Heritage). For a fully authentic set:
1. **Ask @Drone_Venkat** (the creator of the hero footage) for 4K, watermark-free masters. Their library already covers Charminar, the palaces, Ramoji, HITEC City and Durgam Cheruvu.
2. **Or license Hyderabad-specific 4K clips** from Shutterstock, Pond5 or Envato Elements. Good search terms: *Charminar 4K*, *Chowmahalla Palace*, *Laad Bazaar bangles*, *Hyderabadi biryani dum*, *Ramoji Film City*, *HITEC City drone*, *Durgam Cheruvu bridge night*, *Kanha Shanti Vanam*, *Osmania University*.
3. Drop each new clip in as `assets/video/themes/{theme}.mp4` (landscape 16:9, 8–10 s, subject centred, since the desktop panel crops to a tall portrait). Nothing else needs to change.

---

# Section 9 Originals Videos: Sources and Licences

These are the loops for the "Asli Hyderabad Originals" panel (the section-4 explorer, mirrored). Each file is in `assets/video/originals/{name}.mp4`, with a matching `{name}.jpg` poster. All are 1920×1080, 9 s, H.264 CRF 26, no audio, `+faststart`. Each loops with a 1-second crossfade from the end back to the start.

| Original | File | Source | Licence |
|---|---|---|---|
| Hyderabad at Dawn | `dawn.mp4` (3.0 MB) | Coverr: Making chai tea in India (clip ID `coverr-making-chai-tea-in-india-8095`) (from 12 s) | [Coverr License](https://coverr.co/license) |
| Welcome Hyderabad | `welcome.mp4` (2.9 MB) | Coverr: Friends laughing in India (clip ID `coverr-friends-laughing-in-india-7824`) (from 2 s) | Coverr License |
| Hyderabad After Dark | `after-dark.mp4` (2.5 MB) | Coverr: Streets of Trivandrum, India (clip ID `coverr-streets-of-trivandrum-india-936`) (night traffic, from 4 s) | Coverr License |
| The Hyderabad Table | `table.mp4` (2.5 MB) | [Mixkit #5224: Sequence of a decorated wedding table](https://mixkit.co/free-stock-video/sequence-of-a-decorated-wedding-table-5224/) | Mixkit Stock Video Free License |
| Ramzan Nights | `ramzan.mp4` (3.0 MB) | Coverr: Cooking street food (clip ID `coverr-cooking-street-food-8470`) (steaming pots at night, from 2 s) | Coverr License |
| Festival Hyderabad | `festival.mp4` (3.4 MB) | Coverr: Indian fire ceremony (clip ID `coverr-indian-fire-ceremony-9024`) (from 1.5 s) | Coverr License |

**Coverr licence in brief:** free for commercial and non-commercial use, with no attribution required. You may not build a competing stock service or use the clips for AI training. Coverr holds model releases but does not pass them on, and holds no property or landmark releases.

**Authenticity:** all six clips are Indian or neutral footage, but none was filmed in Hyderabad. As for section 4, licensed Hyderabad footage would make the strongest upgrade: Irani cafés at dawn, a Telugu meal, Durgam Cheruvu at night, a Falaknuma or Chowmahalla dinner, Charminar's Ramzan bazaar, Bonalu and Bathukamma. Drop replacements in with the same filenames.

---

# Section 14 Reels (@aslihyd): Sources and Licences

Eight 9:16 loops in `assets/video/reels/{name}.mp4`, each with a `{name}.jpg` poster: 608×1080 centre crops (scaled to 1080 high), 30 fps, H.264, no audio, `+faststart`, about 0.5–2 MB each. The first five reuse the section 4 and section 9 loops (already licensed above), cropped to portrait. The two Mixkit clips are new; they and the drone montage loop with the 1-second crossfade used everywhere on the site.

| Reel | File | Source | Licence |
|---|---|---|---|
| Hyderabad from above | `hyderabad.mp4` (1.4 MB, 10 s) | Client's own drone montage (`assets/video/hero-hyderabad.mp4`, from 3.7 s, after the burned-in title): Buddha on Hussain Sagar, HITEC City, Ambedkar statue, Ramoji, night roads, stadium, Birla Mandir. The crop keeps the @Drone_Venkat watermark out of frame. | Client footage (same permission note as the hero) |
| Irani chai, poured right | `chai.mp4` | `originals/dawn.mp4` (Coverr: Making chai tea in India) | Coverr License |
| Festival nights | `festival.mp4` | `originals/festival.mp4` (Coverr: Indian fire ceremony) | Coverr License |
| Street food after dark | `street-food.mp4` | `originals/ramzan.mp4` (Coverr: Cooking street food) | Coverr License |
| Friends around the table | `friends.mp4` | `originals/welcome.mp4` (Coverr: Friends laughing in India) | Coverr License |
| On stage, World Tourism Day 2026 | `wtd-awards.mp4` (0.8 MB, 20 s) | Client's own phone footage of the World Tourism Day 2026 award ceremony (WhatsApp video sent by the user, 16 Nov 2026), 7.5–27.5 s | Asli Hyderabad's own |
| Asli at World Tourism Day | `wtd-ramoji.mp4` (2.3 MB, 50 s) | Client's own interview reel at World Tourism Day 2026 with Ramoji Film City shots and burned-in captions (WhatsApp video, 16 Nov 2026), full length so the captions read. Edited by Reachhouse (their watermark is in the frame) | Asli Hyderabad's own |
| Moments from World Tourism Day | `wtd-moments.mp4` (1.6 MB, 22 s) | Client's own highlight reel of the same day (WhatsApp video, 16 Nov 2026), first 22 s (the closing white fade dropped). Reachhouse watermark in the frame | Asli Hyderabad's own |
| Heritage, beyond the guidebook | `asli-heritage.mp4` (1.7 MB, 25 s) | Asli's own guest reel (WhatsApp video sent by the user, 16 Nov 2026), burned-in captions, Reachhouse watermark: guests at the Qutb Shahi Tombs, Golconda, Charminar and Laad Bazaar; first 25 s (the closing call-us card dropped) | Asli Hyderabad's own |
| Business visits, hosted | `asli-business.mp4` (1.7 MB, 25 s) | Asli's own guest reel (WhatsApp video sent by the user, 16 Nov 2026), burned-in captions, Reachhouse watermark: a business visitor at Chowmahalla, Charminar and an Irani chai stop; first 25 s | Asli Hyderabad's own |
| Shop like a local | `asli-shopping.mp4` (1.9 MB, 23.5 s) | Asli's own guest reel (WhatsApp video sent by the user, 16 Nov 2026), burned-in captions, Reachhouse watermark: a conference guest shopping boutiques and artisan bazaars; first 23.5 s | Asli Hyderabad's own |
| The last mile, curated | `asli-last-mile.mp4` (2.4 MB, 54 s) | Asli's own guest reel (WhatsApp video sent by the user, 16 Nov 2026), burned-in captions, Reachhouse watermark: a host talks about Asli Hyderabad with a guest; full length so the captions read | Asli Hyderabad's own |

**16 Nov 2026 (later):** the four Coverr reels (chai, festival, street food, friends) gave way to four Asli guest reels (`asli-*`, same encode). Every reel is now Asli's own footage. The Coverr files stay: the shorts use them. Order: Hyderabad from above, On stage, Heritage, Business visits, Asli at World Tourism Day, Shop like a local, Moments, The last mile.

**16 Nov 2026:** three of the Mixkit loops (offering, dance, jewellery) left the reels for Asli's own World Tourism Day 2026 clips (432×768, H.264, no audio, `+faststart`, CRF 30; posters `wtd-*.jpg`). The marquee order is now: Hyderabad from above, On stage, Irani chai, Festival nights, So we are Asli Hyderabad, Street food, Moments, Friends. `jewellery.mp4` stays: a short uses it. `offering.mp4` and `dance.mp4` are no longer used.

**Authenticity:** every reel is Asli's own footage. The captions describe the moment, not a place, so none claims a location the footage isn't from. Real Asli reels should replace these.

---

# Section 10 Shorts (Asli Originals / Curated Experiences with Partners): Sources and Licences

Four new 9:16 loops in `assets/video/shorts/{name}.mp4`, each with a `{name}.jpg` poster: 608×1080 centre crops (scaled to 1080 high), 30 fps, H.264, no audio, `+faststart`. All are cut from loops already licensed above. Five more shorts reuse the section 14 reels (`chai`, `friends`, `jewellery`, `street-food`, `festival`), so those clips appear in both rows until the client sends its own shorts.

| Short | File | Source | Licence |
|---|---|---|---|
| Hyderabad After Dark | `after-dark.mp4` | `originals/after-dark.mp4` | as listed under section 9 |
| The Hyderabad Table | `table.mp4` | `originals/table.mp4` | as listed under section 9 |
| Behind the Screen (Ramoji) | `behind-the-screen.mp4` | `themes/cinema.mp4` | as listed under section 4 |
| Reset (Heartfulness) | `reset.mp4` | `themes/wellness.mp4` | as listed under section 4 |

**Authenticity:** stock placeholders; the partner cards show footage that suits the experience, not footage of the partner's venue.

---

# Section 1 Hero Video: Source

| Slot | File | Source | Licence |
|---|---|---|---|
| Hero | `hero-hyderabad-2.mp4` (1280×720, 12.7 s, 5.9 MB) + poster `assets/img/hero-hyderabad-2.jpg` (its first frame, also the loader's final image) | Client-supplied `assets/video/hero 2.mp4`: a Hyderabad drone montage (Secretariat, Charminar, Golconda, Cyber Towers, Durgam Cheruvu, HITEC City). The file was stored sideways (720×1280), so it was rotated upright, cut from 5.2 s onward to drop the burned-in "HYDERABAD" title intro, re-encoded H.264 CRF 23 with `+faststart`, and its audio dropped | Client footage. Same creator as the earlier hero: **@Drone_Venkat** watermark and a DJI Air 3S logo are burned in, so get written permission or a clean master |

The earlier hero (`hero-hyderabad.mp4`) stays in the repo: the Heritage theme clip and the "Hyderabad from above" reel were cut from it.
