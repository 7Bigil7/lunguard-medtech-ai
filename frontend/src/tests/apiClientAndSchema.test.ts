import { describe, it, expect } from 'vitest'
import {
  AnalysisResponseSchema,
  HealthResponseSchema,
} from '../lib/schemas'
import { getSimulatedScenarioResponse } from '../services/demoSimulator'
import type { TriageOutcome } from '../types/api'

describe('API Schema & Runtime Validation', () => {
  it('validates all 4 simulated scenarios against AnalysisResponseSchema', () => {
    const outcomes: TriageOutcome[] = [
      'NORMAL',
      'TB_CONSISTENT',
      'MALIGNANCY_SUSPICIOUS',
      'UNCERTAIN_DUAL_RISK',
    ]

    for (const outcome of outcomes) {
      const response = getSimulatedScenarioResponse(outcome, 'TEST-CASE')
      const parseResult = AnalysisResponseSchema.safeParse(response)
      expect(parseResult.success).toBe(true)
      if (parseResult.success) {
        expect(parseResult.data.triage).toBe(outcome)
        expect(parseResult.data.simulated).toBe(true)
      }
    }
  })

  it('rejects payload with invalid/missing case_id or status', () => {
    const valid = getSimulatedScenarioResponse('NORMAL')
    const invalid = { ...valid, case_id: undefined }
    const result = AnalysisResponseSchema.safeParse(invalid)
    expect(result.success).toBe(false)
  })

  it('rejects payload with invalid model scores (out of bounds > 1.0)', () => {
    const valid = getSimulatedScenarioResponse('NORMAL')
    const invalid = {
      ...valid,
      model: {
        ...valid.model,
        scores: {
          ...valid.model.scores,
          normal: 1.5, // Invalid: exceeds 1.0
        },
      },
    }
    const result = AnalysisResponseSchema.safeParse(invalid)
    expect(result.success).toBe(false)
  })

  it('rejects payload with unrecognized triage outcome enum', () => {
    const valid = getSimulatedScenarioResponse('NORMAL')
    const invalid = { ...valid, triage: 'UNVERIFIED_DISEASE' }
    const result = AnalysisResponseSchema.safeParse(invalid)
    expect(result.success).toBe(false)
  })

  it('validates a correct HealthResponse payload', () => {
    const payload = {
      status: 'ok',
      model_loaded: true,
      mode: 'inference',
      model_name: 'DenseNet-121-CXR-v1.0',
      policy_version: 'v1.2-conservative',
      version: '1.0.0',
    }
    const result = HealthResponseSchema.safeParse(payload)
    expect(result.success).toBe(true)
  })

  it('rejects health payload when status is not "ok"', () => {
    const payload = {
      status: 'degraded',
      model_loaded: false,
      mode: 'inference',
      model_name: null,
      policy_version: null,
      version: '1.0.0',
    }
    const result = HealthResponseSchema.safeParse(payload)
    expect(result.success).toBe(false)
  })
})
