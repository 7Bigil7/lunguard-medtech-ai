import { z } from 'zod'

export const TriageOutcomeSchema = z.enum([
  'NORMAL',
  'TB_CONSISTENT',
  'MALIGNANCY_SUSPICIOUS',
  'UNCERTAIN_DUAL_RISK',
])

export const PredictionClassSchema = z.enum([
  'normal',
  'tb_consistent',
  'malignancy_suspicious',
])

export const ModelOutputScoresSchema = z.object({
  normal: z.number().min(0).max(1),
  tb_consistent: z.number().min(0).max(1),
  malignancy_suspicious: z.number().min(0).max(1),
})

export const ModelMetadataSchema = z.object({
  name: z.string(),
  scores: ModelOutputScoresSchema,
  calibrated: z.boolean(),
})

export const ConformalPredictionSchema = z.object({
  prediction_set: z.array(PredictionClassSchema),
  target_coverage: z.number().nullable(),
  method: z.string(),
})

export const SafetyPolicySchema = z.object({
  version: z.string(),
  abstained: z.boolean(),
  triggered_rules: z.array(z.string()),
  reasons: z.array(z.string()),
})

export const ExplainabilitySchema = z.object({
  available: z.boolean(),
  method: z.enum(['gradcam']).nullable(),
  heatmap_png_base64: z.string().nullable(),
  note: z.string().nullable(),
})

export const AnalysisResponseSchema = z.object({
  case_id: z.string(),
  status: z.literal('completed'),
  mode: z.enum(['inference', 'simulated']),
  simulated: z.boolean(),
  timestamp: z.string(),
  model: ModelMetadataSchema,
  conformal: ConformalPredictionSchema,
  safety_policy: SafetyPolicySchema,
  triage: TriageOutcomeSchema,
  explainability: ExplainabilitySchema,
  limitations: z.array(z.string()),
})

export const HealthResponseSchema = z.object({
  status: z.literal('ok'),
  model_loaded: z.boolean(),
  mode: z.enum(['inference', 'development']),
  model_name: z.string().nullable(),
  policy_version: z.string().nullable(),
  version: z.string(),
})

export const ApiErrorPayloadSchema = z.object({
  status: z.literal('error'),
  error: z.object({
    code: z.enum([
      'INVALID_FILE_TYPE',
      'FILE_TOO_LARGE',
      'CORRUPT_IMAGE',
      'IMAGE_TOO_SMALL',
      'MODEL_UNAVAILABLE',
      'INFERENCE_FAILED',
      'INTERNAL_ERROR',
      'NETWORK_ERROR',
      'SCHEMA_ERROR',
    ]),
    message: z.string(),
  }),
})
