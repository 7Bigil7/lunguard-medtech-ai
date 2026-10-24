import React from 'react'
import { ShieldAlert, Cpu } from 'lucide-react'

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Safety Disclaimer Callout */}
        <div className="p-4 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300 flex items-start space-x-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] block">
              Clinical & Regulatory Disclaimer
            </span>
            <p className="text-xs leading-relaxed text-slate-300">
              Lunguard is a research prototype intended to demonstrate uncertainty-aware chest X-ray decision support.
              It is not a substitute for professional medical assessment, radiological interpretation, or appropriate
              diagnostic testing. Outputs require clinical review and must not independently determine treatment.
            </p>
          </div>
        </div>

        {/* Prototype & Team attribution */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800 text-slate-400">
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-teal-400" />
            <span className="font-medium text-slate-300">
              DEXATHON 2026 research prototype — Round 2 Software Submission
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-slate-400">
              <strong className="text-slate-300 font-medium">Team:</strong> Bharath, Vivek, Harshitha, Ananya
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-500 text-[11px]">Submission deadline: October 28, 2026</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
