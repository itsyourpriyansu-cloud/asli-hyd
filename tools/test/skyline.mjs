// Checks for "400 years in one line", the skyline in section 8 (Rooted in Hyderabad, data-sec="city").
//
//   node tools/test/skyline.mjs <url> <absOutDir>
//
// Desktop 1440x900 and 1280x720: as the ink sweep crosses, the landmarks open strictly left to right (outline,
// details, then year and name), each one only once it is on screen, and all seven are open before the panel
// leaves; scrolling back closes them again. Phone: the band draws once, every landmark opens and the strip
// glides to the bridge; no horizontal scroll. Reduced motion: everything drawn from the start.
import { launch, sleep } from './cdp.mjs';

const [url, out] = process.argv.slice(2);
const results = [];
const check = (name, ok, info) => results.push({ name, ok: !!ok, info });
// Per landmark: how open it is (0..1, from the outline's dash and the label's opacity) and its centre on screen.
const S = `(()=>{const sky=document.querySelector('.mn-skyline');const marks=[...sky.querySelectorAll('.mn-skyline__mark')];
  return {marks:marks.map(g=>{const o=g.querySelector('.mn-skyline__outline');const r=o.getBoundingClientRect();
    return {draw:+(1-parseFloat(getComputedStyle(o).strokeDashoffset)).toFixed(2),detail:+(1-parseFloat(getComputedStyle(g.querySelector('.mn-skyline__detail')).strokeDashoffset)).toFixed(2),
     label:+(+getComputedStyle(g.querySelector('.mn-skyline__label')).opacity).toFixed(2),cx:Math.round(r.left+r.width/2)}}),
   ground:+(1-parseFloat(getComputedStyle(sky.querySelector('.mn-skyline__ground')).strokeDashoffset)).toFixed(2),
   track:(()=>{const t=sky.querySelector('.mn-skyline__track');return t?Math.round(t.scrollLeft)+'/'+(t.scrollWidth-t.clientWidth):null})(),
   docW:document.documentElement.scrollWidth,vw:innerWidth}})()`;
const leftToRight = (ms) => ms.every((m, i) => i === 0 || m.draw <= ms[i - 1].draw + .001);
const offScreenClosed = (s) => s.marks.every((m) => m.cx < s.vw || (m.draw === 0 && m.label === 0));

async function desktop(b, w, h) {
  await b.load(w, h);
  const top = await b.pageTop('[data-sec="city"]');
  await b.walkTo(top - h, 60, 30);
  let ordered = true, honest = true, sawPartial = false, frames = [];
  for (let k = 1; k <= 40; k++) {
    await b.walkTo(top - h + Math.round(h * k / 40), 3, 25); await sleep(60);
    const s = await b.ev(S);
    if (!leftToRight(s.marks)) ordered = false;
    if (!offScreenClosed(s)) honest = false;
    if (s.marks.some((m) => m.draw > 0 && m.draw < 1)) sawPartial = true;
    frames.push(s.marks.map((m) => m.draw).join(' '));
    if (k === 16) await b.shot(`skyline-${w}x${h}-mid`);
  }
  check(`${w}x${h}: landmarks open strictly left to right`, ordered, frames);
  check(`${w}x${h}: a landmark only opens once it is on screen`, honest, frames);
  check(`${w}x${h}: landmarks are seen part-way open (they open, not pop)`, sawPartial, frames);
  // Panel fully on screen between a third and two thirds of the wipe: all seven open by then.
  await b.walkTo(top - h + Math.round(h * .62), 10, 30); await sleep(400);
  const open = await b.ev(S);
  check(`${w}x${h}: all seven open, labels shown, ground drawn, before the panel leaves`, open.marks.every((m) => m.draw === 1 && m.detail === 1 && m.label === 1) && open.ground === 1, open);
  await b.shot(`skyline-${w}x${h}-open`);
  await b.walkTo(top - h + Math.round(h * .2), 20, 30); await sleep(400);
  const back = await b.ev(S);
  check(`${w}x${h}: scrolling back closes the landmarks again`, back.marks.slice(-3).every((m) => m.draw === 0 && m.label === 0), back);
}

let b = await launch({ out, port: 9368 }); b.url = url;
await desktop(b, 1440, 900);
await desktop(b, 1280, 720);
const logs = [...b.logs]; b.close();

b = await launch({ out, port: 9369 }); b.url = url;
await b.load(1440, 900, { reduce: true });
await b.ev(`window.scrollTo(0, ${await b.pageTop('[data-sec="city"]')})`); await sleep(800);
const rm = await b.ev(S);
check('reduced motion: everything drawn from the start', rm.marks.every((m) => m.draw === 1 && m.detail === 1 && m.label === 1) && rm.ground === 1, rm);

await b.load(390, 844, { touch: true });
const pt = await b.pageTop('[data-sec="city"]');
await b.walkTo(pt - 760, 60, 30); await sleep(600);
const pre = await b.ev(S);
await b.walkTo(pt - 80, 10, 30); await sleep(1700);
await b.shot('skyline-phone-mid');
await sleep(2600);
const ph = await b.ev(S);
const [sl, max] = ph.track.split('/').map(Number);
check('phone: closed before it comes into view', pre.marks.every((m) => m.draw === 0 && m.label === 0), pre);
check('phone: the band draws once, every landmark opens, the strip glides to the bridge', ph.marks.every((m) => m.draw === 1 && m.label === 1) && ph.ground === 1 && Math.abs(sl - max) <= 2, ph);
check('phone: no horizontal scroll', ph.docW === ph.vw, ph);
await b.shot('skyline-phone-end');
logs.push(...b.logs); b.close();

for (const x of results) console.log(`${x.ok ? 'PASS' : 'FAIL'}  ${x.name}${x.ok ? '' : '  ' + JSON.stringify(x.info).slice(0, 900)}`);
const bad = logs.filter((l) => !/favicon/.test(l));
console.log('console:', bad.length ? bad : 'clean');
process.exit(results.every((x) => x.ok) && !bad.length ? 0 : 1);
