import { describe, expect, it } from 'vitest'
import { selectModels } from './modelSelection'

const BOULDER = { latitude: 40.015, longitude: -105.2705 }
const STOCKHOLM = { latitude: 59.3293, longitude: 18.0686 }
const NOW = new Date('2026-09-06T00:00:00Z')

function ids(location: typeof BOULDER, forecastTime: Date) {
  return selectModels(location, forecastTime, NOW).map((m) => m.modelId)
}

describe('selectModels', () => {
  it('includes region-specific short-range models where they cover the location', () => {
    expect(ids(BOULDER, NOW)).toContain('ncep_hrrr_conus')
    expect(ids(STOCKHOLM, NOW)).toContain('metno_nordic')
  })

  it('excludes region-specific models that do not cover the location', () => {
    expect(ids(STOCKHOLM, NOW)).not.toContain('ncep_hrrr_conus')
    expect(ids(BOULDER, NOW)).not.toContain('metno_nordic')
  })

  it('always includes global models regardless of location', () => {
    expect(ids(BOULDER, NOW)).toContain('ncep_gfs_seamless')
    expect(ids(STOCKHOLM, NOW)).toContain('ncep_gfs_seamless')
  })

  it('drops a short-range model once the forecast time exceeds its horizon', () => {
    const withinHorizon = new Date(NOW.getTime() + 60 * 60 * 1000) // +1h, HRRR horizon is 66h
    const beyondHorizon = new Date(NOW.getTime() + 100 * 60 * 60 * 1000) // +100h
    expect(ids(BOULDER, withinHorizon)).toContain('ncep_hrrr_conus')
    expect(ids(BOULDER, beyondHorizon)).not.toContain('ncep_hrrr_conus')
  })

  it('model count differs between adjacent hours straddling a horizon boundary', () => {
    const justBefore = new Date(NOW.getTime() + 65 * 60 * 60 * 1000)
    const justAfter = new Date(NOW.getTime() + 67 * 60 * 60 * 1000)
    const countBefore = ids(BOULDER, justBefore).length
    const countAfter = ids(BOULDER, justAfter).length
    expect(countAfter).toBeLessThan(countBefore)
  })
})
