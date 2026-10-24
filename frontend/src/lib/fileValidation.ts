export interface ValidationSuccess {
  valid: true
  file: File
  width: number
  height: number
  objectUrl: string
}

export interface ValidationFailure {
  valid: false
  error: {
    code: 'INVALID_FILE_TYPE' | 'FILE_TOO_LARGE' | 'IMAGE_TOO_SMALL' | 'CORRUPT_IMAGE'
    message: string
  }
}

export type FileValidationResult = ValidationSuccess | ValidationFailure

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB
const MIN_DIMENSION = 224 // 224x224 px standard CXR resolution

/**
 * Checks magic bytes (file signature) for PNG or JPEG
 */
export async function checkMagicBytes(file: File): Promise<'png' | 'jpeg' | null> {
  const buffer = await file.slice(0, 8).arrayBuffer()
  const bytes = new Uint8Array(buffer)

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return 'png'
  }

  // JPEG: FF D8 FF
  if (
    bytes.length >= 3 &&
    bytes[0] === 0xff &&
    bytes[1] === 0xd8 &&
    bytes[2] === 0xff
  ) {
    return 'jpeg'
  }

  return null
}

/**
 * Comprehensive client-side image validation.
 * Checks size, MIME type, file signature magic bytes, and decodes image to verify dimensions.
 */
export async function validateCxrImage(file: File): Promise<FileValidationResult> {
  // 1. File size check
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: {
        code: 'FILE_TOO_LARGE',
        message: `File exceeds maximum allowed size of 10 MB (received ${(file.size / (1024 * 1024)).toFixed(2)} MB).`,
      },
    }
  }

  if (file.size === 0) {
    return {
      valid: false,
      error: {
        code: 'CORRUPT_IMAGE',
        message: 'File is empty (0 bytes).',
      },
    }
  }

  // 2. MIME type & extension check
  const validMimes = ['image/png', 'image/jpeg']
  const lowerName = file.name.toLowerCase()
  const hasValidExt =
    lowerName.endsWith('.png') ||
    lowerName.endsWith('.jpg') ||
    lowerName.endsWith('.jpeg')

  if (!validMimes.includes(file.type) && !hasValidExt) {
    return {
      valid: false,
      error: {
        code: 'INVALID_FILE_TYPE',
        message: 'Only PNG and JPEG images are supported. File has unsupported format or extension.',
      },
    }
  }

  // 3. Binary magic bytes check (catches spoofed extensions e.g. text/pdf renamed to .png)
  try {
    const magic = await checkMagicBytes(file)
    if (!magic) {
      return {
        valid: false,
        error: {
          code: 'INVALID_FILE_TYPE',
          message: 'File header does not match a valid PNG or JPEG signature. Extension may be spoofed or file is corrupted.',
        },
      }
    }
  } catch {
    return {
      valid: false,
      error: {
        code: 'CORRUPT_IMAGE',
        message: 'Unable to read binary file headers.',
      },
    }
  }

  // 4. Decode image in memory to verify resolution and integrity
  return new Promise<FileValidationResult>((resolve) => {
    let objectUrl = ''
    try {
      objectUrl = URL.createObjectURL(file)
    } catch {
      resolve({
        valid: false,
        error: {
          code: 'CORRUPT_IMAGE',
          message: 'Unable to allocate memory for image decoding.',
        },
      })
      return
    }

    const img = new Image()

    img.onload = () => {
      const { naturalWidth, naturalHeight } = img
      if (naturalWidth < MIN_DIMENSION || naturalHeight < MIN_DIMENSION) {
        URL.revokeObjectURL(objectUrl)
        resolve({
          valid: false,
          error: {
            code: 'IMAGE_TOO_SMALL',
            message: `Image dimensions (${naturalWidth}×${naturalHeight}px) are below the minimum required resolution (${MIN_DIMENSION}×${MIN_DIMENSION}px) for clinical analysis.`,
          },
        })
      } else {
        resolve({
          valid: true,
          file,
          width: naturalWidth,
          height: naturalHeight,
          objectUrl,
        })
      }
    }

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      resolve({
        valid: false,
        error: {
          code: 'CORRUPT_IMAGE',
          message: 'File failed to decode as an image. The file may be corrupt or truncated.',
        },
      })
    }

    img.src = objectUrl
  })
}
