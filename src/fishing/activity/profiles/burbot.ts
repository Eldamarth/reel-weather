/**
 * Transcribed from
 * `.planning/research/batch-2/reel-weather-burbot-research-dossier.md`.
 */
import type { ActivitySpeciesProfile, EvidenceRecord } from '../types'

export const BURBOT_EVIDENCE: EvidenceRecord[] = [
  {
    id: 'burbot-carl-1995-opeongo',
    citation: 'Carl, L.M. (1995). Sonic Tracking of Burbot in Lake Opeongo, Ontario.',
    year: 1995,
    doi: '10.1577/1548-8659(1995)124<0077:STOBIL>2.3.CO;2',
    url: 'https://academic.oup.com/tafs/article-abstract/124/1/77/7892944',
    speciesId: 'burbot',
    evidenceType: 'movement',
    population: {
      location: 'Lake Opeongo, Ontario, Canada',
      habitat: 'lake',
      lifeStage: 'adult',
      sizeRange: '55-67 cm total length',
    },
    study: {
      method: 'Seasonal sonic telemetry',
      sampleSize: '7 adult burbot',
      duration: 'Monitored during 1989 and 1991',
    },
    variables: ['time-of-day', 'season', 'depth', 'water-temperature'],
    finding: {
      summary:
        'Burbot were inactive during daylight, began moving near dusk, and moved throughout each night until dawn. Summer fish moved more slowly and occupied deeper water than in spring; swimming speed appeared to rise in fall.',
      direction: 'peak',
    },
    applicability: 'high',
    limitations: [
      'Small sample size.',
      'One lake.',
      'Movement is not direct angling catchability.',
    ],
  },
  {
    id: 'burbot-harrison-2016-thermal-migration',
    citation:
      'Harrison, P.M. et al. (2016). Temporal plasticity in thermal-habitat selection of burbot Lota lota, a diel-migrating winter-specialist.',
    year: 2016,
    doi: '10.1111/jfb.12990',
    url: 'https://pubmed.ncbi.nlm.nih.gov/27125426/',
    speciesId: 'burbot',
    evidenceType: 'thermal-occupancy',
    population: {
      location: 'Dimictic reservoir, Canada',
      habitat: 'reservoir',
      lifeStage: 'adult',
    },
    study: {
      method: 'Animal-borne telemetry with temperature sensors plus habitat-temperature monitoring',
      duration: 'Year-round',
      seasonsCovered: ['spring', 'summer', 'fall', 'winter'],
    },
    variables: [
      'time-of-day',
      'season',
      'water-temperature',
      'thermal-habitat-selection',
      'reproduction',
    ],
    finding: {
      summary:
        'Burbot showed nightly behavioral thermoregulation throughout the year. Thermal selection shifted from very cold (<2°C) reproductive habitat during spawning to warmer 12-14°C nighttime habitat associated with hunting/feeding outside the reproductive period.',
      direction: 'mixed',
    },
    applicability: 'high',
    limitations: [
      'Thermal habitat selection is not a universal bite-temperature rule.',
      'Reservoir habitat availability shaped choices.',
    ],
  },
  {
    id: 'burbot-maine-night-cpue',
    citation: 'Maine Department of Inland Fisheries and Wildlife. Burbot Management Plan.',
    year: 2001,
    url: 'https://www1.maine.gov/IFW/docs/strategic-management-plans/burbot.pdf',
    speciesId: 'burbot',
    evidenceType: 'angling-cpue',
    population: { location: 'Moosehead Lake, Maine, USA', habitat: 'lake', lifeStage: 'mixed' },
    study: { method: 'State creel-survey synthesis' },
    variables: ['day-night', 'angling-catch-rate', 'winter'],
    finding: {
      summary:
        'The management-plan synthesis reports substantially higher burbot catch rates at night than during daytime at Moosehead Lake (about 1.60 versus 0.08 burbot per angler in the cited surveys), consistent with nocturnal feeding behavior.',
      direction: 'increase',
    },
    applicability: 'moderate',
    limitations: [
      'Government management synthesis rather than peer-reviewed experiment.',
      'One fishery.',
      'Night/day anglers may differ in methods and targeting intensity.',
    ],
  },
]

export const BURBOT_PROFILE: ActivitySpeciesProfile = {
  modelKind: 'activity',
  id: 'burbot',
  scientificName: 'Lota lota',
  displayName: 'Burbot',
  alternateNames: ['Eelpout', 'Freshwater Ling', 'Freshwater Cod'],
  iconKey: 'burbot',
  researchCoverage: 'strong',
  productionReady: true,

  diel: {
    default: {
      'pre-dawn': {
        level: 'high',
        confidence: 'strong',
        evidenceIds: ['burbot-carl-1995-opeongo', 'burbot-harrison-2016-thermal-migration'],
      },
      dawn: {
        level: 'favorable',
        confidence: 'strong',
        evidenceIds: ['burbot-carl-1995-opeongo', 'burbot-harrison-2016-thermal-migration'],
        note: 'The nocturnal movement period declines around dawn.',
      },
      day: {
        level: 'low',
        confidence: 'strong',
        evidenceIds: [
          'burbot-carl-1995-opeongo',
          'burbot-harrison-2016-thermal-migration',
          'burbot-maine-night-cpue',
        ],
      },
      dusk: {
        level: 'high',
        confidence: 'strong',
        evidenceIds: ['burbot-carl-1995-opeongo', 'burbot-harrison-2016-thermal-migration'],
        note: 'Field telemetry describes movement beginning near dusk.',
      },
      'early-night': {
        level: 'peak',
        confidence: 'strong',
        evidenceIds: [
          'burbot-carl-1995-opeongo',
          'burbot-harrison-2016-thermal-migration',
          'burbot-maine-night-cpue',
        ],
      },
      'late-night': {
        level: 'high',
        confidence: 'strong',
        evidenceIds: [
          'burbot-carl-1995-opeongo',
          'burbot-harrison-2016-thermal-migration',
          'burbot-maine-night-cpue',
        ],
      },
    },
  },

  contextRules: [
    {
      id: 'burbot-seasonal-thermal-context',
      variable: 'water-temperature',
      mode: 'context-only',
      confidence: 'strong',
      evidenceIds: ['burbot-harrison-2016-thermal-migration'],
      condition: {},
      message:
        'Burbot use temperature differently through the year: nighttime habitat shifts from very cold spawning conditions to warmer feeding/hunting habitat outside the reproductive period. Do not interpret one temperature as a universal bite optimum.',
    },
    {
      id: 'burbot-summer-depth-context',
      variable: 'habitat',
      mode: 'context-only',
      confidence: 'moderate',
      evidenceIds: ['burbot-carl-1995-opeongo'],
      condition: {},
      message:
        'In Lake Opeongo, summer burbot moved more slowly and occupied deeper water than in spring even though nocturnal activity continued.',
    },
  ],

  evidenceIds: [
    'burbot-carl-1995-opeongo',
    'burbot-harrison-2016-thermal-migration',
    'burbot-maine-night-cpue',
  ],

  cautions: [
    'The cleanest diel movement study tracked only seven adults, though independent thermal telemetry corroborates nocturnal migration.',
    'Thermal-habitat values are not universal bite-temperature thresholds.',
    'Seasonal accessibility depends on local depth and thermal structure.',
    'The activity index is relative, not a catch probability.',
  ],
}
