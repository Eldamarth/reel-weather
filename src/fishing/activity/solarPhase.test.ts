import { describe, expect, it } from 'vitest'
import { resolveSolarPhase } from './solarPhase'
import type { DailySunTimes } from '../../weather/models'

const TEMPERATE_DAILY: DailySunTimes[] = [
  { date: '2026-09-25', sunrise: '2026-09-25T06:30', sunset: '2026-09-25T19:15' },
  { date: '2026-09-26', sunrise: '2026-09-26T06:32', sunset: '2026-09-26T19:12' },
  { date: '2026-09-27', sunrise: '2026-09-27T06:34', sunset: '2026-09-27T19:09' },
]

describe('resolveSolarPhase (temperate day)', () => {
  it('classifies dawn within the 45-minute window around sunrise', () => {
    expect(resolveSolarPhase('2026-09-26T05:47', TEMPERATE_DAILY)).toBe('dawn')
    expect(resolveSolarPhase('2026-09-26T06:32', TEMPERATE_DAILY)).toBe('dawn')
    expect(resolveSolarPhase('2026-09-26T07:17', TEMPERATE_DAILY)).toBe('dawn')
  })

  it('classifies day between the dawn and dusk windows', () => {
    expect(resolveSolarPhase('2026-09-26T07:18', TEMPERATE_DAILY)).toBe('day')
    expect(resolveSolarPhase('2026-09-26T12:00', TEMPERATE_DAILY)).toBe('day')
    expect(resolveSolarPhase('2026-09-26T18:26', TEMPERATE_DAILY)).toBe('day')
  })

  it('classifies dusk within the 45-minute window around sunset', () => {
    expect(resolveSolarPhase('2026-09-26T18:27', TEMPERATE_DAILY)).toBe('dusk')
    expect(resolveSolarPhase('2026-09-26T19:12', TEMPERATE_DAILY)).toBe('dusk')
    expect(resolveSolarPhase('2026-09-26T19:57', TEMPERATE_DAILY)).toBe('dusk')
  })

  it('classifies early-night for the first three hours after the dusk window', () => {
    expect(resolveSolarPhase('2026-09-26T19:58', TEMPERATE_DAILY)).toBe('early-night')
    expect(resolveSolarPhase('2026-09-26T22:57', TEMPERATE_DAILY)).toBe('early-night')
  })

  it('classifies late-night in the remaining dark interval', () => {
    expect(resolveSolarPhase('2026-09-26T23:00', TEMPERATE_DAILY)).toBe('late-night')
    expect(resolveSolarPhase('2026-09-27T02:00', TEMPERATE_DAILY)).toBe('late-night')
  })

  it('classifies pre-dawn in the three hours before the dawn window', () => {
    // Tomorrow's (09-27) dawn window starts at 06:34 - 45min = 05:49; pre-dawn starts 3h earlier.
    expect(resolveSolarPhase('2026-09-27T02:49', TEMPERATE_DAILY)).toBe('pre-dawn')
    expect(resolveSolarPhase('2026-09-27T05:48', TEMPERATE_DAILY)).toBe('pre-dawn')
  })

  it('is consistent about which "night" a late-evening/early-morning timestamp belongs to', () => {
    // Just after today's dusk window and just before tomorrow's dawn window
    // should be classified using the correct neighboring day's data, not the
    // wrong one.
    expect(resolveSolarPhase('2026-09-26T20:00', TEMPERATE_DAILY)).toBe('early-night')
    expect(resolveSolarPhase('2026-09-27T01:00', TEMPERATE_DAILY)).toBe('late-night')
  })
})

describe('resolveSolarPhase (high-latitude short summer night)', () => {
  // A Stockholm-in-June-like case: sunrise ~03:30, sunset ~22:00. The dark
  // interval is short enough that early-night and pre-dawn windows may
  // compress or overlap — the function must still return exactly one phase
  // per timestamp without throwing or inverting.
  const SHORT_NIGHT_DAILY: DailySunTimes[] = [
    { date: '2026-06-20', sunrise: '2026-06-20T03:31', sunset: '2026-06-20T22:02' },
    { date: '2026-06-21', sunrise: '2026-06-21T03:31', sunset: '2026-06-21T22:03' },
    { date: '2026-06-22', sunrise: '2026-06-22T03:32', sunset: '2026-06-22T22:03' },
  ]

  it('never throws and always returns a valid phase across a full day at short-night latitudes', () => {
    const validPhases = ['pre-dawn', 'dawn', 'day', 'dusk', 'early-night', 'late-night']
    for (let hour = 0; hour < 24; hour++) {
      for (const minute of [0, 30]) {
        const hh = String(hour).padStart(2, '0')
        const mm = String(minute).padStart(2, '0')
        const timestamp = `2026-06-21T${hh}:${mm}`
        expect(() => resolveSolarPhase(timestamp, SHORT_NIGHT_DAILY)).not.toThrow()
        expect(validPhases).toContain(resolveSolarPhase(timestamp, SHORT_NIGHT_DAILY))
      }
    }
  })

  it('still identifies midday as day and dusk/dawn windows around real sunrise/sunset', () => {
    expect(resolveSolarPhase('2026-06-21T13:00', SHORT_NIGHT_DAILY)).toBe('day')
    expect(resolveSolarPhase('2026-06-21T03:31', SHORT_NIGHT_DAILY)).toBe('dawn')
    expect(resolveSolarPhase('2026-06-21T22:03', SHORT_NIGHT_DAILY)).toBe('dusk')
  })
})

describe('resolveSolarPhase (missing data fallback)', () => {
  it('falls back to day/night from isDayFallback when no daily entry matches, rather than throwing', () => {
    expect(resolveSolarPhase('2026-09-26T12:00', [], true)).toBe('day')
    expect(resolveSolarPhase('2026-09-26T12:00', [], false)).toBe('late-night')
    expect(resolveSolarPhase('2026-09-26T12:00', [], null)).toBe('day')
  })
})
