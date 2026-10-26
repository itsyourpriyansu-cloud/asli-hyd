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

// Desktop: hover, leave, focus.
for (const [w, h] of [[1440, 900], [1100, 800]]) {
  await load(w, h); await toSection();
  R[`d${w}_initial`] = await ev(state);
  await shot(`s4-${w}-intro`);
  for (const t of ['heritage', 'cinema']) {
    const [x, y] = await center(`.mn-card[data-theme="${t}"]`);
    await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y }); await sleep(1600);
    R[`d${w}_hover_${t}`] = await ev(state);
    await shot(`s4-${w}-${t}`);
  }
  // Leave the grid onto the panel: state must stay.
  const [px, py] = await center('[data-theme-panel]');
  await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: px, y: py }); await sleep(900);
  R[`d${w}_afterLeave`] = await ev(state);
  // Fast sweep across cards: only the last should win (hover intent).
  for (const t of ['culture', 'business', 'wellness']) { const [x, y] = await center(`.mn-card[data-theme="${t}"]`); await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y }); await sleep(40); }
  await sleep(700);
  R[`d${w}_sweep`] = (await ev(state)).state;
  await ev(`document.querySelector('.mn-card[data-theme="learning"]').focus()`); await sleep(700);
  R[`d${w}_focus`] = (await ev(state)).state;
}
// Touch: first tap previews, second tap navigates.
for (const [w, h] of [[800, 1024], [375, 812]]) {
  await load(w, h, { touch: true }); await toSection();
  await shot(`s4-${w}-intro`);
  await ev(`document.querySelector('.mn-card[data-theme="culture"]').scrollIntoView({inline:'start',block:'nearest'})`); await sleep(400);
  await ev(`document.querySelector('.mn-card[data-theme="culture"]').click()`); await sleep(1500);
  R[`t${w}_tap1`] = await ev(state);
  await shot(`s4-${w}-culture`);
  await ev(`document.querySelector('.mn-card[data-theme="culture"]').click()`); await sleep(1200);
  R[`t${w}_tap2_url`] = await ev('location.pathname');
}
// Reduced motion: static image instead of video.
await load(1440, 900, { reduce: true }); await toSection();
const [x, y] = await center(`.mn-card[data-theme="wellness"]`);
await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y }); await sleep(1200);
R.reduced = await ev(state);
await shot('s4-1440-reduced');
R.logs = logs;
console.log(JSON.stringify(R, null, 1));
ws.close(); chrome.kill(); process.exit(0);
