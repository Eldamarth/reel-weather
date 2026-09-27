/**
 * Transcribed from
 * `.planning/research/batch-2/reel-weather-common-carp-research-dossier.md`.
 * A deliberate stress test of the evidence architecture: direct feeding/CPUE
 * evidence favors night, while a long-term telemetry study found lower
 * locomotor activity at night. Handled via lower confidence on the affected
 * phases plus an explicit context-only rule surfacing the tension, rather
 * than by picking one measurement type and discarding the other.
 */
import type { ActivitySpeciesProfile, EvidenceRecord } from '../types'

export const COMMON_CARP_EVIDENCE: EvidenceRecord[] = [
  {
    id: 'carp-zak-2021-angling-competitions',
    citation:
      'Žák, J. (2021). Diel pattern in common carp landings from angling competitions corresponds to their assumed foraging activity.',
    year: 2021,
    doi: '10.1016/j.fishres.2021.106086',
    url: 'https://www.sciencedirect.com/science/article/pii/S0165783621002149',
    speciesId: 'common-carp',
    evidenceType: 'angling-cpue',
    population: {
      location: 'Carp-angling competitions in four European countries',
      habitat: 'multiple',
      lifeStage: 'mixed',
    },
    study: {
      method:
        'Analysis of time-stamped Common Carp landings from long-duration carp-oriented competitions',
      sampleSize: '14 competitions, each with more than 100 landed carp',
    },
    variables: ['time-of-day', 'angling-duration', 'landing-rate'],
    finding: {
      summary:
        'Carp landings peaked at night, supporting a nocturnal angling-vulnerability/foraging pattern. The exact diel shape varied among competitions.',
      direction: 'peak',
    },
    applicability: 'high',
    limitations: [
      'Competition anglers, intensive baiting and long sessions may not represent ordinary fishing.',
      'Landing counts reflect both fish behavior and angler/feeding-site effects.',
    ],
  },
  {
    id: 'carp-bajer-2010-food-search',
    citation:
      'Bajer, P.G., Lim, H., Travaline, M.J., Miller, B.D. & Sorensen, P.W. (2010). Cognitive aspects of food searching behavior in free-ranging wild Common Carp.',
    year: 2010,
    doi: '10.1007/s10641-010-9643-8',
    url: 'https://doi.org/10.1007/s10641-010-9643-8',
    speciesId: 'common-carp',
    evidenceType: 'feeding',
    population: {
      location: 'Wild Common Carp, Minnesota, USA',
      habitat: 'lake',
      lifeStage: 'adult',
    },
    study: {
      method: 'Radio telemetry with experimentally introduced food reward',
      sampleSize: '34 radio-tagged wild carp',
    },
    variables: ['time-of-day', 'food-site-learning', 'home-range', 'feeding'],
    finding: {
      summary:
        'Free-ranging wild carp learned and repeatedly visited a novel food-reward site, with feeding-site use concentrated at night and returns toward home areas after sunrise.',
      direction: 'increase',
    },
    applicability: 'high',
    limitations: [
      'Artificially provisioned food site.',
      'Learned bait-site behavior can alter natural movement patterns.',
    ],
  },
  {
    id: 'carp-ghosal-2018-bait-site',
    citation:
      'Ghosal, R., Eichmiller, J.J., Witthuhn, B.A. & Sorensen, P.W. (2018). Attracting Common Carp to a bait site with food reveals strong positive relationships between fish density, feeding activity, environmental DNA, and sex pheromone release that could be used in invasive fish management.',
    year: 2018,
    doi: '10.1002/ece3.4169',
    url: 'https://pubmed.ncbi.nlm.nih.gov/30220992/',
    speciesId: 'common-carp',
    evidenceType: 'feeding',
    population: { location: '67-ha lake, Minnesota, USA', habitat: 'lake', lifeStage: 'adult' },
    study: {
      method:
        'Radio telemetry plus bait consumption and environmental DNA at a provisioned feeding site',
    },
    variables: ['time-of-day', 'feeding', 'bait-site-use', 'fish-density'],
    finding: {
      summary:
        'Food attracted carp strongly, with much greater nighttime feeding signals. Night/day differences in feeding-related measures exceeded the change in fish abundance/activity at the site, reinforcing that feeding intensity and locomotor movement are not the same outcome.',
      direction: 'increase',
    },
    applicability: 'high',
    limitations: [
      'Provisioned bait site.',
      'Management-oriented experiment rather than recreational angling.',
    ],
  },
  {
    id: 'carp-benito-2015-ebro-telemetry',
    citation:
      'Benito, J., Benejam, L., Zamora, L. & García-Berthou, E. (2015). Diel Cycle and Effects of Water Flow on Activity and Use of Depth by Common Carp.',
    year: 2015,
    doi: '10.1080/00028487.2015.1017656',
    url: 'https://onlinelibrary.wiley.com/doi/full/10.1080/00028487.2015.1017656',
    speciesId: 'common-carp',
    evidenceType: 'movement',
    population: {
      location: 'Ebro River main-stem reservoir, Spain',
      habitat: 'reservoir',
      lifeStage: 'adult',
    },
    study: {
      method: 'Ultrasonic telemetry',
      duration: '19 months',
      seasonsCovered: ['spring', 'summer', 'fall', 'winter'],
    },
    variables: ['time-of-day', 'depth', 'movement', 'water-flow', 'dissolved-oxygen', 'season'],
    finding: {
      summary:
        'Carp shifted from deeper nighttime positions with lower locomotor activity to shallower daytime habitat with greater activity, especially in the warm season. Increased flow reduced activity and shifted habitat use.',
      direction: 'mixed',
    },
    applicability: 'high',
    limitations: [
      'Movement conflicts with a simplistic "night = most active" locomotor model but does not contradict nocturnal feeding/catchability.',
      'Flow-regulated reservoir context.',
    ],
  },
]

export const COMMON_CARP_PROFILE: ActivitySpeciesProfile = {
  modelKind: 'activity',
  id: 'common-carp',
  scientificName: 'Cyprinus carpio',
  displayName: 'Common Carp',
  alternateNames: ['Carp', 'European Carp'],
  iconKey: 'common-carp',
  researchCoverage: 'strong',
  productionReady: true,

  diel: {
    default: {
      'pre-dawn': {
        level: 'high',
        confidence: 'moderate',
        evidenceIds: [
          'carp-zak-2021-angling-competitions',
          'carp-bajer-2010-food-search',
          'carp-ghosal-2018-bait-site',
        ],
      },
      dawn: {
        level: 'peak',
        confidence: 'moderate',
        evidenceIds: ['carp-zak-2021-angling-competitions', 'carp-bajer-2010-food-search'],
        note: 'Angling and food-site evidence supports a strong night-to-morning transition, but exact peak timing varies by system and feeding context.',
      },
      day: {
        level: 'moderate',
        confidence: 'moderate',
        evidenceIds: ['carp-zak-2021-angling-competitions', 'carp-benito-2015-ebro-telemetry'],
        note: 'Carp remain mobile by day; the lower opportunity level reflects feeding/catch evidence rather than an assertion that daytime carp are inactive.',
      },
      dusk: {
        level: 'high',
        confidence: 'moderate',
        evidenceIds: [
          'carp-zak-2021-angling-competitions',
          'carp-bajer-2010-food-search',
          'carp-ghosal-2018-bait-site',
        ],
      },
      'early-night': {
        level: 'high',
        confidence: 'strong',
        evidenceIds: [
          'carp-zak-2021-angling-competitions',
          'carp-bajer-2010-food-search',
          'carp-ghosal-2018-bait-site',
          'carp-benito-2015-ebro-telemetry',
        ],
        note: 'Direct feeding/catchability evidence favors night even though one long-term telemetry study measured reduced locomotor activity then.',
      },
      'late-night': {
        level: 'high',
        confidence: 'strong',
        evidenceIds: [
          'carp-zak-2021-angling-competitions',
          'carp-bajer-2010-food-search',
          'carp-ghosal-2018-bait-site',
          'carp-benito-2015-ebro-telemetry',
        ],
      },
    },
  },

  contextRules: [
    {
      id: 'carp-feeding-versus-movement-context',
      variable: 'habitat',
      mode: 'context-only',
      confidence: 'strong',
      evidenceIds: [
        'carp-zak-2021-angling-competitions',
        'carp-ghosal-2018-bait-site',
        'carp-benito-2015-ebro-telemetry',
      ],
      condition: {},
      message:
        'Carp can show strong nighttime feeding/angling vulnerability while broad locomotor activity is lower. This profile prioritizes direct feeding and catch evidence for fishing opportunity rather than treating movement distance as synonymous with feeding.',
    },
  ],

  evidenceIds: [
    'carp-zak-2021-angling-competitions',
    'carp-bajer-2010-food-search',
    'carp-ghosal-2018-bait-site',
    'carp-benito-2015-ebro-telemetry',
  ],

  cautions: [
    'Baiting and learned feeding sites can strongly reshape Common Carp behavior.',
    'Competition-angling results may overrepresent intensive baiting and expert anglers.',
    'Movement and feeding evidence point in different directions at night; the profile intentionally prioritizes feeding/catchability for angling relevance.',
    'Flow affects movement in some systems but is not modeled in V1.',
    'The activity index is relative, not a catch probability.',
  ],
}
