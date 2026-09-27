/**
 * Transcribed from
 * `.planning/research/batch-3/reel-weather-yellow-perch-research-dossier.md`.
 * Does not inherit European Perch's rules — closely related species get
 * independent evidence per the batch-3 schema patch's explicit instruction.
 */
import type { ActivitySpeciesProfile, EvidenceRecord } from '../types'

export const YELLOW_PERCH_EVIDENCE: EvidenceRecord[] = [
  {
    id: 'yellow-perch-bauer-2009-diel',
    citation:
      'Bauer, W.F., Radabaugh, N.B. & Brown, M.L. (2009). Diel Movement Patterns of Yellow Perch in a Simple and a Complex Lake Basin.',
    year: 2009,
    doi: '10.1577/M07-087.1',
    url: 'https://onlinelibrary.wiley.com/doi/10.1577/M07-087.1',
    speciesId: 'yellow-perch',
    evidenceType: 'movement',
    population: {
      location: 'Two glacial lakes, South Dakota, USA',
      habitat: 'multiple',
      lifeStage: 'adult',
    },
    study: {
      method: 'Ultrasonic telemetry',
      duration: 'Diel tracking in two lakes with contrasting basin complexity',
    },
    variables: ['time-of-day', 'lake-morphometry', 'depth', 'distance-from-shore', 'body-size'],
    finding: {
      summary:
        'In both lakes, movement increased from dawn into the diurnal period and decreased from dusk into the nocturnal period, with the lowest activity at night. Basin complexity altered absolute movement and habitat use but not the broad diel ordering.',
      direction: 'peak',
    },
    applicability: 'high',
    limitations: [
      'Movement is not direct feeding or angling catchability.',
      'Two lake systems in one region.',
    ],
  },
  {
    id: 'yellow-perch-radabaugh-2010-seasonal',
    citation:
      'Radabaugh, N.B., Bauer, W.F. & Brown, M.L. (2010). A Comparison of Seasonal Movement Patterns of Yellow Perch in Simple and Complex Lake Basins.',
    year: 2010,
    doi: '10.1577/M08-243.1',
    url: 'https://onlinelibrary.wiley.com/doi/10.1577/M08-243.1',
    speciesId: 'yellow-perch',
    evidenceType: 'movement',
    population: {
      location: 'Two temperate lakes, South Dakota, USA',
      habitat: 'multiple',
      lifeStage: 'adult',
      sizeRange: '210-235 mm and 250-280 mm total length groups',
    },
    study: { method: 'Ultrasonic telemetry', seasonsCovered: ['spring', 'summer', 'fall'] },
    variables: ['season', 'depth', 'distance-from-shore', 'movement', 'sex', 'basin-complexity'],
    finding: {
      summary:
        'Both lake populations showed seasonal movement differences, with movement highest in fall and lowest in summer. Habitat depth and shore-distance patterns differed between the simple and complex basins.',
      direction: 'mixed',
    },
    applicability: 'high',
    limitations: [
      'Seasonal movement does not establish seasonal angling catchability.',
      'Lake morphology materially affected habitat use.',
    ],
  },
  {
    id: 'yellow-perch-jansen-mackay-1992-feeding',
    citation:
      'Jansen, W.A. & Mackay, W.C. (1992). Foraging in yellow perch, Perca flavescens: biological and physical factors affecting diel periodicity in feeding, consumption, and movement.',
    year: 1992,
    doi: '10.1007/BF00004776',
    url: 'https://doi.org/10.1007/BF00004776',
    speciesId: 'yellow-perch',
    evidenceType: 'feeding',
    population: { location: 'Baptiste Lake, Alberta, Canada', habitat: 'lake', lifeStage: 'mixed' },
    study: {
      method:
        'Three-hour interval sampling over two summer 24-h periods with stomach-content and spatial-density analysis',
      seasonsCovered: ['summer'],
    },
    variables: ['time-of-day', 'feeding-intensity', 'diet', 'littoral-movement'],
    finding: {
      summary:
        'Feeding intensity increased through the day, peaked in late evening, and nearly ceased after sunset. Perch density at the littoral sampling site tracked the feeding pattern.',
      direction: 'peak',
    },
    applicability: 'high',
    limitations: [
      'Two summer 24-h sampling periods.',
      'Feeding chronology may vary with prey community and season.',
    ],
  },
]

export const YELLOW_PERCH_PROFILE: ActivitySpeciesProfile = {
  modelKind: 'activity',
  id: 'yellow-perch',
  scientificName: 'Perca flavescens',
  displayName: 'Yellow Perch',
  alternateNames: ['Perch', 'American Perch'],
  iconKey: 'yellow-perch',
  researchCoverage: 'strong',
  productionReady: true,

  diel: {
    default: {
      'pre-dawn': {
        level: 'moderate',
        confidence: 'moderate',
        evidenceIds: ['yellow-perch-bauer-2009-diel'],
      },
      dawn: {
        level: 'high',
        confidence: 'strong',
        evidenceIds: ['yellow-perch-bauer-2009-diel', 'yellow-perch-jansen-mackay-1992-feeding'],
      },
      day: {
        level: 'high',
        confidence: 'strong',
        evidenceIds: ['yellow-perch-bauer-2009-diel', 'yellow-perch-jansen-mackay-1992-feeding'],
      },
      dusk: {
        level: 'peak',
        confidence: 'strong',
        evidenceIds: ['yellow-perch-bauer-2009-diel', 'yellow-perch-jansen-mackay-1992-feeding'],
        note: 'Late-evening feeding can be strong even as broad locomotor movement begins declining toward the nocturnal period.',
      },
      'early-night': {
        level: 'moderate',
        confidence: 'strong',
        evidenceIds: ['yellow-perch-bauer-2009-diel', 'yellow-perch-jansen-mackay-1992-feeding'],
      },
      'late-night': {
        level: 'low',
        confidence: 'strong',
        evidenceIds: ['yellow-perch-bauer-2009-diel', 'yellow-perch-jansen-mackay-1992-feeding'],
      },
    },
  },

  contextRules: [
    {
      id: 'yellow-perch-basin-context',
      variable: 'habitat',
      mode: 'context-only',
      confidence: 'strong',
      evidenceIds: ['yellow-perch-bauer-2009-diel', 'yellow-perch-radabaugh-2010-seasonal'],
      condition: {},
      message:
        'Lake-basin complexity can substantially change Yellow Perch movement rate, depth and shoreline use without reversing the basic day-versus-night pattern.',
    },
    {
      id: 'yellow-perch-seasonal-movement-context',
      variable: 'habitat',
      mode: 'context-only',
      confidence: 'moderate',
      evidenceIds: ['yellow-perch-radabaugh-2010-seasonal'],
      condition: {},
      message:
        'Adult movement differed seasonally in the reviewed lakes, but the evidence does not justify converting fall-versus-summer movement differences directly into a catchability score.',
    },
  ],

  evidenceIds: [
    'yellow-perch-bauer-2009-diel',
    'yellow-perch-radabaugh-2010-seasonal',
    'yellow-perch-jansen-mackay-1992-feeding',
  ],

  cautions: [
    'Do not copy European Perch context rules simply because the species are closely related.',
    'Lake morphology materially changes habitat use.',
    'Seasonal movement is not synonymous with seasonal catchability.',
    'The activity index is relative, not a catch probability.',
  ],
}
