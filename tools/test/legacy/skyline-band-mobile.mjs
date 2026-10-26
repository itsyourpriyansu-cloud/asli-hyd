// Headless Chrome (CDP) checks for section 4: hover, focus, touch two-step, reduced motion.
import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const URL = process.argv[2], OUT = process.argv[3];
mkdirSync(OUT, { recursive: true });
const PORT = 9334;
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', `--remote-debugging-port=${PORT}`, '--no-first-run', '--hide-scrollbars', '--autoplay-policy=no-user-gesture-required', `--user-data-dir=${join(OUT, 'profile2')}`, 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let target;
for (let i = 0; i < 60 && !target; i++) { try { target = (await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()).find((t) => t.type === 'page'); } catch {} if (!target) await sleep(200); }
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r));
let id = 0; const pending = new Map(); const logs = [];
ws.addEventListener('message', (ev) => {
  const m = JSON.parse(ev.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
  if (m.method === 'Runtime.exceptionThrown') logs.push('EXC ' + m.params.exceptionDetails.exception?.description);
  if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') logs.push('ERR ' + m.params.args.map((a) => a.value ?? a.description).join(' '));
  if (m.method === 'Log.entryAdded' && m.params.entry.level === 'error') logs.push('LOG ' + m.params.entry.text + ' ' + (m.params.entry.url || ''));
});
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (expr) => (await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result?.result?.value;
const shot = async (name) => { const r = await send('Page.captureScreenshot', { format: 'png' }); writeFileSync(join(OUT, name + '.png'), Buffer.from(r.result.data, 'base64')); };
await send('Runtime.enable'); await send('Log.enable'); await send('Page.enable');

async function load(w, h, { touch = false, reduce = false } = {}) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: touch });
  await send('Emulation.setTouchEmulationEnabled', { enabled: touch, maxTouchPoints: touch ? 5 : 0 });
  await send('Emulation.setEmulatedMedia', { features: [
    { name: 'prefers-reduced-motion', value: reduce ? 'reduce' : 'no-preference' },
    { name: 'hover', value: touch ? 'none' : 'hover' }, { name: 'pointer', value: touch ? 'coarse' : 'fine' }] });
  await send('Page.navigate', { url: URL }); await sleep(800); await ev(`window.mnPreloader ? window.mnPreloader.done.then(()=>1) : 1`); await sleep(1200);
}
// Walk down to section 4 like a user so ScrollTrigger reveals fire, then centre the grid.
async function toSection() {
  const y = await ev(`Math.round(document.querySelector('[data-sec="collection-a"] .mn-collection__layout').getBoundingClientRect().top + scrollY - 90)`);
  for (let i = 1; i <= 30; i++) { await ev(`window.scrollTo(0, ${Math.round(y * i / 30)})`); await sleep(70); }
  await sleep(2500);
}
const state = `(()=>{const w=document.querySelector('[data-themes]');const p=w.querySelector('[data-theme-panel]');const v=w.querySelector('[data-theme-video]');const cur=w.querySelector('.mn-themes__state.is-current');const act=w.querySelector('.mn-card.is-active');
  return {state:cur&&cur.dataset.state,cta:cur&&cur.querySelector('.mn-themes__cta').getAttribute('href'),active:act&&act.dataset.theme,playing:p.classList.contains('is-playing'),still:p.classList.contains('has-still'),videoPaused:v.paused,videoSrc:v.getAttribute('src'),videoOpacity:getComputedStyle(v).opacity,url:location.pathname,docW:document.documentElement.scrollWidth,vw:innerWidth}})()`;
const center = (sel) => ev(`(()=>{const r=document.querySelector('${sel}').getBoundingClientRect();return [Math.round(r.left+r.width/2),Math.round(r.top+r.height/2)]})()`);
const R = {};


for (const [w, h] of [[800, 1024], [375, 812]]) {
  await load(w, h, { touch: true });
  const st = `(()=>{const sky=document.querySelector('.mn-sec[data-sec="city"] .mn-skyline');const l=sky.querySelector('.mn-skyline__line');const off=parseFloat(getComputedStyle(l).strokeDashoffset)||0;const t=sky.querySelector('.mn-skyline__track');return {inSection:sky.parentElement.dataset.sec,drawn:+(1-off/l.getTotalLength()).toFixed(2),labels:[...sky.querySelectorAll('.mn-skyline__label')].filter(g=>+getComputedStyle(g).opacity>.5).length,scrollLeft:Math.round(t.scrollLeft),maxScroll:t.scrollWidth-t.clientWidth,docW:document.documentElement.scrollWidth,vw:innerWidth,top:Math.round(sky.getBoundingClientRect().top)}})()`;
  const y = await ev(`(()=>{const e=document.querySelector('.mn-sec[data-sec="city"] .mn-skyline');return Math.round(e.getBoundingClientRect().top+scrollY-innerHeight*.9)})()`);
  for (let i = 1; i <= 30; i++) { await ev(`window.scrollTo(0, ${Math.round(y * i / 30)})`); await sleep(60); }
  await sleep(300); R['m' + w + '_before'] = await ev(st);
  await ev(`window.scrollBy(0, innerHeight*.45)`); await sleep(1300);
  R['m' + w + '_mid'] = await ev(st); await shot('band-' + w + '-mid');
  await sleep(1800);
  R['m' + w + '_done'] = await ev(st); await shot('band-' + w);
}
R.logs = logs;
console.log(JSON.stringify(R, null, 1));
ws.close(); chrome.kill(); process.exit(0);
