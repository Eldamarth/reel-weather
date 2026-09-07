import { useEffect, useRef, useState } from 'react'
import { searchLocations, type GeocodeResult } from '../api/geocoding/OpenMeteoGeocoder'
import { useGeolocation } from '../hooks/useGeolocation'
import { useLocalPreferences } from '../hooks/useLocalPreferences'
import type { SavedLocation } from '../hooks/locationPreferences'
import styles from './LocationPicker.module.css'

export interface LocationPickerProps {
  /** Called whenever a location is resolved — on initial last-used load, on
   * successful geolocation, or on picking a search/recent result. Must be a
   * stable reference (e.g. a `useState` setter) — an inline arrow recreated
   * every render would retrigger the mount-time auto-resolve effect below. */
  onLocationSelected: (location: SavedLocation) => void
}

function geocodeResultToSavedLocation(result: GeocodeResult): SavedLocation {
  return {
    id: `${result.latitude},${result.longitude}`,
    name: result.admin1 ? `${result.name}, ${result.admin1}` : result.name,
    latitude: result.latitude,
    longitude: result.longitude,
  }
}

/**
 * Section 8.1: resolves a location via last-used -> geolocation -> search,
 * and section 8.3: switching locations afterward stays one or two taps away.
 */
export function LocationPicker({ onLocationSelected }: LocationPickerProps) {
  const { lastLocation, recentLocations, saveLocation } = useLocalPreferences()
  const { state: geoState, request: requestGeolocation } = useGeolocation()
  const [current, setCurrent] = useState<SavedLocation | null>(null)
  const [editing, setEditing] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<GeocodeResult[]>([])
  const hasResolvedInitial = useRef(false)

  function chooseLocation(location: SavedLocation) {
    saveLocation(location)
    setCurrent(location)
    setEditing(false)
    setQuery('')
    setResults([])
    onLocationSelected(location)
  }

  // Runs once on mount only — intentionally does not re-run if
  // lastLocation/onLocationSelected identity changes later.
  useEffect(() => {
    if (hasResolvedInitial.current) return
    hasResolvedInitial.current = true
    if (lastLocation) {
      setCurrent(lastLocation)
      onLocationSelected(lastLocation)
    } else {
      setEditing(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (geoState.status !== 'success') return
    chooseLocation({
      id: `${geoState.coordinates.latitude},${geoState.coordinates.longitude}`,
      name: 'My location',
      latitude: geoState.coordinates.latitude,
      longitude: geoState.coordinates.longitude,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geoState])

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([])
      return
    }
    const timeout = setTimeout(() => {
      searchLocations(query).then(setResults)
    }, 300)
    return () => clearTimeout(timeout)
  }, [query])

  if (!editing && current) {
    return (
      <div className={styles.picker}>
        <div className={styles.header}>
          <span className={styles.currentLocationName}>{current.name}</span>
          <button type="button" className={styles.primaryAction} onClick={() => setEditing(true)}>
            Change location
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.picker}>
      <div className={styles.header}>
        <button
          type="button"
          className={styles.primaryAction}
          onClick={requestGeolocation}
          disabled={geoState.status === 'loading'}
        >
          {geoState.status === 'loading' ? 'Locating…' : 'Use my location'}
        </button>
        {current && (
          <button type="button" className={styles.cancelAction} onClick={() => setEditing(false)}>
            Cancel
          </button>
        )}
      </div>

      {geoState.status === 'error' && (
        <p className={styles.errorMessage}>{geoState.message} — search for a location instead.</p>
      )}

      <input
        className={styles.searchInput}
        type="text"
        placeholder="Search for a place..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {results.length > 0 && (
        <ul className={styles.results}>
          {results.map((r) => (
            <li key={r.id}>
              <button type="button" onClick={() => chooseLocation(geocodeResultToSavedLocation(r))}>
                {r.name}
                {r.admin1 ? `, ${r.admin1}` : ''}
                {r.country ? `, ${r.country}` : ''}
              </button>
            </li>
          ))}
        </ul>
      )}

      {results.length === 0 && recentLocations.length > 0 && (
        <ul className={styles.recent}>
          {recentLocations.map((loc) => (
            <li key={loc.id}>
              <button type="button" onClick={() => chooseLocation(loc)}>
                {loc.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
