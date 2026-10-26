// RETIRED with v1 on 26 Oct 2026 (the list + arch; see docs/backups/quick-experiences-v1/). Kept for reference.
// Checks for section 8, Quick Experiences (data-sec="spinner": the slot keeps its old name for motion.js).
//
//   node tools/test/quick-experiences.mjs <url> <absOutDir>
//
// Desktop 1440x900 and 1280x720: the sideways wipe lands on item 01 with both arches drawn and the photo
// loaded; all rows fit; hover/keyboard select; scrolling away and back resets to 01. Phone: tap selects
// and brings the photo back into view; no horizontal scroll. Reduced motion: click still selects.
import { launch, sleep } from '../cdp.mjs';

const [url, out] = process.argv.slice(2);
const results = [];
const check = (name, ok, info) => results.push({ name, ok: !!ok, info });
const S = `(()=>{const s=document.querySelector('[data-sec="spinner"]');const q=s.querySelector('.mn-quick');const items=[...q.querySelectorAll('.mn-quick__item')];
  const front=q.querySelector('.mn-quick__img.is-front');const list=q.querySelector('.mn-quick__list').getBoundingClientRect();const qr=q.getBoundingClientRect();
  return {p:+(1-s.getBoundingClientRect().top/innerHeight).toFixed(3),active:items.findIndex(b=>b.getAttribute('aria-selected')==='true')+1,count:items.length,
   front:front&&front.getAttribute('src').split('/').pop(),loaded:!!(front&&front.complete&&front.naturalWidth),
   inner:+parseFloat(getComputedStyle(q.querySelector('.mn-quick__arch-inner')).strokeDashoffset).toFixed(2),
   outer:+parseFloat(getComputedStyle(q.querySelector('.mn-quick__arch-outer')).strokeDashoffset).toFixed(2),
   caption:q.querySelector('[data-q=name]').textContent,listFits:list.bottom<=qr.bottom+1,
   truncated:[...q.querySelectorAll('.mn-quick__name')].filter(n=>n.scrollWidth>n.clientWidth+1).length,docW:document.documentElement.scrollWidth,vw:innerWidth}})()`;
const row = (n) => `[data-sec="spinner"] li:nth-child(${n}) .mn-quick__item`;

async function desktop(b, w, h, full) {
  await b.load(w, h);
  await b.walkTo(await b.pageTop('[data-sec="city"]'), 60, 30);
  let y = await b.ev('scrollY'), landed = null;
  for (let k = 0; k < 220 && landed === null; k++) {
    y += 30; await b.jump(y); await sleep(50);
    if ((await b.ev(S)).p >= 0.999) landed = y;
  }
  await sleep(1600);
  const s = await b.ev(S);
  check(`${w}x${h}: lands on 01, arches drawn, photo loaded`, s.active === 1 && s.inner === 0 && s.outer === 0 && s.loaded, s);
  check(`${w}x${h}: all rows fit, none truncated`, s.listFits && s.truncated === 0, s);
  await b.shot(`quick-${w}x${h}`);
  if (!full) return;
  const r5 = await b.rect(row(5)); await b.hover(r5.cx, r5.cy); await sleep(1500);
  const h5 = await b.ev(S); check('hover row 5 selects it', h5.active === 5 && h5.loaded, h5);
  for (let n = 1; n <= h5.count; n++) { const r = await b.rect(row(n)); await b.hover(r.cx, r.cy); await sleep(25); }
  const r9 = await b.rect(row(9)); await b.hover(r9.cx, r9.cy); await sleep(1600);
  const s9 = await b.ev(S); check('rapid hover settles on the last row hovered', s9.active === 9, s9);
  await b.ev(`document.querySelector('${row(9)}').focus()`); await b.key('ArrowDown', 'ArrowDown', 40); await sleep(1000);
  check('ArrowDown moves to the next row', (await b.ev(S)).active === 10);
  await b.hover(5, 5);
  for (let k = 0; k < 60; k++) { await b.jump(landed - k * 30); await sleep(40); }
  for (let k = 60; k >= 0; k--) { await b.jump(landed - k * 30); await sleep(40); }
  await sleep(1500);
  const back = await b.ev(S); check('scrolling away and back resets to 01', back.active === 1 && back.inner === 0, back);
}

let b = await launch({ out, port: 9354 }); b.url = url;
await desktop(b, 1440, 900, true);
await desktop(b, 1280, 720, false);
const logs = [...b.logs]; b.close();

b = await launch({ out, port: 9355 }); b.url = url;
await b.load(1440, 900, { reduce: true });
await b.ev(`window.scrollTo(0, ${await b.pageTop('[data-sec="spinner"]')})`); await sleep(1200);
await b.ev(`document.querySelector('${row(4)}').click()`); await sleep(600);
check('reduced motion: click selects', (await b.ev(S)).active === 4);
await b.load(390, 844, { touch: true });
const t = await b.pageTop(`${row(9)}`); await b.walkTo(t - 500, 40, 30); await sleep(800);
const r = await b.ensureVisible(row(9)); await b.tap(r.cx, r.cy); await sleep(2200);
const m = await b.ev(S);
const visTop = await b.ev(`Math.round(document.querySelector('.mn-quick__visual').getBoundingClientRect().top)`);
check('phone: tap selects and brings the photo into view', m.active === 9 && visTop >= 0 && visTop < 300, { ...m, visTop });
check('phone: no horizontal scroll', m.docW === m.vw, m);
await b.shot('quick-phone');
logs.push(...b.logs); b.close();

for (const x of results) console.log(`${x.ok ? 'PASS' : 'FAIL'}  ${x.name}${x.ok ? '' : '  ' + JSON.stringify(x.info)}`);
const bad = logs.filter((l) => !/favicon/.test(l));
console.log('console:', bad.length ? bad : 'clean');
process.exit(results.every((x) => x.ok) && !bad.length ? 0 : 1);
