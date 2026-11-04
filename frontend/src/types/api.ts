export type TriageOutcome =
  | 'NORMAL'
  | 'TB_CONSISTENT'
  | 'MALIGNANCY_SUSPICIOUS'
  | 'UNCERTAIN_DUAL_RISK'

export type PredictionClass = 'normal' | 'tb_consistent' | 'malignancy_suspicious'

export interface ModelOutputScores {
  normal: number
  tb_consistent: number
  malignancy_suspicious: number
}

export interface ModelMetadata {
  name: string
  scores: ModelOutputScores
  calibrated: boolean
  version?: string
  device?: string
  score_type?: string
}

export interface ConformalPredictionResult {
  prediction_set: PredictionClass[]
  target_coverage: number | null
  method: string
}

export interface SafetyPolicyResult {
  version: string
  abstained: boolean
  triggered_rules: string[]
  reasons: string[]
}

export interface ExplainabilityResult {
  available: boolean
  method: 'gradcam' | null
  heatmap_png_base64: string | null
  note: string | null
}

export interface TrustPassportImageQuality {
  status: 'acceptable' | 'suboptimal' | 'inadequate'
  brightness: number
  contrast: number
  blur_score: number
  dynamic_range: number
  dimensions: { width: number; height: number }
  warnings: string[]
  review_recommended: boolean
}

export interface TrustPassportStability {
  status: 'stable' | 'moderate_instability' | 'unstable' | 'skipped'
  tests_run: number
  score?: number | null
  mean_score_variation?: number | null
  max_score_delta?: number | null
  disagreement_rate?: number | null
}

export interface TrustPassportGuard {
  decision: 'unreliable_input' | 'review_recommended' | 'standard_triage'
  priority_rule: string
  triggered_rules: string[]
  reasons: string[]
  safe_for_automated_clearance: boolean
  clinical_disclaimer: string
}

export interface AnalysisResponse {
  case_id: string
  status: 'completed'
  mode: 'inference' | 'simulated'
  simulated: boolean
  timestamp: string
  model: ModelMetadata
  conformal: ConformalPredictionResult
  safety_policy: SafetyPolicyResult
  triage: TriageOutcome
  explainability: ExplainabilityResult
  limitations: string[]
  // Optional LUNGGUARD v2.0 Trust Passport fields (populated during live DenseNet-121 inference)
  analysis_id?: string
  processing_time_ms?: number
  predictions?: Record<string, number>
  top_findings?: Array<{ label: string; score: number }>
  image_quality?: TrustPassportImageQuality
  stability?: TrustPassportStability
  trustguard?: TrustPassportGuard
}

export type ApiErrorCode =
  | 'INVALID_FILE_TYPE'
  | 'FILE_TOO_LARGE'
  | 'CORRUPT_IMAGE'
  | 'IMAGE_TOO_SMALL'
  | 'NON_RADIOGRAPHIC_IMAGE'
  | 'INVALID_ASPECT_RATIO'
  | 'MODEL_UNAVAILABLE'
  | 'INFERENCE_FAILED'
  | 'INTERNAL_ERROR'
  | 'NETWORK_ERROR'
  | 'SCHEMA_ERROR'

export interface ApiErrorPayload {
  status: 'error'
  error: {
    code: ApiErrorCode
    message: string
  }
}

export interface HealthResponse {
  status: 'ok'
  model_loaded: boolean
  mode: 'inference' | 'development'
  model_name: string | null
  policy_version: string | null
  version: string
  device?: string
}

export type AppMode = 'checking' | 'live' | 'backend-unavailable' | 'demo'
