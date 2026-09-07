/**
 * Section 6.2: tolerance curves as configuration data, not scattered
 * constants. Each curve says: below `highAgreementSpread` the spread counts
 * as "very high" agreement, at/above `lowAgreementSpread` it counts as "low".
 *
 * The plan's illustrative anchors (section 6.2) were given in imperial units
 * (°F, mph) — converted here to match the app's internal metric normalized
 * model (°C, km/h; section 4). Precipitation and pressure had no anchors in
 * the plan and are provisional defaults pending real-world tuning (section 21).
 */
export interface ToleranceCurve {
  highAgreementSpread: number
  lowAgreementSpread: number
}

export const TOLERANCE_CURVES = {
  temperatureC: { highAgreementSpread: 0.56, lowAgreementSpread: 5.56 }, // 1°F / 10°F
  windSpeedKph: { highAgreementSpread: 3.22, lowAgreementSpread: 24.14 }, // 2mph / 15mph
  cloudCoverPct: { highAgreementSpread: 10, lowAgreementSpread: 60 },
  precipitationMm: { highAgreementSpread: 0.5, lowAgreementSpread: 5 }, // provisional
  pressureHpa: { highAgreementSpread: 1, lowAgreementSpread: 8 }, // provisional
} satisfies Record<string, ToleranceCurve>

/** Agreement score assigned at each curve's calibration anchors. Spread of 0 is always 1. */
export const AGREEMENT_AT_HIGH_ANCHOR = 0.95
export const AGREEMENT_AT_LOW_ANCHOR = 0.25

/** Section 6.3 — given directly by the plan, sums to 1.0. */
export const AGREEMENT_WEIGHTS = {
  temperature: 0.15,
  wind: 0.2,
  cloudCover: 0.15,
  precipitation: 0.35,
  pressure: 0.15,
}
