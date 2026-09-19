import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { recommendLureVisualStrategy } from '../fishing/recommendations'
import { LureColorRecommendation } from './LureColorRecommendation'

describe('LureColorRecommendation', () => {
  it('renders the strategy, properties, colors, evidence, light level, and disclaimer', () => {
    const recommendation = recommendLureVisualStrategy('murky', 'low')
    render(
      <LureColorRecommendation recommendation={recommendation} light="low" cloudCoverPct={78} />,
    )

    expect(screen.getByText('Dark silhouette')).toBeInTheDocument()
    expect(screen.getByText(/Silhouette: high/)).toBeInTheDocument()
    expect(screen.getByText('black')).toBeInTheDocument()
    expect(screen.getByText('Light: Low')).toBeInTheDocument()
    expect(screen.getByText('Cloud cover: 78%')).toBeInTheDocument()
    expect(screen.getByText('Evidence: Low')).toBeInTheDocument()
    expect(screen.getByText(/not guarantees of fish behavior/)).toBeInTheDocument()
  })

  it('shows the alternate strategy and its own example colors for murky water', () => {
    const recommendation = recommendLureVisualStrategy('murky', 'moderate')
    render(
      <LureColorRecommendation
        recommendation={recommendation}
        light="moderate"
        cloudCoverPct={50}
      />,
    )

    expect(screen.getByText(/Also consider: Bright \/ opaque/)).toBeInTheDocument()
    expect(screen.getByText('white/bone')).toBeInTheDocument()
  })

  it('does not show an alternate section for clear water', () => {
    const recommendation = recommendLureVisualStrategy('clear', 'bright')
    render(
      <LureColorRecommendation recommendation={recommendation} light="bright" cloudCoverPct={20} />,
    )
    expect(screen.queryByText(/Also consider/)).not.toBeInTheDocument()
  })

  it('omits the cloud-cover line when it is unavailable rather than showing a placeholder', () => {
    const recommendation = recommendLureVisualStrategy('clear', 'bright')
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
