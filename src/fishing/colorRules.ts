import { STRATEGY_PROFILES } from '../config/fishingRules'
import type { EvidenceConfidence, PropertyLevel, VisualProperties, VisualStrategy } from './types'

const LEVELS: PropertyLevel[] = ['low', 'medium', 'high']

/** Steps a property level up/down, clamped to ['low','medium','high'] — light never pushes a property out of range. */
export function adjustLevel(level: PropertyLevel, delta: -1 | 0 | 1): PropertyLevel {
  const index = LEVELS.indexOf(level) + delta
  return LEVELS[Math.min(LEVELS.length - 1, Math.max(0, index))]
}

/** Looks up a strategy's own baseline properties/colors — used for the primary strategy (before light adjustment) and to describe the alternate strategy in the UI. */
export function strategyProfile(strategy: VisualStrategy): {
  properties: VisualProperties
  exampleColors: string[]
} {
  return STRATEGY_PROFILES[strategy]
}

const CONFIDENCE_RANK: Record<EvidenceConfidence, number> = { low: 0, moderate: 1, high: 2 }

/** Caps confidence down to `ceiling` if lower — never raises it (section 9: low light should only ever reduce confidence in fine hue distinctions). */
export function downgradeConfidence(
  confidence: EvidenceConfidence,
  ceiling: EvidenceConfidence | undefined,
): EvidenceConfidence {
  if (!ceiling) return confidence
  return CONFIDENCE_RANK[ceiling] < CONFIDENCE_RANK[confidence] ? ceiling : confidence
}
