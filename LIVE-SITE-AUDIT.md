# aslihyd.in: Live Site Audit

Crawled on **16 Oct 2026**: all 63 public pages (the home page, 7 listing pages, 6 theme pages, 14 tours + 14 booking forms, 10 conventions, 8 services, 1 original, 1 partner, contact, book-now, gallery). Login and admin pages were not crawled.

This file records what exists today: brand, design tokens, sitemap, content models, the full content of every page, the image inventory and the problems found. For the redesign brief from the PDF, see [WIREFRAME-CONTENT.md](WIREFRAME-CONTENT.md).

---

## 1. Brand

### 1.1 Identity

| Item | Value |
|---|---|
| Brand name | **Asli Hyderabad** (short: Asli Hyd · "Asli" = real/authentic) |
| Descriptor in logo | VISITOR EXPERIENCES |
| Page title pattern | `<Page> \| Asli Hyderabad`; home is `Asli Hyderabad \| Local Experiences` |
| Core line | **Experience Asli = Real Hyderabad.** |
| Footer brand line | Curated destination experiences, conference programmes and authentic local stories that bring Hyderabad to life. |
| Phone / WhatsApp | +91 93921 49872 (`https://wa.me/919392149872`) |
| Email | sahana@aslihyd.in ("For experiences and partnerships") |
| Location | Hyderabad, Telangana, India |
| Social links | **none on the site** |

### 1.2 Logo files (now in `assets/brand/`)

| File | Size | Notes |
|---|---|---|
| `asli-logo.png` | 200×60, RGBA | **Original** from `aslihyd.in/images/asli_logo.png`. It is the only logo file on the server. |
| `asli-logo-trimmed.png` | 178×60 | Same file with the transparent side padding cropped |
| `asli-logo-white.png` | 178×60 | Solid white version for dark heroes and the footer |
| `asli-logo-ink.png` | 178×60 | Solid ink (#171614) version |
| `favicon.ico` | 16 + 32 px | From `/favicon.ico` |
| `favicon.png` | 512×512 | From `/favicon.png` |
| `apple-touch-icon.png` | 180×180 | From `/apple-touch-icon.png` |
| `whatsapp.svg` | vector | WhatsApp glyph used in the header |

**Logo anatomy:** "Asli" in a black brush script on top. **HYDERABAD** below it in heavy condensed block caps, with each letter a different colour. **VISITOR EXPERIENCES** in small grey spaced caps underneath.

**Wordmark letter colours** (sampled from the PNG):

| H | Y | D | E | R | A | B | A | D |
|---|---|---|---|---|---|---|---|---|
| `#FFDE00` yellow | `#F48220` orange | `#EC1C24` red | `#8F0970` plum | `#0063A4` blue | `#05B49C` teal / `#369BD5` sky | `#00A651` green | `#8BC53F` lime | (repeat) |

> ⚠️ **We need a vector logo from the client.** The only logo on the server is a 200×60 PNG, so it will look soft on retina screens at the current 188 px header width (it needs at least 400 px wide, ideally SVG). Ask the client for the original SVG, AI or PDF. Until then, use `asli-logo.png` at **≤ 200 px wide**.
>
> ⚠️ **The favicon doesn't match the logo.** It shows an orange triangle with a cream arch on a teal/navy rounded square, and nothing in it relates to the rainbow wordmark. It looks like a placeholder. A redesign should get a proper icon, such as the "A" from the script or a rainbow "H".
>
> ⚠️ The live header turns the logo white on the hero with `filter: brightness(0) invert(1)`, which **removes the rainbow**. That is the one place the brand colour should show. Better: a dark-ink header bar, or the full-colour logo on a small light chip.

### 1.3 Design tokens in use

The live CSS is hand-written, with no framework. These are the tokens declared on `:root` (with the number of pages each appears on):

| Token | Value | Role |
|---|---|---|
| `--ink` / `--asli-ink` | `#171614` | Text, dark backgrounds |
| `--paper` | `#f7f2ea` | Warm cream sections |
| `--gold` / `--asli-gold` | `#c59a5b` | Accent: eyebrows, button borders, italic hero words |
| (eyebrow gold) | `#a97835` | Darker gold for small text |
| (hover gold) | `#d8b77d` / `#b98742` | Button hover states |
| `--green` / `--asli-green` | `#1d4e44` (also `#143a33`, `#173f38`) | Deep emerald for dark buttons and partner names |
| `--muted` | `#6d675f` / `#6f6a62` | Secondary text |
| `--line` | `#ded4c4` | Hairlines |
| `--gallery-bg` | `#11100f` | Gallery page background |
| Off-white | `#fbf8f2`, `#f7ead7` | Cards, text on dark |

**Type:**

| Role | Font | Notes |
|---|---|---|
| Display / headings | **Cormorant Garamond** 300 / 400 / 300 italic | Hero `clamp(68px, 6vw, 126px) / 1.1` |
| Body / UI | **Manrope** 500 / 600 / 700 / 800 | Body 15 px / 1.7 |
| Buttons | Manrope 600, 10 px, uppercase, `0.11em` tracking | 1px gold border, 3px radius, `→` appended |
| Eyebrows | Manrope 500, 11 px, uppercase, `0.18em` tracking, colour `#a97835` | |

The look is "quiet luxury": black and cream with gold hairlines and a light serif. **The rainbow logo is never echoed anywhere in the UI.** The redesign has to decide whether to keep the gold/emerald/cream system and treat the logo as the one burst of colour, or bring the logo colours in as accents (for example, one colour per theme).

> The local project (`css/base.css`) already self-hosts **Cormorant Garamond**, the same serif as the live site, with **Jost** as the sans. Manrope is the live site's sans.

### 1.4 Tech stack observed

- Server-rendered HTML with forms carrying a `_token` CSRF field. Together with the "Admin > Conventions" message that leaks onto public pages, this points to **Laravel** with a custom admin CMS.
- No JS framework. Small inline scripts handle the counters, tour tabs, testimonial carousel and gallery lightbox.
- Google Fonts loaded from the CDN with `display=block`.
- Images: `/images/*` (static) and `/uploads/<uuid>.<ext>` (CMS uploads). No responsive `srcset`; several hero images are over 1 MB.

---

## 2. Sitemap (live)

```
/                                   Home
├── /tours                          All tours (14)
│   └── /tours/{slug}               Tour detail (tabs: About · Highlights · What's included · Good to know)
│       └── /tours/{slug}/book      Booking request form
├── /experiences/{theme}            6 theme pages: heritage · culture · cinema · business · wellness · learning
├── /conventions                    All conventions (10)
│   └── /conventions/{slug}         Convention hub (Before & After / During / More of Hyderabad / Need something else)
├── /originals                      Asli Originals (1)
│   └── /originals/{slug}
├── /partners                       Featured City Partners (1, placeholder)  ← not in the nav
│   └── /partners/{slug}
├── /services                       Add-ons & Services (8)
│   └── /services/{slug}
├── /gallery                        Photo wall (5 images on repeat)
├── /contact                        Contact + enquiry form
├── /book-now                       General booking request (tour dropdown)
├── /login                          Partner / admin login  ← linked publicly in the footer as "Admin"
└── external: wa.me/919392149872, tel:, mailto:
```

**Header nav:** Home · Tours · Conventions · Originals · Services · Gallery · Contact · **Book Now** · [WhatsApp icon]
**Footer:** brand block · *Explore / Discover Hyderabad* (Tours, Asli Originals, Gallery, Contact us) · *Plan / Experience hub* (Conventions, Add-ons & Services, Book an experience, Partner login) · *Contact / Plan something memorable* (phone, email) · © 2026 Asli Hyderabad · Contact · Admin

No `sitemap.xml` (404). `robots.txt` allows everything.

---

## 3. Home page (live), section by section

| # | Section | Content |
|---|---|---|
| 1 | **Hero** | Full-bleed `banner_new.jpeg` (a figure under a Golconda-style arch at golden hour) with a left-to-right dark gradient. H1: `Experience / *Asli = Real* / Hyderabad.` (middle line gold italic). CTAs: **Explore Hyderabad** → /tours · **Find My Event** → /conventions · **Plan My Hyderabad** → /book-now. Thin gold scroll line at the bottom centre. |
| 2 | **Hyderabad, Your Way** | Eyebrow "Explore by Interest". Sub-line: "Six ways to discover the city. Choose what draws you in. Go deeper into the Hyderabad that interests you most." Six numbered image cards → /experiences/{theme} (copy in §5.2). |
| 3 | **Featured Tours** | Eyebrow "Curated City Experiences". Sub-line: "A selected set of hosted routes through heritage, culture, business, cinema, wellness and learning." Six filter tabs (Heritage ▥, Culture ✤, Cinema ▣, Business ▤, Wellness ✧, Learning ▯) and 12 numbered cards, each showing "Private · Small Group · Group". **The Wellness tab is empty** because Kanha Retreat isn't featured or tagged. |
| 4 | **Conventions** | Eyebrow "Conventions in Hyderabad". H2 "In Hyderabad for a Convention?" Sub-line: "Find your event. Discover Hyderabad around it." 4 cards: **all four are past events** (Jan to Apr 2026). Link: "All conventions". |
| 5 | **Asli Hyderabad in Numbers** | 45+ Conferences & Events Supported · 30+ Experience Partners & Local Businesses · 275+ Curated Destination Experiences Delivered · 15+ Hotels & Hospitality Partners · 35+ Corporate & Institutional Clients · 20+ Licensed Tour Leaders & Local Experts · 55+ Cities & Countries Represented. These are JS count-ups and show as **0+** until the script runs. |
| 6 | **Asli Hyderabad Originals** | Eyebrow "Only in Hyderabad". Sub-line: "Signature experiences created and co-curated by Asli Hyderabad. Distinctive ways to meet the people, places and stories that make the city truly its own." One card: Welcome Hyderabad ("Social experience"). |
| 7 | **Featured City Partners** | One card: "TELUGU EXPERIECE" / "XYZ" with a "The Culinary Lounge" logo. **This is placeholder content and it is live.** |
| 8 | **Testimonials** | Eyebrow "Guest Reflections". Sub-line: "Personal notes from travellers, hosts and delegates who experienced Hyderabad through Asli Hyderabad." 4-quote carousel (§5.1). |
| 9 | **Footer** | See §2. |

---

## 4. Content models (inferred from the CMS output)

These are the data structures the current admin produces. The redesign templates should bind to them. For the new types the wireframe needs, see WIREFRAME-CONTENT.md §18.

```yaml
Tour:
  slug, title
  tagline_line        # "History & Heritage" / "Culture · Cuisine · Food"
  summary             # one-line card text (often a generic fallback, see §9)
  card_image, hero_image
  categories[]        # heritage | culture | cinema | business | wellness | learning
  featured: bool, order
  about: rich text    # tab 1
  highlights[]        # tab 2
  included[]          # tab 3
  good_to_know[]      # tab 4
  price_from          # every tour currently says "On request"
  price_unit          # "per person - final availability confirmed by our team"
  format              # always "Private · Small Group · Group"
  duration            # "4–5 Hours" | "8–9 Hours"
  available           # "On Request"
  time                # "On Request" | "5:00 AM" | "Late Afternoon / Evening"
  min_guests          # 1 | 2

Theme (/experiences/{slug}):
  slug, name, tagline  # "Heritage" + "Walk through centuries."
  short_description, card_image
  intro_heading, intro_body
  gallery[] {image, caption}   # empty for business, wellness and learning
  CTAs: View Asli Experiences → /tours · Customise an Experience → /contact · Request Private Access → /contact

Convention:
  slug, title, date_range, venue, card_image
  description          # includes a "not the organiser" disclaimer on newer entries
  before_after: {available_label, tours[] (with per-event time override)}
  during:       {available_label, tours[]}
  more_of_hyderabad    # fixed: Tours / Experiences(→/services) / Asli Originals
  need_something_else  # fixed chips: Accommodation · Airport & Transport · Medical Assistance · Wellness · Private & Group · Other Requests → /contact

Original:  slug, title, type_label ("Social experience"), image, about (rich text)
Partner:   slug, name, category_label, logo, short, about
Service:   slug, title, tagline_line, image, about (rich text)
Testimonial: name, photo, role_line_1, role_line_2, quote
GalleryImage: image, title
Counter:   value, label

BookingRequest (/book-now, /tours/{slug}/book):
  content_item_id (tour), guest_name*, email*, phone*, guests* (1–5, 6+), preferred_date*, notes
Enquiry (/contact):
  name*, email*, phone, message*      # "We usually reply … within one working day."
```

---

## 5. Full page content

### 5.1 Shared: testimonials and footer

**Testimonials**

| Name | Role | Quote |
|---|---|---|
| **Zev Siegl** | Co-founder, Starbucks Coffee Company · Entrepreneur, Educator & Global Business Leader | My visit to Hyderabad became much more meaningful because of the thoughtfully curated experiences by Asli Hyderabad. Rather than simply showing the city, the team helped me understand its history, culture and people in an authentic and seamless way. It's an impressive model that has the potential to enhance how business travellers and conference delegates experience Indian cities. |
| **Nick Ut** | Pulitzer Prize-winning Photojournalist · Renowned for his coverage of the Vietnam War | I experienced Asli Hyderabad's services during my visit to the Hyderabad Photography Festival. The team was professional, thoughtful and highly responsive, taking excellent care of every aspect of my visit. Their local knowledge, attention to detail and warm hospitality made my experience in Hyderabad truly enjoyable. |
| **Barbara Davidson** | Pulitzer Prize-winning Photojournalist & Documentary Photographer | During my visit to Hyderabad, Asli Hyderabad made every part of the experience seamless and memorable. From thoughtful planning to flawless coordination, the team demonstrated genuine hospitality, professionalism and a deep understanding of the city's culture. It allowed me to focus on my work while experiencing the true spirit of Hyderabad. |
| **Isabelle Duceller** | Chief Executive Officer, BioGaia, Sweden | During my visit to Hyderabad, I experienced Asli Hyderabad's thoughtful and professional hospitality. The team understood my requirements, coordinated every detail seamlessly and introduced me to the city with genuine warmth and local insight. Their support made my time in Hyderabad both effortless and memorable. |

**Footer copy:** "Curated destination experiences, conference programmes and authentic local stories that bring Hyderabad to life." · Column heads: *Explore — Discover Hyderabad* · *Plan — Experience hub* · *Contact — Plan something memorable* · "+91 93921 49872 — Speak to the Asli team" · "sahana@aslihyd.in — For experiences and partnerships" · "© 2026 Asli Hyderabad. All rights reserved."

### 5.2 Themes ("Hyderabad, Your Way" + `/experiences/{theme}`)

| # | Theme | Card tagline | Card line | Page intro heading | Gallery |
|---|---|---|---|---|---|
| 01 | **Heritage** | Walk through centuries. | Forts, palaces, old quarters and stories that shaped Hyderabad. | Hyderabad, Through The Centuries. | Golconda Fort · Qutb Shahi Tombs · Chowmahalla Palace · Salar Jung Museum |
| 02 | **Culture** | Taste. Make. Celebrate. | Food, crafts, bazaars and traditions that make Hyderabad unmistakably its own. | Hyderabad, Lived Every Day. | Hyderabadi Biryani · Pearl · Perini Dance · Pochampally Weaving |
| 03 | **Cinema** | Step behind the screen. | Studios, sets, filmmaking and the world of Telugu cinema. | Hyderabad, Behind The Screen. | Ramoji Film City · Bahubali set · Film School · Stunt Show |
| 04 | **Business** | Meet the city that builds. | Innovation, enterprise, industry and institutions shaping modern Hyderabad. | Hyderabad, Built For What's Next. | *(empty)* |
| 05 | **Wellness** | Slow down. Restore. | Wellness, nature, movement and restorative ways to experience the city. | Hyderabad, At A Slower Pace. | *(empty)* |
| 06 | **Learning** | See. Meet. Understand. | Curated learning journeys through Hyderabad's institutions, industries and ideas. | Hyderabad, For The Curious. | *(empty)* |

**Theme intro paragraphs (verbatim):**

- **Heritage:** Hyderabad carries more than four centuries of history, built upon the older world of Golconda. Shaped by the Qutb Shahis and later the Asaf Jahi Nizams, the city grew through global trade, extraordinary architecture, royal patronage and a remarkable confluence of cultures. Its heritage lives beyond its monuments - in palaces, old neighbourhoods, bazaars, places of faith, collections, cuisine and everyday traditions. From Golconda and the Qutb Shahi Tombs to Charminar and the palaces of the Nizams, Hyderabad is a city where history is not simply preserved; it is still lived.
- **Culture:** Hyderabad's culture is found as much around a table or inside a bustling bazaar as it is in its celebrated traditions. Centuries of Deccani, Telugu, Persian and other influences have shaped a distinctive way of life — expressed through food, language, textiles, jewellery, craft, music, festivals and hospitality. From biryani, Irani chai and traditional Telugu flavours to bangles, pearls, handloom, intricate craft and vibrant markets, this is a city best understood through its people, makers and everyday rituals.
- **Cinema:** Hyderabad is one of India's great centres of cinema — home to the Telugu film industry, major studios, production houses and generations of celebrated filmmakers, actors and technicians. From expansive film sets and sound stages to post-production, visual effects, costume, music and the craft behind filmmaking, the city offers a fascinating look at how stories move from imagination to screen. Cinema here is more than entertainment; it is an industry, a culture and an important part of Hyderabad's contemporary identity.
- **Business:** Hyderabad has evolved into one of India's leading centres for technology, life sciences, pharmaceuticals, startups, aerospace and global business. Home to major international companies, research institutions, innovation ecosystems and a new generation of entrepreneurs, the city brings together enterprise, talent and technology at remarkable scale. From global capability centres and Genome Valley to T-Hub and emerging innovation districts, Hyderabad offers business visitors a window into the industries, institutions and ideas shaping its next chapter.
- **Wellness:** Beyond its energy and urban rhythm, Hyderabad offers many ways to pause, restore and reconnect. The city brings together yoga, meditation, traditional wellness practices, contemporary wellbeing, nature and restorative spaces — from quiet mornings and lakeside landscapes to specialised wellness centres and retreats beyond the city. Whether it is a few restorative hours between meetings or a more immersive wellbeing experience, Hyderabad offers a gentler way to experience the city.
- **Learning:** Hyderabad is home to some of India's leading institutions, research centres, universities, laboratories and centres of excellence. Its strengths span science, technology, life sciences, agriculture, design, entrepreneurship, heritage and the creative industries — making the city a rich environment for learning beyond the classroom. From institutional visits and industry exposure to expert interactions and hands-on experiences, Hyderabad offers students, educators and professional groups an opportunity to see knowledge, research and innovation in action.

### 5.3 Tours (14)

Every tour shows: Format **Private · Small Group · Group** · Price **On request** · Available **On Request**.

| # | Live title | Slug | Tagline line | Home categories | Duration | Time | Min | Card image |
|---|---|---|---|---|---|---|---|---|
| 1 | The Royal Hyderabad Heritage Trail | `the-royal-hyderabad-heritage-trail` | History & Heritage | heritage | 4–5 h | On request | 1 | `tour-royal-heritage-trail.jpg` |
| 2 | The Nizam's Legacy - A Journey Through 425 Years | `the-nizams-legacy-a-journey-through-425-years` | History & Heritage | heritage | 8–9 h | On request | 1 | `tour-nizams-legacy-golconda.jpg` |
| 3 | Hyderabad Through It's Crafts | `hyderabad-through-its-crafts` | Culture · Crafts · Bazaars · Artisan's | culture | 4–5 h | Late Afternoon / Evening | 1 | `tour-crafts.jpg` |
| 4 | The Hyderabad Spiritual Circuit | `the-hyderabad-spiritual-circuit` | Spirituality · Culture | culture | 4–5 h | 5:00 AM | 1 | `tour-spiritual-circuit.jpg` |
| 5 | The Hyderabad Sacred Journey | `the-hyderabad-sacred-journey` | Spirituality · Culture | culture | 8–9 h | 5:00 AM | 1 | `tour-sacred-journey.jpg` |
| 6 | The Ramoji Film City Experience | `the-ramoji-film-city-experience` | Film · Entertainment · Cinema | cinema | 8–9 h | On request | 1 | `tour-ramoji.jpg` |
| 7 | Old Hyderabad | `old-hyderabad` | Living Heritage · Historic Markets · Culture & Traditions | heritage, culture | 4–5 h | On request | 1 | `tour-old-hyderabad.jpg` |
| 8 | Hyderabad Food Trail | `hyderabad-food-trail` | Culture · Cuisine · Food | culture | 4–5 h | On request | 1 | `tour-food-trail.jpg` |
| 9 | Village Life | `village-life` | Folk Culture · Traditional Crafts · Rural Heritage | heritage, culture | 4–5 h | On request | 2 | `tour-village-life.jpeg` |
| 10 | The Pochampally Weaving & Artisan Journey | `the-pochampally-weaving-artisan-journey` | Culture · Craft · Weaving · Artisans | culture | 8–9 h | On request | 1 | `tour-pochampally.jpeg` |
| 11 | Statue of Equality | `statue-of-equality` | Philosophy · Monumental Architecture · Spiritual & Cultural Heritage | heritage | 4–5 h | On request | 2 | `tour-statue-of-equality.jpg` |
| 12 | The Modern Hyderabad Innovation Circuit | `the-modern-hyderabad-innovation-circuit` | Business · Innovation · Entrepreneurship | culture, business, learning | 8–9 h | On request | 1 | `tour-innovation-circuit.jpeg` |
| 13 | Kanha Retreat | `kanha-retreat` | Meditation · Nature · Mindfulness · Heartfulness | *(not featured)* | 4–5 h | On request | 2 | `tour-kanha-retreat.jpeg` |
| 14 | Hyderabad by Night | `hyderabad-by-night` | Hussain Sagar · Buddha Statue · City Lights · Contemporary Hyderabad | *(not featured)* | 4–5 h | On request | 2 | `tour-hyderabad-by-night.jpeg` |

#### Tour details: highlights and inclusions

**1 · The Royal Hyderabad Heritage Trail.** *Step into the Hyderabad shaped by royal patronage, architecture, trade and cultural exchange. Journey through Chowmahalla Palace, Charminar, Mecca Masjid and Badshahi Ashurkhana, walk through the historic lanes of Laad Bazaar and experience traditional Hyderabadi tea along the way.*
- Highlights: Chowmahalla Palace · Mecca Masjid · Badshahi Ashurkhana · Traditional Hyderabadi Tea Experience
- Included: Expert destination host & heritage storytelling · Premium AC transport · Attraction entry tickets · Traditional refreshments & bottled water
- Good to know: moderate walking, steps and uneven surfaces · comfortable footwear, modest dress · photography/security restrictions · pickup and drop within city limits · itinerary/pricing may vary

**2 · The Nizam's Legacy, A Journey Through 425 Years.** *Explore Golconda Fort and the Qutb Shahi Tombs through stories of royalty, architecture and diamonds.*
- About: Step into the world of the Qutb Shahi rulers on a journey through the historic Kingdom of Golconda. Explore the commanding Golconda Fort, renowned for its ingenious acoustics, defensive architecture, royal chambers and sweeping views across Hyderabad. Continue to the Qutb Shahi Tombs, where domes, arches and landscaped surroundings preserve the legacy of the dynasty that shaped the region's culture and architecture. Along the way, discover stories of royal intrigue, flourishing trade and the legendary diamonds that made Golconda famous across the world.
- Highlights: Golconda Fort · Qutb Shahi Tombs · Chowmahalla Palace · Charminar · Salar Jung Museum · **Royal Hi-Tea at Taj Falaknuma**
- Included: Expert host & heritage storytelling · Premium AC transport · Entry tickets · Refreshments & water · Royal Hi-Tea at Taj Falaknuma (subject to availability and package)
- ⚠️ The title says "Nizam", but the About text describes the *Qutb Shahi* era, and the highlights mix both eras. The wireframe splits this into "Kingdom of Golconda" and "Royal Hyderabad".

**3 · Hyderabad Through It's Crafts.** *Explore the living craft traditions of Hyderabad through Charminar, Laad Bazaar and its historic lanes, with curated encounters around lac bangles, ~~earls~~ pearls, attar and traditional handicrafts.*
- Highlights: Laad Bazaar Heritage Walk · Lac Bangle Discovery · Traditional Pearl Experience · Attar Discovery · Local Artisan Interactions
- Included: Host & storytelling · Premium transport & guided heritage walk · Pearl & attar experiences · Dedicated shopping time · Water
- Good to know: personal purchases not included; artisan interactions subject to availability

**4 · The Hyderabad Spiritual Circuit.** *Experience a quieter, more contemplative side of Hyderabad, a city where faith, architecture and everyday life have evolved together for centuries…*
- Highlights: Birla Mandir · Jagannath Temple · TTD Temple · Spiritual & Cultural Interpretation · Personal Prayer & Reflection · Traditional Lunch
- Included: Host & spiritual-cultural storytelling · Premium AC transport · Coordinated temple visits · Traditional lunch/refreshments · Time for prayer · Water

**5 · The Hyderabad Sacred Journey** (full-day version of #4). *Discover a more contemplative Hyderabad, where sacred traditions, timeless architecture and moments of stillness exist alongside the rhythm of the modern city…*
- Highlights: Birla Mandir · TTD Temple · Jagannath Temple · ISKCON Temple · Traditional Vegetarian Lunch & Prasadam · Buddha Statue Boat Ride & Hussain Sagar
- Included: Host · Premium AC transport · Guided sacred-site visits · Veg lunch & prasadam · Hussain Sagar boat ride · Time for prayer, reflection, meditation · Water

**6 · The Ramoji Film City Experience.** *Step behind the screen and into the world of Indian cinema. Spend a day exploring Ramoji Film City through its iconic sets, expansive backlots, themed gardens and immersive attractions…*
- Highlights: Guided Studio Tour · Iconic Film Sets & Backlot · Baahubali Movie Set · Live Entertainment & Stunt Shows · Movie Magic Experiences · Butterfly & Bird Parks · Themed Gardens & Landscapes
- Included: Host & cinema orientation · Premium AC transport · RFC entry tickets as per package · Guided assistance · Curated lunch where included · Water

**7 · Old Hyderabad.** *Explore Old Hyderabad's living heritage through Charminar, Laad Bazaar and enduring local traditions.* About: begins at Charminar, continues through Laad Bazaar (bangles, pearls, textiles, wedding accessories) and the Old City lanes. "More than a sightseeing tour, this experience reveals Old Hyderabad as a living neighbourhood where heritage remains part of everyday life."
- Highlights: Charminar · Laad Bazaar · Historic lanes of the Old City · Traditional crafts and local marketplaces · Stories of living cultural heritage
- Included: Host · Premium AC transport · Entry tickets · Traditional refreshments & water

**8 · Hyderabad Food Trail.** *Savour Hyderabad's Deccani flavours through traditional Irani cafés, lively food markets and local eateries.* About: Persian, Turkish, Mughal, Telugu and Marathwada influences on Deccani cuisine. The copy itself says "**Hyderabad on a Plate**", which is the wireframe name.
- Highlights: Traditional Bakery Experience at **Subhan Bakery** · Heritage Walk through **Mozamjahi Market** · Charminar Orientation · Authentic Irani Chai at **Nimrah Café** · Curated Old Hyderabad Street Food Trail · Signature Hyderabadi Lunch
- Included: Host & culinary-cultural storytelling · Premium AC transport between non-walkable stops · Bakery, chai & traditional food tastings · Traditional Hyderabadi lunch & dessert tasting · Guided food walk · Water

**9 · Village Life.** *Explore folk culture, traditional crafts and rural heritage in Shilparamam's village-inspired surroundings.*
- Highlights: Shilparamam arts and crafts village · Village Museum and rural-style settings · Traditional handicrafts and artisan stalls · Regional folk culture · Seasonal exhibitions or performances
- Included: Host · Premium AC transport · Entry tickets · Refreshments & water

**10 · The Pochampally Weaving & Artisan Journey.** *Discover Pochampally's ikat traditions through local weavers, vibrant yarns and traditional looms.* About: ikat resist-dyeing explained; 60–90 min drive each way; a full-day format adds a relaxed local lunch.
- Highlights: Visit to the weaving village · Interaction with local weavers · Traditional handlooms in operation · Introduction to ikat tying, dyeing and weaving · Pochampally patterns · Buy direct from producers
- Included: Host & craft interpretation · Round-trip premium AC transport · Weaving & natural dye process experience · Scheduled artisan interaction · Regional lunch (per package) · Shopping time · Water

**11 · Statue of Equality.** *Explore the Statue of Equality and Sri Ramanujacharya's legacy through grand architecture and spiritual heritage.* About: Muchintal; the 216-ft statue; the 108 Divya Desams; evening illumination, musical fountain and laser show depending on the schedule.
- Highlights: 216-foot statue · 108 Divya Desams · Life and philosophy of Ramanujacharya · Temple-inspired architecture · Evening illumination/presentations
- Good to know: venue dress code is mandatory for visitors over 5 · 108 steps (lifts and wheelchairs available) · no outside food or luggage · footwear deposit

**12 · The Modern Hyderabad Innovation Circuit.** *Explore Hyderabad's technology and startup culture through HITEC City, T-Hub and T-Works.* About: T-Works is a Government of Telangana prototyping centre (3D printing, electronics, woodworking, metalworking, textiles, digital fabrication).
- Highlights: T-Hub Visit · WE Hub & Women Entrepreneurship Ecosystem · Financial District & Knowledge City · Durgam Cheruvu Lakefront · Shilparamam Arts & Crafts Village · Curated Business Lunch · Modern Retail & Urban Development
- Included: Host & business-innovation storytelling · Premium AC transport · Pre-arranged institutional coordination · Guided Financial District experience · Business lunch, coffee & refreshments · Water
- Good to know: weekdays recommended (T-Works 11 AM–5 PM, Mon–Fri) · photo ID · internal access subject to approval

**13 · Kanha Retreat.** *Unwind at Kanha Shanti Vanam with Heartfulness, nature and quiet reflection.* About: half day = introduction; full day = slower pace + vegetarian lunch.
- Highlights: Visit to Kanha Shanti Vanam · Introduction to Heartfulness · Guided relaxation/meditation · Gentle walks · Kanha's environmental initiatives · Time for reflection
- Included: Host & visit coordination · Premium AC transport · Day-visit registration · Intro Heartfulness session · Refreshments & water · Veg lunch (full day)

**14 · Hyderabad by Night.** *Experience Hussain Sagar, the Buddha Statue and Hyderabad's waterfront lights on a scenic evening outing.* About: Hussain Sagar → Buddha Statue (optional Lumbini Park boat) → Tank Bund & Necklace Road drive with photo stops → refreshments by the water.
- Highlights: Evening views across Hussain Sagar · The Buddha Statue · Tank Bund and Necklace Road · Sunset-to-night photography · Stories of contemporary Hyderabad · Optional lake boating
- Included: Host · Premium AC transport · Guided waterfront walks & photo stops · Entry tickets per itinerary · Traditional refreshments & water

### 5.4 Conventions (10)

Status is measured against today, **16 Oct 2026**.

| Event | Dates | Venue | Status | Card image | Description |
|---|---|---|---|---|---|
| **GANSID International Congress 2026** | 23–25 Oct 2026 | HICC & Novotel | 🟢 **next up** | `conv-gansid-2026.jpg` | 4th International Congress on Sickle Cell and Other Inherited Blood Disorders. *Tentative dates.* |
| **APAC Summit 2026** | 28–30 Oct 2026 | Hyderabad | 🟢 upcoming | `conv-apac-summit-2026.jpg` | United Way Worldwide APAC Summit. Pre- and post-summit experiences: Charminar, old city bazaars, Golconda, Falaknuma, Hyderabadi cuisine. |
| **AVAR 2026 Cyber Security Conference** | 02–04 Dec 2026 | Hyderabad | 🟢 upcoming | `conv-avar-2026.jpg` | 29th edition. Evening and pre/post experiences for researchers and CISOs. *Tentative.* |
| **Telangana Rising Global Summit 2026** | 07–09 Dec 2026 | Bharat Future City | 🟢 upcoming | `conv-telangana-rising-2026.jpg` | Government of Telangana global investment summit. *Tentative.* |
| **ICCA Global Summit 2027** | 10–14 Jan 2027 | HITEX | 🟢 upcoming | `conv-icca-global-summit-2027.jpg` | International Corrugated Case Association & World Containerboard Organisation. *Tentative.* |
| **BioAsia 2027** | 15–17 Feb 2027 | HITEX | 🟢 upcoming | `conv-bioasia-2027.jpg` | Asia's leading life-sciences & health-tech forum, 24th edition, Government of Telangana. *Tentative.* |
| Hyderabad Tech Summit 2026 | 15–17 Jan 2026 | HICC | ⚪ past | `conv-hyderabad-tech-summit-2026.png` | "Experience Hyderabad around Hyderabad Tech Summit…" |
| Global Bio-India 2026 | 17–19 Feb 2026 | HICC | ⚪ past | `conv-global-bio-india-2026.png` | "Experience Hyderabad around Global Bio-India…" |
| India Sustainability Conclave 2026 | 10–12 Mar 2026 | Novotel, HICC | ⚪ past | `conv-india-sustainability-conclave-2026.png` | "Delegate experiences available" |
| World Pharma Summit 2026 | 25–26 Apr 2026 | HICC | ⚪ past | `conv-world-pharma-summit-2026.png` | "Delegate experiences available" |

The newer entries carry this disclaimer: *"Asli Hyderabad is not the organiser; dates are based on public listings and may change."*

**Convention page template:**
1. Hero: title, dates, venue, description
2. `01 Before & After The Conference`: "Full-day and half-day experiences for delegates arriving early or staying longer." The tour cards show a per-event date and time.
3. `02 During The Conference`: "Experiences designed to fit around your conference schedule." This section is **empty on every event** and shows an admin message.
4. **More Of Hyderabad**: "Explore beyond the delegate collection." → Tours / Experiences (links to /services) / Asli Originals ("Experiences you will not find anywhere else.")
5. **Need something else?**: "Accommodation, transport, medical assistance, wellness or anything specific - send us your request." Chips: Accommodation · Airport & Transport · Medical Assistance · Wellness · Private & Group · Other Requests → **Send an Enquiry**

### 5.5 Originals (1) and Partners (1)

**Welcome Hyderabad** (`/originals/welcome-hyderabad`, type "Social experience", image `original-welcome-hyderabad.jpg`):
> Meet Hyderabad at a Telugu Table. Arrive as a visitor. Leave feeling connected. A thoughtfully curated introduction to Hyderabad for those new to the city, visiting for business, or simply looking to discover it differently. Around a Telugu table, experience the city through regional food, local stories, culture, practical insights and meaningful conversations, with the people and perspectives that make Hyderabad what it is. Beyond the itinerary. Into the city.

The listing-page intro reads "Meet the city like a local".

**Partner:** `TELUGU EXPERIECE` with category "XYZ" and body "teluguu XX". The logo is "The Culinary Lounge". This is **test content that is publicly visible.**

### 5.6 Services / Add-ons (8)

| Service | Slug | Tagline line | Key copy / options | Image |
|---|---|---|---|---|
| Personal Chauffeur | `personal-chauffeur` | Private Transport · Chauffeur Services | 4-hour, 8-hour or full-day; vehicle, area, hours and distance allowance confirmed at booking | `service-personal-chauffeur.jpg` |
| Private City Host | `private-city-host` | Personalised Experiences · City Hosting | Host accompanies an agreed itinerary; shaped by interests (heritage, architecture, markets, food, contemporary) | `service-private-city-host.jpg` |
| Language Guide / Interpreter | `language-guide-interpreter` | Language Assistance · Guided Visits · Interpretation | Guide for sightseeing in your language; interpreter for meetings | `service-language-guide.jpg` |
| Airport Meet & Assist | `airport-meet-assist` | Airport Services · Arrival & Departure Assistance | At Rajiv Gandhi International Airport; terminal guidance, baggage coordination, meet driver | `service-airport-meet-assist.jpg` |
| Executive Car & Transfers | `executive-car-transfers` | Private Transport · Executive Cars · Airport Transfers | Airport, point-to-point or full-day | `service-executive-car.jpg` |
| Personal Shopper | `personal-shopper` | Shopping Assistance · Personalised Retail Experiences | Bangles, pearl jewellery, handloom, contemporary fashion, gifts; route through markets and boutiques | `service-personal-shopper.jpg` |
| Personal Photographer | `personal-photographer` | Photography · Travel Portraits · Personalised Experiences | 1-hour single location or half-day route; heritage, streets, gardens, contemporary | `service-personal-photographer.jpg` |
| Custom Hyderabad Itinerary | `custom-hyderabad-itinerary` | Personalised Travel Planning · Custom Itineraries | Half-day, full-day or multi-day; built from dates, hotel, group, budget, must-sees | `service-custom-itinerary.jpg` |

All 8 have a full multi-paragraph "About this service" on their pages. The listing cards fall back to the generic "A carefully curated Asli Hyderabad experience."

### 5.7 Contact, Book Now, Gallery

- **Contact:** eyebrow "Contact Asli Hyderabad", H1 **"Let's plan something memorable."** Body: "Tell us what you have in mind—an experience, a conference programme or a private group visit—and our local team will be in touch." Left: "Talk to the Asli team. For destination experiences, partnerships and tailored Hyderabad programmes." with Call, Email and Location. Right: "Send an enquiry. We usually reply with the right next steps within one working day." The form takes name, email, mobile and message, with the button "Send enquiry →".
- **Book Now:** eyebrow "PLAN YOUR VISIT", H1 **"Let's curate your Hyderabad."** Body: "Tell us which experience interests you and our team will help plan the right departure." Fields: experience dropdown (14 tours only), name, email, mobile, guests (1–5, 6+), preferred date, notes. Button: "Submit booking request".
- **Tour booking** (`/tours/{slug}/book`): eyebrow "TOUR BOOKING REQUEST", H1 **"Reserve your place"**, with the same fields and the tour pre-selected.
- **Gallery:** eyebrow "Hyderabad through our lens", H1 "Gallery". The body text is an admin note left in by mistake: *"Images uploaded from the Admin Gallery appear here automatically after they are published. Hover to pause the motion, or click any image to view it larger."* Below it, 5 images (720×480) loop in a marquee with a lightbox.

---

## 6. Wireframe ↔ live mapping

### 6.1 Tour rename map

| Wireframe name | Wireframe format | Live tour | Live duration | Action |
|---|---|---|---|---|
| Royal Hyderabad | Half / Full | The Royal Hyderabad Heritage Trail | 4–5 h | Rename; add Falaknuma (now in #2) |
| Kingdom of Golconda | Half | The Nizam's Legacy – A Journey Through 425 Years | 8–9 h | Rename, refocus on Golconda + Qutb Shahi, cut to half day |
| Old Hyderabad | Half | Old Hyderabad | 4–5 h | ✅ same |
| Hyderabad on a Plate | Half | Hyderabad Food Trail | 4–5 h | Rename (the copy already uses this name) |
| Crafted Hyderabad | Half | Hyderabad Through It's Crafts | 4–5 h | Rename (also fixes the apostrophe typo) |
| Village Life | Half | Village Life | 4–5 h | ✅ same |
| Pochampally Weaves | Half / Full | The Pochampally Weaving & Artisan Journey | 8–9 h | Rename; add a half-day option |
| Statue of Equality | Half | Statue of Equality | 4–5 h | ✅ same (theme moves Heritage → Culture) |
| Inside Ramoji | Full | The Ramoji Film City Experience | 8–9 h | Rename |
| HITEC Hyderabad | Half | The Modern Hyderabad Innovation Circuit | 8–9 h | Rename; cut to half day |
| Young Innovators | Half | — | — | 🆕 create |
| Kanha Retreat | Half / Full | Kanha Retreat | 4–5 h | ✅ same; tag *wellness*, feature it |
| Hyderabad by Night | Evening | Hyderabad by Night | 4–5 h | ✅ same; new *Evening* theme |
| — | — | The Hyderabad Spiritual Circuit | 4–5 h | ❓ not in wireframe |
| — | — | The Hyderabad Sacred Journey | 8–9 h | ❓ not in wireframe |

### 6.2 Things the live site has that the wireframe doesn't mention

- **Numbers band** (7 counters). It belongs in §13 "Trusted with Hyderabad".
- **Theme landing pages** with intro copy and galleries.
- **Convention hub pages**. The wireframe only has a homepage teaser.
- **Gallery page**.
- **"Need something else?" request chips**, which overlap with the wireframe's Add-ons "Need something else? … ASK ASLI →".

---

## 7. Problems found on the live site

### Content and credibility
1. **Placeholder partner is live:** "TELUGU EXPERIECE / XYZ / teluguu XX" appears on the homepage and on `/partners`.
2. **Admin messages are visible to the public:** "No tours assigned to this section yet. Add them from Admin > Conventions." appears on every convention page. The gallery intro is also admin help text.
3. **The homepage shows only past conventions** (Jan to Apr 2026), while GANSID (23 Oct) and APAC (28 Oct) are days away and not featured.
4. **Copy-paste date errors:** the Hyderabad Tech Summit (Jan) page says "Available on 17-19 Feb 2026", and lists night-time slots such as "7:30 PM – 9:30 PM" on an 8–9 hour tour.
5. **Generic fallback summaries** on cards: "A thoughtfully curated way to experience the city beyond the guidebooks." / "A carefully curated Asli Hyderabad experience." This affects 5 tour cards, all services and the originals listing.
6. **Typos:** "Hyderabad Through It's Crafts", "Artisan's", "earls" (pearls), "EXPERIECE", "Hyderabads" (Learning card), "Bahubali" vs "Baahubali".
7. **Listing intros are boilerplate:** "Explore the latest published experiences, curated and managed by the Asli Hyderabad team." appears on the Tours, Conventions, Originals, Services and Partners pages.
8. Every theme gallery has the same subtitle, "A glimpse into the places, architecture and stories that define the city." Three of the theme galleries are empty.
9. **No prices anywhere**: everything is "On request".
10. The Wellness filter tab on the homepage is empty because Kanha isn't featured or tagged.
11. The convention "More of Hyderabad" card labelled **Experiences** links to `/services`.

### UX and technical
12. The **counters render "0+"** without JS, and so do crawlers and link previews.
13. **No `<meta name="description">`, no Open Graph or Twitter tags, no `<link rel="icon">`, no JSON-LD, no sitemap.xml.**
14. **"Admin" and "Partner login" links** sit in the public footer.
15. The **logo is turned white with a CSS filter** on dark heroes, which loses the brand colours. The logo file is also low-res (§1.2).
16. Heavy images: PNG convention posters at about 1.9 MB each and `hyderabad-hero.png` at 2.1 MB, with no `srcset` and no WebP/AVIF.
17. The **booking dropdown lists tours only**. Services, Originals and conventions can't be booked through it.
18. The **Partners page isn't in the nav**.
19. No social links or Instagram, despite a strongly visual product.
20. The contact email is a person's address (`sahana@`). A role address such as `hello@` or `experiences@` would be more durable.

---

## 8. Photo inventory (now in `assets/site-photos/`)

63 files (about 29 MB), downloaded from the live site and **renamed by purpose**. Sizes are in px.

| Group | Files | Notes |
|---|---|---|
| **Hero** | `hero-banner.jpeg` (1537×1023) · `hero-booking-contact.png` (1774×887) | The banner is the current homepage hero: a figure under an arch at golden hour. The second is a Charminar dusk skyline used on the contact and booking pages. |
| **Themes ("Your Way")** | `way-heritage` · `way-culture` · `way-cinema` · `way-business` · `way-wellness` · `way-learning` | Mostly real photos of group tours. Wellness is a stylised yoga image. |
| **Tours** | `tour-*.jpg/jpeg` ×14 | Most are 2400 px wide. **Low-res:** `tour-village-life.jpeg` (500×333). Real group photos: royal-heritage-trail (with an Asli logo stamp), sacred-journey, ramoji, statue-of-equality. |
| **Heritage gallery** | `heritage-golconda-fort` · `heritage-qutb-shahi-tombs` (399×501, low) · `heritage-chowmahalla-palace` · `heritage-salar-jung-museum` | |
| **Culture gallery** | `culture-biryani` · `culture-pearl` · `culture-perini-dance` (628×449, low) · `culture-pochampally-weaving` | |
| **Cinema gallery** | `cinema-ramoji-film-city` · `cinema-baahubali-set` · `cinema-film-school` · `cinema-stunt-show` | |
| **Conventions** | `conv-*` ×10 | Six are 2400×1350 real photos of delegate groups at landmarks, which are strong proof. Four are 1024×1536 PNG event-hall portraits that look AI-generated. |
| **Services** | `service-*` ×8 | 1536×1024, consistent, **AI-generated lifestyle look** with Charminar or Chowmahalla backdrops. |
| **Originals** | `original-welcome-hyderabad.jpg` | Hosts holding red placards, with the Asli logo stamped on. |
| **Partner** | `partner-telugu-experience-placeholder.jpeg` | "The Culinary Lounge" logo. Placeholder only. |
| **Testimonials** | `testimonial-zev-siegl` · `-nick-ut` · `-barbara-davidson` · `-isabelle-duceller` | Small headshots (400–700 px). |
| **Gallery** | `gallery-0..4.jpg` | 720×480 each. |

**Image direction:** the most persuasive images are the **real delegate and group photos at landmarks** (Falaknuma, Golconda, Qutb Shahi Tombs, Ramoji, Statue of Equality, the APAC/ICCA groups). They prove that Asli actually hosts international guests. The AI-styled service images are polished, but they are generic and won't hold up next to real photography. For the redesign, put real moments first in "Trusted with Hyderabad" and "In Pictures", and treat the AI images as temporary.

> These photos are the client's own site content and are kept here as **source material for the redesign**. Before launch, confirm that the client holds rights to every image, especially the stock-looking theme gallery shots (Golconda, Salar Jung, Perini, Film School) and the AI-styled service images.

---

## 9. Takeaways for the redesign

1. **Keep:** the "Experience Asli = Real Hyderabad" line, the six themes and their copy, all 14 tours' detailed content, the convention hub idea, the 8 services, the numbers and the four testimonials. The testimonials are the strongest trust asset; two Pulitzer winners and a Starbucks co-founder deserve prominence.
2. **Fix before anything else:** placeholder partner, admin text, past conventions on the homepage, typos, meta tags and favicon, and the logo resolution.
3. **Fill the gaps from the wireframe:** 3 more Originals, about 9 brands, 15 co-curated experiences with reels, 14 quick experiences, 8 private-access encounters, and prices.
4. **Booking model:** the site needs to handle five kinds of enquiry: *book a tour/original* (date + guests), *book an add-on* (duration option), *book a quick experience* (venue + headcount), *request private access* (who and why) and *plan my Hyderabad* (multi-day itinerary). Today there are only two forms.
5. **Brand colour decision:** gold/emerald/cream luxury (the live site) versus bringing in the rainbow wordmark. A middle path: keep the luxury neutrals, use the full-colour logo, and give each of the six themes one wordmark colour as its accent.
