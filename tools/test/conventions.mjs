// Section 3b, Conventions ("a world of its own"): past events (by data-end) removed and the rest numbered from 01;
// desktop: the heading floats at mid-screen while the cards scroll behind it, its second line arrives part-way, the
// even (right) cards travel against the odd ones, cards rise in as they arrive; hover and keyboard focus dim the
// other cards and the heading; a click follows the card's link. Tablets and phones put the heading (both lines) on
// top; 768px keeps two columns, phones get one; reduced motion shows everything at once; no sideways scroll; clean console.
//
//   node tools/test/conventions.mjs http://127.0.0.1:8655/ C:/abs/out
import { launch, sleep } from './cdp.mjs';

const [url, out] = process.argv.slice(2);
if (!url || !out) { console.log('usage: node tools/test/conventions.mjs <url> <absOutDir>'); process.exit(1); }
const results = [];
const check = (name, ok, info) => { results.push(!!ok); console.log((ok ? 'PASS ' : 'FAIL ') + name + (ok ? '' : '  ' + JSON.stringify(info).slice(0, 700))); };
const S = `(()=>{const s=document.querySelector('[data-sec="conventions"]'),R=(e)=>{const r=e.getBoundingClientRect();return {l:Math.round(r.left),t:Math.round(r.top),r:Math.round(r.right),b:Math.round(r.bottom),w:Math.round(r.width),h:Math.round(r.height)}};
  const items=[...s.querySelectorAll('.mn-conv__item')],head=s.querySelector('.mn-conv__head'),title=s.querySelector('.mn-conv__title'),more=s.querySelector('.mn-conv__more');
  const op=(e)=>+getComputedStyle(e).opacity;
  return {nums:items.map(i=>i.querySelector('.mn-conv__num').textContent).join(' '),names:items.map(i=>i.querySelector('.mn-conv__name').textContent),
    hrefs:items.map(i=>new URL(i.querySelector('a').href).pathname),items:items.map(R),itemOp:items.map(op),
    cardOp:items.map(i=>op(i.querySelector('.mn-conv__card'))),imgs:items.map(i=>{const m=i.querySelector('img');return m.complete&&m.naturalWidth>0}),
    title:R(title),headOp:op(head),headPos:getComputedStyle(head).position,moreOp:op(more),focusVis:!!s.querySelector(':focus-visible'),
    sec:R(s),docW:document.documentElement.scrollWidth,vw:innerWidth,vh:innerHeight,path:location.pathname}})()`;
// Every event in index.html with its last day; the page should list the ones not yet over, in order.
const ALL = [['GANSID International Congress 2026', '2026-10-25'], ['APAC Summit 2026', '2026-10-30'], ['AVAR 2026 Cyber Security Conference', '2026-12-04'],
  ['Telangana Rising Global Summit 2026', '2026-12-09'], ['ICCA Global Summit 2027', '2027-01-14'], ['BioAsia 2027', '2027-02-17']];
const today = new Date(); today.setHours(0, 0, 0, 0);
const UP = ALL.filter(([, end]) => new Date(end + 'T00:00:00') >= today).map(([n]) => n);
const NAMES = UP.join('|'), NUMS = UP.map((_, i) => String(i + 1).padStart(2, '0')).join(' '), K = UP.length;
const near = (a, b, tol) => Math.abs(a - b) <= tol;
const mid = (r) => r.t + r.h / 2;

let b = await launch({ out, port: 9383 }); b.url = url;
for (const [w, h] of [[1440, 900], [1280, 720], [1920, 1080]]) {
  const tag = `${w}x${h}`;
  await b.load(w, h);
  const top = await b.pageTop('[data-sec="conventions"]');
  await b.walkTo(top - h * .9, 50, 25); await sleep(300);
  const pre = await b.ev(S);
  check(`${tag} ${K} upcoming numbered in order, past ones removed`, pre.nums === NUMS && pre.names.join('|') === NAMES, pre.nums + ' / ' + pre.names.join('|'));
  check(`${tag} cards and line 2 hidden before entry`, Math.max(...pre.cardOp) < .05 && pre.moreOp < .05, { c: pre.cardOp, m: pre.moreOp });

  // Past the stage's top padding the heading is stuck: title and line 2 centred as a pair at mid-screen.
  await b.walkTo(top + 200, 40, 25); await sleep(1600);
  const a = await b.ev(S); await b.shot(`conv-${w}-a`);
  check(`${tag} heading floats at mid-screen once in, line 2 not yet`, near(a.title.b, h / 2, h * .1) && a.moreOp < .05, { t: a.title, vh: h, m: a.moreOp });
  check(`${tag} first row of cards risen in`, a.cardOp[0] > .99 && a.cardOp[1] > .99, a.cardOp);

  // Past the line-2 trigger (45% of the stage at mid-screen), before the heading's sticky run ends.
  const deep = top + (a.sec.h - h) * .55;
  await b.walkTo(deep, 40, 25); await sleep(1600);
  const c = await b.ev(S); await b.shot(`conv-${w}-b`);
  check(`${tag} heading still at mid-screen deeper in, line 2 shown`, near(mid(c.title), mid(a.title), 4) && c.moreOp > .99, { a: a.title, c: c.title, m: c.moreOp });
  // Parallax: the right card's offset to its left neighbour changes as the page scrolls.
  const d0 = a.items[1].t - a.items[0].t, d1 = c.items[1].t - c.items[0].t;
  check(`${tag} right column travels against the left`, d0 - d1 > 30 && a.items[1].l > a.items[0].r, { d0, d1 });
  check(`${tag} photos loaded, no sideways scroll`, c.imgs.every(Boolean) && c.docW === c.vw, c);
  console.log(`   ${tag} section ${a.sec.h}px tall; card ${a.items[0].w}x${a.items[0].h}; offset ${d0} -> ${d1}`);

  // Hover a card that is on screen: the others and the heading step back.
  const vis = c.items.findIndex((r) => r.t > 40 && r.t + r.h * .4 < h);
  const r = c.items[vis];
  await b.hover(r.l + r.w / 2, r.t + r.h * .3); await sleep(1000);
  let s = await b.ev(S); await b.shot(`conv-${w}-hover`);
  check(`${tag} hovering card ${vis + 1} dims the rest and the heading`, s.itemOp[vis] > .99 && s.itemOp.every((o, i) => i === vis || o < .45) && s.headOp < .2, { i: s.itemOp, h: s.headOp });
  await b.hover(5, 5); await sleep(900);
  s = await b.ev(S);
  check(`${tag} leaving restores everything`, s.itemOp.every((o) => o > .99) && s.headOp > .99, { i: s.itemOp, h: s.headOp });

  // Keyboard: Tab from the first card to the second.
  await b.ev(`document.querySelector('[data-sec="conventions"] .mn-conv__card').focus()`);
  await b.key('Tab', 'Tab', 9); await sleep(1000);
  s = await b.ev(S);
  check(`${tag} keyboard focus on card 2 dims the rest`, s.focusVis && s.itemOp[1] > .99 && s.itemOp[0] < .45 && s.headOp < .2, { f: s.focusVis, i: s.itemOp, h: s.headOp });
  await b.ev('document.activeElement.blur()');

  // Click follows the card's link (inner pages are placeholders and 404 locally).
  const rc = await b.ensureVisible('[data-sec="conventions"] .mn-conv__media', vis);
  await b.click(rc.cx, rc.cy); await sleep(1200);
  const path = await b.ev('location.pathname');
  check(`${tag} clicking card ${vis + 1} opens ${c.hrefs[vis]}`, path === c.hrefs[vis], path);
}
const logs = [...b.logs]; b.close();

b = await launch({ out, port: 9384 }); b.url = url;
await b.load(1440, 900, { reduce: true });
await b.jump(await b.pageTop('[data-sec="conventions"]') + 200); await sleep(900);
let s = await b.ev(S); await b.shot('conv-reduce');
check('reduced motion: cards and both lines shown at once', s.cardOp.every((o) => o > .99) && s.moreOp > .99, s);
for (const [w, h] of [[768, 1024], [390, 844]]) {
  await b.load(w, h, { touch: true });
  const top = await b.pageTop('[data-sec="conventions"]');
  await b.walkTo(top - 60, 50, 25); await sleep(1400);
  s = await b.ev(S); await b.shot(`conv-${w}-a`);
  const twoCols = s.items[1].l > s.items[0].r;
  check(`${w}x${h} ${w < 750 ? 'one column' : 'two columns'}, heading static on top, line 2 shown`,
    twoCols === w >= 750 && s.headPos === 'static' && s.moreOp > .99 && s.title.b < s.items[0].t, s);
  await b.walkTo(top + s.sec.h - h, 80, 25); await sleep(1600);
  s = await b.ev(S); await b.shot(`conv-${w}-b`);
  check(`${w}x${h} all cards risen in, photos loaded, no sideways scroll`, s.cardOp.every((o) => o > .99) && s.imgs.every(Boolean) && s.docW === s.vw, s);
  console.log(`   ${w}x${h} section ${s.sec.h}px; card ${s.items[0].w}x${s.items[0].h}`);
}
logs.push(...b.logs); b.close();
// The clicks land on placeholder inner pages, which 404 locally by design.
const real = logs.filter((l) => !/404|Not Found/.test(l));
check('console clean', real.length === 0, real);
console.log(`\n${results.filter(Boolean).length}/${results.length} passed`);
process.exit(results.every(Boolean) ? 0 : 1);
