import { median } from '../../weather/consensus'
import type { DailySunTimes, GeoCoordinates, NormalizedForecastPoint } from '../../weather/models'
import type { WaterClarity, WaterTint } from '../types'
import { resolveSeasonBucket } from './season'
import { resolveSolarPhase } from './solarPhase'
import type { ActivityContext } from './types'

export interface BuildActivityContextParams {
  timestamp: string
  modelsAtHour: Record<string, NormalizedForecastPoint>
  coordinates: GeoCoordinates
  daily: DailySunTimes[]
  waterTemperatureC: number | null
  waterClarity?: WaterClarity
  waterTint?: WaterTint | null
}

/**
 * Shared by the timeline (one call per fetched hour) and the "current
 * conditions" summary (one call for the selected hour) so both read the same
 * consensus-across-models weather values the rest of the app already uses
 * (`median`, same as `App.tsx`'s `summarizeLightInputs`), rather than each
 * inventing its own aggregation.
 */
export function buildActivityContext(params: BuildActivityContextParams): ActivityContext {
  const points = Object.values(params.modelsAtHour)
  const isDay = points.find((p) => p.isDay != null)?.isDay ?? null

  return {
    timestamp: params.timestamp,
    coordinates: params.coordinates,
    solarPhase: resolveSolarPhase(params.timestamp, params.daily, isDay),
    seasonBucket: resolveSeasonBucket(params.timestamp, params.coordinates.latitude),
    weather: {
      windSpeedKph: median(points.map((p) => p.windSpeedKph)),
      cloudCoverPct: median(points.map((p) => p.cloudCoverPct)),
      shortwaveRadiationWm2: median(points.map((p) => p.shortwaveRadiation ?? null)),
      pressureHpa: median(points.map((p) => p.pressureHpa)),
      precipitationMm: median(points.map((p) => p.precipitationMm)),
      isDay,
    },
    waterTemperatureC: params.waterTemperatureC,
    waterClarity: params.waterClarity,
    waterTint: params.waterTint,
  }
}
