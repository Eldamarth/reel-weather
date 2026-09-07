import { describe, expect, it } from 'vitest'
import {
  loadPreferences,
  withLocationSaved,
  type SavedLocation,
  type StoredPreferences,
} from './locationPreferences'

const BOULDER: SavedLocation = {
  id: '40.0,-105.3',
  name: 'Boulder',
  latitude: 40.0,
  longitude: -105.3,
}
const STOCKHOLM: SavedLocation = {
  id: '59.3,18.1',
  name: 'Stockholm',
  latitude: 59.3,
  longitude: 18.1,
}

describe('loadPreferences', () => {
  it('returns empty preferences when nothing is stored', () => {
    expect(loadPreferences({ getItem: () => null })).toEqual({
      lastLocation: null,
      recentLocations: [],
    })
  })

  it('returns empty preferences when the stored value is corrupted, rather than throwing', () => {
    expect(loadPreferences({ getItem: () => 'not json' })).toEqual({
      lastLocation: null,
      recentLocations: [],
    })
  })

  it('parses previously stored preferences', () => {
    const stored: StoredPreferences = { lastLocation: BOULDER, recentLocations: [BOULDER] }
    expect(loadPreferences({ getItem: () => JSON.stringify(stored) })).toEqual(stored)
  })
})

describe('withLocationSaved', () => {
  it('sets the saved location as both lastLocation and the head of recentLocations', () => {
    const result = withLocationSaved({ lastLocation: null, recentLocations: [] }, BOULDER)
    expect(result.lastLocation).toEqual(BOULDER)
    expect(result.recentLocations).toEqual([BOULDER])
  })

  it('moves a re-saved location to the front instead of duplicating it', () => {
    const result = withLocationSaved(
      { lastLocation: STOCKHOLM, recentLocations: [STOCKHOLM, BOULDER] },
      BOULDER,
    )
    expect(result.recentLocations).toEqual([BOULDER, STOCKHOLM])
  })

  it('caps recent locations at 5 entries', () => {
    const many = Array.from({ length: 5 }, (_, i) => ({
      id: `loc-${i}`,
      name: `Loc ${i}`,
      latitude: i,
      longitude: i,
    }))
    const result = withLocationSaved({ lastLocation: null, recentLocations: many }, BOULDER)
    expect(result.recentLocations).toHaveLength(5)
    expect(result.recentLocations[0]).toEqual(BOULDER)
  })
})
