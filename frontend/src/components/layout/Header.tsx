import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ShieldCheck, Activity, AlertCircle, RefreshCw, FlaskConical } from 'lucide-react'
import { useApp } from '../../context/useApp'

export const Header: React.FC = () => {
  const { mode, enterDemoMode, exitDemoMode, recheckBackend, isCheckingHealth } = useApp()
  const location = useLocation()

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/workspace', label: 'Analysis Workspace' },
    { to: '/safety-engine', label: 'Safety Engine' },
    { to: '/evaluation', label: 'Evaluation' },
  ]

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Wordmark */}
          <div className="flex items-center space-x-3">
            <Link
              to="/"
              className="flex items-center space-x-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 rounded-md"
            >
              <div className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center text-white shadow-sm group-hover:bg-teal-500 transition-colors">
                <ShieldCheck className="w-5 h-5 text-teal-100" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold tracking-tight text-lg text-white font-sans">LUNGUARD</span>
                  <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-teal-300 border border-slate-700">
                    CXR Triage
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 leading-none">Uncertainty-Aware Clinical Decision Support</div>
              </div>
            </Link>
          </div>

          {/* Nav links */}
          <nav className="hidden md:flex items-center space-x-1" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-800 text-teal-300 border border-slate-700'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Right Mode Indicators & Controls */}
          <div className="flex items-center space-x-3">
            {/* Status Badge */}
            {mode === 'checking' && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin text-teal-400" />
                Checking backend...
              </span>
            )}

            {mode === 'live' && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-950/80 text-teal-300 border border-teal-700">
                <Activity className="w-3.5 h-3.5 mr-1.5 text-teal-400" />
                LIVE INFERENCE
              </span>
            )}

            {mode === 'backend-unavailable' && (
              <div className="flex items-center space-x-2">
                <span
                  title="FastAPI backend is offline. Enter demo mode to evaluate simulated inference."
                  className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700"
                >
                  <AlertCircle className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
                  Backend Offline
                </span>
                <button
                  onClick={enterDemoMode}
                  className="text-xs px-2.5 py-1 rounded bg-teal-600 hover:bg-teal-500 text-white font-medium transition-colors flex items-center shadow-sm"
                >
                  <FlaskConical className="w-3 h-3 mr-1" />
                  Enter Simulated Demo Mode
                </button>
                <button
                  onClick={() => recheckBackend()}
                  disabled={isCheckingHealth}
                  title="Retry backend connection"
                  className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  aria-label="Retry connection to backend"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isCheckingHealth ? 'animate-spin' : ''}`} />
                </button>
              </div>
            )}

            {mode === 'demo' && (
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950 border border-amber-300 shadow-sm">
                  <FlaskConical className="w-3.5 h-3.5 mr-1 text-slate-950" />
                  SIMULATED DEMO
                </span>
                <button
                  onClick={exitDemoMode}
                  className="text-xs px-2 py-1 rounded border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  Exit Demo
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center space-x-1 py-2 border-t border-slate-800 overflow-x-auto">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`px-2.5 py-1 rounded text-xs font-medium whitespace-nowrap ${
                  isActive ? 'bg-slate-800 text-teal-300' : 'text-slate-300'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </div>
      </div>
    </header>
  )
}
