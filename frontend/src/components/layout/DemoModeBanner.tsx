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
      className="bg-amber-500 text-slate-950 px-4 py-2.5 shadow-md border-b border-amber-600 transition-all select-none"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs md:text-sm">
        <div className="flex items-center space-x-2 font-medium">
          <span className="p-1 rounded bg-slate-950 text-amber-400 font-mono font-bold text-xs uppercase tracking-wider flex items-center">
            <FlaskConical className="w-3.5 h-3.5 mr-1" />
            SIMULATED DEMO MODE
          </span>
          <span className="font-semibold text-slate-950">
            SIMULATED DEMO MODE. Results are scripted examples, not real AI inference on your image.
          </span>
        </div>

        {/* Scenario Selection Control */}
        <div className="flex items-center space-x-2 bg-amber-400/80 p-1.5 rounded-lg border border-amber-600/40">
          <span className="font-bold text-slate-900 whitespace-nowrap flex items-center text-xs">
            Select simulated scenario:
            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </span>
          <div className="flex flex-wrap gap-1">
            {scenarios.map((sc) => (
              <button
                key={sc.id}
                type="button"
                onClick={() => setSimulatedScenario(sc.id)}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                  simulatedScenario === sc.id
                    ? 'bg-slate-950 text-amber-300 shadow-sm ring-1 ring-slate-900'
                    : 'bg-amber-100/70 hover:bg-white text-slate-900'
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
