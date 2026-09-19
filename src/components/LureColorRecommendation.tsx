import { strategyProfile } from '../fishing/colorRules'
import type {
  EvidenceConfidence,
  LureVisualRecommendation,
  VisualProperties,
  VisualStrategy,
} from '../fishing/types'
import type { LightLevel } from '../weather/models'
import styles from './LureColorRecommendation.module.css'

export interface LureColorRecommendationProps {
  recommendation: LureVisualRecommendation
  light: LightLevel
  cloudCoverPct: number | null
}

const LIGHT_LABELS: Record<LightLevel, string> = {
  bright: 'Bright',
  moderate: 'Moderate',
  low: 'Low',
  dark: 'Dark',
}

const STRATEGY_LABELS: Record<VisualStrategy, string> = {
  natural: 'Natural',
  contrast: 'Contrast',
  'dark-silhouette': 'Dark silhouette',
  'bright-opaque': 'Bright / opaque',
}

const CONFIDENCE_LABELS: Record<EvidenceConfidence, string> = {
  low: 'Low',
  moderate: 'Moderate',
  high: 'High',
}

const PROPERTY_LABELS: Record<keyof VisualProperties, string> = {
  opacity: 'Opacity',
  contrast: 'Contrast',
  silhouette: 'Silhouette',
  flash: 'Flash',
}

/**
 * Section 12.6, revised 2026-09-13: shows a visual strategy plus property
 * levels rather than a single color list — properties/colors describe the
 * *strategy* (clarity-driven), not the light level, per the research brief.
 */
export function LureColorRecommendation({
  recommendation,
  light,
  cloudCoverPct,
}: LureColorRecommendationProps) {
  const alternate = recommendation.alternateStrategy
    ? strategyProfile(recommendation.alternateStrategy)
    : null

  return (
    <div className={styles.card}>
      <div className={styles.meta}>
        <span>Light: {LIGHT_LABELS[light]}</span>
        {cloudCoverPct !== null && <span>Cloud cover: {Math.round(cloudCoverPct)}%</span>}
        <span>Evidence: {CONFIDENCE_LABELS[recommendation.confidence]}</span>
      </div>

      <div className={styles.strategy}>{STRATEGY_LABELS[recommendation.primaryStrategy]}</div>

      <ul className={styles.properties}>
        {(Object.keys(recommendation.properties) as Array<keyof VisualProperties>).map((key) => (
          <li key={key}>
            {PROPERTY_LABELS[key]}: {recommendation.properties[key]}
          </li>
        ))}
      </ul>

      <ul className={styles.colors}>
        {recommendation.exampleColors.map((color) => (
          <li key={color}>{color}</li>
        ))}
      </ul>

      {recommendation.alternateStrategy && alternate && (
        <div className={styles.alternate}>
          <span>Also consider: {STRATEGY_LABELS[recommendation.alternateStrategy]}</span>
          <ul className={styles.colors}>
            {alternate.exampleColors.map((color) => (
              <li key={color}>{color}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Section 12.7: concise, not a long explanation. */}
      <p className={styles.disclaimer}>
        Color suggestions are angling heuristics based on visibility, contrast, and common practice
        — not guarantees of fish behavior.
      </p>
    </div>
  )
}
