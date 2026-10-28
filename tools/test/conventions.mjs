// Section 3b, Conventions index: past events (by data-end) removed and the rest numbered from 01; desktop (>=1200px) rows rise in on
// entry, the first row is in focus with its photo and caption in the gold frame, hover and keyboard focus move it, the
// frame sits beside the list and ends on the same line; below 1200px one column with a thumbnail per row; reduced motion
// shows everything at once; no sideways scroll; clean console. Needs at least three upcoming events.
//
//   node tools/test/conventions.mjs http://127.0.0.1:8655/ C:/abs/out
import { launch, sleep } from './cdp.mjs';

const [url, out] = process.argv.slice(2);
if (!url || !out) { console.log('usage: node tools/test/conventions.mjs <url> <absOutDir>'); process.exit(1); }
const results = [];
const check = (name, ok, info) => { results.push(!!ok); console.log((ok ? 'PASS ' : 'FAIL ') + name + (ok ? '' : '  ' + JSON.stringify(info).slice(0, 700))); };
const S = `(()=>{const s=document.querySelector('[data-sec="conventions"]'),R=(e)=>{const r=e.getBoundingClientRect();return {l:Math.round(r.left),t:Math.round(r.top),r:Math.round(r.right),b:Math.round(r.bottom),w:Math.round(r.width),h:Math.round(r.height)}};
  const items=[...s.querySelectorAll('.mn-conv__item')],shots=[...s.querySelectorAll('.mn-conv__shot')],frame=s.querySelector('.mn-conv__frame'),idx=s.querySelector('.mn-conv__index');
  const fd=getComputedStyle(frame).display!=='none';
  return {nums:items.map(i=>i.querySelector('.mn-conv__num').textContent).join(' '),names:items.map(i=>i.querySelector('.mn-conv__name').textContent),
    active:items.findIndex(i=>i.classList.contains('is-active')),on:shots.findIndex(x=>x.classList.contains('is-on')),nShots:shots.length,
    cap:s.querySelector('[data-conv-cap]').textContent,alt:shots.map(x=>x.alt),frameShown:fd,frame:fd?R(frame):null,index:R(idx),
    rowsOp:Math.min(...items.map(i=>+getComputedStyle(i).opacity)),thumbs:items.map(i=>{const t=i.querySelector('.mn-conv__thumb');return getComputedStyle(t).display!=='none'&&t.complete&&t.naturalWidth>0}),
    shotLoaded:fd?shots.every(x=>x.complete&&x.naturalWidth>0):true,sec:R(s),rowsR:items.map(i=>R(i.querySelector('.mn-conv__row'))),
    docW:document.documentElement.scrollWidth,vw:innerWidth,vh:innerHeight}})()`;
// Every event in index.html with its last day; the page should list the ones not yet over, in order.
const ALL = [['GANSID International Congress 2026', '2026-10-25'], ['APAC Summit 2026', '2026-10-30'], ['AVAR 2026 Cyber Security Conference', '2026-12-04'],
  ['Telangana Rising Global Summit 2026', '2026-12-09'], ['ICCA Global Summit 2027', '2027-01-14'], ['BioAsia 2027', '2027-02-17']];
const today = new Date(); today.setHours(0, 0, 0, 0);
const UP = ALL.filter(([, end]) => new Date(end + 'T00:00:00') >= today).map(([n]) => n);
const NAMES = UP.join('|'), NUMS = UP.map((_, i) => String(i + 1).padStart(2, '0')).join(' '), K = UP.length;
let b = await launch({ out, port: 9383 }); b.url = url;
for (const [w, h] of [[1440, 900], [1280, 720], [1920, 1080], [1200, 800]]) {
  const tag = `${w}x${h}`;
  await b.load(w, h);
  const top = await b.pageTop('[data-sec="conventions"]');
  await b.walkTo(top - h * .9, 50, 25); await sleep(300);
  const pre = await b.ev(S);
  await b.walkTo(top - 40, 40, 25); await sleep(2200);
  let s = await b.ev(S);
  await b.shot(`idx-${w}`);
  check(`${tag} past events removed, ${K} upcoming numbered in order`, s.nums === NUMS && s.names.join('|') === NAMES && s.nShots === K, s.nums + ' / ' + s.names.join('|'));
  check(`${tag} rows hidden before entry, shown after`, pre.rowsOp < .05 && s.rowsOp > .99, { pre: pre.rowsOp, post: s.rowsOp });
  check(`${tag} first row in focus with its photo and caption`, s.active === 0 && s.on === 0 && s.cap === s.alt[0], s);
  check(`${tag} frame shown, photos loaded`, s.frameShown && s.shotLoaded, s.frameShown);
  check(`${tag} index and frame side by side, not overlapping`, s.frame && s.index.r <= s.frame.l - 40, { index: s.index, frame: s.frame });
  check(`${tag} frame top lines up with the list, heights close`, s.frame && Math.abs(s.frame.t - s.index.t) <= 2 && Math.abs(s.frame.h - s.index.h) <= s.index.h * .15, { f: s.frame, i: s.index });
  check(`${tag} no sideways scroll`, s.docW === s.vw, s);
  console.log(`   ${tag} section ${s.sec.h}px tall (vh ${h}); frame ${s.frame.w}x${s.frame.h}; rows ${s.rowsR.map((r) => r.h).join('/')}`);
  // Hover the third row.
  const r3 = s.rowsR[2]; await b.hover(r3.l + 60, r3.t + r3.h / 2); await sleep(1700);
  s = await b.ev(S); await b.shot(`idx-${w}-hover3`);
  check(`${tag} hovering row 3 brings its photo and caption`, s.active === 2 && s.on === 2 && s.cap === s.alt[2], { a: s.active, on: s.on, cap: s.cap });
  // Keyboard focus on the last row (mouse moved off the list first).
  await b.hover(5, 5); await sleep(200);
  await b.ev(`document.querySelectorAll('[data-sec="conventions"] .mn-conv__row')[${K - 1}].focus()`); await sleep(400);
  s = await b.ev(S);
  check(`${tag} keyboard focus on the last row brings its photo`, s.active === K - 1 && s.on === K - 1, { a: s.active, on: s.on });
  await b.hover(5, 5);
}
const logs = [...b.logs]; b.close();
b = await launch({ out, port: 9384 }); b.url = url;
await b.load(1440, 900, { reduce: true });
await b.jump(await b.pageTop('[data-sec="conventions"]') - 40); await sleep(900);
let s = await b.ev(S); await b.shot('idx-reduce');
check('reduced motion: rows and photo shown at once', s.rowsOp > .99 && s.on === 0 && s.frameShown, s);
for (const [w, h] of [[1025, 768], [768, 1024], [390, 844]]) {
  await b.load(w, h, { touch: w < 1025 });
  const top = await b.pageTop('[data-sec="conventions"]');
  await b.walkTo(top + 900, 80, 25); await sleep(2400);
  s = await b.ev(S); await b.shot(`idx-${w}`);
  check(`${w}x${h} one column, frame hidden, every row has its thumbnail`, !s.frameShown && s.thumbs.every(Boolean) && s.nums === NUMS, { f: s.frameShown, t: s.thumbs });
  check(`${w}x${h} rows shown, no sideways scroll`, s.rowsOp > .99 && s.docW === s.vw, s);
  console.log(`   ${w}x${h} section ${s.sec.h}px; rows ${s.rowsR.map((r) => r.h).join('/')}`);
}
logs.push(...b.logs); b.close();
check('console clean', logs.length === 0, logs);
console.log(`\n${results.filter(Boolean).length}/${results.length} passed`);
process.exit(results.every(Boolean) ? 0 : 1);
