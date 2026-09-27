/**
 * Transcribed from
 * `.planning/research/revised/reel-weather-european-perch-research-dossier-v2.md`,
 * with one deliberate addition beyond the dossier: `perch-murky-turbidity-caveat`
 * below. Per the maintainer's explicit instruction (2026-09-26), the dossier's
 * `perch-very-turbid-diel-flattening` rule stays keyed to `'very-turbid'` — a
 * reserved schema seam for a future, more specific water-optics input — and is
 * never triggered by the app's existing three-state `WaterClarity` ('clear' |
 * 'stained' | 'murky'), which is broader than the hypereutrophic condition
 * Jacobsen et al. 2015 actually studied. `perch-murky-turbidity-caveat` is a
 * second, separate context-only rule that *does* key off the current 'murky'
 * value, purely to surface cautious explanatory copy — it carries no
 * `levelDelta` and can never move the score, by construction (`mode:
 * 'context-only'`), so the ordinary Perch diel profile is unchanged by
 * Clear/Stained/Murky in V1.
 */
import type { ActivitySpeciesProfile, EvidenceRecord } from '../types'

export const EUROPEAN_PERCH_EVIDENCE: EvidenceRecord[] = [
  {
    id: 'perch-jacobsen-2002-denmark',
    citation:
      'Jacobsen, L., Berg, S., Broberg, M., Jepsen, N. & Skov, C. (2002). Activity and food choice of piscivorous perch (Perca fluviatilis) in a eutrophic shallow lake: a radio-telemetry study.',
    year: 2002,
    doi: '10.1046/j.1365-2427.2002.01005.x',
    url: 'https://onlinelibrary.wiley.com/doi/abs/10.1046/j.1365-2427.2002.01005.x',
    speciesId: 'european-perch',
    evidenceType: 'movement',
    population: {
      location: 'Shallow eutrophic lake, Denmark',
      habitat: 'lake',
      lifeStage: 'adult',
      sizeRange: 'Large piscivorous perch, approximately 27-37 cm',
    },
    study: {
      method: 'Radio telemetry with repeated 24-h tracking',
      duration: 'August 1997-July 1998',
      seasonsCovered: ['spring', 'summer', 'fall', 'winter'],
    },
    variables: ['time-of-day', 'season', 'water-temperature', 'day-length'],
    finding: {
      summary:
        'Activity was predominantly daytime, with dawn/dusk or midday peaks. The day/night pattern was strongest October-April and much less pronounced in midsummer. Daily distance moved increased with temperature.',
    },
    applicability: 'high',
    limitations: ['One lake.', 'Movement/activity is not direct lure catchability.'],
  },
  {
    id: 'perch-jacobsen-2015-turbidity',
    citation:
      'Jacobsen, L., Berg, S., Baktoft, H. & Skov, C. (2015). Behavioural strategy of large perch Perca fluviatilis varies between a mesotrophic and a hypereutrophic lake.',
    year: 2015,
    doi: '10.1111/jfb.12613',
    url: 'https://orbit.dtu.dk/en/publications/behavioural-strategy-of-large-perch-perca-fluviatilis-varies-betw/',
    speciesId: 'european-perch',
    evidenceType: 'movement',
    population: {
      location: 'Two Danish lakes: mesotrophic and hypereutrophic',
      habitat: 'multiple',
      lifeStage: 'adult',
      sizeRange: 'Large perch, approximately 29-42 cm',
    },
    study: {
      method: 'Radio telemetry',
      sampleSize: '20 adult perch tagged in each lake',
      duration: 'Six 24-h tracking periods across one year',
      seasonsCovered: ['spring', 'summer', 'fall', 'winter'],
    },
    variables: ['time-of-day', 'turbidity', 'habitat-use', 'season'],
    finding: {
      summary:
        'In the mesotrophic lake, summer activity was distinctly crepuscular. In the hypereutrophic/turbid lake, large perch were uniformly active throughout the diel cycle. Winter showed crepuscular patterns in both lakes.',
    },
    applicability: 'high',
    limitations: [
      'Two specific lakes.',
      'Hypereutrophic turbidity should not be treated as identical to ordinary slightly stained water.',
    ],
  },
  {
    id: 'perch-nakayama-2018-annual',
    citation:
      'Nakayama, S. et al. (2018). Fine-scale movement ecology of a freshwater top predator, Eurasian perch (Perca fluviatilis), in response to the abiotic environment over the course of a year.',
    year: 2018,
    doi: '10.1111/eff.12393',
    url: 'https://onlinelibrary.wiley.com/doi/10.1111/eff.12393',
    speciesId: 'european-perch',
    evidenceType: 'movement',
    population: { location: '25-ha natural lake, Germany', habitat: 'lake', lifeStage: 'adult' },
    study: {
      method: 'Fine-scale 3-D acoustic positioning',
      sampleSize: '16 adult piscivorous perch',
      duration: 'Whole year',
      seasonsCovered: ['spring', 'summer', 'fall', 'winter'],
    },
    variables: [
      'time-of-day',
      'water-temperature',
      'light-intensity',
      'pressure',
      'wind',
      'lunar-phase',
    ],
    finding: {
      summary:
        'Swimming activity and activity space were greater by day than night and increased with water temperature and light intensity; pressure, wind and lunar variables explained smaller amounts of variation.',
    },
    applicability: 'high',
    limitations: [
      'Movement is not direct catchability.',
      'Small effects of weather variables should not be promoted into strong angling rules.',
    ],
  },
  {
    id: 'perch-heermann-2013-angling',
    citation:
      'Heermann, L. et al. (2013). Explaining recreational angling catch rates of Eurasian perch, Perca fluviatilis: the role of natural and fishing-related environmental factors.',
    year: 2013,
    doi: '10.1111/fme.12000',
    url: 'https://onlinelibrary.wiley.com/doi/10.1111/fme.12000',
    speciesId: 'european-perch',
    evidenceType: 'angling-cpue',
    population: {
      location: '21 lakes in Mecklenburg-Vorpommern, Germany, plus experimental gravel-pit fishery',
      habitat: 'multiple',
      lifeStage: 'mixed',
    },
    study: {
      method: 'Angling diaries plus experimental fishery',
      sampleSize: '21-lake diary study; separate 2008 experimental fishery',
      duration: 'Diary data 2006/2007; experimental fishery 2008',
    },
    variables: [
      'season',
      'water-transparency',
      'angler-experience',
      'species-preference',
      'bait-lure-type',
      'food-availability',
    ],
    finding: {
      summary:
        'Angler factors strongly influenced catch rates. Water transparency and nutritional/environmental conditions affected catch number or fish size, and catch rates varied seasonally; the experimental fishery found particularly high catchability associated with autumn food limitation.',
    },
    applicability: 'high',
    limitations: [
      'Does not provide a clean hourly diel CPUE curve.',
      'Angler behavior and lure choice substantially affect catches.',
    ],
  },
  {
    id: 'perch-monk-2018-vulnerability',
    citation:
      'Monk, C.T. & Arlinghaus, R. (2018). Eurasian perch, Perca fluviatilis, spatial behaviour determines vulnerability independent of angler skill in a whole-lake reality mining experiment.',
    year: 2018,
    doi: '10.1139/cjfas-2017-0029',
    url: 'https://doi.org/10.1139/cjfas-2017-0029',
    speciesId: 'european-perch',
    evidenceType: 'angling-cpue',
    population: {
      location: 'Whole-lake experiment, Germany',
      habitat: 'lake',
      lifeStage: 'adult',
      sizeRange: 'Large perch',
    },
    study: {
      method: 'Fine-scale acoustic telemetry paired with experimental anglers',
      sampleSize: '33 tracked large perch in the angling analysis; 104 experimental anglers',
    },
    variables: ['spatial-behavior', 'swimming-activity', 'angler-skill', 'vulnerability'],
    finding: {
      summary:
        'Angling vulnerability was strongly related to repeatable spatial/habitat-choice behavior but was not explained by swimming activity as a personality trait.',
    },
    applicability: 'high',
    limitations: [
      'This directly warns against treating movement intensity as identical to lure vulnerability.',
      'Does not define a diel catchability curve.',
    ],
  },
  {
    id: 'perch-jensen-2017-physiology',
    citation:
      'Jensen, D.L. et al. (2017). Temperature effects on aerobic scope and cardiac performance of European perch (Perca fluviatilis).',
    year: 2017,
    doi: '10.1016/j.jtherbio.2017.04.006',
    url: 'https://pubmed.ncbi.nlm.nih.gov/28797476/',
    speciesId: 'european-perch',
    evidenceType: 'thermal-physiology',
    population: {
      location: 'Laboratory physiology study',
      habitat: 'laboratory',
      lifeStage: 'mixed',
    },
    study: { method: 'Thermal physiology / aerobic-scope experiment' },
    variables: ['water-temperature', 'aerobic-scope', 'cardiac-performance'],
    finding: {
      summary:
        'Aerobic scope increased from cold temperatures toward roughly 21°C and then leveled; the study defines physiological performance, not a fishing optimum.',
    },
    applicability: 'moderate',
    limitations: [
      'Physiology is not catchability.',
      'Do not convert ~21°C into an ideal bite temperature.',
    ],
  },
  {
    id: 'perch-christensen-2020-size-temp',
    citation:
      'Christensen, E.A.F., Svendsen, M.B.S. & Steffensen, J.F. (2020). The combined effect of body size and temperature on oxygen consumption rates and the size-dependency of preferred temperature in European perch Perca fluviatilis.',
    year: 2020,
    doi: '10.1111/jfb.14435',
    url: 'https://pubmed.ncbi.nlm.nih.gov/32557687/',
    speciesId: 'european-perch',
    evidenceType: 'thermal-physiology',
    population: {
      location: 'Laboratory study, Denmark',
      habitat: 'laboratory',
      lifeStage: 'mixed',
    },
    study: { method: 'Respirometry plus temperature-preference experiments' },
    variables: ['body-size', 'preferred-temperature', 'metabolism'],
    finding: {
      summary:
        'Preferred temperature and aerobic-performance optimum decreased with increasing body size, demonstrating that a single species-wide preferred temperature is misleading.',
    },
    applicability: 'moderate',
    limitations: ['Laboratory physiology/preference rather than wild angling.'],
  },
  {
    id: 'perch-skovrind-2013-brackish-spawning',
    citation:
      'Skovrind, M. et al. (2013). Marine spawning sites of perch Perca fluviatilis revealed by oviduct-inserted acoustic transmitters.',
    year: 2013,
    doi: '10.3354/ab00529',
    url: 'https://www.int-res.com/journals/ab/articles/ab00529',
    speciesId: 'european-perch',
    evidenceType: 'reproduction',
    population: { location: 'Køge Bugt region, Denmark', habitat: 'brackish', lifeStage: 'adult' },
    study: { method: 'Acoustic telemetry / spawning-site identification' },
    variables: ['spawning', 'brackish-habitat', 'salinity'],
    finding: {
      summary:
        'Danish perch can use marine/brackish spawning sites, confirming that coastal/brackish populations may require habitat-specific context.',
    },
    applicability: 'moderate',
    limitations: ['Spawning-site evidence does not define hourly angling activity.'],
  },
]

export const EUROPEAN_PERCH_PROFILE: ActivitySpeciesProfile = {
  modelKind: 'activity',
  id: 'european-perch',

  scientificName: 'Perca fluviatilis',
  displayName: 'European Perch',
  alternateNames: ['Eurasian Perch', 'Perch', 'Aborre'],
  iconKey: 'european-perch',

  researchCoverage: 'strong',
  productionReady: true,

  diel: {
    default: {
      'pre-dawn': {
        level: 'moderate',
        confidence: 'moderate',
        evidenceIds: ['perch-jacobsen-2002-denmark', 'perch-nakayama-2018-annual'],
      },
      dawn: {
        level: 'high',
        confidence: 'strong',
        evidenceIds: ['perch-jacobsen-2002-denmark', 'perch-jacobsen-2015-turbidity'],
      },
      day: {
        level: 'high',
        confidence: 'strong',
        evidenceIds: ['perch-jacobsen-2002-denmark', 'perch-nakayama-2018-annual'],
      },
      dusk: {
        level: 'high',
        confidence: 'strong',
        evidenceIds: ['perch-jacobsen-2002-denmark', 'perch-jacobsen-2015-turbidity'],
      },
      'early-night': {
        level: 'moderate',
        confidence: 'strong',
        evidenceIds: ['perch-jacobsen-2002-denmark', 'perch-nakayama-2018-annual'],
      },
      'late-night': {
        level: 'low',
        confidence: 'strong',
        evidenceIds: ['perch-jacobsen-2002-denmark', 'perch-nakayama-2018-annual'],
      },
    },

    seasonalOverrides: {
      warm: {
        dawn: {
          level: 'high',
          confidence: 'moderate',
          evidenceIds: ['perch-jacobsen-2002-denmark'],
          note: 'Midsummer activity can be more evenly distributed through daylight, so do not overemphasize a narrow crepuscular peak.',
        },
        day: {
          level: 'high',
          confidence: 'strong',
          evidenceIds: ['perch-jacobsen-2002-denmark', 'perch-nakayama-2018-annual'],
        },
        dusk: {
          level: 'high',
          confidence: 'moderate',
          evidenceIds: ['perch-jacobsen-2002-denmark'],
        },
      },
      cold: {
        dawn: {
          level: 'high',
          confidence: 'strong',
          evidenceIds: ['perch-jacobsen-2002-denmark', 'perch-jacobsen-2015-turbidity'],
        },
        day: {
          level: 'high',
          confidence: 'strong',
          evidenceIds: ['perch-jacobsen-2002-denmark'],
        },
        dusk: {
          level: 'high',
          confidence: 'strong',
          evidenceIds: ['perch-jacobsen-2002-denmark', 'perch-jacobsen-2015-turbidity'],
        },
      },
    },
  },

  contextRules: [
    {
      id: 'perch-very-turbid-diel-flattening',
      variable: 'water-clarity',
      mode: 'context-only',
      confidence: 'strong',
      evidenceIds: ['perch-jacobsen-2015-turbidity'],
      condition: { equals: 'very-turbid' },
      message:
        'In a hypereutrophic/turbid Danish lake, large perch remained active throughout the diel cycle, unlike the stronger crepuscular/daylight pattern in a mesotrophic lake. Reserved for a future, more specific water-optics input — not triggered by the current broader "murky" setting.',
    },
    {
      id: 'perch-murky-turbidity-caveat',
      variable: 'water-clarity',
      mode: 'context-only',
      confidence: 'strong',
      evidenceIds: ['perch-jacobsen-2015-turbidity'],
      condition: { equals: 'murky' },
      message:
        'Very turbid/hypereutrophic conditions have been observed to reduce the normal day/night activity contrast in large perch. The current "murky" setting is broader than the conditions studied, so this is not applied as a score change.',
    },
    {
      id: 'perch-temperature-movement-context',
      variable: 'water-temperature',
      mode: 'context-only',
      confidence: 'moderate',
      evidenceIds: [
        'perch-nakayama-2018-annual',
        'perch-jensen-2017-physiology',
        'perch-christensen-2020-size-temp',
      ],
      condition: {},
      message:
        'Perch movement and thermal physiology change with water temperature, but body size matters and the evidence does not support one universal "best bite temperature."',
    },
    {
      id: 'perch-angling-seasonality-context',
      variable: 'habitat',
      mode: 'context-only',
      confidence: 'moderate',
      evidenceIds: ['perch-heermann-2013-angling', 'perch-monk-2018-vulnerability'],
      condition: {},
      message:
        'Direct angling studies show that catchability depends heavily on angler/lure choice, habitat behavior, food availability, water transparency and season; movement intensity alone should not be treated as catch probability.',
    },
  ],

  evidenceIds: [
    'perch-jacobsen-2002-denmark',
    'perch-jacobsen-2015-turbidity',
    'perch-nakayama-2018-annual',
    'perch-heermann-2013-angling',
    'perch-monk-2018-vulnerability',
    'perch-jensen-2017-physiology',
    'perch-christensen-2020-size-temp',
    'perch-skovrind-2013-brackish-spawning',
  ],

  cautions: [
    'Very turbid/hypereutrophic conditions can substantially alter the normal daylight-oriented curve.',
    'Movement intensity is not identical to angling vulnerability.',
    'Water temperature effects are size- and context-dependent.',
    'Brackish/coastal perch populations may require future habitat-specific variants.',
    'The activity index is relative and is not a probability of capture.',
  ],
}
