import { deflateSync } from "zlib";

/**
 * Codificador PNG mínimo (RGBA, sin dependencias externas) — solo para
 * generar el círculo translúcido usado como "marca de agua de logo
 * institucional" en los documentos de prueba (ver
 * scripts/generar-doc-prueba-pca.ts). No pretende ser un encoder PNG de
 * propósito general.
 */

const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

let crcTable: number[] | null = null;
function crc32(buf: Buffer): number {
  if (!crcTable) {
    crcTable = [];
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) {
        c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      }
      crcTable[n] = c >>> 0;
    }
  }
  let crc = 0xffffffff;
  for (const byte of buf) {
    crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(tipo: string, data: Buffer): Buffer {
  const tipoBuf = Buffer.from(tipo, "ascii");
  const largo = Buffer.alloc(4);
  largo.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([tipoBuf, data])), 0);
  return Buffer.concat([largo, tipoBuf, data, crcBuf]);
}

/** Genera un PNG RGBA de un círculo relleno de `colorHex` con opacidad `alpha` (0-255) sobre fondo transparente. */
export function circuloPngBase64(opts: { size?: number; colorHex: string; alpha?: number }): string {
  const size = opts.size ?? 240;
  const alpha = opts.alpha ?? 70;
  const r = parseInt(opts.colorHex.slice(0, 2), 16);
  const g = parseInt(opts.colorHex.slice(2, 4), 16);
  const b = parseInt(opts.colorHex.slice(4, 6), 16);

  const raw = Buffer.alloc((size * 4 + 1) * size);
  const centro = size / 2;
  const radio = size / 2 - 4;
  let offset = 0;
  for (let y = 0; y < size; y++) {
    raw[offset++] = 0; // filtro "None" por fila
    for (let x = 0; x < size; x++) {
      const dx = x - centro;
      const dy = y - centro;
      const dentro = dx * dx + dy * dy <= radio * radio;
      raw[offset++] = r;
      raw[offset++] = g;
      raw[offset++] = b;
      raw[offset++] = dentro ? alpha : 0;
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const png = Buffer.concat([
    PNG_SIGNATURE,
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]);

  return png.toString("base64");
}
