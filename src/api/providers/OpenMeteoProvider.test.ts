import { afterEach, describe, expect, it, vi } from 'vitest'
import { openMeteoProvider } from './OpenMeteoProvider'

const LOCATION = { latitude: 40.015, longitude: -105.2705 }

function okResponse(timezone = 'America/Denver') {
  return new Response(
    JSON.stringify({
      timezone,
      hourly: {
        time: ['2026-09-06T00:00'],
        temperature_2m: [20],
        weather_code: [2],
      },
    }),
    { status: 200 },
  )
}

function cleanErrorResponse() {
  return new Response(
    JSON.stringify({ error: true, reason: 'No data is available for this location' }),
    {
      status: 400,
    },
  )
}

/** Reproduces the Phase 1 `metno_nordic`-at-Boulder case: HTTP 200, invalid JSON body. */
function malformedJsonResponse() {
  return new Response('{"latitude":nan,"longitude":nan,"timezone":"GMT"}', { status: 200 })
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('openMeteoProvider.getForecast', () => {
  it('fetches each model in its own separate request, not a combined models=a,b list', async () => {
    const fetchMock = vi.fn(async (_url: string) => okResponse())
    vi.stubGlobal('fetch', fetchMock)

    await openMeteoProvider.getForecast({
      location: LOCATION,
      models: ['ncep_hrrr_conus', 'ncep_gfs_seamless'],
    })

    expect(fetchMock).toHaveBeenCalledTimes(2)
    const calledUrls = fetchMock.mock.calls.map((call) => String(call[0]))
    expect(calledUrls.some((u) => u.includes('models=ncep_hrrr_conus') && !u.includes(','))).toBe(
      true,
    )
    expect(calledUrls.some((u) => u.includes('models=ncep_gfs_seamless') && !u.includes(','))).toBe(
      true,
    )
  })

  it('normalizes a successful model response into byModel', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => okResponse()),
    )

    const result = await openMeteoProvider.getForecast({
      location: LOCATION,
      models: ['ncep_hrrr_conus'],
    })

    expect(result.timezone).toBe('America/Denver')
    expect(result.unavailableModels).toEqual([])
    expect(result.byModel.ncep_hrrr_conus).toHaveLength(1)
    expect(result.byModel.ncep_hrrr_conus[0].temperatureC).toBe(20)
  })

  it('treats a clean 400 {error:true} response as unavailable, not a thrown error', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => cleanErrorResponse()),
    )

    const result = await openMeteoProvider.getForecast({
      location: LOCATION,
      models: ['dwd_icon_d2'],
    })

    expect(result.unavailableModels).toEqual(['dwd_icon_d2'])
    expect(result.byModel.dwd_icon_d2).toBeUndefined()
  })

  it('treats an HTTP-200-but-invalid-JSON response as unavailable, not a thrown error', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => malformedJsonResponse()),
    )

    const result = await openMeteoProvider.getForecast({
      location: LOCATION,
      models: ['metno_nordic'],
    })

    expect(result.unavailableModels).toEqual(['metno_nordic'])
  })

  it('treats a network-level fetch failure as unavailable, not a thrown error', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('network down')
      }),
    )

    const result = await openMeteoProvider.getForecast({
      location: LOCATION,
      models: ['ncep_gfs_seamless'],
    })

    expect(result.unavailableModels).toEqual(['ncep_gfs_seamless'])
  })

  it('resolves timezone from whichever model succeeds, even if others in the same batch fail', async () => {
    let call = 0
    vi.stubGlobal('fetch', async () => {
      call += 1
      return call === 1 ? cleanErrorResponse() : okResponse('Europe/Stockholm')
    })

    const result = await openMeteoProvider.getForecast({
      location: { latitude: 59.3293, longitude: 18.0686 },
      models: ['dwd_icon_d2', 'ncep_gfs_seamless'],
    })

    expect(result.timezone).toBe('Europe/Stockholm')
    expect(result.unavailableModels).toEqual(['dwd_icon_d2'])
    expect(Object.keys(result.byModel)).toEqual(['ncep_gfs_seamless'])
  })
})
