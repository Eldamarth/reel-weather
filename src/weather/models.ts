/** Core shared types for the weather layer (plan sections 3.2, 4, 5, 6). */

export interface GeoCoordinates {
  latitude: number
  longitude: number
}

/** Section 4. One model's normalized data at one point in time. */
export interface NormalizedForecastPoint {
  sourceId: string
  modelId?: string
  timestamp: string

  temperatureC: number | null
  apparentTemperatureC: number | null

  relativeHumidityPct: number | null

  windSpeedKph: number | null
  windGustKph: number | null
  windDirectionDeg: number | null

  cloudCoverPct: number | null

  precipitationMm: number | null
  precipitationProbabilityPct: number | null

  pressureHpa: number | null

  weatherCode?: number | null

  isDay?: boolean | null
  shortwaveRadiation?: number | null
}

/** Section 5.2. */
export type DisplayCondition =
  | 'clear'
  | 'mostly-clear'
  | 'partly-cloudy'
  | 'cloudy'
  | 'light-rain'
  | 'rain'
  | 'heavy-rain'
  | 'snow'
  | 'thunderstorm'
  | 'fog'

/** Section 12.2. */
export type LightLevel = 'bright' | 'moderate' | 'low' | 'dark'

/** Section 5.4. */
export interface PrecipitationConsensus {
  amountMedianMm: number | null
  amountRangeMm: [number, number] | null
  modelsPredictingPrecip: number
  modelCount: number
}

/** Section 5.4 / 6.4. */
export type HazardType = 'thunderstorm' | 'heavy-rain' | 'high-wind' | 'heavy-snow'

export interface HazardFlag {
  type: HazardType
  modelsPredicting: string[]
  modelCount: number
}

/** Section 5.3. */
export interface ConsensusPoint {
  timestamp: string

  temperatureC: number | null
  apparentTemperatureC: number | null
  relativeHumidityPct: number | null
  windSpeedKph: number | null
  windGustKph: number | null
  windDirectionDeg: number | null
  cloudCoverPct: number | null
  pressureHpa: number | null

  precipitation: PrecipitationConsensus
  condition: DisplayCondition | null
  hazards: HazardFlag[]

  contributingModels: string[]
  unavailableModels: string[]
  modelCount: number
}

/** Section 6.1. Each value is 0 (extreme disagreement) .. 1 (strong agreement). */
export interface ForecastAgreement {
  temperature: number
  wind: number
  cloudCover: number
  precipitation: number
  pressure: number
  overall: number
}

/** Section 3.2. */
export type ModelType = 'direct-nwp' | 'blend' | 'ensemble-mean'

/**
 * Approximate coverage regions confirmed or inferred from the Phase 1 spike
 * (.planning/phase1-spike-findings.md). Bounding boxes are deliberately rough —
 * good enough to gate model selection, not a claim of authoritative model
 * domains. Refine against real field use (plan section 20, Phase 7).
 */
export type GeoRegion = 'conus' | 'canada' | 'europe' | 'central-europe' | 'nordic'

export interface ModelRegistryEntry {
  modelId: string
  name: string
  type: ModelType
  regions: GeoRegion[] | 'global'
  maxHorizonHours: number
  consensusWeight?: number
}
