import type { PredictionClass, ModelOutputScores, TriageOutcome } from '../types/api'

export const SAFETY_POLICY_VERSION = 'demo-policy-v1'

export interface PolicyConfig {
  version?: string
  malignancyEscalationScoreThreshold?: number // Safety score override (default 0.50)
  targetCoverage?: number // e.g. 0.95 (1 - alpha)
}

export interface PolicyEvaluationResult {
  policyVersion: string
  triage: TriageOutcome
  abstained: boolean
  triggeredRules: string[]
  reasons: string[]
}

export const DEFAULT_POLICY_CONFIG: Required<PolicyConfig> = {
  version: SAFETY_POLICY_VERSION,
  malignancyEscalationScoreThreshold: 0.5,
  targetCoverage: 0.95,
}

/**
 * Pure, deterministic safety policy function.
 * Evaluates conformal prediction set membership and model output scores
 * to decide whether to issue a conclusive triage outcome or abstain to UNCERTAIN_DUAL_RISK.
 *
 * @param predictionSet The conformal prediction set C(X) containing non-conforming classes
 * @param scores Simulated or raw model output scores (0.0 to 1.0)
 * @param config Configurable policy parameters
 */
export function evaluateSafetyPolicy(
  predictionSet: PredictionClass[],
  scores: ModelOutputScores,
  config: PolicyConfig = {}
): PolicyEvaluationResult {
  const mergedConfig: Required<PolicyConfig> = {
    ...DEFAULT_POLICY_CONFIG,
    ...config,
  }

  const triggeredRules: string[] = []
  const reasons: string[] = []

  const hasNormal = predictionSet.includes('normal')
  const hasTb = predictionSet.includes('tb_consistent')
  const hasMalignancy = predictionSet.includes('malignancy_suspicious')

  // Rule 1: Empty Prediction Set -> Out-of-Distribution / Abstention
  if (predictionSet.length === 0) {
    triggeredRules.push('RULE_EMPTY_PREDICTION_SET_ABSTAIN')
    triggeredRules.push('RULE_SAFETY_ABSTENTION_ENFORCED')
    reasons.push(
      'Conformal prediction set is empty (no class conformed at target statistical coverage). The image may be out-of-distribution or ambiguous.'
    )
    reasons.push('Safety policy enforces abstention: automated triage withheld.')

    return {
      policyVersion: mergedConfig.version,
      triage: 'UNCERTAIN_DUAL_RISK',
      abstained: true,
      triggeredRules,
      reasons,
    }
  }

  // Rule 2: Multi-Class High-Risk Overlap (TB + Malignancy both present in prediction set)
  if (hasTb && hasMalignancy) {
    triggeredRules.push('RULE_MULTI_CLASS_HIGH_RISK_OVERLAP')
    triggeredRules.push('RULE_SAFETY_ABSTENTION_ENFORCED')
    reasons.push(
      'Prediction set includes both TB-consistent and Malignancy-suspicious classes with overlapping confidence margins.'
    )
    reasons.push(
      'Safety policy forces abstention to protect against diagnostic anchoring in TB-endemic clinical presentation.'
    )

    return {
      policyVersion: mergedConfig.version,
      triage: 'UNCERTAIN_DUAL_RISK',
      abstained: true,
      triggeredRules,
      reasons,
    }
  }

  // Rule 3: Malignancy Score Override Guardrail (Even if set excludes malignancy, high raw score triggers abstention)
  if (!hasMalignancy && scores.malignancy_suspicious >= mergedConfig.malignancyEscalationScoreThreshold) {
    triggeredRules.push('RULE_MALIGNANCY_SENSITIVITY_THRESHOLD')
    triggeredRules.push('RULE_SAFETY_ABSTENTION_ENFORCED')
    reasons.push(
      `Model malignancy score (${scores.malignancy_suspicious.toFixed(2)}) meets or exceeds safety escalation threshold (${mergedConfig.malignancyEscalationScoreThreshold.toFixed(2)}) despite prediction set membership.`
    )
    reasons.push('Safety policy forces abstention for priority thoracic review.')

    return {
      policyVersion: mergedConfig.version,
      triage: 'UNCERTAIN_DUAL_RISK',
      abstained: true,
      triggeredRules,
      reasons,
    }
  }

  // Rule 4: Malignancy-Suspicious (High-Risk Escalation)
  if (hasMalignancy) {
    triggeredRules.push('RULE_HIGH_CONFIDENCE_MALIGNANCY_TRIGGER')
    reasons.push(
      'Conformal prediction set contains malignancy-suspicious classification without ambiguous TB co-occurrence.'
    )
    reasons.push('Safety policy routes case to high-priority clinician review for pulmonary lesion evaluation.')

    return {
      policyVersion: mergedConfig.version,
      triage: 'MALIGNANCY_SUSPICIOUS',
      abstained: false,
      triggeredRules,
      reasons,
    }
  }

  // Rule 5: TB-Consistent (Elevated Risk)
  if (hasTb) {
    triggeredRules.push('RULE_SINGLE_INFECTIOUS_CONCORDANCE')
    reasons.push(
      'Conformal prediction set contains TB-consistent classification. Malignancy score remains below safety boundary.'
    )
    reasons.push('Safety policy routes case to dedicated clinical assessment and confirmatory TB testing.')

    return {
      policyVersion: mergedConfig.version,
      triage: 'TB_CONSISTENT',
      abstained: false,
      triggeredRules,
      reasons,
    }
  }

  // Rule 6: Normal (Low Apparent Risk)
  if (hasNormal && predictionSet.length === 1) {
    triggeredRules.push('RULE_NORMAL_THRESHOLD_SATISFIED')
    reasons.push('Conformal prediction set contains exclusively the normal classification.')
    reasons.push('Model scores satisfy conservative non-pathological clearance threshold.')

    return {
      policyVersion: mergedConfig.version,
      triage: 'NORMAL',
      abstained: false,
      triggeredRules,
      reasons,
    }
  }

  // Fallback Rule: Any other ambiguous multi-class set (e.g. Normal + TB)
  triggeredRules.push('RULE_AMBIGUOUS_MULTI_CLASS_SET')
  triggeredRules.push('RULE_SAFETY_ABSTENTION_ENFORCED')
  reasons.push(
    `Conformal set contains discordant labels (${predictionSet.join(', ')}). Model cannot differentiate conclusively.`
  )
  reasons.push('Safety policy enforces abstention: further clinical evaluation required.')

  return {
    policyVersion: mergedConfig.version,
    triage: 'UNCERTAIN_DUAL_RISK',
    abstained: true,
    triggeredRules,
    reasons,
  }
}
