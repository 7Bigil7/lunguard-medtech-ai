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
}

export type ApiErrorCode =
  | 'INVALID_FILE_TYPE'
  | 'FILE_TOO_LARGE'
  | 'CORRUPT_IMAGE'
  | 'IMAGE_TOO_SMALL'
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
}

export type AppMode = 'checking' | 'live' | 'backend-unavailable' | 'demo'
