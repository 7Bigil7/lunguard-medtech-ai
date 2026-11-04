import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useApp } from '../context/useApp'
import { ModernClinicalDashboard } from '../components/dashboard/ModernClinicalDashboard'
import { AnalysisProgressBar } from '../components/analysis/AnalysisProgressBar'
import { NeutralErrorAlert } from '../components/analysis/NeutralErrorAlert'
import { ConformalSetPanel } from '../components/results/ConformalSetPanel'
import { SafetyPolicyPanel } from '../components/results/SafetyPolicyPanel'
import { GradCamViewer } from '../components/results/GradCamViewer'
import { CaseSummaryPanel } from '../components/results/CaseSummaryPanel'
import { simulateAnalysis } from '../services/demoSimulator'
import { analyzeImageLive, ApiServiceError } from '../services/apiClient'
import { validateCxrImage } from '../lib/fileValidation'
import type { AnalysisResponse } from '../types/api'
import {
  UploadCloud,
  FileImage,
  Layers,
  ShieldCheck,
  Eye,
  CheckCircle2,
  FileText,
  Play,
  RotateCcw,
} from 'lucide-react'

export const Workspace: React.FC = () => {
  const { mode, simulatedScenario } = useApp()

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null)
  const [activeImageObjectUrl, setActiveImageObjectUrl] = useState<string | null>(null)
  const [activeFile, setActiveFile] = useState<File | null>(null)
  const [activeCaseLabel, setActiveCaseLabel] = useState<string | undefined>(undefined)
  const [activeDetailTab, setActiveDetailTab] = useState<'conformal' | 'safety' | 'gradcam' | 'summary'>('conformal')

  const [apiError, setApiError] = useState<{ code?: string; message: string } | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Clean up in-flight requests only when component unmounts
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  const handleReset = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    if (activeImageObjectUrl) {
      URL.revokeObjectURL(activeImageObjectUrl)
      setActiveImageObjectUrl(null)
    }
    setActiveFile(null)
    setActiveCaseLabel(undefined)
    setAnalysisResult(null)
    setApiError(null)
    setValidationError(null)
    setIsAnalyzing(false)
  }

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    setIsAnalyzing(false)
  }

  const runAnalysis = useCallback(
    async (file: File, caseLabel?: string) => {
      setIsAnalyzing(true)
      setApiError(null)
      setValidationError(null)
      setAnalysisResult(null)

      setActiveImageObjectUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev)
        return URL.createObjectURL(file)
      })
      setActiveFile(file)
      setActiveCaseLabel(caseLabel)

      const controller = new AbortController()
      abortControllerRef.current = controller

      try {
        let result: AnalysisResponse
        try {
          // Always attempt live DenseNet-121 inference on FastAPI backend
          result = await analyzeImageLive(file, caseLabel, controller.signal)
        } catch (liveErr) {
          // If live model is unreachable or user explicitly in demo mode, fall back to simulation
          if (
            liveErr instanceof ApiServiceError &&
            liveErr.code === 'NETWORK_ERROR' &&
            mode === 'demo'
          ) {
            result = await simulateAnalysis(simulatedScenario, caseLabel, controller.signal)
          } else {
            throw liveErr
          }
        }
        setAnalysisResult(result)
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          setIsAnalyzing(false)
          return
        }

        if (err instanceof ApiServiceError) {
          setApiError({
            code: err.code,
            message: err.message,
          })
        } else {
          const msg = err instanceof Error ? err.message : 'Unexpected analysis failure'
          setApiError({
            code: 'INFERENCE_FAILED',
            message: msg,
          })
        }
      } finally {
        setIsAnalyzing(false)
        abortControllerRef.current = null
      }
    },
    [mode, simulatedScenario]
  )

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      const val = await validateCxrImage(file)
      if (!val.valid) {
        setValidationError(val.error.message)
        return
      }
      runAnalysis(val.file)
    }
  }

  const handleDroppedFile = async (file: File) => {
    const val = await validateCxrImage(file)
    if (!val.valid) {
      setValidationError(val.error.message)
      return
    }
    runAnalysis(val.file)
  }

  const loadSampleCxr = async () => {
    try {
      const res = await fetch('/hero-cxr.jpg')
      const blob = await res.blob()
      const sampleFile = new File([blob], 'patient-sample-cxr.jpg', { type: 'image/jpeg' })
      runAnalysis(sampleFile, 'SAMPLE-CXR-01')
    } catch {
      setValidationError('Failed to load synthetic sample X-ray.')
    }
  }

  const handleRetryAnalysis = () => {
    if (activeFile) {
      runAnalysis(activeFile, activeCaseLabel)
    } else {
      loadSampleCxr()
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-6 text-slate-800 font-sans selection:bg-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg"
          onChange={handleFileInputChange}
          className="hidden"
          aria-hidden="true"
        />

        {/* Validation Error Alert */}
        {validationError && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
            <span>{validationError}</span>
            <button
              type="button"
              onClick={() => setValidationError(null)}
              className="text-rose-600 hover:underline font-bold ml-3"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Dedicated Neutral Error Display */}
        {apiError && (
          <NeutralErrorAlert
            code={apiError.code}
            message={apiError.message}
            onRetry={handleRetryAnalysis}
            onDismiss={() => setApiError(null)}
          />
        )}

        {/* Progress Bar (while inferring) */}
        {isAnalyzing && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
            <AnalysisProgressBar isLoading={isAnalyzing} onCancel={handleCancel} />
          </div>
        )}

        {/* HERO: The Executive Modern Clinical Dashboard */}
        <section aria-labelledby="main-dashboard-heading">
          <h2 id="main-dashboard-heading" className="sr-only">
            Clinical Diagnostic Cockpit
          </h2>
          <ModernClinicalDashboard
            response={analysisResult}
            activeImageSrc={activeImageObjectUrl}
            isAnalyzing={isAnalyzing}
            errorMessage={validationError || (apiError ? apiError.message : null)}
            onUploadNew={() => fileInputRef.current?.click()}
            onSelectSample={loadSampleCxr}
            onFileDrop={handleDroppedFile}
            onReset={handleReset}
            onRetry={handleRetryAnalysis}
          />
        </section>

        {/* DEEP-DIVE CLINICAL DETAILS: Clean Minimal Drawer Tabs */}
        {analysisResult && (
          <section aria-labelledby="deep-dive-heading" className="space-y-4 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
              <div>
                <h3 id="deep-dive-heading" className="text-sm font-extrabold text-slate-900 tracking-tight">
                  Clinical Verification & Reliability Audit
                </h3>
                <p className="text-xs text-slate-400">
                  Inspect mathematical conformal coverage, deterministic safety rules, and visual attention maps.
                </p>
              </div>

              {/* Minimal Pill Tab Switcher */}
              <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-full border border-slate-200/60 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setActiveDetailTab('conformal')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                    activeDetailTab === 'conformal'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Conformal Set</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveDetailTab('safety')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                    activeDetailTab === 'safety'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Safety Rules</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveDetailTab('gradcam')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                    activeDetailTab === 'gradcam'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Grad-CAM Viewer</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveDetailTab('summary')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                    activeDetailTab === 'summary'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Summary</span>
                </button>
              </div>
            </div>

            {/* Tab 1: Conformal Set */}
            {activeDetailTab === 'conformal' && (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
                <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Distribution-Free Conformal Prediction Set
                  </span>
                </div>
                <ConformalSetPanel conformal={analysisResult.conformal} />
              </div>
            )}

            {/* Tab 2: Safety Rules */}
            {activeDetailTab === 'safety' && (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
                <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
                  <ShieldCheck className="w-4 h-4 text-slate-800" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Deterministic TrustGuard Safety Policy (Rules P1–P7)
                  </span>
                </div>
                <SafetyPolicyPanel policy={analysisResult.safety_policy} />
              </div>
            )}

            {/* Tab 3: Grad-CAM Viewer */}
            {activeDetailTab === 'gradcam' && (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
                <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
                  <Eye className="w-4 h-4 text-teal-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Full Anatomical Grad-CAM Visualizer
                  </span>
                </div>
                <GradCamViewer
                  originalImageSrc={activeImageObjectUrl || undefined}
                  explainability={analysisResult.explainability}
                  isSimulated={analysisResult.simulated}
                />
              </div>
            )}

            {/* Tab 4: Summary */}
            {activeDetailTab === 'summary' && (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
                <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
                  <FileText className="w-4 h-4 text-slate-800" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Clinical Case Summary & Non-Prescriptive Guidance
                  </span>
                </div>
                <CaseSummaryPanel response={analysisResult} caseLabel={activeCaseLabel} />
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  )
}
