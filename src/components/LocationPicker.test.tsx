import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { LocationPicker } from './LocationPicker'

function mockGeolocation(impl: (success: PositionCallback, error?: PositionErrorCallback) => void) {
  Object.defineProperty(navigator, 'geolocation', {
    value: { getCurrentPosition: vi.fn(impl) },
    configurable: true,
  })
}

beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  vi.unstubAllGlobals()
  // @ts-expect-error -- test-only cleanup of the property we defined above
  delete navigator.geolocation
})

describe('LocationPicker', () => {
  it('auto-resolves from a saved last-used location without any interaction', () => {
    localStorage.setItem(
      'reel-weather:preferences',
      JSON.stringify({
        lastLocation: { id: '40,-105', name: 'Boulder', latitude: 40, longitude: -105 },
        recentLocations: [],
      }),
    )
    const onLocationSelected = vi.fn()

    render(<LocationPicker onLocationSelected={onLocationSelected} />)

    expect(onLocationSelected).toHaveBeenCalledTimes(1)
    expect(onLocationSelected).toHaveBeenCalledWith({
      id: '40,-105',
      name: 'Boulder',
      latitude: 40,
      longitude: -105,
    })
    expect(screen.getByText('Boulder')).toBeInTheDocument()
  })

  it('shows the "use my location" and search UI when nothing is saved yet', () => {
    render(<LocationPicker onLocationSelected={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Use my location' })).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Search for a place...')).toBeInTheDocument()
  })

  it('resolves via geolocation and persists it for next time', async () => {
    mockGeolocation((success) => {
      success({ coords: { latitude: 40.015, longitude: -105.2705 } } as GeolocationPosition)
    })
    const onLocationSelected = vi.fn()
    const user = userEvent.setup()

    render(<LocationPicker onLocationSelected={onLocationSelected} />)
    await user.click(screen.getByRole('button', { name: 'Use my location' }))

    await waitFor(() => expect(onLocationSelected).toHaveBeenCalledTimes(1))
    expect(onLocationSelected).toHaveBeenCalledWith(
      expect.objectContaining({ latitude: 40.015, longitude: -105.2705 }),
    )
    expect(JSON.parse(localStorage.getItem('reel-weather:preferences')!).lastLocation).toEqual(
      expect.objectContaining({ latitude: 40.015, longitude: -105.2705 }),
    )
  })

  it('falls back cleanly to search when geolocation is denied', async () => {
    mockGeolocation((_success, error) => {
      error?.({ code: 1, message: 'User denied Geolocation' } as GeolocationPositionError)
    })
    const user = userEvent.setup()

    render(<LocationPicker onLocationSelected={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: 'Use my location' }))

    expect(await screen.findByText(/User denied Geolocation/)).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Search for a place...')).toBeInTheDocument()
  })

  it('searches and resolves a selected result', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        json: async () => ({
          results: [
            { id: 1, name: 'Stockholm', latitude: 59.3293, longitude: 18.0686, country: 'Sweden' },
          ],
        }),
      })),
    )
    const onLocationSelected = vi.fn()
    const user = userEvent.setup()

    render(<LocationPicker onLocationSelected={onLocationSelected} />)
    await user.type(screen.getByPlaceholderText('Search for a place...'), 'Stockholm')

    const result = await screen.findByRole('button', { name: /Stockholm, Sweden/ })
    await user.click(result)

    expect(onLocationSelected).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Stockholm', latitude: 59.3293, longitude: 18.0686 }),
    )
  })
})
