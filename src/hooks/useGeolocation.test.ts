import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useGeolocation } from './useGeolocation'

describe('useGeolocation', () => {
  it('starts idle', () => {
    const { result } = renderHook(() => useGeolocation({ getCurrentPosition: vi.fn() }))
    expect(result.current.state).toEqual({ status: 'idle' })
  })

  it('resolves to success with the position on request', () => {
    const getCurrentPosition = vi.fn((success: PositionCallback) => {
      success({ coords: { latitude: 40.015, longitude: -105.2705 } } as GeolocationPosition)
    })
    const { result } = renderHook(() => useGeolocation({ getCurrentPosition }))

    act(() => result.current.request())

    expect(result.current.state).toEqual({
      status: 'success',
      coordinates: { latitude: 40.015, longitude: -105.2705 },
    })
  })

  it('resolves to an error state on permission denial, so the caller can fall back to search', () => {
    const getCurrentPosition = vi.fn(
      (_success: PositionCallback, error?: PositionErrorCallback) => {
        error?.({ code: 1, message: 'User denied Geolocation' } as GeolocationPositionError)
      },
    )
    const { result } = renderHook(() => useGeolocation({ getCurrentPosition }))

    act(() => result.current.request())

    expect(result.current.state).toEqual({ status: 'error', message: 'User denied Geolocation' })
  })

  it('resolves to an error state when the browser has no geolocation API at all', () => {
    const { result } = renderHook(() => useGeolocation(undefined))
    // jsdom doesn't implement navigator.geolocation, so this exercises the "not available" branch.
    act(() => result.current.request())
    expect(result.current.state.status).toBe('error')
  })
})
