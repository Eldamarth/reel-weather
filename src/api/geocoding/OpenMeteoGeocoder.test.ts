import { afterEach, describe, expect, it, vi } from 'vitest'
import { searchLocations } from './OpenMeteoGeocoder'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('searchLocations', () => {
  it('returns an empty array without calling fetch for a blank query', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    const results = await searchLocations('   ')

    expect(results).toEqual([])
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('maps a successful response into GeocodeResult[]', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        json: async () => ({
          results: [
            {
              id: 5574991,
              name: 'Boulder',
              latitude: 40.015,
              longitude: -105.2705,
              admin1: 'Colorado',
              country: 'United States',
            },
          ],
        }),
      })),
    )

    const results = await searchLocations('Boulder')
    expect(results).toEqual([
      {
        id: 5574991,
        name: 'Boulder',
        latitude: 40.015,
        longitude: -105.2705,
        admin1: 'Colorado',
        country: 'United States',
      },
    ])
  })

  it('returns an empty array when the API returns no results field', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({ json: async () => ({}) })),
    )

    expect(await searchLocations('zzzznotaplace')).toEqual([])
  })
})
