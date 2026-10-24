import React, { useState } from 'react'
import { Sparkles, Maximize2, BarChart2, AlertTriangle, Eye, EyeOff } from 'lucide-react'

export const HeroCxrCard: React.FC = () => {
  const [showOverlays, setShowOverlays] = useState(true)

  return (
    <div className="relative w-full max-w-lg mx-auto lg:max-w-none">
      {/* Outer ambient glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-teal-500/20 to-indigo-500/20 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition duration-1000 -z-10" />

      {/* Main Container Frame */}
      <div className="relative rounded-2xl border border-slate-700/80 bg-slate-950/95 shadow-2xl overflow-hidden backdrop-blur-md">
        {/* Top Window Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-slate-800/90 text-cyan-400 border border-slate-700 text-[11px] font-semibold tracking-wide">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>AI ANALYSIS PREVIEW</span>
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setShowOverlays(!showOverlays)}
              title={showOverlays ? 'Hide attention heatmaps' : 'Show attention heatmaps'}
              className="p-1 rounded text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors text-xs flex items-center space-x-1"
            >
              {showOverlays ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span className="text-[10px] hidden sm:inline">{showOverlays ? 'Heatmaps On' : 'Heatmaps Off'}</span>
            </button>
            <div className="p-1 text-slate-500">
              <Maximize2 className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* CXR Radiograph Viewport */}
        <div className="relative aspect-[4/3] sm:aspect-[1.15/1] bg-slate-950 flex items-center justify-center overflow-hidden">
          {/* Authentic Clinical Chest Radiograph */}
          <img
            src="/hero-cxr.jpg"
            alt="Clinical chest X-ray radiograph"
            className="w-full h-full object-cover scale-[1.08] select-none filter contrast-125 brightness-95"
            draggable={false}
          />

          {/* Medical Monitor Cool-Blue Vignette & Atmosphere */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30 pointer-events-none" />
          <div className="absolute inset-0 ring-1 ring-inset ring-cyan-500/10 pointer-events-none" />

          {/* Attention Heatmaps & Bounding Boxes */}
          {showOverlays && (
            <>
              {/* Hotspot 1: Right Upper/Mid Lung Field (TB ?) */}
              <div className="absolute top-[34%] left-[26%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none z-10">
                {/* Yellow badge */}
                <div className="px-2.5 py-0.5 rounded bg-amber-400 text-slate-950 text-[10px] font-black tracking-wider shadow-lg mb-1.5 animate-pulse">
                  TB ?
                </div>
                {/* Dashed Bounding Box with smooth radiant heatmap */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl border-2 border-dashed border-amber-400/90 relative flex items-center justify-center">
                  <div className="absolute inset-0 rounded-xl bg-amber-400/25 blur-md" />
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[radial-gradient(circle,_rgba(254,240,138,0.95)_0%,_rgba(245,158,11,0.85)_40%,_rgba(234,88,12,0.4)_70%,_transparent_100%)] blur-[2px] mix-blend-screen shadow-[0_0_30px_rgba(245,158,11,0.8)]" />
                </div>
              </div>

              {/* Hotspot 2: Left Mid Lung Zone (Malignancy ?) */}
              <div className="absolute top-[38%] left-[63%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none z-10">
                {/* Red badge */}
                <div className="px-2.5 py-0.5 rounded bg-rose-600 text-white text-[10px] font-black tracking-wider shadow-lg mb-1.5 animate-pulse">
                  Malignancy ?
                </div>
                {/* Dashed Bounding Box with smooth radiant heatmap */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl border-2 border-dashed border-rose-500/90 relative flex items-center justify-center">
                  <div className="absolute inset-0 rounded-xl bg-rose-600/30 blur-md" />
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[radial-gradient(circle,_rgba(254,205,211,0.95)_0%,_rgba(244,63,94,0.85)_40%,_rgba(190,18,60,0.4)_70%,_transparent_100%)] blur-[2px] mix-blend-screen shadow-[0_0_35px_rgba(244,63,94,0.8)]" />
                </div>
              </div>
            </>
          )}

          {/* Floating Model Assessment Glassmorphic Overlay Card */}
          <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 w-44 sm:w-52 p-3 rounded-xl bg-slate-900/95 border border-slate-700/80 shadow-2xl backdrop-blur-md space-y-2 text-xs">
            <div className="flex items-center space-x-1.5 pb-1 border-b border-slate-800">
              <BarChart2 className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-bold text-white text-[11px] tracking-wide">
                Model Assessment
              </span>
            </div>

            <div className="space-y-1 text-[11px]">
              <div className="text-slate-400 text-[10px]">Region of Interest</div>
              <div className="flex items-center space-x-1.5 font-medium text-slate-200">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Possible TB</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-slate-400">Model Confidence</span>
                <span className="font-mono text-cyan-400 font-bold">0.32 (Low)</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div className="bg-cyan-400 h-1.5 rounded-full w-[32%]" />
              </div>
            </div>

            {/* Amber Uncertain Callout */}
            <div className="p-2 rounded-lg bg-amber-950/50 border border-amber-600/60 text-amber-300 flex items-start space-x-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-[11px] font-bold text-amber-300 leading-tight">
                  Uncertain Case
                </strong>
                <span className="text-[10px] text-amber-200/80 leading-tight block">
                  Flag for clinical review
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
