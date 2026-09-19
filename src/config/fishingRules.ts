import type {
  EvidenceConfidence,
  VisualProperties,
  VisualStrategy,
  WaterClarity,
} from '../fishing/types'
import type { LightLevel } from '../weather/models'

/**
 * Revised 2026-09-13 against `.planning/reel-weather-lure-color-research-brief.md`
 * (citations verified against primary sources — see the brief). Each
 * strategy owns its own baseline properties and example colors, independent
 * of clarity/light — the thing clarity and light do is *select and adjust*
 * one of these, not define a new palette per combination.
 */
export const STRATEGY_PROFILES: Record<
  VisualStrategy,
  { properties: VisualProperties; exampleColors: string[] }
> = {
  natural: {
    properties: { opacity: 'low', contrast: 'low', silhouette: 'low', flash: 'low' },
    exampleColors: ['olive', 'green', 'brown', 'silver', 'white/bone'],
  },
  contrast: {
    properties: { opacity: 'medium', contrast: 'high', silhouette: 'medium', flash: 'medium' },
    exampleColors: ['white', 'yellow', 'chartreuse', 'gold', 'black/chartreuse two-tone'],
  },
  'dark-silhouette': {
    properties: { opacity: 'high', contrast: 'high', silhouette: 'high', flash: 'low' },
    exampleColors: ['black', 'black/blue', 'dark purple', 'dark green'],
  },
  'bright-opaque': {
    properties: { opacity: 'high', contrast: 'high', silhouette: 'medium', flash: 'medium' },
    exampleColors: ['white/bone', 'chartreuse', 'yellow', 'orange'],
  },
}

interface ClarityStrategyRule {
  primary: VisualStrategy
  alternate?: VisualStrategy
  confidence: EvidenceConfidence
  rationale: string
}

/**
 * Water clarity is the dominant input (brief section 7/17) — it picks the
 * strategy. Murky water deliberately keeps two defensible options rather
 * than declaring one winner (brief section 8): the evidence doesn't support
 * picking between a dark silhouette and a bright opaque presentation.
 */
export const CLARITY_STRATEGY: Record<WaterClarity, ClarityStrategyRule> = {
  clear: {
    primary: 'natural',
    confidence: 'moderate',
    rationale:
      'Clear water lets fish inspect a lure closely; a natural, lower-conspicuity presentation is the better-supported default.',
  },
  stained: {
    primary: 'contrast',
    confidence: 'moderate',
    rationale:
      'Turbid/stained water reduces visibility; stronger opaque contrast is better supported than any single hue.',
  },
  murky: {
    primary: 'dark-silhouette',
    alternate: 'bright-opaque',
    confidence: 'low',
    rationale:
      'In very low visibility, gross contrast matters more than exact color, but evidence does not favor a dark silhouette over a bright opaque presentation — both are defensible.',
  },
}

/**
 * Light is a modifier of the chosen strategy's properties, never a hue
 * selector (brief section 9 — a controlled rainbow trout study found
 * illuminance did not determine lure color choice, only turbidity did).
 * Values are relative steps against the strategy's baseline PropertyLevel,
 * clamped by `adjustLevel` in fishing/colorRules.ts.
 */
export const LIGHT_PROPERTY_MODIFIERS: Record<
  LightLevel,
  Partial<Record<keyof VisualProperties, 1 | -1>>
> = {
  bright: { flash: 1 },
  moderate: {},
  low: { flash: -1, opacity: 1, silhouette: 1 },
  dark: { flash: -1, silhouette: 1 },
}

/**
 * Low light/night should not be presented with the same confidence as
 * daylight fine-hue distinctions (brief section 9's "reduce confidence in
 * fine hue distinctions" / "night... confidence should be low"). Only caps
 * confidence downward — never raises it above what clarity alone supports.
 */
export const LIGHT_CONFIDENCE_CEILING: Partial<Record<LightLevel, EvidenceConfidence>> = {
  low: 'low',
  dark: 'low',
}
