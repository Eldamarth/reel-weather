/**
 * Transcribed from
 * `.planning/research/revised/reel-weather-zander-research-dossier-v2.md`.
 */
import type { ActivitySpeciesProfile, EvidenceRecord } from '../types'

export const ZANDER_EVIDENCE: EvidenceRecord[] = [
  {
    id: 'zander-jepsen-1999-denmark',
    citation:
      'Jepsen, N., Koed, A. & Økland, F. (1999). The movements of pikeperch in a shallow reservoir.',
    year: 1999,
    doi: '10.1111/j.1095-8649.1999.tb00859.x',
    url: 'https://orbit.dtu.dk/en/publications/the-movements-of-pikeperch-in-a-shallow-reservoir/',
    speciesId: 'zander',
    evidenceType: 'movement',
    population: {
      location: 'Bygholm Reservoir, Denmark',
      habitat: 'reservoir',
      lifeStage: 'adult',
      sizeRange: 'Females 62-74 cm; males 55-64 cm',
    },
    study: {
      method: 'Radio telemetry',
      sampleSize: '12 females and 8 males',
      duration: 'Tagged in early March 1997; seasonal and diel tracking',
      seasonsCovered: ['spring', 'summer', 'fall', 'winter'],
    },
    variables: ['time-of-day', 'season', 'water-temperature', 'sex', 'reproduction'],
    finding: {
      summary:
        'Movement peaked in summer but continued in winter. Activity was highest in the evening period (18:00-24:00 in the study system). Female movement correlated positively with water temperature. Males became stationary for 14-47 days during April-May nest guarding.',
    },
    applicability: 'high',
    limitations: [
      'One shallow turbid reservoir.',
      'Clock time must be translated to solar phase, not hardcoded.',
      'Movement is not direct angling catchability.',
    ],
  },
  {
    id: 'zander-horky-2008-elbe',
    citation:
      'Horký, P., Slavík, O. & Bartoš, L. (2008). A telemetry study on the diurnal distribution and activity of adult pikeperch, Sander lucioperca (L.), in a riverine environment.',
    year: 2008,
    doi: '10.1007/s10750-008-9503-0',
    url: 'https://link.springer.com/article/10.1007/s10750-008-9503-0',
    speciesId: 'zander',
    evidenceType: 'movement',
    population: { location: 'Elbe River, Czech Republic', habitat: 'river', lifeStage: 'adult' },
    study: {
      method: 'Radio telemetry',
      duration: '12 months',
      seasonsCovered: ['spring', 'summer', 'fall', 'winter'],
    },
    variables: ['solar-phase', 'depth', 'distance-from-bank', 'movement'],
    finding: {
      summary:
        'Fish occupied deeper main-channel habitat by day, moved shallower during twilight, and were closest to the bank at night. Movement activity was maximal at twilight and minimal at night.',
    },
    applicability: 'high',
    limitations: [
      'Riverine population.',
      'The authors cautioned that shallow nighttime positions may represent resting rather than peak hunting.',
    ],
  },
  {
    id: 'zander-aarts-2017-netherlands',
    citation:
      'Aarts, T.W.P.M. & Breukelaar, A.W. (2017). Migration patterns and home range of pike-perch (Sander lucioperca, Linnaeus, 1758) in Dutch river systems.',
    year: 2017,
    doi: '10.1111/jai.13390',
    url: 'https://doi.org/10.1111/jai.13390',
    speciesId: 'zander',
    evidenceType: 'movement',
    population: { location: 'Large Dutch river systems', habitat: 'river', lifeStage: 'adult' },
    study: {
      method: 'Telemetry / large-river movement tracking',
      sampleSize: '286 tagged pikeperch',
      duration: 'June 2007-April 2010',
    },
    variables: ['time-of-day', 'home-range', 'migration'],
    finding: {
      summary:
        'Some fish made very long movements and swimming activity was highest during darkness; no simple universal seasonal migration pattern emerged.',
    },
    applicability: 'moderate',
    limitations: [
      'Large-river movement detections are coarser than high-resolution positioning.',
      'Movement is not direct feeding/catchability.',
    ],
  },
  {
    id: 'zander-riha-2026-nocturnal-foraging',
    citation:
      'Říha, M. et al. (2026). Daily nocturnal homing reveals goal-directed navigation in a wild teleost.',
    year: 2026,
    doi: '10.1016/j.isci.2026.116364',
    url: 'https://www.sciencedirect.com/science/article/pii/S2589004226017396',
    speciesId: 'zander',
    evidenceType: 'feeding',
    population: {
      location: 'Large freshwater reservoir, Europe',
      habitat: 'reservoir',
      lifeStage: 'adult',
    },
    study: { method: 'High-resolution acoustic telemetry' },
    variables: ['night', 'foraging-excursion', 'homing', 'refuge-use'],
    finding: {
      summary:
        'Adults repeatedly left stable daytime refuge areas for multi-kilometer nocturnal foraging excursions lasting several hours and reliably returned to the same refuge.',
    },
    applicability: 'high',
    limitations: [
      'Foraging inference is based on movement ecology rather than direct angling outcomes.',
      'One reservoir system.',
    ],
  },
  {
    id: 'zander-britton-2024-severn',
    citation:
      'Britton et al. (2024). Movements and habitat use of native and invasive piscivorous fishes in a temperate and channelized lowland river.',
    year: 2024,
    doi: '10.1007/s10750-024-05533-2',
    url: 'https://eprints.bournemouth.ac.uk/39754/',
    speciesId: 'zander',
    evidenceType: 'movement',
    population: { location: 'Lower River Severn, England', habitat: 'river', lifeStage: 'adult' },
    study: {
      method: '12-month acoustic telemetry',
      seasonsCovered: ['spring', 'summer', 'fall', 'winter'],
    },
    variables: ['season', 'water-temperature', 'movement'],
    finding: {
      summary:
        'Pikeperch movement varied with season and temperature; movement frequency increased with water temperature up to roughly 15°C and declined above that range in this river system.',
    },
    applicability: 'moderate',
    limitations: [
      'River-specific movement relationship.',
      'Does not establish a 15°C bite optimum.',
    ],
  },
  {
    id: 'zander-night-prey-selection-2014',
    citation:
      'Piscivore-prey fish interactions: mechanisms behind diurnal patterns in prey selectivity in brown and clear water (2014).',
    year: 2014,
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4224368/',
    speciesId: 'zander',
    evidenceType: 'feeding',
    population: {
      location: 'Field lakes plus controlled laboratory optical treatments',
      habitat: 'multiple',
      lifeStage: 'mixed',
    },
    study: { method: 'Field prey-selectivity analysis plus laboratory foraging observations' },
    variables: ['day-night', 'water-color', 'prey-selection', 'foraging'],
    finding: {
      summary:
        'Pikeperch prey selection changed between day and night and depended on optical conditions, supporting genuine light-dependent foraging ecology rather than a simple static nocturnal label.',
    },
    applicability: 'moderate',
    limitations: [
      'Focus is prey choice and foraging mechanism, not angling CPUE.',
      'Does not define a universal hourly peak.',
    ],
  },
]

export const ZANDER_PROFILE: ActivitySpeciesProfile = {
  modelKind: 'activity',
  id: 'zander',

  scientificName: 'Sander lucioperca',
  displayName: 'Zander',
  alternateNames: ['Pikeperch', 'Pike-perch', 'Sandart'],
  iconKey: 'zander',

  researchCoverage: 'strong',
  productionReady: true,

  diel: {
    default: {
      'pre-dawn': {
        level: 'favorable',
        confidence: 'moderate',
        evidenceIds: ['zander-aarts-2017-netherlands', 'zander-riha-2026-nocturnal-foraging'],
      },
      dawn: {
        level: 'high',
        confidence: 'moderate',
        evidenceIds: ['zander-horky-2008-elbe', 'zander-night-prey-selection-2014'],
      },
      day: {
        level: 'moderate',
        confidence: 'strong',
        evidenceIds: ['zander-horky-2008-elbe', 'zander-jepsen-1999-denmark'],
        note: 'Daytime opportunity is not zero; fish often occupy deeper/refuge habitat and individual populations vary.',
      },
      dusk: {
        level: 'peak',
        confidence: 'strong',
        evidenceIds: [
          'zander-jepsen-1999-denmark',
          'zander-horky-2008-elbe',
          'zander-night-prey-selection-2014',
        ],
      },
      'early-night': {
        level: 'high',
        confidence: 'strong',
        evidenceIds: [
          'zander-jepsen-1999-denmark',
          'zander-aarts-2017-netherlands',
          'zander-riha-2026-nocturnal-foraging',
        ],
      },
      'late-night': {
        level: 'favorable',
        confidence: 'moderate',
        evidenceIds: [
          'zander-aarts-2017-netherlands',
          'zander-riha-2026-nocturnal-foraging',
          'zander-horky-2008-elbe',
        ],
        note: 'Some systems show substantial nocturnal foraging, while the Elbe study found minimum movement later at night. Keep this below the twilight/early-night peak.',
      },
    },
  },

  contextRules: [
    {
      id: 'zander-temperature-movement-context',
      variable: 'water-temperature',
      mode: 'context-only',
      confidence: 'moderate',
      evidenceIds: ['zander-jepsen-1999-denmark', 'zander-britton-2024-severn'],
      condition: {},
      message:
        'Zander movement changes seasonally and with water temperature, but available movement studies do not justify a universal bite-temperature optimum.',
    },
    {
      id: 'zander-male-nest-guarding',
      variable: 'reproductive-state',
      mode: 'context-only',
      confidence: 'strong',
      evidenceIds: ['zander-jepsen-1999-denmark'],
      condition: { equals: 'spawning-context' },
      message:
        'During spawning, male zander may become highly stationary while guarding nests for extended periods; this movement change should not automatically be treated as improved or reduced lure catchability.',
    },
  ],

  evidenceIds: [
    'zander-jepsen-1999-denmark',
    'zander-horky-2008-elbe',
    'zander-aarts-2017-netherlands',
    'zander-riha-2026-nocturnal-foraging',
    'zander-britton-2024-severn',
    'zander-night-prey-selection-2014',
  ],

  cautions: [
    'Twilight is the most consistent peak, but later-night behavior varies by habitat and population.',
    'Movement, foraging and angling vulnerability are not identical.',
    'Do not hardcode Danish study clock times; use local solar phase.',
    'Water temperature must not be inferred directly from air temperature.',
    'The activity index is relative and is not a probability of capture.',
  ],
}
