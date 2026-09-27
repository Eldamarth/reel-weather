import { describe, expect, it } from 'vitest'
import { indexEvidence, resolveEvidence } from './evidence'
import type { EvidenceRecord } from './types'

const SAMPLE: EvidenceRecord = {
  id: 'sample-study-2020',
  citation: 'Someone (2020). A study.',
  year: 2020,
  url: 'https://example.com',
  speciesId: 'northern-pike',
  evidenceType: 'movement',
  population: { location: 'Somewhere', habitat: 'lake' },
  study: { method: 'Telemetry' },
  variables: ['time-of-day'],
  finding: { summary: 'Fish moved.' },
  applicability: 'high',
  limitations: [],
}

describe('indexEvidence / resolveEvidence', () => {
  it('indexes records by id', () => {
    const index = indexEvidence([SAMPLE])
    expect(index['sample-study-2020']).toBe(SAMPLE)
  })

  it('resolves a list of ids to their records in order', () => {
    const index = indexEvidence([SAMPLE])
    expect(resolveEvidence(['sample-study-2020'], index)).toEqual([SAMPLE])
  })

  it('throws on an unresolved evidence id, rather than silently dropping it', () => {
    const index = indexEvidence([SAMPLE])
    expect(() => resolveEvidence(['sample-study-2020', 'missing-id'], index)).toThrow(/missing-id/)
  })
})
