// Footer, quiet and still: walk to the end of the page at desktop, laptop and phone sizes and check the content is
// all there (logo, contact, social links, three link columns, legal row and the design credit), the WhatsApp link goes
// to the old site's number in a new tab, the Phosphor icon draws, nothing in the footer animates, the skyline and inlay
// are gone, the page ends on the footer and nothing scrolls sideways. Reduced motion shows the same footer.
//
//   node tools/test/footer.mjs http://127.0.0.1:8655/ C:/abs/out
import { launch, sleep } from './cdp.mjs';

const [url, out] = process.argv.slice(2);
if (!url || !out) { console.log('usage: node tools/test/footer.mjs <url> <absOutDir>'); process.exit(1); }

const results = [];
const check = (name, ok, info = '') => { results.push({ name, ok: !!ok, info }); console.log((ok ? 'PASS ' : 'FAIL ') + name + (info ? '  ' + info : '')); };

const state = `(()=>{
  const f = document.querySelector('.mn-footer'), q = (s) => f.querySelector(s);
  const env = q('.mn-footer__envizon'), r = f.getBoundingClientRect();
  const all = [f, ...f.querySelectorAll('*')];
  return {
    logo: !!q('.mn-footer__logo img').naturalWidth, cols: f.querySelectorAll('.mn-footer__col-title').length,
    contact: f.querySelectorAll('.mn-footer__contact li').length, legal: !!q('.mn-footer__legal'),
    social: [...f.querySelectorAll('.mn-footer__social a')].map((a) => {
      const box = a.querySelector('svg').getBoundingClientRect(), use = a.querySelector('use').getAttribute('href');
      return { label: a.getAttribute('aria-label'), href: a.href, target: a.target, rel: a.rel, use, drawn: box.width > 10 && !!document.querySelector(use + ' path'), size: Math.round(a.getBoundingClientRect().height) };
    }),
    gone: ['.mn-footer__scene', '.mn-footer__inlay', '.mn-footer__edge', '.mn-footer__sky'].filter((s) => q(s)),
    animated: all.filter((e) => getComputedStyle(e).animationName !== 'none').length + f.getAnimations({ subtree: true }).filter((a) => a.playState === 'running' && !(a instanceof CSSTransition)).length,
    footBottom: Math.round(r.bottom), vw: innerWidth, vh: innerHeight, docW: document.documentElement.scrollWidth,
    env: { href: env.href, target: env.target, rel: env.rel, text: env.textContent.trim() },
    row: q('.mn-footer__row').textContent.replace(/\\s+/g, ' ').trim(),
  };
})()`;

const verify = (tag, s) => {
  check(`${tag} footer content intact`, s.logo && s.cols === 3 && s.contact === 3 && s.legal, `cols ${s.cols} contact ${s.contact}`);
  // Instagram and Facebook use @aslihyderabad (chosen by the user; the old site links neither).
  const wa = s.social.find((x) => x.label === 'WhatsApp');
  check(`${tag} social icons shown`, s.social.map((x) => x.label).join() === 'Instagram,Facebook,WhatsApp' && s.social.every((x) => x.drawn && x.size >= 44 && x.target === '_blank' && /noopener/.test(x.rel)), s.social.map((x) => x.label).join());
  const ig = s.social.find((x) => x.label === "Instagram"), fb = s.social.find((x) => x.label === "Facebook");
  check(`${tag} Instagram and Facebook open @aslihyderabad`, ig && ig.href === "https://www.instagram.com/aslihyderabad/" && fb && fb.href === "https://www.facebook.com/aslihyderabad", `${ig && ig.href} ${fb && fb.href}`);
  check(`${tag} WhatsApp opens the Asli number in a new tab`, wa && wa.href === 'https://wa.me/919392149872' && wa.target === '_blank' && /noopener/.test(wa.rel), JSON.stringify(wa));
  check(`${tag} Phosphor icon drawn, 44px ring`, wa && wa.use === '#i-ph-whatsapp' && wa.drawn && wa.size >= 44, wa && `${wa.use} ${wa.size}px`);
  check(`${tag} skyline, inlay and edge removed`, s.gone.length === 0, s.gone.join());
  check(`${tag} nothing in the footer animates`, s.animated === 0, `${s.animated} animated`);
  check(`${tag} page ends on the footer`, Math.abs(s.footBottom - s.vh) <= 2, `bottom ${s.footBottom} / vh ${s.vh}`);
  check(`${tag} no sideways scroll`, s.docW === s.vw, `docW ${s.docW} vw ${s.vw}`);
  check(`${tag} Envizon credit`, s.env.href === 'https://envizonstudio.com/' && s.env.target === '_blank' && /noopener/.test(s.env.rel) && s.env.text === 'Design by Envizon', JSON.stringify(s.env));
  check(`${tag} legal row and design credit`, s.row === '© 2026 Asli Hyderabad. All rights reserved.Privacy Policy · Terms & Conditions Design by Envizon', JSON.stringify(s.row));
};

const b = await launch({ out, port: 9363 });
b.url = url;
for (const [w, h] of [[1440, 900], [1280, 720], [390, 844]]) {
  const tag = `${w}x${h}`;
  await b.load(w, h, { touch: w <= 1024 });
  await b.walkTo(await b.ev('document.documentElement.scrollHeight - innerHeight'), 140, 30);
  await sleep(2400);
  verify(tag, await b.ev(state));
  await b.shot(`footer-${tag}`);
}
check('console clean (sized runs)', b.logs.length === 0, b.logs.join(' | '));
const logCount = b.logs.length;

await b.load(1440, 900, { reduce: true });
await b.jump(await b.ev('document.documentElement.scrollHeight - innerHeight'));
await sleep(1200);
verify('reduced', await b.ev(state));
await b.shot('footer-1440x900-reduce');
check('console clean (reduced)', b.logs.length === logCount, b.logs.slice(logCount).join(' | '));

// Floating contact widget: closed and out of reach at rest; opens to Call, WhatsApp, Instagram and Facebook (X, LinkedIn
// and YouTube stay hidden until their address is set); Escape closes it; on an inner page it clears the phone booking bar.
const fab = `(()=>{const f=document.querySelector('[data-fab]'),t=f.querySelector('[data-fab-toggle]'),r=t.getBoundingClientRect();
  const shown=[...f.querySelectorAll('.mn-fab__item:not([hidden]) a')];
  return {open:f.classList.contains('is-open'),exp:t.getAttribute('aria-expanded'),inert:f.querySelector('.mn-fab__stack').inert,
    shown:shown.map(a=>a.getAttribute('aria-label')+'='+a.getAttribute('href')),hiddenN:f.querySelectorAll('.mn-fab__item[hidden]').length,
    op:shown.map(a=>+getComputedStyle(a).opacity),focus:document.activeElement.getAttribute('aria-label'),
    toggle:{r:Math.round(innerWidth-r.right),b:Math.round(innerHeight-r.bottom),s:Math.round(r.width)},vw:innerWidth,vh:innerHeight}})()`;
const fabLog = b.logs.length;
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const tag = `${w}x${h} widget`;
  await b.load(w, h, { touch: w <= 1024 });
  const c = await b.ev(fab);
  check(`${tag}: closed at rest, out of the tab order`, !c.open && c.exp === 'false' && c.inert && c.op.every((o) => o === 0), JSON.stringify(c));
  check(`${tag}: toggle sits bottom right, 44px or more`, c.toggle.r >= 16 && c.toggle.r <= 26 && c.toggle.b >= 16 && c.toggle.b <= 26 && c.toggle.s >= 44, JSON.stringify(c.toggle));
  await b.ev(`document.querySelector('[data-fab-toggle]').click()`); await sleep(900);
  const o = await b.ev(fab);
  check(`${tag}: opens to Call, WhatsApp, Instagram and Facebook, keyboard focus moves in`, o.open && o.exp === 'true' && !o.inert && o.shown.join() === 'Call us=tel:+919392149872,WhatsApp=https://wa.me/919392149872,Instagram=https://www.instagram.com/aslihyderabad/,Facebook=https://www.facebook.com/aslihyderabad' && o.op.every((x) => x === 1) && o.focus === 'Call us', JSON.stringify(o));
  check(`${tag}: social buttons without an address stay hidden`, o.hiddenN === 3, `${o.hiddenN} hidden`);
  await b.shot(`fab-open-${w}x${h}`);
  await b.ev(`document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape'}))`); await sleep(700);
  const e = await b.ev(fab);
  check(`${tag}: Escape closes it and returns focus to the toggle`, !e.open && e.inert && e.focus === 'Open contact options', JSON.stringify(e));
}
await b.load(390, 844, { touch: true, url: new URL('/tours/old-hyderabad', url).href });
await b.walkTo(1400, 40, 30); await sleep(1200);
const lift = await b.ev(`(()=>{const bar=document.querySelector('[data-bookbar]'),t=document.querySelector('[data-fab-toggle]').getBoundingClientRect();
  return {away:bar.classList.contains('is-away'),barTop:Math.round(bar.getBoundingClientRect().top),fabBottom:Math.round(t.bottom)}})()`);
check('390x844 inner page: widget clears the booking bar', !lift.away && lift.fabBottom <= lift.barTop - 8, JSON.stringify(lift));
await b.shot('fab-bookbar-390x844');
check('console clean (widget)', b.logs.length === fabLog, b.logs.slice(fabLog).join(' | '));

const failed = results.filter((x) => !x.ok).length;
console.log(`\n${results.length - failed}/${results.length} passed`);
b.close();
process.exit(failed ? 1 : 0);
