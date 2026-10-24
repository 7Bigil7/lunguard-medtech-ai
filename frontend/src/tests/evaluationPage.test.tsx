import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Evaluation } from '../pages/Evaluation'

describe('Evaluation Page', () => {
  it('renders honest evaluation pending status with no fabricated numbers', () => {
    render(<Evaluation />)

    expect(screen.getByText('Status: Evaluation pending.')).toBeInTheDocument()
    expect(
      screen.getByText(
        'No measured results are available yet. No fabricated numbers are displayed.'
      )
    ).toBeInTheDocument()
  })

  it('renders "Not yet measured" across all metric cards', () => {
    render(<Evaluation />)

    const notYetMeasuredElements = screen.getAllByText('Not yet measured')
    // 9 metric cards: Malignancy Sensitivity, Specificity, Precision, Recall, F1, AUROC, Conformal Coverage, Set Size, Abstention Rate
    expect(notYetMeasuredElements.length).toBeGreaterThanOrEqual(9)
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
