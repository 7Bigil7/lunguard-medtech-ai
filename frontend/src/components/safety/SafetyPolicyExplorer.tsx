import React, { useState, useMemo } from 'react'
import {
  Sliders,
  ShieldCheck,
  ShieldAlert,
  CheckCircle,
  FlaskConical,
  Code2,
  RefreshCw,
} from 'lucide-react'
import { evaluateSafetyPolicy, SAFETY_POLICY_VERSION } from '../../lib/safetyPolicy'
import type { PredictionClass, ModelOutputScores, TriageOutcome } from '../../types/api'

export const SafetyPolicyExplorer: React.FC = () => {
  // 1. Simulated Inputs: Prediction Set
  const [predictionSet, setPredictionSet] = useState<PredictionClass[]>([
    'tb_consistent',
    'malignancy_suspicious',
  ])

  // 2. Simulated Inputs: Model Scores
  const [scores, setScores] = useState<ModelOutputScores>({
    normal: 0.08,
    tb_consistent: 0.74,
    malignancy_suspicious: 0.71,
  })

  // 3. Simulated Inputs: Policy Configuration Threshold
  const [malignancyThreshold, setMalignancyThreshold] = useState<number>(0.5)

  // 4. Policy Execution: Real pure TypeScript function applied live to simulated inputs
  const policyResult = useMemo(() => {
    return evaluateSafetyPolicy(predictionSet, scores, {
      version: SAFETY_POLICY_VERSION,
      malignancyEscalationScoreThreshold: malignancyThreshold,
    })
  }, [predictionSet, scores, malignancyThreshold])

  const toggleClass = (cls: PredictionClass) => {
    setPredictionSet((prev) =>
      prev.includes(cls) ? prev.filter((c) => c !== cls) : [...prev, cls]
    )
  }

  const applyPreset = (
    newSet: PredictionClass[],
    newScores: ModelOutputScores,
    newThreshold = 0.5
  ) => {
    setPredictionSet(newSet)
    setScores(newScores)
    setMalignancyThreshold(newThreshold)
  }

  const getTriageTheme = (triage: TriageOutcome) => {
    switch (triage) {
      case 'NORMAL':
        return {
          border: 'border-emerald-500',
          bg: 'bg-emerald-50 text-emerald-950',
          badge: 'bg-emerald-600 text-white',
        }
      case 'TB_CONSISTENT':
        return {
          border: 'border-amber-500',
          bg: 'bg-amber-50 text-amber-950',
          badge: 'bg-amber-600 text-white',
        }
      case 'MALIGNANCY_SUSPICIOUS':
        return {
          border: 'border-rose-500',
          bg: 'bg-rose-50 text-rose-950',
          badge: 'bg-rose-600 text-white',
        }
      case 'UNCERTAIN_DUAL_RISK':
      default:
        return {
          border: 'border-purple-600',
          bg: 'bg-purple-50 text-purple-950 ring-2 ring-purple-400/50',
          badge: 'bg-purple-700 text-white',
        }
    }
  }

  const theme = getTriageTheme(policyResult.triage)

  return (
    <section
      aria-labelledby="explorer-heading"
      className="bg-white border-2 border-slate-300 rounded-2xl p-6 sm:p-8 shadow-md space-y-6"
    >
      {/* Explorer Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1 rounded bg-teal-600 text-white">
              <Sliders className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
              Interactive Demonstration Widget
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-400 text-slate-950">
              SIMULATED INPUTS → REAL CODE
            </span>
          </div>
          <h2 id="explorer-heading" className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Safety Policy Explorer
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Adjust simulated scores or toggle conformal prediction set membership to observe the real policy code dynamically recomputing triage decisions and safety abstention guardrails.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            applyPreset(
              ['tb_consistent', 'malignancy_suspicious'],
              { normal: 0.08, tb_consistent: 0.74, malignancy_suspicious: 0.71 },
              0.5
            )
          }
          className="inline-flex items-center px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-xs font-semibold text-slate-700 shrink-0 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
          Reset to Dual-Risk
        </button>
      </div>

      {/* Preset Quick Buttons */}
      <div className="space-y-1.5">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
          Preset Demonstrator Scenarios:
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() =>
              applyPreset(
                ['tb_consistent', 'malignancy_suspicious'],
                { normal: 0.08, tb_consistent: 0.74, malignancy_suspicious: 0.71 },
                0.5
              )
            }
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-100 hover:bg-purple-200 text-purple-900 border border-purple-300 transition-colors shadow-xs"
          >
            1. Dual-Risk Overlap (Abstains)
          </button>
          <button
            type="button"
            onClick={() =>
              applyPreset([], { normal: 0.1, tb_consistent: 0.15, malignancy_suspicious: 0.12 }, 0.5)
            }
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-100 hover:bg-purple-200 text-purple-900 border border-purple-300 transition-colors shadow-xs"
          >
            2. Empty Set / Out-of-Distribution (Abstains)
          </button>
          <button
            type="button"
            onClick={() =>
              applyPreset(
                ['malignancy_suspicious'],
                { normal: 0.03, tb_consistent: 0.05, malignancy_suspicious: 0.92 },
                0.5
              )
            }
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-100 hover:bg-rose-200 text-rose-900 border border-rose-300 transition-colors shadow-xs"
          >
            3. Malignancy Only (Escalates)
          </button>
          <button
            type="button"
            onClick={() =>
              applyPreset(
                ['tb_consistent'],
                { normal: 0.07, tb_consistent: 0.89, malignancy_suspicious: 0.04 },
                0.5
              )
            }
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 transition-colors shadow-xs"
          >
            4. Single TB (Infectious Risk)
          </button>
          <button
            type="button"
            onClick={() =>
              applyPreset(['normal'], { normal: 0.94, tb_consistent: 0.04, malignancy_suspicious: 0.02 }, 0.5)
            }
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 transition-colors shadow-xs"
          >
            5. Clean Normal (Clearance)
          </button>
        </div>
      </div>

      {/* Main Interactive Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-2">
        {/* LEFT COLUMN: SIMULATED INPUTS */}
        <div className="space-y-6 p-5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <span className="font-extrabold text-xs uppercase tracking-wider text-slate-700 flex items-center">
              <FlaskConical className="w-4 h-4 mr-1.5 text-amber-600" />
              Simulated inputs (Presenter Controls)
            </span>
            <span className="text-[11px] text-slate-500 font-mono">Simulated Test Case</span>
          </div>

          {/* Toggle Prediction Set Membership */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wide block">
              Conformal Prediction Set Membership C(X):
            </label>
            <p className="text-[11px] text-slate-500 leading-tight">
              Toggle which classes conform at target coverage (1 - α = 95%). Multiple checked classes represent statistical ambiguity.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {[
                { id: 'normal' as PredictionClass, label: 'normal' },
                { id: 'tb_consistent' as PredictionClass, label: 'tb_consistent' },
                { id: 'malignancy_suspicious' as PredictionClass, label: 'malignancy_suspicious' },
              ].map(({ id, label }) => {
                const checked = predictionSet.includes(id)
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => toggleClass(id)}
                    className={`px-3 py-2 rounded-lg text-xs font-mono font-bold border transition-all flex items-center space-x-2 ${
                      checked
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <span
                      className={`w-3.5 h-3.5 rounded flex items-center justify-center border text-[10px] ${
                        checked ? 'bg-teal-500 border-teal-500 text-slate-950 font-bold' : 'border-slate-400'
                      }`}
                    >
                      {checked && '✓'}
                    </span>
                    <span>{label}</span>
                  </button>
                )
              })}
            </div>
            <div className="font-mono text-xs text-slate-700 bg-white p-2 rounded border border-slate-200">
              Current C(X) = {'{'}
              {predictionSet.length > 0 ? predictionSet.join(', ') : '∅ (Empty Set)'}
              {'}'}
            </div>
          </div>

          {/* Sliders: Model Scores */}
          <div className="space-y-3 pt-2">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wide block">
              Simulated Model Output Scores (Logit Activations):
            </label>

            <div className="space-y-3 bg-white p-3.5 rounded-lg border border-slate-200 text-xs">
              {/* Normal Score */}
              <div className="space-y-1">
                <div className="flex justify-between font-mono">
                  <span className="font-semibold text-slate-700">Normal Score:</span>
                  <span className="font-bold text-slate-900">{scores.normal.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={scores.normal}
                  onChange={(e) =>
                    setScores((s) => ({ ...s, normal: parseFloat(e.target.value) }))
                  }
                  className="w-full accent-teal-600 cursor-pointer"
                />
              </div>

              {/* TB Score */}
              <div className="space-y-1">
                <div className="flex justify-between font-mono">
                  <span className="font-semibold text-slate-700">TB-Consistent Score:</span>
                  <span className="font-bold text-slate-900">{scores.tb_consistent.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={scores.tb_consistent}
                  onChange={(e) =>
                    setScores((s) => ({ ...s, tb_consistent: parseFloat(e.target.value) }))
                  }
                  className="w-full accent-amber-600 cursor-pointer"
                />
              </div>

              {/* Malignancy Score */}
              <div className="space-y-1">
                <div className="flex justify-between font-mono">
                  <span className="font-semibold text-slate-700">Malignancy-Suspicious Score:</span>
                  <span className="font-bold text-slate-900">{scores.malignancy_suspicious.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={scores.malignancy_suspicious}
                  onChange={(e) =>
                    setScores((s) => ({ ...s, malignancy_suspicious: parseFloat(e.target.value) }))
                  }
                  className="w-full accent-rose-600 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Configurable Threshold: Malignancy Override */}
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="font-bold text-slate-800">Malignancy Safety Override Threshold:</span>
              <span className="font-bold text-purple-700">{malignancyThreshold.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="0.8"
              step="0.05"
              value={malignancyThreshold}
              onChange={(e) => setMalignancyThreshold(parseFloat(e.target.value))}
              className="w-full accent-purple-600 cursor-pointer"
            />
            <p className="text-[10px] text-slate-500">
              If simulated malignancy score exceeds this boundary, policy forces abstention regardless of prediction set.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: POLICY LOGIC (REAL CODE EXECUTION) */}
        <div className="space-y-6 p-5 rounded-xl bg-slate-900 text-white flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="font-extrabold text-xs uppercase tracking-wider text-teal-400 flex items-center">
                <ShieldCheck className="w-4 h-4 mr-1.5" />
                Policy logic (actual code, applied to simulated inputs)
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                src/lib/safetyPolicy.ts ({policyResult.policyVersion})
              </span>
            </div>

            {/* Live Computed Triage Banner */}
            <div className={`p-4 rounded-xl border-2 ${theme.border} ${theme.bg} space-y-2 transition-all`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-700">
                  Computed Triage Output
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${theme.badge}`}>
                  {policyResult.triage}
                </span>
              </div>

              <div className="text-base sm:text-lg font-extrabold tracking-tight">
                {policyResult.triage === 'UNCERTAIN_DUAL_RISK'
                  ? 'UNCERTAIN / DUAL-RISK — FURTHER CLINICAL EVALUATION REQUIRED.'
                  : policyResult.triage}
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex items-center space-x-2 text-xs">
                {policyResult.abstained ? (
                  <span className="inline-flex items-center font-bold text-purple-900">
                    <ShieldAlert className="w-4 h-4 mr-1 text-purple-700 shrink-0" />
                    POLICY ABSTAINED (Decision Withheld for Clinician Review)
                  </span>
                ) : (
                  <span className="inline-flex items-center font-bold text-emerald-900">
                    <CheckCircle className="w-4 h-4 mr-1 text-emerald-600 shrink-0" />
                    CLEARANCE GRANTED (Automated Classification Permitted)
                  </span>
                )}
              </div>
            </div>

            {/* Triggered Rules list */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                Triggered Safety Rules ({policyResult.triggeredRules.length}):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {policyResult.triggeredRules.map((rule) => (
                  <span
                    key={rule}
                    className="font-mono text-xs px-2.5 py-1 rounded bg-slate-800 text-teal-300 border border-slate-700"
                  >
                    {rule}
                  </span>
                ))}
              </div>
            </div>

            {/* Policy Reasons */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                Deterministic Policy Reasoning:
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {policyResult.reasons.map((reason, idx) => (
                  <li key={idx} className="flex items-start space-x-2 bg-slate-800/60 p-2 rounded border border-slate-800">
                    <span className="text-teal-400 font-bold">•</span>
                    <span className="leading-relaxed">{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Code Reference Callout */}
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1 mt-4">
            <div className="flex items-center space-x-1.5 text-teal-300 font-bold font-mono">
              <Code2 className="w-3.5 h-3.5" />
              <span>Direct Function Call: evaluateSafetyPolicy()</span>
            </div>
            <p>
              This evaluation is executed purely on the client side using pure TypeScript logic with zero external API calls.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
