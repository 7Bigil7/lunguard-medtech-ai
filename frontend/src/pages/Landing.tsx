import React from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BarChart2,
  Layers,
  Shield,
  Stethoscope,
  Zap,
  FileText,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  ShieldAlert,
  Monitor,
  Code2,
  Cpu,
  BarChart,
  ShieldCheck,
} from 'lucide-react'
import { LungIcon } from '../components/common/LungIcon'
import { HeroCxrCard } from '../components/common/HeroCxrCard'

export const Landing: React.FC = () => {
  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* HERO SECTION */}
      <section className="relative bg-slate-950 text-white overflow-hidden pt-12 pb-16 sm:pt-16 sm:pb-24 border-b border-slate-800">
        {/* Subtle background ambient mesh & medical energy waves */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-950/40 via-slate-950 to-slate-950 pointer-events-none" />
        <svg
          className="absolute inset-0 w-full h-full opacity-25 pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 1440 600"
          preserveAspectRatio="none"
        >
          <path
            d="M-50 420C220 460 420 270 720 330C1020 390 1220 220 1500 290"
            stroke="url(#hero-wave-grad)"
            strokeWidth="2.5"
          />
          <path
            d="M-50 380C260 430 480 300 780 350C1080 400 1280 250 1500 320"
            stroke="url(#hero-wave-grad)"
            strokeWidth="1.5"
            strokeDasharray="6 6"
          />
          <defs>
            <linearGradient id="hero-wave-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0" />
              <stop offset="35%" stopColor="#06b6d4" stopOpacity="0.75" />
              <stop offset="75%" stopColor="#3b82f6" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center space-x-2 text-cyan-400 font-bold text-xs uppercase tracking-widest">
                <span>DEXATHON 2026 • RESEARCH PROTOTYPE</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] font-sans">
                When AI Is Uncertain,<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-300">
                  Patient Safety
                </span>{' '}
                Comes First.
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed font-normal">
                Lunguard is an uncertainty-aware chest X-ray decision-support prototype designed to flag potentially concerning findings and identify cases requiring further clinical evaluation.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/workspace"
                  className="inline-flex items-center px-6 py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-cyan-500/20 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                  <BarChart2 className="w-4 h-4 mr-2 text-slate-950" />
                  <span>Launch Analysis Workspace</span>
                  <ArrowRight className="w-4 h-4 ml-2 text-slate-950" />
                </Link>

                <Link
                  to="/safety-engine"
                  className="inline-flex items-center px-5 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm transition-colors"
                >
                  <Layers className="w-4 h-4 mr-2 text-cyan-400" />
                  <span>View Safety Architecture</span>
                </Link>
              </div>

              {/* 4 Feature Badges Underneath */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-800/80">
                <div className="flex items-start space-x-2.5">
                  <div className="p-1.5 rounded-lg bg-slate-900 border border-cyan-500/30 text-cyan-400 shrink-0 mt-0.5">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-xs font-bold text-white">Uncertainty-Aware</strong>
                    <span className="text-[11px] text-slate-400 leading-tight block">Highlights low-confidence cases</span>
                  </div>
                </div>

                <div className="flex items-start space-x-2.5">
                  <div className="p-1.5 rounded-lg bg-slate-900 border border-cyan-500/30 text-cyan-400 shrink-0 mt-0.5">
                    <LungIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-xs font-bold text-white">Clinical Focus</strong>
                    <span className="text-[11px] text-slate-400 leading-tight block">Chest X-ray triage support</span>
                  </div>
                </div>

                <div className="flex items-start space-x-2.5">
                  <div className="p-1.5 rounded-lg bg-slate-900 border border-cyan-500/30 text-cyan-400 shrink-0 mt-0.5">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-xs font-bold text-white">Research Prototype</strong>
                    <span className="text-[11px] text-slate-400 leading-tight block">For academic evaluation</span>
                  </div>
                </div>

                <div className="flex items-start space-x-2.5">
                  <div className="p-1.5 rounded-lg bg-slate-900 border border-cyan-500/30 text-cyan-400 shrink-0 mt-0.5">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-xs font-bold text-white">Simulated Demo</strong>
                    <span className="text-[11px] text-slate-400 leading-tight block">No GPU or server required</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Hero Visual: Floating CXR Preview Card */}
            <div className="lg:col-span-5 flex justify-center">
              <HeroCxrCard />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: CLINICAL CONTEXT & MOTIVATION */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 overflow-hidden">
        {/* Subtle decorative lung watermark */}
        <div className="absolute right-0 -top-8 w-64 h-64 opacity-[0.06] pointer-events-none text-cyan-700 hidden lg:block">
          <LungIcon size={256} />
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 block">
              CLINICAL CONTEXT & MOTIVATION
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Diagnostic Anchoring in Tuberculosis-Endemic Regions
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md leading-relaxed">
            In regions with high tuberculosis prevalence, certain chest X-ray findings can closely resemble malignancy, leading to diagnostic anchoring and missed cases.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1 */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center shrink-0">
                <Stethoscope className="w-5 h-5" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Radiological Overlap & Cognitive Bias
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              In TB-endemic regions such as India, high clinical suspicion for tuberculosis is clinically appropriate. However, certain radiological presentations (apical lesions, infiltrates, solitary nodules) can closely resemble pulmonary malignancy on planar radiographs, creating a realistic risk of diagnostic anchoring.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                The Limitations of Standard Point Classifiers
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Standard deep learning models often output single-label predictions with uncalibrated confidence scores. When confronted with ambiguous chest radiographs, conventional models are incentivized to guess based on prior training frequencies.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: METHODOLOGY - OUR UNCERTAINTY-AWARE FRAMEWORK */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 lg:p-12 space-y-8 shadow-xl border border-slate-800 relative overflow-hidden">
          {/* Ambient cyan glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-1 relative z-10 text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block">
              METHODOLOGY
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Our Uncertainty-Aware Framework
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              How split conformal prediction and deterministic safety policies create a reliable clinical guardrail.
            </p>
          </div>

          {/* 3 Steps connected with arrows */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 items-stretch">
            {/* Step 01 */}
            <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-full bg-cyan-500 text-slate-950 font-extrabold text-xs flex items-center justify-center">
                    01
                  </span>
                  <Layers className="w-5 h-5 text-cyan-400" />
                </div>
                <h3 className="text-base font-bold text-white">Densenet Feature Extraction</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Preprocess CXR images and use DenseNet-121 to extract meaningful feature representations.
                </p>
              </div>
            </div>

            {/* Step 02 */}
            <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-full bg-cyan-500 text-slate-950 font-extrabold text-xs flex items-center justify-center">
                    02
                  </span>
                  <BarChart className="w-5 h-5 text-cyan-400" />
                </div>
                <h3 className="text-base font-bold text-white">Conformal Prediction Sets</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Generate a set of possible classes with coverage guarantees instead of a single forced prediction.
                </p>
              </div>
            </div>

            {/* Step 03 */}
            <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-full bg-purple-500 text-white font-extrabold text-xs flex items-center justify-center">
                    03
                  </span>
                  <ShieldAlert className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-base font-bold text-white">Deterministic Safety Firewall</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  If high-risk or uncertain classes are present, abstain and escalate for clinical review.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: STANDARDIZED TRIAGE HIERARCHY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 block">
              STANDARDIZED TRIAGE HIERARCHY
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              The Four Clinical Triage Outcomes
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md leading-relaxed">
            Each CXR evaluation produces one of four explicit outcomes with clear guidance and safety actions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card A: NORMAL */}
          <div className="bg-white p-5 rounded-2xl border-2 border-emerald-400/80 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                  CLASS A
                </span>
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">NORMAL</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                No significant abnormality identified by the model. Interpret alongside clinical findings.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
              Set size: 1 <span className="mx-1 text-slate-300">|</span> Policy: Cleared
            </div>
          </div>

          {/* Card B: TB-CONSISTENT */}
          <div className="bg-white p-5 rounded-2xl border-2 border-amber-400/80 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
                  CLASS B
                </span>
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">TB-CONSISTENT</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Findings may be consistent with tuberculosis. Clinical assessment and confirmatory testing are required.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
              Set size: 1 <span className="mx-1 text-slate-300">|</span> Infectious pathway
            </div>
          </div>

          {/* Card C: MALIGNANCY-SUSPICIOUS */}
          <div className="bg-white p-5 rounded-2xl border-2 border-rose-400/80 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                  <AlertOctagon className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider">
                  CLASS C
                </span>
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">MALIGNANCY-SUSPICIOUS</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Findings warrant further evaluation for possible malignancy. Prompt clinical review is recommended.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
              Set size: 1 <span className="mx-1 text-slate-300">|</span> Priority referral
            </div>
          </div>

          {/* Card D: UNCERTAIN / DUAL-RISK */}
          <div className="bg-purple-50/70 p-5 rounded-2xl border-2 border-purple-500 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">
                  CLASS D
                </span>
              </div>
              <h3 className="text-lg font-extrabold text-purple-950">UNCERTAIN / DUAL-RISK</h3>
              <p className="text-xs text-purple-950 leading-relaxed font-medium">
                Model produced multiple high-consequence possibilities (e.g. both TB and malignancy). Abstain and escalate.
              </p>
            </div>
            <div className="pt-3 border-t border-purple-200 text-[11px] text-purple-800 font-semibold">
              Set size: &gt; 1 <span className="mx-1 text-purple-300">|</span> Policy: Abstained
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: SYSTEM ENGINEERING - COMPACT ARCHITECTURE PIPELINE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 block">
              SYSTEM ENGINEERING
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Compact Architecture Pipeline
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md leading-relaxed">
            A modular pipeline designed for fast inference, clear logic and safety-aware decision making.
          </p>
        </div>

        {/* 5 Connected Step Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-stretch">
          {/* Step 1 */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Monitor className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase block">1. Front-End</span>
                <strong className="text-xs font-extrabold text-slate-900 block">React + TypeScript</strong>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                In-memory validation, interactive UI, magic-byte checks.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
                <Code2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase block">2. API Gateway</span>
                <strong className="text-xs font-extrabold text-slate-900 block">FastAPI (Python)</strong>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                REST interface, schema validation, asynchronous workers.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase block">3. Vision Backbone</span>
                <strong className="text-xs font-extrabold text-slate-900 block">DenseNet-121</strong>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                CXR feature extraction, raw class activations.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <BarChart className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase block">4. Conformal Layer</span>
                <strong className="text-xs font-extrabold text-slate-900 block">MAPIE / Conformal</strong>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Finite-sample statistical coverage guarantee.
              </p>
            </div>
          </div>

          {/* Step 5 */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase block">5. Safety Policy</span>
                <strong className="text-xs font-extrabold text-slate-900 block">Rule Firewall</strong>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Deterministic abstention and 4-tier triage dispatch.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* RESEARCH PROTOTYPE NOTICE BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-5 sm:p-6 rounded-2xl bg-amber-50/90 border border-amber-300 text-amber-950 flex flex-col sm:flex-row items-start space-y-2 sm:space-y-0 sm:space-x-3.5 shadow-sm">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="text-sm font-bold text-amber-900 block">
              Research Prototype Notice
            </strong>
            <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
              Lunguard is an experimental research prototype created for the DEXATHON 2026 hackathon. It is not an FDA-cleared, CE-marked, or CDSCO-approved medical device and is not intended for autonomous diagnosis. All patient diagnostic and treatment decisions must be made by qualified medical personnel.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
