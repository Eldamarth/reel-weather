import { useCallback, useState } from 'react'
import {
  loadPreferences,
  persistPreferences,
  withLocationSaved,
  type SavedLocation,
  type StoredPreferences,
} from './locationPreferences'

export function useLocalPreferences() {
  const [prefs, setPrefs] = useState<StoredPreferences>(() => loadPreferences(localStorage))

  const saveLocation = useCallback((location: SavedLocation) => {
    setPrefs((prev) => {
      const next = withLocationSaved(prev, location)
      persistPreferences(localStorage, next)
      return next
    })
  }, [])

  return { lastLocation: prefs.lastLocation, recentLocations: prefs.recentLocations, saveLocation }
}
