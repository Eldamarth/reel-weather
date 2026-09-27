import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { buildHourlySeries } from '../weather/consensus'
import { makeModel } from '../weather/fixtures'
import type { DailySunTimes } from '../weather/models'
import { FishActivityView } from './FishActivityView'

const DAILY: DailySunTimes[] = [
  { date: '2026-09-26', sunrise: '2026-09-26T06:32', sunset: '2026-09-26T19:12' },
]

// Hours spanning dusk (peak for both Pike and Zander) so the "current" point
// has a rich, non-empty reasons list to assert against.
const HOURS = ['12:00', '18:00', '19:00', '20:00']

function buildSeries() {
  const byModel = {
    'model-a': HOURS.map((h) => makeModel({ modelId: 'model-a', timestamp: `2026-09-26T${h}` })),
  }
  return buildHourlySeries(byModel, ['model-a'])
}

describe('FishActivityView', () => {
  it('shows the species catalog first, with the non-occurrence-filtering disclaimer', () => {
    render(
      <FishActivityView
        coordinates={{ latitude: 55, longitude: 12 }}
        timestamp="2026-09-26T19:00"
        daily={DAILY}
        series={buildSeries()}
        sunset={DAILY[0].sunset}
      />,
    )
    expect(screen.getByText('What would this species be doing here today?')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Northern Pike/ })).toBeInTheDocument()
  })

  it('selecting an activity species (Pike) shows a timeline, reasons, and confidence, and never lets the caller change location', async () => {
    const user = userEvent.setup()
    render(
      <FishActivityView
        coordinates={{ latitude: 55, longitude: 12 }}
        timestamp="2026-09-26T19:00"
        daily={DAILY}
        series={buildSeries()}
        sunset={DAILY[0].sunset}
      />,
    )

    await user.click(screen.getByRole('button', { name: /Northern Pike/ }))

    expect(screen.getByRole('heading', { name: 'Northern Pike' })).toBeInTheDocument()
    expect(screen.getByText('Esox lucius')).toBeInTheDocument()
    expect(screen.getByText('Current relative window')).toBeInTheDocument()
    expect(screen.getByText('Why?')).toBeInTheDocument()
    expect(screen.getByText(/Evidence confidence:/)).toBeInTheDocument()
    expect(
      screen.getByText(
        'Relative research-based activity index — not a probability of catching a fish.',
      ),
    ).toBeInTheDocument()

    // Back returns to the catalog without ever touching location/forecast state.
    await user.click(screen.getByRole('button', { name: '← Species' }))
    expect(screen.getByText('What would this species be doing here today?')).toBeInTheDocument()
  })

  it('selecting the accessibility species (Sea Trout) shows habitat/accessibility framing, not a fake activity score', async () => {
    const user = userEvent.setup()
    render(
      <FishActivityView
        coordinates={{ latitude: 55, longitude: 12 }}
        timestamp="2026-09-26T19:00"
        daily={DAILY}
        series={buildSeries()}
        sunset={DAILY[0].sunset}
      />,
    )

    await user.click(screen.getByRole('button', { name: /Sea Trout/ }))

    expect(screen.getByText('Current habitat / accessibility context')).toBeInTheDocument()
    expect(screen.getByText('This is not a bite-probability forecast.')).toBeInTheDocument()
    expect(screen.queryByText('Today')).not.toBeInTheDocument() // no activity timeline section
  })

  it('shows the Perch murky-water caveat only when murky is selected, and never changes the diel level', async () => {
    const user = userEvent.setup()
    render(
      <FishActivityView
        coordinates={{ latitude: 55, longitude: 12 }}
        timestamp="2026-09-26T19:00"
        daily={DAILY}
        series={buildSeries()}
        sunset={DAILY[0].sunset}
      />,
    )

    await user.click(screen.getByRole('button', { name: /European Perch/ }))

    const levelBefore = screen.getByText('Current relative window').nextSibling?.textContent
    expect(screen.queryByText(/current "murky" setting is broader/)).not.toBeInTheDocument()

    await user.click(screen.getByRole('radio', { name: 'Murky' }))

    expect(screen.getByText(/current "murky" setting is broader/)).toBeInTheDocument()
    const levelAfter = screen.getByText('Current relative window').nextSibling?.textContent
    expect(levelAfter).toBe(levelBefore)
  })

  it('adjusting water temperature does not change the selected species or reset to the catalog', async () => {
    const user = userEvent.setup()
    render(
      <FishActivityView
        coordinates={{ latitude: 55, longitude: 12 }}
        timestamp="2026-09-26T19:00"
        daily={DAILY}
        series={buildSeries()}
        sunset={DAILY[0].sunset}
      />,
    )

    await user.click(screen.getByRole('button', { name: /Zander/ }))
    await user.click(screen.getByRole('button', { name: 'Increase water temperature' }))

    expect(screen.getByRole('heading', { name: 'Zander' })).toBeInTheDocument()
    expect(screen.getByText('16°C')).toBeInTheDocument()
  })
})
