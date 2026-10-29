import React from 'react'
import { X, FlaskConical, Layers, ShieldCheck, ShieldAlert, ArrowRight } from 'lucide-react'
import { getSimulatedScenarioResponse, SCENARIO_METADATA } from '../../services/demoSimulator'
import type { TriageOutcome } from '../../types/api'

interface AllScenariosModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectScenario: (scenario: TriageOutcome) => void
}

export const AllScenariosModal: React.FC<AllScenariosModalProps> = ({
  isOpen,
  onClose,
  onSelectScenario,
}) => {
  if (!isOpen) return null

  const scenarios: TriageOutcome[] = [
    'NORMAL',
    'TB_CONSISTENT',
    'MALIGNANCY_SUSPICIOUS',
    'UNCERTAIN_DUAL_RISK',
  ]

  const data = scenarios.map((sc) => ({
    scenario: sc,
    response: getSimulatedScenarioResponse(sc),
    meta: SCENARIO_METADATA[sc],
  }))

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="comparison-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto"
    >
      <div className="bg-white border border-slate-300 rounded-2xl max-w-6xl w-full my-8 p-5 sm:p-6 space-y-5 shadow-2xl text-slate-900 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-200 shrink-0">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1 rounded bg-amber-500 text-slate-950 font-bold text-xs flex items-center">
                <FlaskConical className="w-3.5 h-3.5 mr-1" />
                SIMULATED COMPARISON
              </span>
              <h2 id="comparison-title" className="text-lg sm:text-xl font-bold text-slate-900">
                Presenter Side-by-Side Comparison: All Four Triage Outcomes
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Deterministic outputs demonstrating conformal set construction and safety policy abstention across all 4 scenarios.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            aria-label="Close comparison modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4-Column Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-y-auto flex-1 pr-1">
          {data.map(({ scenario, response, meta }) => {
            const isUncertain = scenario === 'UNCERTAIN_DUAL_RISK'
            const isMalignancy = scenario === 'MALIGNANCY_SUSPICIOUS'
            const isTb = scenario === 'TB_CONSISTENT'

            return (
              <div
                key={scenario}
                className={`rounded-xl border p-4 flex flex-col justify-between space-y-4 transition-all ${
                  isUncertain
                    ? 'bg-purple-50/60 border-purple-400 ring-2 ring-purple-300'
                    : isMalignancy
                    ? 'bg-rose-50/50 border-rose-300'
                    : isTb
                    ? 'bg-amber-50/50 border-amber-300'
                    : 'bg-emerald-50/50 border-emerald-300'
                }`}
              >
                <div className="space-y-3">
                  {/* Scenario Badge & Title */}
                  <div className="space-y-1">
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border block w-fit ${
                        isUncertain
                          ? 'bg-purple-200 text-purple-900 border-purple-400'
                          : isMalignancy
                          ? 'bg-rose-200 text-rose-900 border-rose-400'
                          : isTb
                          ? 'bg-amber-200 text-amber-900 border-amber-400'
                          : 'bg-emerald-200 text-emerald-900 border-emerald-400'
                      }`}
                    >
                      {scenario.replace('_', ' ')}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900">{meta.label}</h3>
                  </div>

                  {/* 1. Model Output Scores */}
                  <div className="p-2.5 rounded bg-white/80 border border-slate-200 space-y-1 text-xs">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase block">
                      1. Model Scores (Raw)
                    </span>
                    <div className="space-y-0.5 font-mono text-[11px] text-slate-800">
                      <div className="flex justify-between">
                        <span>Normal:</span>
                        <span className="font-bold">{(response.model.scores.normal * 100).toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>TB:</span>
                        <span className="font-bold">{(response.model.scores.tb_consistent * 100).toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Malignancy:</span>
                        <span className="font-bold">{(response.model.scores.malignancy_suspicious * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>

                  {/* 2. Conformal Set C(X) */}
                  <div className="p-2.5 rounded bg-white/80 border border-slate-200 space-y-1 text-xs">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase block flex items-center">
                      <Layers className="w-3 h-3 mr-1 text-teal-600" />
                      2. Conformal Set C(X)
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {response.conformal.prediction_set.map((c) => (
                        <span
                          key={c}
                          className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-slate-100 text-slate-800 border border-slate-300"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 3. Safety Policy Action */}
                  <div className="p-2.5 rounded bg-white/80 border border-slate-200 space-y-1 text-xs">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase block flex items-center">
                      {response.safety_policy.abstained ? (
                        <ShieldAlert className="w-3 h-3 mr-1 text-purple-700" />
                      ) : (
                        <ShieldCheck className="w-3 h-3 mr-1 text-emerald-600" />
                      )}
                      3. Safety Guardrail
                    </span>
                    <span
                      className={`text-[11px] font-bold block ${
                        response.safety_policy.abstained ? 'text-purple-900' : 'text-emerald-800'
                      }`}
                    >
                      {response.safety_policy.abstained ? 'POLICY ABSTENTION' : 'CLEARANCE GRANTED'}
                    </span>
                    <p className="text-[10px] text-slate-600 leading-tight">
                      {response.safety_policy.reasons[0]}
                    </p>
                  </div>

                  {/* Workflow Meaning */}
                  <div className="p-2.5 rounded bg-white/80 border border-slate-200 space-y-1 text-xs">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase block">
                      Workflow Action
                    </span>
                    <p className="text-[11px] text-slate-800 leading-snug">
                      {meta.workflowMeaning}
                    </p>
                  </div>
                </div>

                {/* Quick Select Button */}
                <button
                  type="button"
                  onClick={() => {
                    onSelectScenario(scenario)
                    onClose()
                  }}
                  className={`w-full py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center transition-colors shadow-xs ${
                    isUncertain
                      ? 'bg-purple-700 hover:bg-purple-800 text-white'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  <span>Select & Test Case</span>
                  <ArrowRight className="w-3 h-3 ml-1" />
                </button>
              </div>
            )
          })}
        </div>

        {/* Modal Footer Note */}
        <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2 shrink-0">
          <span>
            Notice: Scripted illustrative examples. Conformal coverage 1 - α = 95%. No real patient data used.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 font-semibold text-slate-700 text-xs"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  )
}
