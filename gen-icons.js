// Generates icon192.png and icon512.png for PWA
const fs = require('fs');
const zlib = require('zlib');

function crc32(buf) {
  let crc = 0xffffffff;
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[i] = c;
  }
  for (const b of buf) crc = table[(crc ^ b) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const t = Buffer.from(type);
  const crcBuf = Buffer.concat([t, data]);
  const c = Buffer.alloc(4); c.writeUInt32BE(crc32(crcBuf));
  return Buffer.concat([len, t, data, c]);
}

function makePNG(size) {
  const w = size, h = size;
  // Draw green circle on light background
  const raw = [];
  for (let y = 0; y < h; y++) {
    raw.push(0); // filter byte
    for (let x = 0; x < w; x++) {
      const cx = w / 2, cy = h / 2, r = w * 0.46;
      const dx = x - cx, dy = y - cy;
      const inCircle = dx * dx + dy * dy <= r * r;
      // Letter "A" area (simple block letter)
      const nx = (x - cx) / r, ny = (y - cy) / r;
      if (inCircle) {
        raw.push(0, 168, 118, 255); // green #00a876
      } else {
        raw.push(244, 246, 251, 255); // bg #f4f6fb
      }
    }
  }
  // Draw letter A on circle
  const pixels = Buffer.from(raw);
  // Re-draw with letter A
  const stride = 1 + w * 4;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const cx = w / 2, cy = h / 2, r = w * 0.46;
      const dx = x - cx, dy = y - cy;
      const inCircle = dx * dx + dy * dy <= r * r;
      const offset = y * stride + 1 + x * 4;
      // Letter A: simplified pixel art scaled to icon
      const lx = (x - w * 0.32) / (w * 0.36); // 0..1 within letter bounds
      const ly = (y - h * 0.22) / (h * 0.56);
      const onA = lx >= 0 && lx <= 1 && ly >= 0 && ly <= 1 && (
        Math.abs(lx - 0.5) < 0.12 + ly * 0.38 && Math.abs(lx - 0.5) > ly * 0.28 - 0.04 ||
        (ly > 0.4 && ly < 0.6 && Math.abs(lx - 0.5) < 0.38)
      );
      if (inCircle && onA) {
        pixels[offset] = 255; pixels[offset+1] = 255; pixels[offset+2] = 255; pixels[offset+3] = 255;
      }
    }
  }
  const compressed = zlib.deflateSync(pixels, { level: 9 });
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; ihdr[9] = 6; // 8-bit RGBA
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', compressed), chunk('IEND', Buffer.alloc(0))]);
}

fs.writeFileSync('icon192.png', makePNG(192));
fs.writeFileSync('icon512.png', makePNG(512));
console.log('Generated icon192.png and icon512.png');
