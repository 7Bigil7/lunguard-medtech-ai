import React from 'react'
import { Info } from 'lucide-react'
import type { ModelMetadata } from '../../types/api'

interface ModelScoresPanelProps {
  model: ModelMetadata
}

export const ModelScoresPanel: React.FC<ModelScoresPanelProps> = ({ model }) => {
  const { scores, calibrated, name } = model

  const scoreItems = [
    {
      id: 'normal',
      label: 'Normal (No Abnormality)',
      value: scores.normal,
      barColor: 'bg-emerald-600',
    },
    {
      id: 'tb_consistent',
      label: 'TB-Consistent',
      value: scores.tb_consistent,
      barColor: 'bg-amber-600',
    },
    {
      id: 'malignancy_suspicious',
      label: 'Malignancy-Suspicious',
      value: scores.malignancy_suspicious,
      barColor: 'bg-rose-600',
    },
  ]

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Model output scores
          </h3>
          <p className="text-xs text-slate-500">Backbone: {name}</p>
        </div>

        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${
            calibrated
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
              : 'bg-amber-50 text-amber-800 border-amber-300'
          }`}
        >
          {calibrated ? 'Calibrated Probabilities' : 'Raw Model Scores (Uncalibrated)'}
        </span>
      </div>

      {/* Warning / Note on calibration */}
      <div className="flex items-start space-x-2 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
        <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Important Clinical Note:</strong> These are <strong>raw model scores</strong> (direct sigmoid activations) and are <strong>NOT calibrated probabilities</strong> unless calibrated is true. They reflect relative feature activation and must not be interpreted as absolute diagnostic likelihoods.
        </p>
      </div>

      {/* Score Bars and Table */}
      <div className="space-y-3 pt-1">
        {scoreItems.map((item) => {
          const percentage = Math.round(item.value * 100)
          return (
            <div key={item.id} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">{item.label}</span>
                <span className="font-mono font-bold text-slate-900">
                  {item.value.toFixed(3)} ({percentage}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-2.5 rounded-full ${item.barColor} transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                  aria-valuenow={percentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  role="progressbar"
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
