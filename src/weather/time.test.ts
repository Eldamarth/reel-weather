import { describe, expect, it } from 'vitest'
import {
  dateOf,
  findCurrentHourIndex,
  findDailySunTimes,
  formatClockTime,
  formatDateLabel,
  formatHourLabel,
  minutesOfDay,
  toLocalHourString,
  weekdayLabel,
} from './time'

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

describe('dateOf', () => {
  it('extracts the calendar-date portion', () => {
    expect(dateOf('2026-09-06T14:00')).toBe('2026-09-06')
  })
})

describe('formatHourLabel', () => {
  it('formats midnight, noon, and afternoon in 12-hour form', () => {
    expect(formatHourLabel('2026-09-06T00:00')).toBe('12 AM')
    expect(formatHourLabel('2026-09-06T12:00')).toBe('12 PM')
    expect(formatHourLabel('2026-09-06T14:00')).toBe('2 PM')
    expect(formatHourLabel('2026-09-06T09:00')).toBe('9 AM')
  })
})

describe('weekdayLabel', () => {
  it('returns the correct weekday regardless of the runtime timezone', () => {
    // 2026-09-06 is a Sunday.
    expect(weekdayLabel('2026-09-06T00:00')).toBe('Sun')
    expect(weekdayLabel('2026-09-06T23:00')).toBe('Sun')
  })
})

describe('formatDateLabel', () => {
  it('formats as "Weekday, Mon D"', () => {
    expect(formatDateLabel('2026-09-06T14:00')).toBe('Sun, Sep 6')
  })

  it('is stable across the hour, since only the calendar date matters', () => {
    expect(formatDateLabel('2026-09-06T00:00')).toBe(formatDateLabel('2026-09-06T23:00'))
  })
})

describe('minutesOfDay', () => {
  it('converts local time-of-day to minutes since midnight', () => {
    expect(minutesOfDay('2026-09-06T00:00')).toBe(0)
    expect(minutesOfDay('2026-09-06T06:48')).toBe(408)
    expect(minutesOfDay('2026-09-06T23:59')).toBe(1439)
  })
})

describe('formatClockTime', () => {
  it('formats minute-precise 12-hour time, unlike formatHourLabel', () => {
    expect(formatClockTime('2026-09-06T18:57')).toBe('6:57 PM')
    expect(formatClockTime('2026-09-06T06:48')).toBe('6:48 AM')
    expect(formatClockTime('2026-09-06T00:05')).toBe('12:05 AM')
    expect(formatClockTime('2026-09-06T12:00')).toBe('12:00 PM')
  })
})

describe('findDailySunTimes', () => {
  const daily = [
    { date: '2026-09-06', sunrise: '2026-09-06T06:48', sunset: '2026-09-06T18:57' },
    { date: '2026-09-07', sunrise: '2026-09-07T06:49', sunset: '2026-09-07T18:56' },
  ]

  it("finds the entry matching the timestamp's calendar date, regardless of hour", () => {
    expect(findDailySunTimes(daily, '2026-09-07T14:00')).toEqual(daily[1])
  })

  it('returns null when no entry covers that date', () => {
    expect(findDailySunTimes(daily, '2026-09-09T14:00')).toBeNull()
  })

  it('returns null for an empty list', () => {
    expect(findDailySunTimes([], '2026-09-07T14:00')).toBeNull()
  })
})
