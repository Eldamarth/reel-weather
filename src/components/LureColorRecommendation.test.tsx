import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { recommendLureColors } from '../fishing/recommendations'
import { LureColorRecommendation } from './LureColorRecommendation'

describe('LureColorRecommendation', () => {
  it('renders the strategy, properties, colors, light level, and disclaimer', () => {
    const recommendation = recommendLureColors('murky', 'low')
    render(
      <LureColorRecommendation recommendation={recommendation} light="low" cloudCoverPct={78} />,
    )

    expect(screen.getByText(recommendation.strategy)).toBeInTheDocument()
    expect(screen.getByText('dark-silhouette')).toBeInTheDocument()
    expect(screen.getByText('black')).toBeInTheDocument()
    expect(screen.getByText('Light: Low')).toBeInTheDocument()
    expect(screen.getByText('Cloud cover: 78%')).toBeInTheDocument()
    expect(screen.getByText(/not guarantees of fish behavior/)).toBeInTheDocument()
  })

  it('omits the cloud-cover line when it is unavailable rather than showing a placeholder', () => {
    const recommendation = recommendLureColors('clear', 'bright')
    render(
      <LureColorRecommendation
        recommendation={recommendation}
        light="bright"
        cloudCoverPct={null}
      />,
    )
    expect(screen.queryByText(/Cloud cover/)).not.toBeInTheDocument()
  })
})
