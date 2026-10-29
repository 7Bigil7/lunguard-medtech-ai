import React from 'react'
import {
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  ShieldAlert,
  FlaskConical,
} from 'lucide-react'
import type { TriageOutcome } from '../../types/api'

interface TriageBannerProps {
  triage: TriageOutcome
  isSimulated: boolean
}

export const TriageBanner: React.FC<TriageBannerProps> = ({ triage, isSimulated }) => {
  switch (triage) {
    case 'NORMAL':
      return (
        <div
          role="region"
          aria-label="Triage Result: Normal"
          className="p-6 rounded-xl border-2 border-emerald-500 bg-emerald-50 text-emerald-950 shadow-sm"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-emerald-200">
            <div className="flex items-center space-x-2.5">
              <span className="p-1.5 rounded-lg bg-emerald-600 text-white">
                <CheckCircle2 className="w-6 h-6" />
              </span>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block">
                  Triage Classification
                </span>
                <h2 className="text-xl font-bold tracking-tight text-emerald-950">
                  NORMAL
                </h2>
              </div>
            </div>

            {isSimulated && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950 border border-amber-500 shadow-sm">
                <FlaskConical className="w-3.5 h-3.5 mr-1" />
                SIMULATED RESULT
              </span>
            )}
          </div>

          <p className="mt-3 text-sm text-emerald-900 leading-relaxed font-medium">
            No significant abnormality identified by the model. This result does not exclude disease and must be interpreted alongside clinical findings.
          </p>

          <div className="mt-3.5 pt-3 border-t border-emerald-200/80 text-xs">
            <span className="font-bold text-emerald-950 block">What this outcome means:</span>
            <p className="text-emerald-900 mt-0.5 leading-relaxed">
              Routine clinical correlation. No urgent algorithmic escalation is flagged; the patient continues along standard routine clinical evaluation based on physician judgment, without prescription of specific tests or treatments.
            </p>
          </div>
        </div>
      )

    case 'TB_CONSISTENT':
      return (
        <div
          role="region"
          aria-label="Triage Result: TB-Consistent"
          className="p-6 rounded-xl border-2 border-amber-500 bg-amber-50 text-amber-950 shadow-sm"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-amber-200">
            <div className="flex items-center space-x-2.5">
              <span className="p-1.5 rounded-lg bg-amber-600 text-white">
                <AlertTriangle className="w-6 h-6" />
              </span>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 block">
                  Triage Classification
                </span>
                <h2 className="text-xl font-bold tracking-tight text-amber-950">
                  TB-CONSISTENT
                </h2>
              </div>
            </div>

            {isSimulated && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950 border border-amber-500 shadow-sm">
                <FlaskConical className="w-3.5 h-3.5 mr-1" />
                SIMULATED RESULT
              </span>
            )}
          </div>

          <p className="mt-3 text-sm text-amber-900 leading-relaxed font-medium">
            Findings may be consistent with tuberculosis. Clinical assessment and appropriate confirmatory testing are required.
          </p>

          <div className="mt-3.5 pt-3 border-t border-amber-200/80 text-xs">
            <span className="font-bold text-amber-950 block">What this outcome means:</span>
            <p className="text-amber-900 mt-0.5 leading-relaxed">
              Elevated risk workflow. Clinician is prompted to prioritize review of infectious symptoms and initiate facility infection-control protocols and clinical correlation, without prescribing specific diagnostic regimens.
            </p>
          </div>
        </div>
      )

    case 'MALIGNANCY_SUSPICIOUS':
      return (
        <div
          role="region"
          aria-label="Triage Result: Malignancy-Suspicious"
          className="p-6 rounded-xl border-2 border-rose-500 bg-rose-50 text-rose-950 shadow-sm"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-rose-200">
            <div className="flex items-center space-x-2.5">
              <span className="p-1.5 rounded-lg bg-rose-600 text-white">
                <AlertOctagon className="w-6 h-6" />
              </span>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-rose-800 block">
                  Triage Classification
                </span>
                <h2 className="text-xl font-bold tracking-tight text-rose-950">
                  MALIGNANCY-SUSPICIOUS
                </h2>
              </div>
            </div>

            {isSimulated && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950 border border-amber-500 shadow-sm">
                <FlaskConical className="w-3.5 h-3.5 mr-1" />
                SIMULATED RESULT
              </span>
            )}
          </div>

          <p className="mt-3 text-sm text-rose-900 leading-relaxed font-medium">
            Findings warrant further evaluation for possible malignancy. Prompt clinician review and appropriate diagnostic investigation are recommended.
          </p>

          <div className="mt-3.5 pt-3 border-t border-rose-200/80 text-xs">
            <span className="font-bold text-rose-950 block">What this outcome means:</span>
            <p className="text-rose-900 mt-0.5 leading-relaxed">
              High-risk escalation workflow. Clinician is prompted to expedite senior thoracic/radiological review to prevent diagnostic delay for suspicious solitary lesions or masses, without prescribing specific oncology regimens.
            </p>
          </div>
        </div>
      )

    case 'UNCERTAIN_DUAL_RISK':
    default:
      return (
        <div
          role="region"
          aria-label="Triage Result: Uncertain / Dual-Risk"
          className="p-6 rounded-xl border-2 border-purple-600 bg-purple-50 text-purple-950 shadow-md ring-1 ring-purple-400/50"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-purple-200">
            <div className="flex items-center space-x-2.5">
              <span className="p-1.5 rounded-lg bg-purple-700 text-white">
                <ShieldAlert className="w-6 h-6 text-purple-100" />
              </span>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-800 block">
                  Safety Escalation — High Uncertainty
                </span>
                <h2 className="text-xl font-extrabold tracking-tight text-purple-950">
                  UNCERTAIN / DUAL-RISK — FURTHER CLINICAL EVALUATION REQUIRED.
                </h2>
              </div>
            </div>

            {isSimulated && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950 border border-amber-500 shadow-sm">
                <FlaskConical className="w-3.5 h-3.5 mr-1" />
                SIMULATED RESULT
              </span>
            )}
          </div>

          <p className="mt-3 text-sm text-purple-950 leading-relaxed font-medium">
            The model has not produced a sufficiently reliable classification under the configured safety policy. Review the prediction set and clinical context before determining the appropriate next steps.
          </p>

          <div className="mt-3.5 pt-3 border-t border-purple-200/80 text-xs">
            <span className="font-bold text-purple-950 block">What this outcome means:</span>
            <p className="text-purple-900 mt-0.5 leading-relaxed">
              Safety abstention workflow. The model explicitly withholds a unilateral classification because confident distinction is not statistically supported. The clinician is prompted to review full clinical history without premature diagnostic anchoring.
            </p>
          </div>
        </div>
      )
  }
}
