# Asli Hyderabad homepage: content flow

A reference for how the homepage tells its story from top to bottom: what each section is for, what it says, where it sends people, and how the sections hand over to each other. Use it when writing copy, planning inner pages, adding or moving a section, or briefing anyone on the site.

Built from `index.html` as of 2 Nov 2026 (branch `footer-skyline-motifs`). For code and motion details see [`PROJECT-CONTEXT.md`](PROJECT-CONTEXT.md); for the client's brief see [`WIREFRAME-CONTENT.md`](../WIREFRAME-CONTENT.md).

---

## 1. The story in one line

**Feel the city → pick your reason for coming → see what we do → trust us → meet the people and places → plan with us.**

The page moves from mood (loader, hero, statement) to choice (two paths, conventions, themes), then proof (numbers), exclusivity (private access), roots (Rooted in Hyderabad), offers at three scales (quick, Originals, co-curated), social proof (testimonials, brands, reels) and one close (Plan My Hyderabad).

## 2. The arc in six acts

| Act | Sections (visible #) | Job | What the visitor should feel |
|---|---|---|---|
| **I. Arrival** | Loader, 1 Hero, 2 Statement | Set the mood; say who we are in a sentence | "This is the real Hyderabad, and someone local is hosting me" |
| **II. Choose your path** | 3 Two Paths, 4 Conventions, 5 Hyderabad, Your Way | Split the audience: leisure explorers vs event delegates, then let each pick a theme | "There's a route for me" |
| **III. Credibility** | 6 In Numbers, 7 Private Access | Prove scale, then hint at doors others can't open | "They've done this many times, and they have access" |
| **IV. Roots** | 8 Rooted in Hyderabad | Four centuries in one line; hosts who grew up here | "These are insiders, not a tour desk" |
| **V. Things to do** | 9 Quick Experiences, 10 Originals | Offers sized by time: 20–60 min, then weekly or seasonal signatures | "I can fit something in, whatever my schedule" |
| **VI. Proof and close** | 11 Testimonials, 12 Featured Brands, 13 Co-curated, 14 Reels, 15 Your Hyderabad Starts Here, Footer | Voices, partner names, partner-made experiences, everyday life, then the ask | "Others loved it; the best names work with them; let's plan" |

## 3. Section by section

Visible numbers count sections from the top, as the user does. `data-sec` names drive `js/motion.js` and some keep old template names.

| # | Section (`data-sec`) | Headline | Supporting copy | Actions → destination |
|---|---|---|---|---|
| — | Loader (`#mn-pre`) | "Hyderabad is *Regal / Crafted / Inventive / Serene / Welcoming*" | 5 images: Chowmahalla, pearls, HITEC City, Kanha, the city | none; morphs into the hero |
| 1 | Hero (`hero`) | "Experience / Asli = Real / Hyderabad" | none (drone video) | none, by choice: no CTA, no eyebrow |
| 2 | Statement (`statement`) | "Irani chai at dawn, attar in the old bazaars, palaces that still remember the Nizams. This is Hyderabad, hosted *the asli way.*" | "— Sahana, Asli Hyderabad" | none |
| 3 | Two Paths (`cats`) | "Explore Hyderabad" · "Here for an Event" | "Palaces, bazaars, kitchens and studios, hosted by those who know them." · "Delegate experiences shaped around your conference: before, during, after." | Discover Tours → `/tours` · Find My Event → `/conventions` |
| 4 | Conventions (`conventions`) | "In Hyderabad for a *Convention?*" | "Find your event. *Discover Hyderabad around it.*" A one-screen rail of 12 event cards (date, tentative tag, name, venue, "Explore Convention →"), carried right to left by the page scroll on desktop; past events drop out automatically | each card → `/conventions/<slug>` · All conventions → `/conventions` |
| 5 | Hyderabad, Your Way (`collection-a`) | "Hyderabad, Your Way" | Panel intro "Choose what draws you in." 6 themes, each with a one-line promise and hosted routes: Heritage "Walk through centuries.", Culture "Taste. Make. Celebrate.", Cinema "Step behind the screen.", Business "Meet the city that builds.", Wellness "Slow down. Restore.", Learning "See. Meet. Understand." | All tours / View all tours → `/tours` · Explore {Theme} → `/experiences/<theme>` · route links → `/tours/<slug>` |
| 6 | In Numbers (`commission`, `#trusted`) | "Asli Hyderabad, *in numbers.*" | "Conference delegates, business leaders, students and curious travellers have come to know Hyderabad through Asli…" 45+ conferences & events · 275+ curated experiences · 30+ partners & local businesses · 55+ cities & countries | Plan My Hyderabad → `/book-now` |
| 7 | Private Access (`collector`, `#private-access`) | "Hyderabad, *behind closed doors.*" | "Rare encounters. Remarkable people." | Request Access → `/private-access` |
| 8 | Rooted in Hyderabad (`city`) | "Four centuries of a city, *hosted by people who call it home.*" | "From the Qutb Shahi forts to the glass towers of HITEC City…" Skyline caption "*Four centuries, one city.*" (Golconda 1518 → Durgam Cheruvu 2020) | Explore all tours → `/tours` |
| 9 | Quick Experiences (`spinner`, `#quick-experiences`) | "A little Hyderabad, *wherever you are.*" | Workshops 01–06 (Cheriyal masks, lac bangles, Bidri, pearls, Pochampally ikat, Deccani calligraphy) · Performances 07–10 (Telangana folk, Perini, Oggu Katha, Deccan music / Sufi evening). Each: duration · Price on request | "Book now" appears on hover; cards → `/experiences/quick/<slug>` |
| 10 | Originals (`collection-b`) | "Only in Hyderabad. Only with Asli." | Panel intro "Sunday mornings. Saturday tables. Friday nights." 6 Originals with schedule: Dawn (Sun 6:30 AM), Welcome (Sat 11 AM), After Dark (select Fri 7 PM), The Hyderabad Table (monthly), Ramzan Nights (seasonal), Festival Hyderabad (Bonalu & Bathukamma) | All Originals / View all Originals → `/originals` · per-Original CTAs ("Book this Sunday", "Join a Ramzan night"…) → `/originals/<slug>` |
| 11 | Testimonials (`materials`, `#voices`) | "Asli Hyderabad, *in their words.*" | 4 verbatim quotes: Zev Siegl (co-founder, Starbucks), Nick Ut and Barbara Davidson (Pulitzer photojournalists), Isabelle Duceller (CEO, BioGaia) | none; 4 guest tabs auto-advance |
| 12 | Featured Brands (`logos`, `#featured-brands`) | "Featured brands *of Hyderabad.*" | "Handpicked names that represent the best of Hyderabad." 9 logos: Taj Falaknuma, Café Niloufer, Goyaz, Ramoji, Paradise, HICC, Heartfulness, Karachi Bakery, Shilparamam | Explore all featured brands → `/partners` |
| 13 | Co-curated (`worlds`, `#co-curated`) | "Small experiences. *Big memories.*" | "Fifteen short, immersive experiences crafted with our Featured Brands…" 7 shown, each paired with a brand from #12 (High Tea × Taj Falaknuma, Chai Time × Niloufer, Great Hyderabad Tasting × Paradise, Pearl Experience × Goyaz, Behind the Screen × Ramoji, Made in Hyderabad × Shilparamam, Reset × Heartfulness) | View all 15 experiences → `/experiences/co-curated` · cards → `/experiences/co-curated/<slug>` |
| 14 | Reels (`social`) | "@aslihyderabad" (placeholder handle) | 8 muted loops: Hyderabad from above, Irani chai, festival nights, street food, an offering of light, dance, jewellery, friends at the table | See the gallery → `/gallery` (becomes Follow on Instagram once the real handle exists) |
| 15 | Your Hyderabad Starts Here (`heritage`, `#plan`) | "Your Hyderabad *starts here.*" | Phone · WhatsApp · email; 3 steps: Tell us your dates → We shape the days → We host you | Plan My Hyderabad → `/book-now` |
| — | Footer | brand line "Curated destination experiences, conference programmes and authentic local stories that bring Hyderabad to life." | Contact; columns Experiences / Asli Signatures / Plan Your Visit; legal; credits | every main destination (see §5) |

## 4. Visual rhythm

The page alternates light and dark so each section reads as a new chapter.

| # | Section | Ground | Density |
|---|---|---|---|
| 1 | Hero | dark video | one line |
| 2 | Statement | cream | one sentence |
| 3 | Two Paths | sepia photographs | two tiles |
| 4 | Conventions | cream, dark cards | heading + "All conventions" button + scroll-driven card rail, one screen tall |
| 5 | Your Way | cream | explorer, 6 cards |
| 6 | Numbers | photo + white card | 4 figures |
| 7 | Private Access | dark photo | three lines |
| 8 | Rooted | cream split + **ink** skyline sweep | editorial |
| 9 | Quick | cream + jaali | rail of 10 |
| 10 | Originals | cream | explorer, 6 cards |
| 11 | Testimonials | photo backdrops | one quote at a time |
| 12 | Brands | cream + white tiles | grid of 9 |
| 13 | Co-curated | cream, ink photo cards | bento of 7 |
| 14 | Reels | cream | marquee of 8 |
| 15 | Close | **night photo** | heading + CTA |
| — | Footer | dusk skyline | links |

Pattern: the quiet, one-line moments (1, 2, 7, 15) sit between denser sections and act as rests. The run 12 → 13 → 14 is three cream sections in a row, the longest stretch without a dark break.

## 5. Where the links go

| Destination | Reached from |
|---|---|
| `/book-now` (Plan My Hyderabad) | header Plan menu, mobile drawer, #6 Numbers, #15 Close, footer |
| `/tours` | header, drawer, #3, #5 (heading link + panel button), #8, footer |
| `/conventions` | header, drawer, #3, #4 (All conventions), footer; plus 12 event pages from #4 |
| `/experiences/<theme>` | header, drawer, #5 cards and panel, footer |
| `/originals` | header, drawer, #10 (heading link + panel button), footer; plus 6 Original pages from #10 |
| `#private-access` | header CTA, header menu, drawer (link + button), footer |
| `/private-access` | #7 Request Access; on inner pages the header and footer link here too |
| `/contact` | header, drawer, footer |
| `/partners`, then `/partners/<slug>` | #12's "Explore all" link, then each tile's About link |
| Each brand's official site (new tab) | every brand tile in #12 and on `/partners`, and each brand page |
| `/experiences/co-curated/<slug>` | the 7 cards in #13, and the 15 cards on the list page, with its heading link to `/experiences/co-curated` |
| `/experiences/quick/<slug>` | the 10 cards in #9, the 14 cards on the list page and the convention "During" rows |
| `/gallery` | #14, header, drawer, footer |
| `/services`, custom itinerary | header, drawer, footer only; no homepage section |
| `/privacy`, `/terms` | footer |
| `/book-now?experience=<slug>` | every Book button on an inner page; service options add `&option=<name>` |
| `/contact?topic=<text>` | Request Access, convention "Need something else?" chips, Ask Asli |
| WhatsApp / phone / email | header (WhatsApp), drawer, #15, footer, contact and booking pages |

No link goes nowhere: the build fails on `href="#"`. The footer's Instagram, Facebook, LinkedIn and YouTube icons are commented out in `index.html` until the real accounts exist. Placeholder copy still to replace is listed in [`CONTENT-TO-REPLACE.md`](CONTENT-TO-REPLACE.md).

## 6. Visitor journeys

- **Leisure traveller:** Hero → Statement → "Explore Hyderabad" (#3) → picks a theme in #5 → sees scale (#6) and roots (#8) → books something short (#9) or a weekly Original (#10) → reassured by #11–#14 → Plan My Hyderabad (#15).
- **Conference delegate:** "Here for an Event" (#3) → finds their event in #4, which follows straight on → the Business and Learning themes in #5 → "45+ conferences" in #6 → a 20–60 min Quick Experience between sessions (#9) → testimonials from delegates and executives (#11).
- **Premium or VIP guest:** header "Private Access" CTA jumps to #7 → Request Access (`/contact`). Taj Falaknuma high tea (#13) and the brand grid (#12) support this path.
- **Returning or local visitor:** the Originals (#10) are the repeat reason: fixed weekly times plus seasonal editions.

## 7. Built order vs the wireframe

| Wireframe # | Wireframe section | Built as | Note |
|---|---|---|---|
| 01 | Hero | #1 | + Statement (#2) and Two Paths (#3) added before the themes |
| 02 | Hyderabad, Your Way | #5 | moved after Conventions |
| 03 | Featured Tours | inside #5 | tours appear as the routes in each theme panel |
| 04 | Convention? | #4 | |
| 05 | Originals | #10 | moved later, after Quick Experiences |
| 06 | Featured Brands | #12 | sits right before Co-curated, as the wireframe intends |
| 07 | Co-curated | #13 | 7 of 15 shown |
| 08 | Add-ons & Quick Experiences | #9 | Quick only; Add-ons only as links to `/services` |
| 09 | In Pictures | #14 Reels | |
| 10 | Private Access | #7 | teaser only; the table of 8 needs the named people's consent |
| 11 | Health & Wellbeing | not built | Wellness theme (#5) and Reset (#13) cover it |
| 12 | Plan My Hyderabad | #15 + #6 button | merged into the close |
| 13 | Trusted with Hyderabad | #6 Numbers + #11 Testimonials | split into two |
| 14 | Your Hyderabad Starts Here | #15 | |
| 15 | Footer | Footer | |
| new | Rooted in Hyderabad | #8 | not in the wireframe |

## 8. Observations for future work

These are observations, not decisions. Raise them with the user before acting.

1. **Two Paths order vs what follows.** Tile 1 is "Explore Hyderabad" and tile 2 "Here for an Event", but the next section is Conventions (the event path), then the themes. Delegates get continuity; explorers wait one section.
2. **Proof is split.** Numbers (#6) and Testimonials (#11) are five sections apart. That spreads trust through the page, but "Trusted with Hyderabad" no longer reads as one idea.
3. **Two explorers use the same pattern** (#5 themes, #10 Originals, mirrored). Quick Experiences (#9) between them keeps them from feeling repetitive; keep something different between them if the order changes.
4. **Partner logic runs 12 → 13.** Every co-curated card names a brand from the grid above it. Changing a brand means changing its pairing too.
5. **The ask repeats deliberately.** Plan My Hyderabad appears at #6 (mid-page) and #15 (end). No other section has a CTA to `/book-now`; keep it that way unless asked (standing preference: no extra CTAs).
6. **Dead ends to fill.** Individual reels cards are not links. Quick and Co-curated cards now open their own pages.
7. **Private Access.** The homepage teaser leads to `/private-access`, which lists 5 unnamed encounters. The full table of 8 waits for the named guests' consent.
8. **Missing content types:** Add-ons (8 services on the live site), Health & Wellbeing as its own section, and real prices ("Price on request" throughout).

## 9. Voice and copy rules

- **Headings:** two halves, the second in *italic dark gold* ("Asli Hyderabad, *in numbers.*"). Short and declarative.
- **Promises:** three-beat fragments ("Taste. Make. Celebrate.", "See. Meet. Understand.").
- **Specific over general:** name real things: Irani chai, attar, Laad Bazaar, haleem, Bonalu, Cheriyal masks.
- **Hosted, not toured:** "hosted by people who call it home", "hosted the asli way", "We host you".
- **Sources:** copy comes from the wireframe and the live site. Testimonials are verbatim. When new copy is written, say so. Prices: "Price on request".
- **Restraint:** no eyebrows anywhere; one action per section at most, besides card links.
