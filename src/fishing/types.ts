/** Section 11.2. Angler-supplied, never inferred from weather data (section 11.2). */
export type WaterClarity = 'clear' | 'stained' | 'murky'

/** Section 12.5 — a fixed, general vocabulary rather than per-combo hardcoded colors. */
export type VisualProperty =
  | 'natural'
  | 'subtle'
  | 'translucent'
  | 'high-contrast'
  | 'dark-silhouette'
  | 'bright-visible'
  | 'silver-flash'
  | 'gold-flash'
  | 'warm-accent'
  | 'cool-natural'

/** Section 12.3. */
export interface ColorRecommendation {
  strategy: string
  colors: string[]
  properties: VisualProperty[]
  rationale: string
}
