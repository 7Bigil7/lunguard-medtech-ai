import React from 'react'
import { FlaskConical, ChevronRight } from 'lucide-react'
import { useApp } from '../../context/useApp'
import type { TriageOutcome } from '../../types/api'

export const DemoModeBanner: React.FC = () => {
  const { mode, simulatedScenario, setSimulatedScenario } = useApp()

  if (mode !== 'demo') {
    return null
  }

  const scenarios: { id: TriageOutcome; label: string }[] = [
    { id: 'UNCERTAIN_DUAL_RISK', label: '1. Uncertain / Dual-Risk (Key Focus)' },
    { id: 'TB_CONSISTENT', label: '2. TB-Consistent' },
    { id: 'MALIGNANCY_SUSPICIOUS', label: '3. Malignancy-Suspicious' },
    { id: 'NORMAL', label: '4. Normal' },
  ]

  return (
    <div
      id="mode-banner"
      role="alert"
      aria-label="Simulation Mode Banner"
      className="bg-slate-900 text-slate-200 px-4 py-2 border-b border-slate-800 text-xs select-none shadow-xs"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
        <div className="flex items-center space-x-2 text-[11px] sm:text-xs text-slate-300">
          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-teal-400 font-mono font-bold text-[10px] tracking-wider uppercase inline-flex items-center border border-slate-700">
            <FlaskConical className="w-3 h-3 mr-1" />
            SIMULATED DEMO MODE
          </span>
          <span className="text-slate-400">
            SIMULATED DEMO MODE. Results are scripted examples, not real AI inference on your image.
          </span>
        </div>

        {/* Scenario Selection Control */}
        <div className="flex items-center space-x-1.5 text-[11px]">
          <span className="text-slate-400 whitespace-nowrap flex items-center font-medium">
            Select simulated scenario:
            <ChevronRight className="w-3 h-3 ml-0.5 text-slate-500" />
          </span>
          <div className="flex flex-wrap gap-1">
            {scenarios.map((sc) => (
              <button
                key={sc.id}
                type="button"
                onClick={() => setSimulatedScenario(sc.id)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                  simulatedScenario === sc.id
                    ? 'bg-white text-slate-950 shadow-xs'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                }`}
              >
                {sc.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
