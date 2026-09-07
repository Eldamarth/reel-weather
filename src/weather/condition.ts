import type { DisplayCondition, NormalizedForecastPoint } from './models'
import { weatherCodeToCondition } from './weatherCodes'

/** Most severe first — used only to break ties in the plurality vote below. */
const SEVERITY_ORDER: DisplayCondition[] = [
  'thunderstorm',
  'heavy-rain',
  'snow',
  'rain',
  'fog',
  'light-rain',
  'cloudy',
  'partly-cloudy',
  'mostly-clear',
  'clear',
]

function conditionFromCloudCover(cloudCoverPct: number): DisplayCondition {
  if (cloudCoverPct < 10) return 'clear'
  if (cloudCoverPct < 35) return 'mostly-clear'
  if (cloudCoverPct < 70) return 'partly-cloudy'
  return 'cloudy'
}

function conditionForModel(model: NormalizedForecastPoint): DisplayCondition | null {
  if (model.weatherCode !== null && model.weatherCode !== undefined) {
    const fromCode = weatherCodeToCondition(model.weatherCode)
    if (fromCode) return fromCode
  }
  if (model.cloudCoverPct !== null) return conditionFromCloudCover(model.cloudCoverPct)
  return null
}

/**
 * Section 5.1/5.2: derived from normalized variables via a plurality vote
 * across contributing models, not by averaging weather codes (which are
 * categorical, not numeric). Ties break toward the more severe condition —
 * matches the spirit of section 6.4 (don't let disagreement hide the
 * possibility of worse conditions).
 */
export function deriveCondition(models: NormalizedForecastPoint[]): DisplayCondition | null {
  const votes = new Map<DisplayCondition, number>()

  for (const model of models) {
    const condition = conditionForModel(model)
    if (!condition) continue
    votes.set(condition, (votes.get(condition) ?? 0) + 1)
  }

  if (votes.size === 0) return null

  let winner: DisplayCondition | null = null
  let winnerCount = 0
  for (const condition of SEVERITY_ORDER) {
    const count = votes.get(condition) ?? 0
    if (count > winnerCount) {
      winner = condition
      winnerCount = count
    }
  }

  return winner
}
