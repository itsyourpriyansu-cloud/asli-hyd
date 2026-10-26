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

# Section 14 Reels (@aslihyderabad): Sources and Licences

Eight 9:16 loops in `assets/video/reels/{name}.mp4`, each with a `{name}.jpg` poster: 608×1080 centre crops (scaled to 1080 high), 30 fps, H.264, no audio, `+faststart`, about 0.5–2 MB each. The first five reuse the section 4 and section 9 loops (already licensed above), cropped to portrait. The two Mixkit clips are new; they and the drone montage loop with the 1-second crossfade used everywhere on the site.

| Reel | File | Source | Licence |
|---|---|---|---|
| Hyderabad from above | `hyderabad.mp4` (1.4 MB, 10 s) | Client's own drone montage (`assets/video/hero-hyderabad.mp4`, from 3.7 s, after the burned-in title): Buddha on Hussain Sagar, HITEC City, Ambedkar statue, Ramoji, night roads, stadium, Birla Mandir. The crop keeps the @Drone_Venkat watermark out of frame. | Client footage (same permission note as the hero) |
| Irani chai, poured right | `chai.mp4` | `originals/dawn.mp4` (Coverr: Making chai tea in India) | Coverr License |
| Festival nights | `festival.mp4` | `originals/festival.mp4` (Coverr: Indian fire ceremony) | Coverr License |
| Street food after dark | `street-food.mp4` | `originals/ramzan.mp4` (Coverr: Cooking street food) | Coverr License |
| An offering of light | `offering.mp4` | `themes/culture.mp4` (Mixkit #50772) | Mixkit Stock Video Free License |
| Dance in the old style | `dance.mp4` (7 s) | [Mixkit #50787: A young woman in traditional Indian attire performs a captivating dance](https://mixkit.co/free-stock-video/a-young-woman-in-traditional-indian-attire-performs-a-captivating-50787/) (from 2 s) | Mixkit Stock Video Free License |
| Jewellery for the occasion | `jewellery.mp4` (7 s) | [Mixkit #50782: A woman using jewelry on her hand and face posing](https://mixkit.co/free-stock-video/a-woman-using-jewelry-on-her-hand-and-face-posing-50782/) (native vertical, from 8 s) | Mixkit Stock Video Free License |
| Friends around the table | `friends.mp4` | `originals/welcome.mp4` (Coverr: Friends laughing in India) | Coverr License |

**Authenticity:** only the montage was filmed in Hyderabad. The captions describe the moment, not a place, so none claims a location the footage isn't from. Real Asli reels should replace these.
