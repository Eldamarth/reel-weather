import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AgreementMeter } from './AgreementMeter'

describe('AgreementMeter', () => {
  it('renders the percentage and label', () => {
    render(<AgreementMeter overall={0.82} />)
    expect(screen.getByText('Model Agreement: 82%')).toBeInTheDocument()
    expect(screen.getByText('High Agreement')).toBeInTheDocument()
  })
})
