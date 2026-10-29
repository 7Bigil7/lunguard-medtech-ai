import type { AnalysisResponse, TriageOutcome, PredictionClass } from '../types/api'
import { evaluateSafetyPolicy } from '../lib/safetyPolicy'

// Deterministic valid PNG base64 strings for tests and environments without DOM canvas
const FALLBACK_HEATMAP_BASE64 =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAAXNSR0IArs4c6QAAAClJREFUKFNj/M/A8J+BAsD4nxjAxsDA8B+bICaBv//+M6I4Yd48Bv7/DAwA+8UQO0h05O8AAAAASUVORK5CYII='

/**
 * Creates a deterministic synthetic radial gradient heatmap as a data URL
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
    const r1 = 10
    let r2 = 90

    if (scenario === 'TB_CONSISTENT') {
      // Right upper lobe apical consolidation hotspot
      cx = 175
      cy = 70
      r2 = 80
    } else if (scenario === 'MALIGNANCY_SUSPICIOUS') {
      // Left mid-lung focal mass hotspot
      cx = 85
      cy = 130
      r2 = 70
    } else if (scenario === 'UNCERTAIN_DUAL_RISK') {
      // Dual foci: right upper lobe + left hilar fullness
      const grad1 = ctx.createRadialGradient(170, 75, 5, 170, 75, 75)
      grad1.addColorStop(0, 'rgba(239, 68, 68, 0.85)')
      grad1.addColorStop(0.4, 'rgba(249, 115, 22, 0.65)')
      grad1.addColorStop(0.7, 'rgba(234, 179, 8, 0.4)')
      grad1.addColorStop(1, 'rgba(59, 130, 246, 0)')

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
  workflowMeaning: string
  description: string
  response: AnalysisResponse
}

export const SCENARIO_METADATA: Record<TriageOutcome, { label: string; code: string; workflowMeaning: string }> = {
  NORMAL: {
    label: 'Normal (Lower Apparent Risk)',
    code: 'SIM-CASE-NORMAL-101',
    workflowMeaning:
      'Routine clinical correlation. No urgent algorithmic escalation is flagged; patient remains on standard clinical pathway according to examining clinician judgment.',
  },
  TB_CONSISTENT: {
    label: 'TB-Consistent (Elevated Risk)',
    code: 'SIM-CASE-TB-202',
    workflowMeaning:
      'Elevated infectious risk workflow. Prioritize patient for clinical evaluation, history review, sputum/molecular testing protocols, and standard infection-control procedures.',
  },
  MALIGNANCY_SUSPICIOUS: {
    label: 'Malignancy-Suspicious (High-Risk Escalation)',
    code: 'SIM-CASE-MALIGNANCY-303',
    workflowMeaning:
      'High-risk thoracic escalation. Fast-track case for prompt senior radiologist/pulmonologist review and diagnostic staging workup to avoid diagnostic delay.',
  },
  UNCERTAIN_DUAL_RISK: {
    label: 'Uncertain / Dual-Risk (Safety Abstention)',
    code: 'SIM-CASE-UNCERTAIN-404',
    workflowMeaning:
      'Algorithmic abstention & multi-disciplinary review. Neither category can be safely ruled out or prioritized without risk of diagnostic anchoring. Mandates prompt clinician assessment without reliance on automated scoring.',
  },
}

/**
 * Deterministically constructs simulated response for a scenario.
 * Same scenario always produces the exact same deterministic scores, conformal sets, and triage output.
 */
export function getSimulatedScenarioResponse(scenario: TriageOutcome, caseLabel?: string): AnalysisResponse {
  const meta = SCENARIO_METADATA[scenario]
  const caseId = caseLabel && caseLabel.trim().length > 0
    ? `SIM-${caseLabel.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '')}-${scenario.slice(0, 3)}`
    : meta.code

  const timestamp = '2026-10-27T12:00:00.000Z'
  const heatmapBase64 = createSyntheticHeatmapDataUrl(scenario)

  let scores = { normal: 0.94, tb_consistent: 0.04, malignancy_suspicious: 0.02 }
  let predictionSet: PredictionClass[] = ['normal']
  let limitations: string[] = []

  switch (scenario) {
    case 'NORMAL':
      scores = { normal: 0.94, tb_consistent: 0.04, malignancy_suspicious: 0.02 }
      predictionSet = ['normal']
      limitations = [
        'SIMULATED DEMO: Scripted example demonstrating non-pathological clearance.',
        'Normal output does not exclude micro-nodules or early-stage pathology below CXR resolution.',
        'Simulated scores are illustrative model outputs, not calibrated clinical probabilities.',
      ]
      break

    case 'TB_CONSISTENT':
      scores = { normal: 0.07, tb_consistent: 0.89, malignancy_suspicious: 0.04 }
      predictionSet = ['tb_consistent']
      limitations = [
        'SIMULATED DEMO: Scripted scenario simulating TB concordance without malignancy overlap.',
        'Radiological findings of TB can mimic chronic fungal infection or sarcoidosis.',
        'Confirmatory microbiological and clinical correlation is required.',
      ]
      break

    case 'MALIGNANCY_SUSPICIOUS':
      scores = { normal: 0.03, tb_consistent: 0.05, malignancy_suspicious: 0.92 }
      predictionSet = ['malignancy_suspicious']
      limitations = [
        'SIMULATED DEMO: Scripted scenario simulating high-risk neoplastic suspicion.',
        'CXR has low specificity for distinguishing benign tuberculomas from malignant nodules.',
        'Diagnostic confirmation requires tissue histology and staging imaging.',
      ]
      break

    case 'UNCERTAIN_DUAL_RISK':
    default:
      scores = { normal: 0.08, tb_consistent: 0.74, malignancy_suspicious: 0.71 }
      predictionSet = ['tb_consistent', 'malignancy_suspicious']
      limitations = [
        'SIMULATED DEMO: Key hackathon differentiator demonstrating safety policy abstention.',
        'Uncertainty does not imply simultaneous dual disease; it indicates the model cannot safely differentiate.',
        'Conformal coverage guarantee holds only under valid calibration and exchangeability assumptions.',
      ]
      break
  }

  // Use the real pure safety policy function to evaluate the prediction set and scores
  const policyResult = evaluateSafetyPolicy(predictionSet, scores)

  return {
    case_id: caseId,
    status: 'completed',
    mode: 'simulated',
    simulated: true,
    timestamp,
    model: {
      name: 'DenseNet-121-CXR-v1.0 (Simulated)',
      scores,
      calibrated: false,
    },
    conformal: {
      prediction_set: predictionSet,
      target_coverage: 0.95,
      method: 'split_conformal_lac',
    },
    safety_policy: {
      version: policyResult.policyVersion,
      abstained: policyResult.abstained,
      triggered_rules: policyResult.triggeredRules,
      reasons: policyResult.reasons,
    },
    triage: policyResult.triage,
    explainability: {
      available: true,
      method: 'gradcam',
      heatmap_png_base64: heatmapBase64,
      note: 'Illustrative placeholder, not derived from your image.',
    },
    limitations,
  }
}

/**
 * Simulates pipeline execution delay and returns deterministic response
 */
export async function simulateAnalysis(
  scenario: TriageOutcome,
  caseLabel?: string,
  abortSignal?: AbortSignal
): Promise<AnalysisResponse> {
  const simulatedDelayMs = 900 // Stage progression duration

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

