import type { NormalizedForecastPoint } from './models'

/** Shared test fixtures — not imported by app code. */
export function makeModel(
  overrides: Partial<NormalizedForecastPoint> & { modelId: string },
): NormalizedForecastPoint {
  return {
    sourceId: 'open-meteo',
    timestamp: '2026-09-06T12:00',
    temperatureC: 20,
    apparentTemperatureC: 19,
    relativeHumidityPct: 50,
    windSpeedKph: 10,
    windGustKph: 15,
    windDirectionDeg: 180,
    cloudCoverPct: 50,
    precipitationMm: 0,
    precipitationProbabilityPct: 10,
    pressureHpa: 1013,
    weatherCode: 2,
    isDay: true,
    shortwaveRadiation: 400,
    ...overrides,
  }
}
