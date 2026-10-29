import React, { useEffect, useState } from 'react'
import { Loader2, XCircle } from 'lucide-react'

interface AnalysisProgressBarProps {
  isLoading: boolean
  onCancel?: () => void
}

const STAGES = [
  '1. Validate: Magic bytes & dimensions',
  '2. Preprocess: 224×224 Normalization',
  '3. Model scores: Feature extraction logits',
  '4. Conformal prediction set: C(X) @ 95%',
  '5. Safety policy: Rule evaluation',
  '6. Triage: Clinical routing outcome',
]

export const AnalysisProgressBar: React.FC<AnalysisProgressBarProps> = ({
  isLoading,
  onCancel,
}) => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0)

  useEffect(() => {
    if (!isLoading) return

    const interval = setInterval(() => {
      setCurrentStageIndex((prev) => (prev < STAGES.length - 1 ? prev + 1 : prev))
    }, 140)

    return () => {
      clearInterval(interval)
      setCurrentStageIndex(0)
    }
  }, [isLoading])

  if (!isLoading) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="p-5 bg-white border border-slate-200 rounded-lg shadow-sm space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-5 h-5 text-teal-600 animate-spin" />
          <span className="font-semibold text-slate-900 text-sm">
            Executing Uncertainty-Aware Triage Pipeline...
          </span>
        </div>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center px-2 py-1 rounded border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <XCircle className="w-3.5 h-3.5 mr-1 text-slate-400" />
            Cancel
          </button>
        )}
      </div>

      {/* Progress track */}
      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
        <div
          className="bg-teal-600 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${((currentStageIndex + 1) / STAGES.length) * 100}%` }}
        />
      </div>

      {/* Pipeline Stages */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-1 text-xs">
        {STAGES.map((stage, idx) => {
          const isDone = idx < currentStageIndex
          const isCurrent = idx === currentStageIndex
          return (
            <div
              key={stage}
              className={`p-2 rounded border transition-colors ${
                isCurrent
                  ? 'bg-teal-50/70 border-teal-300 text-teal-900 font-medium'
                  : isDone
                  ? 'bg-slate-50 border-slate-200 text-slate-600'
                  : 'bg-white border-dashed border-slate-200 text-slate-400'
              }`}
            >
              <div className="flex items-center space-x-1.5">
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isCurrent
                      ? 'bg-teal-600 text-white'
                      : isDone
                      ? 'bg-slate-700 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {idx + 1}
                </span>
                <span className="truncate">{stage}</span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="sr-only">
        Active Stage: {STAGES[currentStageIndex]}
      </div>
    </div>
  )
}
