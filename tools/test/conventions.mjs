// Section 3b, Conventions (one-screen card rail): past events (by data-end) removed, the rest in date order with no
// serial numbers, and no eyebrow anywhere on the page; the section is one screen tall with no art, the heading and the
// "All conventions" button rise in, with room above the cards, and the cards rise in. Desktop: the section holds while the page scroll carries the rail right to left until the last
// card meets the column edge; hover and keyboard focus light up the card's button; a click follows its link. Tablets and
// phones swipe the rail (no arrows); reduced motion swipes too, with arrows for a mouse; no sideways page scroll; clean console.
//
//   node tools/test/conventions.mjs http://127.0.0.1:8655/ C:/abs/out
import { launch, sleep } from './cdp.mjs';

const [url, out] = process.argv.slice(2);
if (!url || !out) { console.log('usage: node tools/test/conventions.mjs <url> <absOutDir>'); process.exit(1); }
const results = [];
const check = (name, ok, info) => { results.push(!!ok); console.log((ok ? 'PASS ' : 'FAIL ') + name + (ok ? '' : '  ' + JSON.stringify(info).slice(0, 700))); };
const S = `(()=>{const s=document.querySelector('[data-sec="conventions"]'),R=(e)=>{const r=e.getBoundingClientRect();return {l:Math.round(r.left),t:Math.round(r.top),r:Math.round(r.right),b:Math.round(r.bottom),w:Math.round(r.width),h:Math.round(r.height)}};
  const items=[...s.querySelectorAll('.mn-conv__item')],rail=s.querySelector('.mn-conv__rail'),navs=[...s.querySelectorAll('.mn-conv__nav')];
  const op=(e)=>+getComputedStyle(e).opacity,onScreen=(e)=>{const r=e.getBoundingClientRect();return r.right>0&&r.left<innerWidth&&r.bottom>0&&r.top<innerHeight};
  return {names:items.map(i=>i.querySelector('.mn-conv__name').textContent),hrefs:items.map(i=>new URL(i.querySelector('a').href).pathname),
    serials:s.querySelectorAll('.mn-conv__num').length+[...s.querySelectorAll('.mn-conv__card *')].filter(e=>!e.children.length&&/^\\s*\\d{1,2}\\s*$/.test(e.textContent)).length,
    eyebrows:document.querySelectorAll('[class*="eyebrow"]').length,pill:s.querySelectorAll('.mn-conv__pill').length,
    items:items.map(R),vis:items.map(onScreen),cardOp:items.map(i=>op(i.querySelector('.mn-conv__card'))),
    btnBg:items.map(i=>getComputedStyle(i.querySelector('.mn-conv__btn')).backgroundColor),
    imgs:items.map(i=>{const m=i.querySelector('img');return !onScreen(i)||(m.complete&&m.naturalWidth>0)}),
    artCount:s.querySelectorAll('.mn-conv__art,.mn-conv__photo').length,allBtn:R(s.querySelector('.mn-conv__all')),allOp:op(s.querySelector('.mn-conv__all')),more:R(s.querySelector('.mn-conv__more')),
    driven:s.classList.contains('is-driven'),scrollable:s.classList.contains('is-scrollable'),
    navShown:navs.map(n=>getComputedStyle(n).display!=='none'),navDisabled:navs.map(n=>n.disabled),
    railX:Math.round(new DOMMatrix(getComputedStyle(rail).transform).m41),railL:Math.round(rail.scrollLeft),railW:rail.clientWidth,
    dist:rail.scrollWidth-rail.clientWidth,wrapR:Math.round(s.querySelector('.mn-conv__railwrap').getBoundingClientRect().right),
    gap:parseFloat(getComputedStyle(rail).columnGap),focusVis:!!s.querySelector(':focus-visible'),
    sec:R(s),docW:document.documentElement.scrollWidth,vw:innerWidth,vh:innerHeight}})()`;
// Every event in index.html with its last day; the page should list the ones not yet over, in order.
const ALL = [['GANSID International Congress 2026', '2026-10-25'], ['APAC Summit 2026', '2026-10-30'], ['NDE 2026 & AeroNDT Symposium', '2026-11-17'],
  ['AVAR 2026 Cyber Security Conference', '2026-12-04'], ['Telangana Rising Global Summit 2026', '2026-12-09'], ['PHOTONICS 2026', '2026-12-13'],
  ['Structural Engineering Convention 2026', '2026-12-23'], ['ICCA Global Summit 2027', '2027-01-14'], ['BioAsia 2027', '2027-02-17'],
  ['IEEE APSCON 2027', '2027-03-17'], ['Vaccines World Summit 2027', '2027-03-18'], ['Hyderabad Jewellery, Pearl & Gem Fair 2027', '2027-05-09']];
const today = new Date(); today.setHours(0, 0, 0, 0);
const UP = ALL.filter(([, end]) => new Date(end + 'T00:00:00') >= today).map(([n]) => n);
const NAMES = UP.join('|'), K = UP.length;
const CREAM = 'rgb(244, 238, 228)';
const near = (a, b, tol) => Math.abs(a - b) <= tol;
const shown = (s) => s.artCount === 0 && s.allOp > .99;
const lit = (s, i) => s.btnBg[i] === CREAM && s.btnBg.every((c, j) => j === i || c !== CREAM);

let b = await launch({ out, port: 9383 }); b.url = url;
for (const [w, h] of [[1440, 900], [1280, 720], [1920, 1080]]) {
  const tag = `${w}x${h}`;
  await b.load(w, h);
  const top = await b.pageTop('[data-sec="conventions"]');
  await b.walkTo(top - h * .9, 50, 25); await sleep(300);
  const pre = await b.ev(S);
  check(`${tag} ${K} upcoming in date order, past removed, no serials, no pill, no eyebrow on the page`,
    pre.names.join('|') === NAMES && K >= 10 && pre.serials === 0 && pre.pill === 0 && pre.eyebrows === 0, { n: pre.names, s: pre.serials, e: pre.eyebrows });
  check(`${tag} cards hidden and heading and button hidden before entry`, Math.max(...pre.cardOp) < .05 && pre.allOp < .05, { c: pre.cardOp, a: pre.allOp });

  // Arrive: the section fills the screen and holds; the rail has not moved yet.
  await b.walkTo(top + 2, 40, 25); await sleep(3200);
  const a = await b.ev(S); await b.shot(`conv-${w}-a`);
  check(`${tag} one screen tall, pinned at the top, driven, no arrows`, near(a.sec.h, h, 1) && near(a.sec.t, 0, 2) && a.driven && !a.navShown.some(Boolean), a.sec);
  check(`${tag} visible cards risen in, heading and button shown, no art, photos loaded`, a.cardOp.every((o, i) => !a.vis[i] || o > .99) && shown(a) && a.imgs.every(Boolean), { c: a.cardOp, a: a.allOp, n: a.artCount });
  check(`${tag} rail at rest at the start`, near(a.railX, 0, 2) && a.dist > 0, { x: a.railX, d: a.dist });
  const room = a.items[0].t - a.more.b;
  check(`${tag} button on the right at the column edge, level with the sub-line; ${room}px above the cards`,
    near(a.allBtn.r, a.wrapR, 2) && near(a.allBtn.b, a.more.b, 12) && room >= 30, { btn: a.allBtn, more: a.more, wrapR: a.wrapR });
  console.log(`   ${tag} card ${a.items[0].w}x${a.items[0].h}, gap ${a.gap}px, rail travel ${a.dist}px`);

  // Halfway through the hold the rail has moved left; the section has not.
  const lead = Math.round(h * .12);
  await b.walkTo(top + lead + a.dist / 2, 40, 25); await sleep(900);
  const m = await b.ev(S); await b.shot(`conv-${w}-b`);
  check(`${tag} page scroll carries the rail left while the section holds`, near(m.sec.t, 0, 2) && near(m.railX, -a.dist / 2, a.dist * .08), { t: m.sec.t, x: m.railX, want: -a.dist / 2 });

  // Hover a card on screen: only its button lights up.
  const vi = m.items.findIndex((r) => r.l > 0 && r.r < w);
  const r = m.items[vi];
  await b.hover(r.l + r.w / 2, r.t + r.h * .4); await sleep(900);
  let s = await b.ev(S); await b.shot(`conv-${w}-hover`);
  check(`${tag} hovering card ${vi + 1} lights up its button only`, lit(s, vi), s.btnBg);
  await b.hover(5, 5); await sleep(800);
  s = await b.ev(S);
  check(`${tag} buttons rest unlit`, s.btnBg.every((c) => c !== CREAM), s.btnBg);

  // Keyboard: focus that card, Tab to the next.
  await b.ev(`document.querySelectorAll('[data-sec="conventions"] .mn-conv__card')[${vi}].focus()`);
  await b.key('Tab', 'Tab', 9); await sleep(800);
  s = await b.ev(S);
  check(`${tag} keyboard focus on card ${vi + 2} lights up its button`, s.focusVis && s.btnBg[vi + 1] === CREAM, { f: s.focusVis, bg: s.btnBg });
  await b.ev('document.activeElement.blur()');

  // The end of the travel: the last card meets the column edge.
  await b.walkTo(top + lead + a.dist + 4, 40, 25); await sleep(900);
  const e = await b.ev(S); await b.shot(`conv-${w}-end`);
  check(`${tag} last card ends at the column edge, no sideways page scroll`, near(e.items[K - 1].r, e.wrapR, 4) && e.docW === e.vw, { last: e.items[K - 1], wrapR: e.wrapR, docW: e.docW });

  // Click a card on screen: it follows its link (inner pages are placeholders and 404 locally).
  const ci = e.items.findIndex((q) => q.l > 0 && q.r < w);
  await b.click(e.items[ci].l + e.items[ci].w / 2, e.items[ci].t + e.items[ci].h * .4); await sleep(1200);
  const path = await b.ev('location.pathname');
  check(`${tag} clicking card ${ci + 1} opens ${e.hrefs[ci]}`, path === e.hrefs[ci], path);
}
const logs = [...b.logs]; b.close();

b = await launch({ out, port: 9384 }); b.url = url;
// Reduced motion: no driver, a native rail; with a mouse the arrows step it.
await b.load(1440, 900, { reduce: true });
await b.jump(await b.pageTop('[data-sec="conventions"]')); await sleep(900);
let s = await b.ev(S);
check('reduced motion: not driven, cards shown, heading and button shown, no art, next arrow shown', !s.driven && s.cardOp.every((o) => o > .99) && shown(s) && s.scrollable && s.navShown[1] && s.navDisabled[0], s);
const nr = await b.ensureVisible('[data-sec="conventions"] .mn-conv__nav--next', 0);
await b.click(nr.cx, nr.cy); await sleep(700);
s = await b.ev(S); await b.shot('conv-reduce');
check('reduced motion: next steps the rail one card', near(s.railL, s.items[0].w + s.gap, 3) || near(s.railL, s.dist, 3), { l: s.railL, step: s.items[0].w + s.gap });
for (const [w, h] of [[768, 1024], [390, 844]]) {
  await b.load(w, h, { touch: true });
  const top = await b.pageTop('[data-sec="conventions"]');
  await b.walkTo(top, 50, 25); await sleep(3000);
  s = await b.ev(S); await b.shot(`conv-${w}`);
  const perView = (s.railW + s.gap) / (s.items[0].w + s.gap);
  const want = w < 750 ? [1.05, 1.5] : [1.3, 2.6]; // clientWidth includes the gutter padding, so a peek reads a little over
  check(`${w}x${h} one screen tall, ${perView.toFixed(2)} cards in view with the next peeking`, near(s.sec.h, h, 1) && perView >= want[0] && perView <= want[1] && s.items[1].l < s.vw, { h: s.sec.h, i: s.items.slice(0, 2) });
  check(`${w}x${h} swiped not driven, no arrows, cards in, heading and button shown, no art, no sideways page scroll`, !s.driven && !s.navShown.some(Boolean) && s.cardOp.every((o, i) => !s.vis[i] || o > .99) && shown(s) && s.docW === s.vw, s);
  // Auto-advance: from the start, a card every 4s while on screen (one or two ticks in 4.6s); a touch pauses it.
  const RAIL = `document.querySelector('.mn-conv__rail')`;
  await b.ev(`${RAIL}.scrollTo({left:0})`); await sleep(4600);
  s = await b.ev(S);
  const stepW = s.items[0].w + s.gap;
  check(`${w}x${h} the rail advances on its own, a card at a time`, s.railL > stepW * .9 && s.railL < stepW * 2.1, { l: s.railL, step: stepW });
  await b.ev(`${RAIL}.dispatchEvent(new PointerEvent('pointerdown'))`); await sleep(800);
  const l0 = (await b.ev(S)).railL; await sleep(4600); s = await b.ev(S);
  check(`${w}x${h} a touch pauses the auto-advance`, Math.abs(s.railL - l0) < 3, { before: l0, after: s.railL });
  await b.ev(`${RAIL}.dispatchEvent(new PointerEvent('pointerdown'))`);
  await b.ev(`${RAIL}.scrollTo({left:99999})`); await sleep(600);
  s = await b.ev(S); await b.shot(`conv-${w}-end`);
  check(`${w}x${h} the rail swipes to the last card`, s.railL > 0 && s.items[K - 1].r <= s.vw, { l: s.railL, last: s.items[K - 1] });
}
// A narrow desktop window (mouse, no touch) gets the phone rail too: no arrows.
await b.load(390, 844);
await b.walkTo(await b.pageTop('[data-sec="conventions"]'), 50, 25); await sleep(1500);
s = await b.ev(S);
check('390x844 with a mouse: no arrows', s.scrollable && !s.navShown.some(Boolean), { sc: s.scrollable, nav: s.navShown });
logs.push(...b.logs); b.close();
// The clicks land on placeholder inner pages, which 404 locally by design.
const real = logs.filter((l) => !/404|Not Found/.test(l));
check('console clean', real.length === 0, real);
console.log(`\n${results.filter(Boolean).length}/${results.length} passed`);
process.exit(results.every(Boolean) ? 0 : 1);
