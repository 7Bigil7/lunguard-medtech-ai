import React from 'react'
import { Activity, ShieldCheck, Layers, Eye } from 'lucide-react'
import type { AnalysisResponse } from '../../types/api'

interface TrustPassportPanelProps {
  response: AnalysisResponse
}

export const TrustPassportPanel: React.FC<TrustPassportPanelProps> = ({ response }) => {
  if (!response.predictions && !response.trustguard) {
    return null
  }

  const predictionsEntries = response.predictions
    ? Object.entries(response.predictions).sort((a, b) => b[1] - a[1])
    : []

  const stability = response.stability
  const iq = response.image_quality
  const tg = response.trustguard

  return (
    <div className="bg-white rounded-2xl border border-cyan-200/90 shadow-md p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 text-white flex items-center justify-center shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-extrabold text-slate-900">
                LUNGGUARD v2.0 Unified Trust Passport
              </h3>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                Live TorchXRayVision Inference
              </span>
            </div>
            <p className="text-xs text-slate-500">
              18 radiographic finding activations, 5-sample perturbation stability challenge, and deterministic P1–P7 TrustGuard audit.
            </p>
          </div>
        </div>

        {response.processing_time_ms !== undefined && (
          <div className="text-xs font-mono text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            Inference Time: <strong className="text-slate-900">{response.processing_time_ms} ms</strong>
          </div>
        )}
      </div>

      {/* Top 3 Reliability Cards: TrustGuard, Stability, Server ImageQuality */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. TrustGuard Decision */}
        {tg && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center">
                <ShieldCheck className="w-4 h-4 mr-1.5 text-teal-600" />
                TrustGuard Decision
              </span>
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-100 text-cyan-900">
                Rule {tg.priority_rule}
              </span>
            </div>
            <div className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
              {tg.decision.replace(/_/g, ' ')}
            </div>
            <div className="text-[11px] text-slate-600 font-mono">
              Reasons: {tg.reasons.join(', ')}
            </div>
          </div>
        )}

        {/* 2. Vectorized 5-Sample Stability Challenge */}
        {stability && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center">
                <Activity className="w-4 h-4 mr-1.5 text-cyan-600" />
                Perturbation Stability ({stability.tests_run}x)
              </span>
              <span
                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                  stability.status === 'stable'
                    ? 'bg-emerald-100 text-emerald-800'
                    : stability.status === 'moderate_instability'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {stability.status.replace(/_/g, ' ')}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div>
                <span className="text-slate-500 block text-[10px]">Stability Score</span>
                <strong className="font-mono text-slate-900">
                  {stability.score !== null && stability.score !== undefined
                    ? `${(stability.score * 100).toFixed(1)}%`
                    : 'N/A'}
                </strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Max Score Delta</span>
                <strong className="font-mono text-slate-900">
                  {stability.max_score_delta !== null && stability.max_score_delta !== undefined
                    ? stability.max_score_delta.toFixed(4)
                    : 'N/A'}
                </strong>
              </div>
            </div>
          </div>
        )}

        {/* 3. Server-Side ImageQualityGuardian */}
        {iq && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center">
                <Eye className="w-4 h-4 mr-1.5 text-purple-600" />
                ImageQualityGuardian
              </span>
              <span
                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                  iq.status === 'acceptable'
                    ? 'bg-emerald-100 text-emerald-800'
                    : iq.status === 'suboptimal'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {iq.status}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1 text-[11px] pt-1 font-mono">
              <div>
                <span className="text-slate-400 block text-[10px]">Blur Var</span>
                <strong className="text-slate-800">{iq.blur_score}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Contrast</span>
                <strong className="text-slate-800">{iq.contrast}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Dyn Range</span>
                <strong className="text-slate-800">{iq.dynamic_range}</strong>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 18 Radiographic Finding Activations Grid */}
      {predictionsEntries.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center">
              <Layers className="w-3.5 h-3.5 mr-1.5 text-cyan-600" />
              18 TorchXRayVision Radiographic Finding Activations (Uncalibrated)
            </span>
            <span className="text-[11px] text-slate-500">
              Threshold Reference: 0.50
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {predictionsEntries.map(([label, score]) => {
              const isElevated = score >= 0.5
              return (
                <div
                  key={label}
                  className={`p-2.5 rounded-xl border text-xs space-y-1.5 ${
                    isElevated
                      ? 'bg-amber-50/70 border-amber-300 text-amber-950'
                      : 'bg-slate-50/70 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-semibold truncate text-[11px]" title={label}>
                      {label.replace(/_/g, ' ')}
                    </span>
                    <span className="font-mono font-bold text-[11px]">
                      {(score * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        isElevated ? 'bg-amber-500' : 'bg-cyan-600'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(2, score * 100))}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

