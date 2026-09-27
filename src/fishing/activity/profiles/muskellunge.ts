/**
 * Transcribed from
 * `.planning/research/batch-2/reel-weather-muskellunge-research-dossier.md`.
 */
import type { ActivitySpeciesProfile, EvidenceRecord } from '../types'

export const MUSKELLUNGE_EVIDENCE: EvidenceRecord[] = [
  {
    id: 'muskie-landsman-2015-accelerometry',
    citation:
      'Landsman, S.J. et al. (2015). Locomotor activity patterns of muskellunge (Esox masquinongy) assessed using tri-axial acceleration sensing acoustic transmitters.',
    year: 2015,
    doi: '10.1007/s10641-015-0433-1',
    url: 'https://experts.illinois.edu/en/publications/locomotor-activity-patterns-of-muskellunge-esox-masquinongy-asses/',
    speciesId: 'muskellunge',
    evidenceType: 'accelerometry',
    population: { location: 'Rideau River, Ontario, Canada', habitat: 'river', lifeStage: 'adult' },
    study: {
      method: 'Tri-axial acceleration-sensing acoustic telemetry in an 8-km reach',
      duration: '1 June-20 August 2010',
      seasonsCovered: ['summer'],
    },
    variables: ['time-of-day', 'water-temperature', 'body-size', 'capture-method'],
    finding: {
      summary:
        'Muskellunge were inactive much of the time. Activity was lowest at dawn, increased through the day, peaked at dusk, and declined at night. Activity also declined above 25°C and was lower in larger fish.',
      direction: 'peak',
    },
    applicability: 'high',
    limitations: [
      'Summer-only study.',
      'One river reach.',
      'Locomotion is not identical to feeding or lure vulnerability.',
    ],
  },
  {
    id: 'muskie-shaw-2021-escanaba-angling',
    citation:
      'Shaw, S.L., Renik, K.M. & Sass, G.G. (2021). Angler and environmental influences on walleye Sander vitreus and muskellunge Esox masquinongy angler catch in Escanaba Lake, Wisconsin 2003-2015.',
    year: 2021,
    doi: '10.1371/journal.pone.0257882',
    url: 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0257882',
    speciesId: 'muskellunge',
    evidenceType: 'angling-cpue',
    population: { location: 'Escanaba Lake, Wisconsin, USA', habitat: 'lake', lifeStage: 'mixed' },
    study: {
      method: 'Long-term compulsory creel census with hurdle models',
      duration: 'Open-water angling, 2003-2015',
    },
    variables: [
      'diel-period',
      'solar-radiation',
      'air-temperature',
      'lunar-phase',
      'lunar-position',
      'wind-speed',
      'wind-direction',
      'angler-variables',
      'prior-capture',
    ],
    finding: {
      summary:
        'Muskellunge trip success and catch rate were associated with diel/light, temperature, lunar and wind metrics as well as important angler-related variables and prior capture history.',
      direction: 'mixed',
    },
    applicability: 'high',
    limitations: [
      'Single lake.',
      'Air temperature is not water temperature.',
      'Multiple variables interact; the study does not establish universal thresholds.',
    ],
  },
  {
    id: 'muskie-vinson-2014-lunar-catch',
    citation:
      'Vinson, M.R. & Angradi, T.R. (2014). Muskie Lunacy: Does the Lunar Cycle Influence Angler Catch of Muskellunge (Esox masquinongy)?',
    year: 2014,
    doi: '10.1371/journal.pone.0098046',
    url: 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0098046',
    speciesId: 'muskellunge',
    evidenceType: 'angling-cpue',
    population: {
      location: 'North American muskellunge fisheries',
      habitat: 'multiple',
      lifeStage: 'mixed',
    },
    study: {
      method: 'Periodic regression of self-reported Muskies Inc. catch records',
      sampleSize: '341,959 catch records',
      duration: '1970-2013',
    },
    variables: [
      'lunar-cycle',
      'time-of-day',
      'latitude',
      'fish-size',
      'angler-expertise',
      'angler-effort',
    ],
    finding: {
      summary:
        'Catch varied with lunar cycle, with more catches around full/new moon periods and an estimated maximum overall relative effect of about 5%. Effort also varied with lunar cycle in at least one fishery, preventing a clean fish-behavior causal conclusion.',
      direction: 'mixed',
    },
    applicability: 'moderate',
    limitations: [
      'Self-reported catch records.',
      'Incomplete effort correction.',
      'Effect varied by fishery, latitude, month and fish size.',
    ],
  },
  {
    id: 'muskie-bieber-2024-food-vulnerability',
    citation:
      'Bieber, J.F., MacDougall-Shackleton, S.A. & Suski, C.D. (2024). Food availability influences angling vulnerability in muskellunge.',
    year: 2024,
    doi: '10.1111/fme.12657',
    url: 'https://onlinelibrary.wiley.com/doi/10.1111/fme.12657',
    speciesId: 'muskellunge',
    evidenceType: 'angling-cpue',
    population: {
      location: 'Experimental earthen ponds, Illinois, USA',
      habitat: 'lake',
      lifeStage: 'juvenile',
    },
    study: {
      method: 'Experimental angling of hatchery-reared, angling-naive fish with and without forage',
      sampleSize: '140 fish in the angling experiment',
      duration: 'October 2022',
    },
    variables: ['food-availability', 'angling-vulnerability', 'behavior'],
    finding: {
      summary:
        'Food-deprived muskellunge were caught more than twice as often as fish with forage available, while measured boldness/aggression/exploration did not explain the difference.',
      direction: 'increase',
    },
    applicability: 'limited',
    limitations: [
      'Juvenile hatchery-reared fish in small experimental ponds.',
      'Food availability is not known by Reel Weather.',
      'Not a diel study.',
    ],
  },
]

export const MUSKELLUNGE_PROFILE: ActivitySpeciesProfile = {
  modelKind: 'activity',
  id: 'muskellunge',
  scientificName: 'Esox masquinongy',
  displayName: 'Muskellunge',
  alternateNames: ['Muskie', 'Musky'],
  iconKey: 'muskellunge',
  researchCoverage: 'strong',
  productionReady: true,

  diel: {
    default: {
      'pre-dawn': {
        level: 'moderate',
        confidence: 'limited',
        evidenceIds: ['muskie-landsman-2015-accelerometry', 'muskie-shaw-2021-escanaba-angling'],
      },
      dawn: {
        level: 'moderate',
        confidence: 'moderate',
        evidenceIds: ['muskie-landsman-2015-accelerometry', 'muskie-shaw-2021-escanaba-angling'],
        note: 'Summer locomotor activity was lowest at dawn, but movement is not equivalent to lure vulnerability.',
      },
      day: {
        level: 'favorable',
        confidence: 'moderate',
        evidenceIds: ['muskie-landsman-2015-accelerometry', 'muskie-shaw-2021-escanaba-angling'],
      },
      dusk: {
        level: 'peak',
        confidence: 'strong',
        evidenceIds: ['muskie-landsman-2015-accelerometry', 'muskie-shaw-2021-escanaba-angling'],
      },
      'early-night': {
        level: 'favorable',
        confidence: 'moderate',
        evidenceIds: [
          'muskie-landsman-2015-accelerometry',
          'muskie-shaw-2021-escanaba-angling',
          'muskie-vinson-2014-lunar-catch',
        ],
      },
      'late-night': {
        level: 'moderate',
        confidence: 'limited',
        evidenceIds: ['muskie-landsman-2015-accelerometry', 'muskie-vinson-2014-lunar-catch'],
      },
    },
  },

  contextRules: [
    {
      id: 'muskie-warm-summer-activity-context',
      variable: 'water-temperature',
      mode: 'context-only',
      confidence: 'moderate',
      evidenceIds: ['muskie-landsman-2015-accelerometry'],
      condition: { min: 25 },
      message:
        'In one summer Rideau River accelerometer study, muskellunge locomotor activity declined above about 25°C. This is a summer movement finding, not a universal bite cutoff.',
    },
    {
      id: 'muskie-vulnerability-context',
      variable: 'habitat',
      mode: 'context-only',
      confidence: 'moderate',
      evidenceIds: [
        'muskie-shaw-2021-escanaba-angling',
        'muskie-vinson-2014-lunar-catch',
        'muskie-bieber-2024-food-vulnerability',
      ],
      condition: {},
      message:
        'Muskellunge lure vulnerability reflects internal state, prey availability, angler behavior and environmental context; locomotor activity alone is not catch probability.',
    },
  ],

  evidenceIds: [
    'muskie-landsman-2015-accelerometry',
    'muskie-shaw-2021-escanaba-angling',
    'muskie-vinson-2014-lunar-catch',
    'muskie-bieber-2024-food-vulnerability',
  ],

  cautions: [
    'The clearest diel accelerometer study is summer-only.',
    'Muskellunge are ambush predators; low movement does not mean zero feeding opportunity.',
    'Lunar evidence is retained but not modeled in V1 because effort confounding and effect variability remain important.',
    'Air temperature must not be used as water temperature.',
    'The activity index is relative, not a catch probability.',
  ],
}
