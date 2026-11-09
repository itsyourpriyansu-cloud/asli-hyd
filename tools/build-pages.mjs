// Writes every inner page as plain HTML from data/*.json. The header, icon sprite and footer are sliced out of
// index.html, so editing them there and re-running this keeps all pages in step. Output is committed; nothing runs on deploy.
//
//   node tools/build-pages.mjs
//
// Fails (exit 1) if any internal link, anchor or image on any page, the homepage included, does not resolve.
import { readFileSync as rd, writeFileSync as wr, mkdirSync, rmSync, existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const data = (n) => JSON.parse(rd(join(ROOT, 'data', n + '.json'), 'utf8'));
const tours = data('tours'), themes = data('themes'), conventions = data('conventions'), originals = data('originals');
const services = data('services'), offers = data('offers'), partners = data('partners'), privateAccess = data('private-access');
const gallery = data('gallery'), legal = data('legal');
const tourBy = Object.fromEntries(tours.map((t) => [t.slug, t]));

const SITE = 'https://aslihyd.in';
const GENERATED = ['tours', 'experiences', 'conventions', 'originals', 'services', 'partners', 'private-access', 'gallery', 'contact', 'book-now', 'privacy', 'terms'];
const PRICE = 'Price on request';
const priceOf = (r) => r.price || PRICE; // real prices go in each record's "price" field
const ARROW = '<span aria-hidden="true">→</span>';
const DISCLAIMER = 'Asli Hyderabad is not the organiser; dates are based on public listings and may change.';

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// Site heading style: the second half is italic gold. Split before "of/on/by/at/after", else before the last word.
function halves(name) {
  const m = name.match(/^(.+?)\s((?:of|on|by|at|after)\s.+)$/i);
  if (m) return `${esc(m[1])} <em>${esc(m[2])}</em>`;
  const i = name.lastIndexOf(' ');
  return i < 0 ? `<em>${esc(name)}</em>` : `${esc(name.slice(0, i))} <em>${esc(name.slice(i + 1))}</em>`;
}
const book = (slug) => `/book-now?experience=${slug}`;
const topic = (t) => `/contact?topic=${encodeURIComponent(t)}`;
const li = (arr) => arr.map((x) => `<li>${esc(x)}</li>`).join('');
const paras = (arr) => arr.map((x) => `<p>${esc(x)}</p>`).join('');
const head2 = (a, b, sub = '') => `<header class="mn-pg-head" data-rise><h2 class="mn-pg-h2">${esc(a)} <em>${esc(b)}</em></h2>${sub ? `<p class="mn-pg-lead">${esc(sub)}</p>` : ''}</header>`;

/* ---------- Shell, sliced from the homepage ---------- */
const home = rd(join(ROOT, 'index.html'), 'utf8');
function slice(a, b) {
  const i = home.indexOf(a), j = home.indexOf(b, i);
  if (i < 0 || j < 0) throw new Error('index.html: cannot find ' + a);
  return home.slice(i, j + b.length);
}
const localize = (s) => s.replace(/\b(src|href)="assets\//g, '$1="/assets/')
  .replace(/href="#co-curated"/g, 'href="/experiences/co-curated"')
  .replace(/href="#quick-experiences"/g, 'href="/experiences/quick"')
  .replace(/href="#private-access"/g, 'href="/private-access"')
  .replace(/href="#featured-brands"/g, 'href="/partners"');
const SPRITE = localize(slice('<svg width="0" height="0" style="position:absolute" aria-hidden="true">', '</svg>'));
const HEADER = localize(slice('<header class="mn-header is-overlay" data-header>', '</header>'));
const FOOTER = localize(slice('<footer class="mn-footer">', '</footer>'));
const LIGHTBOX = `<dialog class="mn-pg-lb" data-lb aria-label="Photo viewer">
    <button type="button" class="mn-pg-lb__close" data-lb-close aria-label="Close">×</button>
    <button type="button" class="mn-pg-lb__nav mn-pg-lb__nav--prev" data-lb-prev aria-label="Previous photo">‹</button>
    <figure class="mn-pg-lb__fig"><img alt="" data-lb-img><figcaption data-lb-cap></figcaption></figure>
    <button type="button" class="mn-pg-lb__nav mn-pg-lb__nav--next" data-lb-next aria-label="Next photo">›</button>
  </dialog>`;

const written = new Map();
function page(path, { title, desc, og, cls = '', body }) {
  const css = ['fonts', 'base', 'header', 'sections', 'motifs', 'footer', 'pages'].map((n) => `<link rel="stylesheet" href="/css/${n}.css">`).join('\n  ');
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${esc(title)} | Asli Hyderabad</title>
  <meta name="description" content="${esc(desc)}">
  <meta property="og:title" content="${esc(title)} | Asli Hyderabad">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:image" content="${SITE}${esc(og)}">
  <link rel="icon" href="/assets/brand/favicon.ico" sizes="32x32">
  <link rel="icon" href="/assets/brand/favicon.png" type="image/png" sizes="512x512">
  <link rel="apple-touch-icon" href="/assets/brand/apple-touch-icon.png">
  <link rel="preload" href="/assets/fonts/cormorant-garamond-300-normal-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/assets/fonts/jost-400_600-normal-latin.woff2" as="font" type="font/woff2" crossorigin>
  ${css}
  <script>
    // Set before first paint so the hero opens from its arch; the timeout means a failed script can never leave it closed.
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.classList.add('mn-arch');
      window.__mnArchFailsafe = setTimeout(function () { document.documentElement.classList.remove('mn-arch'); }, 4000);
    }
  </script>
</head>
<body class="mn-pg ${cls}">
  <a class="mn-pg-skip" href="#main">Skip to content</a>
  ${SPRITE}
  ${HEADER}
  <main id="main" tabindex="-1">
${body}
  </main>
${FOOTER}
  ${body.includes('data-full=') ? LIGHTBOX : ''}
  <script src="/js/vendor/gsap.min.js"></script>
  <script src="/js/vendor/ScrollTrigger.min.js"></script>
  <script src="/js/vendor/lenis.min.js"></script>
  <script src="/js/components.js"></script>
  <script src="/js/motion.js"></script>
</body>
</html>
`;
  written.set(path, html);
}

/* ---------- Pieces ---------- */
const img = (group, name) => `/assets/img/pages/${group}/${name}`;
function hero({ title, sub = '', group, name, alt = '', video, poster, pos, tall }) {
  const style = pos ? ` style="object-position:${pos}"` : '';
  const media = video
    ? `<img class="mn-pg-hero__img" src="${poster}" alt="${esc(alt)}" width="1920" height="1080" fetchpriority="high"${style}><video class="mn-pg-hero__video" data-hero-video data-src="${video}" muted loop playsinline preload="none" aria-hidden="true"${style}></video>`
    : `<img class="mn-pg-hero__img" src="${img(group, name)}.jpg" srcset="${img(group, name)}-1000.jpg 1000w, ${img(group, name)}.jpg 1920w" sizes="100vw" alt="${esc(alt)}" width="1920" height="1200" fetchpriority="high"${style}>`;
  return `    <section class="mn-pg-hero${tall ? ' mn-pg-hero--tall' : ''}" data-hero>
      <div class="mn-pg-hero__media" data-hero-media>${media}</div>
      <div class="mn-wrap mn-pg-hero__body" data-hero-body>
        <h1 class="mn-pg-hero__title">${title}</h1>
        ${sub ? `<p class="mn-pg-hero__sub">${esc(sub)}</p>` : ''}
      </div>
    </section>`;
}
const archSvg = '<svg class="mn-arcade__arch" viewBox="0 0 400 500" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path pathLength="1" d="M2 498V190C2 104 157 46 200 2C243 46 398 104 398 190V498Z"/></svg>';
function archCard({ href, src, alt, name, line, meta, attrs = '', id = '', go }) {
  return `<li class="mn-pg-card"${id ? ` id="${id}"` : ''}${attrs} data-rise-item><a class="mn-arcade__link" href="${href}">
          <span class="mn-pg-card__frame"><span class="mn-arcade__media"><img class="mn-arcade__img" src="${src}" alt="${esc(alt)}" width="720" height="900" loading="lazy" decoding="async"></span>${archSvg}</span>
          <h3 class="mn-pg-card__name">${esc(name)}</h3>
          <p class="mn-pg-card__line">${esc(line)}</p>
          <p class="mn-pg-card__meta"><span>${esc(meta)}</span>${go ? `<span class="mn-pg-card__go">${esc(go)} ${ARROW}</span>` : ''}</p>
        </a></li>`;
}
const tourCard = (t) => archCard({
  href: `/tours/${t.slug}`, src: img('tours', t.slug + '-card.jpg'), alt: t.alt || t.name, name: t.name, line: t.summary,
  meta: `${t.duration} · ${priceOf(t)}`, attrs: ` data-tour-themes="${t.themes.join(' ')}"`,
});
// Experience and brand pages: their photos are portrait, too small to fill the screen, so they sit in an arch on ink.
function portraitHero({ title, sub, src, alt, logo }) {
  return `    <section class="mn-pg-port">
      <div class="mn-m-jaali mn-pg-port__bg" aria-hidden="true"></div>
      <div class="mn-wrap mn-pg-port__in">
        <div class="mn-pg-port__text">
          ${logo ? `<span class="mn-pg-port__logo"><img src="/assets/img/brands/${logo}-ink.png" alt="" decoding="async"></span>` : ''}
          <h1 class="mn-pg-hero__title mn-pg-port__title">${title}</h1>
          ${sub ? `<p class="mn-pg-hero__sub">${esc(sub)}</p>` : ''}
        </div>
        <div class="mn-pg-card__frame mn-pg-port__frame"><span class="mn-arcade__media"><img class="mn-arcade__img" src="${src}" alt="${esc(alt)}" width="720" height="900" fetchpriority="high"></span>${archSvg}</div>
      </div>
    </section>`;
}
const facts = (rows) => `<dl class="mn-pg-facts mn-pg-facts--${rows.length}" data-rise>${rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>`;
const route = (a, b, stops) => `<section class="mn-pg-block" data-route>${head2(a, b)}
          <div class="mn-pg-routewrap"><span class="mn-pg-route__line" data-route-line aria-hidden="true"></span><ol class="mn-pg-route" role="list">${stops.map((h, i) => `<li class="mn-pg-route__stop" data-stop><span class="mn-pg-route__num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span><span class="mn-pg-route__name">${esc(h)}</span></li>`).join('')}</ol></div>
        </section>`;
function experiencePage({ path, it, src, logo, sub, factRows, bookLabel, where, related, relatedHead, allHref, allLabel }) {
  page(path, {
    title: it.name, desc: it.line, og: src,
    body: `${portraitHero({ title: halves(it.name), sub, src, alt: it.name, logo })}
    <div class="mn-wrap mn-pg-split">
      <div class="mn-pg-split__main">
        ${facts(factRows)}
        <section class="mn-pg-block">${head2('About this', 'experience')}<div class="mn-pg-prose" data-rise>${paras(it.about)}</div></section>
        ${route('How it', 'unfolds', it.steps)}
        <section class="mn-pg-block mn-pg-cols" data-rise>
          <div><h2 class="mn-pg-h3">What’s <em>included</em></h2><ul class="mn-pg-list mn-pg-list--tick" role="list">${li(it.included)}</ul></div>
          <div><h2 class="mn-pg-h3">Good <em>to know</em></h2><ul class="mn-pg-list" role="list">${li(it.good)}</ul></div>
        </section>
        <section class="mn-pg-block${where ? ' mn-pg-cols' : ''}" data-rise>
          <div><h2 class="mn-pg-h3">Best <em>for</em></h2><ul class="mn-pg-list" role="list">${li(it.best)}</ul></div>
          ${where ? `<div><h2 class="mn-pg-h3">Where <em>it works</em></h2><ul class="mn-pg-list" role="list">${li(where)}</ul></div>` : ''}
        </section>
      </div>
      ${bookCard({ price: priceOf(it), meta: 'Final availability confirmed by our team', href: book(it.slug), label: bookLabel })}
    </div>
    <section class="mn-pg-sec mn-pg-sec--tint"><div class="mn-wrap">
      <div class="mn-pg-headrow">${head2(relatedHead[0], relatedHead[1])}<a class="mn-ulink" href="${allHref}">${allLabel}</a></div>
      <ul class="mn-pg-cards" role="list">${related.join('')}</ul>
    </div></section>`,
  });
}
// Three neighbours in the list, wrapping round, so every page links on.
const nextThree = (arr, it) => [1, 2, 3].map((n) => arr[(arr.indexOf(it) + n) % arr.length]);
function galleryGrid(items) {
  if (!items.length) return '';
  return `<ul class="mn-pg-gal" role="list">${items.map((g) => `<li data-rise-item><button type="button" class="mn-pg-gal__btn" data-full="${g.src}" data-cap="${esc(g.cap)}"><img src="${g.thumb || g.src}" alt="${esc(g.cap)}" width="${g.w || 1000}" height="${g.h || 750}" loading="lazy" decoding="async"><span class="mn-pg-gal__cap">${esc(g.cap)}</span></button></li>`).join('')}</ul>`;
}
function bookCard({ price = PRICE, meta, href, label }) {
  return `<aside class="mn-pg-book" data-bookbar><div class="mn-pg-book__card">
        <p class="mn-pg-book__price">${esc(price)}</p>
        <p class="mn-pg-book__meta">${esc(meta)}</p>
        <a class="mn-pg-book__cta" href="${href}">${esc(label)} ${ARROW}</a>
      </div></aside>`;
}
const CHIPS = ['Accommodation', 'Airport & Transport', 'Medical Assistance', 'Wellness', 'Private & Group', 'Other Requests'];
function chips(about) {
  return `<section class="mn-pg-sec mn-pg-need"><div class="mn-wrap">
      ${head2('Need', 'something else?', 'Accommodation, transport, medical assistance, wellness or anything specific: send us your request.')}
      <ul class="mn-pg-chips" role="list" data-rise>${CHIPS.map((c) => `<li><a href="${topic(about ? `${c}: ${about}` : c)}">${esc(c)}</a></li>`).join('')}</ul>
    </div></section>`;
}

/* ---------- Tours ---------- */
const THEME_TABS = [['all', 'All'], ...themes.map((t) => [t.slug, t.name]), ['evening', 'Evening']];
page('/tours', {
  title: 'Tours', desc: 'Hosted routes through Hyderabad’s heritage, culture, cinema, business, wellness and learning.', og: img('heroes', 'tours.jpg'),
  body: `${hero({ title: 'Hyderabad, <em>hosted.</em>', sub: 'A selected set of hosted routes through heritage, culture, business, cinema, wellness and learning.', group: 'heroes', name: 'tours', alt: 'Guests with an Asli Hyderabad host at a Hyderabad landmark' })}
    <section class="mn-pg-sec"><div class="mn-wrap" data-filter-root>
      <div class="mn-pg-tabs" role="group" aria-label="Filter tours by theme" data-rise>${THEME_TABS.map(([k, n], i) => `<button type="button" data-filter="${k}" aria-pressed="${i === 0}">${esc(n)}</button>`).join('')}</div>
      <p class="mn-sr" role="status" data-filter-status></p>
      <ul class="mn-pg-cards" role="list">${tours.map(tourCard).join('')}</ul>
    </div></section>`,
});
for (const t of tours) {
  const related = [...tours.filter((o) => o !== t && o.themes.some((x) => t.themes.includes(x))), ...tours.filter((o) => o !== t && !o.themes.some((x) => t.themes.includes(x)))].slice(0, 3);
  page(`/tours/${t.slug}`, {
    title: t.name, desc: t.summary, og: img('tours', t.slug + '.jpg'),
    body: `${hero({ title: halves(t.name), sub: t.tagline, group: 'tours', name: t.slug, alt: t.alt || t.name, pos: t.pos })}
    <div class="mn-wrap mn-pg-split">
      <div class="mn-pg-split__main">
        ${facts([['Duration', t.duration], ['Format', t.format], ['Time', t.time], ['Minimum guests', t.minGuests], ['Price', priceOf(t)]])}
        <section class="mn-pg-block">${head2('About this', 'experience')}<div class="mn-pg-prose" data-rise>${paras(t.about)}</div></section>
        ${route('The', 'route', t.highlights)}
        <section class="mn-pg-block mn-pg-cols" data-rise>
          <div><h2 class="mn-pg-h3">What’s <em>included</em></h2><ul class="mn-pg-list mn-pg-list--tick" role="list">${li(t.included)}</ul></div>
          <div><h2 class="mn-pg-h3">Good <em>to know</em></h2><ul class="mn-pg-list" role="list">${li(t.good)}</ul></div>
        </section>
        ${t.gallery.length ? `<section class="mn-pg-block">${head2('Along', 'the way')}${galleryGrid(t.gallery)}</section>` : ''}
      </div>
      ${bookCard({ price: priceOf(t), meta: `${t.duration} · per person, final availability confirmed by our team`, href: book(t.slug), label: 'Book this tour' })}
    </div>
    <section class="mn-pg-sec mn-pg-sec--tint"><div class="mn-wrap">
      <div class="mn-pg-headrow">${head2('You may', 'also like')}<a class="mn-ulink" href="/tours">All tours</a></div>
      <ul class="mn-pg-cards" role="list">${related.map(tourCard).join('')}</ul>
    </div></section>`,
  });
}

/* ---------- Themes ---------- */
for (const t of themes) {
  const list = tours.filter((x) => x.themes.includes(t.slug));
  page(`/experiences/${t.slug}`, {
    title: `${t.name} Experiences`, desc: t.short, og: `/assets/video/themes/${t.slug}.jpg`,
    body: `${hero({ title: `${esc(t.name)}<em>.</em>`, sub: t.tagline, video: `/assets/video/themes/${t.slug}.mp4`, poster: `/assets/video/themes/${t.slug}.jpg`, alt: t.short })}
    <section class="mn-pg-sec mn-pg-intro"><div class="mn-m-jaali mn-pg-intro__bg" aria-hidden="true"></div><div class="mn-wrap mn-pg-intro__in" data-rise>
      <h2 class="mn-pg-h2 mn-pg-h2--lg">${esc(t.headA)} <em>${esc(t.headB)}</em></h2>
      <p class="mn-pg-lead">${esc(t.intro)}</p>
    </div></section>
    ${t.gallery.length ? `<section class="mn-pg-sec mn-pg-sec--flush"><div class="mn-wrap">${galleryGrid(t.gallery)}</div></section>` : ''}
    <section class="mn-pg-sec"><div class="mn-wrap">
      <div class="mn-pg-headrow">${head2('Hosted', 'routes')}<a class="mn-ulink" href="${topic(`Customise a ${t.name} experience`)}">Customise an experience</a></div>
      <ul class="mn-pg-cards" role="list">${list.map(tourCard).join('')}</ul>
    </div></section>`,
  });
}

/* ---------- Co-curated and Quick ---------- */
const ccSrc = (c) => (c.photo ? `/assets/img/co-curated/${c.photo}.jpg` : img('co-curated', c.slug + '.jpg'));
page('/experiences/co-curated', {
  title: 'Co-curated Experiences', desc: 'Fifteen short, immersive experiences crafted with our Featured Brands.', og: img('heroes', 'co-curated.jpg'),
  body: `${hero({ title: 'Small experiences. <em>Big memories.</em>', sub: 'Fifteen short, immersive experiences crafted with our Featured Brands, made for curious travellers and memorable moments.', group: 'heroes', name: 'co-curated', alt: 'The long dining table at Taj Falaknuma Palace' })}
    <section class="mn-pg-sec"><div class="mn-wrap">
      <ul class="mn-pg-offers" role="list">${offers.cocurated.map((c) => `<li class="mn-cc" id="${c.slug}" data-rise-item><a class="mn-cc__link" href="/experiences/co-curated/${c.slug}">
          <img class="mn-cc__img" src="${ccSrc(c)}" alt="" width="720" height="900" loading="lazy" decoding="async">
          ${c.logo ? `<span class="mn-cc__partner"><img src="/assets/img/brands/${c.logo}-ink.png" alt="" loading="lazy"></span>` : ''}
          <span class="mn-cc__body"><span class="mn-cc__num">${c.num}</span><span class="mn-cc__name">${esc(c.name)}</span><span class="mn-cc__with">${esc(c.partner ? 'with ' + c.partner : c.kind)}</span>
            <span class="mn-cc__more"><span class="mn-cc__line">${esc(c.line)}</span><span class="mn-cc__go">Explore ${ARROW}</span></span></span>
        </a></li>`).join('')}</ul>
      <p class="mn-pg-note" data-rise>Book any experience on its own or <a class="mn-pg-inlink" href="/services/custom-hyderabad-itinerary">add it to your Asli Hyderabad itinerary</a>.</p>
    </div></section>`,
});
const ccCard = (c) => archCard({ href: `/experiences/co-curated/${c.slug}`, src: ccSrc(c), alt: '', name: c.name, line: c.line, meta: `${c.partner ? 'With ' + c.partner : c.kind}`, go: 'Explore' });
for (const c of offers.cocurated) {
  experiencePage({
    path: `/experiences/co-curated/${c.slug}`, it: c, src: ccSrc(c), logo: c.logo, sub: c.line,
    factRows: [['Format', c.kind], ...(c.partner ? [['With', c.partner]] : []), ['Timing', 'Confirmed when you book'], ['Price', priceOf(c)]],
    bookLabel: 'Book experience', related: nextThree(offers.cocurated, c).map(ccCard),
    relatedHead: ['More small', 'experiences'], allHref: '/experiences/co-curated', allLabel: 'All 15 experiences',
  });
}
const quickSrc = (q) => (q.photo ? `/assets/img/quick/${q.photo}.jpg` : img('quick', q.slug + '.jpg'));
const QUICK_GROUPS = [['workshops', 'Hands-on', 'workshops'], ['performances', 'Live', 'performances'], ['bars', 'Bars', 'and tables']];
const quickCard = (q, id = '') => archCard({ href: `/experiences/quick/${q.slug}`, id, src: quickSrc(q), alt: '', name: q.name, line: q.line, meta: `${q.len} · ${priceOf(q)}`, go: 'Explore' });
page('/experiences/quick', {
  title: 'Quick Experiences', desc: 'Short-format cultural experiences for hotels, restaurants, conferences, events, corporate gatherings and private celebrations.', og: img('heroes', 'quick.jpg'),
  body: `${hero({ title: 'A little Hyderabad, <em>wherever you are.</em>', sub: 'Short-format cultural experiences for hotels, restaurants, conferences, events, corporate gatherings and private celebrations.', group: 'heroes', name: 'quick', alt: 'A craftsperson at work in Hyderabad' })}
    ${QUICK_GROUPS.map(([g, a, b]) => `<section class="mn-pg-sec"><div class="mn-wrap">${head2(a, b)}
      <ul class="mn-pg-cards" role="list">${offers.quick.filter((q) => q.group === g).map((q) => quickCard(q, q.slug)).join('')}</ul>
    </div></section>`).join('\n')}`,
});
const QUICK_FORMAT = { workshops: 'Hands-on workshop', performances: 'Live performance', bars: 'Event activation' };
for (const q of offers.quick) {
  const sameGroup = offers.quick.filter((x) => x.group === q.group);
  experiencePage({
    path: `/experiences/quick/${q.slug}`, it: q, src: quickSrc(q), sub: q.line,
    factRows: [['Duration', q.len], ['Format', QUICK_FORMAT[q.group]], ['Price', priceOf(q)]],
    bookLabel: 'Book now', where: offers.quickWhere, related: nextThree(sameGroup, q).map((x) => quickCard(x)),
    relatedHead: ['More quick', 'experiences'], allHref: '/experiences/quick', allLabel: 'All quick experiences',
  });
}

/* ---------- Conventions ---------- */
page('/conventions', {
  title: 'Conventions', desc: 'In Hyderabad for a convention? Find your event and discover the city around it.', og: img('heroes', 'conventions.jpg'),
  body: `${hero({ title: 'In Hyderabad <em>for a convention?</em>', sub: 'Find your event. Discover Hyderabad around it.', group: 'heroes', name: 'conventions', alt: 'A full plenary hall at the Hyderabad International Convention Centre' })}
    <section class="mn-pg-sec"><div class="mn-wrap" data-conventions>
      <ol class="mn-pg-events" role="list">${conventions.map((c) => `<li class="mn-conv__item" data-end="${c.end}" data-rise-item><a class="mn-conv__card" href="/conventions/${c.slug}">
          <img class="mn-conv__img" src="/assets/img/conventions/${c.card}.jpg" alt="" width="960" height="1200" loading="lazy">
          <span class="mn-conv__top">${c.logo ? `<span class="mn-conv__logo"><img src="/assets/img/conventions/logos/${c.slug}.png" alt="" width="${c.logo[0]}" height="${c.logo[1]}" loading="lazy" decoding="async"></span>` : ''}<time class="mn-conv__date" datetime="${c.start}">${esc(c.dates)}</time><span class="mn-conv__tag">Tentative</span></span>
          <span class="mn-conv__body"><span class="mn-conv__name">${esc(c.name)}</span>
            <span class="mn-conv__venue"><svg class="mn-conv__pin" aria-hidden="true"><use href="#i-pin"/></svg>${esc(c.venue)}</span>
            <span class="mn-conv__btn">Explore Convention ${ARROW}</span></span>
        </a></li>`).join('')}</ol>
      <p class="mn-pg-note" data-rise>${DISCLAIMER}</p>
    </div></section>
    ${chips('')}`,
});
const shortQuick = ['lac-bangle-making', 'pearl-jewellery-making', 'deccani-calligraphy', 'perini-dance', 'telangana-folk-performance', 'cheriyal-mask-making'].map((s) => offers.quick.find((q) => q.slug === s));
const row = (href, name, meta) => `<li><a href="${href}"><span>${esc(name)}</span><small>${esc(meta)}</small></a></li>`;
for (const c of conventions) {
  const list = c.tours.map((s) => tourBy[s]).filter(Boolean);
  const full = list.filter((t) => t.duration.startsWith('8')), half = list.filter((t) => !t.duration.startsWith('8'));
  const stops = [
    ['Before', 'you begin', 'Arriving early? Give the city a full day.', full.map((t) => row(`/tours/${t.slug}`, t.name, t.duration))],
    ['During', 'the conference', 'Experiences designed to fit around your conference schedule.', shortQuick.map((q) => row(`/experiences/quick/${q.slug}`, q.name, q.len))],
    ['After', 'the last session', 'Staying longer? Half days for the hours you have left.', half.map((t) => row(`/tours/${t.slug}`, t.name, t.duration))],
  ];
  page(`/conventions/${c.slug}`, {
    title: c.name, desc: `${c.dates}, ${c.venue}. Delegate experiences before, during and after the conference.`, og: img('conventions', c.slug + '.jpg'),
    body: `${hero({ title: halves(c.name), sub: `${c.dates} · ${c.venue}`, group: 'conventions', name: c.slug, alt: '' })}
    <section class="mn-pg-sec mn-pg-intro"><div class="mn-m-jaali mn-pg-intro__bg" aria-hidden="true"></div><div class="mn-wrap mn-pg-intro__in" data-rise>
      <p class="mn-pg-lead">${esc(c.desc)}</p>
      <p class="mn-pg-note" data-tentative>Tentative dates. ${DISCLAIMER}</p>
      <p class="mn-pg-note" data-ended="${c.end}" hidden>This event has ended. The plans below still work for any visit to Hyderabad.</p>
    </div></section>
    <section class="mn-pg-sec mn-pg-sec--flush"><div class="mn-wrap">
      ${head2('Your conference', 'week', 'Delegate experiences shaped around your conference: before, during, after.')}
      <ol class="mn-pg-week" role="list">${stops.map(([a, b, line, rows]) => `<li class="mn-pg-week__stop" data-rise-item><h3 class="mn-pg-h3">${a} <em>${b}</em></h3><p>${line}</p><ul class="mn-pg-rows" role="list">${rows.join('')}</ul></li>`).join('')}</ol>
    </div></section>
    ${chips(c.name)}`,
  });
}

/* ---------- Originals ---------- */
page('/originals', {
  title: 'Asli Originals', desc: 'Only in Hyderabad. Only with Asli. Signature experiences running on a regular calendar.', og: '/assets/video/originals/table.jpg',
  body: `${hero({ title: 'Only in Hyderabad. <em>Only with Asli.</em>', sub: 'Signature experiences created by Asli Hyderabad. Running on a regular calendar.', video: '/assets/video/originals/table.mp4', poster: '/assets/video/originals/table.jpg', alt: 'A long table set for dinner' })}
    <section class="mn-pg-cal" aria-label="The Originals calendar"><div class="mn-wrap"><ol class="mn-pg-cal__row" role="list" data-rise>${originals.map((o) => `<li><a href="/originals/${o.slug}"><span class="mn-pg-cal__day">${esc(o.day)}</span><span class="mn-pg-cal__slot">${esc(o.slot)}</span><span class="mn-pg-cal__name">${esc(o.name)}</span></a></li>`).join('')}</ol></div></section>
    <section class="mn-pg-sec"><div class="mn-wrap mn-pg-alts">${originals.map((o) => `<article class="mn-pg-alt" data-rise-item>
        <a class="mn-pg-alt__media" href="/originals/${o.slug}" tabindex="-1" aria-hidden="true"><img src="/assets/img/originals/${o.key}.jpg" alt="" width="720" height="840" loading="lazy" decoding="async"></a>
        <div class="mn-pg-alt__text"><h2 class="mn-pg-h2">${halves(o.name)}</h2><p class="mn-pg-alt__when">${esc(o.short)}</p><p class="mn-pg-lead">${esc(o.tagline)}</p><a class="mn-ulink" href="/originals/${o.slug}">Explore <span class="mn-sr">${esc(o.name)}</span></a></div>
      </article>`).join('')}</div></section>`,
});
for (const o of originals) {
  page(`/originals/${o.slug}`, {
    title: o.name, desc: `${o.tagline} ${o.intro}`.slice(0, 155), og: `/assets/video/originals/${o.key}.jpg`,
    body: `${hero({ title: halves(o.name), sub: o.tagline, video: `/assets/video/originals/${o.key}.mp4`, poster: `/assets/video/originals/${o.key}.jpg`, alt: o.name })}
    <div class="mn-wrap mn-pg-split">
      <div class="mn-pg-split__main">
        <p class="mn-pg-when" data-rise>${esc(o.when)} <em>${esc(o.time)}</em></p>
        <div class="mn-pg-prose mn-pg-prose--lg" data-rise><p>${esc(o.intro)}</p></div>
        <section class="mn-pg-block mn-pg-cols" data-rise>
          <div><h2 class="mn-pg-h3">The <em>experience</em></h2><ul class="mn-pg-list mn-pg-list--tick" role="list">${li(o.experience)}</ul></div>
          <div><h2 class="mn-pg-h3">Best <em>for</em></h2><ul class="mn-pg-list" role="list">${li(o.best)}</ul></div>
        </section>
        <section class="mn-pg-block mn-pg-cols" data-rise>
          <div><h2 class="mn-pg-h3">What’s <em>included</em></h2><ul class="mn-pg-list mn-pg-list--tick" role="list">${li(o.includes)}</ul></div>
          <div><h2 class="mn-pg-h3">${esc(o.whereLabel.split(' ')[0])} <em>${esc(o.whereLabel.split(' ').slice(1).join(' ') || 'details')}</em></h2><p class="mn-pg-para">${esc(o.where)}</p></div>
        </section>
      </div>
      ${bookCard({ price: priceOf(o), meta: `${o.len} · per person`, href: book(o.slug), label: o.cta })}
    </div>`,
  });
}

/* ---------- Services ---------- */
const NEED = 'Group transport · restaurant reservations · gifting · celebrations · translators · private access · delegate assistance';
const optionNames = (s) => s.options.map((o) => o.name).join(' · ');
const svcRow = (s, i) => `<li data-rise-item><a class="mn-pg-svc__row" href="/services/${s.slug}">
        <span class="mn-pg-svc__num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
        <span class="mn-pg-svc__photo"><img src="${img('services', s.slug + '-1000.jpg')}" alt="" width="1000" height="667" loading="lazy" decoding="async"></span>
        <span class="mn-pg-svc__name">${esc(s.name)}</span>
        <span class="mn-pg-svc__opts">${esc(optionNames(s))}</span>
        <span class="mn-pg-svc__go" aria-hidden="true">→</span>
      </a></li>`;
const serviceBy = Object.fromEntries(services.map((s) => [s.slug, s]));
page('/services', {
  title: 'Add-ons & Services', desc: 'Everything you need to experience Hyderabad, seamlessly.', og: img('heroes', 'services.jpg'),
  body: `${hero({ title: 'Add-ons <em>&amp; services.</em>', sub: 'Everything you need to experience Hyderabad, seamlessly.', group: 'heroes', name: 'services', alt: 'A chauffeured car waiting in Hyderabad' })}
    <section class="mn-pg-sec"><div class="mn-wrap"><ol class="mn-pg-svc" role="list">${services.map(svcRow).join('')}</ol></div></section>
    <section class="mn-pg-sec mn-pg-need"><div class="mn-wrap">${head2('Need', 'something else?', NEED)}<a class="mn-ulink" href="${topic('Something else')}" data-rise>Ask Asli</a></div></section>`,
});
for (const s of services) {
  page(`/services/${s.slug}`, {
    title: s.name, desc: s.intro.slice(0, 155), og: img('services', s.slug + '.jpg'),
    body: `${hero({ title: halves(s.name), sub: s.tagline, group: 'services', name: s.slug, alt: s.name })}
    <div class="mn-wrap mn-pg-split">
      <div class="mn-pg-split__main">
        <section class="mn-pg-block mn-pg-block--first">${head2('About this', 'service')}<div class="mn-pg-prose" data-rise><p>${esc(s.intro)}</p></div></section>
        <section class="mn-pg-block" data-rise><h2 class="mn-pg-h3">Choose <em>your option</em></h2>
          <ul class="mn-pg-optcards" role="list">${s.options.map((o) => `<li><a href="${book(s.slug)}&amp;option=${encodeURIComponent(o.name)}"><span class="mn-pg-optcards__name">${esc(o.name)}</span><span class="mn-pg-optcards__line">${esc(o.line)}</span><span class="mn-pg-optcards__go">${esc(s.cta)} ${ARROW}</span></a></li>`).join('')}</ul>
        </section>
        ${route('How it', 'works', s.how)}
        <section class="mn-pg-block mn-pg-cols" data-rise>
          <div><h2 class="mn-pg-h3">What <em>to tell us</em></h2><ul class="mn-pg-list" role="list">${li(s.share)}</ul></div>
          <div><h2 class="mn-pg-h3">Confirmed <em>before booking</em></h2><ul class="mn-pg-list mn-pg-list--tick" role="list">${li(s.confirmed)}</ul></div>
        </section>
        <section class="mn-pg-block" data-rise><h2 class="mn-pg-h3">Arranged <em>separately</em></h2><ul class="mn-pg-list" role="list">${li(s.separate)}</ul></section>
      </div>
      ${bookCard({ price: priceOf(s), meta: optionNames(s), href: book(s.slug), label: s.cta })}
    </div>
    <section class="mn-pg-sec mn-pg-sec--tint"><div class="mn-wrap">
      <div class="mn-pg-headrow">${head2('Goes well', 'with')}<a class="mn-ulink" href="/services">All services</a></div>
      <ol class="mn-pg-svc" role="list">${s.related.map((r, i) => svcRow(serviceBy[r], i)).join('')}</ol>
    </div></section>`,
  });
}

/* ---------- Partners, Private Access, Gallery ---------- */
page('/partners', {
  title: 'Featured Brands', desc: 'Handpicked names that represent the best of Hyderabad.', og: img('heroes', 'partners.jpg'),
  body: `${hero({ title: 'Featured brands <em>of Hyderabad.</em>', sub: 'Handpicked names that represent the best of Hyderabad.', group: 'heroes', name: 'partners', alt: 'Taj Falaknuma Palace' })}
    <section class="mn-pg-sec"><div class="mn-wrap">
      <p class="mn-pg-lead mn-pg-lead--c" data-rise>A select circle of brands chosen by Asli Hyderabad for their distinctive character, quality and connection to the city. Together, we create special experiences and help our guests discover Hyderabad at its best.</p>
      <ul class="mn-brands__grid mn-pg-brands" role="list">${partners.map((p) => `<li class="mn-brand" data-rise-item>
          <span class="mn-brand__logo"><img class="mn-brand__ink" src="/assets/img/brands/${p.logo}-ink.png" alt="${esc(p.name)}" width="${p.w}" height="${p.h}" loading="lazy"><img class="mn-brand__colour" src="/assets/img/brands/${p.logo}.png" alt="" aria-hidden="true" loading="lazy"></span>
          <span class="mn-brand__name"><a class="mn-brand__a" href="${p.url}" target="_blank" rel="noopener">${esc(p.name)}<span class="mn-sr"> (opens in a new tab)</span></a></span>
          <span class="mn-brand__cat">${esc(p.cat)}</span>
          <a class="mn-pg-brandabout" href="/partners/${p.slug}">About<span class="mn-sr"> ${esc(p.name)}</span></a>
        </li>`).join('')}</ul>
    </div></section>`,
});
for (const p of partners) {
  const exp = offers.cocurated.find((c) => c.slug === p.exp);
  const cta = exp ? { href: `/experiences/co-curated/${exp.slug}`, label: 'See the experience', meta: exp.name } : { href: p.ctaHref, label: p.ctaLabel, meta: p.ctaMeta };
  page(`/partners/${p.slug}`, {
    title: p.name, desc: p.about[0].slice(0, 155), og: p.photo,
    body: `${portraitHero({ title: halves(p.name), sub: p.cat, src: p.photo, alt: p.alt, logo: p.logo })}
    <div class="mn-wrap mn-pg-split">
      <div class="mn-pg-split__main">
        <section class="mn-pg-block mn-pg-block--first">${head2('About', p.name)}<div class="mn-pg-prose" data-rise>${paras(p.about)}</div><p class="mn-pg-brandsite" data-rise><a class="mn-ulink" href="${p.url}" target="_blank" rel="noopener">Visit official website<span class="mn-sr"> (opens in a new tab)</span></a></p></section>
        ${exp ? `<section class="mn-pg-block">${head2('With', 'Asli Hyderabad')}<ul class="mn-pg-cards mn-pg-cards--one" role="list">${ccCard(exp)}</ul></section>` : ''}
      </div>
      <aside class="mn-pg-book" data-bookbar><div class="mn-pg-book__card">
        <p class="mn-pg-book__price mn-pg-book__price--text">${esc(cta.meta)}</p>
        <a class="mn-pg-book__cta" href="${cta.href}">${esc(cta.label)} ${ARROW}</a>
      </div></aside>
    </div>
    <section class="mn-pg-sec mn-pg-sec--tint"><div class="mn-wrap">
      <div class="mn-pg-headrow">${head2('Keep', 'exploring')}<a class="mn-ulink" href="/partners">All featured brands</a></div>
      <ul class="mn-pg-cards" role="list">${p.tours.map((s) => tourCard(tourBy[s])).join('')}</ul>
    </div></section>`,
  });
}
page('/private-access', {
  title: 'Private Access', cls: 'mn-pg--ink', desc: 'Rare encounters. Remarkable people. Hyderabad, behind closed doors.', og: img('heroes', 'private-access.jpg'),
  body: `${hero({ title: 'Hyderabad, <em>behind closed doors.</em>', sub: 'Rare encounters. Remarkable people.', group: 'heroes', name: 'private-access', alt: 'The chandeliered durbar hall at Chowmahalla Palace' })}
    <section class="mn-pg-sec"><div class="mn-wrap mn-pg-access">
      <ol class="mn-pg-access__list" role="list">${privateAccess.filter((p) => p.show).map((p, i) => `<li data-rise-item><span class="mn-pg-access__num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span><div><h2 class="mn-pg-h2">${halves(p.name)}</h2><p>${esc(p.line)}</p></div></li>`).join('')}</ol>
      <div class="mn-pg-access__foot" data-rise>
        <p class="mn-pg-access__by">By request only</p>
        <p>Every Private Access experience is individually curated and subject to host availability, permissions and confirmation. Including film and studio access, and documentary and editorial access.</p>
        <a class="mn-btn mn-pg-access__cta" href="${topic('Private Access request')}">Request Access</a>
      </div>
    </div></section>`,
});
page('/gallery', {
  title: 'Gallery', desc: 'Hyderabad through our lens: guests, delegates, places and everyday moments.', og: img('heroes', 'gallery.jpg'),
  body: `${hero({ title: 'Experience Asli, <em>in pictures.</em>', sub: 'Hyderabad through our lens.', group: 'heroes', name: 'gallery', alt: 'Guests choosing bangles in a Laad Bazaar shop' })}
    <section class="mn-pg-sec"><div class="mn-wrap">${galleryGrid(gallery)}</div></section>`,
});

/* ---------- Forms ---------- */
const field = (id, label, input, cls = '') => `<div class="mn-pg-field${cls}"><label for="${id}">${label}</label>${input}</div>`;
const input = (id, type, extra = 'required') => `<input id="${id}" name="${id}" type="${type}" ${extra}>`;
const SENT = `<div class="mn-pg-sent" data-form-sent hidden tabindex="-1"><p class="mn-pg-h3">WhatsApp has opened with <em>your request.</em></p><p>Press Send there to reach us. Prefer email? <a data-form-mail href="mailto:sahana@aslihyd.in">Send the same request by email</a>, or <a data-form-wa href="https://wa.me/919392149872" target="_blank" rel="noopener">open WhatsApp again</a>.</p></div>`;
const CONTACT_ASIDE = `<ul class="mn-pg-contact" role="list">
          <li><span>Call</span><a href="tel:+919392149872">+91 93921 49872</a></li>
          <li><span>WhatsApp</span><a href="https://wa.me/919392149872" target="_blank" rel="noopener">Chat with the Asli team</a></li>
          <li><span>Email</span><a href="mailto:sahana@aslihyd.in">sahana@aslihyd.in</a></li>
          <li><span>Location</span>Hyderabad, Telangana, India</li>
        </ul>`;
const optgroup = (label, items) => `<optgroup label="${esc(label)}">${items.map(([v, n]) => `<option value="${v}">${esc(n)}</option>`).join('')}</optgroup>`;
const EXPERIENCES = optgroup('Tours', tours.map((t) => [t.slug, t.name])) + optgroup('Asli Originals', originals.map((o) => [o.slug, o.name]))
  + optgroup('Co-curated Experiences', offers.cocurated.map((c) => [c.slug, c.name])) + optgroup('Quick Experiences', offers.quick.map((q) => [q.slug, q.name]))
  + optgroup('Add-ons & Services', services.map((s) => [s.slug, s.name]));
page('/book-now', {
  title: 'Plan My Hyderabad', desc: 'Tell us which experience interests you and our team will help plan the right departure.', og: img('heroes', 'book-now.jpg'),
  body: `${hero({ title: 'Let’s curate <em>your Hyderabad.</em>', sub: 'Tell us which experience interests you and our team will help plan the right departure.', group: 'heroes', name: 'book-now', alt: 'The Charminar skyline at dusk' })}
    <section class="mn-pg-sec"><div class="mn-wrap mn-pg-formwrap">
      <div data-rise><h2 class="mn-pg-h2">Talk to <em>the Asli team.</em></h2><p class="mn-pg-lead">Dates still open? Tell us what you have in mind and we will shape the days with you.</p>${CONTACT_ASIDE}</div>
      <div data-rise><form class="mn-pg-form" data-enquiry="Plan My Hyderabad request">
        ${field('experience', 'Experience', `<select id="experience" name="experience"><option value="">Help me choose</option>${EXPERIENCES}</select>`, ' mn-pg-field--full')}
        ${field('name', 'Your name', input('name', 'text', 'required autocomplete="name"'))}
        ${field('email', 'Email', input('email', 'email', 'required autocomplete="email"'))}
        ${field('phone', 'Mobile', input('phone', 'tel', 'required autocomplete="tel"'))}
        ${field('guests', 'Guests', `<select id="guests" name="guests" required>${['1', '2', '3', '4', '5', '6+'].map((n) => `<option>${n}</option>`).join('')}</select>`)}
        ${field('date', 'Preferred date', input('date', 'date', ''))}
        ${field('notes', 'Notes', '<textarea id="notes" name="notes" rows="4" placeholder="For events: your venue and headcount"></textarea>', ' mn-pg-field--full')}
        <button class="mn-pg-submit" type="submit">Submit booking request ${ARROW}</button>
      </form>${SENT}</div>
    </div></section>`,
});
page('/contact', {
  title: 'Contact', desc: 'Tell us what you have in mind: an experience, a conference programme or a private group visit.', og: img('heroes', 'contact.jpg'),
  body: `${hero({ title: 'Let’s plan <em>something memorable.</em>', sub: 'Tell us what you have in mind: an experience, a conference programme or a private group visit, and our local team will be in touch.', group: 'heroes', name: 'contact', alt: 'The Charminar skyline at dusk' })}
    <section class="mn-pg-sec"><div class="mn-wrap mn-pg-formwrap">
      <div data-rise><h2 class="mn-pg-h2">Talk to <em>the Asli team.</em></h2><p class="mn-pg-lead">For destination experiences, partnerships and tailored Hyderabad programmes.</p>${CONTACT_ASIDE}</div>
      <div data-rise><h2 class="mn-pg-h3">Send <em>an enquiry</em></h2><p class="mn-pg-para">We usually reply with the right next steps within one working day.</p><form class="mn-pg-form" data-enquiry="Website enquiry">
        ${field('name', 'Your name', input('name', 'text', 'required autocomplete="name"'))}
        ${field('email', 'Email', input('email', 'email', 'required autocomplete="email"'))}
        ${field('phone', 'Mobile (optional)', input('phone', 'tel', 'autocomplete="tel"'), ' mn-pg-field--full')}
        ${field('message', 'Message', '<textarea id="message" name="message" rows="5" required></textarea>', ' mn-pg-field--full')}
        <button class="mn-pg-submit" type="submit">Send enquiry ${ARROW}</button>
      </form>${SENT}</div>
    </div></section>`,
});
for (const [slug, l] of Object.entries(legal)) {
  page(`/${slug}`, {
    title: `${l.titleA} ${l.titleB}`, desc: l.desc, og: img('heroes', 'contact.jpg'),
    body: `    <section class="mn-pg-legalhead"><div class="mn-wrap"><h1 class="mn-pg-hero__title">${esc(l.titleA)} <em>${esc(l.titleB)}</em></h1><p class="mn-pg-hero__sub">Last updated ${esc(l.updated)}</p></div></section>
    <section class="mn-pg-sec"><div class="mn-wrap"><div class="mn-pg-legal">${l.sections.map((s) => `<h2 class="mn-pg-h3">${esc(s.h)}</h2>${s.p.map((x) => `<p>${esc(x)}</p>`).join('')}`).join('\n')}</div></div></section>`,
  });
}
page('/404', {
  title: 'Page not found', desc: 'This lane does not go anywhere.', og: img('heroes', '404.jpg'),
  body: `${hero({ title: 'This lane <em>doesn’t go anywhere.</em>', sub: 'The page you were looking for has moved, or never existed.', group: 'heroes', name: '404', alt: 'A busy bazaar street in Old Hyderabad', tall: true })}
    <section class="mn-pg-sec"><div class="mn-wrap mn-pg-lost" data-rise><a class="mn-ulink" href="/">Back to the homepage</a><a class="mn-ulink" href="/tours">See all tours</a></div></section>`,
});

/* ---------- Write ---------- */
for (const d of GENERATED) rmSync(join(ROOT, d), { recursive: true, force: true });
const fileOf = (p) => (p === '/404' ? join(ROOT, '404.html') : join(ROOT, p.slice(1), 'index.html'));
for (const [p, html] of written) { mkdirSync(dirname(fileOf(p)), { recursive: true }); wr(fileOf(p), html); }

wr(join(ROOT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${['/', ...[...written.keys()].filter((p) => p !== '/404')].map((p) => `  <url><loc>${SITE}${p}</loc></url>`).join('\n')}\n</urlset>\n`);
wr(join(ROOT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);

/* ---------- The swap list: every record still holding placeholder copy ("draft" in data/*.json) ---------- */
const DRAFT_GROUPS = [
  ['Tours', 'data/tours.json', tours, (r) => `/tours/${r.slug}`],
  ['Co-curated experiences', 'data/offers.json', offers.cocurated, (r) => `/experiences/co-curated/${r.slug}`],
  ['Quick experiences', 'data/offers.json', offers.quick, (r) => `/experiences/quick/${r.slug}`],
  ['Asli Originals', 'data/originals.json', originals, (r) => `/originals/${r.slug}`],
  ['Conventions', 'data/conventions.json', conventions, (r) => `/conventions/${r.slug}`],
  ['Services', 'data/services.json', services, (r) => `/services/${r.slug}`],
  ['Featured brands', 'data/partners.json', partners, (r) => `/partners/${r.slug}`],
  ['Legal', 'data/legal.json', Object.entries(legal).map(([slug, l]) => ({ ...l, slug, name: `${l.titleA} ${l.titleB}` })), (r) => `/${r.slug}`],
];
const unpriced = [tours, offers.cocurated, offers.quick, originals, services].flat().filter((r) => !r.price).length;
wr(join(ROOT, 'docs/CONTENT-TO-REPLACE.md'), `# Content to replace

Generated by \`tools/build-pages.mjs\`: do not edit this file. To swap in real content, edit the record in its data file, delete its \`"draft"\` line, and run \`node tools/build-pages.mjs\`. It then drops off this list.

Records without a \`"price"\` field show "${PRICE}": ${unpriced} at the moment.

${DRAFT_GROUPS.map(([label, file, rows, url]) => {
    const drafts = rows.filter((r) => r.draft);
    return drafts.length ? `## ${label} (${drafts.length}), \`${file}\`\n\n${drafts.map((r) => `- [ ] [${r.name}](${SITE}${url(r)}): ${r.draft}`).join('\n')}\n` : '';
  }).filter(Boolean).join('\n')}
## Short lines written in the templates or data

- [ ] Before and After lines on convention pages, and the 404 page: \`tools/build-pages.mjs\`
- [ ] Theme and gallery captions: \`data/themes.json\`, \`data/gallery.json\`
- [ ] "Hyderabad, hosted." title on \`/tours\`: \`tools/build-pages.mjs\`
`);

/* ---------- Self-check: every internal reference on every page must resolve ---------- */
const problems = [];
const homeLocal = home.replace(/\b(src|href|poster|data-[a-z-]+)="assets\//g, '$1="/assets/');
const all = [...written, ['/', homeLocal]];
const idsOf = (h) => new Set([...h.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
const pageHtml = new Map(all);
for (const [p, html] of all) {
  const noComments = html.replace(/<!--[\s\S]*?-->/g, '');
  if (/\bhref="#"/.test(noComments)) problems.push(`${p}: a link goes nowhere (href="#")`);
  const refs = [...noComments.matchAll(/\b(?:src|href|poster|data-src|data-full|data-color|data-video|data-poster)="([^"]+)"/g)].map((m) => m[1]);
  for (const srcset of noComments.matchAll(/\bsrcset="([^"]+)"/g)) refs.push(...srcset[1].split(',').map((s) => s.trim().split(' ')[0]));
  for (const raw of refs) {
    if (!raw.startsWith('/')) continue;
    const [pathq, hash] = raw.split('#');
    const clean = decodeURIComponent(pathq.split('?')[0]).replace(/\/$/, '') || '/';
    const onDisk = join(ROOT, clean);
    const ok = clean === '/' || pageHtml.has(clean) || (existsSync(onDisk) && statSync(onDisk).isFile()) || existsSync(join(onDisk, 'index.html'));
    if (!ok) problems.push(`${p}: ${raw}`);
    else if (hash && pageHtml.has(clean) && !idsOf(pageHtml.get(clean)).has(hash)) problems.push(`${p}: missing anchor ${raw}`);
  }
}
console.log(`${written.size} pages written`);
if (problems.length) {
  console.log([...new Set(problems)].map((x) => '  BROKEN ' + x).join('\n'));
  console.log(`${new Set(problems).size} broken references`);
  process.exit(1);
}
console.log('all internal links and images resolve');
