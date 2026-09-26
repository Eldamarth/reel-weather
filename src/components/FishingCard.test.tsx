import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import type { DailySunTimes } from '../weather/models'
import { FishingCard } from './FishingCard'

describe('FishingCard', () => {
  it('defaults to clear water and updates the recommendation immediately on tapping another option', async () => {
    const user = userEvent.setup()
    // Low radiation + moderate cloud cover -> "low" light (golden-hour proxy).
    render(
      <FishingCard
        isDay={true}
        cloudCoverPct={50}
        shortwaveRadiation={20}
        timestamp="2026-09-06T12:00"
        sunTimes={null}
      />,
    )

    expect(screen.getByText('Light: Low')).toBeInTheDocument()
    // Clarity is the dominant input: clear water stays "Natural" even in low
    // light — light only raises its silhouette/opacity properties, it does
    // not switch to a different strategy.
    expect(screen.getByText('Natural')).toBeInTheDocument()
    expect(screen.getByText(/Silhouette: medium/)).toBeInTheDocument()

    await user.click(screen.getByRole('radio', { name: 'Murky' }))

    // Recommendation updates immediately, no confirmation step, same screen (section 11.3).
    expect(screen.getByText('Dark silhouette')).toBeInTheDocument()
    expect(screen.getByText(/Also consider: Bright \/ opaque/)).toBeInTheDocument()
    expect(screen.queryByText('Natural')).not.toBeInTheDocument()
  })

  it('re-derives light level from the props it is given', () => {
    render(
      <FishingCard
        isDay={false}
        cloudCoverPct={0}
        shortwaveRadiation={0}
        timestamp="2026-09-06T23:00"
        sunTimes={null}
      />,
    )
    expect(screen.getByText('Light: Dark')).toBeInTheDocument()
  })

  it('prefers real sunset proximity over the radiation proxy when sun times are available', () => {
    // High radiation + clear sky would otherwise read as "bright" — being
    // minutes from actual sunset should win instead.
    const sunTimes: DailySunTimes = {
      date: '2026-09-06',
      sunrise: '2026-09-06T06:48',
      sunset: '2026-09-06T18:57',
    }
    render(
      <FishingCard
        isDay={true}
        cloudCoverPct={5}
        shortwaveRadiation={500}
        timestamp="2026-09-06T19:10"
        sunTimes={sunTimes}
      />,
    )
    expect(screen.getByText('Light: Low')).toBeInTheDocument()
  })

  it('water tint is collapsed and optional by default, and updates the recommendation and its own summary label when changed', async () => {
    const user = userEvent.setup()
    render(
      <FishingCard
        isDay={true}
        cloudCoverPct={20}
        shortwaveRadiation={500}
        timestamp="2026-09-06T12:00"
        sunTimes={null}
      />,
    )

    // Collapsed by default: the selector's radio buttons aren't the point of
    // a first glance, but the section itself must still be discoverable.
    expect(screen.getByText('Water tint (optional)')).toBeInTheDocument()
    expect(screen.getByText('Evidence: Moderate')).toBeInTheDocument() // clear water's baseline confidence

    await user.click(screen.getByText('Water tint (optional)'))
    await user.click(screen.getByRole('radio', { name: 'Sediment' }))

    // The summary itself now names the non-default choice, so it isn't easy to forget.
    expect(screen.getByText('Water tint (optional): Sediment')).toBeInTheDocument()
  })
})
