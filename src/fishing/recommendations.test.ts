import { describe, expect, it } from 'vitest'
import { recommendLureColors } from './recommendations'

describe('recommendLureColors', () => {
  // The three deterministic cases from plan section 19's "Fishing-rule tests".

  it('clear + bright -> natural/subtle + restrained flash', () => {
    const rec = recommendLureColors('clear', 'bright')
    expect(rec.properties).toEqual(expect.arrayContaining(['natural', 'subtle']))
    expect(rec.properties).toContain('silver-flash')
    expect(rec.properties).not.toContain('bright-visible')
  })

  it('murky + low light -> high contrast + dark silhouette + bright accent', () => {
    const rec = recommendLureColors('murky', 'low')
    expect(rec.properties).toEqual(
      expect.arrayContaining(['high-contrast', 'dark-silhouette', 'bright-visible']),
    )
  })

  it('stained + moderate light -> high visibility + gold/white/chartreuse/orange options', () => {
    const rec = recommendLureColors('stained', 'moderate')
    expect(rec.properties).toContain('bright-visible')
    expect(rec.colors).toEqual(expect.arrayContaining(['gold', 'white', 'chartreuse', 'orange']))
  })

  it('returns a full ColorRecommendation shape with a non-empty strategy and rationale', () => {
    const rec = recommendLureColors('clear', 'dark')
    expect(rec.strategy.length).toBeGreaterThan(0)
    expect(rec.rationale.length).toBeGreaterThan(0)
    expect(rec.colors.length).toBeGreaterThan(0)
  })

  it('is a pure lookup: the same clarity/light input always returns an equivalent recommendation', () => {
    expect(recommendLureColors('murky', 'bright')).toEqual(recommendLureColors('murky', 'bright'))
  })

  it('covers every clarity/light combination without throwing', () => {
    const clarities: Array<Parameters<typeof recommendLureColors>[0]> = [
      'clear',
      'stained',
      'murky',
    ]
    const lights: Array<Parameters<typeof recommendLureColors>[1]> = [
      'bright',
      'moderate',
      'low',
      'dark',
    ]
    for (const clarity of clarities) {
      for (const light of lights) {
        expect(() => recommendLureColors(clarity, light)).not.toThrow()
      }
    }
  })
})
