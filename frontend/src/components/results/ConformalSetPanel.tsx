import React from 'react'
import { Layers, HelpCircle } from 'lucide-react'
import type { ConformalPredictionResult, PredictionClass } from '../../types/api'

interface ConformalSetPanelProps {
  conformal: ConformalPredictionResult
}

const CLASS_LABELS: Record<PredictionClass, { name: string; style: string }> = {
  normal: {
    name: 'Normal',
    style: 'bg-emerald-100 text-emerald-900 border-emerald-300',
  },
  tb_consistent: {
    name: 'TB-Consistent',
    style: 'bg-amber-100 text-amber-900 border-amber-300',
  },
  malignancy_suspicious: {
    name: 'Malignancy-Suspicious',
    style: 'bg-rose-100 text-rose-900 border-rose-300',
  },
}

export const ConformalSetPanel: React.FC<ConformalSetPanelProps> = ({ conformal }) => {
  const { prediction_set, target_coverage, method } = conformal
  const coveragePercent = target_coverage ? `${Math.round(target_coverage * 100)}%` : 'N/A'

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <Layers className="w-5 h-5 text-teal-600" />
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Conformal Prediction Set
          </h3>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-500">Method:</span>
          <span className="font-mono font-medium text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            {method}
          </span>
          <span className="text-slate-500 ml-1">Target Coverage (1 - α):</span>
          <span className="font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
            {coveragePercent}
          </span>
        </div>
      </div>

      {/* Set Visualization */}
      <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
        <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider block">
          Predicted Class Set C(X) = {'{'}
        </span>

        {prediction_set.length === 0 ? (
          <div className="py-2 text-sm text-slate-500 italic">
            ∅ Empty Set (Model abstained due to extreme uncertainty or non-conformity)
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 py-1 items-center">
            {prediction_set.map((cls) => {
              const meta = CLASS_LABELS[cls] || {
                name: cls,
                style: 'bg-slate-100 text-slate-800 border-slate-300',
              }
              return (
                <span
                  key={cls}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border shadow-xs inline-flex items-center ${meta.style}`}
                >
                  {meta.name}
                </span>
              )
            })}
            <span className="text-slate-500 font-mono text-sm">{'}'}</span>
            <span className="text-xs text-slate-500 ml-2">
              ({prediction_set.length} class{prediction_set.length > 1 ? 'es' : ''} included)
            </span>
          </div>
        )}
      </div>

      {/* Educational Note */}
      <div className="flex items-start space-x-2 text-xs text-slate-600 leading-relaxed">
        <HelpCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <p>
          <strong>What is a conformal prediction set?</strong> Unlike single-label classifiers that force an artificial choice, conformal prediction outputs a set of plausible classes with a mathematically bounded error rate (e.g. 95% coverage), assuming the patient population follows the same distribution as the calibration cohort (exchangeability). Multi-label sets signify diagnostic ambiguity.
        </p>
      </div>
    </div>
  )
}
