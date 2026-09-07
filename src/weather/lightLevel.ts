import { BRIGHT_CLOUD_COVER_MAX_PCT, LOW_LIGHT_RADIATION_WM2 } from '../config/lightThresholds'
import type { LightLevel } from './models'

/**
 * Section 12.2: derives a simple light-level state rather than exposing raw
 * solar measurements to the fishing rules. Section 21 leaves open which
 * Open-Meteo field is most useful here — this combines day/night, radiation
 * (as a golden-hour proxy), and cloud cover, each provisionally weighted;
 * revisit once real use says otherwise. Unknown day/night status falls back
 * to "moderate" rather than guessing.
 */
export function deriveLightLevel(
  isDay: boolean | null,
  cloudCoverPct: number | null,
  shortwaveRadiation: number | null,
): LightLevel {
  if (isDay === false) return 'dark'
  if (isDay === null) return 'moderate'

  if (shortwaveRadiation !== null && shortwaveRadiation < LOW_LIGHT_RADIATION_WM2) {
    return 'low'
  }

  if (cloudCoverPct === null) return 'moderate'
  return cloudCoverPct < BRIGHT_CLOUD_COVER_MAX_PCT ? 'bright' : 'moderate'
}
