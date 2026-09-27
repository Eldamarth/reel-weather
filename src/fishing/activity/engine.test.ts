import { describe, expect, it } from 'vitest'
import { estimateSpeciesAccessibility, estimateSpeciesActivity } from './engine'
import type {
  AccessibilitySpeciesProfile,
  ActivityContext,
  ActivitySpeciesProfile,
  PhaseActivityRule,
} from './types'

function phaseRule(
  level: PhaseActivityRule['level'],
  overrides: Partial<PhaseActivityRule> = {},
): PhaseActivityRule {
  return { level, confidence: 'strong', evidenceIds: ['ev-1'], ...overrides }
}

function baseContext(overrides: Partial<ActivityContext> = {}): ActivityContext {
  return {
    timestamp: '2026-09-26T18:00',
    coordinates: { latitude: 55, longitude: 12 },
    solarPhase: 'day',
    seasonBucket: 'shoulder',
    weather: {
      windSpeedKph: null,
      cloudCoverPct: null,
      shortwaveRadiationWm2: null,
      pressureHpa: null,
      precipitationMm: null,
      isDay: true,
    },
    waterTemperatureC: null,
    ...overrides,
  }
}

const SYNTHETIC_ACTIVITY_PROFILE: ActivitySpeciesProfile = {
  modelKind: 'activity',
  id: 'northern-pike',
  scientificName: 'Testus fishus',
  displayName: 'Test Fish',
  alternateNames: [],
  researchCoverage: 'strong',
  productionReady: true,
  diel: {
    default: {
      'pre-dawn': phaseRule('moderate'),
      dawn: phaseRule('high'),
      day: phaseRule('favorable'),
      dusk: phaseRule('peak'),
      'early-night': phaseRule('moderate'),
      'late-night': phaseRule('low'),
    },
    seasonalOverrides: {
      warm: {
        day: phaseRule('high', { note: 'Warm-season day note.' }),
      },
    },
  },
  contextRules: [
    {
      id: 'context-only-temp-note',
      variable: 'water-temperature',
      mode: 'context-only',
      confidence: 'moderate',
      evidenceIds: ['ev-2'],
      condition: {},
      message: 'Context-only temperature note.',
    },
    {
      id: 'synthetic-score-rule',
      variable: 'water-clarity',
      mode: 'score',
      confidence: 'moderate',
      evidenceIds: ['ev-3'],
      condition: { equals: 'murky' },
      levelDelta: -1,
      message: 'Murky water lowers the score in this synthetic rule.',
    },
    {
      id: 'unreachable-reproductive-rule',
      variable: 'reproductive-state',
      mode: 'context-only',
      confidence: 'limited',
      evidenceIds: ['ev-4'],
      condition: { equals: 'spawning' },
      message: 'Should never fire: no V1 input surface for reproductive-state.',
    },
  ],
  evidenceIds: ['ev-1', 'ev-2', 'ev-3', 'ev-4'],
  cautions: ['This is a synthetic test profile.'],
}

describe('estimateSpeciesActivity', () => {
  it('picks the default diel rule for the current solar phase', () => {
    const point = estimateSpeciesActivity(
      SYNTHETIC_ACTIVITY_PROFILE,
      baseContext({ solarPhase: 'dusk' }),
    )
    expect(point.level).toBe('peak')
    expect(point.confidence).toBe('strong')
  })

  it('prefers a seasonal override over the default when one exists for that phase', () => {
    const point = estimateSpeciesActivity(
      SYNTHETIC_ACTIVITY_PROFILE,
      baseContext({ solarPhase: 'day', seasonBucket: 'warm' }),
    )
    expect(point.level).toBe('high')
    expect(point.reasons[0].message).toBe('Warm-season day note.')
  })

  it('falls back to the default when no seasonal override exists for that season/phase combination', () => {
    const point = estimateSpeciesActivity(
      SYNTHETIC_ACTIVITY_PROFILE,
      baseContext({ solarPhase: 'dusk', seasonBucket: 'warm' }),
    )
    expect(point.level).toBe('peak')
  })

  it('adds a context-only reason without changing the level when water temperature is known', () => {
    const point = estimateSpeciesActivity(
      SYNTHETIC_ACTIVITY_PROFILE,
      baseContext({ solarPhase: 'day', waterTemperatureC: 14 }),
    )
    expect(point.level).toBe('favorable')
    expect(point.reasons.some((r) => r.message === 'Context-only temperature note.')).toBe(true)
  })

  it('does not add the temperature context-only reason when water temperature is unknown', () => {
    const point = estimateSpeciesActivity(
      SYNTHETIC_ACTIVITY_PROFILE,
      baseContext({ waterTemperatureC: null }),
    )
    expect(point.reasons.some((r) => r.message === 'Context-only temperature note.')).toBe(false)
  })

  it('a mode: score rule shifts the level by levelDelta when its condition matches', () => {
    const point = estimateSpeciesActivity(
      SYNTHETIC_ACTIVITY_PROFILE,
      baseContext({ solarPhase: 'day', waterClarity: 'murky' }),
    )
    expect(point.level).toBe('moderate') // favorable - 1
    expect(point.reasons.some((r) => r.kind === 'clarity')).toBe(true)
  })

  it('unsupported/non-matching environmental values do not alter the score', () => {
    const point = estimateSpeciesActivity(
      SYNTHETIC_ACTIVITY_PROFILE,
      baseContext({ solarPhase: 'day', waterClarity: 'clear' }),
    )
    expect(point.level).toBe('favorable')
  })

  it('never fires a rule whose variable has no V1 context input surface (reproductive-state)', () => {
    const point = estimateSpeciesActivity(SYNTHETIC_ACTIVITY_PROFILE, baseContext())
    expect(point.reasons.some((r) => r.kind === 'reproduction')).toBe(false)
  })

  it('maps every activity level to a display score', () => {
    const levels = ['low', 'moderate', 'favorable', 'high', 'peak'] as const
    for (const level of levels) {
      const profile: ActivitySpeciesProfile = {
        ...SYNTHETIC_ACTIVITY_PROFILE,
        diel: { default: { ...SYNTHETIC_ACTIVITY_PROFILE.diel.default, day: phaseRule(level) } },
      }
      const point = estimateSpeciesActivity(profile, baseContext({ solarPhase: 'day' }))
      expect(point.displayScore).toBeGreaterThan(0)
    }
  })
})

const SEA_TROUT_LIKE_PROFILE: AccessibilitySpeciesProfile = {
  modelKind: 'accessibility',
  id: 'brown-trout',
  variantId: 'coastal-sea-trout',
  scientificName: 'Testus troutus',
  displayName: 'Test Trout',
  alternateNames: [],
  researchCoverage: 'moderate',
  productionReady: true,
  rules: [
    {
      id: 'night-favorable',
      variable: 'solar-phase',
      confidence: 'strong',
      evidenceIds: ['ev-1'],
      condition: { phase: 'early-night' },
      accessibility: 'favorable',
      message: 'Shallower at night.',
    },
    {
      id: 'warm-water-reduced',
      variable: 'water-temperature',
      confidence: 'strong',
      evidenceIds: ['ev-2'],
      condition: { min: 17 },
      accessibility: 'reduced',
      message: 'Warm water pushes fish deeper.',
    },
  ],
  evidenceIds: ['ev-1', 'ev-2'],
  cautions: ['Synthetic accessibility profile.'],
}

describe('estimateSpeciesAccessibility', () => {
  it('applies a matching solar-phase rule', () => {
    const point = estimateSpeciesAccessibility(
      SEA_TROUT_LIKE_PROFILE,
      baseContext({ solarPhase: 'early-night' }),
    )
    expect(point.level).toBe('favorable')
  })

  it('falls back to neutral + researchCoverage confidence when no rule matches', () => {
    const point = estimateSpeciesAccessibility(
      SEA_TROUT_LIKE_PROFILE,
      baseContext({ solarPhase: 'dawn' }),
    )
    expect(point.level).toBe('neutral')
    expect(point.confidence).toBe('moderate')
    expect(point.reasons).toEqual([])
  })

  it('does not apply the water-temperature rule when temperature is unknown', () => {
    const point = estimateSpeciesAccessibility(
      SEA_TROUT_LIKE_PROFILE,
      baseContext({ solarPhase: 'early-night', waterTemperatureC: null }),
    )
    expect(point.level).toBe('favorable')
    expect(point.reasons).toHaveLength(1)
  })

  it('lets a "reduced" signal win over a simultaneously-applicable "favorable" signal', () => {
    const point = estimateSpeciesAccessibility(
      SEA_TROUT_LIKE_PROFILE,
      baseContext({ solarPhase: 'early-night', waterTemperatureC: 19 }),
    )
    expect(point.level).toBe('reduced')
    expect(point.reasons).toHaveLength(2)
  })
})
