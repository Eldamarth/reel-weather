import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { ForecastProvider, NormalizedForecast } from '../api/providers/ForecastProvider'
import { makeModel } from '../weather/fixtures'
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

function nowIso(): string {
  return new Date().toISOString().slice(0, 13) + ':00'
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

  it('resolves to an hourly series anchored on "now" once the provider responds', async () => {
    const provider = fakeProvider({
      sourceId: 'open-meteo',
      timezone: 'UTC',
      unavailableModels: [],
      byModel: {
        model_a: [makeModel({ modelId: 'model_a', timestamp: nowIso(), temperatureC: 20 })],
      },
    })

    const { result } = renderHook(() => useForecast(BOULDER, provider))

    await waitFor(() => expect(result.current.status).toBe('success'))
    if (result.current.status !== 'success') throw new Error('expected success')
    expect(result.current.series).toHaveLength(1)
    expect(result.current.selectedIndex).toBe(0)
    expect(result.current.nowIndex).toBe(0)
    expect(result.current.series[result.current.selectedIndex].consensus.temperatureC).toBe(20)
    expect(result.current.timezone).toBe('UTC')
  })

  it('setSelectedIndex moves the selection without re-fetching', async () => {
    const getForecast = vi.fn(async () => ({
      sourceId: 'open-meteo',
      timezone: 'UTC',
      unavailableModels: [],
      byModel: {
        model_a: [
          makeModel({ modelId: 'model_a', timestamp: nowIso(), temperatureC: 20 }),
          makeModel({ modelId: 'model_a', timestamp: '2099-01-01T00:00', temperatureC: 30 }),
        ],
      },
    }))
    const provider: ForecastProvider = { id: 'fake', name: 'Fake', getForecast }

    const { result } = renderHook(() => useForecast(BOULDER, provider))
    await waitFor(() => expect(result.current.status).toBe('success'))
    const initial = result.current
    if (initial.status !== 'success') throw new Error('expected success')

    act(() => initial.setSelectedIndex(1))

    await waitFor(() => {
      if (result.current.status !== 'success') throw new Error('expected success')
      expect(result.current.selectedIndex).toBe(1)
    })
    if (result.current.status !== 'success') throw new Error('expected success')
    expect(result.current.series[result.current.selectedIndex].consensus.temperatureC).toBe(30)
    expect(getForecast).toHaveBeenCalledTimes(1)
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
