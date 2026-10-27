// Draws the footer's "Hyderabad, at dusk" skyline as one inline SVG (index.html, <footer>).
// Three depth tiers (far / mid / near) of filled silhouettes over a sun disc, birds in the sky,
// a ground band at the foot. Original drawing for this site; proportions follow the line-art
// landmarks of the section 8 "400 years" skyline.
//
//   node tools/assets/footer-skyline.mjs > skyline.svg            # just the <svg>
//   node tools/assets/footer-skyline.mjs --splice index.html      # replace it between the markers in index.html
//
// Coordinates: viewBox 2400 x 600, buildings stand on y = 560, the ground band runs 562-600.
import { readFileSync, writeFileSync } from 'node:fs';

const G = 560;
const f = (n) => +n.toFixed(1);
const pt = (p) => `${f(p[0])} ${f(p[1])}`;
const poly = (...p) => `M${p.map(pt).join('L')}Z`;
const rect = (x, y, w, h) => `M${f(x)} ${f(y)}h${f(w)}v${f(h)}h${f(-w)}Z`;
const circ = (cx, cy, r) => `M${f(cx - r)} ${f(cy)}a${f(r)} ${f(r)} 0 1 1 ${f(2 * r)} 0a${f(r)} ${f(r)} 0 1 1 ${f(-2 * r)} 0Z`;

// Deterministic noise so the drawing is stable between runs.
let seed = 7;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

// Onion dome standing on y: bulges past its base, rises to a spike.
function onion(cx, y, r, h) {
  const b = h * .84;
  return `M${f(cx - r * .8)} ${f(y)}C${f(cx - r * 1.16)} ${f(y - b * .3)} ${f(cx - r * 1.04)} ${f(y - b * .74)} ${f(cx - r * .14)} ${f(y - b * .97)}L${f(cx)} ${f(y - h)}L${f(cx + r * .14)} ${f(y - b * .97)}C${f(cx + r * 1.04)} ${f(y - b * .74)} ${f(cx + r * 1.16)} ${f(y - b * .3)} ${f(cx + r * .8)} ${f(y)}Z`;
}
// Low round dome (Indo-Saracenic) with a finial.
function dome(cx, y, r, h) {
  return `M${f(cx - r)} ${f(y)}C${f(cx - r)} ${f(y - h * .78)} ${f(cx - r * .45)} ${f(y - h * .92)} ${f(cx)} ${f(y - h * .94)}C${f(cx + r * .45)} ${f(y - h * .92)} ${f(cx + r)} ${f(y - h * .78)} ${f(cx + r)} ${f(y)}Z` +
    rect(cx - .9, y - h * 1.12, 1.8, h * .2) + circ(cx, y - h * 1.02, 2.2);
}
// Pointed (Mughal) arch opening: jambs from y up to the spring, then two curves to the apex.
function archHole(x, y, w, h) {
  const s = y - h * .62;
  return `M${f(x)} ${f(y)}V${f(s)}C${f(x)} ${f(s - h * .22)} ${f(x + w * .32)} ${f(y - h * .9)} ${f(x + w / 2)} ${f(y - h)}C${f(x + w * .68)} ${f(y - h * .9)} ${f(x + w)} ${f(s - h * .22)} ${f(x + w)} ${f(s)}V${f(y)}Z`;
}
// Merlons along a wall top.
function merlons(x1, x2, y, w = 7, gap = 5, h = 7) {
  let d = '';
  for (let x = x1; x + w <= x2 + .1; x += w + gap) d += rect(x, y - h, w, h);
  return d;
}
// Charminar-style minaret: shaft, bracketed galleries, slimmer top, onion cupola.
function minaret(cx, base, w, h, galleries) {
  const top = base - h;
  let d = rect(cx - w / 2, base - h * .8, w, h * .8);
  for (const g of galleries) {
    const y = base - h * g;
    d += rect(cx - w * .82, y - w * .26, w * 1.64, w * .26);
    d += poly([cx - w * .82, y], [cx + w * .82, y], [cx + w * .5, y + w * .4], [cx - w * .5, y + w * .4]);
  }
  d += rect(cx - w * .38, base - h * .87, w * .76, h * .08);
  d += onion(cx, base - h * .86, w * .52, h * .14);
  d += rect(cx - .8, top - 6, 1.6, 7);
  return d;
}
// Palm: a gently curved trunk and a crown of drooping fronds.
function palm(x, base, h, lean = 0, s = 1) {
  const tx = x + lean, ty = base - h;
  let d = `M${f(x - 4 * s)} ${f(base)}C${f(x - 3 * s + lean * .2)} ${f(base - h * .5)} ${f(tx - 3 * s)} ${f(ty + h * .2)} ${f(tx - 1.6 * s)} ${f(ty)}L${f(tx + 1.6 * s)} ${f(ty)}C${f(tx + 3 * s)} ${f(ty + h * .2)} ${f(x + 3 * s + lean * .2)} ${f(base - h * .5)} ${f(x + 4 * s)} ${f(base)}Z`;
  const fronds = [[-172, 40], [-148, 44], [-122, 40], [-96, 30], [-70, 40], [-42, 44], [-12, 40], [158, 30], [22, 32]];
  for (const [a, L0] of fronds) {
    const L = L0 * s * (h / 110), r = a * Math.PI / 180;
    const ex = tx + Math.cos(r) * L, ey = ty + Math.sin(r) * L + L * .32;   // tips droop
    const mx = (tx + ex) / 2, my = (ty + ey) / 2 - L * .18;
    const nx = -(ey - ty) / L, ny = (ex - tx) / L, wd = 6.5 * s;
    d += `M${f(tx)} ${f(ty)}Q${f(mx + nx * wd)} ${f(my + ny * wd)} ${f(ex)} ${f(ey)}Q${f(mx - nx * wd * .4)} ${f(my - ny * wd * .4 + 3 * s)} ${f(tx)} ${f(ty)}Z`;
  }
  return d;
}

const far = [], mid = [], near = [], farLit = [], midLit = [], nearLit = [], lamps = [];

/* ---------- Far tier ---------- */
// Golconda: the granite hill, walls stepping up it, bastions, the Bala Hissar baradari on top.
far.push(`M0 ${G}V414C52 398 96 358 150 336C186 322 226 324 262 344C304 368 336 420 372 ${G}Z`);
far.push(rect(14, 392, 70, 30) + merlons(14, 84, 392));
far.push(rect(96, 352, 64, 30) + merlons(96, 160, 352));
far.push(rect(232, 346, 66, 40) + merlons(232, 298, 346));
far.push(rect(160, 318, 72, 40) + merlons(160, 232, 318));
far.push(rect(170, 290, 52, 30) + merlons(170, 222, 290, 6, 4, 6));
far.push(`M44 400C44 386 64 386 64 400Z` + `M300 372C300 358 322 358 322 372V400H300Z`);
farLit.push(archHole(178, 316, 9, 18), archHole(191, 316, 9, 18), archHole(204, 316, 9, 18));

// Qutb Shahi tombs: cubic bases with arcades, petal ring, great bulbous domes, corner minarets.
for (const [cx, bw] of [[452, 128], [598, 96]]) {
  const bh = bw * .62, top = G - bh;
  far.push(rect(cx - bw / 2, top, bw, bh));
  far.push(rect(cx - bw / 2 - 4, top - 8, bw + 8, 8) + merlons(cx - bw / 2 - 4, cx + bw / 2 + 4, top - 8, 5, 4, 5));
  for (const sx of [-1, 1]) far.push(rect(cx + sx * bw / 2 - 4, top - 30, 8, 30) + onion(cx + sx * bw / 2, top - 30, 6, 16));
  far.push(rect(cx - bw * .3, top - 22, bw * .6, 14));
  far.push(onion(cx, top - 20, bw * .34, bw * .66));
  far.push(rect(cx - 1, top - 20 - bw * .66 - 8, 2, 10));
  const n = 5, aw = bw / (n * 1.6);
  for (let i = 0; i < n; i++) farLit.push(archHole(cx - bw / 2 + aw * .55 + i * aw * 1.6 + aw * .05, G - 6, aw, bh * .62));
}

// Osmania High Court: long Indo-Saracenic block, central dome, chhatris.
far.push(rect(1180, 470, 300, 90) + merlons(1180, 1480, 470, 6, 6, 6));
far.push(rect(1290, 430, 80, 40) + dome(1330, 430, 34, 52));
for (const x of [1200, 1250, 1410, 1460]) far.push(rect(x - 7, 452, 14, 18) + dome(x, 452, 10, 18));

// HITEC City: the curved Cyber Towers and two plain towers.
far.push(`M1764 ${G}V352C1764 336 1790 324 1812 324C1834 324 1858 336 1858 352V${G}Z` + rect(1806, 306, 12, 20));
far.push(rect(1868, 392, 46, 168) + rect(1722, 418, 36, 142));
for (let y = 362; y < 550; y += 16) farLit.push(rect(1772, y, 78, 3));

// Durgam Cheruvu: the cable-stayed bridge, one pylon and its fan of stays.
far.push(rect(1940, 488, 380, 7) + `M2118 ${G}L2124 300L2132 300L2138 ${G}Z`);
for (const k of [1, 2, 3, 4, 5]) {
  far.push(`M2127 ${312 + k * 12}L${f(2128 - k * 34)} 488L${f(2131 - k * 34)} 488Z`);
  far.push(`M2129 ${312 + k * 12}L${f(2128 + k * 34)} 488L${f(2125 + k * 34)} 488Z`);
}

/* ---------- Mid tier ---------- */
// A low mass of old-city rooftops along the whole width, with the odd dome.
{
  let d = `M0 ${G}`;
  let x = 0;
  while (x < 2400) {
    const w = 18 + rnd() * 34, h = 12 + rnd() * 30;
    d += `V${f(G - h)}H${f(Math.min(2400, x + w))}`;
    if (rnd() > .82 && x > 40) mid.push(dome(x + w / 2, G - h, w * .3, w * .32));
    x += w;
  }
  mid.push(d + `V${G}Z`);
}
// Mecca Masjid: the arcaded facade between its two octagonal gallery-topped columns.
{
  const x = 512, w = 196, top = G - 112;
  mid.push(rect(x, top, w, 112) + rect(x - 4, top - 10, w + 8, 10) + merlons(x, x + w, top - 10, 6, 5, 6));
  for (const cx of [x - 4, x + w + 4]) {
    mid.push(rect(cx - 11, G - 178, 22, 178) + rect(cx - 15, G - 196, 30, 18) + rect(cx - 12, G - 204, 24, 8) + dome(cx, G - 204, 12, 20));
    midLit.push(rect(cx - 9, G - 192, 4, 10), rect(cx - 2, G - 192, 4, 10), rect(cx + 5, G - 192, 4, 10));
  }
  for (let i = 0; i < 5; i++) midLit.push(archHole(x + 12 + i * 36, G, 26, 86));
}
// Chowmahalla: the long palace front with its balustrade, and the Khilwat clock tower.
{
  mid.push(rect(1010, 486, 390, 74) + rect(1004, 478, 402, 8));
  for (let x = 1008; x < 1404; x += 9) mid.push(rect(x, 470, 3, 8));
  mid.push(rect(1150, 452, 110, 108) + rect(1144, 444, 122, 8) + merlons(1150, 1260, 444, 6, 5, 6));
  for (const cx of [1022, 1388]) mid.push(rect(cx - 9, 452, 18, 34) + dome(cx, 452, 11, 18));
  for (let i = 0; i < 14; i++) if (i < 5 || i > 8) midLit.push(archHole(1020 + i * 27.4, 548, 14, 46));
  for (let i = 0; i < 3; i++) midLit.push(archHole(1166 + i * 30, 548, 18, 70));
  const t = 1440;
  mid.push(rect(t - 22, 372, 44, 188) + rect(t - 27, 364, 54, 8) + rect(t - 18, 336, 36, 28) + dome(t, 336, 20, 30));
  midLit.push(circ(t, 394, 11));
  lamps.push([t, 394, 3]);
}
// Telangana Assembly: Indo-Saracenic front, central dome on its drum, corner domes.
{
  const x = 1880, w = 270;
  mid.push(rect(x, 474, w, 86) + merlons(x, x + w, 474, 6, 6, 6));
  mid.push(rect(x + 95, 430, 80, 44) + rect(x + 105, 404, 60, 26) + onion(x + 135, 406, 32, 66));
  for (const cx of [x + 14, x + w - 14]) mid.push(rect(cx - 13, 440, 26, 34) + onion(cx, 442, 13, 30));
  for (const cx of [x + 70, x + 200]) mid.push(rect(cx - 8, 458, 16, 16) + dome(cx, 458, 9, 16));
  for (let i = 0; i < 9; i++) midLit.push(archHole(x + 14 + i * 28.5, 552, 16, 52));
}
mid.push(palm(330, G, 120, -6, .9), palm(1500, G, 104, 8, .8), palm(1712, G, 120, -4, .9), palm(2316, G, 96, 6, .8));

/* ---------- Near tier ---------- */
// Charminar, the focal point: the arched block, the upper arcade, four minarets (two read in elevation).
{
  const cx = 830, H = 332, s = 104, roof = G - H * .5;
  near.push(rect(cx - s, roof, 2 * s, G - roof));
  near.push(rect(cx - s - 4, roof - 6, 2 * s + 8, 6));
  near.push(rect(cx - s + 6, roof - 44, 2 * s - 12, 38));
  near.push(rect(cx - s + 2, roof - 50, 2 * s - 4, 6));
  for (let x = cx - s + 6; x < cx + s - 8; x += 11) near.push(`M${f(x)} ${f(roof - 50)}c0-6 8-6 8 0Z`);
  near.push(minaret(cx - s, G, 30, H, [.5, .72]), minaret(cx + s, G, 30, H, [.5, .72]));
  nearLit.push(archHole(cx - 46, G, 92, 150));
  for (let i = 0; i < 9; i++) nearLit.push(archHole(cx - s + 14 + i * 20.6, roof - 10, 12, 26));
  lamps.push([cx, G - 40, 3.4], [cx - 60, roof - 22, 2.4], [cx + 60, roof - 22, 2.4], [cx - s, G - H * .62, 2], [cx + s, G - H * .62, 2]);
}
// The Buddha of Hussain Sagar on his island and stepped lotus pedestal.
{
  const cx = 1630;
  near.push(rect(cx - 64, 546, 128, 14) + rect(cx - 46, 532, 92, 14) + rect(cx - 32, 512, 64, 20));
  let lotus = `M${cx - 34} 512`;
  for (let i = 0; i < 8; i++) lotus += `q4.25 -10 8.5 0`;
  near.push(lotus + 'Z');
  // Robe falling to a flared hem, shoulders, the left hand holding the robe, head with ushnisha.
  near.push(`M${cx - 24} 512C${cx - 25} 470 ${cx - 28} 420 ${cx - 28} 392C${cx - 28} 378 ${cx - 24} 370 ${cx - 16} 366C${cx - 11} 364 ${cx - 8} 362 ${cx - 7} 357H${cx + 7}C${cx + 8} 362 ${cx + 11} 364 ${cx + 16} 366C${cx + 24} 370 ${cx + 28} 378 ${cx + 28} 392C${cx + 28} 420 ${cx + 25} 470 ${cx + 24} 512Z` +
    `M${cx - 29} 512L${cx - 26} 494H${cx + 26}L${cx + 29} 512Z`);
  // The raised right hand (abhaya): upper arm out from the shoulder, forearm up, open palm, clear of the body.
  near.push(`M${cx + 20} 370C${cx + 30} 376 ${cx + 37} 390 ${cx + 39} 406L${cx + 47} 406C${cx + 49} 398 ${cx + 50} 390 ${cx + 50} 382V366C${cx + 50} 358 ${cx + 46} 355 ${cx + 43} 356C${cx + 39} 357 ${cx + 38} 364 ${cx + 38} 372L${cx + 39} 382C${cx + 40} 388 ${cx + 40} 392 ${cx + 40} 396C${cx + 36} 386 ${cx + 31} 375 ${cx + 26} 366Z`);
  near.push(`M${cx} 357C${cx - 11} 357 ${cx - 14} 347 ${cx - 14} 339C${cx - 14} 329 ${cx - 8} 322 ${cx} 322C${cx + 8} 322 ${cx + 14} 329 ${cx + 14} 339C${cx + 14} 347 ${cx + 11} 357 ${cx} 357Z` + circ(cx, 320, 6.5));
}
// Kakatiya Kala Thoranam, the gateway that closes the line (as in the reference).
{
  const x1 = 2226, x2 = 2346, pw = 26, top = 336;
  for (const x of [x1, x2]) {
    near.push(rect(x, top, pw, G - top) + rect(x - 6, G - 18, pw + 12, 18) + rect(x - 6, top - 12, pw + 12, 12));
    near.push(rect(x - 2, top + 60, pw + 4, 8) + rect(x - 2, top + 120, pw + 4, 8));
  }
  // A heavy flat lintel in two courses, corbels, the stepped crest and the two hamsa finials.
  near.push(rect(x1 - 16, 304, x2 - x1 + pw + 32, 20) + rect(x1 - 8, 292, x2 - x1 + pw + 16, 12));
  near.push(poly([x1 + pw, top - 12], [x1 + pw + 24, top - 12], [x1 + pw, top + 14]), poly([x2, top - 12], [x2 - 24, top - 12], [x2, top + 14]));
  near.push(rect(x1 + pw, 372, x2 - x1 - pw, 9));
  const mx = (x1 + x2 + pw) / 2;
  near.push(rect(mx - 34, 282, 68, 10) + rect(mx - 22, 272, 44, 10) + `M${mx - 10} 272L${mx} 254L${mx + 10} 272Z`);
  for (const [hx, dir] of [[x1 - 4, 1], [x2 + pw + 4, -1]]) near.push(`M${hx} 292c0-12 ${7 * dir}-20 ${15 * dir}-20c-5 2-6 7-4 10c${4 * dir} 0 ${7 * dir} 4 ${6 * dir} 10Z`);
  nearLit.push(rect(x1 - 4, 310, x2 - x1 + pw + 8, 2.5));
}
near.push(palm(1080, G, 128, 10, 1), palm(1350, G, 112, -8, .9), palm(1800, G, 136, 6, 1), palm(2180, G, 120, -10, .95), palm(560, G, 112, -6, .9), palm(36, G, 120, 8, .95));
// Foreground shrubs, broken by the lake around the Buddha.
{
  let d = '';
  for (let x = -10; x < 2410;) {
    const w = 16 + rnd() * 26, h = 6 + rnd() * 12;
    if (x > 1500 && x < 1770) { x = 1770; continue; }
    d += `M${f(x)} ${G + 4}C${f(x)} ${f(G - h)} ${f(x + w)} ${f(G - h)} ${f(x + w)} ${G + 4}Z`;
    x += w * .7;
  }
  near.push(d);
}

/* ---------- Sky ---------- */
const birds = [[1496, 226, 1], [1536, 206, .8], [1570, 240, .9], [1614, 196, .65], [1660, 222, .55]];

const P = (cls, list) => `<path class="${cls}" d="${list.join('')}"/>`;
const svg = `<svg class="mn-footer__sky" viewBox="0 0 2400 600" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
        <defs><radialGradient id="mn-sun" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#e9c68c" stop-opacity=".7"/><stop offset=".62" stop-color="#e9c68c" stop-opacity=".34"/><stop offset="1" stop-color="#e9c68c" stop-opacity="0"/></radialGradient></defs>
        <g class="mn-footer__sun"><circle cx="830" cy="262" r="168" fill="url(#mn-sun)"/><circle class="mn-footer__sun-disc" cx="830" cy="262" r="92"/></g>
        <g class="mn-footer__birds">${birds.map(([x, y, s]) => `<g transform="translate(${x} ${y}) scale(${s})"><path class="mn-footer__bird" d="M-14 0Q-7-7 0 0Q7-7 14 0"/></g>`).join('')}</g>
        <g class="mn-footer__tier mn-footer__tier--far">${P('mn-footer__mass', far)}${P('mn-footer__lit', farLit)}</g>
        <g class="mn-footer__tier mn-footer__tier--mid">${P('mn-footer__mass', mid)}${P('mn-footer__lit', midLit)}</g>
        <g class="mn-footer__tier mn-footer__tier--near">${P('mn-footer__mass', near)}${P('mn-footer__lit', nearLit)}<g class="mn-footer__lamps">${lamps.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('')}</g></g>
        <path class="mn-footer__water" d="M1500 555H1590M1680 555H1770M1520 561H1610M1650 561H1750M1540 567H1720"/>
        <rect class="mn-footer__earth" x="0" y="562" width="2400" height="40"/>
      </svg>`;

const i = process.argv.indexOf('--splice');
if (i > -1) {
  const file = process.argv[i + 1];
  const html = readFileSync(file, 'utf8');
  const re = /<svg class="mn-footer__sky"[\s\S]*?<\/svg>/;
  if (!re.test(html)) { console.error('no <svg class="mn-footer__sky"> in ' + file); process.exit(1); }
  writeFileSync(file, html.replace(re, svg));
  console.error('spliced ' + svg.length + ' chars into ' + file);
} else {
  process.stdout.write(svg + '\n');
}
