# Gemini Image Prompts: Section 4, "Hyderabad, Your Way"

There are 12 images, one pair for each of the six theme cards:

- **Static image:** the place. A calm, iconic establishing shot, shown at rest.
- **Hover image:** the hosted human moment. Closer, warmer and tactile, shown when the pointer is over the card.

The site already has placeholder photos in these slots. Save each generated image over the matching file and nothing else needs to change.

| Card | Static file | Hover file |
|---|---|---|
| 01 Heritage | `assets/img/themes/heritage.jpg` | `assets/img/themes/heritage-hover.jpg` |
| 02 Culture | `assets/img/themes/culture.jpg` | `assets/img/themes/culture-hover.jpg` |
| 03 Cinema | `assets/img/themes/cinema.jpg` | `assets/img/themes/cinema-hover.jpg` |
| 04 Business | `assets/img/themes/business.jpg` | `assets/img/themes/business-hover.jpg` |
| 05 Wellness | `assets/img/themes/wellness.jpg` | `assets/img/themes/wellness-hover.jpg` |
| 06 Learning | `assets/img/themes/learning.jpg` | `assets/img/themes/learning-hover.jpg` |

---

## How to run these

1. **Paste the style block first, then the subject.** Every prompt below already starts with `[STYLE]`. Replace it with the full style block, so all 12 images share one look.
2. **Use one Gemini chat for all 12.** Once the first image is right (Heritage, static), attach it to every following prompt and add: *"Match the light, colour grade, lens and mood of the attached image."* That attached reference is what makes the set look like one photo shoot.
3. **Ask for portrait 6:7**, at 1440×1680 or larger. If Gemini only offers presets, choose 3:4 portrait and crop afterwards.
4. **Keep the bottom-left quarter calm.** The card label (number, name and tagline) sits there in white type over a dark fade.
5. **Export:** crop to **720×840**, JPEG quality about 80, sRGB. Name each file as in the table above.

---

## Style block (paste in place of `[STYLE]`)

> Editorial luxury travel photograph for a high-end Hyderabad, India, destination brand, in the spirit of Condé Nast Traveller and Aman Resorts photography. Photorealistic, shot on a full-frame camera with a 35mm lens, natural light only, gentle depth of field. Rich but restrained colour: warm sandstone, aged brass, deep green and soft indigo dusk tones, with slightly lifted shadows and fine film grain. Calm, uncluttered composition with generous negative space, keeping the lower-left quarter of the frame quiet and darker for overlaid text. Portrait orientation, 6:7 aspect ratio, high resolution. People, if present, are seen from behind, in profile at a distance, or as hands only. No recognisable faces.

## Negative line (add at the end of every prompt)

> Avoid: text, letters, signage, logos, watermarks, brand names, legible writing, frames or borders, HDR look, oversaturated colours, harsh midday light, crowds, tourists posing at the camera, selfie sticks, plastic or CGI look, distorted architecture, extra fingers or hands.

---

## 01 · Heritage: *Walk through centuries.*

**Static: the place**

> [STYLE] The Qutb Shahi Tombs in Hyderabad at golden hour: a monumental grey-granite tomb with a great onion dome on a high drum, surrounded by arcaded terraces and smaller domed tombs, set in a landscaped garden with frangipani trees. Low warm sunlight rakes across the stone from the left and throws long soft shadows. Symmetrical, centred composition looking slightly up at the dome, with the sky a clean pale gold. Perfectly still, with no people. Avoid: text, signage, logos, watermarks, crowds, distorted architecture.

**Hover: the hosted moment**

> [STYLE] Inside a Nizam-era palace durbar hall in Hyderabad (in the style of Chowmahalla Palace): soaring white-and-gold stucco walls, rows of tall arched windows, and enormous crystal chandeliers glowing with soft daylight. A small group of three elegantly dressed travellers, seen from behind, follows a local host who gestures toward the chandeliers. The polished marble floor reflects the light. Reverent, quiet and grand. Avoid: text, signage, logos, watermarks, faces, crowds.

## 02 · Culture: *Taste. Make. Celebrate.*

**Static: the place**

> [STYLE] Overhead three-quarter view of a Hyderabadi dum biryani in a hammered copper handi, its dough seal just broken and steam rising. Long saffron-streaked basmati, fried onions, mint leaves. Beside it sit a small glass of Irani chai and two Osmania biscuits on a brass plate, on an old dark teak table under a single shaft of warm window light. Rich, appetising, intimate. Avoid: text, logos, watermarks, plastic-looking food, cutlery clutter.

**Hover: the hosted moment**

> [STYLE] Close-up of an artisan's weathered hands in the Laad Bazaar of Hyderabad, pressing tiny mirror-cut glass stones into a warm, just-heated lac bangle with a fine tool. Behind, slightly out of focus, are shelves stacked with hundreds of jewel-toned bangles in ruby, emerald, gold and sapphire. Warm tungsten shop light and a little smoke from the heating coals. Tactile, crafted, alive. Avoid: text, signage, logos, watermarks, faces.

## 03 · Cinema: *Step behind the screen.*

**Static: the place**

> [STYLE] A colossal film-set palace façade on an open studio backlot near Hyderabad at dusk: ornate gilded columns, carved arches and a monumental gateway built for an epic Telugu historical film. From this angle the timber scaffolding and bracing behind the façade are just visible, revealing it as a set. Deep blue dusk sky with the last orange light on the gilding. Cinematic, monumental, a little magical. Avoid: text, signage, logos, watermarks, people, theme-park look.

**Hover: the hosted moment**

> [STYLE] Behind the scenes on an Indian film set at night: a professional cinema camera on a dolly track in the foreground, warm tungsten lights on stands with soft diffusion, haze in the air catching the beams, and a blank film clapperboard resting on an apple box. In the soft-focus background, crew members are seen as silhouettes from behind, preparing a shot on an ornate period set. Moody, golden and exciting. Avoid: text, writing on the clapperboard, logos, watermarks, faces.

## 04 · Business: *Meet the city that builds.*

**Static: the place**

> [STYLE] Hyderabad's HITEC City skyline at blue hour, seen across the calm water of Durgam Cheruvu lake: modern glass office towers with warm lit windows, and an elegant cable-stayed bridge with tall white pylons spanning the lake, its lights reflected in the still water. Clean, ambitious, contemporary, with a deep indigo sky and a soft amber horizon. Avoid: text, signage, company logos, watermarks, traffic blur clutter.

**Hover: the hosted moment**

> [STYLE] A bright, airy innovation-campus atrium in Hyderabad: warm timber, glass and indoor plants, with natural light pouring in from a high skylight. In the middle distance two founders, a woman and a man in smart-casual clothes, seen in profile, talk animatedly over a laptop at a long wooden table, coffee cups beside them. Optimistic, focused, human. Avoid: text, screen content, logos, watermarks, faces in detail, stock-photo poses.

## 05 · Wellness: *Slow down. Restore.*

**Static: the place**

> [STYLE] A vast meditation campus on the outskirts of Hyderabad at dawn, inspired by Kanha Shanti Vanam: low, graceful white tensile-canopy halls set among dense tropical forest, with soft mist drifting between the trees and the first pale-gold light on the canopies. A long tree-lined path leads toward the halls. Serene, spacious and green, seen from a gentle elevated angle. Avoid: text, signage, logos, watermarks, crowds.

**Hover: the hosted moment**

> [STYLE] A single figure in loose white linen sits cross-legged in meditation on a weathered wooden deck at the edge of a still lake near Hyderabad at sunrise, seen from behind. Soft mist lies on the water, and a few reeds and a frangipani branch frame the edge of the image. Warm peach-gold light, mirror-calm water, deep quiet. Avoid: text, logos, watermarks, faces, yoga-studio props.

## 06 · Learning: *See. Meet. Understand.*

**Static: the place**

> [STYLE] A historic grey-granite university building in Hyderabad with Indo-Saracenic architecture (in the spirit of Osmania University's Arts College): a grand arched entrance, a central dome and carved stone details, in clear morning light. A broad lawn and path in front, with two or three students walking away from the camera, small in the frame. Dignified, scholarly, timeless. Avoid: text, signage, logos, watermarks, crowds, distorted architecture.

**Hover: the hosted moment**

> [STYLE] Inside a modern makers' lab and prototyping studio in Hyderabad: close-up of a student's hands assembling a small circuit board with fine tweezers, a 3D printer working beside them, and warm task lighting. In the soft-focus background a small group of students and a mentor gather around a workbench, seen from behind. Curious, hands-on, inspiring. Avoid: text, screen content, logos, watermarks, faces in detail.

---

## Notes for the client

- **Real landmarks:** AI images of real places (the Qutb Shahi Tombs, Durgam Cheruvu bridge, Osmania-style architecture, Kanha) can get details wrong, such as the number of domes or the bridge's shape. Check each one against reality, or replace it later with commissioned photography. The card slots and filenames stay the same.
- **Video:** every theme currently plays the hero video in the large panel. To give a theme its own clip, change that card's `data-video="…"` in `index.html`. No other code needs to change.
- **Matching set:** if one image looks off from the rest, regenerate it with the approved Heritage static image attached as a style reference, rather than adjusting the colour afterwards.

---

# Section 3: "Two Paths" colourised prints

When you hover the "Explore Hyderabad" and "Here for an Event" tiles, a wavy spotlight shows the photo **in colour**. Clicking a tile floods the whole photo with colour. The originals are 1880s sepia prints by Raja Deen Dayal, so each one needs a colourised copy that **lines up pixel for pixel** with the original. Anything moved or redrawn shows up as a double edge inside the spotlight.

| Tile | Original (attach this) | Save the colour copy as | Exact size |
|---|---|---|---|
| Explore Hyderabad | `assets/img/art-old-city.jpg` | `assets/img/art-old-city-color.jpg` | 2000 × 1434 |
| Here for an Event | `assets/img/art-chowmahalla.jpg` | `assets/img/art-chowmahalla-color.jpg` | 1614 × 2000 |

Until a colour file exists, its tile behaves exactly as before: no spotlight, and a plain link.

## How to run these

1. Attach the original photo to Gemini and use the matching prompt below. This is an **edit** of the attached image, not a new image.
2. Export at the **exact pixel size** in the table, as JPEG at about quality 82, in sRGB.
3. **Check the alignment:** in any editor, put the colour copy over the original at 50% opacity. There should be no doubled minarets, chandeliers or edges. If there are, regenerate. If Gemini keeps shifting the framing, use a dedicated colourisation tool instead (Palette.fm, or DeOldify), because those keep the geometry exactly.

## Base instruction (start every prompt with this)

> Colourise the attached black-and-white / sepia photograph realistically, as if it had been shot on modern colour film in the same moment. This is a restoration, not a reinterpretation: do not move, add, remove, crop, straighten, sharpen or redraw anything. Every edge, person, building and shadow must stay in exactly the same place, and the output must be the same size and framing as the input. Keep the original grain and softness. Natural, slightly warm daylight colour. No modern objects, text, borders or watermarks.

## Explore Hyderabad: Old City street to the Charminar (1880s)

> [BASE] Palette: the Charminar and its minarets in weathered cream lime plaster with soft grey stone shadows. The Mecca Masjid on the right in warm grey granite. A pale, hazy blue sky fading to warm cream at the horizon. Deep green trees and palms. A dusty ochre and sand-coloured street. Whitewashed shopfronts with faded teal and brown wooden shutters, and terracotta-red roof tiles. The people in white cotton, with touches of saffron, maroon and indigo turbans and shawls. Bullock carts in brown wood. Bright late-morning sun.

## Here for an Event: Drawing room, Chowmahalla Palace (1880s)

> [BASE] Palette: ivory and cream stucco walls and ceiling, with gilded mouldings in soft antique gold. Crystal chandeliers that stay clear and colourless, with warm candle-gold highlights. Heavy drapes in deep crimson and gold brocade, and sheer ivory curtains. A balcony railing in white and gold. Dark polished wood furniture with red and gold upholstery. A rich Persian carpet in madder red and indigo. Warm, soft daylight from the windows, with a gentle amber glow inside.
