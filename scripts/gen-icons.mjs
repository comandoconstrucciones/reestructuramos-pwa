// Generador de íconos PWA sin dependencias externas (zlib nativo de Node).
// Dibuja el ícono de "reestructuramos": fondo slate + tres bandas verde/amarillo/rojo
// (el sistema universal de carteles ATC-20) + una grieta blanca diagonal.
import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

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
  let c = ~0;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return ~c >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const body = Buffer.concat([typeBuf, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}
function encodePNG(width, height, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  // 10..12 = 0 (compression, filter, interlace)
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0; // filter: none
    rgba.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }
  const idat = deflateSync(raw, { level: 9 });
  return Buffer.concat([sig, chunk("IHDR", ihdr), chunk("IDAT", idat), chunk("IEND", Buffer.alloc(0))]);
}

function makeCanvas(N) {
  const buf = Buffer.alloc(N * N * 4);
  return buf;
}
function px(buf, N, x, y, [r, g, b, a]) {
  if (x < 0 || y < 0 || x >= N || y >= N) return;
  const i = (y * N + x) * 4;
  const ia = a / 255;
  buf[i] = Math.round(buf[i] * (1 - ia) + r * ia);
  buf[i + 1] = Math.round(buf[i + 1] * (1 - ia) + g * ia);
  buf[i + 2] = Math.round(buf[i + 2] * (1 - ia) + b * ia);
  buf[i + 3] = Math.max(buf[i + 3], a);
}
function rect(buf, N, x0, y0, x1, y1, color, radius = 0) {
  for (let y = Math.floor(y0); y < y1; y++) {
    for (let x = Math.floor(x0); x < x1; x++) {
      if (radius > 0) {
        const cx = x < x0 + radius ? x0 + radius : x > x1 - radius ? x1 - radius : x;
        const cy = y < y0 + radius ? y0 + radius : y > y1 - radius ? y1 - radius : y;
        const dx = x - cx, dy = y - cy;
        if (dx * dx + dy * dy > radius * radius) continue;
      }
      px(buf, N, x, y, color);
    }
  }
}

function drawIcon(N, { padFactor = 0 } = {}) {
  const buf = makeCanvas(N);
  // Fondo slate completo
  rect(buf, N, 0, 0, N, N, [15, 23, 42, 255]); // #0f172a
  const pad = N * (0.16 + padFactor); // zona segura para maskable
  const x0 = pad, x1 = N - pad;
  const top = pad, bottom = N - pad;
  const h = (bottom - top) / 3;
  const gap = N * 0.018;
  const r = N * 0.045;
  const bands = [
    [22, 163, 74, 255],  // verde  #16a34a
    [245, 158, 11, 255], // ámbar  #f59e0b
    [220, 38, 38, 255],  // rojo   #dc2626
  ];
  for (let k = 0; k < 3; k++) {
    rect(buf, N, x0, top + k * h + gap / 2, x1, top + (k + 1) * h - gap / 2, bands[k], r);
  }
  // Grieta blanca diagonal (zig-zag) sobre las bandas
  const crack = [255, 255, 255, 235];
  const w = Math.max(2, Math.round(N * 0.022));
  const pts = [
    [N * 0.40, top + gap],
    [N * 0.54, N * 0.40],
    [N * 0.44, N * 0.52],
    [N * 0.60, N * 0.66],
    [N * 0.50, bottom - gap],
  ];
  for (let s = 0; s < pts.length - 1; s++) {
    const [ax, ay] = pts[s], [bx, by] = pts[s + 1];
    const steps = Math.ceil(Math.hypot(bx - ax, by - ay));
    for (let t = 0; t <= steps; t++) {
      const x = ax + ((bx - ax) * t) / steps;
      const y = ay + ((by - ay) * t) / steps;
      rect(buf, N, x - w / 2, y - w / 2, x + w / 2, y + w / 2, crack);
    }
  }
  return encodePNG(N, N, buf);
}

const out = (p, b) => { mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, b); console.log("escrito", p, b.length, "bytes"); };
const ROOT = new URL("..", import.meta.url).pathname;

out(`${ROOT}public/icon-192.png`, drawIcon(192));
out(`${ROOT}public/icon-512.png`, drawIcon(512));
out(`${ROOT}public/icon-maskable-512.png`, drawIcon(512, { padFactor: 0.06 }));
out(`${ROOT}public/apple-icon-180.png`, drawIcon(180));
out(`${ROOT}app/icon.png`, drawIcon(256)); // favicon que Next optimiza
console.log("Íconos generados.");
