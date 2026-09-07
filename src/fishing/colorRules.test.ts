import { describe, expect, it } from 'vitest'
import { colorsForProperties } from './colorRules'

describe('colorsForProperties', () => {
  it('maps a single property to its example colors', () => {
    expect(colorsForProperties(['gold-flash'])).toEqual(['gold'])
  })

  it('combines colors from multiple properties, preserving property order', () => {
    const colors = colorsForProperties(['gold-flash', 'dark-silhouette'])
    expect(colors).toEqual(['gold', 'black', 'dark blue/purple'])
  })

  it('de-duplicates colors shared by overlapping properties', () => {
    // 'natural' and 'cool-natural' both suggest green/olive.
    const colors = colorsForProperties(['natural', 'cool-natural'])
    expect(colors.filter((c) => c === 'green')).toHaveLength(1)
    expect(colors.filter((c) => c === 'olive')).toHaveLength(1)
  })

  it('returns an empty array for no properties', () => {
    expect(colorsForProperties([])).toEqual([])
  })
})
