import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { NeutralErrorAlert } from '../components/analysis/NeutralErrorAlert'

describe('NeutralErrorAlert Component', () => {
  it('renders neutral error title and message without triage language', () => {
    render(
      <NeutralErrorAlert
        code="NETWORK_ERROR"
        message="Backend server did not respond within 25 seconds."
      />
    )

    expect(screen.getByText('Analysis could not be completed')).toBeInTheDocument()
    expect(screen.getByText('Error Code: NETWORK_ERROR')).toBeInTheDocument()
    expect(
      screen.getByText('Backend server did not respond within 25 seconds.')
    ).toBeInTheDocument()

    // Verifies it states explicitly that this is an application error and not clinical
    expect(
      screen.getByText(
        'This is an application or network error. It does not reflect patient imaging or clinical findings.'
      )
    ).toBeInTheDocument()

    // Must NEVER show triage classifications
    expect(screen.queryByText(/UNCERTAIN \/ DUAL-RISK/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/TB-CONSISTENT/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/MALIGNANCY-SUSPICIOUS/i)).not.toBeInTheDocument()
  })

  it('triggers onRetry callback when retry button is clicked', () => {
    const handleRetry = vi.fn()
    render(
      <NeutralErrorAlert
        code="INFERENCE_FAILED"
        message="Internal GPU memory error."
        onRetry={handleRetry}
      />
    )

    const retryBtn = screen.getByRole('button', { name: /Retry Request/i })
    fireEvent.click(retryBtn)
    expect(handleRetry).toHaveBeenCalledTimes(1)
  })
})
