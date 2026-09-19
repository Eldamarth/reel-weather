import {
  CLARITY_STRATEGY,
  LIGHT_CONFIDENCE_CEILING,
  LIGHT_PROPERTY_MODIFIERS,
} from '../config/fishingRules'
import type { LightLevel } from '../weather/models'
import { adjustLevel, downgradeConfidence, strategyProfile } from './colorRules'
import type { LureVisualRecommendation, VisualProperties, WaterClarity } from './types'

/**
 * Water clarity picks the strategy (dominant input); light only adjusts that
 * strategy's properties and, in low light, caps confidence — it never
 * chooses a different hue or strategy. See
 * `.planning/reel-weather-lure-color-research-brief.md` for the evidence
 * this is based on.
 */
export function recommendLureVisualStrategy(
  clarity: WaterClarity,
  light: LightLevel,
): LureVisualRecommendation {
  const clarityRule = CLARITY_STRATEGY[clarity]
  const { properties: baseline, exampleColors } = strategyProfile(clarityRule.primary)
  const modifiers = LIGHT_PROPERTY_MODIFIERS[light]

  const properties: VisualProperties = {
    opacity: adjustLevel(baseline.opacity, modifiers.opacity ?? 0),
    contrast: adjustLevel(baseline.contrast, modifiers.contrast ?? 0),
    silhouette: adjustLevel(baseline.silhouette, modifiers.silhouette ?? 0),
    flash: adjustLevel(baseline.flash, modifiers.flash ?? 0),
  }

  return {
    primaryStrategy: clarityRule.primary,
    alternateStrategy: clarityRule.alternate,
    properties,
    exampleColors,
    confidence: downgradeConfidence(clarityRule.confidence, LIGHT_CONFIDENCE_CEILING[light]),
    rationale: clarityRule.rationale,
  }
}
