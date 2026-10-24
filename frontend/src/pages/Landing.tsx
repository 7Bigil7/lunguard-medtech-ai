import React from 'react'
import { Link } from 'react-router-dom'
import {
  ShieldCheck,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  ShieldAlert,
  Stethoscope,
  Microscope,
} from 'lucide-react'

export const Landing: React.FC = () => {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white border-b border-slate-800 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-teal-300 text-xs font-semibold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-teal-400"></span>
              <span>DEXATHON 2026 Research Prototype</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight font-sans">
              When AI Is Uncertain, Patient Safety Comes First.
            </h1>

            <p className="text-base sm:text-xl text-slate-300 leading-relaxed font-normal">
              Lunguard is an uncertainty-aware chest X-ray decision-support prototype designed to flag potentially concerning findings and identify cases requiring further clinical evaluation.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                to="/workspace"
                className="inline-flex items-center px-6 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-base shadow-lg shadow-teal-950/40 transition-all focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                Launch Analysis Workspace
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>

              <Link
                to="/safety-engine"
                className="inline-flex items-center px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm transition-colors"
              >
                Inspect Safety Architecture
              </Link>
            </div>

            <div className="pt-2 text-xs text-slate-400 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
              <span>
                Simulated demo mode available out-of-the-box — no GPU or local server required for evaluation.
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Section A: The Clinical Problem */}
        <section className="space-y-6">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 block mb-1">
              Clinical Context & Motivation
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Diagnostic Anchoring in Tuberculosis-Endemic Regions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 w-fit text-amber-700">
                <Stethoscope className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Radiological Overlap & Cognitive Bias
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                In TB-endemic regions such as India, high clinical suspicion for tuberculosis is clinically appropriate. However, certain radiological presentations of active or chronic pulmonary tuberculosis (such as apical fibrocavitary lesions, infiltrates, and solitary nodules) can closely resemble pulmonary malignancy on planar radiographs.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                This overlap creates a realistic risk of <strong>diagnostic anchoring</strong>, where an unresolving lesion may initially be presumed to be TB, while an underlying or co-existing neoplasm goes unrecognized during early intervention windows.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div className="p-2.5 rounded-lg bg-teal-50 border border-teal-200 w-fit text-teal-700">
                <Microscope className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                The Limitations of Standard Point Classifiers
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Standard deep learning computer-vision systems frequently output forced single-label point predictions with uncalibrated confidence scores. When confronted with ambiguous chest radiographs, conventional models are incentivized to guess based on prior training frequencies.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Lunguard reframes the classification problem: rather than forcing an autonomous diagnosis, the system detects ambiguity, constructs rigorous conformal prediction sets, and enforces safety abstention to mandate clinician escalation.
              </p>
            </div>
          </div>
        </section>

        {/* Section B: Uncertainty-Aware Approach */}
        <section className="bg-slate-900 text-white rounded-2xl p-8 sm:p-12 space-y-8">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400 block">
              Methodology
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Our Uncertainty-Aware Framework
            </h2>
            <p className="text-sm text-slate-300">
              How split conformal prediction and deterministic safety policies create a reliable clinical guardrail.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700 space-y-3">
              <span className="font-mono text-teal-400 font-bold text-xs uppercase block">
                01 • DenseNet Feature Extraction
              </span>
              <h3 className="font-bold text-white text-base">Penultimate Activations</h3>
              <p className="text-slate-300 text-xs leading-relaxed">
                Standard chest radiographs are preprocessed and fed through a DenseNet-121 backbone to extract discriminative representations across normal parenchyma, mycobacterial changes, and neoplastic nodular opacities.
              </p>
            </div>

            <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700 space-y-3">
              <span className="font-mono text-teal-400 font-bold text-xs uppercase block">
                02 • Conformal Prediction Sets
              </span>
              <h3 className="font-bold text-white text-base">Coverage Guarantees</h3>
              <p className="text-slate-300 text-xs leading-relaxed">
                Instead of returning a single winner-take-all prediction, split conformal prediction produces a dynamic set of classes $C(X)$ that is guaranteed to contain the true ground truth with target probability $1 - \alpha$ under distribution exchangeability.
              </p>
            </div>

            <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700 space-y-3">
              <span className="font-mono text-teal-400 font-bold text-xs uppercase block">
                03 • Deterministic Safety Firewall
              </span>
              <h3 className="font-bold text-white text-base">Mandatory Abstention</h3>
              <p className="text-slate-300 text-xs leading-relaxed">
                If the prediction set contains multiple high-consequence classes (such as both TB and Malignancy), or if model confidence is borderline, the safety policy abstains and emits an Uncertain / Dual-Risk escalation flag.
              </p>
            </div>
          </div>
        </section>

        {/* Section C: Four Triage Outcomes */}
        <section className="space-y-6">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 block mb-1">
              Standardized Triage Hierarchy
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              The Four Clinical Triage Outcomes
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Every CXR evaluation produces strictly one of four explicit outcomes, pairing iconography with unambiguous clinical guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Outcome 1: Normal */}
            <div className="bg-white p-5 rounded-xl border-2 border-emerald-400 shadow-sm space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800 w-fit">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold uppercase text-emerald-700 block">Class A</span>
                <h3 className="text-lg font-bold text-emerald-950">NORMAL</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  No significant abnormality identified by the model. This result does not exclude disease and must be interpreted alongside clinical findings.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
                Set size: 1 • Policy: Cleared
              </div>
            </div>

            {/* Outcome 2: TB Consistent */}
            <div className="bg-white p-5 rounded-xl border-2 border-amber-400 shadow-sm space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="p-2 rounded-lg bg-amber-100 text-amber-800 w-fit">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold uppercase text-amber-700 block">Class B</span>
                <h3 className="text-lg font-bold text-amber-950">TB-CONSISTENT</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Findings may be consistent with tuberculosis. Clinical assessment and appropriate confirmatory testing are required.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
                Set size: 1 • Infectious pathway
              </div>
            </div>

            {/* Outcome 3: Malignancy Suspicious */}
            <div className="bg-white p-5 rounded-xl border-2 border-rose-400 shadow-sm space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="p-2 rounded-lg bg-rose-100 text-rose-800 w-fit">
                  <AlertOctagon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold uppercase text-rose-700 block">Class C</span>
                <h3 className="text-lg font-bold text-rose-950">MALIGNANCY-SUSPICIOUS</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Findings warrant further evaluation for possible malignancy. Prompt clinician review and appropriate diagnostic investigation are recommended.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
                Set size: 1 • Priority referral
              </div>
            </div>

            {/* Outcome 4: Uncertain / Dual Risk (Differentiator) */}
            <div className="bg-purple-50 p-5 rounded-xl border-2 border-purple-600 shadow-md ring-1 ring-purple-300 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="p-2 rounded-lg bg-purple-700 text-white w-fit">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold uppercase text-purple-800 block">
                  Class D • Primary Differentiator
                </span>
                <h3 className="text-lg font-extrabold text-purple-950 leading-snug">
                  UNCERTAIN / DUAL-RISK
                </h3>
                <p className="text-xs text-purple-900 leading-relaxed font-medium">
                  The model has not produced a sufficiently reliable classification under the configured safety policy. Review the prediction set and clinical context before determining the appropriate next steps.
                </p>
              </div>
              <div className="pt-2 border-t border-purple-200 text-[11px] text-purple-800 font-semibold">
                Set size &gt; 1 or borderline • Policy: Abstained
              </div>
            </div>
          </div>
        </section>

        {/* Section D: Compact Architecture Overview */}
        <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 block mb-1">
              System Engineering
            </span>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Compact Architecture Pipeline
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-mono text-teal-700 font-bold block">1. Front-End</span>
              <strong className="text-slate-900 block text-sm">React + TypeScript</strong>
              <p className="text-slate-500">In-memory validation, magic-byte checks, interactive UI.</p>
            </div>
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-mono text-teal-700 font-bold block">2. API Gateway</span>
              <strong className="text-slate-900 block text-sm">FastAPI (Python)</strong>
              <p className="text-slate-500">REST contract, schema validation, asynchronous workers.</p>
            </div>
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-mono text-teal-700 font-bold block">3. Vision Backbone</span>
              <strong className="text-slate-900 block text-sm">DenseNet-121</strong>
              <p className="text-slate-500">CXR feature extraction, raw class activations.</p>
            </div>
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-mono text-teal-700 font-bold block">4. Conformal Layer</span>
              <strong className="text-slate-900 block text-sm">MAPIE / Conformal</strong>
              <p className="text-slate-500">Finite-sample statistical coverage guarantee (1 - α).</p>
            </div>
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-mono text-teal-700 font-bold block">5. Safety Policy</span>
              <strong className="text-slate-900 block text-sm">Rule Firewall</strong>
              <p className="text-slate-500">Deterministic abstention and 4-tier triage dispatch.</p>
            </div>
          </div>
        </section>

        {/* Section E: Safety Disclaimer Banner */}
        <section className="p-6 rounded-xl bg-amber-50 border-2 border-amber-300 text-amber-950 space-y-2">
          <div className="flex items-center space-x-2 text-amber-900 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
            <span>Research Prototype Notice</span>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed text-amber-900">
            Lunguard is an experimental research prototype created for the DEXATHON 2026 hackathon. It is not an FDA-cleared, CE-marked, or CDSCO-approved medical device and is not intended for autonomous diagnosis. All patient diagnostic and treatment decisions must be made by qualified medical personnel.
          </p>
        </section>

        {/* Section F: Team Credits */}
        <section className="border-t border-slate-200 pt-8 pb-4 text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            DEXATHON 2026 Prototype Development Team
          </span>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-semibold text-slate-800">
            <span>Bharath</span>
            <span className="text-slate-300">•</span>
            <span>Vivek</span>
            <span className="text-slate-300">•</span>
            <span>Harshitha</span>
            <span className="text-slate-300">•</span>
            <span>Ananya</span>
          </div>
        </section>
      </div>
    </div>
  )
}
