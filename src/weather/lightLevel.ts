import {
  BRIGHT_CLOUD_COVER_MAX_PCT,
  GOLDEN_HOUR_WINDOW_MINUTES,
  LOW_LIGHT_RADIATION_WM2,
} from '../config/lightThresholds'
import type { DailySunTimes, LightLevel } from './models'
import { minutesOfDay } from './time'

/** Real golden-hour check: within the configured window of actual sunrise or sunset. */
export function isNearSunriseOrSunset(timestamp: string, sunTimes: DailySunTimes): boolean {
  const t = minutesOfDay(timestamp)
  const nearSunrise = Math.abs(t - minutesOfDay(sunTimes.sunrise)) <= GOLDEN_HOUR_WINDOW_MINUTES
  const nearSunset = Math.abs(t - minutesOfDay(sunTimes.sunset)) <= GOLDEN_HOUR_WINDOW_MINUTES
  return nearSunrise || nearSunset
}

/**
 * Section 12.2: derives a simple light-level state rather than exposing raw
 * solar measurements to the fishing rules. Section 21 leaves open which
 * Open-Meteo field is most useful here (open question #7) — this now prefers
 * real sunrise/sunset proximity when available (precise), falling back to
 * radiation (a heuristic proxy) only when sun times aren't. Unknown day/night
 * status falls back to "moderate" rather than guessing.
 */
export function deriveLightLevel(
  isDay: boolean | null,
  cloudCoverPct: number | null,
  shortwaveRadiation: number | null,
  timestamp: string,
  sunTimes: DailySunTimes | null,
): LightLevel {
  if (isDay === false) return 'dark'
  if (isDay === null) return 'moderate'

  if (sunTimes && isNearSunriseOrSunset(timestamp, sunTimes)) {
    return 'low'
  }

  if (shortwaveRadiation !== null && shortwaveRadiation < LOW_LIGHT_RADIATION_WM2) {
    return 'low'
  }

  if (cloudCoverPct === null) return 'moderate'
  return cloudCoverPct < BRIGHT_CLOUD_COVER_MAX_PCT ? 'bright' : 'moderate'
}
