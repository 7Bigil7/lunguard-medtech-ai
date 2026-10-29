import { describe, it, expect } from 'vitest'
import { getSimulatedScenarioResponse, SCENARIO_METADATA } from '../services/demoSimulator'
import type { TriageOutcome } from '../types/api'

describe('Deterministic Simulated Scenarios', () => {
  const scenarios: TriageOutcome[] = [
    'NORMAL',
    'TB_CONSISTENT',
    'MALIGNANCY_SUSPICIOUS',
    'UNCERTAIN_DUAL_RISK',
  ]

  it('produces deterministic output for every scenario (same input yields identical output)', () => {
    for (const sc of scenarios) {
      const run1 = getSimulatedScenarioResponse(sc, 'EVAL-01')
      const run2 = getSimulatedScenarioResponse(sc, 'EVAL-01')

      expect(run1.case_id).toBe(run2.case_id)
      expect(run1.triage).toBe(run2.triage)
      expect(run1.model.scores).toEqual(run2.model.scores)
      expect(run1.conformal.prediction_set).toEqual(run2.conformal.prediction_set)
      expect(run1.safety_policy.abstained).toBe(run2.safety_policy.abstained)
      expect(run1.safety_policy.triggered_rules).toEqual(run2.safety_policy.triggered_rules)
    }
  })

  it('verifies NORMAL scenario has clean normal clearance and simulated labels', () => {
    const res = getSimulatedScenarioResponse('NORMAL')
    expect(res.triage).toBe('NORMAL')
    expect(res.simulated).toBe(true)
    expect(res.conformal.prediction_set).toEqual(['normal'])
    expect(res.safety_policy.abstained).toBe(false)
    expect(res.safety_policy.triggered_rules).toContain('RULE_NORMAL_THRESHOLD_SATISFIED')
    expect(SCENARIO_METADATA.NORMAL.workflowMeaning).toContain('Routine clinical correlation')
  })

  it('verifies TB_CONSISTENT scenario has infectious risk output and simulated labels', () => {
    const res = getSimulatedScenarioResponse('TB_CONSISTENT')
    expect(res.triage).toBe('TB_CONSISTENT')
    expect(res.simulated).toBe(true)
    expect(res.conformal.prediction_set).toEqual(['tb_consistent'])
    expect(res.safety_policy.abstained).toBe(false)
    expect(res.safety_policy.triggered_rules).toContain('RULE_SINGLE_INFECTIOUS_CONCORDANCE')
    expect(SCENARIO_METADATA.TB_CONSISTENT.workflowMeaning).toContain('Elevated infectious risk workflow')
  })

  it('verifies MALIGNANCY_SUSPICIOUS scenario has high-risk escalation and simulated labels', () => {
    const res = getSimulatedScenarioResponse('MALIGNANCY_SUSPICIOUS')
    expect(res.triage).toBe('MALIGNANCY_SUSPICIOUS')
    expect(res.simulated).toBe(true)
    expect(res.conformal.prediction_set).toEqual(['malignancy_suspicious'])
    expect(res.safety_policy.abstained).toBe(false)
    expect(res.safety_policy.triggered_rules).toContain('RULE_HIGH_CONFIDENCE_MALIGNANCY_TRIGGER')
    expect(SCENARIO_METADATA.MALIGNANCY_SUSPICIOUS.workflowMeaning).toContain('High-risk thoracic escalation')
  })

  it('verifies UNCERTAIN_DUAL_RISK scenario enforces safety abstention and simulated labels', () => {
    const res = getSimulatedScenarioResponse('UNCERTAIN_DUAL_RISK')
    expect(res.triage).toBe('UNCERTAIN_DUAL_RISK')
    expect(res.simulated).toBe(true)
    expect(res.conformal.prediction_set).toContain('tb_consistent')
    expect(res.conformal.prediction_set).toContain('malignancy_suspicious')
    expect(res.safety_policy.abstained).toBe(true)
    expect(res.safety_policy.triggered_rules).toContain('RULE_MULTI_CLASS_HIGH_RISK_OVERLAP')
    expect(res.safety_policy.triggered_rules).toContain('RULE_SAFETY_ABSTENTION_ENFORCED')
    expect(SCENARIO_METADATA.UNCERTAIN_DUAL_RISK.workflowMeaning).toContain('Algorithmic abstention')
  })

  it('ensures Grad-CAM note is labeled Illustrative placeholder, not derived from your image', () => {
    for (const sc of scenarios) {
      const res = getSimulatedScenarioResponse(sc)
      expect(res.explainability.note).toBe('Illustrative placeholder, not derived from your image.')
    }
  })
})
