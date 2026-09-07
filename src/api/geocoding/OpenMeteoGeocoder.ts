export interface GeocodeResult {
  id: number
  name: string
  latitude: number
  longitude: number
  admin1?: string
  country?: string
}

interface RawGeocodeResponse {
  results?: Array<{
    id: number
    name: string
    latitude: number
    longitude: number
    admin1?: string
    country?: string
  }>
}

/** Section 8.1 place-name search. Confirmed CORS-open in the Phase 1 spike. */
export async function searchLocations(query: string): Promise<GeocodeResult[]> {
  if (query.trim().length === 0) return []

  const url = new URL('https://geocoding-api.open-meteo.com/v1/search')
  url.searchParams.set('name', query)
  url.searchParams.set('count', '5')

  const res = await fetch(url.toString())
  const body: RawGeocodeResponse = await res.json()

  return (body.results ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    latitude: r.latitude,
    longitude: r.longitude,
    admin1: r.admin1,
    country: r.country,
  }))
}
