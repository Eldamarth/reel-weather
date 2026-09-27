/**
 * Transcribed from
 * `.planning/research/revised/reel-weather-sea-trout-research-dossier-v2.md`.
 * Modeled as `accessibility`, not `activity` — the evidence is strong for
 * depth/habitat use but not for an hourly catchability curve, so it must not
 * be forced into a fake peaked activity score (design brief section 9/17).
 * Taxonomically Brown Trout (`Salmo trutta`); Sea Trout is the coastal
 * life-history variant, not a separate species.
 */
import type { AccessibilitySpeciesProfile, EvidenceRecord } from '../types'

export const SEA_TROUT_COASTAL_EVIDENCE: EvidenceRecord[] = [
  {
    id: 'trout-kristensen-2018-denmark-depth',
    citation:
      'Kristensen, M.L., Righton, D., del Villar-Guerra, D., Baktoft, H. & Aarestrup, K. (2018). Temperature and depth preferences of adult sea trout Salmo trutta during the marine migration phase.',
    year: 2018,
    doi: '10.3354/meps12618',
    url: 'https://orbit.dtu.dk/en/publications/temperature-and-depth-preferences-of-adult-sea-trout-salmo-trutta/',
    speciesId: 'brown-trout',
    variantId: 'coastal-sea-trout',
    evidenceType: 'habitat-use',
    population: {
      location: 'Danish coastal/marine waters',
      habitat: 'coastal',
      lifeStage: 'adult',
      sizeRange: 'Tagged post-spawn sea trout 460-925 mm',
    },
    study: {
      method: 'Archival depth/temperature tags',
      sampleSize: '125 tagged; 8 full marine-cycle tags recovered',
      duration: 'Marine periods 47-142 days (mean ~96 days)',
    },
    variables: ['time-of-day', 'depth', 'water-temperature', 'day-length'],
    finding: {
      summary:
        'Fish occupied 0-3 m about 63.8% of the time, made repeated deeper dives primarily by day, and were generally shallower at night. Mean residence depth increased markedly in warmer water; above roughly 17°C the characteristic shallow/dive pattern changed and fish often occupied deeper habitat.',
    },
    applicability: 'high',
    limitations: [
      'Depth/accessibility is not direct lure catchability.',
      'Only eight archival tags yielded complete marine-cycle records.',
    ],
  },
  {
    id: 'trout-eldoy-2017-norway-depth',
    citation:
      'Eldøy, S.H. et al. (2017). Marine depth use of sea trout Salmo trutta in fjord areas of central Norway.',
    year: 2017,
    doi: '10.1111/jfb.13463',
    url: 'https://pubmed.ncbi.nlm.nih.gov/28913953/',
    speciesId: 'brown-trout',
    variantId: 'coastal-sea-trout',
    evidenceType: 'habitat-use',
    population: { location: 'Central Norwegian fjords', habitat: 'coastal', lifeStage: 'adult' },
    study: {
      method: 'Acoustic telemetry',
      sampleSize: '44 veteran sea trout',
      duration: 'May-February',
    },
    variables: ['time-of-day', 'season', 'depth', 'temperature', 'habitat', 'body-size'],
    finding: {
      summary:
        'Sea trout were generally shallow; daytime depth was modestly deeper than nighttime depth, and depth varied with season, temperature, habitat and body size.',
    },
    applicability: 'high',
    limitations: [
      'Fjord habitat differs from all Danish coasts.',
      'Depth use is not direct catchability.',
    ],
  },
  {
    id: 'trout-kristensen-migration-denmark',
    citation:
      'Kristensen et al. Migration routes and habitat use of a highly adaptable salmonid (sea trout, Salmo trutta) in a complex marine area.',
    year: 2019,
    doi: '10.1186/s40317-019-0185-3',
    url: 'https://orbit.dtu.dk/en/publications/migration-routes-and-habitat-use-of-a-highly-adaptable-salmonid-s/',
    speciesId: 'brown-trout',
    variantId: 'coastal-sea-trout',
    evidenceType: 'habitat-use',
    population: { location: 'Danish coastal waters', habitat: 'coastal', lifeStage: 'adult' },
    study: { method: 'Reconstructed marine migration tracks' },
    variables: ['season', 'coastal-distance', 'temperature', 'depth'],
    finding: {
      summary:
        'Fish remained strongly coastal while some traveled hundreds of kilometers alongshore; they used rapidly warming shallow/stratified spring areas and deeper, more thermally stable habitats later in warmer summer conditions.',
    },
    applicability: 'high',
    limitations: ['Seasonal habitat use is not hourly bite probability.'],
  },
  {
    id: 'trout-staveley-2024-skagerrak',
    citation:
      'Staveley et al. (2024). Sea trout (Salmo trutta) activity and movement patterns in response to environmental cues in a fjord system.',
    year: 2024,
    doi: '10.1002/aff2.192',
    url: 'https://doi.org/10.1002/aff2.192',
    speciesId: 'brown-trout',
    variantId: 'coastal-sea-trout',
    evidenceType: 'movement',
    population: {
      location: 'Gullmar Fjord, Swedish Skagerrak',
      habitat: 'coastal',
      lifeStage: 'adult',
    },
    study: {
      method: 'Acoustic telemetry',
      sampleSize: '20 tagged sea trout',
      duration: 'August-January',
    },
    variables: ['sea-surface-temperature', 'wind-direction', 'pressure', 'time-of-day'],
    finding: {
      summary:
        'Sea-surface temperature and east-west wind direction were among the strongest environmental correlates of detections; some individuals showed diel patterns, but the data did not establish one universal hourly curve.',
    },
    applicability: 'moderate',
    limitations: [
      'Single fjord system.',
      'Detection patterns are not direct angling catchability.',
    ],
  },
  {
    id: 'trout-skov-2022-denmark-angling',
    citation:
      'Skov, C. et al. (2022). Catch and release angling for sea trout explored by citizen science: Angler behavior, hooking location and bleeding patterns.',
    year: 2022,
    doi: '10.1016/j.fishres.2022.106451',
    url: 'https://www.sciencedirect.com/science/article/pii/S0165783622002284',
    speciesId: 'brown-trout',
    variantId: 'coastal-sea-trout',
    evidenceType: 'angling-cpue',
    population: { location: 'Denmark', habitat: 'multiple', lifeStage: 'mixed' },
    study: {
      method: 'Citizen-science recreational-angling records',
      sampleSize: '35,826 sea trout captures reported by 1,838 anglers',
      duration: 'January 2016-August 2021',
    },
    variables: ['angling-method', 'hooking', 'bleeding', 'catch-release'],
    finding: {
      summary:
        'The dataset demonstrates exceptionally rich Danish coastal angling observations, but the published analysis did not provide an effort-standardized hourly bite/catchability model suitable for Reel Weather scoring.',
    },
    applicability: 'moderate',
    limitations: ['Study focus was catch-and-release outcomes rather than diel CPUE.'],
  },
  {
    id: 'trout-aarestrup-jepsen-1998-spawning',
    citation:
      'Aarestrup, K. & Jepsen, N. (1998). Spawning migration of sea trout (Salmo trutta L.) in a Danish river.',
    year: 1998,
    doi: '10.1023/A:1017074011007',
    url: 'https://orbit.dtu.dk/en/publications/spawning-migration-of-sea-trout-salmo-trutta-l-in-a-danish-river/',
    speciesId: 'brown-trout',
    variantId: 'coastal-sea-trout',
    evidenceType: 'reproduction',
    population: {
      location: 'Randers Fjord / River Gudenå, Denmark',
      habitat: 'river',
      lifeStage: 'adult',
    },
    study: {
      method: 'Radio telemetry',
      sampleSize: '49 mature sea trout tagged September-November',
    },
    variables: ['spawning-migration', 'residence', 'individual-variation'],
    finding: {
      summary:
        'Mature sea trout showed substantial individual variation in freshwater spawning migration and residence behavior.',
    },
    applicability: 'moderate',
    limitations: ['Reproductive migration does not define coastal feeding/catchability.'],
  },
]

export const SEA_TROUT_COASTAL_PROFILE: AccessibilitySpeciesProfile = {
  modelKind: 'accessibility',

  id: 'brown-trout',
  variantId: 'coastal-sea-trout',

  scientificName: 'Salmo trutta',
  displayName: 'Sea Trout — Coastal',
  alternateNames: ['Sea Trout', 'Seatrout', 'Coastal Brown Trout', 'Havørred'],
  iconKey: 'sea-trout',

  researchCoverage: 'moderate',
  productionReady: true,

  rules: [
    {
      id: 'sea-trout-night-shallower',
      variable: 'solar-phase',
      confidence: 'strong',
      evidenceIds: ['trout-kristensen-2018-denmark-depth', 'trout-eldoy-2017-norway-depth'],
      condition: { phase: 'early-night' },
      accessibility: 'favorable',
      message:
        'Tagged Scandinavian sea trout were generally shallower at night than during daylight, which can improve shallow/coastal accessibility. This is not proof of higher bite probability.',
    },
    {
      id: 'sea-trout-late-night-shallower',
      variable: 'solar-phase',
      confidence: 'strong',
      evidenceIds: ['trout-kristensen-2018-denmark-depth', 'trout-eldoy-2017-norway-depth'],
      condition: { phase: 'late-night' },
      accessibility: 'favorable',
      message:
        'Nighttime depth use was generally shallower in the reviewed Scandinavian telemetry.',
    },
    {
      id: 'sea-trout-daytime-diving',
      variable: 'solar-phase',
      confidence: 'strong',
      evidenceIds: ['trout-kristensen-2018-denmark-depth'],
      condition: { phase: 'day' },
      accessibility: 'neutral',
      message:
        'Adult sea trout remained broadly shallow overall but made repeated deeper dives during daylight.',
    },
    {
      id: 'sea-trout-warm-water-deeper',
      variable: 'water-temperature',
      confidence: 'strong',
      evidenceIds: ['trout-kristensen-2018-denmark-depth', 'trout-kristensen-migration-denmark'],
      condition: { min: 17 },
      accessibility: 'reduced',
      message:
        'In Danish archival-tag data, warm marine temperatures were associated with substantially deeper habitat use, especially above roughly 17°C. Treat this as depth/accessibility guidance, not a universal bite cutoff.',
    },
  ],

  evidenceIds: [
    'trout-kristensen-2018-denmark-depth',
    'trout-eldoy-2017-norway-depth',
    'trout-kristensen-migration-denmark',
    'trout-staveley-2024-skagerrak',
    'trout-skov-2022-denmark-angling',
    'trout-aarestrup-jepsen-1998-spawning',
  ],

  cautions: [
    'This profile models coastal habitat/accessibility, not a validated hourly bite curve.',
    'Freshwater Brown Trout activity studies must not be copied unchanged onto coastal Sea Trout.',
    'Coastal habitat use varies by season, temperature, individual and local geography.',
    'Water temperature must not be inferred directly from air temperature.',
  ],
}
