// Homepage v3 (client feedback, 16 Nov 2026): the new section order and the sections rebuilt in that round.
//
//   node tools/test/home.mjs <url> <absOutDir>
//
// Desktop 1440x900 / 1280x720: sections in the agreed order; 6 ways as six windows in one row whose loop plays on
// hover; Featured Tours two rows of four plus "View more tours", icon theme tabs that filter; the conventions rail swipes (no pin) and
// "Find your event" opens the calendar (month grid, day pick, search, type filter, Esc returns focus); the numbers
// strip is slim and counts to its figures; Private Access is full bleed and nothing slides over it; Quick Experiences
// steps with its arrows; the shorts filter by partner, step with arrows and preview on hover; the testimonials have
// their own heading after the shorts; the CTA copy is ink on cream. Phone 390x844: no sideways scroll, 2 x 3
// windows, tours and shorts as swipe rails without arrows, a short plays while on screen, the calendar is a
// full-screen sheet. Reduced motion: everything shown without scrolling through it. Console clean throughout.
import { launch, sleep } from './cdp.mjs';

const [url, out] = process.argv.slice(2);
const results = [];
const check = (name, ok, info) => results.push({ name, ok: !!ok, info });
const top = (b, sec) => b.pageTop(`[data-sec="${sec}"]`);
const ORDER = 'hero,collection-a,tours,conventions,commission,collector,city,spinner,logos,worlds,materials,social,heritage';
const docW = `document.documentElement.scrollWidth===innerWidth`;
const shown = (sel) => `[...document.querySelectorAll(${JSON.stringify(sel)})].filter(e=>!e.hidden).length`;
const tops = (sel) => `[...new Set([...document.querySelectorAll(${JSON.stringify(sel)})].filter(e=>!e.hidden).map(e=>Math.round(e.getBoundingClientRect().top)))].length`;
const press = (sel) => `document.querySelector(${JSON.stringify(sel)}).click()`;

async function desktop(b, w, h, full) {
  await b.load(w, h);
  check(`${w}x${h}: sections in the v3 order, no Originals slot`, (await b.ev(`[...document.querySelectorAll('main > [data-sec]')].map(s=>s.dataset.sec).join(',')`)) === ORDER);

  // 2. Six windows in one row; hover plays the loop and brings up the line.
  await b.walkTo(await top(b, 'collection-a'), 40, 25); await sleep(1500);
  const ways = await b.ev(`({n:document.querySelectorAll('.mn-way').length,rows:${tops('.mn-ways__list > li')},links:[...document.querySelectorAll('.mn-way')].every(a=>/^\\/experiences\\//.test(a.getAttribute('href')))})`);
  check(`${w}x${h}: 6 ways: six windows in one row, each a theme link`, ways.n === 6 && ways.rows === 1 && ways.links, ways);
  if (full) {
    const r = await b.ensureVisible('.mn-way', 2);
    await b.hover(r.cx, r.cy); await sleep(2200);
    const hv = await b.ev(`(()=>{const a=document.querySelectorAll('.mn-way')[2];const v=a.querySelector('video');return {playing:a.classList.contains('is-playing')&&!v.paused,line:+getComputedStyle(a.querySelector('.mn-way__line')).opacity}})()`);
    check(`${w}x${h}: 6 ways: hover plays the theme loop and shows the line`, hv.playing && hv.line > .95, hv);
    await b.hover(5, 5); await sleep(600);
  }

  // 3. Featured Tours: 12 cards, two rows of four on show, "View more tours" opens the rest; icon tabs filter and announce.
  await b.walkTo(await top(b, 'tours'), 40, 25); await sleep(1500);
  const t0 = await b.ev(`({vis:[...document.querySelectorAll('.mn-tour')].filter(e=>e.offsetParent).length,more:!!document.querySelector('.mn-tours__more.is-on'),icons:document.querySelectorAll('.mn-tours .mn-tab .mn-tab__ic').length,n:${shown('.mn-tour')},row:(()=>{const c=[...document.querySelectorAll('.mn-tour')];const y=Math.round(c[0].getBoundingClientRect().top);return c.filter(e=>Math.round(e.getBoundingClientRect().top)===y).length})(),img:[...document.querySelectorAll('.mn-tour img')].length,young:!!document.querySelector('.mn-tour a[href*="young"]')})`);
  check(`${w}x${h}: tours: 12 cards, 8 on show in rows of 4, View more, an icon per tab, no Young Innovators`, t0.n === 12 && t0.vis === 8 && t0.more && t0.icons === 8 && t0.row === 4 && t0.img === 12 && !t0.young, t0);
  await b.ev(press('.mn-tours [data-filter="heritage"]')); await sleep(400);
  const t1 = await b.ev(`({n:${shown('.mn-tour')},status:document.querySelector('.mn-tours [data-filter-status]').textContent,pressed:document.querySelector('.mn-tours [data-filter="heritage"]').getAttribute('aria-pressed')})`);
  await b.ev(press('.mn-tours [data-filter="all"]')); await sleep(400);
  check(`${w}x${h}: tours: the Heritage tab filters and announces`, t1.n > 0 && t1.n < 12 && t1.status === t1.n + ' tours shown' && t1.pressed === 'true' && (await b.ev(shown('.mn-tour'))) === 12, t1);
  await b.ev(press('.mn-tours [data-more]')); await sleep(400);
  const t2 = await b.ev(`({vis:[...document.querySelectorAll('.mn-tour')].filter(e=>e.offsetParent).length,more:!!document.querySelector('.mn-tours__more.is-on'),exp:document.querySelector('[data-more]').getAttribute('aria-expanded'),focus:document.activeElement===document.querySelectorAll('.mn-tour a')[8]})`);
  check(`${w}x${h}: tours: View more shows all 12, hides itself, focus on the first new card`, t2.vis === 12 && !t2.more && t2.exp === 'true' && t2.focus, t2);

  // 4. Conventions: past events gone, the rest in date order, no eyebrow anywhere; a native swipe rail
  // (nothing pins), and the events calendar.
  const cv = await b.ev(`(()=>{const t=new Date();t.setHours(0,0,0,0);const it=[...document.querySelectorAll('.mn-conv__item')];
    const d=it.map(i=>i.querySelector('time').getAttribute('datetime'));return {n:it.length,past:it.filter(i=>new Date(i.dataset.end+'T00:00:00')<t).length,
    sorted:d.every((x,k)=>!k||d[k-1]<=x),eyebrows:document.querySelectorAll('[class*="eyebrow"]').length}})()`);
  check(`${w}x${h}: conventions: upcoming only, in date order, no eyebrow on the page`, cv.n > 0 && cv.past === 0 && cv.sorted && cv.eyebrows === 0, cv);
  const ct = await top(b, 'conventions');
  await b.walkTo(ct, 40, 25); await sleep(1200);
  await b.walkTo(ct + 400, 20, 25); await sleep(300);
  const conv = await b.ev(`({pin:!!document.querySelector('.pin-spacer'),y:Math.round(document.querySelector('[data-sec="conventions"]').getBoundingClientRect().top)})`);
  check(`${w}x${h}: conventions: no pin anywhere, the page scrolls straight on`, !conv.pin && conv.y < -350, conv);
  await b.walkTo(ct, 10, 25); await sleep(600);
  const fb = await b.rect('[data-finder-open]');
  await b.click(fb.cx, fb.cy); await sleep(800);
  const f0 = await b.ev(`({open:document.getElementById('mn-finder').open,locked:document.documentElement.classList.contains('is-locked'),label:document.querySelector('[data-finder-label]').textContent,
    pill:document.querySelector('[data-finder-month]').textContent,days:document.querySelectorAll('.mn-finder__day.has-event').length,rows:document.querySelectorAll('.mn-finder__row').length})`);
  check(`${w}x${h}: calendar opens on the first event's month, event days marked, page locked`, f0.open && f0.locked && f0.days > 0 && f0.rows > 0 && f0.label.startsWith(f0.pill.slice(0, 3)), f0);
  await b.ev(`document.querySelector('.mn-finder__day.has-event').click()`); await sleep(200);
  const f1 = await b.ev(`({pressed:document.querySelector('.mn-finder__day.is-picked')?.getAttribute('aria-pressed'),head:document.querySelector('[data-finder-heading]').textContent})`);
  check(`${w}x${h}: calendar: picking a day narrows the list to that day`, f1.pressed === 'true' && /^\d+ /.test(f1.head), f1);
  await b.ev(`(()=>{const i=document.querySelector('[data-finder-q]');i.value='bioasia';i.dispatchEvent(new Event('input'))})()`); await sleep(200);
  const f2 = await b.ev(`[...document.querySelectorAll('.mn-finder__name')].map(n=>n.textContent)`);
  check(`${w}x${h}: calendar: search looks across months`, f2.length === 1 && /BioAsia/.test(f2[0]), f2);
  await b.ev(`(()=>{const i=document.querySelector('[data-finder-q]');i.value='';i.dispatchEvent(new Event('input'));const c=document.querySelector('[data-finder-type][value="conference"]');c.checked=false;c.dispatchEvent(new Event('change'))})()`); await sleep(200);
  const f3 = await b.ev(`[...document.querySelectorAll('.mn-finder__type')].map(n=>n.textContent)`);
  check(`${w}x${h}: calendar: unticking Conferences hides them`, !f3.includes('Conference'), f3);
  await b.ev(`(()=>{const c=document.querySelector('[data-finder-type][value="conference"]');c.checked=true;c.dispatchEvent(new Event('change'))})()`);
  await b.key('Escape', 'Escape', 27); await sleep(500);
  const f4 = await b.ev(`({open:document.getElementById('mn-finder').open,locked:document.documentElement.classList.contains('is-locked'),focus:document.activeElement===document.querySelector('[data-finder-open]')})`);
  check(`${w}x${h}: calendar: Esc closes, unlocks the page, focus back on the button`, !f4.open && !f4.locked && f4.focus, f4);

  // 5. Numbers: one slim line that counts to its figures.
  await b.walkTo(await top(b, 'commission'), 30, 25); await sleep(3200);
  const nu = await b.ev(`({h:document.querySelector('[data-sec="commission"]').offsetHeight,figs:[...document.querySelectorAll('.mn-nums [data-count]')].map(e=>e.textContent===e.dataset.count),row:${tops('.mn-fig')}})`);
  check(`${w}x${h}: numbers: five figures on one line, counted, under half a screen tall`, nu.figs.length === 5 && nu.figs.every(Boolean) && nu.row === 1 && nu.h < h * .5, nu);

  // 6. Private Access: full bleed, one screen tall, nothing slides over it.
  await b.walkTo(await top(b, 'collector'), 30, 25); await sleep(2600);
  const pa = await b.ev(`(()=>{const a=document.querySelector('[data-sec="collector"] .mn-ed--access').getBoundingClientRect(),c=document.querySelector('[data-sec="city"]').getBoundingClientRect();return {gap:Math.round(c.top-a.bottom),w:Math.round(a.width),hh:Math.round(a.height),doors:getComputedStyle(document.querySelector('.mn-doors')).visibility}})()`);
  check(`${w}x${h}: private access: edge to edge, a screen tall, ends where the next section starts`, pa.gap >= 0 && pa.w === w && pa.hh >= Math.min(h, 1000) - 1, pa);

  // 8. Quick Experiences: native rail, arrows step it.
  await b.walkTo(await top(b, 'spinner'), 40, 25); await sleep(1500);
  const qa = await b.ev(`({btns:getComputedStyle(document.querySelector('.mn-arcade .mn-railbtns')).display,prev:document.querySelector('.mn-arcade [data-rail-prev]').disabled})`);
  await b.ev(press('.mn-arcade [data-rail-next]')); await sleep(900);
  const qb = await b.ev(`({x:document.querySelector('.mn-arcade__rail').scrollLeft,prev:document.querySelector('.mn-arcade [data-rail-prev]').disabled})`);
  check(`${w}x${h}: quick experiences: arrows shown, next steps the rail and wakes prev`, qa.btns === 'flex' && qa.prev && qb.x > 100 && !qb.prev, { qa, qb });

  // 10. Shorts: partner filter, arrows, hover preview.
  await b.walkTo(await top(b, 'worlds'), 40, 25); await sleep(1500);
  const s0 = await b.ev(`({n:${shown('.mn-short')},asli:document.querySelectorAll('.mn-short[data-tags="asli"]').length,logos:[...document.querySelectorAll('.mn-chip--logo img')].every(i=>i.complete&&i.naturalWidth>0),btns:getComputedStyle(document.querySelector('.mn-shorts .mn-railbtns')).display})`);
  check(`${w}x${h}: shorts: 13 cards (6 Originals), logo chips loaded, arrows shown`, s0.n === 13 && s0.asli === 6 && s0.logos && s0.btns === 'flex', s0);
  await b.ev(press('.mn-shorts [data-filter="ramoji"]')); await sleep(400);
  const s1 = await b.ev(`({n:${shown('.mn-short')},status:document.querySelector('.mn-shorts [data-filter-status]').textContent})`);
  await b.ev(press('.mn-shorts [data-filter="asli"]')); await sleep(400);
  const s2 = await b.ev(shown('.mn-short'));
  await b.ev(press('.mn-shorts [data-filter="all"]')); await sleep(400);
  check(`${w}x${h}: shorts: a partner logo filters to its experience, Asli Originals to the six`, s1.n === 1 && s1.status === '1 experience shown' && s2 === 6, { s1, s2 });
  if (full) {
    await b.ev(`document.querySelector('.mn-shorts__rail').scrollLeft=0`); await sleep(300);
    const r = await b.rect('.mn-short__link[data-preview]');
    await b.hover(r.cx, r.cy); await sleep(2200);
    const pv = await b.ev(`(()=>{const a=document.querySelector('.mn-short__link[data-preview]');return {playing:a.classList.contains('is-playing'),src:!!a.querySelector('video').getAttribute('src')}})()`);
    check(`${w}x${h}: shorts: hover plays the card's clip`, pv.playing && pv.src, pv);
    await b.hover(5, 5);
    await b.ev(press('.mn-shorts [data-rail-next]')); await sleep(900);
    check(`${w}x${h}: shorts: next arrow steps the row`, (await b.ev(`document.querySelector('.mn-shorts__rail').scrollLeft`)) > 100);
  }

  // 11. Testimonials: their own heading, after the shorts.
  const vo = await b.ev(`(()=>{const m=document.querySelector('[data-sec="materials"]');return {title:document.getElementById('mn-voices-title')?.textContent,labelled:m.getAttribute('aria-labelledby'),after:document.querySelector('[data-sec="worlds"]').compareDocumentPosition(m)&4}})()`);
  check(`${w}x${h}: testimonials: headed "in their words", after the shorts`, /in their words/.test(vo.title) && vo.labelled === 'mn-voices-title' && vo.after, vo);

  // 13. CTA: ink copy on cream beside the photo.
  await b.walkTo(await top(b, 'heritage'), 40, 25); await sleep(2500);
  const cta = await b.ev(`(()=>{const hd=document.querySelector('.mn-heritage__heading'),img=document.querySelector('.mn-heritage__img'),bg=getComputedStyle(document.querySelector('.mn-heritage')).backgroundColor,
    hr=hd.getBoundingClientRect(),ir=img.getBoundingClientRect();return {ink:getComputedStyle(hd).color,bg,img:img.complete&&img.naturalWidth>0,beside:${w > 1024}?hr.right<ir.left:true,op:+getComputedStyle(hd).opacity}})()`);
  check(`${w}x${h}: CTA: ink heading on cream, photo loaded beside it`, cta.ink === 'rgb(42, 36, 32)' && cta.bg === 'rgb(244, 238, 228)' && cta.img && cta.beside && cta.op > .99, cta);
  check(`${w}x${h}: no horizontal scroll`, await b.ev(docW));
}

async function phone(b) {
  const [w, h] = [390, 844];
  await b.load(w, h, { touch: true });
  await b.walkTo(await top(b, 'collection-a'), 40, 25); await sleep(1200);
  const ways = await b.ev(`(()=>{const l=[...document.querySelectorAll('.mn-ways__list > li')].map(e=>e.getBoundingClientRect());return {cols:l.filter(r=>Math.round(r.top)===Math.round(l[0].top)).length,rows:${tops('.mn-ways__list > li')},line:+getComputedStyle(document.querySelector('.mn-way__line')).opacity,h:Math.round(l[5].bottom-l[0].top)}})()`);
  check('phone: 6 ways as 2 x 3 with the lines shown, about one screen', ways.cols === 2 && ways.rows === 3 && ways.line > .95 && ways.h < h, ways);
  await b.walkTo(await top(b, 'tours'), 40, 25); await sleep(1200);
  const tr = await b.ev(`(()=>{const g=document.querySelector('.mn-tours__grid');return {scroll:g.scrollWidth>g.clientWidth,tabs:document.querySelector('.mn-tabs').scrollWidth>innerWidth-1,rows:${tops('.mn-tour')}}})()`);
  check('phone: tours as one swipe rail, tabs in one swipeable row', tr.scroll && tr.rows === 1, tr);
  const ct = await top(b, 'conventions');
  await b.walkTo(ct, 40, 25); await sleep(1000);
  const fb = await b.ensureVisible('[data-finder-open]');
  await b.ev(press('[data-finder-open]')); await sleep(800);
  const sheet = await b.ev(`(()=>{const r=document.getElementById('mn-finder').getBoundingClientRect(),c=document.querySelector('.mn-finder__close').getBoundingClientRect();return {w:Math.round(r.width),h:Math.round(r.height),close:c.top>=0&&c.right<=innerWidth}})()`);
  check('phone: the calendar is a full-screen sheet with its close button on screen', sheet.w === w && sheet.h === h && sheet.close, { sheet, fb });
  await b.ev(`document.querySelector('.mn-finder__panel').scrollTop=900`); await sleep(300);
  check('phone: the close button stays put while the sheet scrolls', await b.ev(`document.querySelector('.mn-finder__close').getBoundingClientRect().top<40`));
  await b.ev(press('[data-finder-close]')); await sleep(500);
  check('phone: closing unlocks the page', !(await b.ev(`document.documentElement.classList.contains('is-locked')`)));
  await b.walkTo(await top(b, 'worlds'), 60, 25); await sleep(800);
  await b.ensureVisible('.mn-shorts__rail'); await sleep(2500);
  const sh = await b.ev(`(()=>{const r=document.querySelector('.mn-shorts__rail');return {scroll:r.scrollWidth>r.clientWidth,btns:getComputedStyle(document.querySelector('.mn-shorts .mn-railbtns')).display,playing:document.querySelectorAll('.mn-short__link.is-playing').length}})()`);
  check('phone: shorts swipe, no arrows, a short plays while on screen', sh.scroll && sh.btns === 'none' && sh.playing >= 1, sh);
  await b.walkTo(await top(b, 'heritage'), 60, 25); await sleep(800);
  check('phone: no horizontal scroll', await b.ev(docW));
}

async function reduced(b) {
  await b.load(1440, 900, { reduce: true });
  await b.ev(`window.scrollTo(0, ${await top(b, 'worlds')})`); await sleep(1500);
  const r = await b.ev(`({items:[...document.querySelectorAll('[data-rise-item],[data-rise]')].every(e=>+getComputedStyle(e).opacity>.99),
    nums:[...document.querySelectorAll('.mn-nums [data-count]')].every(e=>e.textContent===e.dataset.count),playing:document.querySelectorAll('.is-playing').length})`);
  check('reduced motion: every card and head shown, figures final, no previews', r.items && r.nums && r.playing === 0, r);
}

const b = await launch({ out, port: 9356 });
b.url = url;
await desktop(b, 1440, 900, true);
await desktop(b, 1280, 720, false);
await reduced(b);
await phone(b);
for (const r of results) console.log((r.ok ? 'PASS ' : 'FAIL ') + r.name + (r.ok ? '' : '  ' + JSON.stringify(r.info)));
console.log(b.logs.length ? 'console:\n' + b.logs.join('\n') : 'console: clean');
const failed = results.filter((r) => !r.ok).length + (b.logs.length ? 1 : 0);
console.log(`\n${results.length - results.filter((r) => !r.ok).length}/${results.length} passed`);
b.close();
process.exit(failed ? 1 : 0);
