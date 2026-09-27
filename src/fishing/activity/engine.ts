import { ACTIVITY_DISPLAY_SCORE } from '../../config/activityThresholds'
import {
  ACTIVITY_LEVEL_ORDER,
  type AccessibilityLevel,
  type AccessibilityRule,
  type AccessibilitySpeciesProfile,
  type ActivityContext,
  type ActivityLevel,
  type ActivityReason,
  type ActivitySpeciesProfile,
  type ContextRule,
  type ContextVariable,
  type EvidenceConfidence,
  type SpeciesAccessibilityPoint,
  type SpeciesActivityPoint,
} from './types'

function contextValueFor(
  variable: ContextVariable,
  context: ActivityContext,
): number | string | null {
  switch (variable) {
    case 'water-temperature':
      return context.waterTemperatureC
    case 'water-clarity':
      return context.waterClarity ?? null
    case 'water-tint':
      return context.waterTint ?? null
    case 'wind-speed':
      return context.weather.windSpeedKph
    case 'cloud-cover':
      return context.weather.cloudCoverPct
    case 'shortwave-radiation':
      return context.weather.shortwaveRadiationWm2
    case 'pressure':
      return context.weather.pressureHpa
    case 'precipitation':
      return context.weather.precipitationMm
    case 'reproductive-state':
    case 'habitat':
      // No V1 input surface for these — the rules that reference them are
      // retained as evidence-backed knowledge (data contract principle 5,
      // "insufficient evidence means the variable is not modeled") but can
      // never fire from live context. See profiles/northernPike.ts and
      // profiles/zander.ts for the spawning-context rules this covers.
      return null
  }
}

/** A rule with an empty `condition` (`{}`) applies whenever its variable's value is known — the pattern used by e.g. `pike-wind-evidence-note`. */
function contextRuleApplies(rule: ContextRule, context: ActivityContext): boolean {
  const value = contextValueFor(rule.variable, context)
  const { min, max, equals, oneOf } = rule.condition

  if (equals !== undefined) return value === equals
  if (oneOf !== undefined) return typeof value === 'string' && oneOf.includes(value)

  if (min !== undefined || max !== undefined) {
    if (typeof value !== 'number') return false
    if (min !== undefined && value < min) return false
    if (max !== undefined && value > max) return false
    return true
  }

  return value !== null && value !== undefined
}

function reasonKindFor(variable: ContextVariable): ActivityReason['kind'] {
  switch (variable) {
    case 'water-temperature':
      return 'temperature'
    case 'water-clarity':
    case 'water-tint':
      return 'clarity'
    case 'wind-speed':
    case 'cloud-cover':
    case 'shortwave-radiation':
    case 'pressure':
    case 'precipitation':
      return 'weather'
    case 'reproductive-state':
      return 'reproduction'
    case 'habitat':
      return 'habitat'
  }
}

function applyLevelDelta(level: ActivityLevel, delta: number): ActivityLevel {
  const index = ACTIVITY_LEVEL_ORDER.indexOf(level)
  const clamped = Math.min(ACTIVITY_LEVEL_ORDER.length - 1, Math.max(0, index + delta))
  return ACTIVITY_LEVEL_ORDER[clamped]
}

function defaultDielMessage(phase: string, level: ActivityLevel): string {
  return `${phase[0].toUpperCase()}${phase.slice(1)} activity is typically ${level}.`
}

/**
 * Design brief section 15: intentionally small and inspectable. No ML, no
 * inferred regression coefficients — the default diel rule for the current
 * solar phase (with a seasonal override where the profile defines one) sets
 * the baseline level, and every applicable `contextRules` entry can add an
 * explanatory reason, with only `mode: 'score'` rules (none exist in the V1
 * production profiles, but the mechanism is generic and tested) shifting the
 * level itself.
 */
export function estimateSpeciesActivity(
  profile: ActivitySpeciesProfile,
  context: ActivityContext,
): SpeciesActivityPoint {
  const phaseRule =
    profile.diel.seasonalOverrides?.[context.seasonBucket]?.[context.solarPhase] ??
    profile.diel.default[context.solarPhase]

  const reasons: ActivityReason[] = [
    {
      kind: 'diel',
      message: phaseRule.note ?? defaultDielMessage(context.solarPhase, phaseRule.level),
      confidence: phaseRule.confidence,
      evidenceIds: phaseRule.evidenceIds,
    },
  ]

  let level = phaseRule.level

  for (const rule of profile.contextRules) {
    if (!contextRuleApplies(rule, context)) continue

    if (rule.mode === 'score' && rule.levelDelta) {
      level = applyLevelDelta(level, rule.levelDelta)
    }

    reasons.push({
      kind: reasonKindFor(rule.variable),
      message: rule.message,
      confidence: rule.confidence,
      evidenceIds: rule.evidenceIds,
    })
  }

  return {
    speciesId: profile.id,
    variantId: profile.variantId,
    timestamp: context.timestamp,
    level,
    displayScore: ACTIVITY_DISPLAY_SCORE[level],
    confidence: phaseRule.confidence,
    reasons,
    cautions: profile.cautions,
  }
}

function accessibilityRuleApplies(rule: AccessibilityRule, context: ActivityContext): boolean {
  const { phase, min, max, season } = rule.condition

  if (phase !== undefined && phase !== context.solarPhase) return false
  if (season !== undefined && season !== context.seasonBucket) return false

  if (min !== undefined || max !== undefined) {
    if (context.waterTemperatureC == null) return false
    if (min !== undefined && context.waterTemperatureC < min) return false
    if (max !== undefined && context.waterTemperatureC > max) return false
  }

  return true
}

function accessibilityReasonKind(variable: AccessibilityRule['variable']): ActivityReason['kind'] {
  switch (variable) {
    case 'solar-phase':
      return 'diel'
    case 'water-temperature':
      return 'temperature'
    case 'season':
      return 'season'
    case 'habitat':
      return 'habitat'
  }
}

/**
 * Worst-signal-wins for `reduced`, otherwise best-signal-wins: a countervailing
 * physical constraint (e.g. warm water pushing fish deeper) should not be
 * masked by a merely-favorable time-of-day signal. See Sea Trout's coastal
 * profile, where a warm-water `reduced` rule and a nighttime `favorable` rule
 * can both be applicable at once.
 */
function decideAccessibility(
  matches: Array<{ rule: AccessibilityRule }>,
): { level: AccessibilityLevel; confidence: EvidenceConfidence } | null {
  for (const target of ['reduced', 'favorable', 'neutral'] as const) {
    const match = matches.find((m) => m.rule.accessibility === target)
    if (match) return { level: target, confidence: match.rule.confidence }
  }
  return null
}

export function estimateSpeciesAccessibility(
  profile: AccessibilitySpeciesProfile,
  context: ActivityContext,
): SpeciesAccessibilityPoint {
  const matches = profile.rules
    .filter((rule) => accessibilityRuleApplies(rule, context))
    .map((rule) => ({ rule }))

  const reasons: ActivityReason[] = matches.map(({ rule }) => ({
    kind: accessibilityReasonKind(rule.variable),
    message: rule.message,
    confidence: rule.confidence,
    evidenceIds: rule.evidenceIds,
  }))

  const decided = decideAccessibility(matches)

  return {
    speciesId: profile.id,
    variantId: profile.variantId,
    timestamp: context.timestamp,
    level: decided?.level ?? 'neutral',
    confidence: decided?.confidence ?? profile.researchCoverage,
    reasons,
    cautions: profile.cautions,
  }
}
