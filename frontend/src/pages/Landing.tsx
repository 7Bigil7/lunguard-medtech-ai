import React from 'react'
import { Link } from 'react-router-dom'
import { motion, type Variants } from 'framer-motion'
import {
  ArrowRight,
  BarChart2,
  Layers,
  Shield,
  Stethoscope,
  Zap,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  ShieldAlert,
  Monitor,
  Code2,
  Cpu,
  BarChart,
  ShieldCheck,
  Sparkles,
  Scale,
} from 'lucide-react'
import { LungIcon } from '../components/common/LungIcon'
import { HeroLungs3D } from '../components/3d/HeroLungs3D'

// Animation Variants for Framer-Motion Stagger & Reveal
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

export const Landing: React.FC = () => {
  return (
    <div className="space-y-16 sm:space-y-24 pb-20 overflow-x-hidden selection:bg-cyan-100 selection:text-cyan-900">
      {/* =========================================================================
          HERO SECTION (Light Medical-Tech Theme with 3D Interactive Lungs)
      ========================================================================= */}
      <section className="relative overflow-hidden pt-8 pb-16 sm:pt-14 sm:pb-24 border-b border-slate-200/80 bg-gradient-to-b from-white via-cyan-50/30 to-slate-50">
        {/* Subtle Ambient Medical Background Pattern */}
        <div className="absolute inset-0 medical-grid opacity-60 pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Content Column */}
            <motion.div
              className="lg:col-span-7 space-y-6 text-left"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Badge */}
              <motion.div variants={itemVariants} className="inline-flex items-center space-x-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white text-slate-800 border border-slate-200 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mr-2 animate-pulse" />
                  DEXATHON 2K26 • Uncertainty-Aware CXR Triage
                </span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                variants={itemVariants}
                className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.08] font-sans"
              >
                When AI Is Uncertain,<br />
                <span className="text-slate-900 underline decoration-teal-400 decoration-wavy decoration-2">
                  Patient Safety
                </span>{' '}
                Comes First.
              </motion.h1>

              {/* Lead Paragraph */}
              <motion.p
                variants={itemVariants}
                className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed font-normal"
              >
                In tuberculosis-endemic regions, early curable lung cancer is frequently misdiagnosed as TB due to radiologic mimicry and clinical diagnostic anchoring.
                <strong className="text-slate-800 font-semibold block mt-1">
                  LungGuard replaces overconfident single guesses with conformal prediction sets and a deterministic safety firewall that abstains when findings are ambiguous.
                </strong>
              </motion.p>

              {/* Action Buttons */}
              <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  to="/workspace"
                  className="inline-flex items-center px-6 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-xs transition-all transform hover:-translate-y-0.5"
                >
                  <BarChart2 className="w-4 h-4 mr-2 text-teal-400" />
                  <span>Launch Analysis Workspace</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>

                <Link
                  to="/safety-engine"
                  className="inline-flex items-center px-5 py-3.5 rounded-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-semibold text-sm transition-all shadow-2xs"
                >
                  <Layers className="w-4 h-4 mr-2 text-slate-600" />
                  <span>View Safety Engine</span>
                </Link>

                <Link
                  to="/evaluation"
                  className="inline-flex items-center px-4 py-3.5 rounded-full text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors"
                >
                  <span>Research Benchmarks →</span>
                </Link>
              </motion.div>

              {/* 4 Micro Feature Cards */}
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-200/80"
              >
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-start space-x-2.5">
                  <div className="p-2 rounded-xl bg-slate-100 text-slate-700 shrink-0">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-xs font-bold text-slate-900">Uncertainty-Aware</strong>
                    <span className="text-[11px] text-slate-500 leading-tight block">Conformal prediction sets</span>
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-start space-x-2.5">
                  <div className="p-2 rounded-xl bg-slate-100 text-slate-700 shrink-0">
                    <LungIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-xs font-bold text-slate-900">Anatomical 3D</strong>
                    <span className="text-[11px] text-slate-500 leading-tight block">Laser volume scanning</span>
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-start space-x-2.5">
                  <div className="p-2 rounded-xl bg-slate-100 text-slate-700 shrink-0">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-xs font-bold text-slate-900">Dual-Risk Abstention</strong>
                    <span className="text-[11px] text-slate-500 leading-tight block">Halts single guesses</span>
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-start space-x-2.5">
                  <div className="p-2 rounded-xl bg-slate-100 text-slate-700 shrink-0">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-xs font-bold text-slate-900">Local Integrity</strong>
                    <span className="text-[11px] text-slate-500 leading-tight block">Magic bytes & pixel checks</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Hero Visual: 3D Animated Human Lungs Model */}
            <motion.div
              className="lg:col-span-5 relative"
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Minimalist White Frame */}
              <div className="relative p-2.5 sm:p-3 rounded-3xl bg-white border border-slate-200/80 shadow-xl shadow-slate-900/5">
                <HeroLungs3D className="w-full" interactive={true} />
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 1: CLINICAL CONTEXT & MOTIVATION (Diagnostic Anchoring)
      ========================================================================= */}
      <motion.section
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7 }}
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 block">
              CLINICAL CONTEXT & MOTIVATION
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Diagnostic Anchoring in Tuberculosis-Endemic Regions
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md leading-relaxed">
            In high TB-prevalence regions, abnormal chest X-ray findings routinely trigger a reflexive TB diagnosis, delaying the detection of early curable lung cancer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="glass-card p-6 sm:p-7 rounded-3xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center shrink-0 shadow-2xs">
              <Stethoscope className="w-6 h-6" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Radiological Overlap & Mimicry
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Apical cavitary disease, infiltrates, fibrotic volume loss, and solitary tuberculomas closely resemble pulmonary malignancy on plain chest radiographs. Plain 2D films cannot reliably differentiate them.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-card p-6 sm:p-7 rounded-3xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shrink-0 shadow-2xs">
              <Scale className="w-6 h-6" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              The Flaw of Softmax Classifiers
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Standard deep learning models force probabilities to sum to 100%. When facing ambiguous films (e.g. 52% TB vs 48% Cancer), standard argmax outputs &quot;TB&quot; with false confidence, blinding the physician.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-card p-6 sm:p-7 rounded-3xl space-y-4 border-cyan-300/80 bg-gradient-to-b from-white via-cyan-50/20 to-white">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 border border-cyan-200 flex items-center justify-center shrink-0 shadow-2xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              The LUNGUARD Abstention Safeguard
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Rather than guessing, LUNGUARD declares <span className="font-semibold text-purple-900">&quot;UNCERTAIN / DUAL-RISK&quot;</span>. It triggers an immediate dual-track escalation: microbiological testing PLUS urgent chest CT imaging.
            </p>
          </div>
        </div>
      </motion.section>

      {/* =========================================================================
          SECTION 2: METHODOLOGY - OUR UNCERTAINTY-AWARE FRAMEWORK
      ========================================================================= */}
      <motion.section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7 }}
      >
        <div className="glass-panel rounded-3xl p-8 sm:p-10 lg:p-12 space-y-8 shadow-xl border border-cyan-200/80 relative overflow-hidden bg-gradient-to-br from-white via-cyan-50/25 to-teal-50/20">
          <div className="space-y-1 relative z-10 text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 block">
              METHODOLOGY
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Our Uncertainty-Aware Framework
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              How split conformal prediction and deterministic safety policies create a dependable clinical guardrail.
            </p>
          </div>

          {/* 3 Step Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 items-stretch">
            {/* Step 01 */}
            <div className="glass-card rounded-2xl p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 text-white font-extrabold text-xs flex items-center justify-center shadow-sm">
                    01
                  </span>
                  <Layers className="w-5 h-5 text-cyan-600" />
                </div>
                <h3 className="text-base font-bold text-slate-900">DenseNet Feature Extraction</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Preprocess chest radiographs and extract multi-scale spatial thoracic features using a DenseNet-121 backbone initialized with TorchXRayVision weights.
                </p>
              </div>
            </div>

            {/* Step 02 */}
            <div className="glass-card rounded-2xl p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 text-white font-extrabold text-xs flex items-center justify-center shadow-sm">
                    02
                  </span>
                  <BarChart className="w-5 h-5 text-cyan-600" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Conformal Prediction Sets</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Generate statistically calibrated class sets with rigorous finite-sample error guarantees (1 - α) under exchangeability, predicting multiple classes when uncertain.
                </p>
              </div>
            </div>

            {/* Step 03 */}
            <div className="glass-card rounded-2xl p-6 space-y-4 flex flex-col justify-between border-purple-300 bg-purple-50/30">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-9 h-9 rounded-xl bg-purple-600 text-white font-extrabold text-xs flex items-center justify-center shadow-sm">
                    03
                  </span>
                  <ShieldAlert className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Deterministic Safety Firewall</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  If infectious (TB) and neoplastic (Cancer) features co-occur, or confidence is inadequate, the engine triggers mandatory model abstention for clinical review.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* =========================================================================
          SECTION 3: STANDARDIZED TRIAGE HIERARCHY (The 4 Outcomes)
      ========================================================================= */}
      <motion.section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7 }}
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 block">
              STANDARDIZED TRIAGE HIERARCHY
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              The Four Standardized Clinical Triage Outcomes
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md leading-relaxed">
            Translates probabilistic predictions into clear, standardized clinical actions with explicit next-step guidance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card A: NORMAL */}
          <div className="glass-card p-5 rounded-3xl border-2 border-emerald-400/80 space-y-4 flex flex-col justify-between hover:shadow-emerald-500/10">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-extrabold text-emerald-800 uppercase tracking-wider">
                  CLASS A
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-900">NORMAL</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                No significant abnormality identified by the model. Routine clinical correlation governs; does not exclude subtle disease.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
              Action: Standard outpatient correlation
            </div>
          </div>

          {/* Card B: TB-CONSISTENT */}
          <div className="glass-card p-5 rounded-3xl border-2 border-amber-400/80 space-y-4 flex flex-col justify-between hover:shadow-amber-500/10">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-extrabold text-amber-800 uppercase tracking-wider">
                  CLASS B
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-900">TB-CONSISTENT</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Findings may be consistent with tuberculosis. Prompts microbiological testing (sputum smear, GeneXpert) without cancer panic.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
              Action: Fast-track GeneXpert / Sputum smear
            </div>
          </div>

          {/* Card C: MALIGNANCY-SUSPICIOUS */}
          <div className="glass-card p-5 rounded-3xl border-2 border-rose-400/80 space-y-4 flex flex-col justify-between hover:shadow-rose-500/10">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                  <AlertOctagon className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-extrabold text-rose-800 uppercase tracking-wider">
                  CLASS C
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-900">MALIGNANCY-SUSPICIOUS</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Findings warrant evaluation for possible malignancy. Prompts contrast-enhanced CT thorax, pulmonology review, and biopsy prep.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
              Action: Contrast-enhanced CT + Oncology referral
            </div>
          </div>

          {/* Card D: UNCERTAIN / DUAL-RISK (Key Differentiator) */}
          <div className="glass-card p-5 rounded-3xl border-2 border-purple-500 space-y-4 flex flex-col justify-between bg-purple-50/60 hover:shadow-purple-500/15">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-extrabold text-purple-800 uppercase tracking-wider">
                  CLASS D • ABSTENTION
                </span>
              </div>
              <h3 className="text-lg font-black text-purple-950">UNCERTAIN / DUAL-RISK</h3>
              <p className="text-xs text-purple-950 leading-relaxed font-medium">
                Model detected conflicting high-risk features or inadequate confidence. Abstains from single label; mandates senior review.
              </p>
            </div>
            <div className="pt-3 border-t border-purple-200 text-[11px] text-purple-900 font-bold">
              Action: Sputum tests + Urgent chest CT
            </div>
          </div>
        </div>
      </motion.section>

      {/* =========================================================================
          SECTION 4: SYSTEM ENGINEERING PIPELINE
      ========================================================================= */}
      <motion.section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7 }}
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 block">
              SYSTEM ENGINEERING
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Compact Architecture Pipeline
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md leading-relaxed">
            A modular 5-stage pipeline engineered for client-side privacy, fast execution, and strict clinical safety.
          </p>
        </div>

        {/* 5 Connected Step Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-stretch">
          {/* Step 1 */}
          <div className="glass-card p-4 rounded-2xl space-y-2 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Monitor className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase block">1. Front-End</span>
                <strong className="text-xs font-extrabold text-slate-900 block">React 19 + TypeScript</strong>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Magic-byte inspection, HTML5 Canvas pixel analysis, memory lifecycle.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="glass-card p-4 rounded-2xl space-y-2 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
                <Code2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase block">2. API Gateway</span>
                <strong className="text-xs font-extrabold text-slate-900 block">FastAPI (Python)</strong>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                REST interface, strict Zod & Pydantic schema validation contracts.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="glass-card p-4 rounded-2xl space-y-2 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase block">3. Vision Model</span>
                <strong className="text-xs font-extrabold text-slate-900 block">DenseNet-121</strong>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                TorchXRayVision feature representations and raw logit activations.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="glass-card p-4 rounded-2xl space-y-2 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <BarChart className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase block">4. Conformal Layer</span>
                <strong className="text-xs font-extrabold text-slate-900 block">MAPIE Framework</strong>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Finite-sample statistical coverage guarantee across class labels.
              </p>
            </div>
          </div>

          {/* Step 5 */}
          <div className="glass-card p-4 rounded-2xl space-y-2 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase block">5. Safety Firewall</span>
                <strong className="text-xs font-extrabold text-slate-900 block">Rule Policy Engine</strong>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Deterministic abstention rules and 4-tier triage dispatching.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* =========================================================================
          SECTION 5: LIVE WORKSPACE QUICK-LAUNCH BANNER
      ========================================================================= */}
      <motion.section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="glass-panel rounded-3xl p-8 sm:p-10 border border-cyan-300/80 bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-left">
            <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
              <span>Interactive Demonstration</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to test the 6-stage triage workflow?
            </h3>
            <p className="text-xs sm:text-sm text-cyan-100 max-w-xl">
              Load our synthetic CXR placeholder, test client-side pixel quality analysis, and simulate all four clinical outcomes side-by-side.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/workspace"
              className="px-6 py-3.5 rounded-2xl bg-white text-slate-950 font-extrabold text-sm shadow-lg hover:bg-cyan-50 transition-all flex items-center"
            >
              <BarChart2 className="w-4 h-4 mr-2 text-teal-700" />
              <span>Open Analysis Workspace</span>
              <ArrowRight className="w-4 h-4 ml-2 text-teal-700" />
            </Link>
          </div>
        </div>
      </motion.section>

      {/* =========================================================================
          RESEARCH PROTOTYPE NOTICE BANNER (Mandatory Clinical Disclaimer)
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-5 sm:p-6 rounded-3xl bg-amber-50/90 border-2 border-amber-300 text-amber-950 flex flex-col sm:flex-row items-start space-y-2 sm:space-y-0 sm:space-x-4 shadow-sm">
          <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1 text-left">
            <strong className="text-sm font-extrabold text-amber-900 block">
              ⚠️ MANDATORY RESEARCH & CLINICAL PROTOTYPE DISCLAIMER
            </strong>
            <p className="text-xs sm:text-sm text-amber-900 leading-relaxed font-medium">
              LUNGUARD is an experimental research prototype created for the DEXATHON 2K26 hackathon. It is <strong>NOT</strong> an FDA-cleared, CE-marked, or CDSCO-approved medical device and is <strong>NOT</strong> clinically validated for autonomous diagnosis. All model probabilities, prediction sets, and visual heatmaps displayed in demo mode are deterministic, illustrative examples. This prototype must never be used to guide real patient clinical diagnosis or management.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
