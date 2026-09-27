/**
 * Transcribed from
 * `.planning/research/batch-3/reel-weather-largemouth-bass-research-dossier.md`.
 * Does not inherit Smallmouth Bass's rules — independent evidence per species.
 */
import type { ActivitySpeciesProfile, EvidenceRecord } from '../types'

export const LARGEMOUTH_BASS_EVIDENCE: EvidenceRecord[] = [
  {
    id: 'largemouth-hlina-2026-toronto',
    citation:
      'Hlina, B.L. et al. (2026). Seasonal effects on the acceleration of largemouth bass and Northern Pike in Toronto harbour.',
    year: 2026,
    doi: '10.1186/s40317-026-00444-6',
    url: 'https://link.springer.com/article/10.1186/s40317-026-00444-6',
    speciesId: 'largemouth-bass',
    evidenceType: 'accelerometry',
    population: {
      location: 'Toronto Harbour, Lake Ontario, Canada',
      habitat: 'coastal',
      lifeStage: 'adult',
    },
    study: {
      method: 'Acoustic telemetry with acceleration sensors',
      seasonsCovered: ['spring', 'summer', 'fall', 'winter'],
    },
    variables: ['time-of-day', 'season', 'habitat'],
    finding: {
      summary:
        'Largemouth Bass acceleration was highest at dawn, followed by day and dusk, and lowest at night. Acceleration was much higher in spring/summer than fall/winter, with winter activity low but not zero.',
      direction: 'peak',
    },
    applicability: 'high',
    limitations: [
      'Acceleration does not directly identify feeding or lure vulnerability.',
      'Urban Great Lakes harbour habitat.',
    ],
  },
  {
    id: 'largemouth-warden-lorio-1975',
    citation:
      'Warden, R.L. Jr. & Lorio, W.J. (1975). Movements of Largemouth Bass (Micropterus salmoides) in Impounded Waters as Determined by Underwater Telemetry.',
    year: 1975,
    doi: '10.1577/1548-8659(1975)104<696:MOLBMS>2.0.CO;2',
    url: 'https://academic.oup.com/tafs/article/104/4/696/7895334',
    speciesId: 'largemouth-bass',
    evidenceType: 'movement',
    population: {
      location: 'Impounded waters, Mississippi, USA',
      habitat: 'reservoir',
      lifeStage: 'adult',
    },
    study: {
      method: 'Sonic telemetry',
      sampleSize: '16 tagged Largemouth Bass; 570 h of tracking',
      duration: 'March 1972-April 1973',
      seasonsCovered: ['spring', 'summer', 'fall', 'winter'],
    },
    variables: ['time-of-day', 'water-temperature', 'season', 'home-range'],
    finding: {
      summary:
        'Diurnal movement predominated in spring and fall, nocturnal movement increased as water temperature approached summer highs, fish were most active in March and September, and least active in December and January.',
      direction: 'mixed',
    },
    applicability: 'high',
    limitations: [
      'Older telemetry technology and short transmitter life.',
      'One regional reservoir system.',
      'Movement is not direct catchability.',
    ],
  },
  {
    id: 'largemouth-binder-2012-vulnerability',
    citation:
      'Binder, T.R. et al. (2012). Largemouth Bass Selected for Differential Vulnerability to Angling Exhibit Similar Routine Locomotory Activity in Experimental Ponds.',
    year: 2012,
    doi: '10.1080/00028487.2012.688919',
    url: 'https://www.tandfonline.com/doi/full/10.1080/00028487.2012.688919',
    speciesId: 'largemouth-bass',
    evidenceType: 'angling-cpue',
    population: {
      location: 'Experimental ponds, Illinois, USA',
      habitat: 'lake',
      lifeStage: 'adult',
    },
    study: {
      method:
        'Electromyogram telemetry comparing lines selected for high and low angling vulnerability',
    },
    variables: ['time-of-day', 'locomotor-activity', 'angling-vulnerability'],
    finding: {
      summary:
        'High- and low-angling-vulnerability lines did not differ in routine locomotor activity or diel pattern. Both were significantly diurnal, with daytime activity about 16-19% higher than nighttime activity.',
      direction: 'none',
    },
    applicability: 'high',
    limitations: [
      'Experimental ponds and artificially selected lines.',
      'Key result is that routine locomotion did not explain angling vulnerability.',
    ],
  },
  {
    id: 'largemouth-mcmahon-1995-light',
    citation:
      'McMahon, T.E. & Holanov, S.H. (1995). Foraging success of largemouth bass at different light intensities: implications for time and depth of feeding.',
    year: 1995,
    doi: '10.1111/j.1095-8649.1995.tb01599.x',
    url: 'https://onlinelibrary.wiley.com/doi/10.1111/j.1095-8649.1995.tb01599.x',
    speciesId: 'largemouth-bass',
    evidenceType: 'feeding',
    population: { location: 'Laboratory, Arizona, USA', habitat: 'laboratory', lifeStage: 'mixed' },
    study: {
      method:
        'Controlled prey-capture trials across light levels and modeled Secchi-depth conditions',
    },
    variables: ['light-intensity', 'water-clarity', 'feeding-success', 'depth'],
    finding: {
      summary:
        'Foraging success remained above 95% from daylight down to moonlight, declined sharply at starlight, and approached zero in total darkness. Lower water clarity greatly reduced the depth range over which adequate visual feeding light was available.',
      direction: 'decrease',
    },
    applicability: 'moderate',
    limitations: [
      'Laboratory prey-capture experiment.',
      'Secchi-depth treatments do not map directly to Reel Weather Clear/Stained/Murky categories.',
    ],
  },
]

export const LARGEMOUTH_BASS_PROFILE: ActivitySpeciesProfile = {
  modelKind: 'activity',
  id: 'largemouth-bass',
  scientificName: 'Micropterus salmoides',
  displayName: 'Largemouth Bass',
  alternateNames: ['Largemouth', 'Black Bass'],
  iconKey: 'largemouth-bass',
  researchCoverage: 'strong',
  productionReady: true,

  diel: {
    default: {
      'pre-dawn': {
        level: 'favorable',
        confidence: 'moderate',
        evidenceIds: ['largemouth-hlina-2026-toronto', 'largemouth-warden-lorio-1975'],
      },
      dawn: {
        level: 'peak',
        confidence: 'strong',
        evidenceIds: ['largemouth-hlina-2026-toronto', 'largemouth-binder-2012-vulnerability'],
      },
      day: {
        level: 'high',
        confidence: 'strong',
        evidenceIds: ['largemouth-hlina-2026-toronto', 'largemouth-binder-2012-vulnerability'],
      },
      dusk: {
        level: 'high',
        confidence: 'strong',
        evidenceIds: ['largemouth-hlina-2026-toronto', 'largemouth-warden-lorio-1975'],
      },
      'early-night': {
        level: 'moderate',
        confidence: 'moderate',
        evidenceIds: [
          'largemouth-hlina-2026-toronto',
          'largemouth-warden-lorio-1975',
          'largemouth-mcmahon-1995-light',
        ],
      },
      'late-night': {
        level: 'low',
        confidence: 'moderate',
        evidenceIds: [
          'largemouth-hlina-2026-toronto',
          'largemouth-binder-2012-vulnerability',
          'largemouth-mcmahon-1995-light',
        ],
      },
    },

    seasonalOverrides: {
      warm: {
        'early-night': {
          level: 'favorable',
          confidence: 'moderate',
          evidenceIds: ['largemouth-warden-lorio-1975'],
          note: 'Classic telemetry found nocturnal movement increased as summer temperatures approached seasonal highs.',
        },
        'late-night': {
          level: 'moderate',
          confidence: 'limited',
          evidenceIds: ['largemouth-warden-lorio-1975'],
        },
      },
      cold: {
        dawn: {
          level: 'moderate',
          confidence: 'strong',
          evidenceIds: ['largemouth-hlina-2026-toronto', 'largemouth-warden-lorio-1975'],
        },
        day: {
          level: 'moderate',
          confidence: 'strong',
          evidenceIds: ['largemouth-hlina-2026-toronto', 'largemouth-warden-lorio-1975'],
        },
        dusk: {
          level: 'moderate',
          confidence: 'strong',
          evidenceIds: ['largemouth-hlina-2026-toronto', 'largemouth-warden-lorio-1975'],
        },
        'early-night': {
          level: 'low',
          confidence: 'strong',
          evidenceIds: ['largemouth-hlina-2026-toronto'],
        },
        'late-night': {
          level: 'low',
          confidence: 'strong',
          evidenceIds: ['largemouth-hlina-2026-toronto'],
        },
      },
    },
  },

  contextRules: [
    {
      id: 'largemouth-light-clarity-context',
      variable: 'water-clarity',
      mode: 'context-only',
      confidence: 'strong',
      evidenceIds: ['largemouth-mcmahon-1995-light'],
      condition: {},
      message:
        'Largemouth Bass are capable visual predators at very low light, but prey-capture depth shrinks markedly as available light and water clarity decline. Do not translate laboratory Secchi thresholds directly into the app’s broad clarity labels.',
    },
    {
      id: 'largemouth-movement-vulnerability-caution',
      variable: 'habitat',
      mode: 'context-only',
      confidence: 'strong',
      evidenceIds: ['largemouth-binder-2012-vulnerability'],
      condition: {},
      message:
        'Routine locomotor activity did not explain experimentally selected differences in angling vulnerability, so movement score should not be presented as catch probability.',
    },
  ],

  evidenceIds: [
    'largemouth-hlina-2026-toronto',
    'largemouth-warden-lorio-1975',
    'largemouth-binder-2012-vulnerability',
    'largemouth-mcmahon-1995-light',
  ],

  cautions: [
    'Summer nocturnal movement can be greater than the default profile implies.',
    'Light/clarity effects are mechanistic feeding evidence, not a calibrated catch-rate modifier.',
    'Cold-season activity is reduced but not zero.',
    'The activity index is relative, not a catch probability.',
  ],
}
