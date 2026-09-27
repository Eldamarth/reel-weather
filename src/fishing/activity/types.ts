/**
 * Fish Activity domain types, normalized from
 * `.planning/research/revised/reel-weather-fish-activity-species-data-contract-v1.md`.
 *
 * Deliberately a separate type universe from `../types.ts` (the lure-color
 * engine) even where names might otherwise collide — e.g. `EvidenceConfidence`
 * here is a four-band research-confidence scale (strong/moderate/limited/
 * insufficient), not the color engine's three-band low/moderate/high. The two
 * features share environmental *inputs* (clarity, tint, light) but not this
 * vocabulary.
 */
import type { WaterClarity, WaterTint } from '../types'

export type SpeciesId =
  | 'northern-pike'
  | 'zander'
  | 'european-perch'
  | 'brown-trout'
  | 'muskellunge'
  | 'burbot'
  | 'common-carp'
  | 'tench'
  | 'yellow-perch'
  | 'largemouth-bass'
  | 'smallmouth-bass'
  | 'black-crappie'
  | 'channel-catfish'

export type ActivityVariantId =
  'default' | 'freshwater-stream' | 'freshwater-lake' | 'coastal-sea-trout'

export type SpeciesModelKind = 'activity' | 'accessibility'

export type EvidenceConfidence = 'strong' | 'moderate' | 'limited' | 'insufficient'

export type EvidenceApplicability = 'high' | 'moderate' | 'limited'

export type EvidenceType =
  | 'angling-cpue'
  | 'feeding'
  | 'accelerometry'
  | 'movement'
  | 'habitat-use'
  | 'thermal-occupancy'
  | 'thermal-physiology'
  | 'reproduction'
  | 'population-context'

export interface EvidencePopulation {
  location: string
  habitat:
    'lake' | 'reservoir' | 'river' | 'stream' | 'coastal' | 'brackish' | 'laboratory' | 'multiple'
  lifeStage?: 'juvenile' | 'adult' | 'mixed' | 'unknown'
  sizeRange?: string
}

export interface EvidenceStudy {
  method: string
  sampleSize?: string
  duration?: string
  seasonsCovered?: string[]
}

export interface EvidenceFinding {
  summary: string
  direction?: 'increase' | 'decrease' | 'peak' | 'none' | 'mixed'
  effectSize?: string
  statisticalResult?: string
}

export interface EvidenceRecord {
  id: string

  citation: string
  year: number
  doi?: string
  url: string

  speciesId: SpeciesId
  variantId?: ActivityVariantId

  evidenceType: EvidenceType

  population: EvidencePopulation
  study: EvidenceStudy

  variables: string[]
  finding: EvidenceFinding

  applicability: EvidenceApplicability
  limitations: string[]
}

export type SolarPhase = 'pre-dawn' | 'dawn' | 'day' | 'dusk' | 'early-night' | 'late-night'

export type SeasonBucket = 'cold' | 'shoulder' | 'warm'

export type ActivityLevel = 'low' | 'moderate' | 'favorable' | 'high' | 'peak'

export interface PhaseActivityRule {
  level: ActivityLevel
  confidence: EvidenceConfidence
  evidenceIds: string[]
  note?: string
}

export interface DielProfile {
  default: Record<SolarPhase, PhaseActivityRule>
  seasonalOverrides?: Partial<Record<SeasonBucket, Partial<Record<SolarPhase, PhaseActivityRule>>>>
}

export type RuleMode = 'score' | 'context-only'

export type ContextVariable =
  | 'water-temperature'
  | 'water-clarity'
  | 'water-tint'
  | 'wind-speed'
  | 'cloud-cover'
  | 'shortwave-radiation'
  | 'pressure'
  | 'precipitation'
  | 'reproductive-state'
  | 'habitat'

export interface ContextRuleCondition {
  min?: number
  max?: number
  equals?: string
  oneOf?: string[]
}

export interface ContextRule {
  id: string

  variable: ContextVariable
  mode: RuleMode

  confidence: EvidenceConfidence
  evidenceIds: string[]

  condition: ContextRuleCondition

  /** Only meaningful when `mode === 'score'`. */
  levelDelta?: -2 | -1 | 0 | 1 | 2

  message: string
}

export interface ActivitySpeciesProfile {
  modelKind: 'activity'

  id: SpeciesId
  variantId?: ActivityVariantId

  scientificName: string
  displayName: string
  alternateNames: string[]

  iconKey?: string

  researchCoverage: EvidenceConfidence
  productionReady: boolean

  diel: DielProfile
  contextRules: ContextRule[]

  evidenceIds: string[]
  cautions: string[]
}

export type AccessibilityLevel = 'reduced' | 'neutral' | 'favorable'

export interface AccessibilityRuleCondition {
  phase?: SolarPhase
  min?: number
  max?: number
  season?: SeasonBucket
}

export interface AccessibilityRule {
  id: string
  variable: 'solar-phase' | 'water-temperature' | 'season' | 'habitat'

  confidence: EvidenceConfidence
  evidenceIds: string[]

  condition: AccessibilityRuleCondition

  accessibility?: AccessibilityLevel
  message: string
}

export interface AccessibilitySpeciesProfile {
  modelKind: 'accessibility'

  id: SpeciesId
  variantId: ActivityVariantId

  scientificName: string
  displayName: string
  alternateNames: string[]

  iconKey?: string

  researchCoverage: EvidenceConfidence
  productionReady: boolean

  rules: AccessibilityRule[]

  evidenceIds: string[]
  cautions: string[]
}

export type SpeciesProfile = ActivitySpeciesProfile | AccessibilitySpeciesProfile

export interface SpeciesCatalogEntry {
  speciesId: SpeciesId
  variantId?: ActivityVariantId

  displayName: string
  scientificName: string
  alternateNames: string[]

  iconKey?: string

  modelKind: SpeciesModelKind
  productionReady: boolean
}

export interface ActivityReason {
  kind: 'diel' | 'season' | 'temperature' | 'weather' | 'clarity' | 'reproduction' | 'habitat'

  message: string
  confidence: EvidenceConfidence
  evidenceIds: string[]
}

export interface SpeciesActivityPoint {
  speciesId: SpeciesId
  variantId?: ActivityVariantId
  timestamp: string

  level: ActivityLevel
  displayScore: number

  confidence: EvidenceConfidence
  reasons: ActivityReason[]
  cautions: string[]
}

export interface SpeciesAccessibilityPoint {
  speciesId: SpeciesId
  variantId: ActivityVariantId
  timestamp: string

  level: AccessibilityLevel
  confidence: EvidenceConfidence

  reasons: ActivityReason[]
  cautions: string[]
}

/**
 * Environmental context handed to the engine. Matches the design brief's
 * `ActivityContext` (section 11) with one deliberate addition: `isDay`. The
 * brief's solar-phase logic assumes real sun times are always resolvable, but
 * this app already carries a model-reported `isDay` flag for free (used
 * elsewhere for light-level), so it's kept here purely as a last-resort
 * fallback signal for `resolveSolarPhase` when a date's sunrise/sunset can't
 * be matched — never as a substitute for real solar-phase math when sun times
 * are available.
 */
export interface ActivityContext {
  timestamp: string

  coordinates: {
    latitude: number
    longitude: number
  }

  solarPhase: SolarPhase
  seasonBucket: SeasonBucket

  weather: {
    windSpeedKph: number | null
    cloudCoverPct: number | null
    shortwaveRadiationWm2: number | null
    pressureHpa: number | null
    precipitationMm: number | null
    isDay: boolean | null
  }

  waterTemperatureC: number | null

  waterClarity?: WaterClarity
  waterTint?: WaterTint | null
}

export const ACTIVITY_LEVEL_ORDER: ActivityLevel[] = [
  'low',
  'moderate',
  'favorable',
  'high',
  'peak',
]
