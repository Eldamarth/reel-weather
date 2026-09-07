import { describe, expect, it } from 'vitest'
import { loadTemperatureUnit } from './unitPreference'

describe('loadTemperatureUnit', () => {
  it('defaults to fahrenheit when nothing is stored', () => {
    expect(loadTemperatureUnit({ getItem: () => null })).toBe('fahrenheit')
  })

  it('defaults to fahrenheit for a corrupted/unrecognized stored value', () => {
    expect(loadTemperatureUnit({ getItem: () => 'kelvin' })).toBe('fahrenheit')
  })

  it('returns the stored preference when it is valid', () => {
    expect(loadTemperatureUnit({ getItem: () => 'celsius' })).toBe('celsius')
  })
})
