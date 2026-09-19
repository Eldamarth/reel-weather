import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CONDITION_DISPLAY } from '../../weather/condition'
import type { DisplayCondition } from '../../weather/models'
import { WeatherIcon } from './WeatherIcon'

const ALL_CONDITIONS: DisplayCondition[] = [
  'clear',
  'mostly-clear',
  'partly-cloudy',
  'cloudy',
  'light-rain',
  'rain',
  'heavy-rain',
  'snow',
  'thunderstorm',
  'fog',
]

describe('WeatherIcon', () => {
  it('renders every condition without throwing, with an accessible name matching its label', () => {
    for (const condition of ALL_CONDITIONS) {
      const { unmount } = render(<WeatherIcon condition={condition} />)
      expect(
        screen.getByRole('img', { name: CONDITION_DISPLAY[condition].label }),
      ).toBeInTheDocument()
      unmount()
    }
  })

  it('renders at the requested size', () => {
    render(<WeatherIcon condition="clear" size={40} />)
    const svg = screen.getByRole('img')
    expect(svg).toHaveAttribute('width', '40')
    expect(svg).toHaveAttribute('height', '40')
  })

  it('gives rain and heavy-rain different streak counts, since they used to be visually identical', () => {
    const { container: rainContainer } = render(<WeatherIcon condition="rain" />)
    const { container: heavyContainer } = render(<WeatherIcon condition="heavy-rain" />)
    const rainStreaks = rainContainer.querySelectorAll('line[stroke-width]')
    const heavyStreaks = heavyContainer.querySelectorAll('line[stroke-width]')
    expect(heavyStreaks.length).toBeGreaterThan(rainStreaks.length)
  })

  it('draws cloudy with no streaks/flakes/bolt below it, unlike every precipitation condition', () => {
    const { container } = render(<WeatherIcon condition="cloudy" />)
    expect(container.querySelectorAll('line').length).toBe(0)
    expect(container.querySelectorAll('path').length).toBe(0)
  })

  it('draws fog with no cloud shape at all, unlike every other condition', () => {
    const { container } = render(<WeatherIcon condition="fog" />)
    // The cloud shape is built from circles; fog should have none.
    expect(container.querySelectorAll('circle').length).toBe(0)
  })
})
