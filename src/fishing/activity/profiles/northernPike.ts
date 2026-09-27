/**
 * Transcribed from
 * `.planning/research/revised/reel-weather-northern-pike-research-dossier-v2.md`.
 * Do not hand-edit evidence records or rule structures without updating that
 * dossier — this file is the code-side mirror of it, not an independent
 * source.
 */
import type { ActivitySpeciesProfile, EvidenceRecord } from '../types'

export const NORTHERN_PIKE_EVIDENCE: EvidenceRecord[] = [
  {
    id: 'pike-cook-1988-colorado',
    citation:
      'Cook, M.F. & Bergersen, E.P. (1988). Movements, Habitat Selection, and Activity Periods of Northern Pike in Eleven Mile Reservoir, Colorado.',
    year: 1988,
    doi: '10.1577/1548-8659(1988)117<0495:MHSAAP>2.3.CO;2',
    url: 'https://academic.oup.com/tafs/article-abstract/117/5/495/7891908',
    speciesId: 'northern-pike',
    evidenceType: 'movement',
    population: {
      location: 'Eleven Mile Reservoir, Colorado, USA',
      habitat: 'reservoir',
      lifeStage: 'adult',
    },
    study: {
      method: 'Ultrasonic telemetry',
      sampleSize: '21 adult pike',
      duration: 'Individuals monitored up to 13 months',
      seasonsCovered: ['spring', 'summer', 'fall', 'winter'],
    },
    variables: ['time-of-day', 'season', 'habitat'],
    finding: {
      summary:
        'Summer activity showed crepuscular peaks; winter activity showed a daytime/diurnal peak. Pike were most active in April/May and least active in October.',
    },
    applicability: 'high',
    limitations: [
      'Movement/activity is not direct feeding or catchability.',
      'Single reservoir population.',
    ],
  },
  {
    id: 'pike-baktoft-2012-denmark',
    citation:
      'Baktoft, H. et al. (2012). Seasonal and diel effects on the activity of northern pike studied by high-resolution positional telemetry.',
    year: 2012,
    doi: '10.1111/j.1600-0633.2012.00558.x',
    url: 'https://orbit.dtu.dk/en/publications/seasonal-and-diel-effects-on-the-activity-of-northern-pike-studie/',
    speciesId: 'northern-pike',
    evidenceType: 'movement',
    population: { location: 'Temperate lake, Denmark', habitat: 'lake', lifeStage: 'adult' },
    study: {
      method: 'High-resolution acoustic positional telemetry',
      duration: 'Two consecutive years; late summer through winter',
    },
    variables: ['time-of-day', 'season', 'temperature-regime'],
    finding: {
      summary:
        'Activity was consistently greater during daytime than night, while overall activity remained surprisingly similar across the sampled seasonal/temperature periods.',
    },
    applicability: 'high',
    limitations: [
      'One lake.',
      'Movement is not direct feeding/catchability.',
      'Does not cover a complete spring/summer annual cycle.',
    ],
  },
  {
    id: 'pike-hlina-2026-toronto',
    citation:
      'Hlina, B.L. et al. (2026). Seasonal effects on the acceleration of largemouth bass and Northern Pike in Toronto harbour.',
    year: 2026,
    doi: '10.1186/s40317-026-00444-6',
    url: 'https://link.springer.com/article/10.1186/s40317-026-00444-6',
    speciesId: 'northern-pike',
    evidenceType: 'accelerometry',
    population: {
      location: 'Toronto Harbour, Lake Ontario, Canada',
      habitat: 'coastal',
      lifeStage: 'adult',
    },
    study: {
      method: 'Acoustic telemetry with acceleration sensors',
      sampleSize: '20 Northern Pike',
      duration: '38-374 days per tracked individual',
      seasonsCovered: ['spring', 'summer', 'fall', 'winter'],
    },
    variables: ['time-of-day', 'season'],
    finding: {
      summary:
        'Mean acceleration was highest at dusk, followed by dawn, day, and night. Spring/summer acceleration exceeded fall/winter.',
    },
    applicability: 'high',
    limitations: [
      'Acceleration does not identify feeding behavior.',
      'Urban Great Lakes embayment habitat.',
    ],
  },
  {
    id: 'pike-kuparinen-2010-angling',
    citation:
      'Kuparinen, A., Klefoth, T. & Arlinghaus, R. (2010). Abiotic and fishing-related correlates of angling catch rates in pike (Esox lucius).',
    year: 2010,
    doi: '10.1016/j.fishres.2010.03.011',
    url: 'https://www.sciencedirect.com/science/article/pii/S0165783610000755',
    speciesId: 'northern-pike',
    evidenceType: 'angling-cpue',
    population: { location: 'Kleiner Döllnsee, Germany', habitat: 'lake', lifeStage: 'mixed' },
    study: {
      method: 'Experimental catch-and-release angling with generalized linear modeling',
      duration: 'Spring-autumn 2005',
    },
    variables: [
      'time-of-day',
      'water-temperature',
      'wind-speed',
      'moon-phase',
      'recent-fishing-effort',
    ],
    finding: {
      summary:
        'CPUE was higher at dusk and with stronger wind, decreased with increasing water temperature, and declined following greater recent fishing effort.',
    },
    applicability: 'high',
    limitations: [
      'Single 25-ha lake and one fishing year.',
      'Weather/lunar effects require replication before broad scoring.',
    ],
  },
  {
    id: 'pike-turunen-2026-finland',
    citation:
      'Turunen, A. et al. (2026). Does Survey Angling CPUE Reflect Population Density of Northern Pike (Esox lucius) in Small Boreal Lakes?',
    year: 2026,
    doi: '10.1111/fme.70090',
    url: 'https://onlinelibrary.wiley.com/doi/10.1111/fme.70090',
    speciesId: 'northern-pike',
    evidenceType: 'angling-cpue',
    population: { location: '16 boreal lakes, Finland', habitat: 'multiple', lifeStage: 'mixed' },
    study: { method: 'Standardized survey angling', sampleSize: '16 lakes (3.4-22.1 ha)' },
    variables: ['time-of-day', 'water-temperature', 'lure-type', 'lure-color', 'pike-density'],
    finding: {
      summary:
        'CPUE reflected pike density and lure type; no significant time-of-day or water-temperature effects were detected.',
    },
    applicability: 'high',
    limitations: [
      'Small boreal lakes.',
      'Survey-angling protocol may not represent all recreational techniques.',
    ],
  },
  {
    id: 'pike-pierce-2013-minnesota',
    citation:
      'Pierce, R.B., Carlson, A.J., Carlson, B.M., Hudson, D. & Staples, D.F. (2013). Depths and Thermal Habitat Used by Large versus Small Northern Pike in Three Minnesota Lakes.',
    year: 2013,
    doi: '10.1080/00028487.2013.822422',
    url: 'https://onlinelibrary.wiley.com/doi/10.1080/00028487.2013.822422',
    speciesId: 'northern-pike',
    evidenceType: 'thermal-occupancy',
    population: {
      location: 'Three north-central Minnesota lakes, USA',
      habitat: 'multiple',
      lifeStage: 'adult',
      sizeRange: 'Large (>71 cm) and smaller pike compared',
    },
    study: { method: 'Acoustic telemetry and archival depth/temperature tags' },
    variables: ['water-temperature', 'depth', 'body-size', 'dissolved-oxygen'],
    finding: {
      summary:
        'During hot stratified summer conditions, large pike followed cooler thermocline habitat and in August selected roughly 16-21°C water where substantially warmer water was available; smaller pike sometimes remained shallower where dense vegetation provided cover.',
    },
    applicability: 'high',
    limitations: [
      'Thermal habitat selection is not a bite-temperature optimum.',
      'Habitat structure and dissolved oxygen constrained choices.',
    ],
  },
  {
    id: 'pike-britton-2024-severn',
    citation:
      'Britton et al. (2024). Movements and habitat use of native and invasive piscivorous fishes in a temperate and channelized lowland river.',
    year: 2024,
    doi: '10.1007/s10750-024-05533-2',
    url: 'https://eprints.bournemouth.ac.uk/39754/',
    speciesId: 'northern-pike',
    evidenceType: 'movement',
    population: { location: 'Lower River Severn, England', habitat: 'river', lifeStage: 'adult' },
    study: {
      method: '12-month acoustic telemetry',
      seasonsCovered: ['spring', 'summer', 'fall', 'winter'],
    },
    variables: ['season', 'water-temperature', 'habitat-use'],
    finding: {
      summary:
        'Pike movement varied seasonally; movement was greater in spring and increased with water temperature up to roughly 15°C before declining at higher temperatures.',
    },
    applicability: 'moderate',
    limitations: [
      'Channelized river environment with strong habitat constraints.',
      'Movement relationship is not a catchability optimum.',
    ],
  },
  {
    id: 'pike-nilsson-ortman-2026-feeding',
    citation:
      'Nilsson-Örtman, V., Nilsson, E. & Brönmark, C. (2026). Effects of temperature and browning on the functional response of a freshwater top predator.',
    year: 2026,
    doi: '10.1111/1365-2656.70233',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC13145305/',
    speciesId: 'northern-pike',
    evidenceType: 'feeding',
    population: {
      location: 'Laboratory experiment, Sweden',
      habitat: 'laboratory',
      lifeStage: 'juvenile',
    },
    study: {
      method: 'Controlled pike-roach functional-response experiment',
      sampleSize: '24 young-of-year pike; 192 feeding trials',
    },
    variables: ['water-temperature', 'water-color', 'prey-density'],
    finding: {
      summary:
        'Across 5, 9 and 13°C and clear versus moderately brown water, treatment effects on functional-response parameters were weaker and less monotonic than simple temperature-based feeding rules would predict.',
    },
    applicability: 'limited',
    limitations: [
      'Young-of-year fish in laboratory arenas.',
      'Not directly transferable to adult recreational angling.',
    ],
  },
  {
    id: 'pike-ovidio-2005-spawning',
    citation:
      'Ovidio, M. & Philippart, J.-C. (2005). Long range seasonal movements of northern pike (Esox lucius L.) in the barbel zone of the River Ourthe (River Meuse basin, Belgium).',
    year: 2005,
    url: 'https://orbi.uliege.be/handle/2268/6137',
    speciesId: 'northern-pike',
    evidenceType: 'reproduction',
    population: { location: 'River Ourthe, Belgium', habitat: 'river', lifeStage: 'adult' },
    study: {
      method: 'Radio telemetry',
      sampleSize: '6 adult pike',
      duration: '149-349 days per fish',
    },
    variables: ['spawning-migration', 'water-temperature', 'season'],
    finding: {
      summary:
        'All tagged pike initiated upstream spawning migrations between early February and late March when mean water temperatures were approximately 6.7-8.7°C.',
    },
    applicability: 'moderate',
    limitations: [
      'Small sample from one river population.',
      'Spawning movement does not establish lure catchability.',
    ],
  },
  {
    id: 'pike-vehanen-2006-spawning',
    citation:
      'Vehanen, T., Hyvärinen, P., Johansson, K. & Laaksonen, T. (2006). Patterns of movement of adult northern pike (Esox lucius L.) in a regulated river.',
    year: 2006,
    doi: '10.1111/j.1600-0633.2006.00151.x',
    url: 'https://doi.org/10.1111/j.1600-0633.2006.00151.x',
    speciesId: 'northern-pike',
    evidenceType: 'reproduction',
    population: {
      location: 'River Kajaaninjoki / Lake Oulujärvi, Finland',
      habitat: 'river',
      lifeStage: 'adult',
    },
    study: {
      method: 'Radio telemetry',
      sampleSize: '40 adult pike',
      duration: 'May 2002-June 2003',
      seasonsCovered: ['spring', 'summer', 'fall', 'winter'],
    },
    variables: ['spawning-migration', 'residency', 'season', 'body-size'],
    finding: {
      summary:
        'The population contained both resident and migratory strategies: 16 remained river-resident while 24 moved to Lake Oulujärvi after spawning, with many migrants returning to the same spawning area the following year.',
    },
    applicability: 'moderate',
    limitations: [
      'Regulated river/lake system.',
      'Demonstrates strong population and individual variability.',
    ],
  },
]

export const NORTHERN_PIKE_PROFILE: ActivitySpeciesProfile = {
  modelKind: 'activity',
  id: 'northern-pike',

  scientificName: 'Esox lucius',
  displayName: 'Northern Pike',
  alternateNames: ['Pike', 'Jackfish', 'Jack'],
  iconKey: 'northern-pike',

  researchCoverage: 'strong',
  productionReady: true,

  diel: {
    default: {
      'pre-dawn': {
        level: 'moderate',
        confidence: 'moderate',
        evidenceIds: [
          'pike-cook-1988-colorado',
          'pike-baktoft-2012-denmark',
          'pike-hlina-2026-toronto',
        ],
      },
      dawn: {
        level: 'high',
        confidence: 'strong',
        evidenceIds: ['pike-cook-1988-colorado', 'pike-hlina-2026-toronto'],
      },
      day: {
        level: 'favorable',
        confidence: 'strong',
        evidenceIds: [
          'pike-cook-1988-colorado',
          'pike-baktoft-2012-denmark',
          'pike-hlina-2026-toronto',
        ],
      },
      dusk: {
        level: 'peak',
        confidence: 'strong',
        evidenceIds: [
          'pike-cook-1988-colorado',
          'pike-hlina-2026-toronto',
          'pike-kuparinen-2010-angling',
          'pike-turunen-2026-finland',
        ],
        note: 'Telemetry/accelerometry repeatedly supports crepuscular elevation and one experimental angling study found higher dusk CPUE; a 16-lake Finnish angling study found no time-of-day effect, so the catchability effect is not universal.',
      },
      'early-night': {
        level: 'moderate',
        confidence: 'moderate',
        evidenceIds: ['pike-baktoft-2012-denmark', 'pike-hlina-2026-toronto'],
      },
      'late-night': {
        level: 'low',
        confidence: 'strong',
        evidenceIds: ['pike-baktoft-2012-denmark', 'pike-hlina-2026-toronto'],
      },
    },

    seasonalOverrides: {
      warm: {
        dawn: {
          level: 'high',
          confidence: 'strong',
          evidenceIds: ['pike-cook-1988-colorado', 'pike-hlina-2026-toronto'],
        },
        dusk: {
          level: 'peak',
          confidence: 'strong',
          evidenceIds: [
            'pike-cook-1988-colorado',
            'pike-hlina-2026-toronto',
            'pike-kuparinen-2010-angling',
          ],
        },
      },
      cold: {
        day: {
          level: 'high',
          confidence: 'moderate',
          evidenceIds: ['pike-cook-1988-colorado', 'pike-baktoft-2012-denmark'],
        },
        dusk: {
          level: 'favorable',
          confidence: 'moderate',
          evidenceIds: [
            'pike-cook-1988-colorado',
            'pike-baktoft-2012-denmark',
            'pike-hlina-2026-toronto',
          ],
        },
      },
    },
  },

  contextRules: [
    {
      id: 'pike-large-summer-thermal-habitat',
      variable: 'water-temperature',
      mode: 'context-only',
      confidence: 'moderate',
      evidenceIds: ['pike-pierce-2013-minnesota'],
      condition: { min: 21 },
      message:
        'Under warm stratified summer conditions, larger pike may shift toward cooler/deeper habitat where suitable thermal refuge exists. The cited field study observed large fish selecting roughly 16-21°C water when warmer habitat was available; this is not a bite-temperature rule.',
    },
    {
      id: 'pike-spring-spawning-context',
      variable: 'reproductive-state',
      mode: 'context-only',
      confidence: 'moderate',
      evidenceIds: ['pike-ovidio-2005-spawning', 'pike-vehanen-2006-spawning'],
      condition: { equals: 'spring-spawning-context' },
      message:
        'Spring spawning can produce major shallow/migratory movements, but local timing and movement strategy vary and should not be interpreted automatically as increased catchability.',
    },
    {
      id: 'pike-wind-evidence-note',
      variable: 'wind-speed',
      mode: 'context-only',
      confidence: 'limited',
      evidenceIds: ['pike-kuparinen-2010-angling'],
      condition: {},
      message:
        'One experimental lake study found higher pike CPUE with stronger wind. This is retained as limited evidence but does not change the V1 activity score.',
    },
  ],

  evidenceIds: [
    'pike-cook-1988-colorado',
    'pike-baktoft-2012-denmark',
    'pike-hlina-2026-toronto',
    'pike-kuparinen-2010-angling',
    'pike-turunen-2026-finland',
    'pike-pierce-2013-minnesota',
    'pike-britton-2024-severn',
    'pike-nilsson-ortman-2026-feeding',
    'pike-ovidio-2005-spawning',
    'pike-vehanen-2006-spawning',
  ],

  cautions: [
    'Activity, feeding and lure catchability are related but not identical outcomes.',
    'Pike show substantial individual and population-level variation.',
    'Habitat structure, thermoclines and dissolved oxygen can change accessibility.',
    'Water temperature must not be inferred directly from air temperature.',
    'The activity index is relative and is not a probability of capture.',
  ],
}
