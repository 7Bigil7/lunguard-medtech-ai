const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);

  const crcBuf = Buffer.alloc(4);
  const toCrc = Buffer.concat([typeBuf, data]);
  crcBuf.writeUInt32BE(crc32(toCrc), 0);

  return Buffer.concat([lenBuf, toCrc, crcBuf]);
}

function createPng(width, height) {
  const header = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR: width, height, bit depth 8, color type 0 (grayscale), compression 0, filter 0, interlace 0
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // 8-bit
  ihdr.writeUInt8(0, 9); // Grayscale
  ihdr.writeUInt8(0, 10);
  ihdr.writeUInt8(0, 11);
  ihdr.writeUInt8(0, 12);

  const ihdrChunk = makeChunk('IHDR', ihdr);

  // Raw pixel data: for each scanline, filter byte (0) + width grayscale bytes
  const scanlineSize = 1 + width;
  const rawData = Buffer.alloc(height * scanlineSize);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * scanlineSize;
    rawData[rowOffset] = 0; // Filter: None

    for (let x = 0; x < width; x++) {
      // Create an anatomical-like synthetic chest phantom with smooth radial gradient
      // Center ~ (256, 256)
      const dx = (x - width / 2) / (width / 2);
      const dy = (y - height / 2) / (height / 2);
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Background is dark (~40), lungs are medium (~110-140), mediastinum/bones are lighter (~180-210)
      let val = 40;
      if (dist < 0.85) {
        // Inside thorax
        val = 90 + Math.floor(60 * (1 - dist));
        // Bilateral lung fields
        const leftLung = Math.hypot(dx + 0.35, dy - 0.05);
        const rightLung = Math.hypot(dx - 0.35, dy - 0.05);
        if (leftLung < 0.32) {
          val = 70 + Math.floor(30 * (1 - leftLung / 0.32));
        } else if (rightLung < 0.32) {
          val = 70 + Math.floor(30 * (1 - rightLung / 0.32));
        } else if (Math.abs(dx) < 0.15) {
          // Spine / mediastinum
          val = 180 + Math.floor(35 * (1 - Math.abs(dx) / 0.15));
        }
      }

      // Add prominent synthetic text overlay or banner across the top/bottom:
      // Y range 20-45: border box for banner
      if ((y >= 20 && y <= 45 && x >= 40 && x <= 472) || (y >= 465 && y <= 490 && x >= 40 && x <= 472)) {
        val = 220; // Banner box highlight
      }

      rawData[rowOffset + 1 + x] = Math.min(255, Math.max(0, val));
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', compressedData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([header, ihdrChunk, idatChunk, iendChunk]);
}

const outDir = path.join(__dirname, '..', 'frontend', 'public', 'samples');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const pngBuffer = createPng(512, 512);
const outPath = path.join(outDir, 'synthetic_cxr_placeholder.png');
fs.writeFileSync(outPath, pngBuffer);
console.log('Successfully generated synthetic placeholder CXR:', outPath, 'Size:', pngBuffer.length, 'bytes');
