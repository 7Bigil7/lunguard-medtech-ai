/**
 * Client-Side Image Quality Analyzer (Genuinely Computed)
 * 
 * Computes deterministic image metrics directly in the browser using HTML Canvas:
 * - Dimensions & Aspect Ratio
 * - Monochromatic / Grayscale verification
 * - Mean luminance (brightness)
 * - Standard deviation of luminance (contrast)
 * 
 * IMPORTANT: These are non-diagnostic engineering checks and DO NOT assess clinical pathology.
 */

export interface ImageQualityMetrics {
  width: number
  height: number
  aspectRatio: number
  aspectRatioString: string
  isGrayscale: boolean
  colorVariance: number
  meanBrightness: number // 0 to 255
  brightnessPercent: number // 0% to 100%
  contrastStdDev: number // 0 to ~128
  contrastRating: 'Low' | 'Moderate' | 'Good' | 'High'
  warnings: string[]
}

/**
 * Computes quality metrics from raw pixel buffer (RGBA array)
 * This function is pure and easily unit-testable without a browser canvas!
 */
export function analyzePixelData(
  pixels: Uint8ClampedArray | number[],
  width: number,
  height: number
): ImageQualityMetrics {
  const totalPixels = width * height
  if (totalPixels === 0 || pixels.length < 4) {
    return {
      width,
      height,
      aspectRatio: 1,
      aspectRatioString: '1:1',
      isGrayscale: true,
      colorVariance: 0,
      meanBrightness: 128,
      brightnessPercent: 50,
      contrastStdDev: 50,
      contrastRating: 'Moderate',
      warnings: ['Insufficient pixel data for quality checks.'],
    }
  }

  let totalLuminance = 0
  let totalColorDiff = 0
  const step = Math.max(1, Math.floor(totalPixels / 10000)) // Sample up to 10,000 pixels for fast responsiveness
  let sampledCount = 0

  const luminances: number[] = []

  for (let i = 0; i < pixels.length; i += step * 4) {
    const r = pixels[i]
    const g = pixels[i + 1]
    const b = pixels[i + 2]
    // ITU-R BT.601 standard perceived luminance
    const lum = 0.299 * r + 0.587 * g + 0.114 * b
    totalLuminance += lum
    luminances.push(lum)

    // Color difference check: max deviation between RGB channels
    const diff = Math.max(Math.abs(r - g), Math.abs(r - b), Math.abs(g - b))
    totalColorDiff += diff
    sampledCount++
  }

  const meanBrightness = sampledCount > 0 ? totalLuminance / sampledCount : 128
  const avgColorDiff = sampledCount > 0 ? totalColorDiff / sampledCount : 0
  const isGrayscale = avgColorDiff < 14 // Permissive threshold for slight JPEG compression artifacts

  // Contrast: Standard deviation of luminance
  let varianceSum = 0
  for (let j = 0; j < luminances.length; j++) {
    const diff = luminances[j] - meanBrightness
    varianceSum += diff * diff
  }
  const contrastStdDev = sampledCount > 0 ? Math.sqrt(varianceSum / sampledCount) : 0

  let contrastRating: 'Low' | 'Moderate' | 'Good' | 'High' = 'Good'
  if (contrastStdDev < 25) {
    contrastRating = 'Low'
  } else if (contrastStdDev < 45) {
    contrastRating = 'Moderate'
  } else if (contrastStdDev < 75) {
    contrastRating = 'Good'
  } else {
    contrastRating = 'High'
  }

  // Aspect ratio calculations
  const aspectRatio = width / (height || 1)
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))
  const d = gcd(Math.round(width), Math.round(height))
  const simpleW = Math.round(width / d)
  const simpleH = Math.round(height / d)
  const aspectRatioString = simpleW <= 16 && simpleH <= 16 ? `${simpleW}:${simpleH}` : `${aspectRatio.toFixed(2)}:1`

  // Non-diagnostic warnings
  const warnings: string[] = []

  if (!isGrayscale) {
    warnings.push(
      'Image contains noticeable color saturation; standard clinical chest radiographs are monochromatic grayscale.'
    )
  }

  if (meanBrightness < 35) {
    warnings.push(
      'Image mean brightness is unusually low (< 14% luminance); image may be underexposed or poorly illuminated.'
    )
  } else if (meanBrightness > 225) {
    warnings.push(
      'Image mean brightness is unusually high (> 88% luminance); image appears overexposed or clipped.'
    )
  }

  if (contrastStdDev < 25) {
    warnings.push(
      'Image contrast is low (std dev < 25); lung parenchyma and mediastinal contours may be indistinct.'
    )
  }

  if (aspectRatio < 0.65 || aspectRatio > 1.55) {
    warnings.push(
      `Aspect ratio (${aspectRatio.toFixed(2)}) is atypical for standard PA or AP upright chest radiography.`
    )
  }

  return {
    width,
    height,
    aspectRatio,
    aspectRatioString,
    isGrayscale,
    colorVariance: Math.round(avgColorDiff * 10) / 10,
    meanBrightness: Math.round(meanBrightness),
    brightnessPercent: Math.round((meanBrightness / 255) * 100),
    contrastStdDev: Math.round(contrastStdDev * 10) / 10,
    contrastRating,
    warnings,
  }
}

/**
 * Computes image quality metrics from an HTMLImageElement in the browser using an offscreen canvas
 */
export async function computeImageQuality(img: HTMLImageElement): Promise<ImageQualityMetrics> {
  const width = img.naturalWidth || img.width
  const height = img.naturalHeight || img.height

  if (typeof document === 'undefined') {
    // Non-DOM fallback
    return analyzePixelData(new Uint8ClampedArray(4), width, height)
  }

  try {
    const canvas = document.createElement('canvas')
    // Scale down to max 512x512 for fast processing while maintaining accurate statistical distribution
    const maxDim = 512
    const scale = Math.min(1, maxDim / Math.max(width, height))
    const w = Math.max(1, Math.round(width * scale))
    const h = Math.max(1, Math.round(height * scale))

    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      return analyzePixelData(new Uint8ClampedArray(4), width, height)
    }

    ctx.drawImage(img, 0, 0, w, h)
    const imgData = ctx.getImageData(0, 0, w, h)
    const metrics = analyzePixelData(imgData.data, width, height)
    return metrics
  } catch {
    // If canvas is blocked or fails, return baseline with dimensions
    return analyzePixelData(new Uint8ClampedArray(4), width, height)
  }
}
