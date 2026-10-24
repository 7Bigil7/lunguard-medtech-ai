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
import { simulateAnalysis } from '../services/demoSimulator'
import { analyzeImageLive, ApiServiceError } from '../services/apiClient'
import type { AnalysisResponse } from '../types/api'
import { FlaskConical, AlertCircle, Activity, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export const Workspace: React.FC = () => {
  const { mode, simulatedScenario, enterDemoMode } = useApp()

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null)
  const [activeImageObjectUrl, setActiveImageObjectUrl] = useState<string | null>(null)
  const [activeFile, setActiveFile] = useState<File | null>(null)
  const [activeCaseLabel, setActiveCaseLabel] = useState<string | undefined>(undefined)

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
    </div>
  )
}
