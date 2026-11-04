import React from 'react'
import { AlertCircle, Mail } from 'lucide-react'

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200/80 text-slate-500 text-xs py-10 mt-auto select-none transition-colors font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Main Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand & Tagline */}
          <div className="flex items-center space-x-3 text-left">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold shadow-xs">
              <svg
                className="w-5 h-5 text-teal-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 4v16" />
                <path d="M6 8a4 4 0 0 0-4 4v2a6 6 0 0 0 6 6h1a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H8a4 4 0 0 0-2 4Z" />
                <path d="M18 8a4 4 0 0 1 4 4v2a6 6 0 0 1-6 6h-1a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h1a4 4 0 0 1 2 4Z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold tracking-tight text-base text-slate-900">
                  LungGuard
                </span>
                <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  CXR Triage
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
              CLINICAL MEDTECH AI DEVELOPMENT TEAM
            </span>
            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs font-semibold text-slate-700">
              <span>Bharath</span>
              <span className="text-slate-300 font-bold">•</span>
              <span>Vivek</span>
              <span className="text-slate-300 font-bold">•</span>
              <span>Harshitha</span>
              <span className="text-slate-300 font-bold">•</span>
              <span>Ananya</span>
              <span className="text-slate-300 font-bold">•</span>
              <span>Srishant</span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center space-x-2">
            <a
              href="https://github.com/7Bigil7/lunguard-medtech-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold transition-colors shadow-2xs"
            >
              <svg className="w-3.5 h-3.5 mr-1.5 text-slate-600 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              GitHub
            </a>

            <a
              href="mailto:contact@lunguard.ai"
              className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold transition-colors shadow-2xs"
            >
              <Mail className="w-3.5 h-3.5 mr-1.5 text-slate-600" />
              Contact
            </a>
          </div>
        </div>

        {/* Regulatory Disclaimer Warning */}
        <div className="pt-4 border-t border-slate-100">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-600 flex items-start space-x-3">
            <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5 text-[11px] leading-relaxed">
              <span className="font-bold text-slate-800 block">
                Research Prototype • Not a Certified Medical Device
              </span>
              <p className="text-slate-500">
                LungGuard is an experimental research system developed exclusively for the DEXATHON 2026 hackathon. It has not received regulatory clearance or approval from CDSCO, the US FDA, or European CE mark authorities. All visual heatmaps, prediction sets, and model classifications are for academic demonstration purposes only.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Version */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 pt-1 gap-2">
          <div>
            © 2026 LungGuard Team • All rights reserved. Built for DEXATHON 2K26.
          </div>
          <div className="flex items-center space-x-3 font-mono text-[10px]">
            <span>Version: 2.0.0-clinical</span>
            <span>•</span>
            <span className="text-slate-600 font-semibold">Engine: TrustGuard-v2.0</span>
            <span>•</span>
            <span>Client: React 19 + Three.js</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
