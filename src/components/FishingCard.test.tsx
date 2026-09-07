import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { FishingCard } from './FishingCard'

describe('FishingCard', () => {
  it('defaults to clear water and updates the recommendation immediately on tapping another option', async () => {
    const user = userEvent.setup()
    // Low radiation + moderate cloud cover -> "low" light (golden-hour proxy).
    render(<FishingCard isDay={true} cloudCoverPct={50} shortwaveRadiation={20} />)

    expect(screen.getByText('Light: Low')).toBeInTheDocument()
    const clearStrategy = screen.getByText(/increased contrast with silhouette/)
    expect(clearStrategy).toBeInTheDocument()

    await user.click(screen.getByRole('radio', { name: 'Murky' }))

    // Recommendation updates immediately, no confirmation step, same screen (section 11.3).
    expect(screen.getByText(/large contrast boundaries/)).toBeInTheDocument()
    expect(screen.queryByText(/increased contrast with silhouette/)).not.toBeInTheDocument()
  })

  it('re-derives light level from the props it is given', () => {
    render(<FishingCard isDay={false} cloudCoverPct={0} shortwaveRadiation={0} />)
    expect(screen.getByText('Light: Dark')).toBeInTheDocument()
  })
})
