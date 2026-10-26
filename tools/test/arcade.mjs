// Checks for section 9, Quick Experiences, the arcade rail (data-sec="spinner": the slot keeps its old name for motion.js).
//
//   node tools/test/arcade.mjs <url> <absOutDir>
//
// Desktop 1440x900 and 1280x720: the wipe lands with every arch drawn and the cards clear of the title; the held
// scroll carries the rail to card 10 and the group underline follows; hover reveals the description and Book now;
// the group buttons and keyboard focus scroll to their card; the page carries on to the Originals afterwards.
// Reduced motion: the rail scrolls natively. Phone/tablet: native swipe, descriptions shown, no horizontal scroll.
import { launch, sleep } from './cdp.mjs';

const [url, out] = process.argv.slice(2);
const results = [];
const check = (name, ok, info) => results.push({ name, ok: !!ok, info });
const S = `(()=>{const s=document.querySelector('[data-sec="spinner"]');const a=s.querySelector('.mn-arcade');const rail=a.querySelector('.mn-arcade__rail');const tr=a.querySelector('.mn-arcade__track');
  const cards=[...a.querySelectorAll('.mn-arcade__card')];const vis=cards.filter(c=>{const r=c.getBoundingClientRect();return r.right>0&&r.left<innerWidth});
  const r=(el)=>{const b=el.getBoundingClientRect();return {top:Math.round(b.top),bottom:Math.round(b.bottom),left:Math.round(b.left),right:Math.round(b.right)}};
  return {secTop:Math.round(s.getBoundingClientRect().top),x:Math.round(new DOMMatrix(getComputedStyle(tr).transform).m41),scrollLeft:Math.round(rail.scrollLeft),
   dist:Math.max(tr.offsetWidth-rail.clientWidth,0),driven:rail.classList.contains('is-driven'),p:+(+getComputedStyle(a).getPropertyValue('--p')||0).toFixed(3),
   group:(a.querySelector('.mn-arcade__group.is-active')||{}).dataset?.arcadeGo,visible:vis.length,
   arches:[...a.querySelectorAll('.mn-arcade__arch path')].map(p=>+parseFloat(getComputedStyle(p).strokeDashoffset).toFixed(2)),
   loaded:vis.every(c=>{const i=c.querySelector('img');return i.complete&&i.naturalWidth>0}),
   title:r(a.querySelector('.mn-arcade__title')),frame:r(cards[0].querySelector('.mn-arcade__frame')),foot:r(cards[0].querySelector('.mn-arcade__foot')),
   progress:r(a.querySelector('.mn-arcade__progress')),cardRects:cards.map(r),
   desc:+getComputedStyle(cards[1].querySelector('.mn-arcade__desc')).opacity,go:+getComputedStyle(cards[1].querySelector('.mn-arcade__go')).opacity,
   docW:document.documentElement.scrollWidth,vw:innerWidth,vh:innerHeight}})()`;

async function land(b) {
  await b.walkTo(await b.pageTop('[data-sec="city"]'), 60, 30);
  let y = await b.ev('scrollY');
  for (let k = 0; k < 260; k++) {
    y += 30; await b.jump(y); await sleep(45);
    if ((await b.ev(`Math.round(document.querySelector('[data-sec="spinner"]').getBoundingClientRect().top)`)) <= 0) break;
  }
  await sleep(1500);
  return b.ev('scrollY');
}

async function desktop(b, w, h, full) {
  await b.load(w, h);
  const y0 = await land(b);
  await b.hover(5, h - 5);
  const s = await b.ev(S);
  check(`${w}x${h}: lands at card 01, every arch drawn, photos loaded`, s.driven && s.x === 0 && s.arches.every((v) => v === 0) && s.loaded && s.group === 'workshops', s);
  check(`${w}x${h}: cards clear of the title and the progress line`, s.frame.top > s.title.bottom && s.foot.bottom < s.progress.top && s.progress.bottom <= s.vh, s);
  check(`${w}x${h}: at least three cards in view, no horizontal scroll`, s.visible >= 3 && s.docW === s.vw, s);
  await b.shot(`arcade-${w}x${h}`);
  if (!full) return;

  const c2 = s.cardRects[1]; await b.hover(Math.round((c2.left + c2.right) / 2), Math.round((c2.top + c2.bottom) / 2 - 60)); await sleep(900);
  const hv = await b.ev(S);
  check('hover shows the description and Book now', hv.desc > .95 && hv.go > .95, hv);
  await b.shot('arcade-hover');
  await b.hover(5, h - 5);

  await b.walkTo(y0 + s.dist + Math.round(h * .2), 80, 30); await sleep(1200);
  const e = await b.ev(S);
  check('the held scroll carries the rail to card 10, underline on Performances', e.secTop === 0 && Math.abs(e.x + e.dist) <= 2 && e.group === 'performances' && e.p === 1, e);
  await b.shot('arcade-end');

  await b.walkTo(y0, 60, 30); await sleep(1200);
  await b.ev(`document.querySelector('[data-arcade-go="performances"]').click()`); await sleep(2200);
  const g = await b.ev(S);
  const c7 = g.cardRects[6];
  check('Performances jumps to card 07', g.group === 'performances' && c7.left >= 0 && c7.left < 140 && g.secTop === 0, { x: g.x, c7, group: g.group });
  await b.ev(`document.querySelector('[data-arcade-go="workshops"]').click()`); await sleep(2200);
  check('Workshops jumps back to card 01', (await b.ev(S)).x === 0);

  await b.ev(`document.querySelectorAll('.mn-arcade__link')[8].focus()`); await sleep(2200);
  const f = await b.ev(S);
  check('keyboard focus on card 09 brings it into view', f.cardRects[8].left >= 0 && f.cardRects[8].right <= f.vw && f.secTop === 0, { c9: f.cardRects[8], x: f.x });
  await b.ev('document.activeElement.blur()');

  await b.walkTo(await b.pageTop('[data-sec="collection-b"]'), 80, 30); await sleep(1200);
  const nb = await b.ev(`Math.round(document.querySelector('[data-sec="collection-b"]').getBoundingClientRect().top)`);
  check('the page carries on to the Originals after the hold', Math.abs(nb) < h * .5, { colBTop: nb });
}

let b = await launch({ out, port: 9358 }); b.url = url;
await desktop(b, 1440, 900, true);
await desktop(b, 1280, 720, false);
const logs = [...b.logs]; b.close();

b = await launch({ out, port: 9359 }); b.url = url;
await b.load(1440, 900, { reduce: true });
await b.ev(`window.scrollTo(0, ${await b.pageTop('[data-sec="spinner"]')})`); await sleep(1000);
await b.ev(`document.querySelector('[data-arcade-go="performances"]').click()`); await sleep(800);
const rm = await b.ev(S);
check('reduced motion: rail scrolls natively, Performances scrolls it to card 07', !rm.driven && rm.scrollLeft > 0 && rm.group === 'performances' && rm.arches.every((v) => v === 0), rm);
await b.shot('arcade-reduce');

await b.load(390, 844, { touch: true });
await b.walkTo(await b.pageTop('[data-sec="spinner"]'), 80, 30); await sleep(2200);
const ph = await b.ev(S);
check('phone: native rail, descriptions shown, arches drawn, no horizontal scroll', !ph.driven && ph.desc === 1 && ph.arches.slice(0, 2).every((v) => v === 0) && ph.docW === ph.vw, ph);
await b.shot('arcade-phone');
await b.ev(`(()=>{const r=document.querySelector('.mn-arcade__rail');r.scrollLeft=r.scrollWidth})()`); await sleep(800);
const pe = await b.ev(S);
check('phone: swiping to the end lights Performances and fills the line', pe.group === 'performances' && pe.p === 1, pe);
await b.load(834, 1194, { touch: true });
await b.walkTo(await b.pageTop('[data-sec="spinner"]'), 80, 30); await sleep(1500);
const tb = await b.ev(S);
check('tablet: no horizontal scroll', tb.docW === tb.vw, tb);
await b.shot('arcade-tablet');

logs.push(...b.logs); b.close();

for (const x of results) console.log(`${x.ok ? 'PASS' : 'FAIL'}  ${x.name}${x.ok ? '' : '  ' + JSON.stringify(x.info)}`);
const bad = logs.filter((l) => !/favicon/.test(l));
console.log('console:', bad.length ? bad : 'clean');
process.exit(results.every((x) => x.ok) && !bad.length ? 0 : 1);
