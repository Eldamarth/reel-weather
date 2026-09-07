import { describe, expect, it } from 'vitest'
import { deriveHazardFlags } from './hazards'
import { makeModel } from './fixtures'

describe('deriveHazardFlags', () => {
  it('flags a minority thunderstorm signal even though most models disagree', () => {
    const models = [
      makeModel({ modelId: 'a', weatherCode: 3 }),
      makeModel({ modelId: 'b', weatherCode: 3 }),
      makeModel({ modelId: 'c', weatherCode: 3 }),
      makeModel({ modelId: 'd', weatherCode: 95 }),
    ]
    const flags = deriveHazardFlags(models)
    expect(flags).toContainEqual({
      type: 'thunderstorm',
      modelsPredicting: ['d'],
      modelCount: 4,
    })
  })

  it('produces no flags when nothing hazardous is predicted', () => {
    const models = ['a', 'b', 'c'].map((id) => makeModel({ modelId: id, weatherCode: 1 }))
    expect(deriveHazardFlags(models)).toEqual([])
  })

  it('flags high wind from gust independently of the thunderstorm/precip codes', () => {
    const models = [
      makeModel({ modelId: 'a', weatherCode: 0, windGustKph: 80 }),
      makeModel({ modelId: 'b', weatherCode: 0, windGustKph: 20 }),
    ]
    const flags = deriveHazardFlags(models)
    expect(flags).toContainEqual({ type: 'high-wind', modelsPredicting: ['a'], modelCount: 2 })
  })

  it('falls back to sustained wind speed when gust is null', () => {
    const models = [makeModel({ modelId: 'a', windGustKph: null, windSpeedKph: 90 })]
    const flags = deriveHazardFlags(models)
    expect(flags).toContainEqual({ type: 'high-wind', modelsPredicting: ['a'], modelCount: 1 })
  })

  it('distinguishes heavy snow from light/moderate snow', () => {
    const heavy = deriveHazardFlags([makeModel({ modelId: 'a', weatherCode: 75 })])
    const light = deriveHazardFlags([makeModel({ modelId: 'a', weatherCode: 71 })])
    expect(heavy).toContainEqual({ type: 'heavy-snow', modelsPredicting: ['a'], modelCount: 1 })
    expect(light).toEqual([])
  })
})
