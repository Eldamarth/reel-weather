import { describe, expect, it } from 'vitest'
import { adjustLevel, downgradeConfidence, strategyProfile } from './colorRules'

describe('adjustLevel', () => {
  it('steps up and down within range', () => {
    expect(adjustLevel('low', 1)).toBe('medium')
    expect(adjustLevel('medium', 1)).toBe('high')
    expect(adjustLevel('high', -1)).toBe('medium')
    expect(adjustLevel('medium', -1)).toBe('low')
  })

  it('clamps at the ceiling instead of going out of range', () => {
    expect(adjustLevel('high', 1)).toBe('high')
  })

  it('clamps at the floor instead of going out of range', () => {
    expect(adjustLevel('low', -1)).toBe('low')
  })

  it('is a no-op with a zero delta', () => {
    expect(adjustLevel('medium', 0)).toBe('medium')
  })
})

describe('strategyProfile', () => {
  it('returns the baseline properties and colors for a strategy', () => {
    const profile = strategyProfile('dark-silhouette')
    expect(profile.exampleColors).toContain('black')
    expect(profile.properties.silhouette).toBe('high')
  })
})

describe('downgradeConfidence', () => {
  it('keeps the original confidence when there is no ceiling', () => {
    expect(downgradeConfidence('high', undefined)).toBe('high')
  })

  it('caps confidence down to the ceiling when the ceiling is lower', () => {
    expect(downgradeConfidence('moderate', 'low')).toBe('low')
  })

  it('never raises confidence above what the input already was', () => {
    expect(downgradeConfidence('low', 'moderate')).toBe('low')
  })
})
