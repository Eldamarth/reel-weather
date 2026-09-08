import { describe, expect, it } from 'vitest'
import { buildConsensusPoint, buildHourlySeries, circularMeanDegrees, median } from './consensus'
import { makeModel } from './fixtures'

describe('median', () => {
  it('returns the middle value for an odd count', () => {
    expect(median([1, 5, 3])).toBe(3)
  })

  it('averages the two middle values for an even count', () => {
    expect(median([1, 2, 3, 4])).toBe(2.5)
  })

  it('ignores nulls', () => {
    expect(median([null, 10, null, 20, 30])).toBe(20)
  })

  it('returns null when every value is null', () => {
    expect(median([null, null])).toBeNull()
  })

  it('is resistant to a single extreme outlier', () => {
    expect(median([20, 21, 19, 100])).toBe(20.5)
  })
})

describe('circularMeanDegrees', () => {
  it('averages values that do not cross the 0/360 wraparound', () => {
    expect(circularMeanDegrees([80, 100])).toBeCloseTo(90, 5)
  })

  it('handles directions straddling 0/360 correctly (not a naive arithmetic mean)', () => {
    // Naive mean of 350 and 10 is 180 (due south) — actually north (0/360).
    const result = circularMeanDegrees([350, 10])
    expect(result).not.toBeCloseTo(180, 0)
    expect(result === null ? NaN : Math.min(result, 360 - result)).toBeCloseTo(0, 5)
  })

  it('returns null with no data', () => {
    expect(circularMeanDegrees([null, null])).toBeNull()
  })
})

describe('buildConsensusPoint', () => {
  const selected = ['a', 'b', 'c', 'd', 'e']

  it('all models agree', () => {
    const models = selected.map((id) => makeModel({ modelId: id, temperatureC: 20 }))
    const point = buildConsensusPoint(models, selected, '2026-09-06T12:00')
    expect(point.temperatureC).toBe(20)
    expect(point.modelCount).toBe(5)
    expect(point.unavailableModels).toEqual([])
  })

  it('is resistant to one extreme outlier model', () => {
    const models = [
      makeModel({ modelId: 'a', temperatureC: 20 }),
      makeModel({ modelId: 'b', temperatureC: 21 }),
      makeModel({ modelId: 'c', temperatureC: 19 }),
      makeModel({ modelId: 'd', temperatureC: 60 }),
    ]
    const point = buildConsensusPoint(models, ['a', 'b', 'c', 'd'], '2026-09-06T12:00')
    expect(point.temperatureC).toBe(20.5)
  })

  it('tracks unavailable models separately from contributing ones (a dropped-out model is not disagreement)', () => {
    const models = [makeModel({ modelId: 'a' }), makeModel({ modelId: 'b' })]
    const point = buildConsensusPoint(models, selected, '2026-09-06T12:00')
    expect(point.contributingModels).toEqual(['a', 'b'])
    expect(point.unavailableModels).toEqual(['c', 'd', 'e'])
    expect(point.modelCount).toBe(2)
  })

  it('handles a missing individual field on one model without breaking the others', () => {
    const models = [
      makeModel({ modelId: 'a', pressureHpa: null }), // e.g. NBM never populates pressure
      makeModel({ modelId: 'b', pressureHpa: 1010 }),
      makeModel({ modelId: 'c', pressureHpa: 1012 }),
    ]
    const point = buildConsensusPoint(models, ['a', 'b', 'c'], '2026-09-06T12:00')
    expect(point.pressureHpa).toBe(1011)
  })

  it('an equal split on precipitation still produces a median and a range', () => {
    const models = [
      makeModel({ modelId: 'a', precipitationMm: 0 }),
      makeModel({ modelId: 'b', precipitationMm: 0 }),
      makeModel({ modelId: 'c', precipitationMm: 5 }),
      makeModel({ modelId: 'd', precipitationMm: 5 }),
    ]
    const point = buildConsensusPoint(models, ['a', 'b', 'c', 'd'], '2026-09-06T12:00')
    expect(point.precipitation.amountMedianMm).toBe(2.5)
    expect(point.precipitation.amountRangeMm).toEqual([0, 5])
    expect(point.precipitation.modelsPredictingPrecip).toBe(2)
  })

  it('a minority thunderstorm forecast produces a mostly-fair condition but preserves the hazard flag', () => {
    const models = [
      makeModel({ modelId: 'a', weatherCode: 3 }), // cloudy
      makeModel({ modelId: 'b', weatherCode: 3 }),
      makeModel({ modelId: 'c', weatherCode: 3 }),
      makeModel({ modelId: 'd', weatherCode: 95 }), // thunderstorm
    ]
    const point = buildConsensusPoint(models, ['a', 'b', 'c', 'd'], '2026-09-06T12:00')
    expect(point.condition).toBe('cloudy')
    expect(point.hazards).toEqual([
      { type: 'thunderstorm', modelsPredicting: ['d'], modelCount: 4 },
    ])
  })

  it('produces no hazard flags when no model predicts a hazard', () => {
    const models = selected.map((id) => makeModel({ modelId: id, weatherCode: 1 }))
    const point = buildConsensusPoint(models, selected, '2026-09-06T12:00')
    expect(point.hazards).toEqual([])
  })

  it('handles wind directions straddling 0/360 without a naive arithmetic mean', () => {
    const models = [
      makeModel({ modelId: 'a', windDirectionDeg: 350 }),
      makeModel({ modelId: 'b', windDirectionDeg: 10 }),
    ]
    const point = buildConsensusPoint(models, ['a', 'b'], '2026-09-06T12:00')
    expect(point.windDirectionDeg).not.toBeNull()
    const deg = point.windDirectionDeg as number
    expect(Math.min(deg, 360 - deg)).toBeCloseTo(0, 5)
  })
})

describe('buildHourlySeries', () => {
  it('builds one entry per timestamp, sorted chronologically', () => {
    const byModel = {
      a: [
        makeModel({ modelId: 'a', timestamp: '2026-09-06T13:00', temperatureC: 21 }),
        makeModel({ modelId: 'a', timestamp: '2026-09-06T12:00', temperatureC: 20 }),
      ],
    }
    const series = buildHourlySeries(byModel, ['a'])
    expect(series.map((h) => h.timestamp)).toEqual(['2026-09-06T12:00', '2026-09-06T13:00'])
    expect(series[0].consensus.temperatureC).toBe(20)
  })

  it('handles a shorter-horizon model dropping out partway through the series', () => {
    const byModel = {
      hrrr: [
        makeModel({ modelId: 'hrrr', timestamp: '2026-09-06T12:00' }),
        makeModel({ modelId: 'hrrr', timestamp: '2026-09-06T13:00' }),
      ],
      gfs: [
        makeModel({ modelId: 'gfs', timestamp: '2026-09-06T12:00' }),
        makeModel({ modelId: 'gfs', timestamp: '2026-09-06T13:00' }),
        makeModel({ modelId: 'gfs', timestamp: '2026-09-06T14:00' }),
      ],
    }
    const series = buildHourlySeries(byModel, ['hrrr', 'gfs'])

    expect(series).toHaveLength(3)
    expect(series[0].consensus.unavailableModels).toEqual([])
    expect(series[2].consensus.contributingModels).toEqual(['gfs'])
    expect(series[2].consensus.unavailableModels).toEqual(['hrrr'])
    expect(series[2].modelsAtHour.hrrr).toBeUndefined()
    expect(series[2].modelsAtHour.gfs).toBeDefined()
  })

  it('computes agreement per hour, not just for the whole series', () => {
    const byModel = {
      a: [makeModel({ modelId: 'a', timestamp: '2026-09-06T12:00', temperatureC: 20 })],
      b: [makeModel({ modelId: 'b', timestamp: '2026-09-06T12:00', temperatureC: 20 })],
    }
    const series = buildHourlySeries(byModel, ['a', 'b'])
    expect(series[0].agreement.overall).toBeGreaterThan(0.9)
  })
})
