import type { SeasonBucket } from './types'

/**
 * Deliberately coarse month-based bucket (design brief section 13) — not a
 * biological-season model. Northern hemisphere: cold = Dec-Feb, warm =
 * Jun-Aug, shoulder = everything else. Southern hemisphere shifts by six
 * months, keyed off the *forecast location's* latitude sign, never the
 * viewer's device timezone.
 */
export function resolveSeasonBucket(timestamp: string, latitude: number): SeasonBucket {
  const month = Number(timestamp.slice(5, 7))
  const effectiveMonth = latitude < 0 ? ((month + 5) % 12) + 1 : month

  if (effectiveMonth === 12 || effectiveMonth <= 2) return 'cold'
  if (effectiveMonth >= 6 && effectiveMonth <= 8) return 'warm'
  return 'shoulder'
}
