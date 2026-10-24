import { describe, it, expect, vi, beforeEach } from 'vitest'
import { checkMagicBytes, validateCxrImage } from '../lib/fileValidation'

describe('File Validation Service', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  // Helper to create synthetic files with specific byte signatures
  const createMockFile = (bytes: number[], name: string, type: string, size = bytes.length): File => {
    const uint8 = new Uint8Array(size)
    for (let i = 0; i < bytes.length; i++) {
      uint8[i] = bytes[i]
    }
    return new File([uint8], name, { type })
  }

  it('correctly identifies valid PNG magic bytes (89 50 4E 47 0D 0A 1A 0A)', async () => {
    const pngBytes = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]
    const file = createMockFile(pngBytes, 'test.png', 'image/png')
    const magic = await checkMagicBytes(file)
    expect(magic).toBe('png')
  })

  it('correctly identifies valid JPEG magic bytes (FF D8 FF)', async () => {
    const jpegBytes = [0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46]
    const file = createMockFile(jpegBytes, 'test.jpg', 'image/jpeg')
    const magic = await checkMagicBytes(file)
    expect(magic).toBe('jpeg')
  })

  it('rejects files with invalid magic bytes (spoofed extension e.g. text file renamed to .png)', async () => {
    // ASCII "This is a text file"
    const textBytes = [0x54, 0x68, 0x69, 0x73, 0x20, 0x69, 0x73, 0x20]
    const spoofedFile = createMockFile(textBytes, 'fake-xray.png', 'image/png')
    const magic = await checkMagicBytes(spoofedFile)
    expect(magic).toBeNull()

    const result = await validateCxrImage(spoofedFile)
    expect(result.valid).toBe(false)
    if (!result.valid) {
      expect(result.error.code).toBe('INVALID_FILE_TYPE')
      expect(result.error.message).toContain('File header does not match a valid PNG or JPEG signature')
    }
  })

  it('rejects unsupported file extensions and MIME types (e.g. PDF)', async () => {
    const pdfBytes = [0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x35]
    const pdfFile = createMockFile(pdfBytes, 'report.pdf', 'application/pdf')
    const result = await validateCxrImage(pdfFile)
    expect(result.valid).toBe(false)
    if (!result.valid) {
      expect(result.error.code).toBe('INVALID_FILE_TYPE')
    }
  })

  it('rejects oversized files exceeding 10 MB limit', async () => {
    const pngBytes = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]
    const oversizedBytesLength = 11 * 1024 * 1024 // 11 MB
    const hugeFile = createMockFile(pngBytes, 'huge.png', 'image/png', oversizedBytesLength)

    const result = await validateCxrImage(hugeFile)
    expect(result.valid).toBe(false)
    if (!result.valid) {
      expect(result.error.code).toBe('FILE_TOO_LARGE')
      expect(result.error.message).toContain('10 MB')
    }
  })

  it('rejects empty 0-byte files', async () => {
    const emptyFile = new File([], 'empty.png', { type: 'image/png' })
    const result = await validateCxrImage(emptyFile)
    expect(result.valid).toBe(false)
    if (!result.valid) {
      expect(result.error.code).toBe('CORRUPT_IMAGE')
    }
  })
})
