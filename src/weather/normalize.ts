import type { NormalizedForecastPoint } from './models'

/** Raw shape of one Open-Meteo `/v1/forecast` response for a single model. */
export interface OpenMeteoHourlyResponse {
  timezone: string
  hourly: {
    time: string[]
    temperature_2m?: Array<number | null>
    apparent_temperature?: Array<number | null>
    relative_humidity_2m?: Array<number | null>
    wind_speed_10m?: Array<number | null>
    wind_gusts_10m?: Array<number | null>
    wind_direction_10m?: Array<number | null>
    cloud_cover?: Array<number | null>
    precipitation?: Array<number | null>
    precipitation_probability?: Array<number | null>
    pressure_msl?: Array<number | null>
    weather_code?: Array<number | null>
    is_day?: Array<number | null>
    shortwave_radiation?: Array<number | null>
  }
}

function at(series: Array<number | null> | undefined, index: number): number | null {
  return series?.[index] ?? null
}

/**
 * Pure mapping from one model's raw Open-Meteo hourly response into our
 * normalized shape (section 4). Open-Meteo's default units already match
 * ours (°C, km/h, mm, hPa — confirmed in the Phase 1 spike), so this is a
 * field rename plus null-safety, not a unit conversion. A variable absent
 * from the response entirely is treated identically to one present but
 * all-null (e.g. NBM/pressure_msl) — both surface as `null` per field.
 */
export function normalizeOpenMeteoResponse(
  raw: OpenMeteoHourlyResponse,
  modelId: string,
  sourceId: string,
): NormalizedForecastPoint[] {
  const { hourly } = raw

  return hourly.time.map((timestamp, i) => {
    const isDayRaw = at(hourly.is_day, i)
    return {
      sourceId,
      modelId,
      timestamp,
      temperatureC: at(hourly.temperature_2m, i),
      apparentTemperatureC: at(hourly.apparent_temperature, i),
      relativeHumidityPct: at(hourly.relative_humidity_2m, i),
      windSpeedKph: at(hourly.wind_speed_10m, i),
      windGustKph: at(hourly.wind_gusts_10m, i),
      windDirectionDeg: at(hourly.wind_direction_10m, i),
      cloudCoverPct: at(hourly.cloud_cover, i),
      precipitationMm: at(hourly.precipitation, i),
      precipitationProbabilityPct: at(hourly.precipitation_probability, i),
      pressureHpa: at(hourly.pressure_msl, i),
      weatherCode: at(hourly.weather_code, i),
      isDay: isDayRaw === null ? null : isDayRaw === 1,
      shortwaveRadiation: at(hourly.shortwave_radiation, i),
    }
  })
}
