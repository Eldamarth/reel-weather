/**
 * Transcribed from
 * `.planning/research/batch-2/reel-weather-tench-research-dossier.md`.
 */
import type { ActivitySpeciesProfile, EvidenceRecord } from '../types'

export const TENCH_EVIDENCE: EvidenceRecord[] = [
  {
    id: 'tench-perrow-1996-wild-telemetry',
    citation:
      'Perrow, M.R., Jowitt, A.J.D. & Johnson, S.R. (1996). Factors affecting the habitat selection of tench in a shallow eutrophic lake.',
    year: 1996,
    doi: '10.1111/j.1095-8649.1996.tb01481.x',
    url: 'https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1095-8649.1996.tb01481.x',
    speciesId: 'tench',
    evidenceType: 'movement',
    population: {
      location: 'Shallow eutrophic lake, United Kingdom',
      habitat: 'lake',
      lifeStage: 'adult',
    },
    study: { method: 'Wild radio telemetry with habitat and prey measurements' },
    variables: ['time-of-day', 'habitat', 'prey-availability', 'depth'],
    finding: {
      summary:
        'Tench were generally active only at night while foraging on benthic animal prey, especially chironomid larvae; daytime fish were largely inactive in refuge habitat.',
      direction: 'peak',
    },
    applicability: 'high',
    limitations: [
      'One shallow eutrophic lake.',
      'Movement/foraging is not direct recreational-angling CPUE.',
    ],
  },
  {
    id: 'tench-herrero-2003-circadian-light',
    citation:
      'Herrero, M.J., Madrid, J.A. & Sánchez-Vázquez, F.J. (2003). Entrainment to Light of Circadian Activity Rhythms in Tench (Tinca tinca).',
    year: 2003,
    doi: '10.1081/CBI-120025246',
    url: 'https://www.tandfonline.com/doi/full/10.1081/CBI-120025246',
    speciesId: 'tench',
    evidenceType: 'movement',
    population: {
      location: 'Laboratory, Spain',
      habitat: 'laboratory',
      lifeStage: 'juvenile',
      sizeRange: 'Approximately 20 g',
    },
    study: {
      method: 'Continuous infrared recording under manipulated photoperiod and light intensity',
      sampleSize: '24 tench',
    },
    variables: ['photoperiod', 'light-intensity', 'circadian-rhythm', 'movement'],
    finding: {
      summary:
        'Tench showed a strictly nocturnal activity pattern. Activity remained restricted to dark hours even under very long photoperiods and very dim light, and an endogenous circadian rhythm was detectable in many individuals.',
      direction: 'peak',
    },
    applicability: 'moderate',
    limitations: [
      'Laboratory fish and artificial photoperiods.',
      'Small/juvenile fish rather than adult angling targets.',
    ],
  },
  {
    id: 'tench-herrero-2005-demand-feeding',
    citation:
      'Herrero, M.J., Pascual, M., Madrid, J.A. & Sánchez-Vázquez, F.J. (2005). Demand-feeding rhythms and feeding-entrainment of locomotor activity rhythms in tench (Tinca tinca).',
    year: 2005,
    doi: '10.1016/j.physbeh.2005.02.015',
    url: 'https://pubmed.ncbi.nlm.nih.gov/15811395/',
    speciesId: 'tench',
    evidenceType: 'feeding',
    population: {
      location: 'Indoor and outdoor experimental systems, Spain',
      habitat: 'laboratory',
      lifeStage: 'juvenile',
    },
    study: {
      method:
        'String-activated demand feeding and locomotor monitoring under controlled feeding schedules',
    },
    variables: [
      'time-of-day',
      'self-feeding',
      'feeding-entrainment',
      'photoperiod',
      'locomotor-activity',
    ],
    finding: {
      summary:
        'Tench remained strictly nocturnal under indoor and outdoor conditions and preferred dark-phase self-feeding. Locomotor activity stayed nocturnal even when food was provided during the light phase, supporting a strong endogenous/light-entrained nocturnal rhythm.',
      direction: 'peak',
    },
    applicability: 'moderate',
    limitations: [
      'Experimental fish rather than wild adult angling targets.',
      'Does not directly measure bait/lure catchability.',
    ],
  },
]

export const TENCH_PROFILE: ActivitySpeciesProfile = {
  modelKind: 'activity',
  id: 'tench',
  scientificName: 'Tinca tinca',
  displayName: 'Tench',
  alternateNames: ['Tench'],
  iconKey: 'tench',
  researchCoverage: 'strong',
  productionReady: true,

  diel: {
    default: {
      'pre-dawn': {
        level: 'high',
        confidence: 'strong',
        evidenceIds: [
          'tench-perrow-1996-wild-telemetry',
          'tench-herrero-2003-circadian-light',
          'tench-herrero-2005-demand-feeding',
        ],
      },
      dawn: {
        level: 'moderate',
        confidence: 'strong',
        evidenceIds: [
          'tench-perrow-1996-wild-telemetry',
          'tench-herrero-2003-circadian-light',
          'tench-herrero-2005-demand-feeding',
        ],
        note: 'Opportunity declines as the dark period ends.',
      },
      day: {
        level: 'low',
        confidence: 'strong',
        evidenceIds: [
          'tench-perrow-1996-wild-telemetry',
          'tench-herrero-2003-circadian-light',
          'tench-herrero-2005-demand-feeding',
        ],
      },
      dusk: {
        level: 'high',
        confidence: 'strong',
        evidenceIds: [
          'tench-perrow-1996-wild-telemetry',
          'tench-herrero-2003-circadian-light',
          'tench-herrero-2005-demand-feeding',
        ],
      },
      'early-night': {
        level: 'peak',
        confidence: 'strong',
        evidenceIds: [
          'tench-perrow-1996-wild-telemetry',
          'tench-herrero-2003-circadian-light',
          'tench-herrero-2005-demand-feeding',
        ],
      },
      'late-night': {
        level: 'high',
        confidence: 'strong',
        evidenceIds: [
          'tench-perrow-1996-wild-telemetry',
          'tench-herrero-2003-circadian-light',
          'tench-herrero-2005-demand-feeding',
        ],
      },
    },
  },

  contextRules: [
    {
      id: 'tench-nocturnal-circadian-context',
      variable: 'shortwave-radiation',
      mode: 'context-only',
      confidence: 'strong',
      evidenceIds: ['tench-herrero-2003-circadian-light', 'tench-herrero-2005-demand-feeding'],
      condition: {},
      message:
        'Experimental tench retained a strong nocturnal rhythm even under altered feeding schedules and very dim light. V1 should use solar phase rather than inventing a continuous radiation-response score.',
    },
  ],

  evidenceIds: [
    'tench-perrow-1996-wild-telemetry',
    'tench-herrero-2003-circadian-light',
    'tench-herrero-2005-demand-feeding',
  ],

  cautions: [
    'Direct recreational-angling CPUE literature is sparse in this review.',
    'Two supporting circadian/feeding studies used experimental fish; the wild telemetry study supplies important field corroboration.',
    'Local vegetation/refuge habitat may strongly affect daytime accessibility.',
    'The activity index is relative, not a catch probability.',
  ],
}
