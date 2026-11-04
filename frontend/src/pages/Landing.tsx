import React from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Layers,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  AlertOctagon,
} from 'lucide-react'

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f9fbfb] text-slate-900 font-sans selection:bg-cyan-100 relative overflow-x-hidden">
      
      {/* =========================================================================
          BACKGROUND ARTWORK: Delicate Lungs Wireframe, Medical Hex & Flowing Waves
      ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        
        {/* Subtle Ambient Radial Glows */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-gradient-to-b from-cyan-100/35 via-teal-50/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-0 w-[550px] h-[550px] bg-cyan-200/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-0 w-[450px] h-[450px] bg-teal-100/20 rounded-full blur-3xl" />

        {/* Top-Left: Medical Hexagonal Grid & Cross */}
        <svg
          className="absolute top-12 left-6 lg:left-16 w-56 h-56 text-cyan-500/25 transition-opacity"
          viewBox="0 0 240 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main Central Hexagon with Cross */}
          <polygon
            points="120,40 160,63 160,109 120,132 80,109 80,63"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="4 2"
            fill="rgba(6, 182, 212, 0.03)"
          />
          {/* Inner Medical Cross */}
          <path
            d="M120 70 V102 M104 86 H136"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
          />
          {/* Satellite Hexagons */}
          <polygon
            points="70,115 100,132 100,167 70,184 40,167 40,132"
            stroke="currentColor"
            strokeWidth="1.2"
            fill="none"
          />
          <polygon
            points="170,115 200,132 200,167 170,184 140,167 140,132"
            stroke="currentColor"
            strokeWidth="1.2"
            fill="none"
          />
          <polygon
            points="120,140 150,157 150,192 120,209 90,192 90,157"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="2 3"
            fill="none"
          />
          {/* Connecting Nodes & Dots */}
          <circle cx="120" cy="40" r="3" fill="currentColor" />
          <circle cx="160" cy="63" r="3" fill="currentColor" />
          <circle cx="80" cy="63" r="3" fill="currentColor" />
          <circle cx="120" cy="132" r="3" fill="currentColor" />
          <circle cx="70" cy="115" r="2.5" fill="currentColor" />
          <circle cx="170" cy="115" r="2.5" fill="currentColor" />
          <line x1="120" y1="132" x2="120" y2="140" stroke="currentColor" strokeWidth="1" />
          <line x1="80" y1="109" x2="70" y2="115" stroke="currentColor" strokeWidth="1" />
          <line x1="160" y1="109" x2="170" y2="115" stroke="currentColor" strokeWidth="1" />
        </svg>

        {/* Top-Right: Delicate Luminous Lung Illustration (Matching user mockup) */}
        <svg
          className="absolute top-10 right-0 sm:right-6 lg:right-16 w-[340px] sm:w-[420px] lg:w-[480px] h-[520px] text-cyan-500/25"
          viewBox="0 0 500 580"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle Outer Glow & Contours */}
          <g opacity="0.85">
            {/* Trachea */}
            <path
              d="M245 40 L245 150 M255 40 L255 150"
              stroke="currentColor"
              strokeWidth="2.5"
            />
            {/* Tracheal Rings */}
            {[55, 70, 85, 100, 115, 130, 145].map((y) => (
              <line
                key={y}
                x1="244"
                y1={y}
                x2="256"
                y2={y}
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            ))}

            {/* Carina / Main Bifurcation */}
            <path
              d="M245 150 Q235 180 190 220"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M255 150 Q265 180 310 220"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Left Bronchial Tree */}
            <path d="M190 220 Q150 250 120 310" stroke="currentColor" strokeWidth="2" />
            <path d="M190 220 Q180 270 170 340" stroke="currentColor" strokeWidth="2" />
            <path d="M190 220 Q210 260 215 320" stroke="currentColor" strokeWidth="1.5" />
            <path d="M120 310 Q95 350 85 410" stroke="currentColor" strokeWidth="1.2" />
            <path d="M120 310 Q130 360 125 420" stroke="currentColor" strokeWidth="1.2" />
            <path d="M170 340 Q155 390 150 450" stroke="currentColor" strokeWidth="1.2" />
            <path d="M170 340 Q185 390 195 440" stroke="currentColor" strokeWidth="1.2" />
            <path d="M215 320 Q225 370 230 425" stroke="currentColor" strokeWidth="1" />
            {/* Fine left bronchioles */}
            <path d="M85 410 Q70 440 65 470" stroke="currentColor" strokeWidth="0.8" />
            <path d="M85 410 Q100 445 105 475" stroke="currentColor" strokeWidth="0.8" />
            <path d="M125 420 Q120 450 115 480" stroke="currentColor" strokeWidth="0.8" />
            <path d="M150 450 Q145 475 140 500" stroke="currentColor" strokeWidth="0.8" />
            <path d="M195 440 Q205 470 210 495" stroke="currentColor" strokeWidth="0.8" />

            {/* Right Bronchial Tree */}
            <path d="M310 220 Q350 250 380 310" stroke="currentColor" strokeWidth="2" />
            <path d="M310 220 Q320 270 330 340" stroke="currentColor" strokeWidth="2" />
            <path d="M310 220 Q290 260 285 320" stroke="currentColor" strokeWidth="1.5" />
            <path d="M380 310 Q405 350 415 410" stroke="currentColor" strokeWidth="1.2" />
            <path d="M380 310 Q370 360 375 420" stroke="currentColor" strokeWidth="1.2" />
            <path d="M330 340 Q345 390 350 450" stroke="currentColor" strokeWidth="1.2" />
            <path d="M330 340 Q315 390 305 440" stroke="currentColor" strokeWidth="1.2" />
            <path d="M285 320 Q275 370 270 425" stroke="currentColor" strokeWidth="1" />
            {/* Fine right bronchioles */}
            <path d="M415 410 Q430 440 435 470" stroke="currentColor" strokeWidth="0.8" />
            <path d="M415 410 Q400 445 395 475" stroke="currentColor" strokeWidth="0.8" />
            <path d="M375 420 Q380 450 385 480" stroke="currentColor" strokeWidth="0.8" />
            <path d="M350 450 Q355 475 360 500" stroke="currentColor" strokeWidth="0.8" />
            <path d="M305 440 Q295 470 290 495" stroke="currentColor" strokeWidth="0.8" />

            {/* Left Lung Outer Contour (Wireframe Lines) */}
            <path
              d="M230 180 C210 160 170 160 135 185 C90 220 50 290 45 370 C40 445 55 510 105 540 C145 565 200 550 235 500 C245 440 240 370 235 300 C232 250 232 210 230 180 Z"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="rgba(6, 182, 212, 0.015)"
            />
            {/* Left Lung Inner Density Ribs */}
            <path d="M70 300 Q140 290 220 320" stroke="currentColor" strokeWidth="0.7" strokeDasharray="3 3" />
            <path d="M60 360 Q130 360 220 380" stroke="currentColor" strokeWidth="0.7" strokeDasharray="3 3" />
            <path d="M65 420 Q140 420 225 435" stroke="currentColor" strokeWidth="0.7" strokeDasharray="3 3" />
            <path d="M80 475 Q150 480 225 485" stroke="currentColor" strokeWidth="0.7" strokeDasharray="3 3" />

            {/* Right Lung Outer Contour (Wireframe Lines) */}
            <path
              d="M270 180 C290 160 330 160 365 185 C410 220 450 290 455 370 C460 445 445 510 395 540 C355 565 300 550 265 500 C255 440 260 370 265 300 C268 250 268 210 270 180 Z"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="rgba(6, 182, 212, 0.015)"
            />
            {/* Right Lung Inner Density Ribs */}
            <path d="M430 300 Q360 290 280 320" stroke="currentColor" strokeWidth="0.7" strokeDasharray="3 3" />
            <path d="M440 360 Q370 360 280 380" stroke="currentColor" strokeWidth="0.7" strokeDasharray="3 3" />
            <path d="M435 420 Q360 420 275 435" stroke="currentColor" strokeWidth="0.7" strokeDasharray="3 3" />
            <path d="M420 475 Q350 480 275 485" stroke="currentColor" strokeWidth="0.7" strokeDasharray="3 3" />
          </g>
        </svg>

        {/* Bottom Flowing Waves / Aurora Gradients */}
        <svg
          className="absolute bottom-0 left-0 right-0 w-full h-48 sm:h-64 text-cyan-400/10 pointer-events-none"
          viewBox="0 0 1440 320"
          fill="none"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,192L60,197.3C120,203,240,213,360,192C480,171,600,117,720,117.3C840,117,960,171,1080,186.7C1200,203,1320,181,1380,170.7L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
            fill="url(#wave-gradient)"
          />
          <defs>
            <linearGradient id="wave-gradient" x1="0" y1="0" x2="1440" y2="320" gradientUnits="userSpaceOnUse">
              <stop stopColor="rgba(6, 182, 212, 0.12)" />
              <stop offset="0.5" stopColor="rgba(20, 184, 166, 0.08)" />
              <stop offset="1" stopColor="rgba(14, 165, 233, 0.14)" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* =========================================================================
          HERO CONTENT: Exactly Matching User Screenshot
      ========================================================================= */}
      <main className="relative z-10 pt-20 pb-16 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        
        {/* Category Pill with Green Status Dot */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200 text-slate-700 text-xs font-medium mb-6 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Clinical Decision Support &bull; MedTech AI</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-slate-900 leading-tight">
          Uncertainty-Aware Chest Radiograph Triage
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
          Detecting diagnostic ambiguity between Tuberculosis and early Lung Cancer. Replacing overconfident single guesses with conformal prediction sets and deterministic clinical abstention.
        </p>

        {/* Action Button */}
        <div className="mt-8 flex items-center justify-center">
          <Link
            to="/workspace"
            className="inline-flex items-center px-7 py-3.5 rounded-full bg-[#0b1320] hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            <span>Open Clinical Workspace</span>
            <ArrowRight className="w-3.5 h-3.5 ml-2" />
          </Link>
        </div>

        {/* Divider & Key Metrics Row */}
        <div className="mt-14 pt-8 border-t border-slate-200/80 grid grid-cols-3 gap-6 max-w-xl mx-auto">
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900">90%</div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">Conformal Coverage</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900">18</div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">Radiological Pathologies</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900">0%</div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">Softmax Overconfidence</div>
          </div>
        </div>
      </main>

      {/* =========================================================================
          SECTION: CLINICAL RATIONALE (Clean & Minimal)
      ========================================================================= */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-8">
        <div className="text-center mb-8 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Clinical Rationale
          </span>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            The Danger of Diagnostic Anchoring
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/90 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">Radiological Mimicry</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Early-stage bronchogenic carcinoma and active Tuberculosis present identical radiographic signatures—apical cavitary lesions, infiltrates, and nodules.
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">The Softmax Blindspot</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Standard deep learning models force probabilities to sum to 100%. An ambiguous case (e.g. 52% TB vs 48% Cancer) outputs single-label &quot;TB&quot;, masking diagnostic doubt.
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">Abstention as Safety</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              When findings conflict or risk is elevated, LUNGUARD abstains from a single guess, triggering immediate dual-track escalation (sputum testing + urgent CT).
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION: FOUR TRIAGE OUTCOMES
      ========================================================================= */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="text-center mb-8 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Clinical Hierarchy
          </span>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Four Actionable Triage Pathways
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-full">
                  Normal
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
              <h3 className="text-xs font-semibold text-slate-900">No Acute Finding</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                No significant abnormality detected. Governed by routine outpatient clinical correlation.
              </p>
            </div>
            <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-100">
              Routine outpatient care
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider bg-amber-50 px-2 py-0.5 rounded-full">
                  TB-Consistent
                </span>
                <AlertTriangle className="w-4 h-4 text-amber-500" />
              </div>
              <h3 className="text-xs font-semibold text-slate-900">Infectious Pattern</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Findings suggestive of tuberculosis. Prompts microbiological confirmation without oncology alert.
              </p>
            </div>
            <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-100">
              GeneXpert / Sputum testing
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider bg-rose-50 px-2 py-0.5 rounded-full">
                  Malignancy
                </span>
                <AlertOctagon className="w-4 h-4 text-rose-500" />
              </div>
              <h3 className="text-xs font-semibold text-slate-900">Neoplastic Suspicion</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Findings warrant evaluation for malignancy. Triggers expedited pulmonology review and chest CT.
              </p>
            </div>
            <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-100">
              Contrast CT + Oncology review
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl border border-slate-900/10 shadow-2xs space-y-2 flex flex-col justify-between bg-slate-50/60">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-900 uppercase tracking-wider bg-slate-200 px-2 py-0.5 rounded-full">
                  Dual-Risk
                </span>
                <ShieldAlert className="w-4 h-4 text-slate-900" />
              </div>
              <h3 className="text-xs font-semibold text-slate-900">Model Abstention</h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Conflicting infectious and neoplastic features. Model halts single guess; mandates senior review.
              </p>
            </div>
            <div className="text-[10px] text-slate-700 font-semibold pt-2 border-t border-slate-200">
              Immediate dual-track escalation
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FOOTER DISCLAIMER
      ========================================================================= */}
      <footer className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-6 pb-12">
        <p className="text-[11px] text-slate-400 text-center leading-relaxed">
          <strong>Academic Research Prototype:</strong> Developed for DEXATHON 2K26. Not an FDA-cleared, CE-marked, or CDSCO-approved medical device.
          For research and educational decision-support demonstration only.
        </p>
      </footer>

    </div>
  )
}
