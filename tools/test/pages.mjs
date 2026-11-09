// Inner pages: every generated page at three sizes, then the interactions.
//   node server.js 8671
//   node tools/test/pages.mjs http://127.0.0.1:8671 C:/abs/out [--pages-only|--interactions-only]
import { readdirSync, existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { launch, sleep } from './cdp.mjs';

const BASE = process.argv[2] || 'http://127.0.0.1:8671';
const OUT = process.argv[3];
const only = process.argv[4] || '';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const SIZES = [[1440, 900], [1280, 720], [390, 844]];

function urls() {
  const found = [];
  const walk = (rel) => {
    if (existsSync(join(ROOT, rel, 'index.html'))) found.push('/' + rel);
    for (const e of readdirSync(join(ROOT, rel), { withFileTypes: true })) if (e.isDirectory()) walk(join(rel, e.name).replace(/\\/g, '/'));
  };
  ['tours', 'experiences', 'conventions', 'originals', 'services', 'partners', 'private-access', 'gallery', 'contact', 'book-now', 'privacy', 'terms'].forEach(walk);
  return found;
}

let pass = 0, fail = 0;
const ok = (cond, msg) => { if (cond) pass++; else { fail++; console.log('FAIL', msg); } };

const AUDIT = `(async () => {
  document.querySelectorAll('img[loading="lazy"]').forEach((i) => { i.loading = 'eager'; });
  await Promise.all([...document.images].map((i) => i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; setTimeout(r, 8000); })));
  return {
    docW: document.documentElement.scrollWidth, vw: innerWidth,
    h1: document.querySelectorAll('h1').length,
    eyebrow: document.querySelectorAll('[class*="eyebrow"]').length,
    broken: [...document.images].filter((i) => i.getAttribute('src') && i.complete && !i.naturalWidth).map((i) => i.currentSrc || i.src),
    blankEm: [...document.querySelectorAll('main li, main p, main h2, main h3')].filter((e) => !e.textContent.trim() && !e.querySelector('img,svg,video') && !e.matches('[role="status"]') && !e.closest('[hidden]')).length,
    smallTargets: [...document.querySelectorAll('main .mn-pg-tabs button, main .mn-pg-chips a, main .mn-pg-submit, main .mn-pg-book__cta, main .mn-pg-optcards a, main .mn-pg-btn, main .mn-pg-actions .mn-ulink, main .mn-pg-after .mn-ulink, main .mn-pg-crumbs a, main .mn-pg-faq summary, main .mn-pg-access__ask')].filter((e) => { const r = e.getBoundingClientRect(); return r.height && r.height < 43.9; }).map((e) => (e.className || e.tagName) + ' "' + e.textContent.trim().slice(0, 24) + '" ' + e.getBoundingClientRect().height),
  };
})()`;

async function pages() {
  const b = await launch({ out: OUT, port: 9371 });
  for (const url of urls().concat('/404-does-not-exist')) {
    for (const [w, h] of SIZES) {
      b.logs.length = 0;
      await b.load(w, h, { url: BASE + url, touch: w < 500 });
      const a = await b.ev(AUDIT);
      const where = `${url} @${w}`;
      const logs = b.logs.filter((l) => !(url.startsWith('/404') && l.includes('404')));
      ok(!logs.length, `${where} console: ${logs.join(' | ').slice(0, 300)}`);
      ok(a.docW === a.vw, `${where} sideways scroll ${a.docW} > ${a.vw}`);
      ok(a.h1 === 1, `${where} h1 count ${a.h1}`);
      ok(a.eyebrow === 0, `${where} has an eyebrow`);
      ok(!a.broken.length, `${where} broken images ${a.broken.slice(0, 3)}`);
      ok(a.blankEm === 0, `${where} ${a.blankEm} empty text elements`);
      ok(!a.smallTargets.length, `${where} targets under 44px: ${a.smallTargets.join(', ')}`);
    }
  }
  b.close();
}

async function interactions() {
  const b = await launch({ out: OUT, port: 9372 });
  const go = (url, w = 1440, h = 900, o = {}) => b.load(w, h, { url: BASE + url, ...o });
  const shown = `[...document.querySelectorAll('[data-tags]')].filter((c) => !c.hidden).length`;

  await go('/tours');
  ok(await b.ev(shown) === 15, 'tours: all 15 listed');
  await b.ev(`document.querySelector('[data-filter="evening"]').click()`); await sleep(200);
  ok(await b.ev(shown) === 1, 'tours: Evening shows one');
  ok(await b.ev(`document.querySelector('[data-filter-status]').textContent`) === '1 tour shown', 'tours: status announced');
  ok(await b.ev(`getComputedStyle(document.querySelector('[data-tags]:not([hidden])')).opacity`) === '1', 'tours: filtered card is visible');
  await b.ev(`document.querySelector('[data-filter="all"]').click()`); await sleep(200);
  ok(await b.ev(shown) === 15, 'tours: All restores');
  ok(!await b.ev(`document.documentElement.classList.contains('mn-arch')`), 'hero: arch mask removed after opening');

  // Back button returns to the same place in the list.
  await b.jump(1400); await sleep(900);
  const before = await b.ev('scrollY');
  await b.ev(`location.href = '/tours/old-hyderabad'`); await sleep(2200);
  await b.ev('history.back()'); await sleep(2500);
  ok(Math.abs(await b.ev('scrollY') - before) < 250, `back button keeps position (${before} -> ${await b.ev('scrollY')})`);

  // Route thread draws through every stop.
  await go('/tours/old-hyderabad');
  const end = await b.pageTop('.mn-pg-cols');
  await b.walkTo(end);
  await sleep(900);
  const lit = await b.ev(`[document.querySelectorAll('[data-stop].is-lit').length, document.querySelectorAll('[data-stop]').length]`);
  ok(lit[0] === lit[1] && lit[1] > 1, `route: all stops lit ${lit}`);

  // Booking form.
  await go('/book-now?experience=old-hyderabad');
  ok(await b.ev(`document.querySelector('#experience').value`) === 'old-hyderabad', 'book: ?experience preselects');
  await b.walkTo(await b.pageTop('[data-enquiry]') - 200, 30); await sleep(1300); // reveal it first: a guest can't submit what they can't see
  await b.ev(`window.__open = []; window.open = (u) => { window.__open.push(u); return null; }; document.querySelector('[data-enquiry]').requestSubmit();`);
  await sleep(200);
  ok((await b.ev('window.__open.length')) === 0, 'book: empty form does not send');
  await b.ev(`(() => { const f = document.querySelector('[data-enquiry]'); f.name.value = 'Test Guest'; f.email.value = 'guest@example.com'; f.phone.value = '+91 90000 00000'; f.notes.value = 'Two & a half days?'; f.requestSubmit(); })()`);
  await sleep(300);
  const sentUrl = await b.ev('window.__open[0]');
  ok(/^https:\/\/wa\.me\/919392149872\?text=/.test(sentUrl || ''), 'book: opens WhatsApp');
  const text = decodeURIComponent((sentUrl || '').split('text=')[1] || '');
  ok(text.includes('Experience: Old Hyderabad') && text.includes('Your name: Test Guest') && text.includes('Two & a half days?'), `book: message text: ${text}`);
  ok(await b.ev(`!document.querySelector('[data-form-sent]').hidden && document.querySelector('[data-enquiry]').hidden`), 'book: confirmation replaces form');
  ok(await b.ev(`document.querySelector('[data-form-mail]').href.startsWith('mailto:sahana@aslihyd.in?subject=')`), 'book: email fallback filled');
  ok(await b.ev(`document.querySelector('[data-form-wa]').href.includes('text=')`), 'book: WhatsApp retry link filled');
  await go('/book-now?experience=nonsense');
  ok(await b.ev(`document.querySelector('#experience').selectedIndex`) === 0, 'book: bad slug falls back');
  await go('/contact?topic=Private%20Access%20request');
  ok(await b.ev(`document.querySelector('#message').value`) === 'Private Access request', 'contact: ?topic prefills');

  // A service option books that option, and says so in the request.
  await go('/services/personal-chauffeur');
  const optHref = await b.ev(`document.querySelector('.mn-pg-optcards a').getAttribute('href')`);
  ok(optHref === '/book-now?experience=personal-chauffeur&option=4%20hours', `service option link: ${optHref}`);
  await go(optHref);
  ok(await b.ev(`document.querySelector('#experience').value`) === 'personal-chauffeur', 'service option: experience preselected');
  ok(await b.ev(`document.querySelector('#notes').value`) === 'Option: 4 hours', 'service option: shown in notes');
  await b.walkTo(await b.pageTop('[data-enquiry]') - 200, 30); await sleep(1300);
  await b.ev(`window.__open = []; window.open = (u) => { window.__open.push(u); return null; }; (() => { const f = document.querySelector('[data-enquiry]'); f.name.value = 'Test Guest'; f.email.value = 'guest@example.com'; f.phone.value = '+91 90000 00000'; f.requestSubmit(); })()`);
  await sleep(300);
  ok(decodeURIComponent(((await b.ev('window.__open[0]')) || '').split('text=')[1] || '').includes('Option: 4 hours'), 'service option: reaches the WhatsApp text');

  // Experience card -> detail page -> Book carries the right experience.
  await go('/');
  ok(await b.ev(`document.querySelectorAll('.mn-arcade__link[href^="/experiences/quick/"]').length`) === 10, 'homepage: 10 quick cards open their pages');
  ok(await b.ev(`document.querySelectorAll('.mn-cc__link[href^="/experiences/co-curated/"]').length`) === 7, 'homepage: 7 co-curated cards open their pages');
  await go('/experiences/co-curated');
  ok(await b.ev(`document.querySelector('.mn-cc__link').getAttribute('href')`) === '/experiences/co-curated/high-tea-hyderabad', 'list card opens the detail page');
  await go('/experiences/co-curated/high-tea-hyderabad');
  const bookHref = await b.ev(`document.querySelector('.mn-pg-book__cta').getAttribute('href')`);
  ok(bookHref === '/book-now?experience=high-tea-hyderabad', `detail Book link: ${bookHref}`);
  await go(bookHref);
  ok(await b.ev(`document.querySelector('#experience').value`) === 'high-tea-hyderabad', 'detail Book preselects the experience');

  // Brand tiles open the brand's own site, in a new tab; "About" opens our page.
  await go('/partners');
  const offsite = `[...document.querySelectorAll('.mn-brand__a')].filter((a) => /^https:\\/\\//.test(a.getAttribute('href')) && a.target === '_blank' && a.rel.includes('noopener')).length`;
  ok(await b.ev(offsite) === 9, 'partners: 9 tiles open official sites');
  ok(await b.ev(`document.querySelectorAll('.mn-pg-brandabout[href^="/partners/"]').length`) === 9, 'partners: 9 About links');
  await b.walkTo(await b.pageTop('.mn-brand') - 200, 30); await sleep(1300); // elementFromPoint only sees what is on screen
  const hit = await b.ev(`(() => { const t = document.querySelector('.mn-brand'); const r = t.getBoundingClientRect(); return document.elementFromPoint(r.left + r.width / 2, r.top + 24).className; })()`);
  ok(hit === 'mn-brand__a', `partners: tile surface is the link (${hit})`);

  // Ended event says so; a coming one does not.
  await go('/conventions/gansid-international-congress-2026');
  ok(await b.ev(`!document.querySelector('[data-ended]').hidden && document.querySelector('[data-tentative]').hidden`), 'ended event: note replaces Tentative');
  await go('/conventions/bioasia-2027');
  ok(await b.ev(`document.querySelector('[data-ended]').hidden && !document.querySelector('[data-tentative]').hidden`), 'coming event: no ended note');

  // Lightbox by keyboard.
  await go('/gallery');
  await b.walkTo(await b.pageTop('[data-full]') - 200, 30); await sleep(1300);
  await b.ev(`document.querySelector('[data-full]').focus(); document.querySelector('[data-full]').click()`); await sleep(400);
  ok(await b.ev(`document.querySelector('[data-lb]').open`), 'lightbox: opens');
  const first = await b.ev(`document.querySelector('[data-lb-img]').src`);
  await b.key('ArrowRight', 'ArrowRight', 39); await sleep(200);
  ok(await b.ev(`document.querySelector('[data-lb-img]').src`) !== first, 'lightbox: arrow moves on');
  await b.key('Escape', 'Escape', 27); await sleep(300);
  ok(!await b.ev(`document.querySelector('[data-lb]').open`), 'lightbox: Esc closes');
  ok(await b.ev(`document.activeElement === document.querySelector('[data-full]')`), 'lightbox: focus returns to the photo');

  // The gallery filter narrows the photos, and the lightbox arrows stay inside it.
  await go('/gallery');
  ok(await b.ev(shown) === 48, 'gallery: all 48 photos');
  await b.ev(`document.querySelector('[data-filter="food"]').click()`); await sleep(200);
  ok(await b.ev(shown) === 6, 'gallery: Food shows six');
  ok(await b.ev(`document.querySelector('[data-filter-status]').textContent`) === '6 photos shown', 'gallery: status says photos');
  ok(await b.ev(`[...document.querySelectorAll('[data-tags][hidden]')].every((l) => !l.offsetHeight)`), 'gallery: filtered photos take no space');
  await b.walkTo(await b.pageTop('[data-tags]:not([hidden])') - 200, 30); await sleep(1300);
  await b.ev(`document.querySelector('[data-tags]:not([hidden]) [data-full]').click()`); await sleep(300);
  const lbFirst = await b.ev(`document.querySelector('[data-lb-img]').src`);
  for (let i = 0; i < 6; i++) { await b.key('ArrowRight', 'ArrowRight', 39); await sleep(60); }
  ok(await b.ev(`document.querySelector('[data-lb-img]').src`) === lbFirst, 'gallery: arrows loop inside the filter');
  await b.key('Escape', 'Escape', 27); await sleep(300);

  // Every template's hero has the action it promises, and its in-page link has somewhere to land.
  for (const [url, label, href, anchor] of [
    ['/tours/old-hyderabad', 'Book this tour', '/book-now?experience=old-hyderabad', '#route'],
    ['/experiences/heritage', 'See the routes', '#routes', ''],
    ['/experiences/quick/perini-dance', 'Book now', '/book-now?experience=perini-dance', '#unfolds'],
    ['/experiences/co-curated/high-tea-hyderabad', 'Book experience', '/book-now?experience=high-tea-hyderabad', '#unfolds'],
    ['/conventions/bioasia-2027', 'Plan my conference week', '/book-now?experience=bioasia-2027', '#week'],
    ['/originals/hyderabad-at-dawn', 'Book this Sunday', '/book-now?experience=hyderabad-at-dawn', '#schedule'],
    ['/services/custom-hyderabad-itinerary', 'Plan now', '/book-now?experience=custom-hyderabad-itinerary', '#options'],
    ['/partners/ramoji', 'See the experience', '/experiences/co-curated/behind-the-screen', ''],
    ['/private-access', 'Request Access', '/contact?topic=Private%20Access%20request#enquire', '#encounters'],
  ]) {
    await go(url);
    const h = await b.ev(`(() => { const a = document.querySelector('.mn-pg-actions .mn-pg-btn'); const l = document.querySelector('.mn-pg-actions .mn-ulink'); return { t: a.textContent.replace('→', '').trim(), h: a.getAttribute('href'), l: l ? l.getAttribute('href') : '' }; })()`);
    ok(h.t === label && h.h === href, `hero ${url}: ${h.t} -> ${h.h}`);
    if (anchor) ok(h.l === anchor && await b.ev(`!!document.querySelector(${JSON.stringify(anchor)})`), `hero ${url}: link ${h.l}`);
  }

  // An FAQ opens from the keyboard, and the page below it re-measures.
  await go('/tours/old-hyderabad');
  await b.walkTo(await b.pageTop('.mn-pg-faq') - 200, 40); await sleep(1300);
  await b.ev(`document.querySelector('.mn-pg-faq summary').focus()`);
  const before2 = await b.ev('document.documentElement.scrollHeight');
  await b.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, text: '\r' });
  await b.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
  await sleep(300);
  ok(await b.ev(`document.querySelector('.mn-pg-faq details').open`), 'faq: Enter opens it');
  ok(await b.ev('document.documentElement.scrollHeight') > before2, 'faq: page grows');

  // The card above the form follows the prefill and the dropdown.
  await go('/book-now?experience=old-hyderabad');
  ok(await b.ev(`!document.querySelector('[data-summary]').hidden && document.querySelector('[data-summary-name]').textContent === 'Old Hyderabad'`), 'book summary: shows the prefilled experience');
  ok(await b.ev(`document.querySelector('[data-summary-img]').naturalWidth >= 0 && document.querySelector('[data-summary-img]').getAttribute('src').includes('old-hyderabad')`), 'book summary: its photo');
  await b.ev(`(() => { const p = document.querySelector('#experience'); p.value = 'perini-dance'; p.dispatchEvent(new Event('change')); })()`); await sleep(150);
  ok(await b.ev(`document.querySelector('[data-summary-name]').textContent`) === 'Perini Dance', 'book summary: follows the dropdown');
  await b.ev(`(() => { const p = document.querySelector('#experience'); p.value = ''; p.dispatchEvent(new Event('change')); })()`); await sleep(150);
  ok(await b.ev(`document.querySelector('[data-summary]').hidden`), 'book summary: hides on Help me choose');
  await go('/book-now');
  ok(await b.ev(`document.querySelector('[data-summary]').hidden`), 'book summary: hidden with no choice');

  // A convention's button names the event all the way into the request.
  await go('/book-now?experience=bioasia-2027');
  await b.walkTo(await b.pageTop('[data-enquiry]') - 200, 30); await sleep(1300);
  await b.ev(`window.__open = []; window.open = (u) => { window.__open.push(u); return null; }; (() => { const f = document.querySelector('[data-enquiry]'); f.name.value = 'Test Guest'; f.email.value = 'guest@example.com'; f.phone.value = '+91 90000 00000'; f.requestSubmit(); })()`);
  await sleep(300);
  ok(decodeURIComponent(((await b.ev('window.__open[0]')) || '').split('text=')[1] || '').includes('Experience: BioAsia 2027'), 'convention: event reaches the WhatsApp text');

  // Each Private Access encounter asks for itself.
  await go('/private-access');
  const ask = await b.ev(`document.querySelector('.mn-pg-access__ask').getAttribute('href')`);
  ok(ask === '/contact?topic=Private%20Access%3A%20Meet%20Tollywood#enquire', `private access link: ${ask}`);
  await go(ask); await sleep(500);
  ok(await b.ev(`document.querySelector('#message').value`) === 'Private Access: Meet Tollywood', 'private access: prefilled');

  // Ended events stop promising a conference week.
  await go('/conventions/gansid-international-congress-2026');
  ok((await b.ev(`document.querySelector('.mn-pg-actions .mn-pg-btn').textContent`)).includes('Plan a Hyderabad visit'), 'ended event: button changes');
  await go('/conventions/bioasia-2027');
  ok((await b.ev(`document.querySelector('.mn-pg-actions .mn-pg-btn').textContent`)).includes('Plan my conference week'), 'coming event: button stays');

  // The twelve convention pages are not clones: each has its own picks.
  const picksOf = (slug) => readFileSync(join(ROOT, 'conventions', slug, 'index.html'), 'utf8').match(/Picked for[\s\S]*?<\/ul>/)[0];
  const convs = readdirSync(join(ROOT, 'conventions'), { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name);
  ok(convs.length === 12 && new Set(convs.map(picksOf)).size === 12, 'conventions: twelve different pages');

  // Conventions list has no finished events.
  await go('/conventions');
  ok(await b.ev(`[...document.querySelectorAll('.mn-conv__item')].every((i) => new Date(i.dataset.end + 'T00:00:00') >= new Date(new Date().toDateString()))`), 'conventions: past events dropped');

  // Anchors from the homepage cards.
  await go('/experiences/quick#perini-dance');
  await sleep(600);
  const r = await b.rect('#perini-dance');
  ok(r && r.y < r.vh && r.y + r.h > 0, `anchor lands on the card (${r && r.y})`);

  // Homepage card goes to the right place.
  await go('/');
  ok(await b.ev(`[...document.querySelectorAll('.mn-brand__a')].filter((a) => /^https:\\/\\//.test(a.getAttribute('href')) && a.target === '_blank' && a.rel.includes('noopener')).length`) === 9, 'homepage: 9 brand tiles open official sites');
  ok(await b.ev(`document.querySelectorAll('.mn-arcade__link[href="#"], .mn-cc__link[href="#"]').length`) === 0, 'homepage: no inert cards');

  // Phone: bar hides over the footer; drawer opens.
  await go('/tours/old-hyderabad', 390, 844, { touch: true });
  ok(await b.ev(`getComputedStyle(document.querySelector('[data-bookbar]')).position`) === 'fixed', 'phone: booking bar is fixed');
  ok(await b.ev(`document.querySelector('[data-bookbar]').classList.contains('is-away')`), 'phone: bar waits while the hero button is on screen');
  await b.jump(await b.pageTop('.mn-pg-why')); await sleep(1100);
  ok(!await b.ev(`document.querySelector('[data-bookbar]').classList.contains('is-away')`), 'phone: bar appears past the hero');
  await b.jump(await b.ev('document.documentElement.scrollHeight')); await sleep(1100);
  ok(await b.ev(`document.querySelector('[data-bookbar]').classList.contains('is-away')`), 'phone: bar leaves over the footer');
  await b.jump(await b.pageTop('.mn-pg-end')); await sleep(1100);
  ok(await b.ev(`document.querySelector('[data-bookbar]').classList.contains('is-away')`), 'phone: bar leaves over the closing band');
  await b.jump(await b.pageTop('.mn-pg-voice')); await sleep(1100);
  ok(!await b.ev(`document.querySelector('[data-bookbar]').classList.contains('is-away')`), 'phone: bar returns above the closing band');
  await b.jump(0); await sleep(700);
  await b.ev(`document.querySelector('[data-menu-toggle]').click()`); await sleep(700);
  ok(await b.ev(`(() => { const d = document.querySelector('.mn-header__drawer'); const r = d.getBoundingClientRect(); return r.left >= 0 && r.width > 200 && getComputedStyle(d).visibility !== 'hidden'; })()`), 'phone: drawer opens');

  // Reduced motion: everything complete from the start, no video.
  for (const url of ['/tours/old-hyderabad', '/experiences/heritage', '/originals/hyderabad-at-dawn', '/conventions', '/private-access', '/experiences/quick/perini-dance', '/services/personal-chauffeur', '/partners/ramoji', '/privacy']) {
    await go(url, 1440, 900, { reduce: true });
    const s = await b.ev(`({ arch: document.documentElement.classList.contains('mn-arch'),
      hidden: [...document.querySelectorAll('[data-rise],[data-rise-item]')].filter((e) => { const c = getComputedStyle(e); return c.opacity !== '1' || c.visibility === 'hidden'; }).length,
      video: !!document.querySelector('[data-hero-video]')?.getAttribute('src') })`);
    ok(!s.arch && !s.hidden && !s.video, `reduced motion ${url} ${JSON.stringify(s)}`);
  }
  ok(!b.logs.filter((l) => !/404/.test(l)).length, `interactions console: ${b.logs.join(' | ').slice(0, 300)}`);
  b.close();
}

if (only !== '--interactions-only') await pages();
if (only !== '--pages-only') await interactions();
console.log(`\n${pass}/${pass + fail} passed`);
process.exit(fail ? 1 : 0);
