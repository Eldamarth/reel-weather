import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { ForecastProvider, NormalizedForecast } from '../api/providers/ForecastProvider'
import { useForecast } from './useForecast'

const BOULDER = { latitude: 40.015, longitude: -105.2705 }

function fakeProvider(forecast: NormalizedForecast): ForecastProvider {
  return { id: 'fake', name: 'Fake', getForecast: async () => forecast }
}

function failingProvider(message: string): ForecastProvider {
  return {
    id: 'fake',
    name: 'Fake',
    getForecast: async () => {
      throw new Error(message)
    },
  }
}

describe('useForecast', () => {
  it('is idle with no location', () => {
    // Provider is constructed once, outside the render callback — passing a
    // fresh provider object on every render would retrigger the effect
    // (see the react-hooks/exhaustive-deps note in useForecast.ts).
    const provider = fakeProvider({} as NormalizedForecast)
    const { result } = renderHook(() => useForecast(null, provider))
    expect(result.current.status).toBe('idle')
  })

  it('resolves to a consensus + agreement once the provider responds', async () => {
    const now = new Date()
    const nowIso = now.toISOString().slice(0, 13) + ':00' // matches the fixture's hour, ignoring timezone precision for this test's purpose

    const provider = fakeProvider({
      sourceId: 'open-meteo',
      timezone: 'UTC',
      unavailableModels: [],
      byModel: {
        model_a: [
          {
            sourceId: 'open-meteo',
            modelId: 'model_a',
            timestamp: nowIso,
            temperatureC: 20,
            apparentTemperatureC: 19,
            relativeHumidityPct: 50,
            windSpeedKph: 10,
            windGustKph: 15,
            windDirectionDeg: 180,
            cloudCoverPct: 50,
            precipitationMm: 0,
            precipitationProbabilityPct: 10,
            pressureHpa: 1013,
            weatherCode: 0,
            isDay: true,
            shortwaveRadiation: 400,
          },
        ],
      },
    })

    const { result } = renderHook(() => useForecast(BOULDER, provider))

    await waitFor(() => expect(result.current.status).toBe('success'))
    if (result.current.status !== 'success') throw new Error('expected success')
    expect(result.current.consensus.temperatureC).toBe(20)
    expect(result.current.agreement.overall).toBeGreaterThan(0)
    expect(result.current.timezone).toBe('UTC')
  })

  it('surfaces provider errors instead of throwing', async () => {
    const { result } = renderHook(() => useForecast(BOULDER, failingProvider('network down')))
    await waitFor(() => expect(result.current.status).toBe('error'))
    if (result.current.status !== 'error') throw new Error('expected error')
    expect(result.current.message).toBe('network down')
  })

  it('surfaces a clean error when every selected model is unavailable', async () => {
    const provider = fakeProvider({
      sourceId: 'open-meteo',
      timezone: 'UTC',
      unavailableModels: ['model_a'],
      byModel: {},
    })
    const { result } = renderHook(() => useForecast(BOULDER, provider))
    await waitFor(() => expect(result.current.status).toBe('error'))
  })
})
