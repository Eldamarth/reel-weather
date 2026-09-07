import type { ModelRegistryEntry } from '../weather/models'

/**
 * Populated from the Phase 1 API spike (.planning/phase1-spike-findings.md).
 * `maxHorizonHours` values marked "measured" come directly from that spike's
 * truncation checks against the live API; values marked "estimate" are
 * published-spec approximations that were NOT directly measured and should be
 * corrected once real field use (plan section 20, Phase 7) says otherwise.
 */
export const MODEL_REGISTRY: ModelRegistryEntry[] = [
  {
    modelId: 'ncep_gfs_seamless',
    name: 'GFS',
    type: 'direct-nwp',
    regions: 'global',
    maxHorizonHours: 384, // measured: reached full 16-day request without truncating
  },
  {
    modelId: 'ncep_hrrr_conus',
    name: 'HRRR',
    type: 'direct-nwp',
    regions: ['conus'],
    maxHorizonHours: 66, // measured
  },
  {
    modelId: 'ncep_nbm_conus',
    name: 'NBM',
    type: 'blend',
    regions: ['conus'],
    maxHorizonHours: 282, // measured
  },
  {
    modelId: 'ecmwf_ifs025',
    name: 'ECMWF IFS',
    type: 'direct-nwp',
    regions: 'global',
    maxHorizonHours: 374, // measured
  },
  {
    modelId: 'dwd_icon_global',
    name: 'ICON Global',
    type: 'direct-nwp',
    regions: 'global',
    maxHorizonHours: 180, // estimate (~7.5 days)
  },
  {
    modelId: 'dwd_icon_eu',
    name: 'ICON EU',
    type: 'direct-nwp',
    regions: ['europe'],
    maxHorizonHours: 120, // estimate (~5 days)
  },
  {
    modelId: 'dwd_icon_d2',
    name: 'ICON D2',
    type: 'direct-nwp',
    regions: ['central-europe'],
    maxHorizonHours: 48, // estimate
  },
  {
    modelId: 'cmc_gem_seamless',
    name: 'GEM',
    type: 'direct-nwp',
    // Confirmed by the spike to return data at Stockholm/Helsinki, not just
    // Canada — "seamless" falls back to the global GDPS outside Canada.
    regions: 'global',
    maxHorizonHours: 240, // estimate (~10 days)
  },
  {
    modelId: 'cmc_gem_gdps',
    name: 'GEM GDPS',
    type: 'direct-nwp',
    regions: 'global',
    maxHorizonHours: 240, // estimate
  },
  {
    modelId: 'cmc_gem_hrdps',
    name: 'GEM HRDPS',
    type: 'direct-nwp',
    // Confirmed to reject Boulder; a real Canadian point wasn't tested in the
    // spike, so "canada" coverage itself is inferred from the name/rejection,
    // not directly confirmed positive.
    regions: ['canada'],
    maxHorizonHours: 48, // estimate
  },
  {
    modelId: 'metno_nordic',
    name: 'MET Norway Nordic',
    type: 'direct-nwp',
    regions: ['nordic'],
    maxHorizonHours: 67, // measured
  },
]
