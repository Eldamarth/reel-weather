import {
  CLARITY_STRATEGY,
  LIGHT_CONFIDENCE_CEILING,
  LIGHT_PROPERTY_MODIFIERS,
  TINT_CONFIDENCE_FLOOR,
  TINT_PROPERTY_MODIFIERS,
  TINT_RATIONALE,
} from '../config/fishingRules'
import type { LightLevel } from '../weather/models'
import {
  adjustLevel,
  downgradeConfidence,
  raiseConfidenceFloor,
  strategyProfile,
} from './colorRules'
import type { LureVisualRecommendation, VisualProperties, WaterClarity, WaterTint } from './types'

/**
 * Water clarity picks the strategy (dominant input); light and tint only
 * adjust that strategy's properties/confidence — neither ever chooses a
 * different hue or strategy. See
 * `.planning/reel-weather-lure-color-research-brief.md` for the evidence
 * this is based on. `tint` is optional and defaults to "unspecified", per
 * the brief's explicit instruction that it must never be required for
 * normal use (section 14).
 */
export function recommendLureVisualStrategy(
  clarity: WaterClarity,
  light: LightLevel,
  tint: WaterTint = 'unspecified',
): LureVisualRecommendation {
  const clarityRule = CLARITY_STRATEGY[clarity]
  const { properties: baseline, exampleColors } = strategyProfile(clarityRule.primary)
  const lightModifiers = LIGHT_PROPERTY_MODIFIERS[light]
  const tintModifiers = TINT_PROPERTY_MODIFIERS[tint]

  const properties: VisualProperties = {
    opacity: adjustLevel(
      adjustLevel(baseline.opacity, lightModifiers.opacity ?? 0),
      tintModifiers.opacity ?? 0,
    ),
    contrast: adjustLevel(
      adjustLevel(baseline.contrast, lightModifiers.contrast ?? 0),
      tintModifiers.contrast ?? 0,
    ),
    silhouette: adjustLevel(
      adjustLevel(baseline.silhouette, lightModifiers.silhouette ?? 0),
      tintModifiers.silhouette ?? 0,
    ),
    flash: adjustLevel(
      adjustLevel(baseline.flash, lightModifiers.flash ?? 0),
      tintModifiers.flash ?? 0,
    ),
  }

  // Tint's floor is applied before light's ceiling — a well-studied water
  // type can justify more confidence, but pitch dark still gets the final
  // say on how confident we are about fine hue distinctions.
  const confidence = downgradeConfidence(
    raiseConfidenceFloor(clarityRule.confidence, TINT_CONFIDENCE_FLOOR[tint]),
    LIGHT_CONFIDENCE_CEILING[light],
  )

  const tintNote = TINT_RATIONALE[tint]
  const rationale = tintNote ? `${clarityRule.rationale} ${tintNote}` : clarityRule.rationale

  return {
    primaryStrategy: clarityRule.primary,
    alternateStrategy: clarityRule.alternate,
    properties,
    exampleColors,
    confidence,
    rationale,
  }
}
