import type { ColorRecommendation } from '../fishing/types'
import type { LightLevel } from '../weather/models'
import styles from './LureColorRecommendation.module.css'

export interface LureColorRecommendationProps {
  recommendation: ColorRecommendation
  light: LightLevel
  cloudCoverPct: number | null
}

const LIGHT_LABELS: Record<LightLevel, string> = {
  bright: 'Bright',
  moderate: 'Moderate',
  low: 'Low',
  dark: 'Dark',
}

/** Section 12.6. */
export function LureColorRecommendation({
  recommendation,
  light,
  cloudCoverPct,
}: LureColorRecommendationProps) {
  return (
    <div className={styles.card}>
      <div className={styles.meta}>
        <span>Light: {LIGHT_LABELS[light]}</span>
        {cloudCoverPct !== null && <span>Cloud cover: {Math.round(cloudCoverPct)}%</span>}
      </div>

      <div className={styles.strategy}>{recommendation.strategy}</div>

      <ul className={styles.properties}>
        {recommendation.properties.map((property) => (
          <li key={property}>{property}</li>
        ))}
      </ul>

      <ul className={styles.colors}>
        {recommendation.colors.map((color) => (
          <li key={color}>{color}</li>
        ))}
      </ul>

      {/* Section 12.7: concise, not a long explanation. */}
      <p className={styles.disclaimer}>
        Color suggestions are angling heuristics based on visibility, contrast, and common practice
        — not guarantees of fish behavior.
      </p>
    </div>
  )
}
