import { describe, expect, it } from 'vitest'
import { TOLERANCE_CURVES } from '../config/agreementThresholds'
import {
  agreementDots,
  agreementLabel,
  agreementTier,
  calculateFieldAgreement,
  calculateForecastAgreement,
  calculateOverallAgreement,
  mostDisagreementField,
  spreadToAgreement,
} from './agreement'
import { makeModel } from './fixtures'

describe('spreadToAgreement', () => {
  const curve = TOLERANCE_CURVES.temperatureC

  it('is perfect agreement at zero spread', () => {
    expect(spreadToAgreement(0, curve)).toBe(1)
  })

  it('is very high agreement at the high-agreement anchor', () => {
    expect(spreadToAgreement(curve.highAgreementSpread, curve)).toBeCloseTo(0.95, 5)
  })

  it('is low agreement at the low-agreement anchor', () => {
    expect(spreadToAgreement(curve.lowAgreementSpread, curve)).toBeCloseTo(0.25, 5)
  })

  it('never goes below zero for extreme spreads', () => {
    expect(spreadToAgreement(1000, curve)).toBe(0)
  })
})

describe('calculateFieldAgreement', () => {
  it('is perfect agreement when every model agrees', () => {
    expect(calculateFieldAgreement([20, 20, 20], TOLERANCE_CURVES.temperatureC)).toBe(1)
  })

  it('is perfect agreement by convention with fewer than two data points', () => {
    expect(calculateFieldAgreement([20], TOLERANCE_CURVES.temperatureC)).toBe(1)
    expect(calculateFieldAgreement([], TOLERANCE_CURVES.temperatureC)).toBe(1)
  })

  it('degrades as spread grows', () => {
    const tight = calculateFieldAgreement([20, 20.5], TOLERANCE_CURVES.temperatureC)
    const wide = calculateFieldAgreement([10, 30], TOLERANCE_CURVES.temperatureC)
    expect(tight).toBeGreaterThan(wide)
  })

  it('ignores nulls when computing spread', () => {
    expect(calculateFieldAgreement([20, null, 20], TOLERANCE_CURVES.temperatureC)).toBe(1)
  })
})

describe('calculateOverallAgreement', () => {
  it('is a weighted sum of the field scores', () => {
    const weights = {
      temperature: 0.15,
      wind: 0.2,
      cloudCover: 0.15,
      precipitation: 0.35,
      pressure: 0.15,
    }
    const overall = calculateOverallAgreement(
      { temperature: 1, wind: 1, cloudCover: 1, precipitation: 1, pressure: 1 },
      weights,
    )
    expect(overall).toBeCloseTo(1, 5)
  })

  it('weights precipitation disagreement more heavily than temperature disagreement', () => {
    const weights = {
      temperature: 0.15,
      wind: 0.2,
      cloudCover: 0.15,
      precipitation: 0.35,
      pressure: 0.15,
    }
    const precipDisagrees = calculateOverallAgreement(
      { temperature: 1, wind: 1, cloudCover: 1, precipitation: 0, pressure: 1 },
      weights,
    )
    const tempDisagrees = calculateOverallAgreement(
      { temperature: 0, wind: 1, cloudCover: 1, precipitation: 1, pressure: 1 },
      weights,
    )
    expect(precipDisagrees).toBeLessThan(tempDisagrees)
  })
})

describe('calculateForecastAgreement', () => {
  it('is high agreement when all models agree closely', () => {
    const models = ['a', 'b', 'c'].map((id) =>
      makeModel({ modelId: id, temperatureC: 20, windSpeedKph: 10, precipitationMm: 0 }),
    )
    const agreement = calculateForecastAgreement(models)
    expect(agreement.overall).toBeGreaterThan(0.9)
  })

  it('drops overall agreement when precipitation amount disagrees sharply', () => {
    const agreeing = calculateForecastAgreement(
      ['a', 'b'].map((id) => makeModel({ modelId: id, precipitationMm: 0 })),
    )
    const disagreeing = calculateForecastAgreement([
      makeModel({ modelId: 'a', precipitationMm: 0 }),
      makeModel({ modelId: 'b', precipitationMm: 20 }),
    ])
    expect(disagreeing.overall).toBeLessThan(agreeing.overall)
  })
})

describe('agreementDots', () => {
  it('fills all five dots at perfect agreement', () => {
    expect(agreementDots(1)).toBe('●●●●●')
  })

  it('fills no dots at zero agreement', () => {
    expect(agreementDots(0)).toBe('○○○○○')
  })

  it('rounds to the nearest dot', () => {
    expect(agreementDots(0.8)).toBe('●●●●○')
  })
})

describe('agreementLabel', () => {
  it.each([
    [0.95, 'Very High Agreement'],
    [0.8, 'High Agreement'],
    [0.6, 'Mixed Forecast'],
    [0.3, 'Low Agreement'],
    [0.1, 'Very Low Agreement'],
  ])('labels %s as %s', (score, label) => {
    expect(agreementLabel(score)).toBe(label)
  })
})

describe('mostDisagreementField', () => {
  it('names the field with the lowest score', () => {
    const field = mostDisagreementField({
      temperature: 0.9,
      wind: 0.8,
      cloudCover: 0.7,
      precipitation: 0.2,
      pressure: 0.95,
      overall: 0.6,
    })
    expect(field).toBe('precipitation')
  })
})

describe('agreementTier', () => {
  it.each([
    [0.9, 'high'],
    [0.6, 'mixed'],
    [0.2, 'low'],
  ])('tiers %s as %s', (score, tier) => {
    expect(agreementTier(score)).toBe(tier)
  })
})
