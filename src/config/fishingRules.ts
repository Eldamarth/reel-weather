import type { LightLevel } from '../weather/models'
import type { VisualProperty, WaterClarity } from '../fishing/types'

/**
 * Section 12.5: colors are derived from properties, not hardcoded per
 * clarity/light combination — revising one property's example colors
 * automatically updates every rule that uses it.
 */
export const PROPERTY_COLOR_EXAMPLES: Record<VisualProperty, string[]> = {
  natural: ['green', 'olive', 'perch tones', 'shad tones'],
  subtle: ['translucent shad', 'natural minnow'],
  translucent: ['clear/translucent', 'ghost shad'],
  'high-contrast': ['black/chartreuse', 'black/white'],
  'dark-silhouette': ['black', 'dark blue/purple'],
  'bright-visible': ['chartreuse', 'white', 'orange'],
  'silver-flash': ['silver'],
  'gold-flash': ['gold'],
  'warm-accent': ['orange', 'fire-tiger accents'],
  'cool-natural': ['green', 'olive'],
}

export interface FishingRule {
  strategy: string
  properties: VisualProperty[]
  rationale: string
}

/**
 * Section 12.4's rules matrix, expressed as properties (section 12.5) rather
 * than a claim of settled science (section 12.4's own framing) — an initial
 * angling heuristic to be revised after real use (section 20, Phase 7).
 */
export const FISHING_RULES: Record<WaterClarity, Record<LightLevel, FishingRule>> = {
  clear: {
    bright: {
      strategy: 'natural with restrained flash',
      properties: ['natural', 'subtle', 'silver-flash', 'cool-natural'],
      rationale:
        'Clear water and bright light favor recognizable forage colors without excessive flash or contrast.',
    },
    moderate: {
      strategy: 'natural with moderate flash',
      properties: ['natural', 'silver-flash'],
      rationale: 'Overcast light in clear water still favors natural tones, with a bit more flash.',
    },
    low: {
      strategy: 'increased contrast with silhouette',
      properties: ['dark-silhouette', 'gold-flash', 'high-contrast'],
      rationale:
        'Low light in clear water benefits from a stronger silhouette and increased contrast.',
    },
    dark: {
      strategy: 'strong dark silhouette',
      properties: ['dark-silhouette', 'high-contrast'],
      rationale: 'At night, clear water favors a dark, high-contrast silhouette.',
    },
  },
  stained: {
    bright: {
      strategy: 'high-visibility natural',
      properties: ['bright-visible', 'high-contrast', 'gold-flash'],
      rationale:
        'Stained water in bright light calls for stronger contrast and visibility than clear water.',
    },
    moderate: {
      strategy: 'fire-tiger-style contrast',
      properties: ['bright-visible', 'high-contrast', 'gold-flash', 'warm-accent'],
      rationale:
        'Overcast light in stained water favors bold, fire-tiger-style color combinations.',
    },
    low: {
      strategy: 'dark silhouette with bright accent',
      properties: ['dark-silhouette', 'bright-visible', 'high-contrast'],
      rationale:
        'Low light in stained water favors a dark silhouette paired with a bright accent color.',
    },
    dark: {
      strategy: 'black with optional bright accent',
      properties: ['dark-silhouette', 'warm-accent'],
      rationale: 'At night, stained water favors black, optionally with a bright accent.',
    },
  },
  murky: {
    bright: {
      strategy: 'maximum visibility',
      properties: ['bright-visible', 'high-contrast', 'gold-flash'],
      rationale: 'Murky water in bright light calls for maximum visibility and strong contrast.',
    },
    moderate: {
      strategy: 'bold contrast',
      properties: ['bright-visible', 'high-contrast', 'gold-flash', 'warm-accent'],
      rationale: 'Overcast light in murky water favors bold chartreuse/orange contrast.',
    },
    low: {
      strategy: 'large contrast boundaries',
      properties: ['dark-silhouette', 'high-contrast', 'bright-visible'],
      rationale:
        'Low light in murky water favors strong silhouettes with large contrast boundaries.',
    },
    dark: {
      strategy: 'maximum silhouette',
      properties: ['dark-silhouette'],
      rationale: 'At night, murky water favors black and maximum silhouette.',
    },
  },
}
