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
        <div className="relative aspect-[4/3] sm:aspect-[1.15/1] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center overflow-hidden">
          {/* Anatomical CXR vector visualization */}
          <svg
            viewBox="0 0 400 360"
            className="w-full h-full object-contain opacity-90 select-none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Soft background thoracic outline */}
            <path
              d="M100 70C60 110 50 200 65 290C90 320 160 325 200 325C240 325 310 320 335 290C350 200 340 110 300 70C270 45 220 40 200 40C180 40 130 45 100 70Z"
              fill="#0A1124"
              stroke="#1E293B"
              strokeWidth="1.5"
            />

            {/* Trachea & Main Bronchi */}
            <path d="M200 30V130" stroke="#334155" strokeWidth="12" strokeLinecap="round" />
            <path d="M200 130C180 150 150 165 120 180" stroke="#334155" strokeWidth="8" strokeLinecap="round" />
            <path d="M200 130C220 150 250 165 280 180" stroke="#334155" strokeWidth="8" strokeLinecap="round" />

            {/* Rib Cage Contours */}
            <g stroke="#1E293B" strokeWidth="3" opacity="0.75" strokeLinecap="round">
              <path d="M120 90C150 110 250 110 280 90" />
              <path d="M105 120C140 145 260 145 295 120" />
              <path d="M95 155C135 185 265 185 305 155" />
              <path d="M90 195C130 225 270 225 310 195" />
              <path d="M85 240C125 270 275 270 315 240" />
              <path d="M85 280C125 305 275 305 315 280" />
            </g>

            {/* Bilateral Lung Radiopacity Fields */}
            {/* Right Lung Field */}
            <path
              d="M190 110C160 100 110 115 95 160C85 200 80 260 100 295C130 305 175 290 185 260C190 220 190 160 190 110Z"
              fill="#0F172A"
              stroke="#38BDF8"
              strokeWidth="0.75"
              strokeDasharray="2 2"
              opacity="0.4"
            />
            {/* Left Lung Field */}
            <path
              d="M210 110C240 100 290 115 305 160C315 200 320 260 300 295C270 305 225 290 215 260C210 220 210 160 210 110Z"
              fill="#0F172A"
              stroke="#38BDF8"
              strokeWidth="0.75"
              strokeDasharray="2 2"
              opacity="0.4"
            />

            {/* Cardiac Silhouette (Center-Left) */}
            <path
              d="M185 190C170 220 180 280 240 280C260 280 270 260 265 240C260 210 230 190 200 185"
              fill="#0F1E36"
              stroke="#1E293B"
              strokeWidth="2"
              opacity="0.9"
            />
          </svg>

          {/* Attention Heatmaps & Bounding Boxes */}
          {showOverlays && (
            <>
              {/* Hotspot 1: Right Upper Lobe (TB ?) */}
              <div className="absolute top-[28%] left-[24%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none">
                {/* Yellow badge */}
                <div className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 text-[10px] font-extrabold tracking-wider shadow-md mb-1 animate-pulse">
                  TB ?
                </div>
                {/* Dashed Bounding Box with radiant yellow radial heatmap */}
                <div className="w-20 h-20 rounded-xl border-2 border-dashed border-amber-400 relative flex items-center justify-center">
                  <div className="absolute inset-0 rounded-xl bg-amber-500/20 blur-md" />
                  <div className="w-14 h-14 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 opacity-80 blur-sm mix-blend-screen" />
                </div>
              </div>

              {/* Hotspot 2: Left Mid-Zone (Malignancy ?) */}
              <div className="absolute top-[48%] left-[64%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none">
                {/* Red badge */}
                <div className="px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-extrabold tracking-wider shadow-md mb-1 animate-pulse">
                  Malignancy ?
                </div>
                {/* Dashed Bounding Box with radiant red radial heatmap */}
                <div className="w-24 h-24 rounded-xl border-2 border-dashed border-rose-500 relative flex items-center justify-center">
                  <div className="absolute inset-0 rounded-xl bg-rose-600/25 blur-md" />
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-rose-500 via-red-600 to-rose-700 opacity-80 blur-sm mix-blend-screen" />
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
