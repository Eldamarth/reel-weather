/**
 * Phase 1 API spike (plan section 20).
 *
 * Purpose: verify, empirically and from a real browser context, the assumptions
 * the rest of the architecture depends on — model identifiers, per-model variable
 * coverage, forecast horizons, timezone behavior, CORS, and how an unavailable
 * model is actually represented in a response. This is throwaway spike code, not
 * part of the eventual app — nothing here should be imported by consensus.ts or
 * normalize.ts later.
 */

export interface SpikeLocation {
  name: string
  latitude: number
  longitude: number
}

export const SPIKE_LOCATIONS: SpikeLocation[] = [
  { name: 'Boulder, CO', latitude: 40.015, longitude: -105.2705 },
  { name: 'Stockholm, Sweden', latitude: 59.3293, longitude: 18.0686 },
  { name: 'Helsinki, Finland', latitude: 60.1699, longitude: 24.9384 },
]

/** Candidate model identifiers, discovered from the Open-Meteo docs form markup
 * and confirmed against the live API — see .planning/phase1-spike-findings.md. */
export const CANDIDATE_MODELS = [
  'ncep_gfs_seamless',
  'ncep_hrrr_conus',
  'ncep_nbm_conus',
  'ecmwf_ifs025',
  'dwd_icon_global',
  'dwd_icon_eu',
  'dwd_icon_d2',
  'cmc_gem_seamless',
  'cmc_gem_gdps',
  'cmc_gem_hrdps',
  'metno_nordic',
] as const

export type CandidateModel = (typeof CANDIDATE_MODELS)[number]

const SPIKE_VARIABLES = [
  'temperature_2m',
  'apparent_temperature',
  'relative_humidity_2m',
  'wind_speed_10m',
  'wind_gusts_10m',
  'wind_direction_10m',
  'cloud_cover',
  'precipitation',
  'precipitation_probability',
  'pressure_msl',
  'weather_code',
  'is_day',
  'shortwave_radiation',
] as const

interface OpenMeteoErrorBody {
  error: true
  reason: string
}

interface OpenMeteoHourlyBody {
  latitude: number
  longitude: number
  timezone: string
  timezone_abbreviation: string
  utc_offset_seconds: number
  hourly_units: Record<string, string>
  hourly: Record<string, Array<number | null>> & { time: string[] }
}

export type ModelProbeResult =
  | {
      modelId: string
      status: 'ok'
      horizonHours: number
      lastNonNullTimestamp: string | null
      missingVariables: string[]
      resolvedTimezone: string
    }
  | { modelId: string; status: 'unavailable-clean'; httpStatus: number; reason: string }
  | {
      modelId: string
      status: 'unavailable-malformed-json'
      httpStatus: number
      rawSnippet: string
    }
  | { modelId: string; status: 'network-error'; message: string }

/**
 * Probes ONE model in its own request. Deliberately not a combined
 * `models=a,b,c` call — the spike found that shape unreliable for
 * programmatic availability detection (see finding #4 in the findings doc):
 * an unavailable model is either silently dropped (no trace in the response)
 * or, if listed first, can poison the whole response's top-level lat/lon
 * fields with a non-JSON `nan` token that throws on `JSON.parse`.
 */
export async function probeModel(
  location: SpikeLocation,
  modelId: string,
): Promise<ModelProbeResult> {
  const url = new URL('https://api.open-meteo.com/v1/forecast')
  url.searchParams.set('latitude', String(location.latitude))
  url.searchParams.set('longitude', String(location.longitude))
  url.searchParams.set('hourly', SPIKE_VARIABLES.join(','))
  url.searchParams.set('forecast_days', '16')
  url.searchParams.set('timezone', 'auto')
  url.searchParams.set('models', modelId)

  let response: Response
  try {
    response = await fetch(url.toString())
  } catch (err) {
    return { modelId, status: 'network-error', message: (err as Error).message }
  }

  const rawText = await response.text()

  let parsed: OpenMeteoHourlyBody | OpenMeteoErrorBody
  try {
    parsed = JSON.parse(rawText)
  } catch {
    // The metno_nordic-at-Boulder case: HTTP 200 but a bare `nan` token for
    // lat/lon makes the body invalid JSON.
    return {
      modelId,
      status: 'unavailable-malformed-json',
      httpStatus: response.status,
      rawSnippet: rawText.slice(0, 200),
    }
  }

  if ('error' in parsed && parsed.error) {
    return {
      modelId,
      status: 'unavailable-clean',
      httpStatus: response.status,
      reason: parsed.reason,
    }
  }

  const body = parsed as OpenMeteoHourlyBody
  const missingVariables = SPIKE_VARIABLES.filter((v) => {
    const series = body.hourly[v]
    return !series || series.every((x) => x === null)
  })

  const tempSeries = body.hourly.temperature_2m ?? []
  const lastNonNullIndex = [...tempSeries]
    .map((v, i) => (v !== null ? i : -1))
    .filter((i) => i >= 0)
    .at(-1)

  return {
    modelId,
    status: 'ok',
    horizonHours: tempSeries.length,
    lastNonNullTimestamp:
      lastNonNullIndex !== undefined ? body.hourly.time[lastNonNullIndex] : null,
    missingVariables,
    resolvedTimezone: body.timezone,
  }
}

export interface LocationSpikeReport {
  location: SpikeLocation
  results: ModelProbeResult[]
}

export async function runSpike(): Promise<LocationSpikeReport[]> {
  const reports: LocationSpikeReport[] = []
  for (const location of SPIKE_LOCATIONS) {
    const results = await Promise.all(
      CANDIDATE_MODELS.map((modelId) => probeModel(location, modelId)),
    )
    reports.push({ location, results })
  }
  return reports
}

/**
 * Demonstrates the order-dependent combined-request hazard directly, so it's
 * visible in a running browser rather than only documented in prose: pairing an
 * available model with an unavailable one in a single `models=` request corrupts
 * the WHOLE response if the unavailable model is listed first, even though the
 * available model's own data would have been fine on its own.
 */
export async function demonstrateCombinedRequestHazard(): Promise<{
  goodOrderParsed: boolean
  badOrderParsed: boolean
}> {
  const location = SPIKE_LOCATIONS[0]
  const build = (models: string) => {
    const url = new URL('https://api.open-meteo.com/v1/forecast')
    url.searchParams.set('latitude', String(location.latitude))
    url.searchParams.set('longitude', String(location.longitude))
    url.searchParams.set('hourly', 'temperature_2m')
    url.searchParams.set('forecast_days', '1')
    url.searchParams.set('models', models)
    return url.toString()
  }

  const tryParse = async (url: string) => {
    const text = await (await fetch(url)).text()
    try {
      JSON.parse(text)
      return true
    } catch {
      return false
    }
  }

  const goodOrderParsed = await tryParse(build('ncep_hrrr_conus,metno_nordic'))
  const badOrderParsed = await tryParse(build('metno_nordic,ncep_hrrr_conus'))
  return { goodOrderParsed, badOrderParsed }
}
