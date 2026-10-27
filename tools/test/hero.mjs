// Section 1, hero headline in Cormorant Garamond Light: at desktop, laptop, small-desktop, tablet and phone widths
// check the font has loaded on the headline, the headline sits in exactly three left-aligned lines
// ("Experience" / "Asli = Real" / "Hyderabad") inside the screen, the letter sweep finishes, the accessible name
// reads as one phrase, and nothing scrolls sideways. Reduced motion: shown straight away.
//
//   node tools/test/hero.mjs http://127.0.0.1:8655/ C:/abs/out
import { launch, sleep } from './cdp.mjs';

const [url, out] = process.argv.slice(2);
if (!url || !out) { console.log('usage: node tools/test/hero.mjs <url> <absOutDir>'); process.exit(1); }

const results = [];
const check = (name, ok, info = '') => { results.push(!!ok); console.log((ok ? 'PASS ' : 'FAIL ') + name + (info ? '  ' + info : '')); };

const state = `(()=>{
  const h = document.querySelector('.mn-hero__heading'), cs = getComputedStyle(h);
  const lines = [...h.querySelectorAll('.mn-hero__line')].map((l) => {
    const r = document.createRange(); r.selectNodeContents(l); const b = r.getBoundingClientRect();
    return { text: l.textContent.replace(/\\s+/g, ' ').trim(), left: Math.round(b.left), right: Math.round(b.right), top: Math.round(b.top) };
  });
  const chars = [...h.querySelectorAll('span[style*="inline-block"] span')];
  // Rows of text, whether or not the letters are split (reduced motion leaves them whole).
  const tops = new Set(), walker = document.createTreeWalker(h, NodeFilter.SHOW_TEXT), fs = parseFloat(cs.fontSize);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (!n.nodeValue.trim()) continue;
    const r = document.createRange(); r.selectNodeContents(n);
    for (const b of r.getClientRects()) if (b.width > 1) tops.add(Math.round(b.top / (fs * .5)));
  }
  const pad = parseFloat(getComputedStyle(document.querySelector('.mn-hero__inner')).paddingLeft);
  return {
    loaded: document.fonts.check('300 40px "Cormorant Garamond"'), family: cs.fontFamily, weight: cs.fontWeight, size: parseFloat(cs.fontSize), align: cs.textAlign,
    lines, rows: tops.size, pad, label: h.getAttribute('aria-label') || h.textContent.replace(/\\s+/g, ' ').trim(),
    shown: chars.length ? Math.min(...chars.map((c) => +getComputedStyle(c).opacity)) : 1,
    vw: innerWidth, docW: document.documentElement.scrollWidth,
  };
})()`;

const b = await launch({ out, port: 9368 });
b.url = url;
for (const [w, h] of [[1440, 900], [1280, 720], [1025, 768], [768, 1024], [390, 844]]) {
  const tag = `${w}x${h}`;
  await b.load(w, h, { touch: w <= 1024 });
  await sleep(3600);
  const s = await b.ev(state);
  await b.shot(`hero-${tag}`);
  check(`${tag} Cormorant Garamond Light loaded on the headline`, s.loaded && /^"?Cormorant Garamond/.test(s.family) && s.weight === '300', `${s.family} ${s.weight}`);
  check(`${tag} three lines, as written`, s.lines.map((l) => l.text).join('|') === 'Experience|Asli = Real|Hyderabad' && s.lines[0].top < s.lines[1].top && s.lines[1].top < s.lines[2].top, JSON.stringify(s.lines.map((l) => l.text)));
  check(`${tag} no extra wrapping`, s.rows === 3, `${s.rows} rows of letters`);
  check(`${tag} left aligned`, s.align === 'left' && Math.max(...s.lines.map((l) => l.left)) - Math.min(...s.lines.map((l) => l.left)) <= 6 && Math.abs(s.lines[0].left - s.pad) <= 8, `lefts ${s.lines.map((l) => l.left).join('/')}, padding ${s.pad}`);
  check(`${tag} inside the screen`, Math.max(...s.lines.map((l) => l.right)) <= s.vw - s.pad + 2 && s.docW === s.vw, `right ${Math.max(...s.lines.map((l) => l.right))} / ${s.vw - s.pad}, ${s.size.toFixed(1)}px`);
  check(`${tag} sweep finished`, s.shown > .99, 'min opacity ' + s.shown);
  check(`${tag} accessible name reads as one phrase`, s.label === 'Experience Asli = Real Hyderabad', s.label);
}
await b.load(1440, 900, { reduce: true });
await sleep(800);
const r = await b.ev(state);
await b.shot('hero-1440x900-reduce');
check('reduced motion: three lines in Cormorant, shown', r.loaded && r.rows === 3 && r.shown > .99, `rows ${r.rows}`);
check('console clean', b.logs.length === 0, b.logs.join(' | '));

const failed = results.filter((x) => !x).length;
console.log(`\n${results.length - failed}/${results.length} passed`);
b.close();
process.exit(failed ? 1 : 0);
