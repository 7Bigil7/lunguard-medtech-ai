import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Evaluation } from '../pages/Evaluation'

describe('Evaluation Page', () => {
  it('renders benchmark validated status with empirical test results', () => {
    render(<Evaluation />)

    expect(
      screen.getByText('Status: Benchmark Validated (Held-Out Test Cohort)')
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        /Measured across held-out multi-center test cohorts/i
      )
    ).toBeInTheDocument()
  })

  it('renders measured metrics across all metric cards', () => {
    render(<Evaluation />)

    // Key metrics should be formatted as active percentages and numeric values
    expect(screen.getByText('92.4%')).toBeInTheDocument() // Malignancy Sensitivity
    expect(screen.getAllByText('89.1%').length).toBeGreaterThanOrEqual(1) // Overall Specificity & F1
    expect(screen.getByText('86.5%')).toBeInTheDocument() // Precision
    expect(screen.getByText('91.8%')).toBeInTheDocument() // Recall
    expect(screen.getByText('0.934')).toBeInTheDocument() // AUROC
    expect(screen.getByText('95.0%')).toBeInTheDocument() // Conformal Coverage
    expect(screen.getByText('1.180')).toBeInTheDocument() // Average Set Size
    expect(screen.getByText('12.3%')).toBeInTheDocument() // Abstention Rate
  })

  it('renders 98% figure strictly as an "Engineering Target, Unvalidated"', () => {
    render(<Evaluation />)

    expect(
      screen.getByText('≥ 98.0% (Engineering Target, Unvalidated)')
    ).toBeInTheDocument()
  })

  it('renders public datasets under consideration with explicit caveats', () => {
    render(<Evaluation />)

    expect(screen.getByText('NIH ChestX-ray14')).toBeInTheDocument()
    expect(screen.getByText('Shenzhen TB Dataset')).toBeInTheDocument()
    expect(screen.getByText('Montgomery County TB Set')).toBeInTheDocument()
    expect(screen.getByText('Stanford CheXpert')).toBeInTheDocument()

    expect(
      screen.getByText(/These public datasets differ substantially in label definitions/i)
    ).toBeInTheDocument()
  })
})
