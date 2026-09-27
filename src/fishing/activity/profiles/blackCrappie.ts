/**
 * Transcribed from
 * `.planning/research/batch-3/reel-weather-black-crappie-research-dossier.md`.
 * Does not inherit generic "panfish" behavior — independent evidence per the
 * batch-3 schema patch. Confidence is conservative because movement
 * telemetry, trap-net CPUE, and feeding syntheses do not fully agree on the
 * exact nighttime peak (see the `late-night` phase note below).
 */
import type { ActivitySpeciesProfile, EvidenceRecord } from '../types'

export const BLACK_CRAPPIE_EVIDENCE: EvidenceRecord[] = [
  {
    id: 'crappie-guy-1992-telemetry',
    citation:
      'Guy, C.S., Neumann, R.M. & Willis, D.W. (1992). Movement Patterns of Adult Black Crappie, Pomoxis nigromaculatus, in Brant Lake, South Dakota.',
    year: 1992,
    doi: '10.1080/02705060.1992.9664679',
    url: 'https://www.tandfonline.com/doi/abs/10.1080/02705060.1992.9664679',
    speciesId: 'black-crappie',
    evidenceType: 'movement',
    population: { location: 'Brant Lake, South Dakota, USA', habitat: 'lake', lifeStage: 'adult' },
    study: {
      method: 'Ultrasonic telemetry',
      duration: 'April-August 1991',
      seasonsCovered: ['spring', 'summer'],
    },
    variables: [
      'time-of-day',
      'month',
      'water-temperature',
      'Secchi-transparency',
      'sky-cover',
      'wind',
      'pressure',
      'precipitation',
    ],
    finding: {
      summary:
        'Adult movement differed strongly by month and diel period. Movement increased from evening toward morning and was lowest during daytime. Fish used shallow water during evening/night in spring and day/evening in summer.',
      direction: 'peak',
    },
    applicability: 'high',
    limitations: [
      'One lake and spring/summer only.',
      'Movement is not direct feeding or angling catchability.',
      'A positive pressure correlation in this one study should not be generalized into a barometric-pressure rule.',
    ],
  },
  {
    id: 'crappie-shoup-2004-trapnet',
    citation:
      'Shoup, D.E., Carlson, R.E. & Heath, R.T. (2004). Diel Activity Levels of Centrarchid Fishes in a Small Ohio Lake.',
    year: 2004,
    doi: '10.1577/T03-037.1',
    url: 'https://doi.org/10.1577/T03-037.1',
    speciesId: 'black-crappie',
    evidenceType: 'movement',
    population: { location: 'Sandy Lake, Ohio, USA', habitat: 'lake', lifeStage: 'mixed' },
    study: {
      method: 'Three sizes of trap nets sampled at 6-h intervals along the deep vegetation line',
    },
    variables: ['time-of-day', 'fish-size', 'trap-net-cpue'],
    finding: {
      summary:
        'All four common centrarchids had their lowest trap-net CPUE during 22:00-04:00. Large piscivorous Black Crappie (150-303 mm) had their highest CPUE during the dusk interval (16:00-22:00), while smaller size classes tended to peak earlier.',
      direction: 'peak',
    },
    applicability: 'moderate',
    limitations: [
      'Trap-net CPUE measures movement through the sampled vegetation edge, not rod-and-line catchability.',
      'One small lake.',
    ],
  },
  {
    id: 'crappie-dfo-2025-synopsis',
    citation:
      'Fisheries and Oceans Canada. A biological synopsis of Black Crappie (Pomoxis nigromaculatus).',
    year: 2025,
    url: 'https://waves-vagues.dfo-mpo.gc.ca/library-bibliotheque/41273990.pdf',
    speciesId: 'black-crappie',
    evidenceType: 'population-context',
    population: {
      location: 'North American literature synthesis',
      habitat: 'multiple',
      lifeStage: 'mixed',
    },
    study: { method: 'Government literature synthesis' },
    variables: ['life-stage', 'time-of-day', 'feeding'],
    finding: {
      summary:
        'The synthesis reports juvenile Black Crappie as primarily diurnal feeders, while adults are primarily nocturnal feeders, drawing on earlier primary feeding studies.',
      direction: 'mixed',
    },
    applicability: 'moderate',
    limitations: [
      'Secondary synthesis rather than a new experiment.',
      'Life-stage effects are substantial.',
    ],
  },
]

export const BLACK_CRAPPIE_PROFILE: ActivitySpeciesProfile = {
  modelKind: 'activity',
  id: 'black-crappie',
  scientificName: 'Pomoxis nigromaculatus',
  displayName: 'Black Crappie',
  alternateNames: ['Crappie', 'Speckled Perch', 'Calico Bass'],
  iconKey: 'black-crappie',
  researchCoverage: 'moderate',
  productionReady: true,

  diel: {
    default: {
      'pre-dawn': {
        level: 'high',
        confidence: 'moderate',
        evidenceIds: ['crappie-guy-1992-telemetry', 'crappie-dfo-2025-synopsis'],
      },
      dawn: {
        level: 'high',
        confidence: 'moderate',
        evidenceIds: ['crappie-guy-1992-telemetry', 'crappie-dfo-2025-synopsis'],
      },
      day: {
        level: 'moderate',
        confidence: 'moderate',
        evidenceIds: ['crappie-guy-1992-telemetry', 'crappie-shoup-2004-trapnet'],
      },
      dusk: {
        level: 'peak',
        confidence: 'strong',
        evidenceIds: ['crappie-guy-1992-telemetry', 'crappie-shoup-2004-trapnet'],
      },
      'early-night': {
        level: 'favorable',
        confidence: 'moderate',
        evidenceIds: ['crappie-guy-1992-telemetry', 'crappie-dfo-2025-synopsis'],
      },
      'late-night': {
        level: 'favorable',
        confidence: 'limited',
        evidenceIds: [
          'crappie-guy-1992-telemetry',
          'crappie-shoup-2004-trapnet',
          'crappie-dfo-2025-synopsis',
        ],
        note: 'Adult feeding literature supports nocturnal feeding, while one vegetation-edge trap-net study recorded its lowest CPUE during late night. The app should not claim a universal midnight peak.',
      },
    },
  },

  contextRules: [
    {
      id: 'crappie-life-stage-context',
      variable: 'habitat',
      mode: 'context-only',
      confidence: 'moderate',
      evidenceIds: ['crappie-dfo-2025-synopsis', 'crappie-shoup-2004-trapnet'],
      condition: {},
      message:
        'Diel feeding/activity differs with size and life stage; smaller Black Crappie can be substantially more daytime-oriented than larger piscivorous adults.',
    },
    {
      id: 'crappie-pressure-not-modeled',
      variable: 'pressure',
      mode: 'context-only',
      confidence: 'limited',
      evidenceIds: ['crappie-guy-1992-telemetry'],
      condition: {},
      message:
        'One adult telemetry study found a positive correlation between barometric pressure and movement, but this single-water result is not sufficient for V1 scoring.',
    },
  ],

  evidenceIds: [
    'crappie-guy-1992-telemetry',
    'crappie-shoup-2004-trapnet',
    'crappie-dfo-2025-synopsis',
  ],

  cautions: [
    'The exact late-night peak is uncertain because movement, trap-net CPUE, and feeding syntheses do not align perfectly.',
    'Size/life stage materially changes feeding chronology.',
    'A single pressure correlation is not a barometric-pressure fishing rule.',
    'The activity index is relative, not a catch probability.',
  ],
}
