import type { DisplayCondition } from './models'

/**
 * Open-Meteo's `weather_code` field uses the WMO code table (WMO 4677 /
 * SYNOP ww), and returns it consistently across every model we tested in the
 * Phase 1 spike. This is the single source of truth for both the display
 * condition mapping (section 5.2) and the raw hazard-code sets (section 5.4)
 * — hazard detection intentionally reads the raw codes directly rather than
 * going through the coarser DisplayCondition bucketing below, since e.g.
 * "snow" collapses light and heavy snow together but heavy-snow hazard
 * detection needs that distinction back.
 */
const WEATHER_CODE_TO_CONDITION: Record<number, DisplayCondition> = {
  0: 'clear',
  1: 'mostly-clear',
  2: 'partly-cloudy',
  3: 'cloudy',
  45: 'fog',
  48: 'fog',
  51: 'light-rain',
  53: 'light-rain',
  55: 'light-rain',
  56: 'light-rain',
  57: 'light-rain',
  61: 'rain',
  63: 'rain',
  65: 'heavy-rain',
  66: 'rain',
  67: 'rain',
  71: 'snow',
  73: 'snow',
  75: 'snow',
  77: 'snow',
  80: 'light-rain',
  81: 'rain',
  82: 'heavy-rain',
  85: 'snow',
  86: 'snow',
  95: 'thunderstorm',
  96: 'thunderstorm',
  99: 'thunderstorm',
}

export function weatherCodeToCondition(code: number): DisplayCondition | null {
  return WEATHER_CODE_TO_CONDITION[code] ?? null
}

export const THUNDERSTORM_CODES = new Set([95, 96, 99])
export const HEAVY_RAIN_CODES = new Set([65, 82])
export const HEAVY_SNOW_CODES = new Set([75, 86])
