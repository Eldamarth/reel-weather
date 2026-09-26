import { describe, expect, it } from 'vitest'
import { deriveLightLevel, isNearSunriseOrSunset } from './lightLevel'
import type { DailySunTimes } from './models'

const SUN_TIMES: DailySunTimes = {
  date: '2026-09-06',
  sunrise: '2026-09-06T06:48',
  sunset: '2026-09-06T18:57',
}

describe('isNearSunriseOrSunset', () => {
  it('is true within the window of sunset', () => {
    expect(isNearSunriseOrSunset('2026-09-06T19:20', SUN_TIMES)).toBe(true) // 23 min after
  })

  it('is true within the window of sunrise', () => {
    expect(isNearSunriseOrSunset('2026-09-06T06:20', SUN_TIMES)).toBe(true) // 28 min before
  })

  it('is false well outside either window', () => {
    expect(isNearSunriseOrSunset('2026-09-06T12:00', SUN_TIMES)).toBe(false)
  })

  it('is false just beyond the window boundary', () => {
    expect(isNearSunriseOrSunset('2026-09-06T19:43', SUN_TIMES)).toBe(false) // 46 min after sunset
  })
})

describe('deriveLightLevel', () => {
  it('is dark at night regardless of cloud cover', () => {
    expect(deriveLightLevel(false, 10, 0, '2026-09-06T23:00', null)).toBe('dark')
    expect(deriveLightLevel(false, 90, 0, '2026-09-06T23:00', null)).toBe('dark')
  })

  it('is bright at midday with low cloud cover', () => {
    expect(deriveLightLevel(true, 10, 600, '2026-09-06T12:00', null)).toBe('bright')
  })

  it('is moderate at midday with heavy cloud cover (not "low" — matches the plan\'s own example)', () => {
    expect(deriveLightLevel(true, 80, 300, '2026-09-06T12:00', null)).toBe('moderate')
  })

  it('is low when radiation is weak despite it being day (a golden-hour proxy), even with only moderate cloud cover', () => {
    expect(deriveLightLevel(true, 50, 20, '2026-09-06T12:00', null)).toBe('low')
  })

  it('falls back to moderate when cloud cover and radiation are both unavailable but it is day', () => {
    expect(deriveLightLevel(true, null, null, '2026-09-06T12:00', null)).toBe('moderate')
  })

  it('falls back to moderate when day/night status itself is unknown', () => {
    expect(deriveLightLevel(null, 20, 500, '2026-09-06T12:00', null)).toBe('moderate')
  })

  it('prefers real sunset proximity over radiation: low light even with high radiation and clear sky, near sunset', () => {
    // Radiation and cloud cover alone would say "bright" here — real sun times should win.
    expect(deriveLightLevel(true, 5, 500, '2026-09-06T19:15', SUN_TIMES)).toBe('low')
  })

  it('falls back to the radiation proxy when sun times are unavailable, even at the same clock time', () => {
    expect(deriveLightLevel(true, 5, 500, '2026-09-06T19:15', null)).toBe('bright')
  })

  it('does not force "low" outside the golden-hour window just because sun times are present', () => {
    expect(deriveLightLevel(true, 10, 600, '2026-09-06T12:00', SUN_TIMES)).toBe('bright')
  })
})
