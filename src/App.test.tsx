import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

function currentUtcHourString(): string {
  return new Date().toISOString().slice(0, 13) + ':00'
}

beforeEach(() => {
  localStorage.clear()

  vi.stubGlobal(
    'fetch',
    vi.fn(async (input: string | URL) => {
      const url = String(input)

      if (url.includes('geocoding-api.open-meteo.com')) {
        return new Response(
          JSON.stringify({
            results: [
              { id: 1, name: 'Boulder', latitude: 40.015, longitude: -105.2705, country: 'US' },
            ],
          }),
        )
      }

      return new Response(
        JSON.stringify({
          timezone: 'UTC',
          hourly: {
            time: [currentUtcHourString()],
            temperature_2m: [20],
            weather_code: [1],
            cloud_cover: [20],
            wind_speed_10m: [10],
            precipitation: [0],
          },
        }),
      )
    }),
  )
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('App', () => {
  it('shows the location picker before any location is resolved', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: 'Use my location' })).toBeInTheDocument()
  })

  it('loads a consensus card once a location is chosen via search', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByPlaceholderText('Search for a place...'), 'Boulder')
    await user.click(await screen.findByRole('button', { name: /Boulder/ }))

    expect(await screen.findByText('Consensus from', { exact: false })).toBeInTheDocument()
  })

  it('defaults to Fahrenheit and switches to Celsius with one tap', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByPlaceholderText('Search for a place...'), 'Boulder')
    await user.click(await screen.findByRole('button', { name: /Boulder/ }))

    expect((await screen.findAllByText('68°F', { exact: false })).length).toBeGreaterThan(0)

    await user.click(screen.getByRole('radio', { name: '°C' }))

    expect((await screen.findAllByText('20°C', { exact: false })).length).toBeGreaterThan(0)
  })
})
