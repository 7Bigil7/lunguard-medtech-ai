import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowRight, X } from 'lucide-react'
import { useApp } from '../../context/useApp'
import { LungIcon } from '../common/LungIcon'

export const Header: React.FC = () => {
  const { mode, enterDemoMode, exitDemoMode, recheckBackend } = useApp()
  const location = useLocation()
  const [showAboutModal, setShowAboutModal] = useState(false)

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/workspace', label: 'Analysis Workspace' },
    { to: '/safety-engine', label: 'Safety Engine' },
    { to: '/evaluation', label: 'Evaluation' },
  ]

  return (
    <>
      <header className="bg-slate-950/95 border-b border-slate-800 text-white sticky top-0 z-40 select-none backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Wordmark & Lungs Icon */}
            <div className="flex items-center space-x-3">
              <Link
                to="/"
                className="flex items-center space-x-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-md"
              >
                <div className="w-9 h-9 rounded-xl bg-slate-900 border border-cyan-500/30 flex items-center justify-center text-white shadow-sm group-hover:border-cyan-400 transition-colors">
                  <LungIcon className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-extrabold tracking-tight text-lg text-white font-sans">
                      LUNGUARD
                    </span>
                    <span className="text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded-full bg-cyan-950/70 text-cyan-300 border border-cyan-600/50">
                      CXR TRIAGE
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 leading-none">
                    Uncertainty-Aware Clinical Decision Support
                  </div>
                </div>
              </Link>
            </div>

            {/* Nav links */}
            <nav className="hidden lg:flex items-center space-x-1" aria-label="Main Navigation">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-cyan-300 font-semibold border-b-2 border-cyan-400 rounded-none'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
              <button
                type="button"
                onClick={() => setShowAboutModal(true)}
                className="px-3 py-1.5 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
              >
                About
              </button>
            </nav>

            {/* Right Status Badge & Primary CTA */}
            <div className="flex items-center space-x-2.5">
              {/* Backend Status Pill */}
              {mode === 'live' ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-600/50">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse" />
                  Live Inference
                </span>
              ) : mode === 'demo' ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-400/90 text-slate-950 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-slate-950 mr-1.5" />
                  Demo Mode
                </span>
              ) : (
                <div className="flex items-center space-x-1.5">
                  <span
                    onClick={() => recheckBackend()}
                    title="FastAPI backend is offline. Click to recheck."
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-900 text-slate-300 border border-slate-700/80 cursor-pointer hover:border-slate-600 transition-colors"
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-400 mr-2" />
                    Backend Offline
                  </span>
                </div>
              )}

              {/* Action Button */}
              {mode === 'demo' ? (
                <button
                  type="button"
                  onClick={exitDemoMode}
                  className="text-xs px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors"
                >
                  Exit Demo
                </button>
              ) : (
                <button
                  type="button"
                  onClick={enterDemoMode}
                  className="text-xs px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all flex items-center shadow-md shadow-cyan-950/40"
                >
                  <span>Enter Simulated Demo Mode</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </button>
              )}
            </div>
          </div>

          {/* Mobile Navigation bar */}
          <div className="lg:hidden flex items-center space-x-1 py-2 border-t border-slate-800/80 overflow-x-auto">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-2.5 py-1 rounded text-xs font-medium whitespace-nowrap ${
                    isActive ? 'bg-slate-800 text-cyan-300' : 'text-slate-300'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
            <button
              type="button"
              onClick={() => setShowAboutModal(true)}
              className="px-2.5 py-1 rounded text-xs font-medium text-slate-300 whitespace-nowrap"
            >
              About
            </button>
          </div>
        </div>
      </header>

      {/* About Modal */}
      {showAboutModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
        >
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <LungIcon className="w-6 h-6" />
                <h3 className="font-bold text-white text-base">About LUNGUARD</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAboutModal(false)}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Close About dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-slate-300">
              <p>
                <strong>LUNGUARD</strong> is an uncertainty-aware chest X-ray decision-support prototype built for <strong>DEXATHON 2026</strong> (Round 2 Prototype Submission).
              </p>
              <p>
                The platform addresses the critical challenge of <strong>diagnostic anchoring</strong> in tuberculosis-endemic regions such as India, where active/healed tuberculosis and pulmonary malignancy frequently present with overlapping radiological patterns.
              </p>
              <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 space-y-1">
                <span className="font-semibold text-white block">Project Team:</span>
                <p>Bharath, Vivek, Harshitha, Ananya, Srishant</p>
              </div>
              <p className="text-[11px] text-slate-400">
                Research Prototype Notice: This software is intended for research demonstration and decision-support exploration only. It is not an approved medical device.
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowAboutModal(false)}
                className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
