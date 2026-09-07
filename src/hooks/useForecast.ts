import { useEffect, useState } from 'react'
import { openMeteoProvider } from '../api/providers/OpenMeteoProvider'
import type { ForecastProvider } from '../api/providers/ForecastProvider'
import { calculateForecastAgreement } from '../weather/agreement'
import { buildConsensusPoint } from '../weather/consensus'
import { selectModels } from '../weather/modelSelection'
import type {
  ConsensusPoint,
  ForecastAgreement,
  GeoCoordinates,
  NormalizedForecastPoint,
} from '../weather/models'
import { findCurrentHourIndex, toLocalHourString } from '../weather/time'

export type UseForecastResult =
  | { status: 'idle' }
  | { status: 'loading' }
  | {
      status: 'success'
      timezone: string
      consensus: ConsensusPoint
      agreement: ForecastAgreement
      selectedModelIds: string[]
      /** Each selected model's own point at "now", keyed by model ID — for the per-model comparison list (section 7.3). Absent key means unavailable. */
      modelsAtNow: Record<string, NormalizedForecastPoint>
    }
  | { status: 'error'; message: string }

/**
 * Orchestrates the pieces built in Phase 2/3: pick models for this location
 * and time (section 3.2), fetch them, and reduce to one consensus point for
 * "now" (section 7 — the hourly timeline that lets the user move off "now"
 * is V1.1, section 9; this hook only needs the current hour for Phase 3).
 */
export function useForecast(
  location: GeoCoordinates | null,
  provider: ForecastProvider = openMeteoProvider,
): UseForecastResult {
  const [result, setResult] = useState<UseForecastResult>({ status: 'idle' })

  useEffect(() => {
    if (!location) {
      setResult({ status: 'idle' })
      return
    }

    let cancelled = false
    setResult({ status: 'loading' })

    const now = new Date()
    const selectedModels = selectModels(location, now, now)
    const selectedModelIds = selectedModels.map((m) => m.modelId)

    provider
      .getForecast({ location, models: selectedModelIds })
      .then((forecast) => {
        if (cancelled) return

        const nowLocalHour = toLocalHourString(now, forecast.timezone)
        const modelsAtNow: Record<string, NormalizedForecastPoint> = {}
        for (const [modelId, points] of Object.entries(forecast.byModel)) {
          const index = findCurrentHourIndex(
            points.map((p) => p.timestamp),
            nowLocalHour,
          )
          const point = points[index]
          if (point) modelsAtNow[modelId] = point
        }

        const points = Object.values(modelsAtNow)
        if (points.length === 0) {
          setResult({ status: 'error', message: 'No forecast data is available right now.' })
          return
        }

        const timestamp = points[0].timestamp
        setResult({
          status: 'success',
          timezone: forecast.timezone,
          consensus: buildConsensusPoint(points, selectedModelIds, timestamp),
          agreement: calculateForecastAgreement(points),
          selectedModelIds,
          modelsAtNow,
        })
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setResult({ status: 'error', message: err instanceof Error ? err.message : String(err) })
      })

    return () => {
      cancelled = true
    }
    // Depend on primitives, not object references — a fresh `location`
    // literal or provider instance from the caller on every render must not
    // retrigger the fetch (in practice: every render, since the default
    // `provider` argument is a stable singleton but an inline provider
    // passed by a caller/test would not be).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location?.latitude, location?.longitude, provider.id])

  return result
}
