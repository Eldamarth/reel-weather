/**
 * Transcribed from
 * `.planning/research/batch-3/reel-weather-smallmouth-bass-research-dossier.md`.
 * Does not inherit Largemouth Bass's rules — independent evidence per species.
 */
import type { ActivitySpeciesProfile, EvidenceRecord } from '../types'

export const SMALLMOUTH_BASS_EVIDENCE: EvidenceRecord[] = [
  {
    id: 'smallmouth-wolf-2026-great-lakes',
    citation: 'Wolf, P.H. et al. (2026). Activity and metabolic rate of free-swimming smallmouth bass (Micropterus dolomieu) in large, interconnected ecosystems.',
    year: 2026,
    doi: '10.1186/s40317-026-00455-3',
    url: 'https://link.springer.com/article/10.1186/s40317-026-00455-3',
    speciesId: 'smallmouth-bass',
    evidenceType: 'accelerometry',
    population: { location: 'Eastern Lake Ontario and upper/middle St. Lawrence River, Canada/USA', habitat: 'multiple', lifeStage: 'adult' },
    study: {
      method: 'Multi-year acoustic telemetry with tri-axial accelerometer transmitters',
      duration: 'August 2021-August 2024 activity dataset',
      seasonsCovered: ['spring', 'summer', 'fall', 'winter'],
    },
    variables: ['time-of-day', 'season', 'habitat-type', 'flow', 'water-temperature'],
    finding: {
      summary: 'Activity generally increased through morning, peaked from late morning into early afternoon, and declined through evening; crepuscular structure was evident, especially in summer. Winter activity remained consistently low with the weakest diel cycle.',
      direction: 'peak',
    },
    applicability: 'high',
    limitations: ['Activity patterns varied among lake and river habitats.', 'Acceleration is not direct feeding or catchability.'],
  },
  {
    id: 'smallmouth-todd-rabeni-1989-stream',
    citation: 'Todd, B.L. & Rabeni, C.F. (1989). Movement and Habitat Use by Stream-Dwelling Smallmouth Bass.',
    year: 1989,
    url: 'https://academic.oup.com/tafs/article-abstract/118/3/229/7891663',
    speciesId: 'smallmouth-bass',
    evidenceType: 'movement',
    population: { location: 'Missouri stream, USA', habitat: 'stream', lifeStage: 'adult' },
    study: { method: 'Radio telemetry with 24-h observations in all seasons' },
    variables: ['time-of-day', 'season', 'water-temperature', 'cover', 'flow'],
    finding: {
      summary: 'Intrapool movement peaked shortly after sunrise and again after sunset in all seasons. Average daily movement increased from about 120 m/day at 4°C to about 980 m/day at 27.5°C. Habitat use shifted between day/night and warm/cool seasons.',
      direction: 'peak',
    },
    applicability: 'high',
    limitations: ['Stream population; lentic populations may differ.', 'Movement-distance relationship is not a direct catchability curve.'],
  },
  {
    id: 'smallmouth-kwak-1995-feeding',
    citation: 'Kwak, T.J. et al. (1995). Diel Feeding Chronology of Six Fish Species in the Juniata River, Pennsylvania.',
    year: 1995,
    doi: '10.1080/02705060.1995.9663412',
    url: 'https://www.tandfonline.com/doi/full/10.1080/02705060.1995.9663412',
    speciesId: 'smallmouth-bass',
    evidenceType: 'feeding',
    population: { location: 'Juniata River, Pennsylvania, USA', habitat: 'river', lifeStage: 'mixed' },
    study: { method: 'Stomach-content sampling across six 4-h intervals over 24 h' },
    variables: ['time-of-day', 'feeding-intensity', 'diet-composition'],
    finding: {
      summary: 'Smallmouth Bass exhibited a diurnal feeding peak; the study documented strong diel variation in feeding chronology across the fish assemblage.',
      direction: 'peak',
    },
    applicability: 'high',
    limitations: ['One river system.', 'Stomach-content chronology is not direct lure catchability.'],
  },
]

export const SMALLMOUTH_BASS_PROFILE: ActivitySpeciesProfile = {
  modelKind: 'activity',
  id: 'smallmouth-bass',
  scientificName: 'Micropterus dolomieu',
  displayName: 'Smallmouth Bass',
  alternateNames: ['Smallmouth', 'Bronzeback'],
  iconKey: 'smallmouth-bass',
  researchCoverage: 'strong',
  productionReady: true,

  diel: {
    default: {
      'pre-dawn': {
        level: 'moderate',
        confidence: 'moderate',
        evidenceIds: ['smallmouth-wolf-2026-great-lakes', 'smallmouth-todd-rabeni-1989-stream'],
      },
      dawn: {
        level: 'high',
        confidence: 'strong',
        evidenceIds: ['smallmouth-wolf-2026-great-lakes', 'smallmouth-todd-rabeni-1989-stream'],
      },
      day: {
        level: 'high',
        confidence: 'strong',
        evidenceIds: ['smallmouth-wolf-2026-great-lakes', 'smallmouth-kwak-1995-feeding'],
      },
      dusk: {
        level: 'high',
        confidence: 'strong',
        evidenceIds: ['smallmouth-wolf-2026-great-lakes', 'smallmouth-todd-rabeni-1989-stream'],
      },
      'early-night': {
        level: 'moderate',
        confidence: 'moderate',
        evidenceIds: ['smallmouth-wolf-2026-great-lakes', 'smallmouth-todd-rabeni-1989-stream'],
      },
      'late-night': {
        level: 'low',
        confidence: 'moderate',
        evidenceIds: ['smallmouth-wolf-2026-great-lakes', 'smallmouth-kwak-1995-feeding'],
      },
    },

    seasonalOverrides: {
      cold: {
        'pre-dawn': {
          level: 'low',
          confidence: 'strong',
          evidenceIds: ['smallmouth-wolf-2026-great-lakes', 'smallmouth-todd-rabeni-1989-stream'],
        },
        dawn: {
          level: 'moderate',
          confidence: 'strong',
          evidenceIds: ['smallmouth-wolf-2026-great-lakes'],
        },
        day: {
          level: 'moderate',
          confidence: 'strong',
          evidenceIds: ['smallmouth-wolf-2026-great-lakes'],
        },
        dusk: {
          level: 'moderate',
          confidence: 'strong',
          evidenceIds: ['smallmouth-wolf-2026-great-lakes'],
        },
        'early-night': {
          level: 'low',
          confidence: 'strong',
          evidenceIds: ['smallmouth-wolf-2026-great-lakes'],
        },
        'late-night': {
          level: 'low',
          confidence: 'strong',
          evidenceIds: ['smallmouth-wolf-2026-great-lakes'],
        },
      },
    },
  },

  contextRules: [
    {
      id: 'smallmouth-habitat-variation-context',
      variable: 'habitat',
      mode: 'context-only',
      confidence: 'strong',
      evidenceIds: ['smallmouth-wolf-2026-great-lakes', 'smallmouth-todd-rabeni-1989-stream'],
      condition: {},
      message: 'Smallmouth Bass diel and seasonal activity varies with habitat type and flow; the Lake Ontario and St. Lawrence populations did not behave identically.',
    },
    {
      id: 'smallmouth-temperature-movement-context',
      variable: 'water-temperature',
      mode: 'context-only',
      confidence: 'moderate',
      evidenceIds: ['smallmouth-todd-rabeni-1989-stream', 'smallmouth-wolf-2026-great-lakes'],
      condition: {},
      message: 'Movement and metabolic activity increase greatly from winter into warm seasons, but the reviewed studies do not justify a universal numeric bite-temperature optimum.',
    },
  ],

  evidenceIds: ['smallmouth-wolf-2026-great-lakes', 'smallmouth-todd-rabeni-1989-stream', 'smallmouth-kwak-1995-feeding'],

  cautions: [
    'Lake and river populations can differ materially in activity amplitude and timing.',
    'Winter suppression is strong, but fish are not assumed completely inactive.',
    'Movement and feeding are not direct catch probabilities.',
    'The activity index is relative, not a catch probability.',
  ],
}
