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
