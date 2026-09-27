import type { ActivityLevel } from '../fishing/activity/types'

/**
 * Design brief section 12's "workable V1" twilight windows, anchored to real
 * sunrise/sunset rather than fixed clock hours (the Scandinavian-latitude
 * concern the brief calls out by name). `dawn`/`dusk` reuse the same ±window
 * concept as the lure-color engine's golden-hour check
 * (`GOLDEN_HOUR_WINDOW_MINUTES` in `lightThresholds.ts`) rather than inventing
 * a second "civil twilight" constant — it's the same real quantity.
 */
export const EARLY_NIGHT_DURATION_HOURS = 3
export const PRE_DAWN_DURATION_HOURS = 3

/**
 * UI coordinates only (brief section 10) — never percentages, effect sizes,
 * or probabilities. Do not render with a `%` suffix.
 */
export const ACTIVITY_DISPLAY_SCORE: Record<ActivityLevel, number> = {
  low: 20,
  moderate: 40,
  favorable: 60,
  high: 80,
  peak: 95,
}
