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
  version: z.string().optional(),
  device: z.string().optional(),
  score_type: z.string().optional(),
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
  // Optional LUNGGUARD v2.0 Trust Passport fields (populated during live DenseNet-121 inference)
  analysis_id: z.string().optional(),
  processing_time_ms: z.number().optional(),
  predictions: z.record(z.string(), z.number()).optional(),
  top_findings: z.array(z.object({ label: z.string(), score: z.number() })).optional(),
  image_quality: z
    .object({
      status: z.enum(['acceptable', 'suboptimal', 'inadequate']),
      brightness: z.number(),
      contrast: z.number(),
      blur_score: z.number(),
      dynamic_range: z.number(),
      dimensions: z.object({ width: z.number(), height: z.number() }),
      warnings: z.array(z.string()),
      review_recommended: z.boolean(),
    })
    .optional(),
  stability: z
    .object({
      status: z.enum(['stable', 'moderate_instability', 'unstable', 'skipped']),
      tests_run: z.number(),
      score: z.number().nullable().optional(),
      mean_score_variation: z.number().nullable().optional(),
      max_score_delta: z.number().nullable().optional(),
      disagreement_rate: z.number().nullable().optional(),
    })
    .optional(),
  trustguard: z
    .object({
      decision: z.enum(['unreliable_input', 'review_recommended', 'standard_triage']),
      priority_rule: z.string(),
      triggered_rules: z.array(z.string()),
      reasons: z.array(z.string()),
      safe_for_automated_clearance: z.boolean(),
      clinical_disclaimer: z.string(),
    })
    .optional(),
})

export const HealthResponseSchema = z.object({
  status: z.literal('ok'),
  model_loaded: z.boolean(),
  mode: z.enum(['inference', 'development']),
  model_name: z.string().nullable(),
  policy_version: z.string().nullable(),
  version: z.string(),
  device: z.string().optional(),
})

export const ApiErrorPayloadSchema = z.object({
  status: z.literal('error'),
  error: z.object({
    code: z.string(),
    message: z.string(),
  }),
})
