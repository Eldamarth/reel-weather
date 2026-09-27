/**
 * Transcribed from
 * `.planning/research/batch-3/reel-weather-channel-catfish-research-dossier.md`.
 *
 * `productionReady: false` is intentional and load-bearing: the strongest
 * adult wild 24-h telemetry source located for this species is a master's
 * thesis (Kruckman 2016), not a peer-reviewed journal article. The evidence
 * strongly suggests nocturnal behavior, but the dossier deliberately fails
 * the production gate pending stronger corroboration (see "Research gate to
 * close" in the dossier). This profile is fully coded and evidence-checked
 * like any other — `SPECIES_PROFILES`/`EVIDENCE_INDEX` in `catalog.ts`
 * include it — but `SPECIES_CATALOG` filters it out of what users can
 * browse/select. Promoting it later should only require flipping
 * `productionReady` to `true` here once the evidence gate closes.
 */
import type { ActivitySpeciesProfile, EvidenceRecord } from '../types'

export const CHANNEL_CATFISH_EVIDENCE: EvidenceRecord[] = [
  {
    id: 'channel-catfish-kruckman-2016-wabash',
    citation:
      'Kruckman, H.G. (2016). Diel and Seasonal Patterns of Channel Catfish Movement and Habitat Use in the Lower Wabash River.',
    year: 2016,
    url: 'https://thekeep.eiu.edu/theses/2504/',
    speciesId: 'channel-catfish',
    evidenceType: 'movement',
    population: {
      location: 'Lower Wabash River, Indiana/Illinois, USA',
      habitat: 'river',
      lifeStage: 'adult',
    },
    study: {
      method: 'Acoustic telemetry with repeated 24-h active tracking',
      sampleSize: '27 tagged Channel Catfish',
      duration: 'September 2014-April 2016',
      seasonsCovered: ['spring', 'summer', 'fall', 'winter'],
    },
    variables: [
      'time-of-day',
      'season',
      'water-temperature',
      'water-level',
      'substrate',
      'bank-distance',
    ],
    finding: {
      summary:
        'Displacement was greatest at night in all four seasons. Movement was greatest in fall and lower in spring; activity increased with decreasing temperature in this river dataset. Daytime fish were often near riprap banks and habitat use shifted seasonally.',
      direction: 'peak',
    },
    applicability: 'high',
    limitations: [
      "Master's thesis rather than peer-reviewed journal article.",
      'Single large-river system.',
      'Movement is not direct feeding/catchability.',
    ],
  },
  {
    id: 'channel-catfish-goudie-1983-circadian',
    citation:
      'Goudie, C.A., Davis, K.B. & Simco, B.A. (1983). Influence of the eyes and pineal gland on locomotor activity patterns of channel catfish, Ictalurus punctatus.',
    year: 1983,
    doi: '10.1086/physzool.56.1.30159960',
    url: 'https://pubs.usgs.gov/publication/1013931',
    speciesId: 'channel-catfish',
    evidenceType: 'movement',
    population: { location: 'Laboratory, USA', habitat: 'laboratory', lifeStage: 'mixed' },
    study: {
      method:
        'Locomotor monitoring under 12:12 light/dark cycles with eye/pineal manipulations and different light intensities',
    },
    variables: ['photoperiod', 'light-intensity', 'circadian-rhythm', 'locomotion'],
    finding: {
      summary:
        'Normal Channel Catfish showed nocturnal locomotor activity corresponding to the dark phase. Sensory manipulations altered entrainment, supporting genuine light-linked circadian control.',
      direction: 'peak',
    },
    applicability: 'moderate',
    limitations: ['Laboratory behavior.', 'Does not measure wild adult angling vulnerability.'],
  },
  {
    id: 'channel-catfish-yamazaki-2019-juvenile-feeding',
    citation:
      'Yamazaki, K., Kanou, K. & Arayama, K. (2019). Nocturnal activity and feeding of juvenile channel catfish, Ictalurus punctatus, around offshore breakwaters in Lake Kasumigaura, Japan.',
    year: 2019,
    doi: '10.1007/s10228-018-0653-4',
    url: 'https://doi.org/10.1007/s10228-018-0653-4',
    speciesId: 'channel-catfish',
    evidenceType: 'feeding',
    population: {
      location: 'Lake Kasumigaura, Japan',
      habitat: 'lake',
      lifeStage: 'juvenile',
      sizeRange: '20-56 mm standard length',
    },
    study: { method: 'Diel occurrence and stomach-content sampling near offshore breakwaters' },
    variables: ['time-of-day', 'feeding', 'occurrence', 'prey-composition'],
    finding: {
      summary:
        'Juveniles occurred more abundantly in evening/night than day and fed mainly during darkness.',
      direction: 'increase',
    },
    applicability: 'limited',
    limitations: ['Juvenile fish.', 'Introduced Japanese lake population.'],
  },
  {
    id: 'channel-catfish-srac-life-history',
    citation: 'Southern Regional Aquaculture Center. Channel Catfish: Life History and Biology.',
    year: 2013,
    url: 'https://extension.rwfm.tamu.edu/wp-content/uploads/sites/8/2013/09/SRAC-Publication-No.-180-Channel-Catfish-Life-History-and-Biology.pdf',
    speciesId: 'channel-catfish',
    evidenceType: 'population-context',
    population: {
      location: 'North American life-history synthesis',
      habitat: 'multiple',
      lifeStage: 'adult',
    },
    study: { method: 'Extension/fisheries biology synthesis' },
    variables: ['time-of-day', 'feeding', 'habitat', 'temperature'],
    finding: {
      summary:
        'The synthesis describes adults as using deep water/cover during daylight and undertaking most movement and feeding at night, especially just after sunset and before sunrise.',
      direction: 'peak',
    },
    applicability: 'moderate',
    limitations: ['Secondary extension synthesis rather than primary experimental evidence.'],
  },
]

export const CHANNEL_CATFISH_PROFILE: ActivitySpeciesProfile = {
  modelKind: 'activity',
  id: 'channel-catfish',
  scientificName: 'Ictalurus punctatus',
  displayName: 'Channel Catfish',
  alternateNames: ['Channel Cat', 'Catfish'],
  iconKey: 'channel-catfish',
  researchCoverage: 'moderate',
  productionReady: false,

  diel: {
    default: {
      'pre-dawn': {
        level: 'high',
        confidence: 'moderate',
        evidenceIds: ['channel-catfish-kruckman-2016-wabash', 'channel-catfish-srac-life-history'],
      },
      dawn: {
        level: 'favorable',
        confidence: 'moderate',
        evidenceIds: ['channel-catfish-kruckman-2016-wabash', 'channel-catfish-srac-life-history'],
      },
      day: {
        level: 'low',
        confidence: 'moderate',
        evidenceIds: [
          'channel-catfish-kruckman-2016-wabash',
          'channel-catfish-goudie-1983-circadian',
          'channel-catfish-srac-life-history',
        ],
      },
      dusk: {
        level: 'high',
        confidence: 'moderate',
        evidenceIds: [
          'channel-catfish-kruckman-2016-wabash',
          'channel-catfish-goudie-1983-circadian',
          'channel-catfish-srac-life-history',
        ],
      },
      'early-night': {
        level: 'peak',
        confidence: 'moderate',
        evidenceIds: [
          'channel-catfish-kruckman-2016-wabash',
          'channel-catfish-goudie-1983-circadian',
          'channel-catfish-yamazaki-2019-juvenile-feeding',
        ],
      },
      'late-night': {
        level: 'high',
        confidence: 'moderate',
        evidenceIds: [
          'channel-catfish-kruckman-2016-wabash',
          'channel-catfish-goudie-1983-circadian',
          'channel-catfish-srac-life-history',
        ],
      },
    },
  },

  contextRules: [
    {
      id: 'channel-catfish-temperature-context',
      variable: 'water-temperature',
      mode: 'context-only',
      confidence: 'limited',
      evidenceIds: ['channel-catfish-kruckman-2016-wabash'],
      condition: {},
      message:
        'The Wabash telemetry thesis found greater movement as temperature decreased in that river system. This local relationship is retained as context and must not be converted to a generic cold-water boost.',
    },
  ],

  evidenceIds: [
    'channel-catfish-kruckman-2016-wabash',
    'channel-catfish-goudie-1983-circadian',
    'channel-catfish-yamazaki-2019-juvenile-feeding',
    'channel-catfish-srac-life-history',
  ],

  cautions: [
    'Production readiness is intentionally false until adult wild nocturnal behavior is corroborated by stronger peer-reviewed primary evidence.',
    'Juvenile and adult behavior should not be assumed identical.',
    'River movement evidence may not transfer directly to ponds/reservoirs.',
    'The activity index is relative, not a catch probability.',
  ],
}
