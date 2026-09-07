import { FISHING_RULES } from '../config/fishingRules'
import type { LightLevel } from '../weather/models'
import { colorsForProperties } from './colorRules'
import type { ColorRecommendation, WaterClarity } from './types'

/**
 * Section 12.3: a pure lookup into the rules matrix (section 12.4/12.5) — no
 * named lure models, just a small set of visual strategies.
 */
export function recommendLureColors(clarity: WaterClarity, light: LightLevel): ColorRecommendation {
  const rule = FISHING_RULES[clarity][light]
  return {
    strategy: rule.strategy,
    properties: rule.properties,
    colors: colorsForProperties(rule.properties),
    rationale: rule.rationale,
  }
}
