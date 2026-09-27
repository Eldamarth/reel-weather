import { describe, expect, it } from 'vitest'
import { buildActivityContext } from './buildContext'
import { makeModel } from '../../weather/fixtures'
import type { DailySunTimes } from '../../weather/models'

const DAILY: DailySunTimes[] = [
  { date: '2026-09-26', sunrise: '2026-09-26T06:32', sunset: '2026-09-26T19:12' },
]

describe('buildActivityContext', () => {
  it('derives solar phase and season from the timestamp/coordinates, and medians weather across models', () => {
    const context = buildActivityContext({
      timestamp: '2026-09-26T12:00',
      modelsAtHour: {
        a: makeModel({
          modelId: 'a',
          windSpeedKph: 10,
          cloudCoverPct: 40,
          pressureHpa: 1010,
          precipitationMm: 0,
        }),
        b: makeModel({
          modelId: 'b',
          windSpeedKph: 20,
          cloudCoverPct: 60,
          pressureHpa: 1020,
          precipitationMm: 2,
        }),
      },
      coordinates: { latitude: 55, longitude: 12 },
      daily: DAILY,
      waterTemperatureC: 14,
    })

    expect(context.solarPhase).toBe('day')
    expect(context.seasonBucket).toBe('shoulder')
    expect(context.weather.windSpeedKph).toBe(15)
    expect(context.weather.cloudCoverPct).toBe(50)
    expect(context.weather.pressureHpa).toBe(1015)
    expect(context.weather.precipitationMm).toBe(1)
    expect(context.weather.isDay).toBe(true)
    expect(context.waterTemperatureC).toBe(14)
  })

  it('passes through clarity/tint and a null water temperature unchanged', () => {
    const context = buildActivityContext({
      timestamp: '2026-09-26T12:00',
      modelsAtHour: { a: makeModel({ modelId: 'a' }) },
      coordinates: { latitude: 55, longitude: 12 },
      daily: DAILY,
      waterTemperatureC: null,
      waterClarity: 'murky',
      waterTint: 'green-algal',
    })

    expect(context.waterTemperatureC).toBeNull()
    expect(context.waterClarity).toBe('murky')
    expect(context.waterTint).toBe('green-algal')
  })

  it('falls back to a null isDay when no model reports it', () => {
    const context = buildActivityContext({
      timestamp: '2026-09-26T12:00',
      modelsAtHour: { a: makeModel({ modelId: 'a', isDay: null }) },
      coordinates: { latitude: 55, longitude: 12 },
      daily: DAILY,
      waterTemperatureC: null,
    })
    expect(context.weather.isDay).toBeNull()
  })
})
