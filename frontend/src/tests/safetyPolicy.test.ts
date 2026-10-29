import { describe, it, expect } from 'vitest'
import { evaluateSafetyPolicy, SAFETY_POLICY_VERSION } from '../lib/safetyPolicy'
import type { ModelOutputScores } from '../types/api'

describe('Safety Policy Engine (evaluateSafetyPolicy)', () => {
  const neutralScores: ModelOutputScores = {
    normal: 0.1,
    tb_consistent: 0.2,
    malignancy_suspicious: 0.1,
  }

  it('triggers UNCERTAIN / DUAL-RISK and abstains on empty prediction set (out-of-distribution)', () => {
    const result = evaluateSafetyPolicy([], neutralScores)

    expect(result.triage).toBe('UNCERTAIN_DUAL_RISK')
    expect(result.abstained).toBe(true)
    expect(result.triggeredRules).toContain('RULE_EMPTY_PREDICTION_SET_ABSTAIN')
    expect(result.triggeredRules).toContain('RULE_SAFETY_ABSTENTION_ENFORCED')
    expect(result.policyVersion).toBe(SAFETY_POLICY_VERSION)
  })

  it('triggers UNCERTAIN / DUAL-RISK and abstains when both TB and Malignancy are present in set', () => {
    const scores: ModelOutputScores = {
      normal: 0.08,
      tb_consistent: 0.74,
      malignancy_suspicious: 0.71,
    }
    const result = evaluateSafetyPolicy(['tb_consistent', 'malignancy_suspicious'], scores)

    expect(result.triage).toBe('UNCERTAIN_DUAL_RISK')
    expect(result.abstained).toBe(true)
    expect(result.triggeredRules).toContain('RULE_MULTI_CLASS_HIGH_RISK_OVERLAP')
    expect(result.triggeredRules).toContain('RULE_SAFETY_ABSTENTION_ENFORCED')
  })

  it('routes to MALIGNANCY_SUSPICIOUS escalation when set contains only malignancy_suspicious', () => {
    const scores: ModelOutputScores = {
      normal: 0.03,
      tb_consistent: 0.05,
      malignancy_suspicious: 0.92,
    }
    const result = evaluateSafetyPolicy(['malignancy_suspicious'], scores)

    expect(result.triage).toBe('MALIGNANCY_SUSPICIOUS')
    expect(result.abstained).toBe(false)
    expect(result.triggeredRules).toContain('RULE_HIGH_CONFIDENCE_MALIGNANCY_TRIGGER')
  })

  it('routes to TB_CONSISTENT when set contains only tb_consistent and malignancy score is low', () => {
    const scores: ModelOutputScores = {
      normal: 0.07,
      tb_consistent: 0.89,
      malignancy_suspicious: 0.04,
    }
    const result = evaluateSafetyPolicy(['tb_consistent'], scores)

    expect(result.triage).toBe('TB_CONSISTENT')
    expect(result.abstained).toBe(false)
    expect(result.triggeredRules).toContain('RULE_SINGLE_INFECTIOUS_CONCORDANCE')
  })

  it('routes to NORMAL when set contains exclusively normal classification', () => {
    const scores: ModelOutputScores = {
      normal: 0.94,
      tb_consistent: 0.04,
      malignancy_suspicious: 0.02,
    }
    const result = evaluateSafetyPolicy(['normal'], scores)

    expect(result.triage).toBe('NORMAL')
    expect(result.abstained).toBe(false)
    expect(result.triggeredRules).toContain('RULE_NORMAL_THRESHOLD_SATISFIED')
  })

  it('triggers malignancy score override guardrail even when prediction set excludes malignancy', () => {
    const scores: ModelOutputScores = {
      normal: 0.7,
      tb_consistent: 0.1,
      malignancy_suspicious: 0.58, // Exceeds default 0.50 safety threshold
    }
    const result = evaluateSafetyPolicy(['normal'], scores)

    expect(result.triage).toBe('UNCERTAIN_DUAL_RISK')
    expect(result.abstained).toBe(true)
    expect(result.triggeredRules).toContain('RULE_MALIGNANCY_SENSITIVITY_THRESHOLD')
    expect(result.triggeredRules).toContain('RULE_SAFETY_ABSTENTION_ENFORCED')
  })

  it('respects custom configurable threshold for malignancy guardrail', () => {
    const scores: ModelOutputScores = {
      normal: 0.85,
      tb_consistent: 0.05,
      malignancy_suspicious: 0.35,
    }

    // Default threshold 0.50 -> does not trigger override
    const defaultResult = evaluateSafetyPolicy(['normal'], scores)
    expect(defaultResult.triage).toBe('NORMAL')

    // Strict threshold 0.30 -> triggers override
    const strictResult = evaluateSafetyPolicy(['normal'], scores, {
      malignancyEscalationScoreThreshold: 0.3,
    })
    expect(strictResult.triage).toBe('UNCERTAIN_DUAL_RISK')
    expect(strictResult.abstained).toBe(true)
  })
})
