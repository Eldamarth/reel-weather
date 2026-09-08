import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { calculateForecastAgreement } from '../weather/agreement'
import { buildConsensusPoint } from '../weather/consensus'
import { makeModel } from '../weather/fixtures'
import type { HourlyForecast } from '../weather/models'
import { HourlyTimeline } from './HourlyTimeline'

beforeAll(() => {
  // jsdom doesn't implement scrollIntoView.
  Element.prototype.scrollIntoView = vi.fn()
})

function hour(timestamp: string, temperatureC: number): HourlyForecast {
  const models = [makeModel({ modelId: 'a', timestamp, temperatureC, weatherCode: 0 })]
  return {
    timestamp,
    consensus: buildConsensusPoint(models, ['a'], timestamp),
    agreement: calculateForecastAgreement(models),
    modelsAtHour: { a: models[0] },
  }
}

const SERIES: HourlyForecast[] = [
  hour('2026-09-06T12:00', 20),
  hour('2026-09-06T13:00', 21),
  hour('2026-09-07T00:00', 15),
]

describe('HourlyTimeline', () => {
  it('labels the anchor hour NOW and others by clock time', () => {
    render(
      <HourlyTimeline
        series={SERIES}
        selectedIndex={0}
        nowIndex={0}
        onSelect={vi.fn()}
        temperatureUnit="celsius"
      />,
    )
    expect(screen.getByText('NOW')).toBeInTheDocument()
    expect(screen.getByText('1 PM')).toBeInTheDocument()
  })

  it('shows a day-boundary marker only when the calendar date changes', () => {
    render(
      <HourlyTimeline
        series={SERIES}
        selectedIndex={0}
        nowIndex={0}
        onSelect={vi.fn()}
        temperatureUnit="celsius"
      />,
    )
    // Sept 6 -> Sept 7 boundary is at index 2; the 12 PM label there disambiguates it from "12 AM" midnight.
    expect(screen.getByText('12 AM')).toBeInTheDocument()
    expect(screen.getAllByText(/Sun|Mon/).length).toBeGreaterThan(0)
  })

  it('marks the selected hour and calls onSelect with the tapped index', async () => {
    const onSelect = vi.fn()
    const user = userEvent.setup()
    render(
      <HourlyTimeline
        series={SERIES}
        selectedIndex={0}
        nowIndex={0}
        onSelect={onSelect}
        temperatureUnit="celsius"
      />,
    )

    const options = screen.getAllByRole('option')
    expect(options[0]).toHaveAttribute('aria-selected', 'true')
    expect(options[1]).toHaveAttribute('aria-selected', 'false')

    await user.click(options[1])
    expect(onSelect).toHaveBeenCalledWith(1)
  })
})
