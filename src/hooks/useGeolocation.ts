import { useCallback, useState } from 'react'
import type { GeoCoordinates } from '../weather/models'

export type GeolocationState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; coordinates: GeoCoordinates }
  | { status: 'error'; message: string }

type GeolocationLike = Pick<Geolocation, 'getCurrentPosition'>

/**
 * Section 8.1: geolocation is one link in the location fallback chain
 * (last-used -> geolocation -> search). A denial, an unavailable API, and a
 * timeout must all resolve to the same `error` state so the caller can fall
 * back to search cleanly rather than hanging or crashing.
 */
export function useGeolocation(geolocation?: GeolocationLike) {
  const resolvedGeolocation =
    geolocation ?? (typeof navigator !== 'undefined' ? navigator.geolocation : undefined)
  const [state, setState] = useState<GeolocationState>({ status: 'idle' })

  const request = useCallback(() => {
    if (!resolvedGeolocation) {
      setState({ status: 'error', message: 'Geolocation is not available in this browser.' })
      return
    }

    setState({ status: 'loading' })
    resolvedGeolocation.getCurrentPosition(
      (position) => {
        setState({
          status: 'success',
          coordinates: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        })
      },
      (error) => {
        setState({ status: 'error', message: error.message || 'Location request failed.' })
      },
      { timeout: 10_000 },
    )
  }, [resolvedGeolocation])

  return { state, request }
}
