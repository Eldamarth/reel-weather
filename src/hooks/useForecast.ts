import { useEffect, useState } from 'react'
import { openMeteoProvider } from '../api/providers/OpenMeteoProvider'
import type { ForecastProvider } from '../api/providers/ForecastProvider'
import { buildHourlySeries } from '../weather/consensus'
import { selectModels } from '../weather/modelSelection'
import type { GeoCoordinates, HourlyForecast } from '../weather/models'
import { findCurrentHourIndex, toLocalHourString } from '../weather/time'

type FetchState =
  | { status: 'idle' }
  | { status: 'loading' }
  | {
      status: 'success'
      timezone: string
      series: HourlyForecast[]
      nowIndex: number
      selectedModelIds: string[]
    }
  | { status: 'error'; message: string }

export type UseForecastResult =
  | { status: 'idle' }
  | { status: 'loading' }
  | {
      status: 'success'
      timezone: string
      series: HourlyForecast[]
      selectedIndex: number
      setSelectedIndex: (index: number) => void
      nowIndex: number
      selectedModelIds: string[]
    }
  | { status: 'error'; message: string }

/**
 * Orchestrates the pieces built in Phases 2/3/6: pick models for this
 * location and time (section 3.2), fetch them, and reduce to a full hourly
 * series (section 9) rather than just "now" — `selectedIndex` is what the
 * timeline moves, independent of the fetch itself.
 */
export function useForecast(
  location: GeoCoordinates | null,
  provider: ForecastProvider = openMeteoProvider,
): UseForecastResult {
  const [fetchState, setFetchState] = useState<FetchState>({ status: 'idle' })
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    if (!location) {
      setFetchState({ status: 'idle' })
      return
    }

    let cancelled = false
    setFetchState({ status: 'loading' })

    const now = new Date()
    const selectedModels = selectModels(location, now, now)
    const selectedModelIds = selectedModels.map((m) => m.modelId)

    provider
      .getForecast({ location, models: selectedModelIds })
      .then((forecast) => {
        if (cancelled) return

        const series = buildHourlySeries(forecast.byModel, selectedModelIds)
        if (series.length === 0) {
          setFetchState({ status: 'error', message: 'No forecast data is available right now.' })
          return
        }

        const nowLocalHour = toLocalHourString(now, forecast.timezone)
        const nowIndex = findCurrentHourIndex(
          series.map((h) => h.timestamp),
          nowLocalHour,
        )

        setFetchState({
          status: 'success',
          timezone: forecast.timezone,
          series,
          nowIndex,
          selectedModelIds,
        })
        setSelectedIndex(nowIndex)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setFetchState({
          status: 'error',
          message: err instanceof Error ? err.message : String(err),
        })
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

  if (fetchState.status !== 'success') return fetchState

  return {
    ...fetchState,
    selectedIndex: Math.min(selectedIndex, fetchState.series.length - 1),
    setSelectedIndex,
  }
}
