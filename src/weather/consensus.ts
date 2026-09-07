import { PRECIPITATION_DETECTION_THRESHOLD_MM } from '../config/hazardThresholds'
import { deriveCondition } from './condition'
import { deriveHazardFlags } from './hazards'
import type { ConsensusPoint, NormalizedForecastPoint, PrecipitationConsensus } from './models'

function nonNull(values: Array<number | null>): number[] {
  return values.filter((v): v is number => v !== null)
}

/** Section 5.1: reduces the influence of a single anomalous model. */
export function median(values: Array<number | null>): number | null {
  const sorted = nonNull(values).sort((a, b) => a - b)
  if (sorted.length === 0) return null
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid]
}

function range(values: Array<number | null>): [number, number] | null {
  const clean = nonNull(values)
  if (clean.length === 0) return null
  return [Math.min(...clean), Math.max(...clean)]
}

/**
 * Section 5.1: wind direction can't be averaged arithmetically (0°/360° are
 * the same direction, but their arithmetic mean is 180° — exactly wrong).
 * Uses a unit-vector mean instead.
 */
export function circularMeanDegrees(degreesValues: Array<number | null>): number | null {
  const clean = nonNull(degreesValues)
  if (clean.length === 0) return null

  let sumSin = 0
  let sumCos = 0
  for (const deg of clean) {
    const rad = (deg * Math.PI) / 180
    sumSin += Math.sin(rad)
    sumCos += Math.cos(rad)
  }

  const meanRad = Math.atan2(sumSin / clean.length, sumCos / clean.length)
  const meanDeg = (meanRad * 180) / Math.PI
  return meanDeg < 0 ? meanDeg + 360 : meanDeg
}

function buildPrecipitationConsensus(models: NormalizedForecastPoint[]): PrecipitationConsensus {
  const amounts = models.map((m) => m.precipitationMm)
  return {
    amountMedianMm: median(amounts),
    amountRangeMm: range(amounts),
    modelsPredictingPrecip: nonNull(amounts).filter(
      (mm) => mm >= PRECIPITATION_DETECTION_THRESHOLD_MM,
    ).length,
    modelCount: models.length,
  }
}

/**
 * Section 5.3: builds one consensus point from whichever models actually
 * returned data for this timestamp. `selectedModelIds` is the full set the
 * registry said should apply (section 3.2) — the difference between that and
 * `models` is what populates `unavailableModels`, so a dropped-out short-range
 * model reads as "unavailable", not as a disagreeing model.
 */
export function buildConsensusPoint(
  models: NormalizedForecastPoint[],
  selectedModelIds: string[],
  timestamp: string,
): ConsensusPoint {
  const contributingModels = models.map((m) => m.modelId ?? m.sourceId)
  const unavailableModels = selectedModelIds.filter((id) => !contributingModels.includes(id))

  return {
    timestamp,
    temperatureC: median(models.map((m) => m.temperatureC)),
    apparentTemperatureC: median(models.map((m) => m.apparentTemperatureC)),
    relativeHumidityPct: median(models.map((m) => m.relativeHumidityPct)),
    windSpeedKph: median(models.map((m) => m.windSpeedKph)),
    windGustKph: median(models.map((m) => m.windGustKph)),
    windDirectionDeg: circularMeanDegrees(models.map((m) => m.windDirectionDeg)),
    cloudCoverPct: median(models.map((m) => m.cloudCoverPct)),
    pressureHpa: median(models.map((m) => m.pressureHpa)),
    precipitation: buildPrecipitationConsensus(models),
    condition: deriveCondition(models),
    hazards: deriveHazardFlags(models),
    contributingModels,
    unavailableModels,
    modelCount: contributingModels.length,
  }
}
