import { indexEvidence, type EvidenceIndex } from './evidence'
import { BLACK_CRAPPIE_EVIDENCE, BLACK_CRAPPIE_PROFILE } from './profiles/blackCrappie'
import { BURBOT_EVIDENCE, BURBOT_PROFILE } from './profiles/burbot'
import { CHANNEL_CATFISH_EVIDENCE, CHANNEL_CATFISH_PROFILE } from './profiles/channelCatfish'
import { COMMON_CARP_EVIDENCE, COMMON_CARP_PROFILE } from './profiles/commonCarp'
import { EUROPEAN_PERCH_EVIDENCE, EUROPEAN_PERCH_PROFILE } from './profiles/europeanPerch'
import { LARGEMOUTH_BASS_EVIDENCE, LARGEMOUTH_BASS_PROFILE } from './profiles/largemouthBass'
import { MUSKELLUNGE_EVIDENCE, MUSKELLUNGE_PROFILE } from './profiles/muskellunge'
import { NORTHERN_PIKE_EVIDENCE, NORTHERN_PIKE_PROFILE } from './profiles/northernPike'
import { SEA_TROUT_COASTAL_EVIDENCE, SEA_TROUT_COASTAL_PROFILE } from './profiles/seaTroutCoastal'
import { SMALLMOUTH_BASS_EVIDENCE, SMALLMOUTH_BASS_PROFILE } from './profiles/smallmouthBass'
import { TENCH_EVIDENCE, TENCH_PROFILE } from './profiles/tench'
import { YELLOW_PERCH_EVIDENCE, YELLOW_PERCH_PROFILE } from './profiles/yellowPerch'
import { ZANDER_EVIDENCE, ZANDER_PROFILE } from './profiles/zander'
import type { SpeciesCatalogEntry, SpeciesProfile } from './types'

/**
 * Every researched profile, production-ready or not. Batch 1 in the design
 * brief's implementation order (section 23), batch 2 appended in its own
 * overview doc's recommended order (Burbot -> Tench -> Muskellunge -> Common
 * Carp), batch 3 appended in its overview doc's order (Smallmouth Bass ->
 * Largemouth Bass -> Yellow Perch -> Black Crappie -> Channel Catfish).
 *
 * Channel Catfish is intentionally included here with `productionReady:
 * false` (`reel-weather-fish-activity-batch-3-schema-patch.md`: the adult
 * wild-telemetry evidence is currently a master's thesis, not yet
 * peer-reviewed) — it still participates in evidence-id resolution and
 * profile-integrity tests, exactly as researched-but-not-yet-shown species
 * should, but `SPECIES_CATALOG` below filters it out of what users can
 * browse/select. Promoting it later should only require flipping
 * `productionReady` to `true` in its profile file, no UI change.
 */
export const SPECIES_PROFILES: SpeciesProfile[] = [
  NORTHERN_PIKE_PROFILE,
  ZANDER_PROFILE,
  EUROPEAN_PERCH_PROFILE,
  SEA_TROUT_COASTAL_PROFILE,
  BURBOT_PROFILE,
  TENCH_PROFILE,
  MUSKELLUNGE_PROFILE,
  COMMON_CARP_PROFILE,
  SMALLMOUTH_BASS_PROFILE,
  LARGEMOUTH_BASS_PROFILE,
  YELLOW_PERCH_PROFILE,
  BLACK_CRAPPIE_PROFILE,
  CHANNEL_CATFISH_PROFILE,
]

export const EVIDENCE_INDEX: EvidenceIndex = indexEvidence([
  ...NORTHERN_PIKE_EVIDENCE,
  ...ZANDER_EVIDENCE,
  ...EUROPEAN_PERCH_EVIDENCE,
  ...SEA_TROUT_COASTAL_EVIDENCE,
  ...BURBOT_EVIDENCE,
  ...TENCH_EVIDENCE,
  ...MUSKELLUNGE_EVIDENCE,
  ...COMMON_CARP_EVIDENCE,
  ...SMALLMOUTH_BASS_EVIDENCE,
  ...LARGEMOUTH_BASS_EVIDENCE,
  ...YELLOW_PERCH_EVIDENCE,
  ...BLACK_CRAPPIE_EVIDENCE,
  ...CHANNEL_CATFISH_EVIDENCE,
])

/**
 * The user-facing catalog: `productionReady` is the explicit gate (data
 * contract section 14) between "researched" and "browsable." A profile with
 * `productionReady: false` (currently only Channel Catfish) is fully coded
 * and evidence-checked but never reaches this list, so it can't be found via
 * `SpeciesCatalog`'s search/tiles either — `searchCatalog` filters this array,
 * not `SPECIES_PROFILES`.
 */
export const SPECIES_CATALOG: SpeciesCatalogEntry[] = SPECIES_PROFILES.filter(
  (profile) => profile.productionReady,
).map((profile) => ({
  speciesId: profile.id,
  variantId: profile.variantId,
  displayName: profile.displayName,
  scientificName: profile.scientificName,
  alternateNames: profile.alternateNames,
  iconKey: profile.iconKey,
  modelKind: profile.modelKind,
  productionReady: profile.productionReady,
}))

/** Stable per-entry key: species catalog is not required to key by id alone, since Sea Trout shares `brown-trout` with a future freshwater variant. */
export function catalogEntryKey(
  entry: Pick<SpeciesCatalogEntry, 'speciesId' | 'variantId'>,
): string {
  return `${entry.speciesId}:${entry.variantId ?? 'default'}`
}

export function findProfile(
  speciesId: string,
  variantId: string | undefined,
): SpeciesProfile | undefined {
  return SPECIES_PROFILES.find((p) => p.id === speciesId && p.variantId === variantId)
}

/** Design brief section 5: case-insensitive match against display name, scientific name, or any alternate name. */
export function searchCatalog(
  query: string,
  catalog: SpeciesCatalogEntry[] = SPECIES_CATALOG,
): SpeciesCatalogEntry[] {
  const q = query.trim().toLowerCase()
  if (!q) return catalog

  return catalog.filter(
    (entry) =>
      entry.displayName.toLowerCase().includes(q) ||
      entry.scientificName.toLowerCase().includes(q) ||
      entry.alternateNames.some((name) => name.toLowerCase().includes(q)),
  )
}
