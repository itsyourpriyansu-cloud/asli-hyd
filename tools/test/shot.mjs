// Screenshot one section at one or more viewports, after walking down to it like a user.
//
//   node tools/test/shot.mjs <url> <absOutDir> <data-sec> [WxH ...] [--touch] [--reduce] [--offset=N]
//   node tools/test/shot.mjs http://127.0.0.1:8655/ C:/tmp/shots collection-b 1440x900 1280x720 390x844
//
// Sizes default to 1440x900. Widths <= 1024 are loaded as touch devices unless --no-touch is given.
// --offset scrolls N px past the section top (negative = stop above it). Pinned/wiped sections
// (city, spinner) only finish their entrance once their top reaches 0, so the default walks there and
// then a little further. Prints the files written plus any console errors.
import { launch, sleep } from './cdp.mjs';

const [url, out, sec, ...rest] = process.argv.slice(2);
if (!url || !out || !sec) { console.log('usage: node tools/test/shot.mjs <url> <absOutDir> <data-sec> [WxH ...] [--touch] [--reduce] [--offset=N]'); process.exit(1); }
const flags = rest.filter((a) => a.startsWith('--'));
const sizes = rest.filter((a) => /^\d+x\d+$/.test(a)).map((s) => s.split('x').map(Number));
if (!sizes.length) sizes.push([1440, 900]);
const offset = Number((flags.find((f) => f.startsWith('--offset=')) || '--offset=0').split('=')[1]);

const b = await launch({ out, port: 9351 });
b.url = url;
const files = [];
for (const [w, h] of sizes) {
  const touch = flags.includes('--touch') || (w <= 1024 && !flags.includes('--no-touch'));
  await b.load(w, h, { touch, reduce: flags.includes('--reduce') });
  const top = await b.pageTop(`[data-sec="${sec}"]`);
  if (top === null || top === undefined) { console.log('no section [data-sec="' + sec + '"]'); break; }
  await b.walkTo(top + offset, 100, 30);
  // Pinned sections settle a moment after the scroll stops.
  await sleep(1800);
  files.push(await b.shot(`${sec}-${w}x${h}${touch ? '-touch' : ''}${flags.includes('--reduce') ? '-reduce' : ''}`));
}
console.log(JSON.stringify({ files, logs: b.logs }, null, 1));
b.close();
process.exit(0);
