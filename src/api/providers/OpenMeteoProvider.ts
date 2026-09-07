import { normalizeOpenMeteoResponse, type OpenMeteoHourlyResponse } from '../../weather/normalize'
import type { ForecastProvider, ForecastRequest, NormalizedForecast } from './ForecastProvider'

const HOURLY_VARIABLES = [
  'temperature_2m',
  'apparent_temperature',
  'relative_humidity_2m',
  'wind_speed_10m',
  'wind_gusts_10m',
  'wind_direction_10m',
  'cloud_cover',
  'precipitation',
  'precipitation_probability',
  'pressure_msl',
  'weather_code',
  'is_day',
  'shortwave_radiation',
].join(',')

const DEFAULT_FORECAST_DAYS = 7

function buildUrl(request: ForecastRequest, modelId: string): string {
  const url = new URL('https://api.open-meteo.com/v1/forecast')
  url.searchParams.set('latitude', String(request.location.latitude))
  url.searchParams.set('longitude', String(request.location.longitude))
  url.searchParams.set('hourly', HOURLY_VARIABLES)
  url.searchParams.set('forecast_days', String(request.forecastDays ?? DEFAULT_FORECAST_DAYS))
  url.searchParams.set('timezone', 'auto')
  url.searchParams.set('models', modelId)
  return url.toString()
}

type ModelFetchResult =
  { modelId: string; ok: true; response: OpenMeteoHourlyResponse } | { modelId: string; ok: false }

/**
 * Fetches one model in its own request — never Open-Meteo's combined
 * `models=a,b,c` form (section 3.2, confirmed by the Phase 1 spike: combined
 * requests silently drop unavailable models, or corrupt the whole response
 * into invalid JSON when an unavailable model is listed first). Both of this
 * function's failure modes — an isolated 400 with `{error: true}`, and an
 * HTTP-200-but-invalid-JSON body — collapse to the same clean "unavailable"
 * outcome here, along with any outright network failure.
 */
async function fetchModel(request: ForecastRequest, modelId: string): Promise<ModelFetchResult> {
  let text: string
  try {
    const res = await fetch(buildUrl(request, modelId))
    text = await res.text()
  } catch {
    return { modelId, ok: false }
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    return { modelId, ok: false }
  }

  if (typeof parsed !== 'object' || parsed === null || 'error' in parsed || !('hourly' in parsed)) {
    return { modelId, ok: false }
  }

  return { modelId, ok: true, response: parsed as OpenMeteoHourlyResponse }
}

export const openMeteoProvider: ForecastProvider = {
  id: 'open-meteo',
  name: 'Open-Meteo',

  async getForecast(request: ForecastRequest): Promise<NormalizedForecast> {
    const results = await Promise.all(request.models.map((modelId) => fetchModel(request, modelId)))

    const byModel: Record<string, ReturnType<typeof normalizeOpenMeteoResponse>> = {}
    const unavailableModels: string[] = []
    let timezone: string | null = null

    for (const result of results) {
      if (!result.ok) {
        unavailableModels.push(result.modelId)
        continue
      }
      timezone ??= result.response.timezone
      byModel[result.modelId] = normalizeOpenMeteoResponse(
        result.response,
        result.modelId,
        'open-meteo',
      )
    }

    return {
      sourceId: 'open-meteo',
      timezone: timezone ?? 'UTC',
      byModel,
      unavailableModels,
    }
  },
}
