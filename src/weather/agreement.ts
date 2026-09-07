import {
  AGREEMENT_AT_HIGH_ANCHOR,
  AGREEMENT_AT_LOW_ANCHOR,
  AGREEMENT_WEIGHTS,
  TOLERANCE_CURVES,
  type ToleranceCurve,
} from '../config/agreementThresholds'
import type { ForecastAgreement, NormalizedForecastPoint } from './models'

/**
 * Section 6.2: converts a raw spread into a 0..1 agreement score using a
 * per-variable tolerance curve. Piecewise linear: (0, 1) down to
 * (highAgreementSpread, AGREEMENT_AT_HIGH_ANCHOR), then down to
 * (lowAgreementSpread, AGREEMENT_AT_LOW_ANCHOR), then continuing the same
 * slope toward (but clamped at) 0 for anything beyond.
 */
export function spreadToAgreement(spread: number, curve: ToleranceCurve): number {
  if (spread <= 0) return 1
  if (spread <= curve.highAgreementSpread) {
    const t = spread / curve.highAgreementSpread
    return 1 - t * (1 - AGREEMENT_AT_HIGH_ANCHOR)
  }
  if (spread <= curve.lowAgreementSpread) {
    const t =
      (spread - curve.highAgreementSpread) / (curve.lowAgreementSpread - curve.highAgreementSpread)
    return AGREEMENT_AT_HIGH_ANCHOR - t * (AGREEMENT_AT_HIGH_ANCHOR - AGREEMENT_AT_LOW_ANCHOR)
  }
  const slope =
    (AGREEMENT_AT_HIGH_ANCHOR - AGREEMENT_AT_LOW_ANCHOR) /
    (curve.lowAgreementSpread - curve.highAgreementSpread)
  const beyond = spread - curve.lowAgreementSpread
  return Math.max(0, AGREEMENT_AT_LOW_ANCHOR - slope * beyond)
}

/**
 * Section 6.1: disagreement computed per-variable, never as one standard
 * deviation across unlike units. With fewer than two data points there's
 * nothing to disagree about, so agreement is perfect by convention.
 */
export function calculateFieldAgreement(
  values: Array<number | null>,
  curve: ToleranceCurve,
): number {
  const clean = values.filter((v): v is number => v !== null)
  if (clean.length < 2) return 1
  const spread = Math.max(...clean) - Math.min(...clean)
  return spreadToAgreement(spread, curve)
}

/** Section 6.3: weighted sum of the per-field scores, clamped to 0..1. */
export function calculateOverallAgreement(
  fields: Omit<ForecastAgreement, 'overall'>,
  weights: typeof AGREEMENT_WEIGHTS,
): number {
  const weighted =
    fields.temperature * weights.temperature +
    fields.wind * weights.wind +
    fields.cloudCover * weights.cloudCover +
    fields.precipitation * weights.precipitation +
    fields.pressure * weights.pressure
  return Math.min(1, Math.max(0, weighted))
}

/**
 * Assembles the full ForecastAgreement for one timestamp's contributing
 * models. Precipitation agreement is about spread of *amount*, not
 * probability — probability isn't blended into a numeric score at all
 * (section 5.4); it's carried as PrecipitationConsensus/HazardFlags instead.
 */
export function calculateForecastAgreement(models: NormalizedForecastPoint[]): ForecastAgreement {
  const fields = {
    temperature: calculateFieldAgreement(
      models.map((m) => m.temperatureC),
      TOLERANCE_CURVES.temperatureC,
    ),
    wind: calculateFieldAgreement(
      models.map((m) => m.windSpeedKph),
      TOLERANCE_CURVES.windSpeedKph,
    ),
    cloudCover: calculateFieldAgreement(
      models.map((m) => m.cloudCoverPct),
      TOLERANCE_CURVES.cloudCoverPct,
    ),
    precipitation: calculateFieldAgreement(
      models.map((m) => m.precipitationMm),
      TOLERANCE_CURVES.precipitationMm,
    ),
    pressure: calculateFieldAgreement(
      models.map((m) => m.pressureHpa),
      TOLERANCE_CURVES.pressureHpa,
    ),
  }

  return { ...fields, overall: calculateOverallAgreement(fields, AGREEMENT_WEIGHTS) }
}

const TOTAL_AGREEMENT_DOTS = 5

/** Section 7.2's "●●●●○" meter. */
export function agreementDots(overall: number): string {
  const filled = Math.min(
    TOTAL_AGREEMENT_DOTS,
    Math.max(0, Math.round(overall * TOTAL_AGREEMENT_DOTS)),
  )
  return '●'.repeat(filled) + '○'.repeat(TOTAL_AGREEMENT_DOTS - filled)
}

/** Section 6.5: user-facing terminology emphasizes agreement, not statistical confidence. */
export function agreementLabel(overall: number): string {
  if (overall >= 0.9) return 'Very High Agreement'
  if (overall >= 0.75) return 'High Agreement'
  if (overall >= 0.5) return 'Mixed Forecast'
  if (overall >= 0.25) return 'Low Agreement'
  return 'Very Low Agreement'
}

const FIELD_DISPLAY_NAMES: Record<keyof Omit<ForecastAgreement, 'overall'>, string> = {
  temperature: 'temperature',
  wind: 'wind',
  cloudCover: 'cloud cover',
  precipitation: 'precipitation',
  pressure: 'pressure',
}

/** Section 7.2's "Most disagreement: precipitation" line. */
export function mostDisagreementField(agreement: ForecastAgreement): string {
  const fields = Object.keys(FIELD_DISPLAY_NAMES) as Array<keyof typeof FIELD_DISPLAY_NAMES>
  const lowest = fields.reduce((worst, field) =>
    agreement[field] < agreement[worst] ? field : worst,
  )
  return FIELD_DISPLAY_NAMES[lowest]
}
