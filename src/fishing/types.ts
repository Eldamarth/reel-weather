/** Angler-supplied, never inferred from weather data (plan section 11.2). */
export type WaterClarity = 'clear' | 'stained' | 'murky'

/**
 * A small, general visual-strategy vocabulary — water clarity picks one (or,
 * for murky, two) of these; it is not itself a color. This is the seam for a
 * later scoring engine: strategies stay the same, only how they're chosen
 * (a lookup today, weighted scores later) would change.
 *
 * Revised 2026-09-13 per `.planning/reel-weather-lure-color-research-brief.md`
 * — replaces the earlier 10-tag `VisualProperty` vocabulary, which mapped
 * light level directly to hue. Evidence review (verified against the cited
 * primary sources) found: (1) exact hue has weak/no effect on catch rate in
 * most controlled studies, (2) turbidity/clarity — not illuminance — is what
 * changes which colors read as effective, (3) fluorescence shows no
 * catch-rate advantage once other conditions are controlled for. See the
 * brief for citations.
 */
export type VisualStrategy = 'natural' | 'contrast' | 'dark-silhouette' | 'bright-opaque'

/** Coarse levels rather than continuous scores — deliberately simple for this pass (see brief section 12 for the eventual scoring-engine direction). */
export type PropertyLevel = 'low' | 'medium' | 'high'

/**
 * What light modifies (brief section 9): never a hue choice directly, only
 * these visual properties of whichever strategy water clarity already chose.
 */
export interface VisualProperties {
  opacity: PropertyLevel
  contrast: PropertyLevel
  silhouette: PropertyLevel
  flash: PropertyLevel
}

/** How strong the underlying evidence is for this specific recommendation, not a claim about fish behavior itself (brief section 13/20). */
export type EvidenceConfidence = 'low' | 'moderate' | 'high'

export interface LureVisualRecommendation {
  primaryStrategy: VisualStrategy
  /** Murky water offers two defensible strategies rather than declaring one winner (brief section 8). */
  alternateStrategy?: VisualStrategy
  properties: VisualProperties
  exampleColors: string[]
  confidence: EvidenceConfidence
  rationale: string
}
