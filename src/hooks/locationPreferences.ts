export interface SavedLocation {
  id: string
  name: string
  latitude: number
  longitude: number
}

export interface StoredPreferences {
  lastLocation: SavedLocation | null
  recentLocations: SavedLocation[]
}

export const PREFERENCES_STORAGE_KEY = 'reel-weather:preferences'
const MAX_RECENT = 5

const EMPTY_PREFERENCES: StoredPreferences = { lastLocation: null, recentLocations: [] }

/** Pure, storage-agnostic logic (section 8.1/8.2) — kept separate from the React hook so it's directly unit-testable. */
export function loadPreferences(storage: Pick<Storage, 'getItem'>): StoredPreferences {
  try {
    const raw = storage.getItem(PREFERENCES_STORAGE_KEY)
    if (!raw) return EMPTY_PREFERENCES
    const parsed = JSON.parse(raw)
    return {
      lastLocation: parsed.lastLocation ?? null,
      recentLocations: Array.isArray(parsed.recentLocations) ? parsed.recentLocations : [],
    }
  } catch {
    return EMPTY_PREFERENCES
  }
}

export function withLocationSaved(
  prefs: StoredPreferences,
  location: SavedLocation,
): StoredPreferences {
  const withoutDuplicate = prefs.recentLocations.filter((l) => l.id !== location.id)
  return {
    lastLocation: location,
    recentLocations: [location, ...withoutDuplicate].slice(0, MAX_RECENT),
  }
}

export function persistPreferences(
  storage: Pick<Storage, 'setItem'>,
  prefs: StoredPreferences,
): void {
  storage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(prefs))
}
