import { describe, expect, it } from 'vitest'
import { celsiusToFahrenheit, formatTemperature } from './units'

describe('celsiusToFahrenheit', () => {
  it('converts freezing and boiling points correctly', () => {
    expect(celsiusToFahrenheit(0)).toBe(32)
    expect(celsiusToFahrenheit(100)).toBe(212)
  })

  it('converts a negative temperature', () => {
    expect(celsiusToFahrenheit(-40)).toBe(-40)
  })
})

describe('formatTemperature', () => {
  it('formats in Fahrenheit, rounded', () => {
    expect(formatTemperature(20, 'fahrenheit')).toBe('68°F')
  })

  it('formats in Celsius, rounded', () => {
    expect(formatTemperature(20.4, 'celsius')).toBe('20°C')
  })

  it('rounds a converted Fahrenheit value, not just the Celsius input', () => {
    expect(formatTemperature(21, 'fahrenheit')).toBe('70°F') // 69.8 -> 70
  })

  it('shows an em dash for a missing value rather than "null°F"', () => {
    expect(formatTemperature(null, 'fahrenheit')).toBe('—')
  })
})
