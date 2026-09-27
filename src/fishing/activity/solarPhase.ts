import {
  EARLY_NIGHT_DURATION_HOURS,
  PRE_DAWN_DURATION_HOURS,
} from '../../config/activityThresholds'
import { GOLDEN_HOUR_WINDOW_MINUTES } from '../../config/lightThresholds'
import { dateOf } from '../../weather/time'
import type { DailySunTimes } from '../../weather/models'
import type { SolarPhase } from './types'

const EARLY_NIGHT_DURATION_MINUTES = EARLY_NIGHT_DURATION_HOURS * 60
const PRE_DAWN_DURATION_MINUTES = PRE_DAWN_DURATION_HOURS * 60

/** Parses a naive "YYYY-MM-DDTHH:mm" local string into explicit Y/M/D/h/m components, never `new Date(string)` (UTC-parsing pitfall documented in `weather/time.ts`). */
function toLocalDate(timestamp: string): Date {
  const [datePart, timePart] = timestamp.split('T')
  const [year, month, day] = datePart.split('-').map(Number)
  const [hour, minute] = timePart.split(':').map(Number)
  return new Date(year, month - 1, day, hour, minute)
}

/** Absolute minutes, comparable across midnight/day boundaries (unlike `minutesOfDay`, which resets each day). */
function epochMinutes(timestamp: string): number {
  return toLocalDate(timestamp).getTime() / 60000
}

function shiftDate(date: string, days: number): string {
  const [year, month, day] = date.split('-').map(Number)
  const shifted = new Date(year, month - 1, day + days)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${shifted.getFullYear()}-${pad(shifted.getMonth() + 1)}-${pad(shifted.getDate())}`
}

function findByDate(daily: DailySunTimes[], date: string): DailySunTimes | undefined {
  return daily.find((d) => d.date === date)
}

/**
 * Anchors solar phase to real sunrise/sunset rather than fixed clock hours
 * (design brief section 12 — Scandinavian latitude is the reason this
 * matters). `today`'s sun times determine the dawn/day/dusk windows for the
 * queried timestamp directly; `yesterday`/`tomorrow` are only consulted to
 * bound whichever half of the night the timestamp falls in, so a short
 * high-latitude summer night degrades to a compressed (never inverted or
 * throwing) early-night/late-night split instead of nonsense boundaries.
 *
 * Falls back to a coarse day/night split from `isDayFallback` only when the
 * queried date has no matching `DailySunTimes` at all — in practice
 * unreachable, since `daily` and the hourly series it accompanies are always
 * fetched together for the same date range, but kept as a defensive floor
 * rather than allowing a crash or an invented clock-time rule.
 */
export function resolveSolarPhase(
  timestamp: string,
  daily: DailySunTimes[],
  isDayFallback: boolean | null = null,
): SolarPhase {
  const date = dateOf(timestamp)
  const today = findByDate(daily, date)
  if (!today) {
    return isDayFallback === false ? 'late-night' : 'day'
  }

  const t = epochMinutes(timestamp)
  const sunrise = epochMinutes(today.sunrise)
  const sunset = epochMinutes(today.sunset)

  const dawnStart = sunrise - GOLDEN_HOUR_WINDOW_MINUTES
  const dawnEnd = sunrise + GOLDEN_HOUR_WINDOW_MINUTES
  const duskStart = sunset - GOLDEN_HOUR_WINDOW_MINUTES
  const duskEnd = sunset + GOLDEN_HOUR_WINDOW_MINUTES

  if (t >= dawnStart && t <= dawnEnd) return 'dawn'
  if (t > dawnEnd && t < duskStart) return 'day'
  if (t >= duskStart && t <= duskEnd) return 'dusk'

  if (t > duskEnd) {
    const earlyNightEnd = duskEnd + EARLY_NIGHT_DURATION_MINUTES
    if (t <= earlyNightEnd) return 'early-night'

    const tomorrow = findByDate(daily, shiftDate(date, 1))
    const tomorrowDawnStart = tomorrow
      ? epochMinutes(tomorrow.sunrise) - GOLDEN_HOUR_WINDOW_MINUTES
      : dawnStart + 24 * 60
    const tomorrowPreDawnStart = tomorrowDawnStart - PRE_DAWN_DURATION_MINUTES

    return t < tomorrowPreDawnStart ? 'late-night' : 'pre-dawn'
  }

  // t < dawnStart: either approaching today's dawn, or still within
  // yesterday's night.
  const preDawnStart = dawnStart - PRE_DAWN_DURATION_MINUTES
  if (t >= preDawnStart) return 'pre-dawn'

  const yesterday = findByDate(daily, shiftDate(date, -1))
  const yesterdayDuskEnd = yesterday
    ? epochMinutes(yesterday.sunset) + GOLDEN_HOUR_WINDOW_MINUTES
    : duskEnd - 24 * 60
  const yesterdayEarlyNightEnd = yesterdayDuskEnd + EARLY_NIGHT_DURATION_MINUTES

  return t >= yesterdayEarlyNightEnd ? 'late-night' : 'early-night'
}
