// The Asli motif kit: geometry shared by css/motifs.css, the SVG sprite and the footer niche.
// See docs/MOTIFS.md for what each motif is for.
//
//   node tools/assets/motifs.mjs sprite      # writes assets/img/motifs.svg (the <symbol> sprite)
//   node tools/assets/motifs.mjs uris        # prints the CSS data-URIs (paste into css/motifs.css)
//   node tools/assets/motifs.mjs niche       # prints the footer niche's arch paths
import { writeFileSync } from 'node:fs';

const f = (n) => +n.toFixed(2);
const GOLD = '#c59a5b', LAPIS = '#2c4a7e', CARNELIAN = '#b4532f', MALACHITE = '#2f6e52';

// Cusped (multifoil) arch, as in the sandstone niche and the flat nested arches:
// jambs, then `lobes` small arcs up each side of a pointed curve, meeting at the apex.
// Traced clockwise, so every lobe (sweep 1) bulges outward and the cusps point inward.
// ogee: the side curves turn in near the top (the jharokha crown) instead of a plain point.
export function cusped({ xl, xr, spring, apex, bottom, lobes = 4, ogee = false }) {
  const cx = (xl + xr) / 2, h = spring - apex, w = cx - xl;
  const left = ogee
    ? [[xl, spring], [xl, spring - h * .62], [cx, apex + h * .5], [cx, apex]]
    : [[xl, spring], [xl, spring - h * .55], [cx - w * .42, apex + h * .2], [cx, apex]];
  const at = (c, t) => [0, 1].map((k) => (1 - t) ** 3 * c[0][k] + 3 * (1 - t) ** 2 * t * c[1][k] + 3 * (1 - t) * t * t * c[2][k] + t ** 3 * c[3][k]);
  const pts = [];
  for (let i = 0; i <= lobes; i++) pts.push(at(left, i / lobes));
  for (let i = lobes - 1; i >= 0; i--) { const p = at(left, i / lobes); pts.push([2 * cx - p[0], p[1]]); }
  let d = `M${f(xl)} ${f(bottom)}V${f(spring)}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
    const r = Math.hypot(x1 - x0, y1 - y0) * .6;
    d += `A${f(r)} ${f(r)} 0 0 1 ${f(x1)} ${f(y1)}`;
  }
  return d + `V${f(bottom)}Z`;
}

// Footer niche (viewBox 200 x 250): frame rules, arch, inner hairline, lotus finial, spandrel tendrils.
export const niche = {
  frame: 'M6 6H194V244H6Z',
  frameIn: 'M12 12H188V238H12Z',
  arch: cusped({ xl: 34, xr: 166, spring: 128, apex: 48, bottom: 238, lobes: 4 }),
  archIn: cusped({ xl: 41, xr: 159, spring: 131, apex: 58, bottom: 238, lobes: 4 }),
  lotus: 'M100 18C105 26 105 36 100 44C95 36 95 26 100 18ZM100 44C92 42 85 35 83 27C91 29 97 35 100 44ZM100 44C108 42 115 35 117 27C109 29 103 35 100 44ZM88 45H112',
  // Left half; the right is the same path mirrored. Main stem curls into the corner, a second
  // stem follows the arch down to a bud, two leaves on the way.
  tendril: 'M94 44C82 46 70 40 62 32C54 24 44 18 34 22C25 26 26 38 34 38C40 38 41 31 36 30M62 32C52 38 40 50 34 66C30 78 30 90 30 98M30 98C26 102 26 108 30 112C34 108 34 102 30 98ZM48 44C44 38 46 33 52 32C52 38 50 42 48 44ZM36 70C30 68 27 62 29 58C34 60 36 64 36 70Z',
  gems: [[100, 35, 2, CARNELIAN], [36, 33, 2.2, LAPIS], [164, 33, 2.2, LAPIS], [30, 105, 1.8, MALACHITE], [170, 105, 1.8, MALACHITE]],
};

// Tiles for css/motifs.css. Fine gold line; stones only as small dots.
const tiles = {
  // Inlay border (inlay plate IX, hem borders): two rules and a gold vine with set stones.
  inlay: `<svg xmlns='http://www.w3.org/2000/svg' width='96' height='20' viewBox='0 0 96 20'><g fill='none' stroke='${GOLD}' stroke-width='.8'><path d='M0 1.5H96M0 18.5H96'/><path d='M0 10C8 4 16 4 24 10S40 16 48 10S64 4 72 10S88 16 96 10'/></g><g fill='${GOLD}'><path d='M5 7.2Q7 3.6 10.5 4Q9 7 5 7.2Z'/><path d='M29 12.8Q31 16.4 34.5 16Q33 13 29 12.8Z'/><path d='M53 7.2Q55 3.6 58.5 4Q57 7 53 7.2Z'/><path d='M77 12.8Q79 16.4 82.5 16Q81 13 77 12.8Z'/></g><g stroke='${GOLD}' stroke-width='.6'><circle cx='16' cy='10.8' r='2' fill='${LAPIS}'/><circle cx='40' cy='9.2' r='2' fill='${CARNELIAN}'/><circle cx='64' cy='10.8' r='2' fill='${MALACHITE}'/><circle cx='88' cy='9.2' r='2' fill='${CARNELIAN}'/></g></svg>`,
  // Beaded plinth (jharokha base): a rule each side of a row of beads.
  beads: `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='12' viewBox='0 0 24 12'><g fill='none' stroke='${GOLD}' stroke-width='.8'><path d='M0 .5H24M0 11.5H24'/><circle cx='12' cy='6' r='3'/></g><g fill='${GOLD}'><circle cx='0' cy='6' r='1.1'/><circle cx='24' cy='6' r='1.1'/></g></svg>`,
  // Cusped edge, used as a mask: a row of lobes rising from the bottom.
  scallop: `<svg xmlns='http://www.w3.org/2000/svg' width='40' height='14' viewBox='0 0 40 14'><path d='M0 14V12A10 9 0 0 1 20 12A10 9 0 0 1 40 12V14Z'/></svg>`,
  // Pietra-dura vine (the lotus inlay): an ogee lattice of gold stems, a lotus at each crossing.
  vine: `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'><g fill='none' stroke='${GOLD}' stroke-width='.9'><path d='M0 0C30 10 30 50 60 60S90 110 120 120M120 0C90 10 90 50 60 60S30 110 0 120'/><path d='M27 30C20 30 17 24 21 20C25 17 29 21 26 24M93 30C100 30 103 24 99 20C95 17 91 21 94 24M27 90C20 90 17 96 21 100C25 103 29 99 26 96M93 90C100 90 103 96 99 100C95 103 91 99 94 96'/></g><g stroke='${GOLD}' stroke-width='.7'><path fill='${LAPIS}' d='M60 46C64 52 64 58 60 62C56 58 56 52 60 46Z'/><path fill='${MALACHITE}' d='M60 62C54 61 49 55 48 49C54 51 58 56 60 62ZM60 62C66 61 71 55 72 49C66 51 62 56 60 62Z'/></g><circle cx='60' cy='63' r='1.8' fill='${CARNELIAN}'/><g fill='${GOLD}'><circle cx='0' cy='60' r='1.4'/><circle cx='120' cy='60' r='1.4'/><circle cx='60' cy='0' r='1.4'/><circle cx='60' cy='120' r='1.4'/></g></svg>`,
  // Diagonal buti lattice (dupatta all-over): stitched diamonds, a four-dot flower in each.
  lattice: `<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'><path d='M20 0L40 20L20 40L0 20Z' fill='none' stroke='${GOLD}' stroke-width='.7' stroke-dasharray='2 2'/><g fill='${GOLD}'><circle cx='20' cy='17' r='1.3'/><circle cx='20' cy='23' r='1.3'/><circle cx='17' cy='20' r='1.3'/><circle cx='23' cy='20' r='1.3'/></g><circle cx='20' cy='20' r='1' fill='${CARNELIAN}'/></svg>`,
  // Cusped arch, filled, for masks (same 400 x 500 box as the pointed-arch mask in sections.css).
  arch: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 500' preserveAspectRatio='none'><path d='${cusped({ xl: 12, xr: 388, spring: 230, apex: 14, bottom: 488, lobes: 5 })}'/></svg>`,
};
const uri = (s) => `url("data:image/svg+xml,${s.replace(/#/g, '%23').replace(/</g, '%3C').replace(/>/g, '%3E').replace(/"/g, "'")}")`;

// Sprite symbols. Strokes take currentColor and the <use>'s stroke-width; every path has
// pathLength="1" so a stroke-dashoffset tween on the <use> draws it.
const pl = (d) => `<path pathLength="1" d="${d}"/>`;
const gem = (cx, cy, r, c) => `<circle cx="${cx}" cy="${cy}" r="${r}" stroke="none" fill="${c}"/>`;
const symbols = {
  'm-arch-cusped': ['0 0 200 250', pl(cusped({ xl: 20, xr: 180, spring: 120, apex: 20, bottom: 246, lobes: 4 }))],
  'm-arch-ogee': ['0 0 200 250', pl(cusped({ xl: 20, xr: 180, spring: 116, apex: 10, bottom: 246, lobes: 6, ogee: true }))],
  'm-niche': ['0 0 200 250', [niche.frame, niche.frameIn, niche.arch, niche.archIn, niche.lotus, niche.tendril].map(pl).join('') + `<g transform="matrix(-1 0 0 1 200 0)">${pl(niche.tendril)}</g>` + niche.gems.map(([x, y, r, c]) => gem(x, y, r, c)).join('')],
  'm-lotus': ['0 0 40 32', pl('M20 2C25 10 25 20 20 28C15 20 15 10 20 2ZM20 28C12 26 5 19 3 11C11 13 17 19 20 28ZM20 28C28 26 35 19 37 11C29 13 23 19 20 28ZM8 30H32') + gem(20, 19, 2, CARNELIAN)],
  'm-tendril': ['22 14 76 102', pl(niche.tendril)],
  'm-paisley': ['0 0 40 60', pl('M20 58C6 54 2 38 8 26C14 14 26 10 30 2C34 10 38 22 36 34C34 48 28 56 20 58Z') + pl('M20 50C11 47 9 37 13 29C17 21 25 18 28 12C30 20 31 28 29 36C28 44 25 49 20 50Z') + gem(20, 38, 2.4, LAPIS)],
  'm-rosette': ['0 0 40 40', pl('M10 10H30V30H10Z') + pl('M20 5.86L34.14 20L20 34.14L5.86 20Z') + pl('M25 20A5 5 0 1 1 15 20A5 5 0 1 1 25 20Z') + gem(20, 20, 1.8, CARNELIAN)],
  'm-sprig': ['0 0 20 80', pl('M10 0V80') + [12, 32, 52, 72].map((y, i) => { const s = i % 2 ? -1 : 1; return pl(`M10 ${y}Q${10 + 5 * s} ${y - 2} ${10 + 6 * s} ${y - 7}`) + gem(10 + 6 * s, y - 8, 1.6, i % 2 ? LAPIS : MALACHITE); }).join('')],
  'm-stitch': ['0 0 12 80', pl('M6 0V80') + [10, 30, 50, 70].map((y) => pl(`M6 ${y - 4}L10 ${y}L6 ${y + 4}L2 ${y}Z`)).join('')],
};

const mode = process.argv[2];
if (mode === 'sprite') {
  const body = Object.entries(symbols).map(([id, [vb, inner]]) => `  <symbol id="${id}" viewBox="${vb}"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">${inner}</g></symbol>`).join('\n');
  writeFileSync('assets/img/motifs.svg', `<svg xmlns="http://www.w3.org/2000/svg">\n<!-- Asli motif kit. Generated by tools/assets/motifs.mjs; see docs/MOTIFS.md. -->\n${body}\n</svg>\n`);
  console.log('wrote assets/img/motifs.svg');
} else if (mode === 'uris') {
  for (const [k, v] of Object.entries(tiles)) console.log(`--- ${k}\n${uri(v)}`);
} else if (mode === 'niche') {
  console.log(JSON.stringify(niche, null, 1));
} else {
  console.log('usage: node tools/assets/motifs.mjs sprite|uris|niche');
}
