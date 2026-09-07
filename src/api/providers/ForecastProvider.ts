import type { GeoCoordinates, NormalizedForecastPoint } from '../../weather/models'

/** Section 3.3. */
export interface ForecastRequest {
  location: GeoCoordinates
  models: string[]
  forecastDays?: number
}

/**
 * One provider's normalized output for a location. `timezone` is carried once
 * per forecast, not per point (section 8.4) — every model for one location
 * shares the same resolved local timezone.
 */
export interface NormalizedForecast {
  sourceId: string
  timezone: string
  byModel: Record<string, NormalizedForecastPoint[]>
  unavailableModels: string[]
}

/** Section 3.3. */
export interface ForecastProvider {
  id: string
  name: string
  getForecast(request: ForecastRequest): Promise<NormalizedForecast>
}
