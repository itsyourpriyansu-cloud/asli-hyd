// Footer, one screen tall, with "Hyderabad, at dusk" as its background: walk to the end of the page at desktop,
// laptop and phone sizes and check the content is all there (logo, contact, social links, three link columns,
// legal row and the design credit on the ground band), the desktop footer fits one viewport with the content clear of the
// buildings, the inlay has unrolled, the three tiers have risen to rest, the lamps are lit, the ambient loops
// run on screen, and nothing scrolls sideways. Scrolling back lowers the tiers.
// Reduced motion: everything complete and still.
//
//   node tools/test/footer.mjs http://127.0.0.1:8655/ C:/abs/out
import { launch, sleep } from './cdp.mjs';

const [url, out] = process.argv.slice(2);
if (!url || !out) { console.log('usage: node tools/test/footer.mjs <url> <absOutDir>'); process.exit(1); }

const results = [];
const check = (name, ok, info = '') => { results.push({ name, ok: !!ok, info }); console.log((ok ? 'PASS ' : 'FAIL ') + name + (info ? '  ' + info : '')); };

const state = `(()=>{
  const f = document.querySelector('.mn-footer'), q = (s) => f.querySelector(s);
  const ty = (s) => { const t = q(s).transform.baseVal; return t.length ? t.consolidate().matrix.f : 0; };
  const r = f.getBoundingClientRect(), sky = q('.mn-footer__scene').getBoundingClientRect(), edge = q('.mn-footer__edge').getBoundingClientRect();
  const env = q('.mn-footer__envizon'), main = document.querySelector('main').getBoundingClientRect();
  return {
    logo: !!q('.mn-footer__logo img').naturalWidth, cols: f.querySelectorAll('.mn-footer__col-title').length,
    contact: f.querySelectorAll('.mn-footer__contact li').length, legal: !!q('.mn-footer__legal'),
    social: [...f.querySelectorAll('.mn-footer__social a')].map((a) => a.getAttribute('aria-label') + (a.querySelector('svg').getBoundingClientRect().width > 10 ? '' : '!')),
    fh: Math.round(r.height), mainBottom: Math.round(Math.max(...[...f.querySelectorAll('.mn-footer__brand > *, .mn-footer__cols ul')].map((e) => e.getBoundingClientRect().bottom))),
    builds: Math.round(sky.top + sky.height * .37),
    inlay: getComputedStyle(q('.mn-footer__inlay')).clipPath,
    edgeGap: Math.round(r.top - main.bottom), edgeH: Math.round(edge.height),
    far: ty('.mn-footer__tier--far'), mid: ty('.mn-footer__tier--mid'), near: ty('.mn-footer__tier--near'),
    lit: f.classList.contains('is-lit'), on: f.classList.contains('is-on'),
    lamp: +getComputedStyle(q('.mn-footer__lamps circle')).opacity,
    bird: getComputedStyle(q('.mn-footer__bird')).animationPlayState, birdAnim: getComputedStyle(q('.mn-footer__bird')).animationName,
    footBottom: Math.round(r.bottom), sky: { top: Math.round(sky.top), h: Math.round(sky.height) },
    vw: innerWidth, vh: innerHeight, docW: document.documentElement.scrollWidth,
    env: { href: env.href, target: env.target, rel: env.rel, text: env.textContent.trim() },
    band: (q('.mn-footer__scene').textContent + ' ' + q('.mn-footer__ground').textContent).replace(/\\s+/g, ' ').trim(),
  };
})()`;

const b = await launch({ out, port: 9363 });
b.url = url;
for (const [w, h] of [[1440, 900], [1280, 720], [390, 844]]) {
  const touch = w <= 1024, tag = `${w}x${h}`;
  await b.load(w, h, { touch });
  const end = await b.ev('document.documentElement.scrollHeight - innerHeight');
  await b.walkTo(end, 140, 30);
  await sleep(3200);
  const s = await b.ev(state);
  await b.shot(`footer-${tag}`);
  check(`${tag} footer content intact`, s.logo && s.cols === 3 && s.contact === 3 && s.legal,`cols ${s.cols} contact ${s.contact}`);
  check(`${tag} social icons shown`, s.social.join() === 'Instagram,Facebook,LinkedIn,YouTube,WhatsApp', s.social.join());
  if (w > 1024) check(`${tag} footer is one screen tall`, Math.abs(s.fh - s.vh) <= 2, `footer ${s.fh} / vh ${s.vh}`);
  check(`${tag} content clear of the buildings`, s.mainBottom <= s.builds, `content ends ${s.mainBottom}, buildings from ${s.builds}`);
  check(`${tag} cusped edge meets the CTA`, s.edgeGap === 0 && s.edgeH > 10, `gap ${s.edgeGap} edge ${s.edgeH}px`);
  check(`${tag} inlay unrolled`, !/50%/.test(s.inlay), s.inlay);
  check(`${tag} tiers at rest`, Math.abs(s.far) < 1 && Math.abs(s.mid) < 1 && Math.abs(s.near) < 1, `far ${s.far} mid ${s.mid} near ${s.near}`);
  check(`${tag} lamps lit`, s.lit && s.lamp > .95, `is-lit ${s.lit}, lamp ${s.lamp}`);
  check(`${tag} ambient running on screen`, s.on && s.bird === 'running', `${s.birdAnim} ${s.bird}`);
  check(`${tag} skyline band on screen, page ends on it`, s.sky.top >= 0 && s.sky.top + s.sky.h < s.vh && Math.abs(s.footBottom - s.vh) <= 2, `sky ${JSON.stringify(s.sky)} bottom ${s.footBottom}`);
  check(`${tag} no sideways scroll`, s.docW === s.vw, `docW ${s.docW} vw ${s.vw}`);
  check(`${tag} Envizon credit`, s.env.href === 'https://envizonstudio.com/' && s.env.target === '_blank' && /noopener/.test(s.env.rel) && s.env.text === 'Design by Envizon', JSON.stringify(s.env));
  check(`${tag} ground band: legal row and design credit`, s.band === '© 2026 Asli Hyderabad. All rights reserved.Privacy Policy · Terms & Conditions Design by Envizon', JSON.stringify(s.band));
  // Scroll back: the scrubbed rise reverses and the lamps go out.
  await b.walkTo(end - 420, 20, 30);
  await sleep(1600);
  const back = await b.ev(state);
  check(`${tag} scrolling back lowers the city`, back.far > 20 && back.far > back.mid && back.mid > back.near && !back.lit, `far ${back.far.toFixed(1)} mid ${back.mid.toFixed(1)} near ${back.near.toFixed(1)} lit ${back.lit}`);
  await b.shot(`footer-${tag}-back`);
}
check('console clean (sized runs)', b.logs.length === 0, b.logs.join(' | '));
const logCount = b.logs.length;

// Reduced motion: no motion.js; everything complete, nothing moves.
await b.load(1440, 900, { reduce: true });
await b.jump(await b.ev('document.documentElement.scrollHeight - innerHeight'));
await sleep(1200);
const r = await b.ev(state);
await b.shot('footer-1440x900-reduce');
check('reduced: inlay complete', !/50%/.test(r.inlay), r.inlay);
check('reduced: tiers in place, lamps lit', r.far === 0 && r.mid === 0 && r.near === 0 && r.lamp > .99, `far ${r.far} lamp ${r.lamp}`);
check('reduced: no ambient animation', r.birdAnim === 'none' && !r.on, `${r.birdAnim} on=${r.on}`);
check('console clean (reduced)', b.logs.length === logCount, b.logs.slice(logCount).join(' | '));

const failed = results.filter((x) => !x.ok).length;
console.log(`\n${results.length - failed}/${results.length} passed`);
b.close();
process.exit(failed ? 1 : 0);
