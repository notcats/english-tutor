// Run: node generate-icons.js
// Creates icon16.png, icon48.png, icon128.png
const zlib = require('zlib');
const fs   = require('fs');
const path = require('path');

// Minimal CRC32
const crcTable = (() => {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    t[i] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) c = (c >>> 8) ^ crcTable[(c ^ buf[i]) & 0xFF];
  return (c ^ 0xFFFFFFFF) >>> 0;
}

function u32(n) { const b = Buffer.alloc(4); b.writeUInt32BE(n >>> 0, 0); return b; }

function pngChunk(type, data) {
  const tb = Buffer.from(type, 'ascii');
  const combined = Buffer.concat([tb, data]);
  return Buffer.concat([u32(data.length), combined, u32(crc32(combined))]);
}

function makePNG(size) {
  const sig  = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.concat([u32(size), u32(size), Buffer.from([8, 2, 0, 0, 0])]);

  // Draw icon: dark rounded square + green "AI" text approximated as pixels
  const rows = [];
  const r = size / 2;
  const pad = size * 0.12;

  for (let y = 0; y < size; y++) {
    const row = [0]; // filter = None
    for (let x = 0; x < size; x++) {
      const cx = x - r + 0.5, cy = y - r + 0.5;
      // Rounded square via superellipse
      const rx = Math.abs(cx) / (r - pad), ry = Math.abs(cy) / (r - pad);
      const inShape = Math.pow(rx, 4) + Math.pow(ry, 4) < 1;

      let R, G, B;
      if (inShape) {
        // Check if we're on the "AI" text area (simple block letters)
        const tx = (x / size), ty = (y / size);
        const onA = isLetterA(tx, ty, size);
        const onI = isLetterI(tx, ty, size);
        if (onA || onI) {
          R = 94; G = 255; B = 196; // #5effc4 green
        } else {
          R = 8; G = 10; B = 15;   // #080a0f dark
        }
      } else {
        R = 18; G = 20; B = 32; // slight bg
      }
      row.push(R, G, B);
    }
    rows.push(Buffer.from(row));
  }

  const raw = Buffer.concat(rows);
  const idat = zlib.deflateSync(raw, { level: 9 });

  return Buffer.concat([
    sig,
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', idat),
    pngChunk('IEND', Buffer.alloc(0))
  ]);
}

// Simple pixel-art "A" (left half, 0.08–0.42 x, 0.2–0.82 y)
function isLetterA(tx, ty, size) {
  if (tx < 0.08 || tx > 0.44 || ty < 0.18 || ty > 0.82) return false;
  const nx = (tx - 0.08) / 0.36; // 0..1
  const ny = (ty - 0.18) / 0.64; // 0..1
  const sw = Math.max(1, size * 0.07); // stroke width in normalized
  // Left stroke
  if (nx < 0.22 && Math.abs(nx - 0.11) < 0.11) return true;
  // Right stroke
  if (nx > 0.78 && Math.abs(nx - 0.89) < 0.11) return true;
  // Top cap
  if (ny < 0.18 && nx > 0.15 && nx < 0.85) return true;
  // Middle bar
  if (ny > 0.42 && ny < 0.60 && nx > 0.15 && nx < 0.85) return true;
  return false;
}

// Simple pixel-art "I" (right half, 0.56–0.92 x)
function isLetterI(tx, ty, size) {
  if (tx < 0.56 || tx > 0.92 || ty < 0.18 || ty > 0.82) return false;
  const nx = (tx - 0.56) / 0.36;
  const ny = (ty - 0.18) / 0.64;
  // Vertical bar
  if (nx > 0.35 && nx < 0.65) return true;
  // Top cap
  if (ny < 0.15) return true;
  // Bottom cap
  if (ny > 0.85) return true;
  return false;
}

[16, 48, 128].forEach(size => {
  const buf = makePNG(size);
  const out = path.join(__dirname, 'icon' + size + '.png');
  fs.writeFileSync(out, buf);
  console.log('✓ icon' + size + '.png');
});
