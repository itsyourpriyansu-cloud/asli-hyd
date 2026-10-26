import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
const [URL, OUT, W, H, TAG, MODE] = process.argv.slice(2);
const dir = `${OUT}/pre-${TAG}`; mkdirSync(dir, { recursive: true });
const PORT = 9340 + Math.floor(Math.random() * 50);
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', `--remote-debugging-port=${PORT}`, '--no-first-run', '--hide-scrollbars', '--autoplay-policy=no-user-gesture-required', `--user-data-dir=${OUT}/profile-pre-${TAG}`, 'about:blank'], { stdio: 'ignore' });
const sleep = ms => new Promise(r => setTimeout(r, ms)); let t;
for (let i = 0; i < 60 && !t; i++) { try { t = (await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()).find(x => x.type === 'page'); } catch {} if (!t) await sleep(200); }
const ws = new WebSocket(t.webSocketDebuggerUrl); await new Promise(r => ws.addEventListener('open', r)); let id = 0; const P = new Map(); let t0 = 0; const logs = [];
const send = (m, p = {}) => new Promise(r => { const i = ++id; P.set(i, r); ws.send(JSON.stringify({ id: i, method: m, params: p })); });
const ev = async x => (await send('Runtime.evaluate', { expression: x, returnByValue: true })).result?.result?.value;
ws.addEventListener('message', e => { const m = JSON.parse(e.data); if (m.id && P.has(m.id)) { P.get(m.id)(m); P.delete(m.id); }
  if (m.method === 'Page.screencastFrame') { if (t0) writeFileSync(`${dir}/${String(Date.now() - t0).padStart(5, '0')}.jpg`, Buffer.from(m.params.data, 'base64')); send('Page.screencastFrameAck', { sessionId: m.params.sessionId }); }
  if (m.method === 'Runtime.exceptionThrown') logs.push('EXC ' + m.params.exceptionDetails.exception?.description);
  if (m.method === 'Log.entryAdded' && m.params.entry.level === 'error') logs.push('LOG ' + m.params.entry.text + ' ' + (m.params.entry.url || '')); });
await send('Page.enable'); await send('Runtime.enable'); await send('Log.enable');
await send('Emulation.setDeviceMetricsOverride', { width: +W, height: +H, deviceScaleFactor: 1, mobile: +W < 750 });
if (MODE === 'reduce') await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
if (MODE === 'nogsap') await send('Network.setBlockedURLs', { urls: ['*gsap.min.js'] }) , await send('Network.enable');
await send('Page.startScreencast', { format: 'jpeg', quality: 60, everyNthFrame: 2 });
const R = { samples: [] };
const probe = `(()=>{const v=document.querySelector('.mn-hero__video');const h=document.querySelector('[data-header]');return {pre:document.documentElement.classList.contains('is-preloading'),loader:!!document.getElementById('mn-pre'),vPaused:v.paused,vTime:+v.currentTime.toFixed(2),headerOp:getComputedStyle(h).opacity,heroTitleOp:getComputedStyle(document.querySelector('.mn-hero__content')).opacity,y:Math.round(scrollY)}})()`;
for (let run = 0; run < (MODE === 'refresh' ? 3 : 1); run++) {
  t0 = Date.now(); await send('Page.navigate', { url: URL });
  for (let k = 0; k < 12; k++) { await sleep(500); const s = await ev(probe); if (s) R.samples.push({ run, ms: Date.now() - t0, ...s }); if (k === 3) { await send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: 300, y: 300, deltaX: 0, deltaY: 600 }); } }
  if (run < 2 && MODE === 'refresh') await ev('window.scrollTo(0, 1500)');
}
await send('Page.stopScreencast');
R.logs = logs; console.log(JSON.stringify(R));
ws.close(); chrome.kill(); process.exit(0);
