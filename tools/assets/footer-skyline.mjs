// Draws the footer's "Hyderabad, at dusk" skyline as one inline SVG (index.html, <footer>).
// Three depth tiers (far / mid / near) of filled silhouettes over a sun disc, birds in the sky,
// a ground band at the foot. Original drawing for this site. Landmarks run left to right in date
// order, like the section 8 "400 years" timeline, from Golconda to the Durgam Cheruvu bridge.
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
let nearExtra = '';

// Left to right in date order, as in the section 8 timeline: Golconda (1518), Qutb Shahi tombs (1543),
// Charminar (1591), Mecca Masjid (1617), Chowmahalla (1750), the High Court (1919, behind), the Assembly,
// the Buddha (1992), HITEC City (1998), the Durgam Cheruvu bridge (2020). Tiers alternate for depth.

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

// High Court (behind the Chowmahalla front): Indo-Saracenic block, central dome, chhatris.
far.push(rect(1180, 472, 240, 88) + merlons(1180, 1420, 472, 6, 6, 6));
far.push(rect(1272, 434, 56, 38) + dome(1300, 434, 28, 46));
for (const x of [1200, 1240, 1360, 1400]) far.push(rect(x - 7, 454, 14, 18) + dome(x, 454, 9, 16));

// HITEC City: Cyber Towers (the ribbed, rounded glass tower with its crown) and two plain towers.
far.push(`M1890 ${G}V336C1890 316 1912 302 1935 302C1958 302 1980 316 1980 336V${G}Z` + rect(1929, 282, 12, 22) + rect(1934, 266, 2, 18));
far.push(rect(1846, 410, 38, 150) + rect(1990, 380, 52, 180));
for (let y = 336; y < 552; y += 14) farLit.push(rect(1898, y, 74, 2.6));
farLit.push(rect(1933, 310, 4, 240));

/* ---------- Mid tier ---------- */
// A low mass of rooftops along the whole width, with the odd dome.
{
  let d = `M0 ${G}`;
  let x = 0;
  while (x < 2400) {
    const w = 18 + rnd() * 34, h = 12 + rnd() * 28;
    d += `V${f(G - h)}H${f(Math.min(2400, x + w))}`;
    if (rnd() > .84 && x > 40 && x < 2000) mid.push(dome(x + w / 2, G - h, w * .3, w * .32));
    x += w;
  }
  mid.push(d + `V${G}Z`);
}
// Qutb Shahi tombs: a raised platform, a square chamber with two tiers of arches, corner turrets,
// a drum ringed with lotus petals and the great bulbous dome.
for (const [cx, bw] of [[386, 120], [520, 92]]) {
  const pl = 18, bh = bw * .58, top = G - pl - bh;
  mid.push(rect(cx - bw * .72, G - pl, bw * 1.44, pl));
  mid.push(rect(cx - bw / 2, top, bw, bh));
  mid.push(rect(cx - bw / 2 - 4, top - 6, bw + 8, 6) + merlons(cx - bw / 2 - 4, cx + bw / 2 + 4, top - 6, 4, 3.5, 5));
  for (const sx of [-1, 1]) mid.push(rect(cx + sx * bw / 2 - 3.5, top - 28, 7, 28) + onion(cx + sx * bw / 2, top - 28, 5.5, 14));
  mid.push(rect(cx - bw * .3, top - 22, bw * .6, 16));
  const pw = bw * .6 / 7;
  let petals = `M${f(cx - bw * .3)} ${f(top - 22)}`;
  for (let k = 0; k < 7; k++) petals += `l${f(pw / 2)} -7l${f(pw / 2)} 7`;
  mid.push(petals + 'Z');
  mid.push(onion(cx, top - 26, bw * .33, bw * .68));
  mid.push(rect(cx - 1, top - 26 - bw * .68 - 8, 2, 10));
  for (const k of [-1, 0, 1]) midLit.push(archHole(cx + k * bw * .3 - bw * .09, G - pl - 4, bw * .18, bh * .5));
  for (let k = -2; k <= 2; k++) midLit.push(archHole(cx + k * bw * .18 - bw * .05, top + bh * .36, bw * .1, bh * .24));
  for (let k = -3; k <= 3; k++) midLit.push(archHole(cx + k * bw * .2 - 3, G - 3, 6, 11));
}
// Mecca Masjid: five arches across the facade, between two octagonal columns topped by arcaded galleries.
{
  const x = 860, w = 176, top = G - 108;
  mid.push(rect(x, top, w, 108) + rect(x - 4, top - 10, w + 8, 10) + merlons(x, x + w, top - 10, 6, 5, 6));
  for (const cx of [x - 8, x + w + 8]) {
    mid.push(rect(cx - 11, G - 180, 22, 180) + rect(cx - 16, G - 198, 32, 18) + rect(cx - 12, G - 206, 24, 8) + dome(cx, G - 206, 12, 20));
    midLit.push(rect(cx - 12, G - 194, 5, 10), rect(cx - 2.5, G - 194, 5, 10), rect(cx + 7, G - 194, 5, 10));
  }
  for (let i = 0; i < 5; i++) midLit.push(archHole(x + 12 + i * 32.8, G, 24, 82));
}
// Chowmahalla: the long palace front with its balustrade; the Khilwat clock tower over the gateway.
{
  mid.push(rect(1070, 488, 270, 72) + rect(1064, 480, 282, 8));
  for (let x = 1068; x < 1344; x += 9) mid.push(rect(x, 472, 3, 8));
  mid.push(rect(1170, 452, 70, 108) + rect(1164, 444, 82, 8));
  mid.push(rect(1188, 372, 34, 80) + rect(1184, 366, 42, 6) + rect(1192, 344, 26, 22) + dome(1205, 344, 15, 26));
  for (const cx of [1080, 1330]) mid.push(rect(cx - 8, 456, 16, 32) + dome(cx, 456, 10, 16));
  for (let i = 0; i < 10; i++) if (i < 4 || i > 5) midLit.push(archHole(1080 + i * 25.6, 548, 13, 42));
  midLit.push(archHole(1190, 560, 30, 72), circ(1205, 396, 10), archHole(1197, 362, 5, 12), archHole(1208, 362, 5, 12));
  lamps.push([1205, 396, 3]);
}
// Telangana Assembly: Indo-Saracenic front, central onion dome on its drum, corner domes.
{
  const x = 1370, w = 220;
  mid.push(rect(x, 478, w, 82) + merlons(x, x + w, 478, 6, 6, 6));
  mid.push(rect(x + 80, 440, 60, 38) + rect(x + 88, 418, 44, 22) + onion(x + 110, 420, 26, 56));
  for (const cx of [x + 12, x + w - 12]) mid.push(rect(cx - 11, 446, 22, 32) + onion(cx, 448, 11, 26));
  for (const cx of [x + 52, x + 168]) mid.push(rect(cx - 7, 462, 14, 16) + dome(cx, 462, 8, 14));
  for (let i = 0; i < 7; i++) midLit.push(archHole(x + 18 + i * 29, 552, 16, 50));
}
// Durgam Cheruvu: the extradosed cable bridge. Two short pylons, one on each shore, the long main span
// between them (96 + 234 + 96 m), shallow fans of stays; the deck runs on off the right edge.
{
  const deck = 496, pyl = [2116, 2316];
  mid.push(rect(2030, deck, 380, 9) + rect(2030, deck - 4, 380, 1.6) + rect(2024, deck, 14, G - deck));
  for (const px of pyl) {
    mid.push(`M${px - 7} ${G}L${px - 5} 408H${px + 5}L${px + 7} ${G}Z` + rect(px - 6.5, 402, 13, 6));
    for (let k = 0; k < 5; k++) {
      const ay = 414 + k * 6, dx = 30 + k * 16;
      for (const sx of [-1, 1]) mid.push(`M${px} ${ay}L${px + sx * dx} ${deck - 1}L${px + sx * (dx - 2.4)} ${deck - 1}L${px} ${ay + 1.6}Z`);
    }
  }
  lamps.push([2116, 404, 2.2], [2316, 404, 2.2]);
}
mid.push(palm(300, G, 110, -6, .85), palm(1352, G, 100, 6, .8));

/* ---------- Near tier ---------- */
// Charminar, the focal point: the great arch, the gallery of small arches above it, the balcony, the set-back
// upper storey with its arcade and lotus merlons, and two of the four minarets (two galleries each).
{
  const cx = 700, H = 330, s = 100, roof = G - 150;
  near.push(rect(cx - s, roof, 2 * s, G - roof));
  near.push(rect(cx - s - 6, roof - 8, 2 * s + 12, 8));
  near.push(rect(cx - s + 8, roof - 46, 2 * s - 16, 38));
  near.push(rect(cx - s + 4, roof - 52, 2 * s - 8, 6));
  for (let x = cx - s + 8; x < cx + s - 12; x += 10.4) near.push(`M${f(x)} ${f(roof - 52)}c0-7 8-7 8 0Z`);
  near.push(minaret(cx - s, G, 28, H, [.47, .7]), minaret(cx + s, G, 28, H, [.47, .7]));
  nearLit.push(archHole(cx - 58, G, 116, 112));
  for (let i = 0; i < 7; i++) nearLit.push(archHole(cx - s + 22 + i * 24, roof + 30, 12, 20));
  for (let i = 0; i < 9; i++) nearLit.push(archHole(cx - s + 16 + i * 19.6, roof - 12, 11, 24));
  lamps.push([cx, G - 36, 3.4], [cx - 50, roof + 20, 2.2], [cx + 50, roof + 20, 2.2], [cx, roof - 24, 2.2], [cx - s, G - H * .62, 2], [cx + s, G - H * .62, 2]);
}
// The Buddha of Hussain Sagar, traced from the client's reference illustration: standing, the right hand
// raised (abhaya), the robe falling to the feet; a stepped pedestal on a broad base, on an island deck with
// grass beds and railings at both ends. Drawn in the reference's own pixels (727 wide, deck foot at y 588)
// and placed at 0.4, so it keeps its scale against Charminar's 56 m.
{
  // Closed Catmull-Rom spline through the traced points (a repeated point makes a corner).
  const spline = (p) => {
    let d = `M${pt(p[0])}`;
    for (let i = 0; i < p.length; i++) {
      const a = p[(i - 1 + p.length) % p.length], b = p[i], c = p[(i + 1) % p.length], e = p[(i + 2) % p.length];
      d += `C${pt([b[0] + (c[0] - a[0]) / 6, b[1] + (c[1] - a[1]) / 6])} ${pt([c[0] - (e[0] - b[0]) / 6, c[1] - (e[1] - b[1]) / 6])} ${pt(c)}`;
    }
    return d + 'Z';
  };
  // A thin lens along a curve: the robe folds and the edges of the steps.
  const fold = (x1, y1, qx, qy, x2, y2, w = 3) => `M${x1} ${y1}Q${qx - w} ${qy - w} ${x2} ${y2}Q${qx + w} ${qy + w} ${x1} ${y1}Z`;
  // Spiky grass clump on its own seed, so the shrubs below keep their shapes.
  let s2 = 11;
  const r2 = () => ((s2 = (s2 * 16807) % 2147483647) / 2147483647);
  const tuft = (x1, x2, y, h) => {
    let d = `M${x1} ${y}`;
    for (let x = x1; x < x2;) {
      const w = 3 + r2() * 4;
      d += `L${f(x + w / 2 + (r2() - .5) * 9)} ${f(y - h * (.4 + r2() * .6))}L${f(Math.min(x2, x + w))} ${y}`;
      x += w;
    }
    return d + 'Z';
  };
  const railing = (x1, x2, y, h) => {
    let d = rect(x1, y - h, x2 - x1, 3);
    for (let x = x1; x <= x2 - 3; x += 7) d += rect(x, y - h, 3, h);
    return d;
  };
  // The figure: head and ears, the left shoulder and the robe's fall from the lowered arm, the hem,
  // then up the right side to the raised hand, with the sky showing between hand and head.
  let d = spline([[346, 74], [351, 76], [355, 81], [356, 88], [362, 91], [368, 98], [371, 110], [372, 124], [369, 134], [364, 141], [373, 145], [386, 150], [398, 159],
    [404, 172], [407, 192], [408, 212], [404, 227], [399, 246], [396, 272], [395, 300], [394, 330], [395, 360], [397, 388], [400, 410],
    [401, 420], [401, 420], [305, 420], [305, 420], [307, 398], [310, 372], [313, 345], [314, 318], [312, 292], [308, 268], [302, 248],
    [295, 230], [290, 214], [288, 194], [287, 170], [287, 148], [288, 132], [291, 121], [297, 116], [304, 118], [309, 125], [311, 136],
    [313, 148], [319, 150], [327, 143], [323, 132], [322, 117], [325, 103], [330, 94], [336, 90], [337, 82], [341, 76]]);   // the ushnisha tops the head
  // Pedestal: top slab, step, splayed step, the rounded drum, the ledge and the broad base.
  d += poly([248, 420], [447, 420], [456, 433], [239, 433]) + rect(232, 433, 230, 14) + poly([228, 447], [466, 447], [506, 460], [196, 460]);
  d += `M196 460H514Q522 460 522 468V482Q522 488 514 488H196Q188 488 188 482V468Q188 460 196 460Z`;
  d += rect(166, 488, 362, 10) + rect(172, 498, 352, 52);
  // Island deck, the grass beds on it and a railing at each end.
  d += `M0 548H668L678 563L670 588H0Z` + rect(30, 538, 136, 10);
  d += tuft(34, 142, 539, 26) + tuft(526, 624, 549, 28) + railing(0, 22, 549, 14) + railing(630, 674, 549, 14);
  const soft = [
    fold(322, 168, 356, 176, 392, 198), fold(318, 193, 352, 206, 394, 232), fold(314, 226, 346, 240, 382, 270),
    fold(342, 268, 338, 342, 334, 414), fold(362, 262, 366, 340, 371, 414), fold(382, 300, 387, 360, 392, 412), fold(323, 302, 318, 360, 316, 412),
    rect(240, 432, 216, 2.5), rect(230, 446, 234, 2.5), rect(198, 459, 314, 2.5), rect(168, 487, 358, 2.5), rect(172, 497, 352, 2.5), rect(0, 562, 676, 3),
  ];
  nearExtra += `<g transform="translate(1720 ${G}) scale(.4) translate(-347 -588)"><path class="mn-footer__mass" d="${d}"/><path class="mn-footer__lit mn-footer__lit--soft" d="${soft.join('')}"/></g>`;
}
// Granite boulders on the Durgam Cheruvu shore, where the bridge lands.
near.push(`M2004 ${G + 2}C2002 540 2018 530 2034 534C2048 528 2062 540 2060 ${G + 2}Z` + `M2052 ${G + 2}C2054 546 2068 540 2080 546C2088 548 2090 556 2088 ${G + 2}Z`);
near.push(palm(30, G, 120, 8, .95), palm(1060, G, 120, 8, .95), palm(1568, G, 116, -6, .9), palm(1868, G, 126, 6, 1));
// Foreground shrubs, broken by Hussain Sagar around the Buddha's island and the lake under the bridge.
{
  let d = '';
  for (let x = -10; x < 2410;) {
    const w = 16 + rnd() * 26, h = 6 + rnd() * 12;
    if (x > 1574 && x < 1858) { x = 1858; continue; }
    if (x > 2090 && x < 2330) { x = 2330; continue; }
    d += `M${f(x)} ${G + 4}C${f(x)} ${f(G - h)} ${f(x + w)} ${f(G - h)} ${f(x + w)} ${G + 4}Z`;
    x += w * .7;
  }
  near.push(d);
}

/* ---------- Sky ---------- */
const birds = [[1404, 262, 1], [1442, 246, .8], [1476, 276, .9], [1516, 238, .65], [1560, 262, .55]];

const P = (cls, list) => `<path class="${cls}" d="${list.join('')}"/>`;
const svg = `<svg class="mn-footer__sky" viewBox="0 0 2400 600" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
        <defs><radialGradient id="mn-sun" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#e9c68c" stop-opacity=".7"/><stop offset=".62" stop-color="#e9c68c" stop-opacity=".34"/><stop offset="1" stop-color="#e9c68c" stop-opacity="0"/></radialGradient></defs>
        <g class="mn-footer__sun"><circle cx="700" cy="262" r="168" fill="url(#mn-sun)"/><circle class="mn-footer__sun-disc" cx="700" cy="262" r="92"/></g>
        <g class="mn-footer__birds">${birds.map(([x, y, s]) => `<g transform="translate(${x} ${y}) scale(${s})"><path class="mn-footer__bird" d="M-14 0Q-7-7 0 0Q7-7 14 0"/></g>`).join('')}</g>
        <g class="mn-footer__tier mn-footer__tier--far">${P('mn-footer__mass', far)}${P('mn-footer__lit', farLit)}</g>
        <g class="mn-footer__tier mn-footer__tier--mid">${P('mn-footer__mass', mid)}${P('mn-footer__lit', midLit)}</g>
        <g class="mn-footer__tier mn-footer__tier--near">${P('mn-footer__mass', near)}${nearExtra}${P('mn-footer__lit', nearLit)}<g class="mn-footer__lamps">${lamps.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('')}</g></g>
        <path class="mn-footer__water" d="M1592 559H1660M1690 559H1770M1796 559H1846M2130 555H2200M2240 555H2310M2146 561H2224M2250 561H2300M2170 567H2280"/>
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
