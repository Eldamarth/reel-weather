import { describe, expect, it } from 'vitest'
import { deriveLightLevel } from './lightLevel'

describe('deriveLightLevel', () => {
  it('is dark at night regardless of cloud cover', () => {
    expect(deriveLightLevel(false, 10, 0)).toBe('dark')
    expect(deriveLightLevel(false, 90, 0)).toBe('dark')
  })

  it('is bright at midday with low cloud cover', () => {
    expect(deriveLightLevel(true, 10, 600)).toBe('bright')
  })

  it('is moderate at midday with heavy cloud cover (not "low" — matches the plan\'s own example)', () => {
    expect(deriveLightLevel(true, 80, 300)).toBe('moderate')
  })

  it('is low when radiation is weak despite it being day (a golden-hour proxy), even with only moderate cloud cover', () => {
    expect(deriveLightLevel(true, 50, 20)).toBe('low')
  })

  it('falls back to moderate when cloud cover and radiation are both unavailable but it is day', () => {
    expect(deriveLightLevel(true, null, null)).toBe('moderate')
  })

  it('falls back to moderate when day/night status itself is unknown', () => {
    expect(deriveLightLevel(null, 20, 500)).toBe('moderate')
  })
})
