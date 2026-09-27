import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { SpeciesActivityPoint } from '../fishing/activity/types'
import { SpeciesActivityTimeline } from './SpeciesActivityTimeline'

function makePoint(
  level: SpeciesActivityPoint['level'],
  displayScore: number,
): SpeciesActivityPoint {
  return {
    speciesId: 'northern-pike',
    timestamp: '2026-09-26T12:00',
    level,
    displayScore,
    confidence: 'strong',
    reasons: [],
    cautions: [],
  }
}

describe('SpeciesActivityTimeline', () => {
  it('renders one bar per hourly entry', () => {
    render(
      <SpeciesActivityTimeline
        hourly={[
          { timestamp: '2026-09-26T12:00', point: makePoint('favorable', 60) },
          { timestamp: '2026-09-26T13:00', point: makePoint('high', 80) },
        ]}
        sunset={null}
      />,
    )
    expect(screen.getByText('12 PM')).toBeInTheDocument()
    expect(screen.getByText('1 PM')).toBeInTheDocument()
  })

  it('shows a sunset caption when a sunset time is provided', () => {
    render(
      <SpeciesActivityTimeline
        hourly={[{ timestamp: '2026-09-26T19:00', point: makePoint('peak', 95) }]}
        sunset="2026-09-26T19:12"
      />,
    )
    expect(screen.getByText(/Sunset 7:12 PM/)).toBeInTheDocument()
  })

  it('shows an empty message rather than an empty chart when there are no hourly entries', () => {
    render(<SpeciesActivityTimeline hourly={[]} sunset={null} />)
    expect(screen.getByText(/No forecast hours available/)).toBeInTheDocument()
  })
})
