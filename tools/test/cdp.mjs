// Minimal headless-Chrome (CDP) harness for checking the homepage like a user would.
// No dependencies: Node 22+ (global fetch/WebSocket) and a local Chrome.
//
//   import { launch } from './cdp.mjs';
//   const b = await launch({ out: 'C:/abs/path/out', port: 9350 });
//   await b.load(1440, 900);                       // also: { touch: true }, { reduce: true }
//   await b.walkTo(await b.pageTop('[data-sec="city"]'));
//   await b.shot('city');                          // -> <out>/city.png
//   console.log(b.logs);                           // console errors, exceptions, failed loads
//   b.close();
//
// Notes
// - Pass an ABSOLUTE `out` path (Chrome's profile dir lives inside it; relative paths fail on Windows).
// - Walk, don't jump, into a section: the ScrollTrigger reveals and pins only fire while scrolling through.
// - Touch emulation is sticky inside one browser: after a { touch: true } load the page can keep reporting
//   "no hover". Run desktop/hover checks before touch checks, or in a separate launch().
import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

export const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function launch({ out, port = 9350 } = {}) {
  if (!out) throw new Error('launch({ out }) needs an absolute output directory');
  mkdirSync(out, { recursive: true });
  const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${port}`, '--no-first-run', '--hide-scrollbars',
    '--autoplay-policy=no-user-gesture-required', `--user-data-dir=${join(out, 'profile')}`, 'about:blank'], { stdio: 'ignore' });
  let target;
  for (let i = 0; i < 75 && !target; i++) {
    try { target = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find((t) => t.type === 'page'); } catch {}
    if (!target) await sleep(200);
  }
  if (!target) { chrome.kill(); throw new Error('Chrome did not start (check CHROME path / port ' + port + ')'); }
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener('open', r));
  let id = 0; const pending = new Map(); const logs = [];
  ws.addEventListener('message', (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
    if (m.method === 'Runtime.exceptionThrown') logs.push('EXC ' + m.params.exceptionDetails.exception?.description);
    if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') logs.push('ERR ' + m.params.args.map((a) => a.value ?? a.description).join(' '));
    if (m.method === 'Log.entryAdded' && m.params.entry.level === 'error') logs.push('LOG ' + m.params.entry.text + ' ' + (m.params.entry.url || ''));
  });
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  // Evaluate an expression in the page; promises are awaited, values come back as JSON.
  const ev = async (expr) => (await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result?.result?.value;
  await send('Runtime.enable'); await send('Log.enable'); await send('Page.enable');

  const b = {
    send, ev, logs, sleep,
    async shot(name) {
      const r = await send('Page.captureScreenshot', { format: 'png' });
      const file = join(out, name + '.png');
      writeFileSync(file, Buffer.from(r.result.data, 'base64'));
      return file;
    },
    // Load the page at a viewport and wait for the intro loader to hand over.
    async load(w, h, { touch = false, reduce = false, url = b.url } = {}) {
      await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: touch });
      await send('Emulation.setTouchEmulationEnabled', { enabled: touch, maxTouchPoints: touch ? 5 : 0 });
      await send('Emulation.setEmulatedMedia', { features: [
        { name: 'prefers-reduced-motion', value: reduce ? 'reduce' : 'no-preference' },
        { name: 'hover', value: touch ? 'none' : 'hover' }, { name: 'pointer', value: touch ? 'coarse' : 'fine' }] });
      await send('Page.navigate', { url });
      await sleep(800);
      // A cold load can still be parsing here (no window.mnPreloader yet, scrolling locked): wait for the parse first.
      for (let i = 0; i < 50 && await ev(`document.readyState === 'loading'`); i++) await sleep(200);
      await ev(`window.mnPreloader ? window.mnPreloader.done.then(()=>1) : 1`);
      await sleep(1000);
    },
    // Scroll instantly (through Lenis when it is running, so ScrollTrigger stays in sync).
    jump: (y) => ev(`window.mnLenis ? window.mnLenis.scrollTo(${Math.round(y)},{immediate:true}) : window.scrollTo(0,${Math.round(y)})`),
    // Scroll in small steps, like a wheel, so reveals, pins and once() triggers fire on the way.
    async walkTo(y, steps = 80, ms = 35) {
      const from = await ev('scrollY');
      for (let i = 1; i <= steps; i++) { await b.jump(from + (y - from) * i / steps); await sleep(ms); }
    },
    // Document offset of an element (offsetTop chain: unaffected by pins/transforms).
    pageTop: (sel) => ev(`(()=>{let e=document.querySelector(${JSON.stringify(sel)}),y=0;while(e){y+=e.offsetTop;e=e.offsetParent}return y})()`),
    rect: (sel, i = 0) => ev(`(()=>{const e=document.querySelectorAll(${JSON.stringify(sel)})[${i}];if(!e)return null;const r=e.getBoundingClientRect();return {x:Math.round(r.left),y:Math.round(r.top),w:Math.round(r.width),h:Math.round(r.height),cx:Math.round(r.left+r.width/2),cy:Math.round(r.top+r.height/2),vw:innerWidth,vh:innerHeight}})()`),
    // Nudge the page until element i of sel is fully inside the viewport (vertically).
    async ensureVisible(sel, i = 0, top = 70) {
      for (let k = 0; k < 6; k++) {
        const r = await b.rect(sel, i);
        if (!r) return null;
        if (r.y >= top && r.y + r.h <= r.vh - 10) return r;
        const d = r.y < top ? r.y - top - 50 : r.y + r.h - r.vh + 40;
        await b.jump((await ev('scrollY')) + d); await sleep(700);
      }
      return b.rect(sel, i);
    },
    hover: (x, y) => send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y }),
    async click(x, y) {
      await send('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', clickCount: 1 });
      await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', clickCount: 1 });
    },
    async tap(x, y) {
      await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
      await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    },
    async key(key, code = key, keyCode = 0) {
      await send('Input.dispatchKeyEvent', { type: 'keyDown', key, code, windowsVirtualKeyCode: keyCode });
      await send('Input.dispatchKeyEvent', { type: 'keyUp', key, code, windowsVirtualKeyCode: keyCode });
    },
    close() { try { ws.close(); } catch {} chrome.kill(); },
  };
  return b;
}
