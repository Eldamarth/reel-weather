import type { DailySunTimes } from './models'

/**
 * Section 8.4: forecast timestamps are naive local strings in the location's
 * own timezone (no UTC offset), so matching "now" against them means
 * formatting `now` into that same timezone first — never comparing a raw
 * `Date` against the string directly.
 */
export function toLocalHourString(date: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '00'
  return `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:00`
}

/**
 * Finds the index of the hourly slot containing `nowLocalHourString`, or the
 * closest available one if the exact hour isn't present (e.g. the series
 * starts later than "now", or has a gap). Timestamps sort lexically because
 * they share one fixed "YYYY-MM-DDTHH:mm" format.
 */
export function findCurrentHourIndex(times: string[], nowLocalHourString: string): number {
  if (times.length === 0) return 0

  const firstAtOrAfter = times.findIndex((t) => t >= nowLocalHourString)
  if (firstAtOrAfter === -1) return times.length - 1
  return firstAtOrAfter
}

/** The "YYYY-MM-DD" calendar-date portion of a forecast timestamp. */
export function dateOf(timestamp: string): string {
  return timestamp.slice(0, 10)
}

/**
 * Section 9's timeline label, rendered as a 12-hour clock time. The
 * timestamp string is already location-local (section 8.4), so this is
 * string slicing, not a timezone conversion.
 */
export function formatHourLabel(timestamp: string): string {
  const hour = Number(timestamp.slice(11, 13))
  const period = hour >= 12 ? 'PM' : 'AM'
  const hour12 = hour % 12 === 0 ? 12 : hour % 12
  return `${hour12} ${period}`
}

/**
 * Short weekday name for a timestamp's calendar date, for day-boundary
 * markers on the timeline. Builds the Date from explicit Y/M/D components
 * (not `new Date("2026-09-06")`, which parses as UTC midnight and can shift
 * to the wrong weekday for timezones behind UTC) so the result is correct
 * regardless of the runtime's own timezone.
 */
export function weekdayLabel(timestamp: string): string {
  const [year, month, day] = dateOf(timestamp).split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-US', { weekday: 'short' })
}

/**
 * "Tue, Sep 8" — for display anywhere a selected hour could be days ahead
 * (section 9's timeline scrolls the full fetched range), so the header can't
 * rely on the viewer already knowing what day is being shown.
 */
export function formatDateLabel(timestamp: string): string {
  const [year, month, day] = dateOf(timestamp).split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

/** Minutes since local midnight — string slicing, same reasoning as the other helpers here. */
export function minutesOfDay(timestamp: string): number {
  const hour = Number(timestamp.slice(11, 13))
  const minute = Number(timestamp.slice(14, 16))
  return hour * 60 + minute
}

/** "6:57 PM" — minute-precise, unlike formatHourLabel (hourly forecast slots are always :00; sunrise/sunset aren't). */
export function formatClockTime(timestamp: string): string {
  const hour = Number(timestamp.slice(11, 13))
  const minute = timestamp.slice(14, 16)
  const period = hour >= 12 ? 'PM' : 'AM'
  const hour12 = hour % 12 === 0 ? 12 : hour % 12
  return `${hour12}:${minute} ${period}`
}

/** Matches a timestamp to its calendar date's sunrise/sunset — the timeline can scroll to any fetched day, so this is never assumed to be "today". */
export function findDailySunTimes(daily: DailySunTimes[], timestamp: string): DailySunTimes | null {
  const date = dateOf(timestamp)
  return daily.find((d) => d.date === date) ?? null
}
