# Asli Hyderabad: Homepage Wireframe Content

Source: `ASLI HYD WEBSITE WIREFRAME.pdf` (16 pages). This file has every piece of content in that PDF, sorted into the homepage order and in a shape we can build from.

For what is live on aslihyd.in today (content, data models, assets and issues), see [LIVE-SITE-AUDIT.md](LIVE-SITE-AUDIT.md). Section 17 of this file maps each wireframe section to the live data that can feed it.

> **Conventions in this file**
> - `₹____` = price not decided yet. The wireframe leaves every price blank.
> - **[GAP]** = the wireframe names this but gives no content. We need copy or a decision.
> - **[CONFLICT]** = two parts of the PDF disagree. A decision is needed.

---

## 0. Global header element

| Element | Value |
|---|---|
| Top-level CTA (header) | `REQUEST PRIVATE ACCESS →` |

This is the first line of the PDF, above the section list, so it is the persistent header CTA. On the live site that slot is a `Book Now` link.

---

## 1. Homepage section order (master list)

| # | Section | Wireframe detail | Highlighted red in PDF |
|---|---|---|---|
| 01 | **Experience Asli = Real Hyderabad** (hero) | Title only | ● |
| 02 | **Hyderabad, Your Way** | Title only | ● |
| 03 | **Featured Tours** | Full table (13 tours) | |
| 04 | **In Hyderabad for a Convention?** | Title only | |
| 05 | **Asli Hyderabad Originals** | Full detail + visual mockup | |
| 06 | **Featured City Partners** ("Featured Brands of Hyderabad") | Copy + logo list + visual mockup | |
| 07 | **Co-Curated Experiences** ("15 Signature Experiences") | Table of 15 + 2 visual mockups | |
| 08 | **Add-ons & Quick Experiences** | Two full tables | |
| 09 | **Experience Asli — In Pictures** | Title only | |
| 10 | **Private Access** ("Including Film & Studio Access · Documentary & Editorial Access") | Table of 8 | |
| 11 | **Health & Wellbeing** | Title only | |
| 12 | **Plan My Hyderabad** | Title only | |
| 13 | **Trusted with Hyderabad** | Title only | ● |
| 14 | **Your Hyderabad Starts Here — CTA** | Title only | |
| 15 | **Footer** | Title only | |

**About the red sections (01, 02, 13):** all three already exist on the live site: the hero, the six "Hyderabad, Your Way" cards, and the numbers + testimonials blocks. Red most likely means "keep, carried over from the current site". Confirm this with the client.

**[CONFLICT] Section numbering.** The master list puts Add-ons + Quick Experiences together at 08 and "In Pictures" at 09. The detail pages number them `08 | ADD-ONS` and `09 | QUICK EXPERIENCES`. This file follows the master list, with Add-ons and Quick Experiences as two sub-blocks of 08.

---

## 2. Section 01: Hero, "Experience Asli = Real Hyderabad"

- Headline: **Experience Asli = Real Hyderabad**
- No other content in the wireframe.
- The live site uses the same line, split `Experience / Asli = Real / Hyderabad.` with "Asli = Real" in gold italic, plus three CTAs: *Explore Hyderabad* · *Find My Event* · *Plan My Hyderabad*. See the audit file.

## 3. Section 02: Hyderabad, Your Way

- Title only. The live site has the full content: 6 interest themes, each with a tagline and a one-line description (Heritage, Culture, Cinema, Business, Wellness, Learning). See audit §5.2.

---

## 4. Section 03: Featured Tours

13 tours across 7 themes. Format: *Half Day* ≈ 4–5 h and *Full Day* ≈ 8–9 h on the live site.

| Theme | Experience | Format | Core experience |
|---|---|---|---|
| HERITAGE | **Royal Hyderabad** | Half / Full Day | Falaknuma Palace · Chowmahalla Palace · Nizam legacy |
| HERITAGE | **Kingdom of Golconda** | Half Day | Golconda Fort · Qutb Shahi Tombs · diamonds & dynasty |
| HERITAGE | **Old Hyderabad** | Half Day | Charminar · Laad Bazaar · Old City · living heritage |
| CULTURE | **Hyderabad on a Plate** | Half Day | Cuisine · Irani cafés · markets · Deccani flavours |
| CULTURE | **Crafted Hyderabad** | Half Day | Pearls · lac bangles · artisans · bazaars |
| CULTURE | **Village Life** | Half Day | Shilparamam · folk culture · crafts · rural traditions |
| CULTURE | **Pochampally Weaves** | Half / Full Day | Ikat · weaving village · weavers · looms · textile traditions |
| CULTURE | **Statue of Equality** | Half Day | Ramanujacharya · architecture · philosophy · cultural heritage |
| CINEMA | **Inside Ramoji** | Full Day | Film sets · filmmaking · cinema · entertainment |
| BUSINESS | **HITEC Hyderabad** | Half Day | HITEC City · T-Hub · T-Works · startups · innovation |
| LEARNING | **Young Innovators** | Half Day | Technology · making · innovation · entrepreneurship |
| WELLNESS | **Kanha Retreat** | Half / Full Day | Meditation · nature · mindfulness · Heartfulness |
| EVENING | **Hyderabad by Night** | Evening | Hussain Sagar · Buddha Statue · city lights · contemporary Hyderabad |

> That is 13 rows. Heritage has 3, Culture 5, and Cinema, Business, Learning, Wellness and Evening have 1 each.

**Notes**
- **EVENING** is a seventh theme. It is not one of the six "Your Way" themes, so the tour filter tabs need a seventh tab, or Hyderabad by Night has to sit under an existing theme.
- **Statue of Equality** is filed under CULTURE here, but under Heritage on the live site.
- **Young Innovators** does not exist on the live site yet. It needs a full tour page.
- The wireframe renames most live tours to shorter, punchier names. The rename map is in the audit, §6.1.

---

## 5. Section 04: In Hyderabad for a Convention?

- Title only in the wireframe.
- The live site has a full conventions module: 10 events, each with a detail page listing *Before & After* and *During* experiences. The headline and sub-line already exist: "In Hyderabad for a Convention?" / "Find your event. Discover Hyderabad around it." See audit §5.4.

---

## 6. Section 05: Asli Hyderabad Originals

### 6.1 Section header (from the visual mockup)

| Element | Copy |
|---|---|
| Eyebrow | ASLI HYDERABAD ORIGINALS |
| Headline | **Only in Hyderabad. / Only with Asli.** |
| Sub-label | WEEKLY & MONTHLY SIGNATURE EXPERIENCES |
| Link (right) | VIEW ALL ORIGINALS → |
| Alternate intro | "Signature recurring experiences, created and curated by Asli Hyderabad." |
| Alternate intro 2 | "Signature experiences created by Asli Hyderabad. Running on a regular calendar." |

**Mockup layout:** cream background (#f3f1ec-ish), serif headline top-left, gold eyebrow. Four equal-width **tall photo cards** in a row. Each card has a dark gradient at the bottom with an uppercase title, a short gold rule, a gold schedule line, and `EXPLORE →`.

### 6.2 Summary table

| Original | Frequency | Card schedule line | One-liner |
|---|---|---|---|
| Hyderabad at Dawn | Every Sunday | EVERY SUNDAY · 6:30 AM | An early-morning Hyderabad experience ending with an iconic local breakfast |
| Welcome Hyderabad | Every Saturday | EVERY SATURDAY · 11:00 AM | A hosted Telugu table bringing together visitors, newcomers and Hyderabadis |
| Hyderabad After Dark | Select Fridays | SELECT FRIDAYS · 7:00 PM | A curated evening of food, music, social life and contemporary Hyderabad |
| The Hyderabad Table | Monthly | MONTHLY · LIMITED SEATS | A signature hosted table at changing restaurants, heritage spaces and special venues across the city |

**Positioning (from the PDF author):** do **not** add more Originals at launch. These four give Asli a clear recurring rhythm: *Sunday morning, Saturday afternoon, Friday night, and one special table every month*. Each one gives people a different reason to book.

### 6.3 Homepage card copy ("keep this exceptionally short")

```
HYDERABAD AT DAWN
Every Sunday · 3 Hours
Wake up with Hyderabad. Stay for breakfast.
FROM ₹____ · BOOK NOW →

WELCOME HYDERABAD
Every Saturday · 3 Hours
Meet Hyderabad around a Telugu table.
FROM ₹____ · BOOK NOW →

HYDERABAD AFTER DARK
Select Fridays · 3.5 Hours
See where Hyderabad goes after hours.
FROM ₹____ · BOOK NOW →

THE HYDERABAD TABLE
Monthly · Limited Seats
One city. Many tables.
FROM ₹____ · VIEW NEXT TABLE →
```

### 6.4 Detail-page content (one block per Original)

#### 01 · HYDERABAD AT DAWN
- **Tagline:** Wake up with Hyderabad. Stay for breakfast.
- **Schedule:** Every Sunday | 6:30 AM – 9:30 AM | 3 Hours
- **Intro:** Experience Hyderabad before the city wakes up. An intimate early-morning journey through its streets, markets and everyday rituals, ending with an iconic local breakfast.
- **The experience:** Early-morning city walk · Local markets & neighbourhoods · Morning stories · Irani chai · Iconic Hyderabadi breakfast
- **Best for:** Visitors · Families · Photographers · Food lovers · Hyderabadis rediscovering their city
- **Includes:** Asli Hyderabad Host · Curated route · Breakfast · Chai · Local tastings
- **Meeting point:** Shared after booking
- **Price:** From ₹____ per person
- **CTA:** BOOK THIS SUNDAY →

#### 02 · WELCOME HYDERABAD
- **Tagline:** New to Hyderabad? Start here.
- **Schedule:** Every Saturday | 11:00 AM – 2:00 PM | 3 Hours
- **Intro:** A warm introduction to Hyderabad around a beautifully curated Telugu table. Meet fellow visitors and newcomers, discover the city through food and conversation, and leave knowing what to explore next.
- **The experience:** Hosted welcome · Hyderabad introduction · Telugu food experience · City stories · Conversations · Personal recommendations
- **Best for:** First-time visitors · New residents · Business travellers · Conference delegates · Expats · Corporate teams
- **Includes:** Asli Hyderabad Host · Curated Telugu meal · Welcome interaction · Hyderabad recommendations
- **Venue:** Selected Asli Hyderabad partner venue
- **Price:** From ₹____ per person
- **CTA:** BOOK THIS SATURDAY →

#### 03 · HYDERABAD AFTER DARK
- **Tagline:** See where Hyderabad goes after hours.
- **Schedule:** Select Fridays | 7:00 PM – 10:30 PM | 3.5 Hours
- **Intro:** A hosted evening through contemporary Hyderabad: good food, interesting places, music, conversations and the city's changing social scene.
- **The experience:** Curated evening circuit · Food & drinks · Contemporary Hyderabad · Social spaces · Music & nightlife
- **Best for:** Solo travellers · Couples · Young professionals · Business travellers · Conference delegates · New residents
- **Includes:** Asli Hyderabad Host · Curated itinerary · Selected tastings / experiences
- **Meeting point:** Shared after booking
- **Price:** From ₹____ per person
- **CTA:** BOOK THIS FRIDAY →

#### 04 · THE HYDERABAD TABLE
- **Tagline:** One city. Many tables.
- **Schedule:** Monthly | 2–3 Hours | Limited Seats
- **Intro:** A signature Asli Hyderabad dining experience hosted at exceptional restaurants, heritage settings and interesting spaces across the city. Every edition brings together **a place, a menu, a story and interesting people around one table.**
- **The experience:** Changing venue · Curated menu · Hyderabad story/theme · Hosted conversation · Limited-seat gathering
- **Edition examples:** one edition could explore **Deccani cuisine**, another contemporary Telugu food, another the city's Nizam heritage, and another Hyderabad through the eyes of a chef, artist, entrepreneur or cultural voice.
- **Best for:** Food lovers · Visitors · Hyderabadis · Couples · Business travellers · Culture seekers
- **Includes:** Hosted experience · Curated meal · Storytelling / conversation
- **Next table:** Venue · Theme · Date announced for each edition
- **Price:** From ₹____ per person
- **CTA:** BOOK THE NEXT TABLE →

### 6.5 Mockup imagery direction (from the PDF render)
| Card | Image mood |
|---|---|
| Hyderabad at Dawn | Golden sunrise at Charminar, a street vendor cooking in the foreground, warm haze |
| Welcome Hyderabad | People laughing around a candle-lit long table under arched windows |
| Hyderabad After Dark | A group dining on a rooftop at night, city skyline lit up behind |
| The Hyderabad Table | A long, empty, candle-lit banquet table under pendant lamps, moody and rich |

---

## 7. Section 06: Featured City Partners ("Featured Brands of Hyderabad")

### 7.1 Copy

| Element | Copy |
|---|---|
| Headline | **FEATURED BRANDS OF HYDERABAD** |
| Eyebrow (mockup, gold) | THE PEOPLE AND PLACES THAT MAKE HYDERABAD, HYDERABAD. |
| Sub-headline (doc) | Handpicked names that represent the best of Hyderabad. |
| Body (doc) | A select circle of brands chosen by Asli Hyderabad for their **distinctive character, quality and connection to the city**. Together, we create special experiences and help our guests discover Hyderabad at its best. |
| Body (mockup variant) | Asli Hyderabad has handpicked a select circle of brands that share our passion for quality, authenticity and the city. Together, we curate exclusive experiences and welcome our guests to the very best of Hyderabad. |
| Link | EXPLORE ALL FEATURED BRANDS → |
| Footer strip (mockup) | ✱ │ CURATED WITH CARE. EXPERIENCED BY YOU. │ ASLI HYDERABAD |

### 7.2 Logo strip ("then immediately the logo strip")

Each logo tile has: [LOGO] + NAME + a category line in italics.

| # | Brand | Category line |
|---|---|---|
| 1 | TAJ FALAKNUMA PALACE | Heritage Hospitality |
| 2 | ANAGANAGA | Contemporary Telugu Dining |
| 3 | NILOUFER CAFÉ | Heritage Chai & Café |
| 4 | GOYAZ | Fine Jewellery (logo reads "Silver Jewellery") |
| 5 | RAMOJI FILM CITY | Film & Entertainment |
| 6 | HYDERABAD CONVENTION CENTRE | Conventions & Events |
| 7 | PAISTA | Lifestyle & Curated Shopping ("The Modern Bazaar") |
| 8 | CONCU | Wellness Experience ("The Concu Experience") |
| 9 | ESCAPE ESTATES | (appears only in the reels mockup, §8) Countryside & Estate |

**Mockup layout:** cream background with faint line drawings of Charminar and Chowmahalla in the corners and birds top-right. Small gold Charminar icon above a serif all-caps headline, a gold ornament divider, gold eyebrow, centred body. Below: a carousel of 8 square white logo tiles with thin borders and ‹ › arrow buttons, the name in small bold caps under each tile, a short gold rule, then the category. A dark footer band closes the section.

> **[GAP] / legal:** all brand logos and names need **written permission** from each brand before launch. The live site's partner module has only one placeholder entry.

---

## 8. Section 07: Co-Curated Experiences ("15 Signature Experiences")

### 8.1 Copy

| Element | Copy |
|---|---|
| Eyebrow | 15 SIGNATURE EXPERIENCES · HANDPICKED WITH OUR FEATURED PARTNERS (mockup 2: "…FEATURED BRANDS") |
| Headline (doc / mockup 1) | **We have co-curated experiences with our Featured Partners.** |
| Headline (mockup 2, alt) | **Small experiences. Big memories.** |
| Sub-eyebrow | EXPLORE SPECIALLY CURATED EXPERIENCES (mockup 1: "…ITINERARIES.") |
| Body | Fifteen short, immersive experiences crafted with our Featured Brands, made for curious travellers and memorable moments. |
| Body (mockup 2, alt) | Fifteen short, beautifully curated experiences with our Featured Brands. Discover them on reel, book instantly, or add them to your itinerary. |
| Rail label | ASLI SIGNATURE EXPERIENCES |
| Rail sub-label | Watch the reels. Get inspired. Book your experience. |
| Per-card CTA | BOOK EXPERIENCE → |
| Footer note | 📅 Book any experience on its own or add it to your Asli Hyderabad itinerary. │ EXPLORE ITINERARIES → |
| Top-right (mockup 2) | VIEW ALL EXPERIENCES → (pill button) |

### 8.2 All 15 experiences (partner category → experience)

| # | Featured position (partner type) | Signature experience | What guests come for |
|---|---|---|---|
| 1 | Luxury Hospitality | **High Tea, Hyderabad** | An elegant Hyderabad-inspired high tea in one of the city's finest luxury settings |
| 2 | Heritage Hospitality | **An Evening at the Palace** | Palace storytelling, architecture and a beautifully hosted tea or sundowner |
| 3 | Boutique Hospitality | **Inside Hyderabad Design** | A hosted encounter with distinctive architecture, interiors, design and the story behind the space |
| 4 | Iconic Hyderabad Dining | **The Great Hyderabad Tasting** | A tasting flight of Hyderabad's most iconic flavours, designed especially for first-time visitors |
| 5 | Contemporary Telugu Fine Dining | **A Telugu Table** | A beautifully curated introduction to Telugu cuisine through a multi-course tasting |
| 6 | Heritage Chai & Café Culture | **Chai Time, Hyderabad** | Irani chai, Osmania biscuits, café culture and the stories that made Hyderabad's chai legendary |
| 7 | Contemporary Café Culture | **Coffee with Hyderabad** | Signature coffee, something sweet and an easy hosted introduction to contemporary Hyderabad |
| 8 | Private Business & Members' Club | **Coffee with Hyderabad's Insiders** | An intimate conversation with a founder, business leader or ecosystem voice |
| 9 | After-Hours & Social | **Hyderabad Sundowner** | A reserved social evening with a signature drink, bites, music and Hyderabad after hours |
| 10 | Fine Jewellery | **The Hyderabad Pearl Experience** | Discover pearls, understand quality and craftsmanship, see exceptional pieces and try them on |
| 11 | Fashion & Textiles | **Drape the Deccan** | Discover Hyderabad/Deccan textiles and styling, with a personal draping or styling experience |
| 12 | Craft & Living Heritage | **Made in Hyderabad** | Meet a master maker, watch the craft come alive and make or personalise something to take home |
| 13 | Film & Entertainment | **Behind the Screen** | Step inside Hyderabad's film world through sets, production, cinema stories and behind-the-scenes access |
| 14 | Countryside & Estate | **A Day in the Deccan** | Escape the city for an estate experience with nature, food, a guided walk and a slower side of Hyderabad |
| 15 | Wellness | **Reset in Hyderabad** | A restorative session combining meditation, breathwork, yoga or mindfulness in a beautiful setting |

### 8.3 The 7 shown on the homepage rail (short card copy)

| # | Experience | Partner shown on reel | Reel length | Card line |
|---|---|---|---|---|
| 01 | High Tea, Hyderabad | TAJ Falaknuma Palace | 01:06 / 01:05 | Elegant high tea in one of Hyderabad's finest luxury settings. |
| 02 | Chai Time, Hyderabad | NILOUFER Café | 00:48 | Irani chai, Osmania biscuits and the stories of our café culture. |
| 03 | A Telugu Table | ANAGANAGA Telugu Cuisine | 01:10 | A curated tasting menu introducing contemporary (mockup: "modern") Telugu cuisine. |
| 04 | The Hyderabad Pearl Experience | GOYAZ Silver Jewellery | 01:00 / 00:59 | Discover pearls, craftsmanship and stories; learn to buy with confidence. |
| 05 | Behind the Screen | RAMOJI Film City | 01:12 | Step into Hyderabad's film world with exclusive behind-the-scenes access. |
| 06 | A Day in the Deccan | ESCAPE ESTATES Hyderabad | 01:07 | Escape the city for nature, good food and a slower side of Hyderabad. |
| 07 | Reset in Hyderabad | CONCU Wellness | 00:55 | Meditation, breathwork or yoga to restore and rejuvenate. |

### 8.4 Mockup layout (two variants, same structure)
- **Reel rail:** 7 tall **9:16 video cards** with rounded corners, side by side. Each has the partner logo (white) at the top, a round ▶ play button in the centre, the experience name in white serif at bottom-left and the duration at bottom-right. Prev/next circular arrows. Variant 1 has a gold progress bar under the rail.
- **Info row below the rail:** 7 columns separated by hairlines. Each column has a gold line icon (cloche, cup, cloche, diamond, clapperboard, leaf, lotus), a gold serif number `01–07`, a bold uppercase title, a 3-line description, and a gold `BOOK EXPERIENCE →`.
- **Bottom bar:** a calendar icon, the "Book any experience…" line and `EXPLORE ITINERARIES →`, in a light tinted pill.
- Variant 2 is the cleaner of the two: centred headline "Small experiences. Big memories." with an ornament divider, and a "VIEW ALL EXPERIENCES" pill at top-right.

> **[GAP]** Reel videos (7 for the homepage, 15 in total) need to be produced. No reels exist on the live site.

---

## 9. Section 08: Add-ons & Quick Experiences

### 9.1 Add-ons

- **Headline:** 08 | ADD-ONS
- **Sub-headline:** Everything you need to experience Hyderabad, seamlessly.

| Add-on | Duration / Format | CTA |
|---|---|---|
| Personal Chauffeur | 4 Hours / 8 Hours / Full Day | BOOK NOW |
| Private City Host | Half Day / Full Day | BOOK NOW |
| Language Guide / Interpreter | Half Day / Full Day | BOOK NOW |
| Airport Meet & Assist | Arrival / Departure | BOOK NOW |
| Executive Car & Transfers | Airport / Point-to-Point / Full Day | BOOK NOW |
| Personal Shopper | 3–4 Hours | BOOK NOW |
| Personal Photographer | 1 Hour / Half Day | BOOK NOW |
| Custom Hyderabad Itinerary | Half Day / Full Day / Multi-Day | **PLAN NOW** |

**Closing block:**
- **Need something else?**
- Group transport · restaurant reservations · gifting · celebrations · translators · private access · delegate assistance
- **ASK ASLI →**

> All 8 add-ons already exist as pages on the live site (`/services/*`) with full descriptions. See audit §5.6.

### 9.2 Quick Experiences

- **Headline:** QUICK EXPERIENCES
- **Sub-headline:** A little Hyderabad, wherever you are.
- **Body:** Short-format cultural experiences for **hotels, restaurants, conferences, events, corporate gatherings and private celebrations**.

| Quick experience | Duration | CTA |
|---|---|---|
| Cheriyal Mask Making | 45–60 min | BOOK NOW |
| Lac Bangle Making | 30–45 min | BOOK NOW |
| Bidri Art Workshop | 45–60 min | BOOK NOW |
| Pearl Jewellery Making | 30–45 min | BOOK NOW |
| Block Printing | 45–60 min | BOOK NOW |
| Pochampally Ikat Experience | 30–45 min | BOOK NOW |
| Deccani Calligraphy | 30–45 min | BOOK NOW |
| Telangana Folk Performance | 20–30 min | BOOK NOW |
| Perini Dance | 20–30 min | BOOK NOW |
| Oggu Katha | 20–30 min | BOOK NOW |
| Deccan Music / Sufi Evening | 45–60 min | BOOK NOW |
| Hyderabad Pearl Bar | 1–2 Hours | BOOK NOW |
| Hyderabad Bangle Bar | 1–2 Hours | BOOK NOW |
| Deccan Craft Table | 2–3 Hours | BOOK NOW |

That is 14 quick experiences: 7 craft workshops, 4 performances, and 3 "bar/table" activations sized for events.

**Card format ("keep them even simpler"):**
```
LAC BANGLE MAKING
30–45 MIN · FROM ₹____
BOOK NOW →
```

> **[GAP]** None of these exist on the live site. Each needs a short description, an image and a price. They are bookable *at a venue* (hotel, event), not as a tour, so the booking form needs venue, date, headcount and event type.

---

## 10. Section 09: Experience Asli — In Pictures

- **[GAP]** Title only. The live `/gallery` page exists but has just 5 unique photos on repeat. The audit's photo inventory (§8) lists ~60 usable images from across the site, including real guest/delegate group photos that suit this section well.

---

## 11. Section 10: Private Access

- **Headline:** PRIVATE ACCESS
- **Sub-line (master list):** Including Film & Studio Access · Documentary & Editorial Access
- **Sub-headline:** Rare encounters. Remarkable people. Hyderabad, behind closed doors.

| # | Private experience | Experience |
|---|---|---|
| 01 | **Badminton with Pullela Gopichand** | A private play session and interaction with one of India's most celebrated badminton coaches |
| 02 | **Inside Vinita Pittie's Haveli** | A private visit into the designer's world of heritage, textiles, interiors, art and Deccani aesthetics |
| 03 | **Meet Thota Vaikuntam** | An intimate interaction with the celebrated artist and the stories behind his iconic Telangana-inspired works |
| 04 | **Meet Tollywood** | A private interaction with a leading actor, director, producer or filmmaker from Telugu cinema |
| 05 | **Inside Future City** | A privately curated look at Hyderabad's ambitious next-generation city, its vision, planning and development |
| 06 | **Inside Genome Valley** | A specialist-led journey into Hyderabad's globally significant pharma, biotech and life-sciences ecosystem |
| 07 | **Meet Hyderabad's Founders** | Private conversations with entrepreneurs and business leaders building some of Hyderabad's most interesting companies |
| 08 | **Coffee with an Insider** | One-to-one conversation with a carefully matched Hyderabad expert, from innovation and business to culture, design, food or the city itself |

**Disclaimer block:**
- **BY REQUEST ONLY**
- *Every Private Access experience is individually curated and subject to host availability, permissions and confirmation.*
- **REQUEST ACCESS →**

**Notes**
- **[GAP]** "Film & Studio Access" and "Documentary & Editorial Access" appear only in the sub-line. They have no rows or copy. They may be two extra cards (for production crews, journalists and documentary teams); confirm.
- **[GAP] / legal:** named people (Gopichand, Vinita Pittie, Thota Vaikuntam) need **written consent** before their names or likeness appear on the site.
- No price. This is enquiry-only. It lines up with the header CTA "Request Private Access →" and with "Request Private Access" on the live theme pages (which currently just go to `/contact`).

---

## 12. Section 11: Health & Wellbeing

- **[GAP]** Title only. Content we already have to draw on:
  - Featured tour: **Kanha Retreat** (Heartfulness, meditation)
  - Signature experience: **Reset in Hyderabad** (Concu Wellness)
  - Live theme page `/experiences/wellness` (intro copy, "Hyderabad, at a slower pace")
  - Convention pages list "Medical Assistance" and "Wellness" as request types, which suggests a **medical/wellness travel** angle. Confirm scope with the client: wellness experiences only, or medical-travel assistance as well?

## 13. Section 12: Plan My Hyderabad

- **[GAP]** Title only. "Plan My Hyderabad" is already a hero CTA on the live site (→ `/book-now`). Building blocks we have: the Custom Hyderabad Itinerary service (Half / Full / Multi-Day), the booking form fields, and the conventions' "Need something else?" request categories. The likely shape is an itinerary-builder or enquiry form section.

## 14. Section 13: Trusted with Hyderabad

- **[GAP]** Title only, marked red, so it carries over. The live site has both pieces:
  - **"Asli Hyderabad in Numbers"**: 7 counters (45+ conferences, 30+ partners, 275+ experiences, 15+ hotels, 35+ corporate clients, 20+ tour leaders, 55+ cities & countries)
  - **Testimonials**: Zev Siegl (Starbucks co-founder), Nick Ut, Barbara Davidson (both Pulitzer winners) and Isabelle Duceller (CEO, BioGaia)
  - Full copy is in audit §5.1.

## 15. Section 14: Your Hyderabad Starts Here (CTA)

- **[GAP]** Title only. It is a closing call-to-action band. Contact details to use: +91 93921 49872 · WhatsApp · sahana@aslihyd.in.

## 16. Section 15: Footer

- **[GAP]** Title only. The live footer content is in audit §5.1.

---

## 17. Wireframe ↔ live data mapping (build readiness)

| # | Section | Data on live site | Readiness |
|---|---|---|---|
| 01 | Hero | Headline, 3 CTAs, banner image | ✅ ready |
| 02 | Hyderabad, Your Way | 6 themes with images + theme pages | ✅ ready |
| 03 | Featured Tours | 14 live tours (12 match, by a renamed title); Young Innovators missing; 2 live-only tours (Spiritual Circuit, Sacred Journey) | 🟡 rename + 1 new tour + decide on the 2 extras |
| 04 | Conventions | 10 events; 6 upcoming, 4 already past | 🟡 show upcoming only |
| 05 | Originals | Only "Welcome Hyderabad" exists (thin copy) | 🔴 3 new + full copy from §6 |
| 06 | City Partners / Brands | 1 placeholder ("TELUGU EXPERIECE / XYZ") | 🔴 needs 8–9 brands, logos, permission |
| 07 | Co-curated experiences | none | 🔴 15 new entries + 7 reels |
| 08a | Add-ons | 8 services with full copy + images | ✅ ready (add duration options) |
| 08b | Quick Experiences | none | 🔴 14 new entries |
| 09 | In Pictures | 5 gallery photos + ~60 site photos | 🟡 curate |
| 10 | Private Access | none | 🔴 8 new entries + consents |
| 11 | Health & Wellbeing | Kanha tour + wellness theme copy | 🟡 copy needed |
| 12 | Plan My Hyderabad | book-now form + custom itinerary service | 🟡 design the flow |
| 13 | Trusted with Hyderabad | numbers + 4 testimonials | ✅ ready |
| 14 | CTA | contact details | 🟡 copy needed |
| 15 | Footer | live footer | ✅ ready (clean up) |

---

## 18. New content types the wireframe introduces

The live CMS (see audit §4) has Tours, Themes, Conventions, Originals, Partners, Services, Testimonials and Gallery. The wireframe needs these additions:

| New / extended model | Fields the wireframe implies |
|---|---|
| **Original** *(extend)* | frequency, day, start–end time, duration, tagline, intro, experience[], best_for[], includes[], meeting_point / venue, price_from, CTA label ("Book this Sunday"), next_edition {venue, theme, date} for The Hyderabad Table |
| **Signature Experience** *(new)* | number, title, partner (→ Partner), partner category, short line, long line, icon, reel video + duration, poster image, price, CTA |
| **Partner / Featured Brand** *(extend)* | name, category line, logo (mono + colour), linked signature experience |
| **Quick Experience** *(new)* | title, duration range, price_from, type (workshop / performance / bar), image, short description, suitable venues |
| **Private Access** *(new)* | number, title, person/host, description, category (sport / design / art / cinema / business / film & studio / documentary & editorial), consent status, request-only flag |
| **Add-on / Service** *(extend)* | duration options[] (e.g. 4h / 8h / Full Day), CTA label (BOOK NOW / PLAN NOW) |
| **Tour** *(extend)* | short display name, theme incl. *Evening*, format label (Half / Full / Evening), wireframe "core experience" line |
| **Enquiry types** | Private Access request, Quick Experience venue booking, Plan My Hyderabad itinerary request |

---

## 19. Open questions for the client

1. Does **red** in the wireframe mean "keep from the current site"? (§1)
2. Section numbering: is "In Pictures" 09, with Quick Experiences inside 08? (§1)
3. Do we use the **wireframe tour names** (Royal Hyderabad, Kingdom of Golconda…) everywhere, including URLs? (§4)
4. What happens to the live-only **Spiritual Circuit** and **Sacred Journey** tours? (§4)
5. Should **Evening** be a 7th filter theme? (§4)
6. Which Originals headline should we use, and which co-curated headline: "We have co-curated…" or "Small experiences. Big memories."? (§6, §8)
7. **Pricing:** every `₹____`. Are we showing prices at launch or keeping "On request" like the live site?
8. **Permissions:** written OK from the 9 brands and 3 named individuals? (§7, §11)
9. Do the **reels** (7 videos, 9:16, ~1 min each) exist, or do they need to be shot?
10. Are Film & Studio Access and Documentary & Editorial Access separate cards? (§11)
11. Health & Wellbeing: experiences only, or **medical travel assistance** too? (§12)
