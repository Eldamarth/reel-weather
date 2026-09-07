import { MODEL_REGISTRY } from '../config/modelRegistry'
import type { GeoCoordinates, GeoRegion, ModelRegistryEntry } from './models'

interface BoundingBox {
  minLat: number
  maxLat: number
  minLon: number
  maxLon: number
}

/**
 * Deliberately rough bounding boxes — enough to gate model selection, not an
 * authoritative claim of each model's real domain. See ModelRegistryEntry
 * comments in models.ts.
 */
const REGION_BOUNDS: Record<GeoRegion, BoundingBox> = {
  conus: { minLat: 24, maxLat: 50, minLon: -125, maxLon: -66 },
  canada: { minLat: 41, maxLat: 84, minLon: -141, maxLon: -52 },
  europe: { minLat: 34, maxLat: 72, minLon: -25, maxLon: 45 },
  'central-europe': { minLat: 43.18, maxLat: 58.08, minLon: -3.94, maxLon: 20.34 },
  nordic: { minLat: 54, maxLat: 72, minLon: 4, maxLon: 32 },
}

function isInRegion(location: GeoCoordinates, region: GeoRegion): boolean {
  const box = REGION_BOUNDS[region]
  return (
    location.latitude >= box.minLat &&
    location.latitude <= box.maxLat &&
    location.longitude >= box.minLon &&
    location.longitude <= box.maxLon
  )
}

function coversLocation(entry: ModelRegistryEntry, location: GeoCoordinates): boolean {
  if (entry.regions === 'global') return true
  return entry.regions.some((region) => isInRegion(location, region))
}

/**
 * Section 3.2: filters the model registry by region and forecast horizon,
 * rather than assuming a fixed model set everywhere.
 */
export function selectModels(
  location: GeoCoordinates,
  forecastTime: Date,
  now: Date,
): ModelRegistryEntry[] {
  const hoursUntilForecast = (forecastTime.getTime() - now.getTime()) / (1000 * 60 * 60)

  return MODEL_REGISTRY.filter((entry) => {
    if (!coversLocation(entry, location)) return false
    if (hoursUntilForecast < 0) return true // past/current hour — treat as always in horizon
    return hoursUntilForecast <= entry.maxHorizonHours
  })
}
