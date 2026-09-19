import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { calculateForecastAgreement } from '../weather/agreement'
import { buildConsensusPoint } from '../weather/consensus'
import { makeModel } from '../weather/fixtures'
import { ConsensusCard } from './ConsensusCard'

describe('ConsensusCard', () => {
  it('renders the consensus temperature, model count, and agreement', () => {
    const models = ['a', 'b', 'c'].map((id) => makeModel({ modelId: id, temperatureC: 20 }))
    const consensus = buildConsensusPoint(models, ['a', 'b', 'c'], '2026-09-06T12:00')
    const agreement = calculateForecastAgreement(models)

    render(
      <ConsensusCard
        locationName="Boulder, CO"
        timezone="America/Denver"
        timeLabel="NOW"
        consensus={consensus}
        agreement={agreement}
        temperatureUnit="celsius"
      />,
    )

    expect(screen.getByText('Boulder, CO')).toBeInTheDocument()
    expect(screen.getByText('20°C', { exact: false })).toBeInTheDocument()
    expect(screen.getByText('Consensus from 3 models')).toBeInTheDocument()
    // The date is shown alongside the time so a selected hour days ahead (section 9's
    // timeline) doesn't read as ambiguous about which day it belongs to.
    expect(screen.getByText('Sun, Sep 6', { exact: false })).toBeInTheDocument()
    // Stats need labels, not just an emoji and a bare number — a reader
    // shouldn't have to guess what "4/6 models" or "99%" refers to.
    expect(screen.getByText('Precip')).toBeInTheDocument()
    expect(screen.getByText('Wind')).toBeInTheDocument()
    expect(screen.getByText('Cloud')).toBeInTheDocument()
  })

  it('renders in Fahrenheit when that is the selected unit', () => {
    const models = ['a', 'b', 'c'].map((id) => makeModel({ modelId: id, temperatureC: 20 }))
    const consensus = buildConsensusPoint(models, ['a', 'b', 'c'], '2026-09-06T12:00')
    const agreement = calculateForecastAgreement(models)

    render(
      <ConsensusCard
        locationName="Boulder, CO"
        timezone="America/Denver"
        timeLabel="NOW"
        consensus={consensus}
        agreement={agreement}
        temperatureUnit="fahrenheit"
      />,
    )

    expect(screen.getByText('68°F', { exact: false })).toBeInTheDocument()
  })

  it('surfaces a hazard banner for a minority thunderstorm signal', () => {
    const models = [
      makeModel({ modelId: 'a', weatherCode: 3 }),
      makeModel({ modelId: 'b', weatherCode: 3 }),
      makeModel({ modelId: 'c', weatherCode: 3 }),
      makeModel({ modelId: 'd', weatherCode: 95 }),
    ]
    const consensus = buildConsensusPoint(models, ['a', 'b', 'c', 'd'], '2026-09-06T12:00')
    const agreement = calculateForecastAgreement(models)

    render(
      <ConsensusCard
        locationName="Boulder, CO"
        timezone="America/Denver"
        timeLabel="NOW"
        consensus={consensus}
        agreement={agreement}
        temperatureUnit="fahrenheit"
      />,
    )

    expect(
      screen.getByText('1 model indicates thunderstorms.', { exact: false }),
    ).toBeInTheDocument()
  })
})
