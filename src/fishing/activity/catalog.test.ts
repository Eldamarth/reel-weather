import { describe, expect, it } from 'vitest'
import {
  catalogEntryKey,
  EVIDENCE_INDEX,
  findProfile,
  searchCatalog,
  SPECIES_CATALOG,
  SPECIES_PROFILES,
} from './catalog'
import { resolveEvidence } from './evidence'

describe('SPECIES_CATALOG', () => {
  it('contains all twelve production-ready species (batches 1-3), excluding the research-only Channel Catfish', () => {
    expect(SPECIES_CATALOG).toHaveLength(12)
    expect(SPECIES_CATALOG.every((entry) => entry.productionReady)).toBe(true)
    expect(SPECIES_CATALOG.some((entry) => entry.speciesId === 'channel-catfish')).toBe(false)
  })

  it('gives every catalog entry a unique key', () => {
    const keys = SPECIES_CATALOG.map(catalogEntryKey)
    expect(new Set(keys).size).toBe(keys.length)
  })
})

describe('searchCatalog', () => {
  it('matches an alternate name (design brief section 5 examples)', () => {
    expect(searchCatalog('pikeperch').map((e) => e.displayName)).toEqual(['Zander'])
    expect(searchCatalog('sandart').map((e) => e.displayName)).toEqual(['Zander'])
    expect(searchCatalog('aborre').map((e) => e.displayName)).toEqual(['European Perch'])
  })

  it('matches case-insensitively against the scientific name', () => {
    expect(searchCatalog('esox LUCIUS').map((e) => e.displayName)).toEqual(['Northern Pike'])
  })

  it('matches batch-2 alternate names', () => {
    expect(searchCatalog('musky').map((e) => e.displayName)).toEqual(['Muskellunge'])
    expect(searchCatalog('eelpout').map((e) => e.displayName)).toEqual(['Burbot'])
  })

  it('matches batch-3 alternate names', () => {
    expect(searchCatalog('bronzeback').map((e) => e.displayName)).toEqual(['Smallmouth Bass'])
    expect(searchCatalog('speckled perch').map((e) => e.displayName)).toEqual(['Black Crappie'])
  })

  it('never surfaces the research-only Channel Catfish, even by its exact alternate names', () => {
    expect(searchCatalog('channel cat')).toEqual([])
    expect(searchCatalog('catfish')).toEqual([])
    expect(searchCatalog('ictalurus punctatus')).toEqual([])
  })

  it('returns the full catalog for an empty/whitespace query', () => {
    expect(searchCatalog('')).toEqual(SPECIES_CATALOG)
    expect(searchCatalog('   ')).toEqual(SPECIES_CATALOG)
  })

  it('returns nothing for a query that matches no species', () => {
    expect(searchCatalog('nonexistent-fish-xyz')).toEqual([])
  })
})

describe('findProfile', () => {
  it('finds Northern Pike by id with no variant', () => {
    expect(findProfile('northern-pike', undefined)?.displayName).toBe('Northern Pike')
  })

  it('finds Sea Trout by id + variant', () => {
    expect(findProfile('brown-trout', 'coastal-sea-trout')?.displayName).toBe('Sea Trout — Coastal')
  })

  it('finds a batch-2 species (Tench) by id with no variant', () => {
    expect(findProfile('tench', undefined)?.displayName).toBe('Tench')
  })

  it('returns undefined for an unknown species', () => {
    expect(findProfile('unknown-species', undefined)).toBeUndefined()
  })
})

describe('evidence-reference integrity (data contract section 14/22)', () => {
  it('resolves every top-level evidenceIds entry for every profile', () => {
    for (const profile of SPECIES_PROFILES) {
      expect(() => resolveEvidence(profile.evidenceIds, EVIDENCE_INDEX)).not.toThrow()
    }
  })

  it('resolves every evidenceId cited by every activity profile phase/context rule', () => {
    for (const profile of SPECIES_PROFILES) {
      if (profile.modelKind !== 'activity') continue

      for (const phaseRule of Object.values(profile.diel.default)) {
        expect(() => resolveEvidence(phaseRule.evidenceIds, EVIDENCE_INDEX)).not.toThrow()
        expect(phaseRule.evidenceIds.length).toBeGreaterThan(0)
      }

      for (const seasonOverrides of Object.values(profile.diel.seasonalOverrides ?? {})) {
        for (const phaseRule of Object.values(seasonOverrides ?? {})) {
          expect(() => resolveEvidence(phaseRule.evidenceIds, EVIDENCE_INDEX)).not.toThrow()
        }
      }

      for (const rule of profile.contextRules) {
        expect(() => resolveEvidence(rule.evidenceIds, EVIDENCE_INDEX)).not.toThrow()
        expect(rule.evidenceIds.length).toBeGreaterThan(0)
      }
    }
  })

  it('resolves every evidenceId cited by every accessibility profile rule', () => {
    for (const profile of SPECIES_PROFILES) {
      if (profile.modelKind !== 'accessibility') continue
      for (const rule of profile.rules) {
        expect(() => resolveEvidence(rule.evidenceIds, EVIDENCE_INDEX)).not.toThrow()
        expect(rule.evidenceIds.length).toBeGreaterThan(0)
      }
    }
  })

  it('never lets a context/accessibility rule with mode "score" go without evidence (data contract principle 4)', () => {
    for (const profile of SPECIES_PROFILES) {
      if (profile.modelKind !== 'activity') continue
      for (const rule of profile.contextRules) {
        if (rule.mode === 'score') {
          expect(rule.evidenceIds.length).toBeGreaterThan(0)
        }
      }
    }
  })

  it('gives every production profile a non-empty cautions list', () => {
    for (const profile of SPECIES_PROFILES) {
      expect(profile.cautions.length).toBeGreaterThan(0)
    }
  })
})
