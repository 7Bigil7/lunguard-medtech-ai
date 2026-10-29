import React, { useState } from 'react'
import { Eye, EyeOff, Sliders, AlertCircle, Info, Sparkles } from 'lucide-react'
import type { ExplainabilityResult } from '../../types/api'

interface GradCamViewerProps {
  originalImageSrc?: string
  explainability: ExplainabilityResult
  isSimulated: boolean
}

export const GradCamViewer: React.FC<GradCamViewerProps> = ({
  originalImageSrc,
  explainability,
  isSimulated,
}) => {
  const [opacity, setOpacity] = useState<number>(0.6)
  const [showOverlay, setShowOverlay] = useState<boolean>(true)
  const [viewMode, setViewMode] = useState<'side-by-side' | 'single-overlay'>('side-by-side')

  if (!explainability.available || !explainability.heatmap_png_base64) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
        <h3 className="text-base font-bold text-slate-900 tracking-tight">
          Visual Explainability (Grad-CAM)
        </h3>
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-slate-500 shrink-0" />
          <span>Explainability not available for this analysis.</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Visual Explainability (Grad-CAM)
            </h3>
            {isSimulated && (
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                Simulated Overlay
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500">
            Gradient-weighted Class Activation Map from DenseNet-121 penultimate convolutional block
          </p>
        </div>

        {/* View Mode & Overlay Toggle */}
        <div className="flex items-center space-x-2 text-xs">
          <div className="flex rounded-md border border-slate-200 overflow-hidden bg-slate-100 p-0.5">
            <button
              type="button"
              onClick={() => setViewMode('side-by-side')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                viewMode === 'side-by-side' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Side-by-Side
            </button>
            <button
              type="button"
              onClick={() => setViewMode('single-overlay')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                viewMode === 'single-overlay' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Full Overlay
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowOverlay(!showOverlay)}
            className={`inline-flex items-center px-2.5 py-1 rounded border text-xs font-medium transition-colors ${
              showOverlay
                ? 'bg-teal-50 border-teal-300 text-teal-800'
                : 'bg-slate-100 border-slate-200 text-slate-600'
            }`}
          >
            {showOverlay ? <Eye className="w-3.5 h-3.5 mr-1 text-teal-600" /> : <EyeOff className="w-3.5 h-3.5 mr-1" />}
            {showOverlay ? 'Heatmap On' : 'Heatmap Off'}
          </button>
        </div>
      </div>

      {/* Opacity Slider Control */}
      <div className="flex items-center space-x-3 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs">
        <Sliders className="w-4 h-4 text-slate-500 shrink-0" />
        <label htmlFor="heatmap-opacity-range" className="text-slate-700 font-medium whitespace-nowrap">
          Overlay Opacity: <span className="font-mono font-bold text-slate-900">{Math.round(opacity * 100)}%</span>
        </label>
        <input
          id="heatmap-opacity-range"
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={opacity}
          disabled={!showOverlay}
          onChange={(e) => setOpacity(parseFloat(e.target.value))}
          className="w-full accent-teal-600 cursor-pointer disabled:opacity-40"
        />
      </div>

      {/* Visual Displays */}
      {viewMode === 'side-by-side' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Original View */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-600 block">
              1. Original Radiograph
            </span>
            <div className="aspect-square bg-slate-950 rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center relative">
              {originalImageSrc ? (
                <img
                  src={originalImageSrc}
                  alt="Original chest radiograph"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-xs text-slate-500">Image loaded in memory</div>
              )}
            </div>
          </div>

          {/* Heatmap Overlay View */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-600 block flex items-center justify-between">
              <span>2. Attention Heatmap Overlay</span>
              <span className="text-[11px] text-teal-700 font-mono">Grad-CAM Penultimate Layer</span>
            </span>
            <div className="aspect-square bg-slate-950 rounded-lg overflow-hidden border border-slate-800 relative flex items-center justify-center">
              {originalImageSrc && (
                <img
                  src={originalImageSrc}
                  alt="Background radiograph"
                  className="w-full h-full object-contain absolute inset-0 z-0"
                />
              )}

              {showOverlay && (
                <img
                  src={explainability.heatmap_png_base64}
                  alt="Grad-CAM activation heatmap overlay"
                  style={{ opacity }}
                  className="w-full h-full object-contain absolute inset-0 z-10 transition-opacity mix-blend-screen"
                />
              )}
              {isSimulated && (
                <div className="absolute bottom-2 inset-x-2 z-20 text-center py-0.5 px-2 rounded bg-slate-950/90 border border-amber-400/50 text-[10px] font-medium text-amber-300">
                  Illustrative placeholder, not derived from your image.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Full Single Overlay View */
        <div className="space-y-1.5 max-w-xl mx-auto">
          <span className="text-xs font-semibold text-slate-600 block text-center">
            Merged Diagnostic Overlay View
          </span>
          <div className="aspect-square bg-slate-950 rounded-lg overflow-hidden border border-slate-800 relative flex items-center justify-center">
            {originalImageSrc && (
              <img
                src={originalImageSrc}
                alt="Radiograph base"
                className="w-full h-full object-contain absolute inset-0 z-0"
              />
            )}
            {showOverlay && (
              <img
                src={explainability.heatmap_png_base64}
                alt="Grad-CAM heatmap"
                style={{ opacity }}
                className="w-full h-full object-contain absolute inset-0 z-10 transition-opacity mix-blend-screen"
              />
            )}
            {isSimulated && (
              <div className="absolute bottom-2 inset-x-2 z-20 text-center py-0.5 px-2 rounded bg-slate-950/90 border border-amber-400/50 text-[10px] font-medium text-amber-300">
                Illustrative placeholder, not derived from your image.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Required Explainability Disclaimers */}
      <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
        <div className="flex items-start space-x-2 text-slate-600">
          <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <p className="font-medium">
            <strong>Clinical Caution:</strong> Heatmaps show where the model&apos;s attention was concentrated. They do not prove a diagnosis.
          </p>
        </div>

        {isSimulated && (
          <div className="flex items-start space-x-2 text-amber-900 bg-amber-50 p-2.5 rounded border border-amber-200">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              <strong>Simulated Demonstration:</strong> {explainability.note || 'Illustrative placeholder, not derived from your image.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
