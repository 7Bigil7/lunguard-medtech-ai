import React from 'react'
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  Layers,
  Sparkles,
} from 'lucide-react'
import { SafetyPolicyExplorer } from '../components/safety/SafetyPolicyExplorer'

export const SafetyEngine: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Page Title */}
      <div className="space-y-3 pb-6 border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <span className="p-1 rounded bg-teal-600 text-white">
            <ShieldCheck className="w-5 h-5" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
            Safety Architecture & Protocol
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          The LUNGUARD Safety Engine
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
          How conformal prediction theory and deterministic safety guardrails protect patients against AI overconfidence and diagnostic anchoring.
        </p>
      </div>

      {/* Interactive / Inline SVG Pipeline Diagram */}
      <section className="bg-slate-950 text-white rounded-2xl p-6 sm:p-8 space-y-6 shadow-md border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              End-to-End Decision-Support Pipeline Architecture
            </h2>
            <p className="text-xs text-slate-400">
              Interactive high-contrast SVG representation of data and decision flow
            </p>
          </div>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-teal-300 border border-slate-700 w-fit">
            Deterministic Pipeline Flow
          </span>
        </div>

        {/* Inline SVG Pipeline Diagram */}
        <div className="w-full overflow-x-auto py-4">
          <svg
            viewBox="0 0 1100 220"
            className="w-full min-w-[900px] h-auto font-sans"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Stage 1: Chest X-ray */}
            <g transform="translate(10, 30)">
              <rect width="130" height="150" rx="10" fill="#0f172a" stroke="#334155" strokeWidth="2" />
              <rect x="25" y="20" width="80" height="80" rx="4" fill="#1e293b" />
              <path d="M40 70C50 50 80 50 90 70" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" />
              <text x="65" y="125" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="700">1. Chest X-Ray</text>
              <text x="65" y="142" textAnchor="middle" fill="#94a3b8" fontSize="10">PNG / JPEG &gt;224px</text>
            </g>

            {/* Arrow 1 */}
            <path d="M145 105 H175" stroke="#0d9488" strokeWidth="3" markerEnd="url(#teal-arrow)" />

            {/* Stage 2: Preprocessing */}
            <g transform="translate(180, 45)">
              <rect width="130" height="120" rx="10" fill="#0f172a" stroke="#0d9488" strokeWidth="2" />
              <text x="65" y="35" textAnchor="middle" fill="#2dd4bf" fontSize="12" fontWeight="700">2. Preprocess</text>
              <text x="65" y="60" textAnchor="middle" fill="#e2e8f0" fontSize="11">Normalization</text>
              <text x="65" y="80" textAnchor="middle" fill="#94a3b8" fontSize="10">Histogram Eq.</text>
              <text x="65" y="98" textAnchor="middle" fill="#94a3b8" fontSize="10">224×224 Resize</text>
            </g>

            {/* Arrow 2 */}
            <path d="M315 105 H345" stroke="#0d9488" strokeWidth="3" />

            {/* Stage 3: DenseNet-121 */}
            <g transform="translate(350, 45)">
              <rect width="140" height="120" rx="10" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
              <text x="70" y="35" textAnchor="middle" fill="#38bdf8" fontSize="12" fontWeight="700">3. DenseNet-121</text>
              <text x="70" y="60" textAnchor="middle" fill="#e2e8f0" fontSize="11">Deep Vision</text>
              <text x="70" y="80" textAnchor="middle" fill="#94a3b8" fontSize="10">Feature Vector</text>
              <text x="70" y="98" textAnchor="middle" fill="#94a3b8" fontSize="10">Logits + Grad-CAM</text>
            </g>

            {/* Arrow 3 */}
            <path d="M495 105 H525" stroke="#0d9488" strokeWidth="3" />

            {/* Stage 4: Prediction Scores */}
            <g transform="translate(530, 45)">
              <rect width="130" height="120" rx="10" fill="#0f172a" stroke="#a855f7" strokeWidth="2" />
              <text x="65" y="35" textAnchor="middle" fill="#c084fc" fontSize="12" fontWeight="700">4. Raw Scores</text>
              <text x="65" y="58" textAnchor="middle" fill="#e2e8f0" fontSize="10">Normal: 0.08</text>
              <text x="65" y="76" textAnchor="middle" fill="#e2e8f0" fontSize="10">TB: 0.74</text>
              <text x="65" y="94" textAnchor="middle" fill="#e2e8f0" fontSize="10">Malignancy: 0.71</text>
              <text x="65" y="110" textAnchor="middle" fill="#cbd5e1" fontSize="9">(Uncalibrated)</text>
            </g>

            {/* Arrow 4 */}
            <path d="M665 105 H695" stroke="#0d9488" strokeWidth="3" />

            {/* Stage 5: Conformal Prediction */}
            <g transform="translate(700, 40)">
              <rect width="150" height="130" rx="10" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" />
              <text x="75" y="32" textAnchor="middle" fill="#fbbf24" fontSize="12" fontWeight="700">5. Conformal Layer</text>
              <text x="75" y="55" textAnchor="middle" fill="#f8fafc" fontSize="11">Prediction Set C(X)</text>
              <rect x="15" y="65" width="120" height="26" rx="4" fill="#1e293b" stroke="#f59e0b" />
              <text x="75" y="82" textAnchor="middle" fill="#fde68a" fontSize="10" fontWeight="600">{'{TB, Malignancy}'}</text>
              <text x="75" y="112" textAnchor="middle" fill="#94a3b8" fontSize="10">Target: 1 - α = 95%</text>
            </g>

            {/* Arrow 5 */}
            <path d="M855 105 H885" stroke="#0d9488" strokeWidth="3" />

            {/* Stage 6: Deterministic Safety Policy */}
            <g transform="translate(890, 25)">
              <rect width="190" height="160" rx="10" fill="#0f172a" stroke="#ef4444" strokeWidth="2" />
              <text x="95" y="28" textAnchor="middle" fill="#f87171" fontSize="12" fontWeight="700">6. Safety Policy Engine</text>
              <text x="95" y="48" textAnchor="middle" fill="#94a3b8" fontSize="10">Deterministic Rules</text>

              {/* 4 Outcome badges */}
              <rect x="15" y="60" width="160" height="20" rx="4" fill="#065f46" />
              <text x="95" y="74" textAnchor="middle" fill="#a7f3d0" fontSize="9" fontWeight="600">NORMAL</text>

              <rect x="15" y="84" width="160" height="20" rx="4" fill="#78350f" />
              <text x="95" y="98" textAnchor="middle" fill="#fde68a" fontSize="9" fontWeight="600">TB-CONSISTENT</text>

              <rect x="15" y="108" width="160" height="20" rx="4" fill="#881337" />
              <text x="95" y="122" textAnchor="middle" fill="#fecdd3" fontSize="9" fontWeight="600">MALIGNANCY-SUSPICIOUS</text>

              <rect x="15" y="132" width="160" height="22" rx="4" fill="#581c87" stroke="#a855f7" />
              <text x="95" y="147" textAnchor="middle" fill="#e9d5ff" fontSize="9" fontWeight="700">UNCERTAIN / DUAL-RISK</text>
            </g>
          </svg>
        </div>
      </section>

      {/* Interactive Demonstration: Safety Policy Explorer */}
      <SafetyPolicyExplorer />

      {/* Explanatory Deep-Dive Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Conformal Prediction Explained */}
        <section className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-teal-700">
            <Layers className="w-5 h-5" />
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              What Conformal Prediction Actually Does
            </h2>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed">
            Standard classifiers output point predictions (e.g., &quot;Malignancy: 62%&quot;). When the decision threshold is set arbitrarily at 50%, an image with 51% confidence is treated identically to one with 99% confidence.
          </p>

          <p className="text-sm text-slate-600 leading-relaxed">
            <strong>Split conformal prediction</strong> calculates non-conformity scores on a separate held-out calibration set. Given a user-specified significance level $\alpha$ (e.g. 0.05), it constructs a prediction set $C(X)$ that is mathematically guaranteed to contain the true clinical label at least $1 - \alpha$ (95%) of the time:
          </p>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center font-mono text-xs text-slate-800">
            P(Y_test ∈ C(X_test)) ≥ 1 - α
          </div>

          <p className="text-sm text-slate-600 leading-relaxed">
            <strong>Why prediction sets can contain multiple classes:</strong> When the radiograph contains overlapping infiltrative and nodular features that cannot be separated with 95% statistical confidence, the conformal layer includes <em>both</em> labels in the set.
          </p>
        </section>

        {/* Safety Policy & Abstention Explained */}
        <section className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-purple-700">
            <ShieldCheck className="w-5 h-5" />
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Safety Abstention vs Diagnosis
            </h2>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed">
            <strong>What triggers abstention?</strong> Under LUNGUARD&apos;s configurable policy engine:
          </p>

          <ul className="text-xs sm:text-sm text-slate-700 space-y-2 list-disc list-inside">
            <li>
              <strong>Multi-Class High-Risk Overlap:</strong> The prediction set contains both an infectious class (TB) and a neoplastic class (Malignancy).
            </li>
            <li>
              <strong>Empty Prediction Set:</strong> If the model encounters an atypical out-of-distribution CXR where no class conforms, the set is empty, triggering immediate abstention.
            </li>
            <li>
              <strong>Borderline Sensitivity Margin:</strong> When malignancy logit falls within the safety threshold band.
            </li>
          </ul>

          <div className="p-3.5 rounded-lg bg-purple-50 border border-purple-200 text-xs text-purple-950 font-medium">
            <strong>CRITICAL DISTINCTION:</strong> An &quot;Uncertain / Dual-Risk&quot; classification does <strong>NOT</strong> mean the patient has dual disease (concurrent TB and lung cancer). It means the artificial intelligence model cannot reliably distinguish them, and safety policy forces clinician escalation.
          </div>
        </section>
      </div>

      {/* Statistical Guarantees vs Engineering Targets */}
      <section className="p-6 sm:p-8 rounded-xl bg-amber-50 border-2 border-amber-300 text-amber-950 space-y-4">
        <div className="flex items-center space-x-2 text-amber-900">
          <AlertTriangle className="w-6 h-6 text-amber-700 shrink-0" />
          <h2 className="text-xl font-bold tracking-tight">
            Statistical Coverage vs Engineering Target (98% Sensitivity)
          </h2>
        </div>

        <div className="space-y-3 text-xs sm:text-sm leading-relaxed text-amber-900">
          <p>
            It is essential for technical judges and clinical reviewers to understand what conformal prediction guarantees and what it does <strong>not</strong> guarantee:
          </p>

          <ul className="list-disc list-inside space-y-1.5 pl-1">
            <li>
              <strong>Coverage Guarantee:</strong> Conformal prediction provides marginal coverage $1 - \alpha$ <em>only under the assumption of exchangeability</em> (the patient population in deployment must follow the exact same data-generating distribution as the held-out calibration set). If a hospital uses different X-ray equipment or serves a different demographic, exchangeability can be violated.
            </li>
            <li>
              <strong>Coverage is NOT Sensitivity:</strong> Conformal coverage guarantees that the set contains the true label, but does not dictate which class is chosen or prevent set size from ballooning.
            </li>
            <li>
              <strong>The 98% Malignancy-Sensitivity Target:</strong> The 98% figure is an <strong>ENGINEERING SAFETY TARGET</strong> requiring rigorous independent validation on multi-center external cohorts. <strong>It is NOT an achieved clinical result in this Round 2 prototype.</strong>
            </li>
          </ul>
        </div>
      </section>

      {/* Planned Architecture Breakdown: Implemented vs Planned */}
      <section className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Planned Full-Stack Architecture Status
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Transparent disclosure of Round 2 prototype deliverables vs subsequent roadmap modules
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Implemented */}
          <div className="p-4 rounded-lg bg-teal-50/60 border border-teal-200 space-y-3">
            <span className="font-bold text-teal-800 uppercase tracking-wider block flex items-center">
              <CheckCircle className="w-4 h-4 mr-1.5 text-teal-600" />
              Implemented in This Phase (Round 2)
            </span>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-start space-x-2">
                <span className="text-teal-600 font-bold">✓</span>
                <span>Complete React + TypeScript + Tailwind CSS clinical workstation UI.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-teal-600 font-bold">✓</span>
                <span>Client-side binary validation: MIME types, magic bytes, dimensions, and image decoding.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-teal-600 font-bold">✓</span>
                <span>Simulated Demo Mode engine with 4 scripted clinical scenarios and dynamic canvas heatmaps.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-teal-600 font-bold">✓</span>
                <span>Runtime Zod schema validation & neutral error state isolation.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-teal-600 font-bold">✓</span>
                <span>Interactive Grad-CAM opacity overlay, print stylesheet, and accessible keyboard navigation.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-teal-600 font-bold">✓</span>
                <span>Formal REST API contract documentation (`docs/API_CONTRACT.md`).</span>
              </li>
            </ul>
          </div>

          {/* Planned */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
            <span className="font-bold text-slate-700 uppercase tracking-wider block flex items-center">
              <Sparkles className="w-4 h-4 mr-1.5 text-slate-500" />
              Planned for Backend Phase (Subsequent Track)
            </span>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-start space-x-2">
                <span className="text-slate-400 font-bold">○</span>
                <span>FastAPI Python service hosting asynchronous model inference workers.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-slate-400 font-bold">○</span>
                <span>PyTorch / TorchXRayVision DenseNet-121 fine-tuned weights on multi-cohort datasets.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-slate-400 font-bold">○</span>
                <span>MAPIE / split conformal layer calibrated on an independent hospital holdout set.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-slate-400 font-bold">○</span>
                <span>Real-time PyTorch Grad-CAM computation on penultimate convolutional layers.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-slate-400 font-bold">○</span>
                <span>DICOM PACS / Orthanc connector integration for institutional deployment.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
