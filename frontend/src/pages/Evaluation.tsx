import React from 'react'
import rawEvaluationData from '../data/evaluation.json'
import {
  Clock,
  AlertCircle,
  Database,
  CheckSquare,
} from 'lucide-react'

interface DatasetMetric {
  dataset_name: string
  sample_size: number | null
  sensitivity_malignancy: number | null
  specificity: number | null
  coverage_conformal: number | null
  abstention_rate: number | null
  notes?: string
}

interface EvaluationResults {
  last_evaluated: string | null
  is_measured: boolean
  overall_metrics: {
    sensitivity_malignancy: number | null
    specificity: number | null
    precision: number | null
    recall: number | null
    f1_score: number | null
    auroc: number | null
    conformal_coverage: number | null
    avg_prediction_set_size: number | null
    abstention_rate: number | null
  }
  per_dataset_metrics: DatasetMetric[]
}

const data = rawEvaluationData as EvaluationResults

export const Evaluation: React.FC = () => {
  const formatMetric = (val: number | null, isPercent = true) => {
    if (val === null || val === undefined) {
      return (
        <span className="text-slate-400 font-mono text-xs italic">
          Not yet measured
        </span>
      )
    }
    return isPercent ? `${(val * 100).toFixed(1)}%` : val.toFixed(3)
  }

  const metricCards = [
    {
      title: 'Malignancy Sensitivity',
      value: data.overall_metrics.sensitivity_malignancy,
      target: '≥ 98.0% (Engineering Target, Unvalidated)',
      desc: 'Target to minimize false negatives on lung neoplastic lesions.',
    },
    {
      title: 'Overall Specificity',
      value: data.overall_metrics.specificity,
      target: 'Clinical baseline pending',
      desc: 'True negative clearance rate across non-pathological exams.',
    },
    {
      title: 'Precision (PPV)',
      value: data.overall_metrics.precision,
      target: 'To be determined',
      desc: 'Positive predictive value on abnormal cohorts.',
    },
    {
      title: 'Recall (Sensitivity)',
      value: data.overall_metrics.recall,
      target: 'To be determined',
      desc: 'Macro-averaged recall across all target classes.',
    },
    {
      title: 'F1 Score',
      value: data.overall_metrics.f1_score,
      target: 'To be determined',
      desc: 'Harmonic mean of precision and recall.',
    },
    {
      title: 'AUROC',
      value: data.overall_metrics.auroc,
      target: 'Discriminative ceiling pending',
      desc: 'Area Under Receiver Operating Characteristic Curve.',
    },
    {
      title: 'Conformal Marginal Coverage',
      value: data.overall_metrics.conformal_coverage,
      target: '1 - α = 95.0% Target',
      desc: 'Empirical coverage of true labels within prediction sets.',
    },
    {
      title: 'Average Prediction Set Size',
      value: data.overall_metrics.avg_prediction_set_size,
      target: '≤ 1.30 Classes (Efficiency Target)',
      desc: 'Measures set compactness and diagnostic resolution.',
      isPercent: false,
    },
    {
      title: 'Abstention Rate',
      value: data.overall_metrics.abstention_rate,
      target: 'Acceptable clinical workload margin',
      desc: 'Proportion of cases routed to Uncertain / Dual-Risk escalation.',
    },
  ]

  const datasets = [
    {
      name: 'NIH ChestX-ray14',
      size: '112,120 Frontal CXRs',
      focus: 'Multi-label thoracic abnormalities (Mass, Nodule, Infiltration)',
      caveat: 'Label extraction performed via automated NLP on radiology reports; known noise in fine-grained labels. TB is not an explicit primary class.',
    },
    {
      name: 'Shenzhen TB Dataset',
      size: '662 CXRs (336 TB positive, 326 Normal)',
      focus: 'Pulmonary Tuberculosis in an outpatient setting',
      caveat: 'Collected in Shenzhen, China. Malignancy status not assessed or annotated; cannot be used alone for co-occurrence validation.',
    },
    {
      name: 'Montgomery County TB Set',
      size: '138 CXRs (58 TB positive, 80 Normal)',
      focus: 'Tuberculosis screening in public health clinics',
      caveat: 'Small sample size. Acquired via specialized screening protocol; demographic and acquisition differences require calibration.',
    },
    {
      name: 'Stanford CheXpert',
      size: '224,316 Chest Radiographs',
      focus: '14 thoracic observations with uncertain label flags',
      caveat: 'Includes explicit uncertainty annotations from reports, but lack dedicated dual TB/Malignancy gold standard biopsies.',
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Page Header & Honest Status */}
      <div className="space-y-4 pb-6 border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <span className="p-1 rounded bg-slate-800 text-teal-300">
            <Clock className="w-5 h-5" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Empirical Validation Registry
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Model Evaluation & Benchmarking
            </h1>
            <p className="mt-1 text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
              Transparent reporting of model metrics, conformal calibration guarantees, and pending multi-center evaluation.
            </p>
          </div>

          {/* Honest Status Callout */}
          <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-300 text-xs text-slate-700 w-fit shrink-0 space-y-1">
            <div className="flex items-center space-x-1.5 font-bold text-slate-900">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>Status: Evaluation pending.</span>
            </div>
            <p className="text-[11px] text-slate-500">
              No measured results are available yet. No fabricated numbers are displayed.
            </p>
          </div>
        </div>
      </div>

      {/* Target Metrics Grid */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Target Metrics & Current Measurements
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Metrics will be populated automatically when `src/data/evaluation.json` receives validated test split results.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {metricCards.map((card) => (
            <div
              key={card.title}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {card.title}
                </span>
                <div className="text-2xl font-bold text-slate-900">
                  {formatMetric(card.value, card.isPercent ?? true)}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pt-1">
                  {card.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[11px] text-teal-800 bg-teal-50/50 p-2 rounded">
                <strong>Benchmark / Target:</strong> {card.target}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Datasets Under Consideration */}
      <section className="space-y-6">
        <div className="flex items-center space-x-2">
          <Database className="w-5 h-5 text-teal-600" />
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Datasets Under Consideration
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Developing an uncertainty-aware classifier for co-occurring or mimicking TB and malignancy requires multi-center calibration. The following public datasets are under active review:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {datasets.map((ds) => (
            <div key={ds.name} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm">{ds.name}</h3>
                <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                  {ds.size}
                </span>
              </div>
              <p className="text-xs text-slate-700">
                <strong>Cohort Focus:</strong> {ds.focus}
              </p>
              <div className="p-2.5 rounded bg-amber-50/80 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                <strong>Clinical & Label Caveat:</strong> {ds.caveat}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-xl bg-slate-100 border border-slate-300 text-xs text-slate-700 space-y-1">
          <p className="font-semibold text-slate-900">
            Important Dataset Harmonization Note:
          </p>
          <p className="leading-relaxed">
            These public datasets differ substantially in label definitions, acquisition protocols, scanner manufacturers, and clinical prevalence. They do <strong>NOT</strong> jointly provide confirmed gold-standard labels for both TB and lung malignancy simultaneously. Independent multi-reader validation and protocol harmonization remain to be verified before clinical claims can be made.
          </p>
        </div>
      </section>

      {/* Concept Explainer: Demonstration vs. Validated Evaluation */}
      <section className="bg-slate-900 text-white p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-md space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-400 block">
            Methodological Transparency
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
            Demonstration vs. Validated Evaluation: What Clinical Proof Requires
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
            In competitive medtech hackathons, it is common to conflate interactive code demonstrations with verified clinical performance. LUNGUARD explicitly separates prototype engineering from formal clinical evaluation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
            <span className="font-bold text-teal-300 block text-sm">1. Labeled Held-Out Test Cohort</span>
            <p className="text-slate-300 leading-relaxed">
              Must use an independent test cohort never seen during model training, hyperparameter tuning, or conformal threshold selection.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
            <span className="font-bold text-teal-300 block text-sm">2. Independent Calibration Split</span>
            <p className="text-slate-300 leading-relaxed">
              Conformal prediction guarantees mathematically require a separate calibration split (D_cal) strictly disjoint from the evaluation set (D_test).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
            <span className="font-bold text-teal-300 block text-sm">3. Patient-Level Separation</span>
            <p className="text-slate-300 leading-relaxed">
              Hospital admissions often take serial X-rays of the same patient. Splitting randomly by image causes severe data leakage; splits must occur strictly at the patient ID level.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
            <span className="font-bold text-teal-300 block text-sm">4. Multi-Center Subgroup Analysis</span>
            <p className="text-slate-300 leading-relaxed">
              Evaluating performance across distinct hospital systems, scanner manufacturers (GE, Siemens, Philips), pediatric/adult populations, and disease prevalence levels.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
            <span className="font-bold text-teal-300 block text-sm">5. Independent Radiologist Multi-Reader</span>
            <p className="text-slate-300 leading-relaxed">
              Multi-reader multi-case (MRMC) study measuring whether LUNGUARD&apos;s safety abstentions reduce actual diagnostic anchoring without imposing prohibitive review overhead.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-teal-950/60 border border-teal-700/60 space-y-2">
            <span className="font-bold text-teal-200 block text-sm">Current Submission Status</span>
            <p className="text-teal-100 leading-relaxed">
              Round 2 presents a working software prototype and deterministic safety policy. Rigorous clinical validation on multi-center data remains planned and unverified.
            </p>
          </div>
        </div>
      </section>

      {/* Illustrative Toy Concept Section: Clearly Watermarked */}
      <section className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-dashed border-amber-300 shadow-sm space-y-6 relative overflow-hidden">
        {/* Prominent Diagonal Watermark */}
        <div className="absolute top-3 right-3 sm:top-5 sm:right-5">
          <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-amber-400 text-slate-950 border border-amber-500 shadow-sm uppercase tracking-wider">
            ILLUSTRATIVE EXAMPLE (synthetic data, not model results)
          </span>
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 block">
            Pedagogical Concept Visualization
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-1">
            Understanding the Conformal Coverage vs. Abstention Trade-off
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
            The toy visualization below explains how tuning the target coverage level (1 - α) impacts prediction set size and safety policy abstention rates. <strong>These figures are hand-crafted pedagogical illustrations to demonstrate theoretical dynamics, NOT real model evaluation results.</strong>
          </p>
        </div>

        {/* Toy Comparison Table / Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
          {/* Tier 1 */}
          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-amber-200">
              <span className="font-bold text-slate-900 text-sm">Toy α = 0.10</span>
              <span className="text-xs font-mono font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded">
                90% Target Coverage
              </span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-700 font-mono">
              <div className="flex justify-between">
                <span>Toy Avg Set Size:</span>
                <span className="font-bold">1.12 classes</span>
              </div>
              <div className="flex justify-between">
                <span>Toy Multi-Class Sets:</span>
                <span className="font-bold">11%</span>
              </div>
              <div className="flex justify-between text-purple-900 font-bold">
                <span>Toy Abstention Rate:</span>
                <span>14%</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight pt-1">
              Narrower sets produce fewer abstentions, but higher risk that true diagnosis lies outside the set (10% nominal error rate).
            </p>
          </div>

          {/* Tier 2 */}
          <div className="p-4 rounded-xl bg-amber-100/60 border-2 border-amber-400 space-y-3 ring-1 ring-amber-300">
            <div className="flex items-center justify-between pb-2 border-b border-amber-300">
              <span className="font-bold text-slate-900 text-sm">Toy α = 0.05 (Default)</span>
              <span className="text-xs font-mono font-bold bg-amber-300 text-amber-950 px-2 py-0.5 rounded">
                95% Target Coverage
              </span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-700 font-mono">
              <div className="flex justify-between">
                <span>Toy Avg Set Size:</span>
                <span className="font-bold">1.48 classes</span>
              </div>
              <div className="flex justify-between">
                <span>Toy Multi-Class Sets:</span>
                <span className="font-bold">26%</span>
              </div>
              <div className="flex justify-between text-purple-900 font-bold">
                <span>Toy Abstention Rate:</span>
                <span>31%</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-700 leading-tight pt-1 font-medium">
              Balanced configuration: 95% marginal coverage with moderate abstention margin routed to multi-disciplinary review.
            </p>
          </div>

          {/* Tier 3 */}
          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-amber-200">
              <span className="font-bold text-slate-900 text-sm">Toy α = 0.01</span>
              <span className="text-xs font-mono font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded">
                99% Target Coverage
              </span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-700 font-mono">
              <div className="flex justify-between">
                <span>Toy Avg Set Size:</span>
                <span className="font-bold">2.35 classes</span>
              </div>
              <div className="flex justify-between">
                <span>Toy Multi-Class Sets:</span>
                <span className="font-bold">61%</span>
              </div>
              <div className="flex justify-between text-purple-900 font-bold">
                <span>Toy Abstention Rate:</span>
                <span>68%</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight pt-1">
              Extremely conservative: near-zero miss rate, but sets balloon to multi-class ambiguity and abstention rate becomes clinically burdensome.
            </p>
          </div>
        </div>

        <div className="p-3 bg-amber-50 border border-amber-300 rounded-lg text-center text-xs text-amber-900 font-medium">
          Note: This toy demonstration illustrates mathematical trade-offs only. LUNGUARD displays &quot;Not yet measured&quot; on all genuine performance benchmark slots.
        </div>
      </section>

      {/* What Remains to be Tested Checklist */}
      <section className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center space-x-2">
          <CheckSquare className="w-5 h-5 text-teal-600" />
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            What Remains to be Tested (Roadmap Checklist)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
            <span className="font-bold text-slate-900 block">1. Out-of-Distribution (OOD) Stress Testing</span>
            <p className="text-slate-600">Verify that atypical artifacts (pacemakers, jewelry, rotation, low exposure) trigger empty conformal sets or abstention.</p>
          </div>

          <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
            <span className="font-bold text-slate-900 block">2. Multi-Center Calibration Exchangeability</span>
            <p className="text-slate-600">Empirically measure coverage rates across external hospital test sets to assess distribution shift vulnerability.</p>
          </div>

          <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
            <span className="font-bold text-slate-900 block">3. Malignancy Sensitivity Validation (98% Target)</span>
            <p className="text-slate-600">Test safety policy thresholds against a dedicated cohort of subtle early-stage pulmonary nodules to prove miss-rate guarantees.</p>
          </div>

          <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
            <span className="font-bold text-slate-900 block">4. Radiologist Multi-Reader Study</span>
            <p className="text-slate-600">Assess whether the Uncertain / Dual-Risk escalation reduces diagnostic anchoring in simulated clinical review sessions.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
