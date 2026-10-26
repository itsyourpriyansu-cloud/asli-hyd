// Checks for the two card explorers ([data-themes]): section 4 "Hyderabad, Your Way" (data-sec="collection-a")
// and section 9 "Asli Hyderabad Originals" (data-sec="collection-b").
//
//   node tools/test/originals.mjs <url> <absOutDir>
//
// Desktop: hovering each card shows its state in the panel and plays its clip; section 4 stays independent.
// Reduced motion: a still image instead of video. Phone: first tap previews, second tap follows the link.
import { launch, sleep } from './cdp.mjs';

const [url, out] = process.argv.slice(2);
const results = [];
const check = (name, ok, info) => { results.push({ name, ok: !!ok, info }); };
const ST = (sec) => `(()=>{const w=document.querySelector('[data-sec="${sec}"]');const p=w.querySelector('[data-theme-panel]');const v=w.querySelector('[data-theme-video]');const cur=w.querySelector('.mn-themes__state.is-current');const act=w.querySelector('.mn-card.is-active');
  return {state:cur&&cur.dataset.state,active:act&&act.dataset.theme,playing:p.classList.contains('is-playing'),still:p.classList.contains('has-still'),video:(v.getAttribute('src')||'').split('/').pop(),paused:v.paused,path:location.pathname,docW:document.documentElement.scrollWidth,vw:innerWidth}})()`;
const CARDS = (sec) => `[data-sec="${sec}"] .mn-card`;

// Desktop
let b = await launch({ out, port: 9352 }); b.url = url;
await b.load(1440, 900);
await b.walkTo(await b.pageTop('[data-sec="collection-b"]') - 120, 120, 30);
await sleep(2000);
const themes = await b.ev(`[...document.querySelectorAll('${CARDS('collection-b')}')].map(c=>c.dataset.theme)`);
for (let i = 0; i < themes.length; i++) {
  const r = await b.ensureVisible(CARDS('collection-b'), i);
  await b.hover(r.cx, r.cy); await sleep(2200);
  const s = await b.ev(ST('collection-b'));
  check(`desktop hover ${themes[i]}`, s.state === themes[i] && s.active === themes[i] && s.playing && !s.paused && s.video === themes[i] + '.mp4', s);
  if (i === 0 || i === themes.length - 1) await b.shot('originals-' + themes[i]);
}
await b.hover(5, 5);
await b.walkTo(await b.pageTop('[data-sec="collection-a"]') - 120, 80, 30); await sleep(1500);
{ const r = await b.ensureVisible(CARDS('collection-a'), 0); await b.hover(r.cx, r.cy); await sleep(2000); }
const s4 = await b.ev(ST('collection-a')); const s9 = await b.ev(ST('collection-b'));
check('section 4 still works on its own', s4.state === 'heritage' && s4.playing && !s4.paused, s4);
check('section 9 pauses when off screen', s9.paused, s9);
const deskLogs = [...b.logs]; b.close();

// Reduced motion (fresh browser: touch emulation from another run would disable hover)
b = await launch({ out, port: 9353 }); b.url = url;
await b.load(1440, 900, { reduce: true });
await b.ev(`window.scrollTo(0, ${await b.pageTop('[data-sec="collection-b"]')})`); await sleep(1200);
{ const r = await b.ensureVisible(CARDS('collection-b'), 4); await b.hover(r.cx, r.cy); await sleep(1200); }
const rm = await b.ev(ST('collection-b'));
check('reduced motion shows a still, no video', rm.still && !rm.playing && rm.video === '', rm);

// Phone: tap-to-preview, then tap again to open
await b.load(390, 844, { touch: true });
for (const sec of ['collection-a', 'collection-b']) {
  await b.ev(`window.scrollTo(0, ${await b.pageTop(`[data-sec="${sec}"] .mn-collection__grid`)} - 200)`); await sleep(1500);
  let r = await b.ensureVisible(CARDS(sec), 0); await b.tap(r.cx, r.cy); await sleep(1800);
  const first = await b.ev(ST(sec));
  check(`${sec}: first tap previews (stays on page)`, first.path === '/' && first.active, first);
  if (first.path === '/') await b.shot(`${sec}-phone-preview`);
  r = await b.ensureVisible(CARDS(sec), 0); await b.tap(r.cx, r.cy); await sleep(1800);
  const second = await b.ev('location.pathname');
  check(`${sec}: second tap opens the card link`, second !== '/', second);
  if (second !== '/') await b.load(390, 844, { touch: true });
}
const logs = deskLogs.concat(b.logs).filter((l) => !/favicon|\/originals\/|\/experiences\//.test(l));
b.close();

for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.ok ? '' : '  ' + JSON.stringify(r.info)}`);
console.log('console:', logs.length ? logs : 'clean');
process.exit(results.every((r) => r.ok) && !logs.length ? 0 : 1);
