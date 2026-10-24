import React from 'react'
import { Shield, ShieldAlert, CheckCircle, FileText } from 'lucide-react'
import type { SafetyPolicyResult } from '../../types/api'

interface SafetyPolicyPanelProps {
  policy: SafetyPolicyResult
}

export const SafetyPolicyPanel: React.FC<SafetyPolicyPanelProps> = ({ policy }) => {
  const { version, abstained, triggered_rules, reasons } = policy

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-teal-600" />
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Safety-Policy Decision Panel
            </h3>
            <p className="text-xs text-slate-500">Configured Policy Engine: {version}</p>
          </div>
        </div>

        <div>
          {abstained ? (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-900 border border-purple-300">
              <ShieldAlert className="w-3.5 h-3.5 mr-1 text-purple-700" />
              Safety Policy Abstained
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300">
              <CheckCircle className="w-3.5 h-3.5 mr-1 text-emerald-600" />
              Clearance Granted
            </span>
          )}
        </div>
      </div>

      {/* Triggered Rules & Explanations */}
      <div className="space-y-3">
        <div>
          <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1.5">
            Triggered Safety Rules
          </span>
          <div className="flex flex-wrap gap-1.5">
            {triggered_rules.length === 0 ? (
              <span className="text-xs text-slate-500 italic">No restriction rules triggered</span>
            ) : (
              triggered_rules.map((rule) => (
                <span
                  key={rule}
                  className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200"
                >
                  {rule}
                </span>
              ))
            )}
          </div>
        </div>

        <div>
          <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1.5">
            Policy Decision Rationale
          </span>
          <ul className="space-y-1.5 text-xs text-slate-700">
            {reasons.map((reason, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <FileText className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
        <p>
          <strong>Policy Role:</strong> The safety policy acts as a deterministic firewall. Even if raw neural network logits suggest a dominant class, the safety engine enforces mandatory escalation whenever conformal ambiguity or clinically catastrophic miss scenarios are encountered.
        </p>
      </div>
    </div>
  )
}
