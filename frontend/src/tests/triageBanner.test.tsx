import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { TriageBanner } from '../components/results/TriageBanner'

describe('TriageBanner Component', () => {
  it('renders exact required text for NORMAL outcome', () => {
    render(<TriageBanner triage="NORMAL" isSimulated={false} />)

    expect(screen.getByText('NORMAL')).toBeInTheDocument()
    expect(
      screen.getByText(
        'No significant abnormality identified by the model. This result does not exclude disease and must be interpreted alongside clinical findings.'
      )
    ).toBeInTheDocument()
  })

  it('renders exact required text for TB-CONSISTENT outcome', () => {
    render(<TriageBanner triage="TB_CONSISTENT" isSimulated={false} />)

    expect(screen.getByText('TB-CONSISTENT')).toBeInTheDocument()
    expect(
      screen.getByText(
        'Findings may be consistent with tuberculosis. Clinical assessment and appropriate confirmatory testing are required.'
      )
    ).toBeInTheDocument()
  })

  it('renders exact required text for MALIGNANCY-SUSPICIOUS outcome', () => {
    render(<TriageBanner triage="MALIGNANCY_SUSPICIOUS" isSimulated={false} />)

    expect(screen.getByText('MALIGNANCY-SUSPICIOUS')).toBeInTheDocument()
    expect(
      screen.getByText(
        'Findings warrant further evaluation for possible malignancy. Prompt clinician review and appropriate diagnostic investigation are recommended.'
      )
    ).toBeInTheDocument()
  })

  it('renders exact required text and prominent headline for UNCERTAIN_DUAL_RISK outcome', () => {
    render(<TriageBanner triage="UNCERTAIN_DUAL_RISK" isSimulated={false} />)

    expect(
      screen.getByText('UNCERTAIN / DUAL-RISK — FURTHER CLINICAL EVALUATION REQUIRED.')
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        'The model has not produced a sufficiently reliable classification under the configured safety policy. Review the prediction set and clinical context before determining the appropriate next steps.'
      )
    ).toBeInTheDocument()
  })

  it('renders SIMULATED label when isSimulated is true', () => {
    render(<TriageBanner triage="UNCERTAIN_DUAL_RISK" isSimulated={true} />)
    expect(screen.getByText('SIMULATED RESULT')).toBeInTheDocument()
  })

  it('does NOT render SIMULATED label when isSimulated is false', () => {
    render(<TriageBanner triage="UNCERTAIN_DUAL_RISK" isSimulated={false} />)
    expect(screen.queryByText('SIMULATED RESULT')).not.toBeInTheDocument()
  })
})
