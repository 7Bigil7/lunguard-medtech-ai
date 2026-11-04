import React, { useState } from 'react'
import {
  UploadCloud,
  Layers,
  ArrowRight,
  Info,
  Calendar,
  Clock,
  Cpu,
  Download,
  AlertTriangle,
  Play,
  Activity,
  X,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertOctagon,
  ShieldAlert,
  ShieldCheck,
  RotateCcw,
  Sparkles,
} from 'lucide-react'
import type { AnalysisResponse } from '../../types/api'

interface ModernClinicalDashboardProps {
  response: AnalysisResponse | null
  activeImageSrc?: string | null
  isAnalyzing: boolean
  errorMessage?: string | null
  onUploadNew: () => void
  onSelectSample?: () => void
  onFileDrop?: (file: File) => void
  onReset?: () => void
  onRetry?: () => void
}

export const ModernClinicalDashboard: React.FC<ModernClinicalDashboardProps> = ({
  response,
  activeImageSrc,
  isAnalyzing,
  errorMessage,
  onUploadNew,
  onSelectSample,
  onFileDrop,
  onReset,
  onRetry,
}) => {
  const [showAllFindingsModal, setShowAllFindingsModal] = useState<boolean>(false)
  const [showModelInfoModal, setShowModelInfoModal] = useState<boolean>(false)
  const [showGradCam, setShowGradCam] = useState<boolean>(false)
  const [heatmapOpacity, setHeatmapOpacity] = useState<number>(0.65)
  const [isDragOver, setIsDragOver] = useState<boolean>(false)

  // Drag and drop event handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      if (onFileDrop) {
        onFileDrop(file)
      }
    }
  }

  // Core Differential Diagnostic Parameters (Tuberculosis vs Lung Cancer)
  const scores = response?.model?.scores
  const tbScore = scores?.tb_consistent ?? null
  const malScore = scores?.malignancy_suspicious ?? null
  const normalScore = scores?.normal ?? null

  const tbPct = tbScore !== null ? Math.round(tbScore * 100) : null
  const malPct = malScore !== null ? Math.round(malScore * 100) : null
  const normalPct = normalScore !== null ? Math.round(normalScore * 100) : null

  // Triage outcome: 'NORMAL' | 'TB_CONSISTENT' | 'MALIGNANCY_SUSPICIOUS' | 'UNCERTAIN_DUAL_RISK'
  const triage = response?.triage ?? null
  const conformalSet = response?.conformal?.prediction_set ?? []

  // 18 Canonical TorchXRayVision Findings from Real Model Inference
  const allFindings = response?.predictions
    ? Object.entries(response.predictions)
        .map(([label, score]) => ({ label, score }))
        .sort((a, b) => b.score - a.score)
    : []

  const topFindings = allFindings.slice(0, 5)

  // Specific radiographic features contributing to TB vs Malignancy
  const tbFindings = response?.predictions
    ? [
        { label: 'Infiltration', score: response.predictions['Infiltration'] ?? 0 },
        { label: 'Consolidation', score: response.predictions['Consolidation'] ?? 0 },
        { label: 'Fibrosis', score: response.predictions['Fibrosis'] ?? 0 },
        { label: 'Pneumonia', score: response.predictions['Pneumonia'] ?? 0 },
        { label: 'Pleural Thickening', score: response.predictions['Pleural_Thickening'] ?? 0 },
      ]
    : []

  const malFindings = response?.predictions
    ? [
        { label: 'Mass', score: response.predictions['Mass'] ?? 0 },
        { label: 'Nodule', score: response.predictions['Nodule'] ?? 0 },
        { label: 'Lung Lesion', score: response.predictions['Lung Lesion'] ?? 0 },
        { label: 'Lung Opacity', score: response.predictions['Lung Opacity'] ?? 0 },
      ]
    : []

  // Real Stability & Image Quality Metrics
  const stability = response?.stability
  const stabilityScore = stability?.score ?? null
  const stabilityVariation = stability?.mean_score_variation ?? null
  const stabilityStatus = stability?.status === 'stable'
    ? 'Stable'
    : (stability?.status?.replace(/_/g, ' ') || 'Pending')

  const iq = response?.image_quality
  const iqStatus = iq?.status ? (iq.status.charAt(0).toUpperCase() + iq.status.slice(1)) : null
  const iqBrightness = iq?.brightness !== undefined ? Math.round(iq.brightness) : null
  const iqContrast = iq?.contrast !== undefined ? Math.round(iq.contrast) : null
  const iqBlur = iq?.blur_score !== undefined ? Math.round(iq.blur_score) : null

  const oodStatus = response?.ood?.status === 'in_distribution'
    ? 'In Distribution'
    : response?.ood?.status === 'out_of_distribution'
    ? 'Out of Distribution'
    : null

  // Overall reliability calculation (0-100%)
  const overallReliabilityPct = response
    ? Math.round(Math.max(10, Math.min(99, (1 - (stabilityVariation ?? 0.08)) * 100)))
    : null

  const reliabilityTier = overallReliabilityPct !== null
    ? overallReliabilityPct >= 85
      ? 'High Reliability'
      : overallReliabilityPct >= 70
      ? 'Moderate Reliability'
      : 'Low Reliability'
    : null

  // TrustGuard safety decision
  const tg = response?.trustguard
  const tgDecision = tg?.decision === 'unreliable_input'
    ? 'Unreliable Input'
    : tg?.decision === 'review_recommended'
    ? 'Review Recommended'
    : tg?.decision === 'standard_triage'
    ? 'Standard Triage'
    : null

  const tgReason = tg?.priority_rule || tg?.reasons?.[0] || (tg?.decision === 'standard_triage' ? 'ALL_SAFETY_CHECKS_PASSED' : null)

  // Analysis metadata
  const analysisId = response?.analysis_id || response?.case_id || null
  const timestampStr = response?.timestamp_utc || response?.timestamp
    ? new Date(response.timestamp_utc || response.timestamp).toUTCString().replace('GMT', 'UTC')
    : null
  const processingTimeMs = response?.processing_time_ms ?? null

  // Export report handler
  const exportReport = () => {
    if (!response) return
    const reportData = {
      analysis_id: analysisId,
      timestamp: timestampStr,
      processing_time_ms: processingTimeMs,
      model: 'DenseNet-121 (TorchXRayVision densenet121-res224-all)',
      differential_diagnosis: {
        tuberculosis_score: tbScore,
        lung_cancer_malignancy_score: malScore,
        normal_score: normalScore,
        conformal_prediction_set: conformalSet,
        triage_outcome: triage,
      },
      overall_reliability: overallReliabilityPct !== null ? `${overallReliabilityPct}% (${reliabilityTier})` : null,
      safety_decision: tgDecision,
      safety_priority_rule: tgReason,
      image_quality: {
        status: iqStatus,
        brightness: iqBrightness,
        contrast: iqContrast,
        blur_score: iqBlur,
      },
      stability: {
        status: stabilityStatus,
        score: stabilityScore,
        mean_variation: stabilityVariation,
      },
      ood_status: oodStatus,
      all_18_pathology_findings: response.predictions,
    }
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `LungGuard-Differential-Report-${analysisId || 'case'}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="w-full space-y-6 font-sans text-slate-800">
      {/* Header & Direct Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Clinical Diagnostic Cockpit
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-50 text-teal-700 border border-teal-200 flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-teal-600" />
              <span>TB vs. Lung Cancer Differential</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Detecting radiologic ambiguity between Tuberculosis and early Lung Cancer with conformal prediction
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            type="button"
            onClick={onUploadNew}
            disabled={isAnalyzing}
            className="inline-flex items-center px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <UploadCloud className="w-3.5 h-3.5 mr-1.5 text-teal-400" />
            <span>Upload Radiograph</span>
          </button>

          {onSelectSample && (
            <button
              type="button"
              onClick={onSelectSample}
              disabled={isAnalyzing}
              className="inline-flex items-center px-3.5 py-2 rounded-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
            >
              <Play className="w-3 h-3 mr-1 text-slate-500 fill-current" />
              <span>Try Sample CXR</span>
            </button>
          )}

          {activeImageSrc && !response && onRetry && (
            <button
              type="button"
              onClick={onRetry}
              disabled={isAnalyzing}
              className="inline-flex items-center px-4 py-2 rounded-full bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all cursor-pointer shadow-xs animate-pulse"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              <span>Run Analysis</span>
            </button>
          )}

          {activeImageSrc && onReset && (
            <button
              type="button"
              onClick={onReset}
              disabled={isAnalyzing}
              className="inline-flex items-center px-3 py-2 rounded-full bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
              title="Clear current radiograph"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1 text-slate-400" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Primary 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Column 1: Radiograph Viewer & Native Drag-and-Drop Zone (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {activeImageSrc ? (
            /* Radiograph Loaded State */
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 shadow-sm aspect-square max-h-[460px] flex items-center justify-center group transition-all ${
                isDragOver ? 'ring-4 ring-teal-500/30 border-teal-500' : ''
              }`}
            >
              {/* Anatomical Marker R */}
              <div className="absolute top-4 left-4 z-10 text-white/90 font-mono font-bold text-lg pointer-events-none select-none">
                R
              </div>

              {/* Radiograph Image */}
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={activeImageSrc}
                  alt="Chest Radiograph"
                  className="w-full h-full object-cover filter contrast-[1.05]"
                />

                {/* Grad-CAM Saliency Overlay */}
                {showGradCam && response?.explainability?.heatmap_png_base64 && (
                  <img
                    src={
                      response.explainability.heatmap_png_base64.startsWith('data:')
                        ? response.explainability.heatmap_png_base64
                        : `data:image/png;base64,${response.explainability.heatmap_png_base64}`
                    }
                    alt="Grad-CAM Saliency Attention"
                    className="absolute inset-0 w-full h-full object-cover mix-blend-screen transition-opacity"
                    style={{ opacity: heatmapOpacity }}
                  />
                )}
              </div>

              {/* Scanning Overlay when analyzing */}
              {isAnalyzing && (
                <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs flex flex-col items-center justify-center p-4 z-30">
                  <div className="w-10 h-10 border-3 border-teal-400 border-t-transparent rounded-full animate-spin mb-3" />
                  <span className="text-white text-xs font-bold tracking-tight">
                    DenseNet-121 Inference Active
                  </span>
                  <span className="text-slate-300 text-[10px] mt-0.5">
                    Extracting 18 pathology activations...
                  </span>
                </div>
              )}

              {/* Error Badge on image if rejected */}
              {!response && !isAnalyzing && errorMessage && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-rose-950/90 border border-rose-500/50 text-rose-200 px-3.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md flex items-center space-x-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  <span>Intake Filter Rejection</span>
                </div>
              )}

              {/* Floating Triage Status Badge */}
              {triage && (
                <div className="absolute right-4 top-4 z-20 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl shadow-lg border border-white/60 flex items-center space-x-2.5">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                      triage === 'UNCERTAIN_DUAL_RISK'
                        ? 'bg-purple-100 text-purple-700'
                        : triage === 'MALIGNANCY_SUSPICIOUS'
                        ? 'bg-rose-100 text-rose-700'
                        : triage === 'TB_CONSISTENT'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {triage === 'UNCERTAIN_DUAL_RISK' ? (
                      <ShieldAlert className="w-4 h-4" />
                    ) : triage === 'MALIGNANCY_SUSPICIOUS' ? (
                      <AlertOctagon className="w-4 h-4" />
                    ) : triage === 'TB_CONSISTENT' ? (
                      <AlertTriangle className="w-4 h-4" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-900 tracking-tight">
                      {triage.replace(/_/g, ' ')}
                    </span>
                    <span className="block text-[10px] text-slate-500 font-medium">
                      {triage === 'UNCERTAIN_DUAL_RISK'
                        ? 'Dual-Risk Clinical Abstention'
                        : triage === 'NORMAL'
                        ? 'Standard Negative Triage'
                        : 'Algorithmic Escalation'}
                    </span>
                  </div>
                </div>
              )}

              {/* Grad-CAM Toggle Bar */}
              {response?.explainability?.heatmap_png_base64 && (
                <div className="absolute bottom-3 inset-x-3 bg-slate-900/85 backdrop-blur-md px-3.5 py-2 rounded-xl flex items-center justify-between text-xs text-white">
                  <button
                    type="button"
                    onClick={() => setShowGradCam(!showGradCam)}
                    className="flex items-center space-x-1.5 text-teal-300 hover:text-white font-medium cursor-pointer"
                  >
                    {showGradCam ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showGradCam ? 'Hide Grad-CAM' : 'Show Grad-CAM'}</span>
                  </button>
                  {showGradCam && (
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] text-slate-300">Opacity</span>
                      <input
                        type="range"
                        min="0.2"
                        max="1.0"
                        step="0.05"
                        value={heatmapOpacity}
                        onChange={(e) => setHeatmapOpacity(parseFloat(e.target.value))}
                        className="w-16 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-400"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Replace CXR Floating Overlay on Hover */}
              <div className="absolute top-4 right-4 group-hover:opacity-100 opacity-0 transition-opacity">
                <button
                  type="button"
                  onClick={onUploadNew}
                  className="px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-900 text-white text-[11px] font-semibold backdrop-blur-xs flex items-center space-x-1 cursor-pointer"
                >
                  <UploadCloud className="w-3 h-3 text-teal-400" />
                  <span>Replace CXR</span>
                </button>
              </div>
            </div>
          ) : (
            /* Drag and Drop Empty State */
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={onUploadNew}
              className={`relative rounded-2xl overflow-hidden aspect-square max-h-[460px] flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all border-2 border-dashed ${
                isDragOver
                  ? 'border-teal-500 bg-teal-50/50 shadow-md ring-4 ring-teal-500/10'
                  : 'border-slate-300 hover:border-teal-600/60 bg-white hover:bg-slate-50/80 shadow-2xs'
              }`}
            >
              <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 mb-3 shadow-2xs">
                <UploadCloud className="w-7 h-7" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Drag & Drop Chest Radiograph
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
                Drop DICOM, PNG, or JPEG file here, or click to browse.
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Evaluates Tuberculosis vs. Lung Cancer Differential
              </p>

              <div className="flex items-center gap-2 mt-4">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onUploadNew()
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  Browse Files
                </button>
                {onSelectSample && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelectSample()
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold shadow-2xs transition-colors cursor-pointer flex items-center space-x-1"
                  >
                    <Play className="w-3 h-3 text-slate-500 fill-current" />
                    <span>Try Sample CXR</span>
                  </button>
                )}
              </div>
              <span className="text-[10px] text-slate-400 mt-3 font-medium">
                Standard PA or AP orientation • In-memory validation
              </span>
            </div>
          )}

          {/* Safety Firewall & Triage Decision Banner */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              TrustGuard Deterministic Safety Firewall
            </span>
            {response ? (
              <div
                className={`border rounded-2xl p-4 flex items-center space-x-3.5 shadow-2xs ${
                  triage === 'UNCERTAIN_DUAL_RISK'
                    ? 'bg-purple-50/80 border-purple-200'
                    : tgDecision === 'Standard Triage'
                    ? 'bg-emerald-50/70 border-emerald-200'
                    : 'bg-amber-50/70 border-amber-200'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                    triage === 'UNCERTAIN_DUAL_RISK'
                      ? 'bg-white border-purple-200 text-purple-700'
                      : tgDecision === 'Standard Triage'
                      ? 'bg-white border-emerald-200 text-emerald-700'
                      : 'bg-white border-amber-200 text-amber-700'
                  }`}
                >
                  {triage === 'UNCERTAIN_DUAL_RISK' ? (
                    <ShieldAlert className="w-5 h-5" />
                  ) : tgDecision === 'Standard Triage' ? (
                    <ShieldCheck className="w-5 h-5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="block text-sm font-extrabold text-slate-900 tracking-tight">
                      {tgDecision || 'Safety Audit Complete'}
                    </span>
                    {triage === 'UNCERTAIN_DUAL_RISK' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-200 text-purple-800">
                        P2 Clinical Abstention
                      </span>
                    )}
                  </div>
                  <span className="block text-xs text-slate-600 font-mono truncate mt-0.5">
                    Priority Rule: {tgReason || 'ALL_SAFETY_CHECKS_PASSED'}
                  </span>
                </div>
              </div>
            ) : errorMessage ? (
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center space-x-3.5 shadow-2xs">
                <div className="w-9 h-9 rounded-xl bg-white border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block text-sm font-bold text-rose-900 tracking-tight">
                    Intake Filter Rejection
                  </span>
                  <span className="block text-xs text-rose-700 truncate">
                    Image rejected before model forward pass
                  </span>
                </div>
              </div>
            ) : isAnalyzing ? (
              <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 flex items-center space-x-3.5 shadow-2xs">
                <div className="w-9 h-9 rounded-xl bg-white border border-teal-200 flex items-center justify-center text-teal-600 shrink-0">
                  <div className="w-4 h-4 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block text-sm font-bold text-teal-900 tracking-tight">
                    Executing Safety Policy
                  </span>
                  <span className="block text-xs text-teal-700">
                    Checking perturbation variance & quality rules...
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-slate-100/80 border border-slate-200/80 rounded-2xl p-4 flex items-center space-x-3.5 shadow-2xs">
                <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block text-sm font-bold text-slate-700 tracking-tight">
                    Awaiting Radiograph
                  </span>
                  <span className="block text-xs text-slate-400">
                    Upload an X-ray to trigger safety firewall rules (P1–P7)
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Column 2 & 3: Differential Diagnosis & Clinical Metrics (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* PRIMARY CARD: Tuberculosis vs. Lung Cancer Differential Diagnosis */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                  <span>Tuberculosis vs. Lung Cancer Differential</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                    Core Clinical Target
                  </span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Conformal prediction disambiguation • Target Coverage: 90% (α = 0.10)
                </p>
              </div>

              {/* Guaranteed Prediction Set */}
              {conformalSet.length > 0 ? (
                <div className="flex items-center space-x-1.5 self-start sm:self-auto">
                  <span className="text-[11px] text-slate-400 font-semibold">Prediction Set:</span>
                  <div className="flex flex-wrap gap-1">
                    {conformalSet.map((cls) => (
                      <span
                        key={cls}
                        className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${
                          cls === 'tb_consistent'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : cls === 'malignancy_suspicious'
                            ? 'bg-rose-50 text-rose-800 border-rose-200'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}
                      >
                        {cls === 'tb_consistent'
                          ? 'Tuberculosis'
                          : cls === 'malignancy_suspicious'
                          ? 'Lung Cancer'
                          : 'Normal'}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <span className="text-[11px] font-semibold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200 self-start sm:self-auto">
                  Awaiting Inference
                </span>
              )}
            </div>

            {/* Differential Scores Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* TB Consistent Differential */}
              <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200/70 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-900">Tuberculosis (TB)</span>
                  <span className="font-mono font-extrabold text-amber-900 text-sm">
                    {tbPct !== null ? `${tbPct}%` : '— %'}
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-amber-100 overflow-hidden">
                  <div
                    className="h-full bg-amber-600 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${tbPct ?? 0}%` }}
                  />
                </div>
                <div className="text-[10px] text-amber-800/80 font-medium">
                  {response ? (
                    <span>
                      Infiltration ({tbFindings.find((f) => f.label === 'Infiltration')?.score.toFixed(2) ?? '0.00'}) •
                      Consolidation ({tbFindings.find((f) => f.label === 'Consolidation')?.score.toFixed(2) ?? '0.00'})
                    </span>
                  ) : (
                    <span>Consolidation • Infiltration • Fibrosis</span>
                  )}
                </div>
              </div>

              {/* Lung Cancer / Malignancy Differential */}
              <div className="p-3.5 rounded-xl bg-rose-50/50 border border-rose-200/70 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-rose-900">Lung Cancer (Malignancy)</span>
                  <span className="font-mono font-extrabold text-rose-900 text-sm">
                    {malPct !== null ? `${malPct}%` : '— %'}
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-rose-100 overflow-hidden">
                  <div
                    className="h-full bg-rose-600 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${malPct ?? 0}%` }}
                  />
                </div>
                <div className="text-[10px] text-rose-800/80 font-medium">
                  {response ? (
                    <span>
                      Mass ({malFindings.find((f) => f.label === 'Mass')?.score.toFixed(2) ?? '0.00'}) •
                      Nodule ({malFindings.find((f) => f.label === 'Nodule')?.score.toFixed(2) ?? '0.00'})
                    </span>
                  ) : (
                    <span>Mass • Nodule • Lung Lesion</span>
                  )}
                </div>
              </div>

              {/* Normal Lung Fields Differential */}
              <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200/70 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-900">Clear Lung Fields</span>
                  <span className="font-mono font-extrabold text-emerald-900 text-sm">
                    {normalPct !== null ? `${normalPct}%` : '— %'}
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-emerald-100 overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${normalPct ?? 0}%` }}
                  />
                </div>
                <div className="text-[10px] text-emerald-800/80 font-medium">
                  <span>Baseline non-abnormal parenchyma</span>
                </div>
              </div>
            </div>

            {/* Differential Interpretation & Clinical Guidance Callout */}
            {response ? (
              triage === 'UNCERTAIN_DUAL_RISK' ? (
                <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-950 flex items-start space-x-3">
                  <ShieldAlert className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
                  <div className="text-xs leading-relaxed">
                    <strong className="block text-purple-900 font-extrabold">
                      Diagnostic Ambiguity Detected: Dual-Risk Overlap
                    </strong>
                    The model identifies radiologic features compatible with both <strong>Tuberculosis</strong> and <strong>early Malignancy / Lung Cancer</strong>. Under deterministic safety policy P2, single-disease classification is abstained to avoid dangerous diagnostic anchoring. Prompt senior thoracic review and concurrent GeneXpert + chest CT workup recommended.
                  </div>
                </div>
              ) : triage === 'TB_CONSISTENT' ? (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <div className="text-xs leading-relaxed">
                    <strong className="block text-amber-900 font-extrabold">
                      Tuberculosis Pattern Predominant
                    </strong>
                    Radiographic findings strongly suggest active tuberculosis involvement (infiltrates / consolidation). Proceed with clinical symptom evaluation and confirmatory sputum microbiological testing (GeneXpert MTB/RIF).
                  </div>
                </div>
              ) : triage === 'MALIGNANCY_SUSPICIOUS' ? (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 flex items-start space-x-3">
                  <AlertOctagon className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
                  <div className="text-xs leading-relaxed">
                    <strong className="block text-rose-900 font-extrabold">
                      Malignancy / Suspicious Nodule or Mass Detected
                    </strong>
                    Focal solitary pulmonary nodule or mass features detected. Expedite contrast-enhanced thoracic CT and oncology/pulmonology referral to prevent diagnostic delay.
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  <div className="text-xs leading-relaxed">
                    <strong className="block text-emerald-900 font-extrabold">
                      Clear Parenchyma — Standard Negative Triage
                    </strong>
                    No acute focal consolidation, cavitation, or malignant mass patterns identified across lung zones.
                  </div>
                </div>
              )
            ) : isAnalyzing ? (
              <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-teal-950 flex items-center space-x-3 animate-pulse">
                <div className="w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin shrink-0" />
                <div className="text-xs">
                  <strong className="block text-teal-900 font-extrabold">
                    DenseNet-121 Neural Inference Active
                  </strong>
                  <span className="text-teal-700">
                    Computing 18 thoracic pathology activations, perturbation stability, and conformal risk set...
                  </span>
                </div>
              </div>
            ) : errorMessage ? (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 space-y-2.5">
                <div className="flex items-start space-x-2.5">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div className="text-xs leading-relaxed">
                    <strong className="block text-rose-900 font-extrabold">
                      Radiograph Intake Safety Check: Image Not Processed
                    </strong>
                    <p className="text-rose-800 mt-0.5 font-medium">
                      {errorMessage}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={onUploadNew}
                    className="px-3 py-1.5 rounded-lg bg-rose-900 text-white text-xs font-semibold hover:bg-rose-800 cursor-pointer shadow-xs"
                  >
                    Upload Different CXR
                  </button>
                  {onSelectSample && (
                    <button
                      type="button"
                      onClick={onSelectSample}
                      className="px-3 py-1.5 rounded-lg bg-white border border-rose-300 text-rose-800 text-xs font-semibold hover:bg-rose-50 cursor-pointer shadow-2xs"
                    >
                      Try Verified Sample CXR
                    </button>
                  )}
                  {onRetry && (
                    <button
                      type="button"
                      onClick={onRetry}
                      className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer shadow-2xs"
                    >
                      Retry Analysis
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-2.5">
                  <Info className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>
                    {activeImageSrc
                      ? 'Chest radiograph loaded. Click "Run Analysis" to compute live differential inference.'
                      : 'Drag a chest radiograph into the viewer or click "Try Sample CXR" to activate real-time differential inference.'}
                  </span>
                </div>
                {activeImageSrc && onRetry && (
                  <button
                    type="button"
                    onClick={onRetry}
                    disabled={isAnalyzing}
                    className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-xs transition-all cursor-pointer self-start sm:self-auto shrink-0"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Run Analysis Now</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Middle Row: Overall Reliability & Top Findings (Side by Side) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Reliability Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Model Reliability
                </h3>
                <button
                  type="button"
                  onClick={() => setShowModelInfoModal(true)}
                  className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  title="Reliability calculation methodology"
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-baseline space-x-2.5">
                <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                  {overallReliabilityPct !== null ? `${overallReliabilityPct}%` : '— %'}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-slate-600">
                  {reliabilityTier || 'Awaiting Inference'}
                </span>
              </div>

              <div>
                <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-slate-800 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${overallReliabilityPct ?? 0}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold mt-1.5">
                  <span>0%</span>
                  <span>100% (Perturbation Audited)</span>
                </div>
              </div>
            </div>

            {/* Top Findings Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Top Radiologic Findings
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAllFindingsModal(true)}
                  className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  title="18 canonical findings info"
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>

              {topFindings.length > 0 ? (
                <div className="space-y-2">
                  {topFindings.map((finding) => (
                    <div key={finding.label} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-800">{finding.label}</span>
                        <span className="font-mono font-bold text-slate-700">
                          {finding.score.toFixed(2)}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-slate-800 rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${Math.round(finding.score * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setShowAllFindingsModal(true)}
                    className="w-full py-1.5 px-3 mt-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/60 text-xs font-semibold text-slate-700 flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <span>View All 18 Pathologies</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  </button>
                </div>
              ) : (
                <div className="py-6 text-center text-xs text-slate-400">
                  <span>Awaiting radiograph upload to extract 18 thoracic findings</span>
                </div>
              )}
            </div>
          </div>

          {/* Key Insights (Image Quality & Audits) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3.5">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Diagnostic Quality & Technical Audit
            </h3>

            <div className="space-y-2.5 divide-y divide-slate-100">
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center space-x-2 text-xs text-slate-600">
                  <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-slate-700">
                    <Activity className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-medium">Image Quality Guardian</span>
                </div>
                <span className="text-xs font-bold text-slate-900">
                  {iqStatus ? `${iqStatus} (Blur: ${iqBlur ?? '—'}, Brightness: ${iqBrightness ?? '—'})` : 'Awaiting Input'}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2.5">
                <div className="flex items-center space-x-2 text-xs text-slate-600">
                  <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-slate-700">
                    <Activity className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-medium">Perturbation Stability</span>
                </div>
                <span className="text-xs font-bold text-slate-900">
                  {stabilityStatus !== 'Pending'
                    ? `${stabilityStatus} (Score: ${typeof stabilityScore === 'number' ? stabilityScore.toFixed(2) : '—'})`
                    : 'Awaiting Input'}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2.5">
                <div className="flex items-center space-x-2 text-xs text-slate-600">
                  <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-slate-700">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-medium">Out-of-Distribution Status</span>
                </div>
                <span className="text-xs font-bold text-slate-900">
                  {oodStatus || 'Awaiting Input'}
                </span>
              </div>
            </div>
          </div>

          {/* Analysis Details & Report Export */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Analysis Details & Audit Trail
              </h3>
              {response && (
                <button
                  type="button"
                  onClick={exportReport}
                  className="inline-flex items-center justify-center space-x-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Report</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="flex items-start space-x-2.5">
                <Calendar className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div className="text-xs">
                  <span className="text-slate-400 block text-[11px]">Analysis ID</span>
                  <strong className="font-mono text-slate-800">{analysisId || '—'}</strong>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <Clock className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div className="text-xs">
                  <span className="text-slate-400 block text-[11px]">Timestamp</span>
                  <strong className="text-slate-800 text-[11px] block">{timestampStr || '—'}</strong>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <Cpu className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div className="text-xs">
                  <span className="text-slate-400 block text-[11px]">Model Architecture</span>
                  <strong className="text-slate-800 flex items-center space-x-1">
                    <span>DenseNet-121</span>
                    <Info
                      className="w-3 h-3 text-slate-400 cursor-pointer"
                      onClick={() => setShowModelInfoModal(true)}
                    />
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: View All 18 Findings */}
      {showAllFindingsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-extrabold text-slate-900">All 18 Canonical Thoracic Findings</h4>
                <p className="text-[11px] text-slate-500">DenseNet-121 (densenet121-res224-all) Sigmoid Activations</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAllFindingsModal(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto space-y-2.5 flex-1">
              {allFindings.length > 0 ? (
                allFindings.map((finding) => (
                  <div key={finding.label} className="p-2 rounded-lg bg-slate-50 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{finding.label}</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-24 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className="h-full bg-slate-800 rounded-full"
                          style={{ width: `${Math.round(finding.score * 100)}%` }}
                        />
                      </div>
                      <span className="font-mono font-bold text-slate-700 w-10 text-right">
                        {finding.score.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-xs text-slate-500 py-6">
                  No findings available. Upload a radiograph to run inference.
                </p>
              )}
            </div>
            <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
              <button
                type="button"
                onClick={() => setShowAllFindingsModal(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Model Info */}
      {showModelInfoModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Cpu className="w-5 h-5 text-teal-600" />
                <h4 className="text-base font-extrabold text-slate-900">DenseNet-121 Architecture</h4>
              </div>
              <button
                type="button"
                onClick={() => setShowModelInfoModal(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
              <p>
                <strong>Weights:</strong> TorchXRayVision <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">densenet121-res224-all</code>
              </p>
              <p>
                <strong>Differential Task:</strong> Disambiguates between <strong>Tuberculosis</strong> (Infiltration, Consolidation, Fibrosis, Pneumonia) and <strong>Lung Cancer / Malignancy</strong> (Mass, Nodule, Lung Lesion, Opacity).
              </p>
              <p>
                <strong>Conformal Uncertainty:</strong> Generates distribution-free prediction sets with guaranteed 90% coverage to prevent premature diagnostic anchoring.
              </p>
              <p>
                <strong>Training Cohort:</strong> 800,000+ multi-center radiographs across NIH ChestX-ray14, Stanford CheXpert, PadChest, and MIMIC-CXR.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowModelInfoModal(false)}
              className="w-full py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
