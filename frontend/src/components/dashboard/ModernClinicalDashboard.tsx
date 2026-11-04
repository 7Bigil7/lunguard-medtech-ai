import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertTriangle,
  Calendar,
  Clock,
  Cpu,
  Download,
  Info,
  Layers,
  Activity,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  FileText,
  Home,
  Sliders,
  Settings,
  Eye,
  EyeOff,
  UploadCloud,
  CheckCircle2,
  Play,
  X,
} from 'lucide-react'
import type { AnalysisResponse } from '../../types/api'

interface ModernClinicalDashboardProps {
  response: AnalysisResponse | null
  activeImageSrc?: string | null
  isAnalyzing: boolean
  onUploadNew: () => void
  onSelectSample?: () => void
}

export const ModernClinicalDashboard: React.FC<ModernClinicalDashboardProps> = ({
  response,
  activeImageSrc,
  isAnalyzing,
  onUploadNew,
  onSelectSample,
}) => {
  const [showAllFindingsModal, setShowAllFindingsModal] = useState<boolean>(false)
  const [showModelInfoModal, setShowModelInfoModal] = useState<boolean>(false)
  const [showGradCam, setShowGradCam] = useState<boolean>(false)
  const [heatmapOpacity, setHeatmapOpacity] = useState<number>(0.65)

  // Derive findings list
  const allFindings = response?.predictions
    ? Object.entries(response.predictions)
        .map(([label, score]) => ({ label, score }))
        .sort((a, b) => b.score - a.score)
    : [
        { label: 'Consolidation', score: 0.82 },
        { label: 'Pneumonia', score: 0.73 },
        { label: 'Effusion', score: 0.61 },
        { label: 'Atelectasis', score: 0.42 },
        { label: 'Cardiomegaly', score: 0.34 },
      ]

  const topFindings = allFindings.slice(0, 5)

  // Derive reliability metrics
  const stability = response?.stability
  const stabilityScore = stability?.score ?? 0.08
  const stabilityStatus = stability?.status === 'stable' ? 'Stable' : (stability?.status?.replace(/_/g, ' ') || 'Stable')
  
  const iq = response?.image_quality
  const iqStatus = iq?.status ? (iq.status.charAt(0).toUpperCase() + iq.status.slice(1)) : 'Acceptable'
  
  const oodStatus = response?.ood?.status === 'in_distribution' ? 'In Distribution' : (response?.ood?.status ? 'Out of Distribution' : 'In Distribution')

  // Overall reliability calculation
  const overallReliabilityPct = Math.round(
    response
      ? Math.max(10, Math.min(98, (1 - (stability?.mean_score_variation ?? 0.08)) * 100))
      : 86
  )

  const reliabilityTier =
    overallReliabilityPct >= 85
      ? 'High Reliability'
      : overallReliabilityPct >= 70
      ? 'Moderate Reliability'
      : 'Low Reliability'

  // TrustGuard decision
  const tg = response?.trustguard
  const tgDecision = tg?.decision === 'unreliable_input'
    ? 'Unreliable Input'
    : tg?.decision === 'review_recommended'
    ? 'Review Recommended'
    : 'Standard Triage'

  const tgReason = tg?.priority_rule || tg?.reasons?.[0] || 'OOD_INPUT_DETECTED'

  // Analysis metadata
  const analysisId = response?.analysis_id || response?.case_id || 'LG-20250116-0017'
  const timestampStr = response?.timestamp
    ? new Date(response.timestamp).toUTCString().replace('GMT', 'UTC')
    : 'Jan 16, 2025 • 14:27 UTC'

  const exportReport = () => {
    const reportData = {
      analysis_id: analysisId,
      timestamp: timestampStr,
      model: 'DenseNet-121 (TorchXRayVision)',
      overall_reliability: `${overallReliabilityPct}% (${reliabilityTier})`,
      decision: tgDecision,
      decision_reason: tgReason,
      top_findings: topFindings,
      image_quality: iqStatus,
      stability: `${stabilityScore} (${stabilityStatus})`,
      ood_status: oodStatus,
    }
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `LungGuard-Report-${analysisId}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const displayImage = activeImageSrc || '/hero-cxr.jpg'

  return (
    <div className="w-full bg-[#f8f9fa] rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden text-slate-800 transition-all font-sans">
      {/* Main Body with Sidebar Rail */}
      <div className="flex flex-col lg:flex-row">
        {/* Left Vertical Navigation Rail */}
        <aside className="w-full lg:w-16 bg-white border-r border-slate-200/80 flex lg:flex-col items-center justify-between lg:justify-start gap-4 p-3 shrink-0">
          <Link
            to="/"
            className="w-10 h-10 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
            title="Home"
          >
            <Home className="w-4 h-4" />
          </Link>
          <Link
            to="/workspace"
            className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs cursor-pointer"
            title="Analysis Workspace"
          >
            <Sliders className="w-4 h-4" />
          </Link>
          <Link
            to="/safety-engine"
            className="w-10 h-10 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
            title="Safety Engine"
          >
            <ShieldCheck className="w-4 h-4" />
          </Link>
          <Link
            to="/evaluation"
            className="w-10 h-10 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
            title="Evaluation Benchmarks"
          >
            <Activity className="w-4 h-4" />
          </Link>
        </aside>

        {/* Dashboard Content Grid */}
        <div className="flex-1 p-6 sm:p-8 space-y-6">
          {/* Greeting Header & Direct Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Hello, Alexon
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                AI-Assisted Chest X-ray Analysis
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
                <span>Upload CXR</span>
              </button>

              {onSelectSample && (
                <button
                  type="button"
                  onClick={onSelectSample}
                  disabled={isAnalyzing}
                  className="inline-flex items-center px-3.5 py-2 rounded-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
                >
                  <Play className="w-3 h-3 mr-1 text-slate-500 fill-current" />
                  <span>Try Sample</span>
                </button>
              )}
            </div>
          </div>

          {/* 3-Column Primary Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Column 1: Radiograph Viewer & Decision (5 cols) */}
            <div className="lg:col-span-5 space-y-5">
              {/* Radiograph Card */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 shadow-sm aspect-square max-h-[420px] flex items-center justify-center group">
                {/* Anatomical Marker R */}
                <div className="absolute top-4 left-4 z-10 text-white/90 font-mono font-bold text-lg pointer-events-none select-none">
                  R
                </div>

                {/* The Radiograph Image */}
                {displayImage ? (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img
                      src={displayImage}
                      alt="Chest Radiograph"
                      className="w-full h-full object-cover filter contrast-[1.05]"
                    />

                    {/* Grad-CAM Heatmap Overlay (Optional Toggle) */}
                    {showGradCam && response?.explainability?.heatmap_png_base64 && (
                      <img
                        src={`data:image/png;base64,${response.explainability.heatmap_png_base64}`}
                        alt="Grad-CAM Saliency Attention"
                        className="absolute inset-0 w-full h-full object-cover mix-blend-screen transition-opacity"
                        style={{ opacity: heatmapOpacity }}
                      />
                    )}
                  </div>
                ) : (
                  <div className="p-8 text-center space-y-3">
                    <UploadCloud className="w-12 h-12 text-slate-500 mx-auto" />
                    <div>
                      <p className="text-white text-sm font-semibold">No Radiograph Loaded</p>
                      <p className="text-slate-400 text-xs">Upload an X-ray to generate diagnosis</p>
                    </div>
                    <div className="flex items-center justify-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={onUploadNew}
                        className="px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold cursor-pointer"
                      >
                        Upload CXR
                      </button>
                      {onSelectSample && (
                        <button
                          type="button"
                          onClick={onSelectSample}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer"
                        >
                          Load Sample
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Floating Glassmorphic Trust Badge (Matches image!) */}
                {displayImage && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-lg border border-white/60 flex items-center space-x-3 transition-transform hover:scale-[1.02]">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 shrink-0">
                      <AlertTriangle className="w-4 h-4 text-slate-700" />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-slate-900 tracking-tight">
                        {tgDecision}
                      </span>
                      <span className="block text-[11px] text-slate-500 font-medium">
                        {overallReliabilityPct < 70 ? 'Low Prediction Reliability' : 'Model Reliability Audited'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Heatmap Overlay Toggle Bar at bottom of card */}
                {response?.explainability?.heatmap_png_base64 && (
                  <div className="absolute bottom-3 inset-x-3 bg-slate-900/80 backdrop-blur-md px-3 py-2 rounded-xl flex items-center justify-between text-xs text-white">
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
              </div>

              {/* LungGuard Decision Card (Matches image!) */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  LungGuard Decision
                </span>
                <div className="bg-slate-100/90 border border-slate-200/80 rounded-2xl p-4 flex items-center space-x-3.5 shadow-2xs">
                  <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
                    <AlertTriangle className="w-5 h-5 text-slate-800" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="block text-sm font-extrabold text-slate-900 tracking-tight">
                      {tgDecision}
                    </span>
                    <span className="block text-xs text-slate-500 font-mono truncate">
                      Reason: {tgReason}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2 & 3: Middle Metrics & Right Findings (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Middle Left: Overall Reliability Card */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Overall Reliability
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

                  {/* Big Number & Tier */}
                  <div className="flex items-baseline space-x-2.5">
                    <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                      {overallReliabilityPct}%
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-slate-600">
                      {reliabilityTier}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-slate-800 rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${overallReliabilityPct}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold mt-1.5">
                      <span>0%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>

                {/* Middle Right: Top Findings (Model Scores) Card */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Top Findings (Model Scores)
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

                  {/* Findings List */}
                  <div className="space-y-2.5">
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
                  </div>

                  {/* View All 18 Findings Button */}
                  <button
                    type="button"
                    onClick={() => setShowAllFindingsModal(true)}
                    className="w-full py-2 px-3 mt-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/60 text-xs font-semibold text-slate-700 flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <span>View All 18 Findings</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  </button>
                </div>
              </div>

              {/* Middle Row 2: Key Insights Card */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3.5">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Key Insights
                </h3>

                <div className="space-y-2.5 divide-y divide-slate-100">
                  {/* Insight 1: Image Quality */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center space-x-2 text-xs text-slate-600">
                      <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-slate-700">
                        <Activity className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-medium">Image Quality</span>
                    </div>
                    <span className="text-xs font-bold text-slate-900">{iqStatus}</span>
                  </div>

                  {/* Insight 2: Stability */}
                  <div className="flex items-center justify-between pt-2.5">
                    <div className="flex items-center space-x-2 text-xs text-slate-600">
                      <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-slate-700">
                        <Activity className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-medium">Stability</span>
                    </div>
                    <span className="text-xs font-bold text-slate-900">
                      {typeof stabilityScore === 'number' ? stabilityScore.toFixed(2) : stabilityScore} ({stabilityStatus})
                    </span>
                  </div>

                  {/* Insight 3: OOD Status */}
                  <div className="flex items-center justify-between pt-2.5">
                    <div className="flex items-center space-x-2 text-xs text-slate-600">
                      <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-slate-700">
                        <Layers className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-medium">OOD Status</span>
                    </div>
                    <span className="text-xs font-bold text-slate-900">{oodStatus}</span>
                  </div>
                </div>
              </div>

              {/* Middle Row 3: Analysis Details Card (Bottom Span) */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Analysis Details
                  </h3>
                  <button
                    type="button"
                    onClick={exportReport}
                    className="inline-flex items-center justify-center space-x-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Report</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  {/* Analysis ID */}
                  <div className="flex items-start space-x-2.5">
                    <Calendar className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                    <div className="text-xs">
                      <span className="text-slate-400 block text-[11px]">Analysis ID</span>
                      <strong className="font-mono text-slate-800">{analysisId}</strong>
                    </div>
                  </div>

                  {/* Timestamp */}
                  <div className="flex items-start space-x-2.5">
                    <Clock className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                    <div className="text-xs">
                      <span className="text-slate-400 block text-[11px]">Timestamp</span>
                      <strong className="text-slate-800 text-[11px] block">{timestampStr}</strong>
                    </div>
                  </div>

                  {/* Model */}
                  <div className="flex items-start space-x-2.5">
                    <Cpu className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                    <div className="text-xs">
                      <span className="text-slate-400 block text-[11px]">Model</span>
                      <strong className="text-slate-800 flex items-center space-x-1">
                        <span>DenseNet-121</span>
                        <Info className="w-3 h-3 text-slate-400 cursor-pointer" onClick={() => setShowModelInfoModal(true)} />
                      </strong>
                    </div>
                  </div>
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
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto space-y-2.5 flex-1">
              {allFindings.map((finding) => (
                <div key={finding.label} className="p-2 rounded-lg bg-slate-50 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">{finding.label}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                      <div className="h-full bg-slate-800 rounded-full" style={{ width: `${Math.round(finding.score * 100)}%` }} />
                    </div>
                    <span className="font-mono font-bold text-slate-700 w-10 text-right">{finding.score.toFixed(2)}</span>
                  </div>
                </div>
              ))}
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
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
              <p>
                <strong>Weights:</strong> TorchXRayVision <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">densenet121-res224-all</code>
              </p>
              <p>
                <strong>Training Cohort:</strong> 800,000+ multi-center radiographs across NIH ChestX-ray14, Stanford CheXpert, PadChest, and MIMIC-CXR.
              </p>
              <p>
                <strong>Input Resolution:</strong> 224 × 224 × 1 grayscale channels normalized to [-1024, +1024].
              </p>
              <p>
                <strong>Penultimate Layer:</strong> 1,024-dimensional visual embedding hook used for perturbation stability & out-of-distribution (OOD) detection.
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
