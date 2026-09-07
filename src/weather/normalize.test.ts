import { describe, expect, it } from 'vitest'
import { normalizeOpenMeteoResponse, type OpenMeteoHourlyResponse } from './normalize'

function raw(overrides: Partial<OpenMeteoHourlyResponse['hourly']> = {}): OpenMeteoHourlyResponse {
  return {
    timezone: 'America/Denver',
    hourly: {
      time: ['2026-09-06T00:00', '2026-09-06T01:00'],
      temperature_2m: [20, 21],
      apparent_temperature: [19, 20],
      relative_humidity_2m: [50, 52],
      wind_speed_10m: [10, 11],
      wind_gusts_10m: [15, 16],
      wind_direction_10m: [180, 190],
      cloud_cover: [30, 35],
      precipitation: [0, 0.2],
      precipitation_probability: [10, 20],
      pressure_msl: [1013, 1012],
      weather_code: [2, 3],
      is_day: [1, 0],
      shortwave_radiation: [400, 0],
      ...overrides,
    },
  }
}

describe('normalizeOpenMeteoResponse', () => {
  it('maps one hour of one model into a NormalizedForecastPoint', () => {
    const points = normalizeOpenMeteoResponse(raw(), 'ncep_hrrr_conus', 'open-meteo')
    expect(points).toHaveLength(2)
    expect(points[0]).toEqual({
      sourceId: 'open-meteo',
      modelId: 'ncep_hrrr_conus',
      timestamp: '2026-09-06T00:00',
      temperatureC: 20,
      apparentTemperatureC: 19,
      relativeHumidityPct: 50,
      windSpeedKph: 10,
      windGustKph: 15,
      windDirectionDeg: 180,
      cloudCoverPct: 30,
      precipitationMm: 0,
      precipitationProbabilityPct: 10,
      pressureHpa: 1013,
      weatherCode: 2,
      isDay: true,
      shortwaveRadiation: 400,
    })
  })

  it('converts is_day from 0/1 to boolean', () => {
    const points = normalizeOpenMeteoResponse(raw(), 'ncep_hrrr_conus', 'open-meteo')
    expect(points[1].isDay).toBe(false)
  })

  it('carries a null field through as null rather than crashing (e.g. NBM/pressure)', () => {
    const points = normalizeOpenMeteoResponse(
      raw({ pressure_msl: [null, null] }),
      'ncep_nbm_conus',
      'open-meteo',
    )
    expect(points[0].pressureHpa).toBeNull()
    expect(points[1].pressureHpa).toBeNull()
  })

  it('treats a variable missing from the response entirely the same as all-null', () => {
    const { pressure_msl: _omit, ...withoutPressure } = raw().hourly
    const points = normalizeOpenMeteoResponse(
      { timezone: 'America/Denver', hourly: withoutPressure },
      'ncep_nbm_conus',
      'open-meteo',
    )
    expect(points[0].pressureHpa).toBeNull()
  })

  it('returns an empty array for a response with zero hours', () => {
    const points = normalizeOpenMeteoResponse(
      raw({ time: [], temperature_2m: [] }),
      'ncep_hrrr_conus',
      'open-meteo',
    )
    expect(points).toEqual([])
  })
})
