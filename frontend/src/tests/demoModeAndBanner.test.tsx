import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { DemoModeBanner } from '../components/layout/DemoModeBanner'
import * as useAppModule from '../context/useApp'
import type { AppContextValue } from '../context/AppContextInstance'

describe('DemoModeBanner & App Mode States', () => {
  const baseMockContext: AppContextValue = {
    mode: 'demo',
    health: null,
    healthError: null,
    isCheckingHealth: false,
    simulatedScenario: 'UNCERTAIN_DUAL_RISK',
    setSimulatedScenario: vi.fn(),
    enterDemoMode: vi.fn(),
    exitDemoMode: vi.fn(),
    recheckBackend: vi.fn(),
  }

  it('renders persistent simulation banner when mode is "demo"', () => {
    vi.spyOn(useAppModule, 'useApp').mockReturnValue(baseMockContext)

    render(<DemoModeBanner />)

    expect(screen.getByRole('alert', { name: /Simulation Mode Banner/i })).toBeInTheDocument()
    expect(
      screen.getByText(
        'SIMULATED DEMO MODE. Results below are scripted examples, not real AI inference on your image.'
      )
    ).toBeInTheDocument()
    expect(screen.getByText(/Select simulated scenario:/i)).toBeInTheDocument()
    expect(screen.getByText(/1\. Uncertain \/ Dual-Risk/i)).toBeInTheDocument()
    expect(screen.getByText(/2\. TB-Consistent/i)).toBeInTheDocument()
    expect(screen.getByText(/3\. Malignancy-Suspicious/i)).toBeInTheDocument()
    expect(screen.getByText(/4\. Normal/i)).toBeInTheDocument()
  })

  it('does NOT render banner when mode is "live"', () => {
    vi.spyOn(useAppModule, 'useApp').mockReturnValue({
      ...baseMockContext,
      mode: 'live',
    })

    const { container } = render(<DemoModeBanner />)
    expect(container.firstChild).toBeNull()
  })

  it('does NOT render banner when mode is "backend-unavailable"', () => {
    vi.spyOn(useAppModule, 'useApp').mockReturnValue({
      ...baseMockContext,
      mode: 'backend-unavailable',
    })

    const { container } = render(<DemoModeBanner />)
    expect(container.firstChild).toBeNull()
  })
})
