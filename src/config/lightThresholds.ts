/**
 * Section 21 open question #7 ("which light-related field produces the most
 * useful lure-color behavior") is not resolved by the plan — these are
 * provisional defaults for a workable V1, not a settled answer.
 *
 * `shortwaveRadiation` below this value while it's still daytime is used as a
 * golden-hour proxy (low sun angle lowers radiation even under clear sky,
 * without needing real sun-elevation math).
 */
export const LOW_LIGHT_RADIATION_WM2 = 50

/** Below this cloud cover, daytime with adequate radiation counts as "bright" rather than "moderate". */
export const BRIGHT_CLOUD_COVER_MAX_PCT = 30
