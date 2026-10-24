import React, { useState } from 'react'
import { Printer, Copy, Check, AlertOctagon, FileCheck, Stethoscope } from 'lucide-react'
import type { AnalysisResponse } from '../../types/api'

interface CaseSummaryPanelProps {
  response: AnalysisResponse
  caseLabel?: string
}

export const CaseSummaryPanel: React.FC<CaseSummaryPanelProps> = ({ response, caseLabel }) => {
  const [copied, setCopied] = useState(false)

  const getClinicalNextSteps = () => {
    switch (response.triage) {
      case 'NORMAL':
        return 'Correlate with clinical presentation and history. No routine radiological escalation suggested by model; clinician discretion determines further follow-up if symptoms persist.'
      case 'TB_CONSISTENT':
        return 'Clinician review and appropriate confirmatory investigation are recommended. Assess history, symptoms, and standard microbiological protocols per local health guidelines.'
      case 'MALIGNANCY_SUSPICIOUS':
        return 'Prompt clinician review and appropriate diagnostic investigation are recommended. Multi-disciplinary assessment and further clinical evaluation advised.'
      case 'UNCERTAIN_DUAL_RISK':
      default:
        return 'Clinician review and comprehensive differential evaluation are recommended. The safety policy abstained due to ambiguity between infectious and neoplastic features. Do not anchor on a single presumptive diagnosis.'
    }
  }

  const handleCopySummary = () => {
    const text = `LUNGUARD CHEST X-RAY DECISION SUPPORT SUMMARY
${response.simulated ? '[SIMULATED DEMO RESULT - SCRIPTED PROTOTYPE EXAMPLE]\n' : ''}
Case ID: ${response.case_id}
Timestamp: ${response.timestamp}
Session Label: ${caseLabel || 'None'}
Pipeline Mode: ${response.mode.toUpperCase()}

TRIAGE OUTCOME: ${response.triage}
Next Steps: ${getClinicalNextSteps()}

MODEL OUTPUT SCORES (Raw, Uncalibrated):
- Normal: ${response.model.scores.normal.toFixed(3)}
- TB-Consistent: ${response.model.scores.tb_consistent.toFixed(3)}
- Malignancy-Suspicious: ${response.model.scores.malignancy_suspicious.toFixed(3)}

CONFORMAL PREDICTION SET: {${response.conformal.prediction_set.join(', ')}}
Target Coverage: ${response.conformal.target_coverage ? (response.conformal.target_coverage * 100) + '%' : 'N/A'}

SAFETY POLICY DECISION:
- Abstained: ${response.safety_policy.abstained ? 'YES' : 'NO'}
- Policy Rules: ${response.safety_policy.triggered_rules.join(', ')}

LIMITATIONS:
${response.limitations.map((l) => `- ${l}`).join('\n')}

SAFETY NOTICE:
Lunguard is a research prototype intended to demonstrate uncertainty-aware chest X-ray decision support. It is not a substitute for professional medical assessment, radiological interpretation, or appropriate diagnostic testing. Outputs require clinical review and must not independently determine treatment.`

    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-5 print-full-width">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <FileCheck className="w-5 h-5 text-teal-600" />
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Clinical Case Summary & Guidance
            </h3>
          </div>
          <div className="flex items-center space-x-2 text-xs text-slate-500 mt-0.5">
            <span>Case ID: <strong className="text-slate-800 font-mono">{response.case_id}</strong></span>
            <span>•</span>
            <span>Recorded: {new Date(response.timestamp).toLocaleString()}</span>
          </div>
        </div>

        {/* Export / Print Buttons */}
        <div className="flex items-center space-x-2 no-print">
          <button
            type="button"
            onClick={handleCopySummary}
            className="inline-flex items-center px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors shadow-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 mr-1.5 text-slate-500" />}
            {copied ? 'Summary Copied' : 'Copy Summary'}
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
            Print Report
          </button>
        </div>
      </div>

      {/* Recommended Next Steps (Non-prescriptive) */}
      <div className="p-4 rounded-lg bg-teal-50/70 border border-teal-200 space-y-1.5">
        <div className="flex items-center space-x-2 text-teal-900 font-bold text-xs uppercase tracking-wider">
          <Stethoscope className="w-4 h-4 text-teal-700" />
          <span>Recommended Next Action (Clinical Deferral)</span>
        </div>
        <p className="text-xs sm:text-sm text-teal-950 leading-relaxed font-medium">
          {getClinicalNextSteps()}
        </p>
      </div>

      {/* Limitations Section */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center">
          <AlertOctagon className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
          Limitations of this Result
        </span>
        <ul className="space-y-1.5 text-xs text-slate-600 pl-1">
          {response.limitations.map((lim, idx) => (
            <li key={idx} className="flex items-start space-x-2">
              <span className="text-slate-400 font-bold">•</span>
              <span>{lim}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Print-only watermark header */}
      <div className="hidden print-only text-xs border-t border-slate-300 pt-3 mt-4 text-slate-500">
        <p><strong>LUNGUARD Prototype Report:</strong> DEXATHON 2026 Research Prototype. Generated for case timestamp {response.timestamp}.</p>
        <p>This report is for decision-support prototype demonstration only and does not constitute a diagnostic medical device record.</p>
      </div>
    </div>
  )
}
