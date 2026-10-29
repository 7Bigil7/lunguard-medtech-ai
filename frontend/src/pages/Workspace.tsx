import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useApp } from '../context/useApp'
import { ImageUploader } from '../components/analysis/ImageUploader'
import { AnalysisProgressBar } from '../components/analysis/AnalysisProgressBar'
import { NeutralErrorAlert } from '../components/analysis/NeutralErrorAlert'
import { TriageBanner } from '../components/results/TriageBanner'
import { ModelScoresPanel } from '../components/results/ModelScoresPanel'
import { ConformalSetPanel } from '../components/results/ConformalSetPanel'
import { SafetyPolicyPanel } from '../components/results/SafetyPolicyPanel'
import { GradCamViewer } from '../components/results/GradCamViewer'
import { CaseSummaryPanel } from '../components/results/CaseSummaryPanel'
import { AllScenariosModal } from '../components/results/AllScenariosModal'
import { simulateAnalysis } from '../services/demoSimulator'
import { analyzeImageLive, ApiServiceError } from '../services/apiClient'
import type { AnalysisResponse, TriageOutcome } from '../types/api'
import { FlaskConical, AlertCircle, Activity, ArrowRight, Grid3X3, Check } from 'lucide-react'
import { Link } from 'react-router-dom'

export const Workspace: React.FC = () => {
  const { mode, simulatedScenario, setSimulatedScenario, enterDemoMode } = useApp()

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null)
  const [activeImageObjectUrl, setActiveImageObjectUrl] = useState<string | null>(null)
  const [activeFile, setActiveFile] = useState<File | null>(null)
  const [activeCaseLabel, setActiveCaseLabel] = useState<string | undefined>(undefined)
  const [showComparisonModal, setShowComparisonModal] = useState<boolean>(false)

  const [apiError, setApiError] = useState<{ code?: string; message: string } | null>(null)

  const abortControllerRef = useRef<AbortController | null>(null)

  // Clean up object URLs
  useEffect(() => {
    return () => {
      if (activeImageObjectUrl) {
        URL.revokeObjectURL(activeImageObjectUrl)
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [activeImageObjectUrl])

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
    setIsAnalyzing(false)
  }

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    setIsAnalyzing(false)
  }

  const runAnalysis = useCallback(async (file: File, caseLabel?: string) => {
    setIsAnalyzing(true)
    setApiError(null)
    setAnalysisResult(null)

    // Revoke previous objectUrl if different
    const newUrl = URL.createObjectURL(file)
    setActiveImageObjectUrl(newUrl)
    setActiveFile(file)
    setActiveCaseLabel(caseLabel)

    const controller = new AbortController()
    abortControllerRef.current = controller

    try {
      if (mode === 'demo') {
        // Simulated scenario
        const result = await simulateAnalysis(simulatedScenario, caseLabel, controller.signal)
        setAnalysisResult(result)
      } else {
        // Real API call
        const result = await analyzeImageLive(file, caseLabel, controller.signal)
        setAnalysisResult(result)
      }
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        // User-cancelled, clear analyzing state gracefully
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
  }, [mode, simulatedScenario])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Clinical Analysis Workspace
            </h1>
            <span className="text-xs uppercase font-semibold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
              Interactive Triage
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-600">
            Validated CXR image intake, conformal prediction set calculation, deterministic safety policy, and visual attention mapping.
          </p>
        </div>

        {/* Mode Indicator & Quick Action */}
        <div className="flex items-center space-x-3">
          {mode === 'demo' ? (
            <div className="flex items-center space-x-2 p-2 rounded-lg bg-amber-50 border border-amber-200 text-xs">
              <FlaskConical className="w-4 h-4 text-amber-700 shrink-0" />
              <div>
                <span className="font-bold text-amber-950 block">Simulated Demo Active</span>
                <span className="text-amber-800 text-[11px]">Testing scenario: {simulatedScenario}</span>
              </div>
            </div>
          ) : mode === 'live' ? (
            <div className="flex items-center space-x-2 p-2 rounded-lg bg-teal-50 border border-teal-200 text-xs">
              <Activity className="w-4 h-4 text-teal-700 shrink-0" />
              <div>
                <span className="font-bold text-teal-950 block">Connected to Live Backend</span>
                <span className="text-teal-800 text-[11px]">Inference API Ready</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2 p-2 rounded-lg bg-slate-100 border border-slate-300 text-xs">
              <AlertCircle className="w-4 h-4 text-slate-600 shrink-0" />
              <div>
                <span className="font-semibold text-slate-800 block">Backend Offline</span>
                <button
                  type="button"
                  onClick={enterDemoMode}
                  className="text-teal-700 font-bold hover:underline inline-flex items-center"
                >
                  Enter Simulated Demo Mode <ArrowRight className="w-3 h-3 ml-0.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Presenter Scenario Selector (when in Demo Mode) */}
      {mode === 'demo' && (
        <section aria-labelledby="presenter-scenario-heading" className="bg-amber-50 border border-amber-300 rounded-xl p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-amber-200">
            <div className="flex items-center space-x-2">
              <FlaskConical className="w-5 h-5 text-amber-700" />
              <h2 id="presenter-scenario-heading" className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                Presenter: choose simulated scenario
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setShowComparisonModal(true)}
              className="inline-flex items-center px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Grid3X3 className="w-3.5 h-3.5 mr-1.5 text-teal-400" />
              Compare All 4 Scenarios Side-by-Side
            </button>
          </div>

          <p className="text-xs text-slate-700">
            Select one of the four clinical triage workflows below. Clicking <strong>&quot;Analyze X-ray&quot;</strong> executes a deterministic simulated pipeline (Validate → Preprocess → Model scores → Conformal prediction set → Safety policy → Triage).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {[
              {
                id: 'NORMAL' as TriageOutcome,
                title: 'a. NORMAL',
                sub: 'Lower apparent risk',
                desc: 'Routine correlation, standard clinical pathway.',
                activeBg: 'bg-emerald-600 text-white ring-2 ring-emerald-500',
              },
              {
                id: 'TB_CONSISTENT' as TriageOutcome,
                title: 'b. TB-CONSISTENT',
                sub: 'Elevated infectious risk',
                desc: 'Infectious risk workflow & sputum/molecular correlation.',
                activeBg: 'bg-amber-600 text-white ring-2 ring-amber-500',
              },
              {
                id: 'MALIGNANCY_SUSPICIOUS' as TriageOutcome,
                title: 'c. MALIGNANCY-SUSPICIOUS',
                sub: 'High-risk escalation',
                desc: 'Expedited senior thoracic review & staging workup.',
                activeBg: 'bg-rose-600 text-white ring-2 ring-rose-500',
              },
              {
                id: 'UNCERTAIN_DUAL_RISK' as TriageOutcome,
                title: 'd. UNCERTAIN / DUAL-RISK',
                sub: 'Uncertain or conflicting findings',
                desc: 'Key focus: Safety policy abstention to prevent diagnostic anchoring.',
                activeBg: 'bg-purple-700 text-white ring-2 ring-purple-600',
              },
            ].map((opt) => {
              const isSelected = simulatedScenario === opt.id
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSimulatedScenario(opt.id)}
                  className={`text-left p-3 rounded-lg border transition-all flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? opt.activeBg
                      : 'bg-white hover:bg-amber-100/60 text-slate-900 border-amber-200'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">{opt.title}</span>
                      {isSelected && <Check className="w-4 h-4 shrink-0" />}
                    </div>
                    <span className={`text-[11px] font-medium block ${isSelected ? 'text-white/90' : 'text-slate-600'}`}>
                      {opt.sub}
                    </span>
                  </div>
                  <p className={`text-[10px] mt-2 pt-1 border-t leading-snug ${
                    isSelected ? 'border-white/20 text-white/80' : 'border-slate-100 text-slate-500'
                  }`}>
                    {opt.desc}
                  </p>
                </button>
              )
            })}
          </div>
        </section>
      )}

      {/* Upload and Intake Section */}
      <section aria-labelledby="intake-heading">
        <h2 id="intake-heading" className="sr-only">Image Intake & Client Validation</h2>
        <ImageUploader
          onAnalyze={runAnalysis}
          isAnalyzing={isAnalyzing}
          onReset={handleReset}
          hasResult={!!analysisResult}
        />
      </section>

      {/* Processing Pipeline Progress */}
      {isAnalyzing && (
        <AnalysisProgressBar
          isLoading={isAnalyzing}
          onCancel={handleCancel}
        />
      )}

      {/* Dedicated Neutral Error Display (Never confused with triage results) */}
      {apiError && (
        <NeutralErrorAlert
          code={apiError.code}
          message={apiError.message}
          onRetry={() => {
            if (activeFile) {
              runAnalysis(activeFile, activeCaseLabel)
            }
          }}
          onDismiss={() => setApiError(null)}
        />
      )}

      {/* Results Section */}
      {analysisResult && (
        <section
          aria-labelledby="results-heading"
          className="space-y-6 pt-4 border-t border-slate-200"
        >
          <div className="flex items-center justify-between">
            <h2 id="results-heading" className="text-xl font-bold text-slate-900 tracking-tight flex items-center">
              <span>Decision Support Outputs</span>
            </h2>

            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-500">Case ID:</span>
              <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {analysisResult.case_id}
              </span>
            </div>
          </div>

          {/* 1. Triage Banner */}
          <TriageBanner
            triage={analysisResult.triage}
            isSimulated={analysisResult.simulated}
          />

          {/* 2. Grid with 3 Distinct Concepts: Model Scores, Conformal Set, Safety Policy */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Concept 1: Model Output Scores */}
            <ModelScoresPanel model={analysisResult.model} />

            {/* Concept 2: Conformal Prediction Set */}
            <ConformalSetPanel conformal={analysisResult.conformal} />

            {/* Concept 3: Safety-Policy Decision */}
            <SafetyPolicyPanel policy={analysisResult.safety_policy} />
          </div>

          {/* 3. Grad-CAM Visual Explainability */}
          <GradCamViewer
            originalImageSrc={activeImageObjectUrl || undefined}
            explainability={analysisResult.explainability}
            isSimulated={analysisResult.simulated}
          />

          {/* 4. Case Summary, Non-prescriptive next steps & Limitations */}
          <CaseSummaryPanel
            response={analysisResult}
            caseLabel={activeCaseLabel}
          />

          {/* Learn More in Safety Engine Link */}
          <div className="p-4 rounded-xl bg-slate-900 text-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-semibold text-white block">
                Want to understand how conformal prediction sets and safety abstention rules operate?
              </span>
              <span className="text-slate-400">
                Inspect the pipeline architecture, coverage assumptions, and engineering targets in the Safety Engine.
              </span>
            </div>
            <Link
              to="/safety-engine"
              className="px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold transition-colors shrink-0 shadow-sm"
            >
              Explore Safety Engine
            </Link>
          </div>
        </section>
      )}

      {/* Side-by-Side Comparison Modal for Presenter */}
      <AllScenariosModal
        isOpen={showComparisonModal}
        onClose={() => setShowComparisonModal(false)}
        onSelectScenario={(sc) => setSimulatedScenario(sc)}
      />
    </div>
  )
}
