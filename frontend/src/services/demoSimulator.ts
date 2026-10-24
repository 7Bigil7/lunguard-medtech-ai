import type { AnalysisResponse, TriageOutcome } from '../types/api'

// Deterministic 1x1 or small valid PNG base64 strings for tests and environments without DOM canvas
// A valid 64x64 PNG gradient heatmap encoded as base64
const FALLBACK_HEATMAP_BASE64 =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAAXNSR0IArs4c6QAAAClJREFUKFNj/M/A8J+BAsD4nxjAxsDA8B+bICaBv//+M6I4Yd48Bv7/DAwA+8UQO0h05O8AAAAASUVORK5CYII='

/**
 * Creates a synthetic radial gradient heatmap as a data URL
 */
function createSyntheticHeatmapDataUrl(scenario: TriageOutcome): string {
  if (typeof document === 'undefined') {
    return FALLBACK_HEATMAP_BASE64
  }

  try {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext('2d')
    if (!ctx) return FALLBACK_HEATMAP_BASE64

    // Transparent background
    ctx.clearRect(0, 0, 256, 256)

    let cx = 128
    let cy = 128
    let r1 = 10
    let r2 = 90

    // Vary hot spots based on simulated disease location
    if (scenario === 'TB_CONSISTENT') {
      // Right upper lobe apical consolidation
      cx = 175
      cy = 70
      r2 = 80
    } else if (scenario === 'MALIGNANCY_SUSPICIOUS') {
      // Left mid-lung focal mass
      cx = 85
      cy = 130
      r2 = 70
    } else if (scenario === 'UNCERTAIN_DUAL_RISK') {
      // Dual foci: right upper lobe + left hilar fullness
      const grad1 = ctx.createRadialGradient(170, 75, 5, 170, 75, 75)
      grad1.addColorStop(0, 'rgba(239, 68, 68, 0.85)') // Red
      grad1.addColorStop(0.4, 'rgba(249, 115, 22, 0.65)') // Orange
      grad1.addColorStop(0.7, 'rgba(234, 179, 8, 0.4)') // Yellow
      grad1.addColorStop(1, 'rgba(59, 130, 246, 0)') // Fade out

      ctx.fillStyle = grad1
      ctx.beginPath()
      ctx.arc(170, 75, 75, 0, Math.PI * 2)
      ctx.fill()

      cx = 95
      cy = 135
      r2 = 70
    } else {
      // Normal: diffuse central cardiac/mediastinal contour check
      cx = 128
      cy = 140
      r2 = 85
    }

    const grad = ctx.createRadialGradient(cx, cy, r1, cx, cy, r2)
    if (scenario === 'NORMAL') {
      grad.addColorStop(0, 'rgba(34, 197, 94, 0.4)') // Soft green
      grad.addColorStop(0.6, 'rgba(59, 130, 246, 0.25)') // Light blue
      grad.addColorStop(1, 'rgba(59, 130, 246, 0)')
    } else {
      grad.addColorStop(0, 'rgba(239, 68, 68, 0.85)') // Bright red peak
      grad.addColorStop(0.35, 'rgba(249, 115, 22, 0.65)') // Orange
      grad.addColorStop(0.7, 'rgba(234, 179, 8, 0.4)') // Yellow
      grad.addColorStop(1, 'rgba(59, 130, 246, 0)') // Transparent blue fringe
    }

    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.arc(cx, cy, r2, 0, Math.PI * 2)
    ctx.fill()

    return canvas.toDataURL('image/png')
  } catch {
    return FALLBACK_HEATMAP_BASE64
  }
}

export interface ScenarioDefinition {
  id: TriageOutcome
  label: string
  description: string
  response: AnalysisResponse
}

export function getSimulatedScenarioResponse(scenario: TriageOutcome, caseLabel?: string): AnalysisResponse {
  const timestamp = new Date().toISOString()
  const randomSuffix = Math.floor(1000 + Math.random() * 9000)
  const caseId = caseLabel && caseLabel.trim().length > 0
    ? `SIM-${caseLabel.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '')}-${randomSuffix}`
    : `SIM-CXR-${randomSuffix}`

  const heatmapBase64 = createSyntheticHeatmapDataUrl(scenario)

  switch (scenario) {
    case 'NORMAL':
      return {
        case_id: caseId,
        status: 'completed',
        mode: 'simulated',
        simulated: true,
        timestamp,
        model: {
          name: 'DenseNet-121-CXR-v1.0 (Simulated)',
          scores: {
            normal: 0.94,
            tb_consistent: 0.04,
            malignancy_suspicious: 0.02,
          },
          calibrated: false,
        },
        conformal: {
          prediction_set: ['normal'],
          target_coverage: 0.95,
          method: 'split_conformal_lac',
        },
        safety_policy: {
          version: 'v1.2-conservative',
          abstained: false,
          triggered_rules: ['RULE_NORMAL_THRESHOLD_SATISFIED'],
          reasons: [
            'Conformal prediction set contains exclusively the normal classification.',
            'Model output scores meet conservative clearance threshold.',
          ],
        },
        triage: 'NORMAL',
        explainability: {
          available: true,
          method: 'gradcam',
          heatmap_png_base64: heatmapBase64,
          note: 'Illustrative placeholder, not derived from the uploaded image.',
        },
        limitations: [
          'SIMULATED DEMO: Synthetic data for demonstration purposes only.',
          'Normal output does not exclude micro-nodules or early-stage pathology below CXR resolution.',
          'Model was trained on adult retrospective CXR datasets; pediatric evaluation is pending.',
        ],
      }

    case 'TB_CONSISTENT':
      return {
        case_id: caseId,
        status: 'completed',
        mode: 'simulated',
        simulated: true,
        timestamp,
        model: {
          name: 'DenseNet-121-CXR-v1.0 (Simulated)',
          scores: {
            normal: 0.07,
            tb_consistent: 0.89,
            malignancy_suspicious: 0.04,
          },
          calibrated: false,
        },
        conformal: {
          prediction_set: ['tb_consistent'],
          target_coverage: 0.95,
          method: 'split_conformal_lac',
        },
        safety_policy: {
          version: 'v1.2-conservative',
          abstained: false,
          triggered_rules: ['RULE_SINGLE_INFECTIOUS_CONCORDANCE'],
          reasons: [
            'Upper lobe fibrocavitary / infiltrative profile identified.',
            'Malignancy confidence is below safety escalation boundary.',
          ],
        },
        triage: 'TB_CONSISTENT',
        explainability: {
          available: true,
          method: 'gradcam',
          heatmap_png_base64: heatmapBase64,
          note: 'Illustrative placeholder, not derived from the uploaded image.',
        },
        limitations: [
          'SIMULATED DEMO: Scripted scenario simulating TB concordance.',
          'Radiological findings of TB can mimic chronic fungal infection or sarcoidosis.',
          'Confirmatory microbiological and clinical correlation is required.',
        ],
      }

    case 'MALIGNANCY_SUSPICIOUS':
      return {
        case_id: caseId,
        status: 'completed',
        mode: 'simulated',
        simulated: true,
        timestamp,
        model: {
          name: 'DenseNet-121-CXR-v1.0 (Simulated)',
          scores: {
            normal: 0.03,
            tb_consistent: 0.05,
            malignancy_suspicious: 0.92,
          },
          conformal: {
            prediction_set: ['malignancy_suspicious'],
            target_coverage: 0.95,
            method: 'split_conformal_lac',
          },
          calibrated: false,
        },
        conformal: {
          prediction_set: ['malignancy_suspicious'],
          target_coverage: 0.95,
          method: 'split_conformal_lac',
        },
        safety_policy: {
          version: 'v1.2-conservative',
          abstained: false,
          triggered_rules: ['RULE_HIGH_CONFIDENCE_MALIGNANCY_TRIGGER'],
          reasons: [
            'Focal opacity with spiculation features detected.',
            'Safety policy mandates high-priority escalation for pulmonary mass evaluation.',
          ],
        },
        triage: 'MALIGNANCY_SUSPICIOUS',
        explainability: {
          available: true,
          method: 'gradcam',
          heatmap_png_base64: heatmapBase64,
          note: 'Illustrative placeholder, not derived from the uploaded image.',
        },
        limitations: [
          'SIMULATED DEMO: Scripted scenario simulating neoplastic suspicion.',
          'CXR has low specificity for distinguishing benign tuberculomas from malignant nodules.',
          'Diagnostic confirmation requires tissue histology and staging imaging.',
        ],
      }

    case 'UNCERTAIN_DUAL_RISK':
    default:
      return {
        case_id: caseId,
        status: 'completed',
        mode: 'simulated',
        simulated: true,
        timestamp,
        model: {
          name: 'DenseNet-121-CXR-v1.0 (Simulated)',
          scores: {
            normal: 0.08,
            tb_consistent: 0.74,
            malignancy_suspicious: 0.71,
          },
          calibrated: false,
        },
        conformal: {
          prediction_set: ['tb_consistent', 'malignancy_suspicious'],
          target_coverage: 0.95,
          method: 'split_conformal_lac',
        },
        safety_policy: {
          version: 'v1.2-conservative',
          abstained: true,
          triggered_rules: [
            'RULE_MULTI_CLASS_HIGH_RISK_OVERLAP',
            'RULE_MALIGNANCY_SENSITIVITY_THRESHOLD',
            'RULE_SAFETY_ABSTENTION_ENFORCED',
          ],
          reasons: [
            'Conformal prediction set contains both TB-consistent and Malignancy-suspicious classes with overlapping confidence margins.',
            'Safety policy triggered abstention to protect against diagnostic anchoring in a TB-endemic clinical presentation.',
          ],
        },
        triage: 'UNCERTAIN_DUAL_RISK',
        explainability: {
          available: true,
          method: 'gradcam',
          heatmap_png_base64: heatmapBase64,
          note: 'Illustrative placeholder, not derived from the uploaded image.',
        },
        limitations: [
          'SIMULATED DEMO: Primary prototype differentiator demonstrating safety abstention.',
          'Uncertainty does not imply simultaneous dual disease; it indicates the model cannot safely differentiate.',
          'Conformal coverage guarantee holds only under valid calibration and exchangeability assumptions.',
        ],
      }
  }
}

/**
 * Simulates network delay and returns a simulated response
 */
export async function simulateAnalysis(
  scenario: TriageOutcome,
  caseLabel?: string,
  abortSignal?: AbortSignal
): Promise<AnalysisResponse> {
  const simulatedDelayMs = 1200 // realistic pipeline delay

  return new Promise<AnalysisResponse>((resolve, reject) => {
    const timer = setTimeout(() => {
      resolve(getSimulatedScenarioResponse(scenario, caseLabel))
    }, simulatedDelayMs)

    if (abortSignal) {
      abortSignal.addEventListener('abort', () => {
        clearTimeout(timer)
        reject(new DOMException('Analysis was cancelled by the user.', 'AbortError'))
      })
    }
  })
}
