import { describe, expect, it } from 'vitest'
import { recommendLureVisualStrategy } from './recommendations'

describe('recommendLureVisualStrategy', () => {
  it('clarity picks the strategy: clear -> natural, stained -> contrast', () => {
    expect(recommendLureVisualStrategy('clear', 'moderate').primaryStrategy).toBe('natural')
    expect(recommendLureVisualStrategy('stained', 'moderate').primaryStrategy).toBe('contrast')
  })

  it('murky offers a dark-silhouette primary and a bright-opaque alternate, not one universal winner', () => {
    const rec = recommendLureVisualStrategy('murky', 'moderate')
    expect(rec.primaryStrategy).toBe('dark-silhouette')
    expect(rec.alternateStrategy).toBe('bright-opaque')
  })

  it('clear and stained have no alternate strategy', () => {
    expect(recommendLureVisualStrategy('clear', 'moderate').alternateStrategy).toBeUndefined()
    expect(recommendLureVisualStrategy('stained', 'moderate').alternateStrategy).toBeUndefined()
  })

  it('light modifies properties (flash up in bright light) without changing the strategy or colors', () => {
    const moderate = recommendLureVisualStrategy('clear', 'moderate')
    const bright = recommendLureVisualStrategy('clear', 'bright')

    expect(bright.primaryStrategy).toBe(moderate.primaryStrategy)
    expect(bright.exampleColors).toEqual(moderate.exampleColors)
    expect(bright.properties.flash).not.toBe(moderate.properties.flash)
  })

  it('never maps light level directly to a different hue: the same clarity always yields the same example colors regardless of light', () => {
    const lights = ['bright', 'moderate', 'low', 'dark'] as const
    const colorSets = lights.map((l) => recommendLureVisualStrategy('clear', l).exampleColors)
    for (const colors of colorSets) {
      expect(colors).toEqual(colorSets[0])
    }
  })

  it('low light increases silhouette and opacity while reducing flash', () => {
    const moderate = recommendLureVisualStrategy('clear', 'moderate')
    const low = recommendLureVisualStrategy('clear', 'low')

    expect(low.properties.silhouette).toBe('medium') // low: 'low' + 1
    expect(low.properties.opacity).toBe('medium') // low: 'low' + 1
    expect(low.properties.flash).toBe('low') // already floored, clamps
    expect(moderate.properties.silhouette).toBe('low')
  })

  it('downgrades confidence in low/dark light but never raises it', () => {
    const clearModerate = recommendLureVisualStrategy('clear', 'moderate')
    const clearDark = recommendLureVisualStrategy('clear', 'dark')
    const murkyDark = recommendLureVisualStrategy('murky', 'dark')

    expect(clearModerate.confidence).toBe('moderate')
    expect(clearDark.confidence).toBe('low')
    expect(murkyDark.confidence).toBe('low') // already low; stays low, not raised
  })

  it('carries the clarity-derived rationale', () => {
    const rec = recommendLureVisualStrategy('stained', 'moderate')
    expect(rec.rationale.length).toBeGreaterThan(0)
    expect(rec.rationale).toMatch(/contrast/i)
  })

  it('covers every clarity/light combination without throwing', () => {
    const clarities: WaterClarityInput[] = ['clear', 'stained', 'murky']
    const lights = ['bright', 'moderate', 'low', 'dark'] as const
    for (const clarity of clarities) {
      for (const light of lights) {
        expect(() => recommendLureVisualStrategy(clarity, light)).not.toThrow()
      }
    }
  })
})

type WaterClarityInput = Parameters<typeof recommendLureVisualStrategy>[0]
