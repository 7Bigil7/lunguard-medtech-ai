import { describe, it, expect } from 'vitest'
import { analyzePixelData } from '../lib/imageQuality'

describe('Image Quality Analyzer (analyzePixelData)', () => {
  it('correctly evaluates monochromatic grayscale image with good exposure and contrast', () => {
    const width = 100
    const height = 100
    const pixels = new Uint8ClampedArray(width * height * 4)

    // Fill with alternating intensities from 50 to 180 (grayscale: R=G=B)
    for (let i = 0; i < width * height; i++) {
      const val = (i % 2 === 0) ? 60 : 180
      pixels[i * 4] = val
      pixels[i * 4 + 1] = val
      pixels[i * 4 + 2] = val
      pixels[i * 4 + 3] = 255
    }

    const metrics = analyzePixelData(pixels, width, height)

    expect(metrics.isGrayscale).toBe(true)
    expect(metrics.aspectRatio).toBe(1)
    expect(metrics.aspectRatioString).toBe('1:1')
    expect(metrics.meanBrightness).toBeCloseTo(120, -1)
    expect(metrics.contrastRating).toBe('Good')
    expect(metrics.warnings).toHaveLength(0)
  })

  it('detects color saturation and issues non-diagnostic color warning', () => {
    const width = 50
    const height = 50
    const pixels = new Uint8ClampedArray(width * height * 4)

    // Strongly colored red pixels
    for (let i = 0; i < width * height; i++) {
      pixels[i * 4] = 220
      pixels[i * 4 + 1] = 30
      pixels[i * 4 + 2] = 30
      pixels[i * 4 + 3] = 255
    }

    const metrics = analyzePixelData(pixels, width, height)

    expect(metrics.isGrayscale).toBe(false)
    expect(metrics.colorVariance).toBeGreaterThan(100)
    expect(metrics.warnings.some((w) => w.includes('color saturation'))).toBe(true)
  })

  it('detects severely underexposed (dark) images', () => {
    const width = 50
    const height = 50
    const pixels = new Uint8ClampedArray(width * height * 4)

    // Very dark pixels ~15 luminance
    for (let i = 0; i < width * height; i++) {
      pixels[i * 4] = 15
      pixels[i * 4 + 1] = 15
      pixels[i * 4 + 2] = 15
      pixels[i * 4 + 3] = 255
    }

    const metrics = analyzePixelData(pixels, width, height)

    expect(metrics.meanBrightness).toBeLessThan(35)
    expect(metrics.warnings.some((w) => w.includes('underexposed'))).toBe(true)
  })

  it('detects zero/low contrast images', () => {
    const width = 50
    const height = 50
    const pixels = new Uint8ClampedArray(width * height * 4)

    // Completely flat image (all pixels exactly 128)
    for (let i = 0; i < width * height; i++) {
      pixels[i * 4] = 128
      pixels[i * 4 + 1] = 128
      pixels[i * 4 + 2] = 128
      pixels[i * 4 + 3] = 255
    }

    const metrics = analyzePixelData(pixels, width, height)

    expect(metrics.contrastStdDev).toBe(0)
    expect(metrics.contrastRating).toBe('Low')
    expect(metrics.warnings.some((w) => w.includes('contrast is low'))).toBe(true)
  })

  it('detects atypical aspect ratios for chest radiographs', () => {
    const width = 500
    const height = 100 // 5:1 ratio
    const pixels = new Uint8ClampedArray(width * height * 4)

    for (let i = 0; i < width * height; i++) {
      pixels[i * 4] = 120
      pixels[i * 4 + 1] = 120
      pixels[i * 4 + 2] = 120
      pixels[i * 4 + 3] = 255
    }

    const metrics = analyzePixelData(pixels, width, height)

    expect(metrics.aspectRatio).toBe(5)
    expect(metrics.warnings.some((w) => w.includes('Aspect ratio'))).toBe(true)
  })
})
