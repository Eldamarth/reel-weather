import { describe, expect, it } from 'vitest'
import { deriveCondition } from './condition'
import { makeModel } from './fixtures'

describe('deriveCondition', () => {
  it('picks the unanimous condition when every model agrees', () => {
    const models = ['a', 'b', 'c'].map((id) => makeModel({ modelId: id, weatherCode: 0 }))
    expect(deriveCondition(models)).toBe('clear')
  })

  it('picks the plurality condition, not an average of codes', () => {
    const models = [
      makeModel({ modelId: 'a', weatherCode: 3 }), // cloudy
      makeModel({ modelId: 'b', weatherCode: 3 }),
      makeModel({ modelId: 'c', weatherCode: 61 }), // rain
    ]
    expect(deriveCondition(models)).toBe('cloudy')
  })

  it('a lone thunderstorm model does not flip the majority condition', () => {
    const models = [
      makeModel({ modelId: 'a', weatherCode: 2 }),
      makeModel({ modelId: 'b', weatherCode: 2 }),
      makeModel({ modelId: 'c', weatherCode: 2 }),
      makeModel({ modelId: 'd', weatherCode: 95 }),
    ]
    expect(deriveCondition(models)).toBe('partly-cloudy')
  })

  it('falls back to cloud cover when weatherCode is missing', () => {
    const models = [makeModel({ modelId: 'a', weatherCode: null, cloudCoverPct: 5 })]
    expect(deriveCondition(models)).toBe('clear')
  })

  it('returns null with no usable data', () => {
    const models = [makeModel({ modelId: 'a', weatherCode: null, cloudCoverPct: null })]
    expect(deriveCondition(models)).toBeNull()
  })
})
