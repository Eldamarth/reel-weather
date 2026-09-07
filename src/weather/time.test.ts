import { describe, expect, it } from 'vitest'
import { findCurrentHourIndex, toLocalHourString } from './time'

describe('toLocalHourString', () => {
  it('formats a UTC instant into the target timezone, truncated to the hour', () => {
    // 2026-09-06T20:37:00Z is 14:37 in America/Denver (UTC-6 in September, no DST offset gotcha here).
    const date = new Date('2026-09-06T20:37:00Z')
    expect(toLocalHourString(date, 'America/Denver')).toBe('2026-09-06T14:00')
  })

  it('rolls over to the next local day when the UTC instant is late enough', () => {
    // 2026-09-06T22:00:00Z is 2026-09-07T00:00 in Europe/Stockholm (UTC+2).
    const date = new Date('2026-09-06T22:00:00Z')
    expect(toLocalHourString(date, 'Europe/Stockholm')).toBe('2026-09-07T00:00')
  })
})

describe('findCurrentHourIndex', () => {
  const times = ['2026-09-06T12:00', '2026-09-06T13:00', '2026-09-06T14:00', '2026-09-06T15:00']

  it('finds the exact matching hour', () => {
    expect(findCurrentHourIndex(times, '2026-09-06T14:00')).toBe(2)
  })

  it('falls back to the first available hour when "now" is before the series starts', () => {
    expect(findCurrentHourIndex(times, '2026-09-06T09:00')).toBe(0)
  })

  it('falls back to the last available hour when "now" is after the series ends', () => {
    expect(findCurrentHourIndex(times, '2026-09-06T23:00')).toBe(3)
  })

  it('returns 0 for an empty series', () => {
    expect(findCurrentHourIndex([], '2026-09-06T14:00')).toBe(0)
  })
})
