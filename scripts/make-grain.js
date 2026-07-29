/**
 * Generates assets/grain.png — the texture layer the design specifies as
 * <feTurbulence baseFrequency=".85" numOctaves="2"> desaturated to grayscale.
 *
 * React Native cannot run an SVG filter, and blend modes are not dependable
 * across both platforms, so the effect is baked into the tile instead: two
 * octaves of value noise become sparse white and black specks with the
 * *alpha* carrying the strength. Composited normally over the near-black
 * ground that lands where `opacity:.5; mix-blend-mode:overlay` lands in the
 * browser — visible tooth, no lifted floor.
 *
 * Deterministic — re-running produces an identical file. `node scripts/make-grain.js`
 */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const SIZE = 128;

// mulberry32 — small, seeded, and stable across node versions.
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// One octave of tiling value noise at the given cell count.
function octave(cells, seed) {
  const rand = rng(seed);
  const grid = Array.from({ length: cells * cells }, () => rand());
  const at = (x, y) => grid[(y % cells) * cells + (x % cells)];
  const smooth = (t) => t * t * (3 - 2 * t);
  const out = new Float32Array(SIZE * SIZE);
  const scale = cells / SIZE;
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const fx = x * scale;
      const fy = y * scale;
      const x0 = Math.floor(fx);
      const y0 = Math.floor(fy);
      const tx = smooth(fx - x0);
      const ty = smooth(fy - y0);
      const top = at(x0, y0) * (1 - tx) + at(x0 + 1, y0) * tx;
      const bot = at(x0, y0 + 1) * (1 - tx) + at(x0 + 1, y0 + 1) * tx;
      out[y * SIZE + x] = top * (1 - ty) + bot * ty;
    }
  }
  return out;
}

// baseFrequency .85 on a 140px tile is roughly one cell per 1.2px, so the first
// octave is nearly per-pixel and the second adds a coarser drift.
const fine = octave(SIZE, 0x1a1a);
const coarse = octave(SIZE / 4, 0x2b2b);

/** How hard the tooth bites. Raise for more grain, lower for less. */
const STRENGTH = 0.3;

const stride = SIZE * 4 + 1;
const raw = Buffer.alloc(stride * SIZE);
for (let y = 0; y < SIZE; y++) {
  raw[y * stride] = 0; // filter: none
  for (let x = 0; x < SIZE; x++) {
    const v = fine[y * SIZE + x] * 0.7 + coarse[y * SIZE + x] * 0.3;
    const signed = (v - 0.5) * 2; // -1 .. 1
    // A quadratic falloff leaves most of the tile clear, so the grain reads as
    // scattered tooth rather than an even haze.
    const alpha = Math.min(1, signed * signed * STRENGTH);
    const i = y * stride + 1 + x * 4;
    const level = signed > 0 ? 255 : 0;
    raw[i] = level;
    raw[i + 1] = level;
    raw[i + 2] = level;
    raw[i + 3] = Math.round(alpha * 255);
  }
}

const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(SIZE, 0);
ihdr.writeUInt32BE(SIZE, 4);
ihdr[8] = 8; // bit depth
ihdr[9] = 6; // colour type: RGBA
ihdr[10] = 0;
ihdr[11] = 0;
ihdr[12] = 0;

const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk('IHDR', ihdr),
  chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
  chunk('IEND', Buffer.alloc(0)),
]);

const out = path.join(__dirname, '..', 'assets', 'grain.png');
fs.writeFileSync(out, png);
console.log(`wrote ${out} (${SIZE}x${SIZE}, ${png.length} bytes)`);
