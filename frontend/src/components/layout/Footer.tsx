import { AlertCircle, Mail } from 'lucide-react'
import { LungIcon } from '../common/LungIcon'

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs py-10 mt-auto select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Main Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand & Tagline */}
          <div className="flex items-center space-x-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-cyan-500/30 flex items-center justify-center shrink-0">
              <LungIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold tracking-tight text-base text-white font-sans">
                  LUNGUARD
                </span>
                <span className="text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.2 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700">
                  CXR TRIAGE
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                Uncertainty-Aware Clinical Decision Support
              </div>
            </div>
          </div>

          {/* Development Team Attribution */}
          <div className="text-center space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">
              DEXATHON 2026 PROTOTYPE DEVELOPMENT TEAM
            </span>
            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs font-semibold text-slate-200">
              <span>Bharath</span>
              <span className="text-cyan-500 font-bold">•</span>
              <span>Vivek</span>
              <span className="text-cyan-500 font-bold">•</span>
              <span>Harshitha</span>
              <span className="text-cyan-500 font-bold">•</span>
              <span>Ananya</span>
              <span className="text-cyan-500 font-bold">•</span>
              <span>Srishant</span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center space-x-2">
            <a
              href="https://github.com/7Bigil7/lunguard-medtech-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
            >
              <svg className="w-3.5 h-3.5 mr-1.5 text-slate-300 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              GitHub
            </a>

            <a
              href="https://github.com/7Bigil7/lunguard-medtech-ai/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
            >
              <AlertCircle className="w-3.5 h-3.5 mr-1.5 text-slate-300" />
              Report Issue
            </a>

            <a
              href="mailto:vbharath091@gmail.com"
              className="inline-flex items-center px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
            >
              <Mail className="w-3.5 h-3.5 mr-1.5 text-slate-300" />
              Contact
            </a>
          </div>
        </div>

        {/* Bottom Legal & Timestamp Row */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <div>
            © 2026 Lunguard. Research prototype for DEXATHON 2026.
          </div>

          <div className="flex items-center space-x-4">
            <span className="hover:text-slate-300 cursor-pointer">Privacy</span>
            <span>|</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms</span>
            <span>|</span>
            <span className="hover:text-slate-300 cursor-pointer">Disclaimer</span>
            <span>|</span>
            <span className="text-slate-400 font-mono">Last updated: Oct 28, 2026</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
