// Checks for section 11, the testimonials (data-sec="materials": the slot keeps its old name for motion.js).
//
//   node tools/test/voices.mjs <url> <absOutDir>
//
// Desktop 1440x900 and 1280x720: once landed, the arch is drawn and the portrait, card and guest tabs all
// fit one viewport; the timer advances to the next guest with backdrop, portrait and quote in step;
// hovering the card pauses it; click and arrow keys select. Phone: no horizontal scroll, tap selects.
// Reduced motion: no timer, everything shown, click still selects.
import { launch, sleep } from './cdp.mjs';

const [url, out] = process.argv.slice(2);
const results = [];
const check = (name, ok, info) => results.push({ name, ok: !!ok, info });
const S = `(()=>{const s=document.querySelector('[data-sec="materials"]');const ed=s.querySelector('.mn-ed');
  const idx=(sel)=>[...s.querySelectorAll(sel)].findIndex(e=>e.classList.contains('is-active'));
  const tabs=[...s.querySelectorAll('[role=tab]')];const r=(sel)=>{const b=s.querySelector(sel).getBoundingClientRect();return {top:Math.round(b.top),bottom:Math.round(b.bottom)}};
  const face=s.querySelector('.mn-voices__face.is-active');const bg=s.querySelector('.mn-voices__bg.is-active');
  return {secTop:Math.round(s.getBoundingClientRect().top),tab:tabs.findIndex(t=>t.getAttribute('aria-selected')==='true'),
   quote:idx('.mn-voices__quote'),face:idx('.mn-voices__face'),bg:idx('.mn-voices__bg'),
   inert:[...s.querySelectorAll('.mn-voices__quote')].map(q=>q.inert),
   loaded:!!(face&&face.complete&&face.naturalWidth&&bg&&bg.complete&&bg.naturalWidth),
   arch:+parseFloat(getComputedStyle(s.querySelector('.mn-voices__arch path')).strokeDashoffset).toFixed(2),
   media:+getComputedStyle(s.querySelector('.mn-voices__media')).opacity,tabsOp:Math.min(...tabs.map(t=>+getComputedStyle(t).opacity)),dim:+getComputedStyle(tabs[3].querySelector('.mn-voices__who')).opacity,
   card:r('.mn-voices__card'),portrait:r('.mn-voices__portrait'),list:r('.mn-voices__list'),
   auto:ed.classList.contains('is-auto'),paused:ed.classList.contains('is-paused'),
   focus:tabs.indexOf(document.activeElement),docW:document.documentElement.scrollWidth,vw:innerWidth,vh:innerHeight}})()`;
const tab = (n) => `[data-sec="materials"] [role=tab]:nth-child(${n})`;
const synced = (s, i) => s.tab === i && s.quote === i && s.face === i && s.bg === i && s.inert.filter(Boolean).length === 3 && !s.inert[i];

async function desktop(b, w, h, full) {
  await b.load(w, h);
  // Walk a little past the landing (the guests reveal as it settles), then measure at the landing.
  const top = await b.pageTop('[data-sec="materials"]');
  await b.walkTo(top + 60, 120, 30);
  await b.hover(5, h - 5);
  await sleep(1200);
  await b.walkTo(top, 10, 30);
  await sleep(1400);
  const s = await b.ev(S);
  check(`${w}x${h}: arch drawn, portrait and guests shown, images loaded`, s.arch === 0 && s.media === 1 && s.tabsOp === 1 && s.loaded, s);
  check(`${w}x${h}: inactive guests dimmed`, s.dim < .7, s);
  check(`${w}x${h}: card, portrait and guests fit one viewport`, s.card.top >= 64 && s.portrait.top >= 64 && s.list.bottom <= s.vh && s.card.bottom < s.list.top, s);
  check(`${w}x${h}: no horizontal scroll`, s.docW === s.vw, s);
  await b.shot(`voices-${w}x${h}`);
  if (!full) return;
  // Shorten the timer so the test doesn't wait 10 s per guest (a running bar may end at once, so settle first).
  await b.ev(`document.querySelector('.mn-ed--voices').style.setProperty('--dur','2s')`);
  await sleep(300);
  const a0 = (await b.ev(S)).tab;
  await sleep(2300);
  const a1 = await b.ev(S);
  check('timer moves to the next guest, all layers in step', synced(a1, (a0 + 1) % 4) && a1.auto, { a0, a1 });
  const c = await b.rect('[data-sec="materials"] .mn-voices__card'); await b.hover(c.cx, c.cy); await sleep(300);
  const p0 = await b.ev(S); await sleep(2600); const p1 = await b.ev(S);
  check('hovering the card pauses the timer', p0.paused && p1.tab === p0.tab, { p0: p0.tab, p1: p1.tab, paused: p0.paused });
  const t4 = await b.rect(tab(4)); await b.hover(t4.cx, t4.cy); await b.click(t4.cx, t4.cy); await sleep(1600);
  const k4 = await b.ev(S);
  check('click guest 4 selects it', synced(k4, 3) && k4.loaded, k4);
  await b.shot('voices-guest4');
  await b.ev(`document.querySelector('${tab(4)}').focus()`); await b.key('ArrowRight', 'ArrowRight', 39); await sleep(800);
  const k1 = await b.ev(S);
  check('ArrowRight wraps to guest 1 and moves focus', synced(k1, 0) && k1.focus === 0, k1);
  await b.key('ArrowLeft', 'ArrowLeft', 37); await sleep(300);
  check('ArrowLeft wraps to guest 4', synced(await b.ev(S), 3));
  await b.ev(`document.activeElement.blur()`);
}

let b = await launch({ out, port: 9356 }); b.url = url;
await desktop(b, 1440, 900, true);
await desktop(b, 1280, 720, false);
const logs = [...b.logs]; b.close();

b = await launch({ out, port: 9357 }); b.url = url;
await b.load(1440, 900, { reduce: true });
await b.ev(`window.scrollTo(0, ${await b.pageTop('[data-sec="materials"]')})`); await sleep(1200);
const rm = await b.ev(S);
check('reduced motion: no timer, everything shown', !rm.auto && rm.arch === 0 && rm.media === 1 && rm.tabsOp === 1, rm);
await b.ev(`document.querySelector('${tab(3)}').click()`); await sleep(400);
check('reduced motion: click selects', synced(await b.ev(S), 2));
await b.shot('voices-reduce');

await b.load(390, 844, { touch: true });
await b.walkTo(await b.pageTop('[data-sec="materials"]'), 80, 30); await sleep(1200);
await b.shot('voices-phone-top');
const r = await b.ensureVisible(tab(3)); await b.tap(r.cx, r.cy); await sleep(2000);
const m = await b.ev(S);
check('phone: tap selects guest 3 and brings the portrait back into view', synced(m, 2) && m.portrait.top >= 60 && m.portrait.top < 200, m);
check('phone: no horizontal scroll', m.docW === m.vw, m);
await b.shot('voices-phone-tap');
await b.ensureVisible(tab(4)); await sleep(1200); await b.shot('voices-phone-tabs');
await b.load(834, 1194, { touch: true });
await b.walkTo(await b.pageTop('[data-sec="materials"]'), 80, 30); await sleep(1500);
const tb = await b.ev(S);
check('tablet: no horizontal scroll', tb.docW === tb.vw, tb);
await b.shot('voices-tablet');
logs.push(...b.logs); b.close();

for (const x of results) console.log(`${x.ok ? 'PASS' : 'FAIL'}  ${x.name}${x.ok ? '' : '  ' + JSON.stringify(x.info)}`);
const bad = logs.filter((l) => !/favicon/.test(l));
console.log('console:', bad.length ? bad : 'clean');
process.exit(results.every((x) => x.ok) && !bad.length ? 0 : 1);
