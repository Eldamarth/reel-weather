import { HAZARD_FLAG_MIN_MODELS, HIGH_WIND_GUST_KPH } from '../config/hazardThresholds'
import type { HazardFlag, HazardType, NormalizedForecastPoint } from './models'
import { HEAVY_RAIN_CODES, HEAVY_SNOW_CODES, THUNDERSTORM_CODES } from './weatherCodes'

function modelsWhere(
  models: NormalizedForecastPoint[],
  predicate: (model: NormalizedForecastPoint) => boolean,
): string[] {
  return models.filter(predicate).map((m) => m.modelId ?? m.sourceId)
}

/**
 * Section 5.4: hazard signals are derived from each model's own raw fields,
 * never from an averaged/blended value — a lone dissenting model predicting
 * thunderstorms must remain visible regardless of what the majority-vote
 * condition (condition.ts) or the numeric agreement score (agreement.ts) say.
 */
export function deriveHazardFlags(models: NormalizedForecastPoint[]): HazardFlag[] {
  const modelCount = models.length
  const candidates: { type: HazardType; modelsPredicting: string[] }[] = [
    {
      type: 'thunderstorm',
      modelsPredicting: modelsWhere(
        models,
        (m) => m.weatherCode != null && THUNDERSTORM_CODES.has(m.weatherCode),
      ),
    },
    {
      type: 'heavy-rain',
      modelsPredicting: modelsWhere(
        models,
        (m) => m.weatherCode != null && HEAVY_RAIN_CODES.has(m.weatherCode),
      ),
    },
    {
      type: 'heavy-snow',
      modelsPredicting: modelsWhere(
        models,
        (m) => m.weatherCode != null && HEAVY_SNOW_CODES.has(m.weatherCode),
      ),
    },
    {
      type: 'high-wind',
      modelsPredicting: modelsWhere(models, (m) => {
        const wind = m.windGustKph ?? m.windSpeedKph
        return wind != null && wind >= HIGH_WIND_GUST_KPH
      }),
    },
  ]

  return candidates
    .filter((c) => c.modelsPredicting.length >= HAZARD_FLAG_MIN_MODELS)
    .map((c) => ({ type: c.type, modelsPredicting: c.modelsPredicting, modelCount }))
}

const HAZARD_LABELS: Record<HazardType, string> = {
  thunderstorm: 'thunderstorms',
  'heavy-rain': 'heavy rain',
  'high-wind': 'high wind',
  'heavy-snow': 'heavy snow',
}

/** Section 6.4's "⚠ One model indicates thunderstorms" banner text. */
export function hazardMessage(flag: HazardFlag): string {
  const count = flag.modelsPredicting.length
  const verb = count === 1 ? 'indicates' : 'indicate'
  const subject = count === 1 ? '1 model' : `${count} of ${flag.modelCount} models`
  return `${subject} ${verb} ${HAZARD_LABELS[flag.type]}.`
}
