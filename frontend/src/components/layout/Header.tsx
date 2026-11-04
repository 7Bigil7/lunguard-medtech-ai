import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowRight, X, Sparkles, Bell, User, Search } from 'lucide-react'
import { useApp } from '../../context/useApp'

export const Header: React.FC = () => {
  const { mode, recheckBackend } = useApp()
  const location = useLocation()
  const [showAboutModal, setShowAboutModal] = useState(false)
  const [searchVal, setSearchVal] = useState('')

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/workspace', label: 'Analysis' },
    { to: '/evaluation', label: 'Evaluation' },
  ]

  return (
    <>
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 text-slate-800 sticky top-0 z-40 select-none shadow-2xs transition-colors font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Brand Wordmark & Lungs Icon */}
            <div className="flex items-center space-x-3 shrink-0">
              <Link
                to="/"
                className="flex items-center space-x-2.5 group focus:outline-none"
              >
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
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold tracking-tight text-xl text-slate-900">
                    LungGuard
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                    MedTech AI
                  </span>
                </div>
              </Link>
            </div>

            {/* Center Pill Navigation */}
            <nav className="hidden md:flex items-center space-x-1 bg-slate-100/90 p-1 rounded-full border border-slate-200/60" aria-label="Main Navigation">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
              <button
                type="button"
                onClick={() => setShowAboutModal(true)}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-white/80 transition-all cursor-pointer"
              >
                About
              </button>
            </nav>

            {/* Right Status Badge & Profile Utilities */}
            <div className="flex items-center space-x-2.5 shrink-0">
              {/* Quick Search */}
              <div className="relative hidden xl:block">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  placeholder="Search..."
                  className="pl-8 pr-3 py-1.5 text-xs rounded-full bg-slate-100 border border-transparent focus:border-slate-300 focus:bg-white text-slate-800 placeholder-slate-400 w-36 focus:outline-none transition-all"
                />
              </div>

              {/* Backend Status Pill */}
              {mode === 'live' ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse" />
                  Live Model Connected
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => recheckBackend()}
                  title="Backend is offline. Click to recheck."
                  className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5" />
                  Backend Offline
                </button>
              )}

              {/* Notifications */}
              <button
                type="button"
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
              </button>

              {/* Profile Avatar */}
              <button
                type="button"
                className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-300 transition-colors cursor-pointer"
                title="Profile"
              >
                <User className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mobile Navigation bar */}
          <div className="md:hidden flex items-center space-x-1 py-2 border-t border-slate-200 overflow-x-auto">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                    isActive ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
            <button
              type="button"
              onClick={() => setShowAboutModal(true)}
              className="px-3 py-1 rounded-full text-xs font-semibold text-slate-600 whitespace-nowrap"
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
        >
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl text-slate-700 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white">
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
                  <h3 className="text-lg font-extrabold text-slate-900">About LungGuard</h3>
                  <p className="text-xs text-slate-500">Uncertainty-Aware CXR Triage Platform</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAboutModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <p>
                <strong>LungGuard</strong> is an uncertainty-aware chest radiograph triage platform. It tackles diagnostic anchoring between Tuberculosis and Pulmonary Malignancy on plain chest radiographs.
              </p>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-slate-900">
                <div className="font-bold flex items-center space-x-1.5 text-xs text-slate-800 uppercase tracking-wide">
                  <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                  <span>Key Innovation</span>
                </div>
                <p className="text-xs text-slate-700">
                  Instead of forcing overconfident point classifications, LungGuard produces <strong>Conformal Prediction Sets</strong> with statistical coverage guarantees and enforces a deterministic <strong>TrustGuard Safety Firewall</strong> that abstains when findings are ambiguous.
                </p>
              </div>
              <p className="text-xs text-slate-500">
                ⚠️ <strong>Clinical Notice:</strong> This software is a research prototype, not a CDSCO/FDA cleared medical device. No real clinical decisions should be made with this software.
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowAboutModal(false)}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors cursor-pointer"
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
