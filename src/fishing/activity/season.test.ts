import { describe, expect, it } from 'vitest'
import { resolveSeasonBucket } from './season'

describe('resolveSeasonBucket', () => {
  it('classifies northern-hemisphere winter months as cold', () => {
    expect(resolveSeasonBucket('2026-12-15T12:00', 55)).toBe('cold')
    expect(resolveSeasonBucket('2026-01-15T12:00', 55)).toBe('cold')
    expect(resolveSeasonBucket('2026-02-15T12:00', 55)).toBe('cold')
  })

  it('classifies northern-hemisphere summer months as warm', () => {
    expect(resolveSeasonBucket('2026-06-15T12:00', 55)).toBe('warm')
    expect(resolveSeasonBucket('2026-07-15T12:00', 55)).toBe('warm')
    expect(resolveSeasonBucket('2026-08-15T12:00', 55)).toBe('warm')
  })

  it('classifies the remaining northern-hemisphere months as shoulder', () => {
    for (const month of ['03', '04', '05', '09', '10', '11']) {
      expect(resolveSeasonBucket(`2026-${month}-15T12:00`, 55)).toBe('shoulder')
    }
  })

  it('shifts the mapping by six months south of the equator', () => {
    expect(resolveSeasonBucket('2026-06-15T12:00', -33)).toBe('cold')
    expect(resolveSeasonBucket('2026-12-15T12:00', -33)).toBe('warm')
    expect(resolveSeasonBucket('2026-03-15T12:00', -33)).toBe('shoulder')
  })

  it('treats the equator (latitude 0) as northern hemisphere', () => {
    expect(resolveSeasonBucket('2026-01-15T12:00', 0)).toBe('cold')
  })
})
