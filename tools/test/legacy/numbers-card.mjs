import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';
const [URL, OUT, W, H] = process.argv.slice(2); const PORT = 9390 + Math.floor(Math.random() * 40);
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', `--remote-debugging-port=${PORT}`, '--no-first-run', '--hide-scrollbars', `--user-data-dir=${OUT}/profile-card`, 'about:blank'], { stdio: 'ignore' });
const sleep = ms => new Promise(r => setTimeout(r, ms)); let t;
for (let i = 0; i < 60 && !t; i++) { try { t = (await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()).find(x => x.type === 'page'); } catch {} if (!t) await sleep(200); }
const ws = new WebSocket(t.webSocketDebuggerUrl); await new Promise(r => ws.addEventListener('open', r)); let id = 0; const P = new Map(); const logs = [];
ws.addEventListener('message', e => { const m = JSON.parse(e.data); if (m.id && P.has(m.id)) { P.get(m.id)(m); P.delete(m.id); } if (m.method === 'Runtime.exceptionThrown') logs.push(m.params.exceptionDetails.exception?.description); });
const send = (m, p = {}) => new Promise(r => { const i = ++id; P.set(i, r); ws.send(JSON.stringify({ id: i, method: m, params: p })); });
const ev = async x => (await send('Runtime.evaluate', { expression: x, returnByValue: true, awaitPromise: true })).result?.result?.value;
await send('Page.enable'); await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', { width: +W, height: +H, deviceScaleFactor: 1, mobile: +W < 750 });
await send('Page.navigate', { url: URL }); await sleep(800); await ev('window.mnPreloader ? window.mnPreloader.done.then(()=>1) : 1'); await sleep(800);
await ev(`(()=>{const src=document.querySelector('.mn-ed--numbers .mn-ed__content--boxed');const wrap=document.createElement('div');wrap.className='mn-ed mn-ed--numbers';wrap.style.cssText='position:fixed;left:60px;top:40px;z-index:99999;display:block;min-height:0;background:#6b5a48;padding:30px';const c=src.cloneNode(true);c.style.cssText='';c.removeAttribute('style');wrap.appendChild(c);document.body.appendChild(wrap);[c,...c.querySelectorAll('*')].forEach(e=>{e.style.opacity='';e.style.transform='';e.style.filter='';e.style.visibility=''});})()`);
await sleep(500);
const box = await ev(`(()=>{const r=document.querySelector('body > .mn-ed--numbers').getBoundingClientRect();return {x:r.left,y:r.top,w:r.width,h:r.height}})()`);
const r = await send('Page.captureScreenshot', { format: 'png', clip: { x: Math.max(0, box.x - 20), y: Math.max(0, box.y - 20), width: box.w + 40, height: box.h + 40, scale: 1 } });
writeFileSync(`${OUT}/card-${W}.png`, Buffer.from(r.result.data, 'base64'));
console.log(JSON.stringify({ box, logs })); ws.close(); chrome.kill(); process.exit(0);
