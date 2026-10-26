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
  await send('Page.navigate', { url: URL }); await sleep(2500);
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


async function toConv() {
  const y = await ev(`Math.round(document.querySelector('[data-conventions]').getBoundingClientRect().top + scrollY)`);
  for (let i = 1; i <= 30; i++) { await ev(`window.scrollTo(0, ${Math.round(y * i / 30)})`); await sleep(70); }
  await sleep(1800);
}
const st = `(()=>{const w=document.querySelector('[data-conventions]');const c=w.querySelector('.mn-conv__card.is-current');const r=w.getBoundingClientRect();
 return {idx:w.querySelector('[data-conv-index]').textContent,total:w.querySelector('[data-conv-total]').textContent,title:c&&c.querySelector('.mn-conv__name').textContent,date:w.querySelector('[data-conv-date]').textContent,tag:!w.querySelector('[data-conv-tag]').hidden,venue:w.querySelector('[data-conv-venue-text]').textContent,href:w.querySelector('[data-conv-venue]').getAttribute('href'),secTop:Math.round(r.top),secH:Math.round(r.height),docW:document.documentElement.scrollWidth,vw:innerWidth,live:w.querySelector('[data-conv-live]').textContent}})()`;
const R2 = {};
for (const [w, h] of [[1440, 900], [1100, 800], [800, 1024], [375, 812]]) {
  const touch = w < 750;
  await load(w, h, { touch }); await toConv();
  R2[`${w}_start`] = await ev(st); await shot(`conv-${w}-1`);
  await ev(`document.querySelector('[data-conv-next]').click()`); await sleep(1200);
  R2[`${w}_next`] = await ev(st); await shot(`conv-${w}-2`);
  if (w === 1440) {
    await ev(`document.querySelector('[data-conv-prev]').click()`); await sleep(1100);
    R2.prev = (await ev(st)).idx;
    await ev(`document.querySelector('[data-conv-prev]').click()`); await sleep(1100);
    R2.wrap = (await ev(st)).idx;
    await ev(`document.querySelector('[data-conventions] .mn-conv__card.is-next-2').click()`); await sleep(1100);
    R2.sideJump = (await ev(st)).idx; R2.urlAfterSide = await ev('location.pathname');
    await ev(`document.querySelector('[data-conv-next]').focus()`);
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'ArrowRight', code: 'ArrowRight', windowsVirtualKeyCode: 39 }); await sleep(1100);
    R2.keyRight = (await ev(st)).idx;
  }
  if (touch) {
    const [x, y] = await center('[data-conventions] .mn-conv__card.is-current');
    await send('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', clickCount: 1 });
    await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: x - 120, y, button: 'left' });
    await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: x - 120, y, button: 'left', clickCount: 1 }); await sleep(1100);
    R2.swipe = (await ev(st)).idx;
  }
}
// Mocked "today" after GANSID ends -> it should drop out.
await send('Page.addScriptToEvaluateOnNewDocument', { source: `(()=>{const F=Date;const T=new F('2026-10-26T10:00:00').getTime();class D extends F{constructor(...a){super(...(a.length?a:[T]))}static now(){return T}};window.Date=D})()` });
await load(1440, 900); await toConv();
R2.mocked = await ev(st);
// Section 4 still works (regression).
const [cx, cy] = [0, 0];
const y4 = await ev(`Math.round(document.querySelector('[data-sec="collection-a"] .mn-collection__layout').getBoundingClientRect().top + scrollY - 90)`);
const cur = await ev('scrollY');
for (let i = 1; i <= 30; i++) { await ev(`window.scrollTo(0, ${Math.round(cur + (y4 - cur) * i / 30)})`); await sleep(70); }
await sleep(2500);
const [hx, hy] = await center('.mn-card[data-theme="cinema"]');
await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: hx, y: hy }); await sleep(1800);
R2.sec4 = await ev(`(()=>{const v=document.querySelector('[data-theme-video]');return {state:document.querySelector('.mn-themes__state.is-current').dataset.state,playing:!v.paused}})()`);
await shot('conv-sec4-check');
Object.assign(R, R2);
R.logs = logs;
console.log(JSON.stringify(R, null, 1));
ws.close(); chrome.kill(); process.exit(0);
