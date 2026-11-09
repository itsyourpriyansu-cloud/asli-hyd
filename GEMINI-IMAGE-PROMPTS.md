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

# Section 3: "Two Paths" (Explore Hyderabad / Here for an Event)

**Morning and evening, one shoot.** Left: the Old City at first light, privately. Right: a palace courtyard at blue hour, set for a delegate dinner. Same lens and grade, so the pair reads as one story: *explore by day, celebrate by night.*

At rest each tile shows a warm sepia print; under the pointer a wavy spotlight reveals it **in colour**, and a click floods the whole tile. You only generate the **colour** image. The sepia copy is made from it with one command (below), so the two always line up pixel for pixel.

| Tile | Generate and save as | We derive |
|---|---|---|
| Explore Hyderabad | `assets/img/paths/explore-color.jpg` | `assets/img/paths/explore.jpg` |
| Here for an Event | `assets/img/paths/event-color.jpg` | `assets/img/paths/event.jpg` |

## How to run these

1. **Square 1:1, 2048×2048** (the tile crops from a tall phone frame to a wide desktop one). Export JPEG at about quality 82, sRGB.
2. **Keep the subject in the centre:** inside the middle 70% of the width and 80% of the height.
3. **Keep two zones quiet:** the **top fifth** (the white title sits top-left) and the **lower-right corner, about 40% × 28%** (the description and button card sit there).
4. Use one Gemini chat for both images; once the first is right, attach it to the second and add: *"Match the lens, light quality, colour grade and mood of the attached image."*
5. **Check before use:** the Charminar must have exactly four minarets and one great arch per face, and no scaffolding. Palace architecture must be symmetrical.
6. Make the sepia copy (we do this when wiring the files):
   `ffmpeg -nostdin -i explore-color.jpg -vf "colorchannelmixer=.393:.769:.189:0:.349:.686:.168:0:.272:.534:.131,eq=contrast=1.04:saturation=.85" -q:v 3 explore.jpg`

## Style block (paste in place of `[STYLE]`)

> Editorial luxury travel photograph for a high-end Hyderabad, India, hosting brand, in the spirit of Aman and Condé Nast Traveller photography. Photorealistic, full-frame camera, 35mm lens, natural and practical light only, gentle depth of field. Restrained, rich colour: warm sandstone, ivory lime plaster, aged brass, deep green, soft indigo, with lifted shadows and fine film grain. Calm composition with generous negative space: the top fifth of the frame is clean sky or ceiling, and the lower-right corner is quiet and slightly darker. Square 1:1, 2048×2048. People are seen from behind or in profile at a distance; no recognisable faces.

## Negative line (in place of `[NEGATIVE]`)

> Avoid: text, letters, signage, logos, watermarks, scaffolding, construction, modern vehicles, plastic chairs, crowds, tourists posing, selfie sticks, HDR, oversaturation, harsh midday light, CGI look, distorted or asymmetric architecture, extra minarets, extra fingers.

## Explore Hyderabad: "The Old City, before it wakes"

> [STYLE] The Charminar in Hyderabad at first light, seen straight down a narrow, freshly swept lane of Laad Bazaar. The monument fills the upper-centre of the frame: four slender minarets, each with a small dome, and a great central arch, in weathered cream lime plaster glowing pale gold in low sunrise light, with soft mist around its base. Wooden shopfronts line both sides with shutters half open. On the left, a bangle seller arranges stacks of jewel-toned glass bangles under a warm bulb. In the middle distance a local host in a crisp white kurta walks with two guests in linen toward the monument, all seen from behind, small in the frame. A few pigeons lift off the stones. The lower-right foreground is a shaded shop step in soft shadow. Sky clean pale gold-blue. Quiet, privileged, the city just for you. [NEGATIVE]

## Here for an Event: "The delegate dinner, at a palace"

> [STYLE] The main courtyard of a Nizam-era palace in Hyderabad (in the style of Chowmahalla Palace) at blue hour. A white neoclassical façade with tall arched windows and fine stucco mouldings, lit warm from within, reflected in a long rectangular pool with a quiet fountain. Beside the pool, one long banquet table dressed in ivory linen, set for about twenty-four guests: brass candelabra with lit candles, low runners of marigold and white roses, crystal glassware catching the light. A handful of delegates in evening wear arrive along the pool's edge, seen from behind and in profile, small in the frame; one host in a cream sherwani welcomes them. Deep indigo sky across the top of the frame. The lower-right foreground is calm dark water and stone. Elegant, celebratory, unhurried. [NEGATIVE]
