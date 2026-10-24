import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.resolve(__dirname, '../frontend/public')

// Create a valid 256x256 uncompressed grayscale PNG directly
function createMinimalPng(width, height) {
  // We can write a minimal valid PNG
  // PNG signature
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
  
  // IHDR chunk: width (4), height (4), bit depth (1), color type (0: grayscale), compression (0), filter (0), interlace (0)
  const ihdrData = Buffer.alloc(13)
  ihdrData.writeUInt32BE(width, 0)
  ihdrData.writeUInt32BE(height, 4)
  ihdrData.writeUInt8(8, 8) // 8-bit depth
  ihdrData.writeUInt8(0, 9) // Grayscale
  ihdrData.writeUInt8(0, 10)
  ihdrData.writeUInt8(0, 11)
  ihdrData.writeUInt8(0, 12)
  
  function crc32(buf) {
    let crc = 0xffffffff
    for (let i = 0; i < buf.length; i++) {
      let byte = buf[i]
      crc = crc ^ byte
      for (let j = 0; j < 8; j++) {
        crc = (crc >>> 1) ^ (-(crc & 1) & 0xedb88320)
      }
    }
    return (crc ^ 0xffffffff) >>> 0
  }

  function makeChunk(type, data) {
    const len = Buffer.alloc(4)
    len.writeUInt32BE(data.length, 0)
    const typeBuf = Buffer.from(type, 'ascii')
    const toCrc = Buffer.concat([typeBuf, data])
    const crcVal = crc32(toCrc)
    const crcBuf = Buffer.alloc(4)
    crcBuf.writeUInt32BE(crcVal, 0)
    return Buffer.concat([len, typeBuf, data, crcBuf])
  }

  const ihdrChunk = makeChunk('IHDR', ihdrData)

  // Uncompressed zlib stream for scanlines
  // Each scanline: filter byte (0) + width bytes of gray pixels
  const rawScanlines = Buffer.alloc(height * (1 + width))
  for (let y = 0; y < height; y++) {
    const rowOffset = y * (1 + width)
    rawScanlines[rowOffset] = 0 // filter type None
    for (let x = 0; x < width; x++) {
      // Simulate rib cage / lung field contours
      const cx = width / 2
      const cy = height / 2
      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2)
      const val = Math.min(255, Math.max(20, Math.floor(180 - dist * 0.7)))
      rawScanlines[rowOffset + 1 + x] = val
    }
  }

  // Deflate using zlib
  import('zlib').then((zlib) => {
    const idatData = zlib.deflateSync(rawScanlines)
    const idatChunk = makeChunk('IDAT', idatData)
    const iendChunk = makeChunk('IEND', Buffer.alloc(0))

    const fullPng = Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk])
    fs.writeFileSync(path.join(publicDir, 'sample_cxr.png'), fullPng)
    console.log(`Generated sample_cxr.png (${width}x${height}, ${fullPng.length} bytes)`)

    // Also generate small 100x100
    const smallScanlines = Buffer.alloc(100 * (1 + 100), 128)
    for (let y = 0; y < 100; y++) smallScanlines[y * 101] = 0
    const smallIhdr = Buffer.alloc(13)
    smallIhdr.writeUInt32BE(100, 0)
    smallIhdr.writeUInt32BE(100, 4)
    smallIhdr.writeUInt8(8, 8)
    smallIhdr.writeUInt8(0, 9)
    const smallIhdrChunk = makeChunk('IHDR', smallIhdr)
    const smallIdat = makeChunk('IDAT', zlib.deflateSync(smallScanlines))
    const smallPng = Buffer.concat([sig, smallIhdrChunk, smallIdat, iendChunk])
    fs.writeFileSync(path.join(publicDir, 'small_xray.png'), smallPng)
    console.log(`Generated small_xray.png (100x100)`)

    // Also write a spoofed text file with .png extension
    fs.writeFileSync(path.join(publicDir, 'spoofed_extension.png'), 'This is plain text and not a real image.')
    console.log('Generated spoofed_extension.png')
  })
}

createMinimalPng(512, 512)
