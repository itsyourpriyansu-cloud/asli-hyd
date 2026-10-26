// Checks for the last four sections and the page-wide fixes that came with them:
//   12 Featured Brands (data-sec="logos"), 13 Co-curated Experiences ("worlds"), 14 @aslihyderabad reels ("social"),
//   15 Your Hyderabad starts here ("heritage"), the in-page anchors and credits.html.
//
//   node tools/test/finale.mjs <url> <absOutDir>
//
// Desktop 1440x900 / 1280x720: every logo and photo loads, the reveals finish, hover swaps a logo to colour and
// brings up a card's line, keyboard focus does the same, on-screen reels play and off-screen ones are paused,
// the marquee pauses on hover, the CTA timeline draws, anchors land on their section. Phone: no horizontal
// scroll, two-column logo grid, the co-curated rail swipes with its text shown, a reel plays. Reduced motion:
// everything shown, no autoplay, no marquee. credits.html lists every new asset.
import { launch, sleep } from './cdp.mjs';

const [url, out] = process.argv.slice(2);
const results = [];
const check = (name, ok, info) => results.push({ name, ok: !!ok, info });
const top = (b, sec) => b.pageTop(`[data-sec="${sec}"]`);
const op = (sel, i = 0) => `+getComputedStyle(document.querySelectorAll(${JSON.stringify(sel)})[${i}]).opacity`;
const loaded = (sel) => `[...document.querySelectorAll(${JSON.stringify(sel)})].map(i=>i.complete&&i.naturalWidth>0)`;
const docW = `document.documentElement.scrollWidth===innerWidth`;
const REELS = `(()=>{const vs=[...document.querySelectorAll('[data-reels] video')];const m=document.querySelector('[data-reels]').getBoundingClientRect();
  return vs.map(v=>{const r=v.getBoundingClientRect();return {on:r.right>m.left&&r.left<m.right&&r.bottom>0&&r.top<innerHeight,playing:!v.paused&&v.currentTime>0}})})()`;

async function desktop(b, w, h, full) {
  await b.load(w, h);
  // Featured brands
  await b.walkTo(await top(b, 'logos'), 150, 25); await sleep(3800);
  const br = await b.ev(`({tiles:document.querySelectorAll('.mn-brand').length,ink:${loaded('.mn-brand__ink')},colour:${loaded('.mn-brand__colour')},
    shown:[...document.querySelectorAll('.mn-brand')].every(t=>+getComputedStyle(t).opacity>.99),
    art:[...document.querySelectorAll('.mn-brands__art path')].map(p=>+parseFloat(getComputedStyle(p).strokeDashoffset).toFixed(2)),
    gridFits:document.querySelector('.mn-brands__grid').getBoundingClientRect().right<=innerWidth,doc:${docW}})`);
  check(`${w}x${h}: 9 brand tiles, every logo loaded, tiles revealed, corner art drawn`, br.tiles === 9 && br.ink.every(Boolean) && br.colour.every(Boolean) && br.shown && br.art.every((v) => v === 0) && br.gridFits && br.doc, br);
  await b.shot(`brands-${w}x${h}`);
  if (full) {
    await b.ev(`document.querySelectorAll('.mn-brand')[4].scrollIntoView({block:'center'})`); await sleep(600);
    const t = await b.rect('.mn-brand', 4); await b.hover(t.cx, t.cy); await sleep(900);
    check('hovering a brand tile shows its colour logo', (await b.ev(op('.mn-brand__colour', 4))) > .95 && (await b.ev(op('.mn-brand__ink', 4))) < .05);
    await b.shot('brands-hover');
    await b.hover(5, 5);
  }
  // Co-curated
  await b.walkTo(await top(b, 'worlds'), 60, 30); await sleep(2400);
  const cc = await b.ev(`({cards:document.querySelectorAll('.mn-cc').length,imgs:${loaded('.mn-cc__img')},logos:${loaded('.mn-cc__partner img')},
    shown:[...document.querySelectorAll('.mn-cc')].every(c=>+getComputedStyle(c).opacity>.99),hero:${op('.mn-cc__more', 0)},rest:${op('.mn-cc__more', 2)},doc:${docW}})`);
  check(`${w}x${h}: 7 co-curated cards, photos and partner logos loaded, revealed; big card shows its line, others wait for hover`, cc.cards === 7 && cc.imgs.every(Boolean) && cc.logos.every(Boolean) && cc.shown && cc.hero > .95 && cc.rest < .05 && cc.doc, cc);
  await b.shot(`cocur-${w}x${h}`);
  if (full) {
    const c = await b.ensureVisible('.mn-cc', 2); await b.hover(c.cx, c.cy); await sleep(900);
    check('hovering a card brings up its line and Book experience', (await b.ev(op('.mn-cc__more', 2))) > .95);
    await b.shot('cocur-hover');
    await b.hover(5, 5); await sleep(700);
    await b.key('Tab', 'Tab', 9);
    await b.ev(`document.querySelectorAll('.mn-cc__link')[4].focus()`); await sleep(900);
    const f = await b.ev(`({fv:document.activeElement.matches(':focus-visible'),more:${op('.mn-cc__more', 4)}})`);
    check('keyboard focus on a card brings up its line', f.fv && f.more > .95, f);
    await b.ev('document.activeElement.blur()');
  }
  // Reels
  await b.walkTo(await top(b, 'social') + 120, 40, 30); await sleep(2500);
  const rs = await b.ev(REELS);
  const onPlaying = rs.filter((r) => r.on).every((r) => r.playing), offPaused = rs.filter((r) => !r.on).every((r) => !r.playing);
  check(`${w}x${h}: 16 reels (8 + clones); every reel on screen plays, every one off screen is paused`, rs.length === 16 && rs.some((r) => r.on) && onPlaying && offPaused, rs);
  await b.shot(`reels-${w}x${h}`);
  if (full) {
    const clones = await b.ev(`[...document.querySelectorAll('.mn-social__track > li')].slice(8).every(li=>li.getAttribute('aria-hidden')==='true')`);
    check('the cloned reels are hidden from assistive tech', clones);
    const m = await b.rect('[data-reels]'); await b.hover(m.cx, m.cy); await sleep(300);
    check('hovering the reels pauses the marquee', (await b.ev(`getComputedStyle(document.querySelector('.mn-social__track')).animationPlayState`)) === 'paused');
    await b.hover(5, 5);
  }
  // CTA
  await b.walkTo(await top(b, 'heritage') + 400, 40, 30); await sleep(3200);
  const cta = await b.ev(`({img:${loaded('.mn-heritage__img')}[0],heading:${op('.mn-heritage__heading')},steps:[...document.querySelectorAll('.mn-timeline__cap')].map(c=>+getComputedStyle(c).opacity),
    lines:[...document.querySelectorAll('.mn-timeline__line')].map(l=>new DOMMatrix(getComputedStyle(l).transform).a),
    capsIn:[...document.querySelectorAll('.mn-timeline__cap')].every(c=>{const r=c.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth}),doc:${docW}})`);
  check(`${w}x${h}: CTA photo loaded, heading shown, all three steps drawn and inside the screen`, cta.img && cta.heading > .99 && cta.steps.every((v) => v > .99) && cta.lines.every((v) => v > .99) && cta.capsIn && cta.doc, cta);
  await b.shot(`cta-${w}x${h}`);
  if (full) {
    for (const [id, sec] of [['co-curated', 'worlds'], ['quick-experiences', 'spinner'], ['private-access', 'collector']]) {
      await b.jump(0); await sleep(600);
      await b.ev(`document.querySelector('a[href="#${id}"]').click()`); await sleep(3200);
      const t = await b.ev(`Math.round(document.getElementById('${id}').getBoundingClientRect().top)`);
      check(`the #${id} link glides to its section`, Math.abs(t) <= 4, { top: t });
    }
  }
}

let b = await launch({ out, port: 9373 }); b.url = url;
await desktop(b, 1440, 900, true);
await desktop(b, 1280, 720, false);
const logs = [...b.logs]; b.close();

b = await launch({ out, port: 9374 }); b.url = url;
await b.load(1440, 900, { reduce: true });
for (const s of ['logos', 'worlds', 'social', 'heritage']) { await b.ev(`window.scrollTo(0, ${await top(b, s)})`); await sleep(700); }
const rm = await b.ev(`({tiles:[...document.querySelectorAll('.mn-brand')].every(t=>+getComputedStyle(t).opacity>.99),cards:[...document.querySelectorAll('.mn-cc')].every(c=>+getComputedStyle(c).opacity>.99),
  playing:[...document.querySelectorAll('[data-reels] video')].filter(v=>!v.paused).length,anim:getComputedStyle(document.querySelector('.mn-social__track')).animationName,
  steps:[...document.querySelectorAll('.mn-timeline__cap')].every(c=>+getComputedStyle(c).opacity>.99)})`);
check('reduced motion: everything shown, no reel autoplays, no marquee', rm.tiles && rm.cards && rm.playing === 0 && rm.anim === 'none' && rm.steps, rm);

await b.load(390, 844, { touch: true });
await b.walkTo(await top(b, 'logos'), 120, 25); await sleep(2200);
const pb = await b.ev(`(()=>{const t=[...document.querySelectorAll('.mn-brand')].map(e=>e.getBoundingClientRect());const last=t[8];return {cols:new Set(t.slice(0,8).map(r=>Math.round(r.left))).size,
  lastCentred:Math.abs((last.left+last.right)/2-innerWidth/2)<4,doc:${docW}}})()`);
check('phone: brands in two columns, the ninth tile centred, no horizontal scroll', pb.cols === 2 && pb.lastCentred && pb.doc, pb);
await b.shot('brands-phone');
await b.walkTo(await top(b, 'worlds') + 300, 40, 30); await sleep(1800);
const pc = await b.ev(`(()=>{const g=document.querySelector('.mn-cocur__grid');return {rail:g.scrollWidth>g.clientWidth+50,more:${op('.mn-cc__more', 2)},doc:${docW}}})()`);
check('phone: co-curated is a swipe rail with every line shown, no horizontal page scroll', pc.rail && pc.more > .95 && pc.doc, pc);
await b.shot('cocur-phone');
await b.walkTo(await top(b, 'social') + 200, 30, 30); await sleep(2500);
const pr = await b.ev(REELS);
check('phone: a reel on screen plays', pr.some((r) => r.on && r.playing), pr.filter((r) => r.on));
await b.shot('reels-phone');
await b.walkTo(await top(b, 'heritage') + 300, 30, 30); await sleep(3000);
await b.shot('cta-phone');
check('phone: no horizontal scroll at the end of the page', await b.ev(docW));

await b.load(1440, 900, { url: url.replace(/\/?$/, '/') + 'credits.html' });
const cr = await b.ev(`(()=>{const t=document.body.innerText;const need=['high-tea.jpg','chai-time.jpg','hyderabad-tasting.jpg','pearl-experience.jpg','behind-the-screen.jpg','made-in-hyderabad.jpg','reset.jpg','cta-taramati.jpg','taj-falaknuma','paradise','shilparamam','hyderabad.mp4','dance.mp4','jewellery.mp4'];
  return {tables:document.querySelectorAll('table').length,missing:need.filter(n=>!t.includes(n)),doc:${docW}}})()`);
check('credits.html lists every new photo, logo and reel', cr.tables >= 8 && cr.missing.length === 0 && cr.doc, cr);
await b.shot('credits');
logs.push(...b.logs); b.close();

for (const x of results) console.log(`${x.ok ? 'PASS' : 'FAIL'}  ${x.name}${x.ok ? '' : '  ' + JSON.stringify(x.info).slice(0, 700)}`);
const bad = logs.filter((l) => !/favicon/.test(l));
console.log('console:', bad.length ? bad : 'clean');
process.exit(results.every((x) => x.ok) && !bad.length ? 0 : 1);
