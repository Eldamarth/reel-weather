import { useState } from 'react'
import { recommendLureVisualStrategy } from '../fishing/recommendations'
import type { WaterClarity, WaterTint } from '../fishing/types'
import { deriveLightLevel } from '../weather/lightLevel'
import type { DailySunTimes } from '../weather/models'
import { CollapsibleSection } from './CollapsibleSection'
import { LureColorRecommendation } from './LureColorRecommendation'
import { WaterClaritySelector } from './WaterClaritySelector'
import { WaterTintSelector } from './WaterTintSelector'
import styles from './FishingCard.module.css'

export interface FishingCardProps {
  isDay: boolean | null
  cloudCoverPct: number | null
  shortwaveRadiation: number | null
  timestamp: string
  sunTimes: DailySunTimes | null
}

const TINT_SUMMARY_LABELS: Record<WaterTint, string> = {
  unspecified: 'Water tint (optional)',
  sediment: 'Water tint (optional): Sediment',
  'green-algal': 'Water tint (optional): Green/Algal',
  'tea-humic': 'Water tint (optional): Tea/Brown',
}

/**
 * Section 11: optional, visually secondary fishing panel. Water clarity is
 * session-only state per section 11.4 — it is never persisted per location,
 * since clarity can change with rain, runoff, algae, wind, or local
 * disturbance independent of the forecast. Water tint (brief section 14) is
 * the same kind of session-only, optional-refinement state — collapsed by
 * default since it's never required for normal use, but the section label
 * shows the current selection so a non-default choice isn't easy to forget.
 */
export function FishingCard({
  isDay,
  cloudCoverPct,
  shortwaveRadiation,
  timestamp,
  sunTimes,
}: FishingCardProps) {
  const [clarity, setClarity] = useState<WaterClarity>('clear')
  const [tint, setTint] = useState<WaterTint>('unspecified')
  const light = deriveLightLevel(isDay, cloudCoverPct, shortwaveRadiation, timestamp, sunTimes)
  const recommendation = recommendLureVisualStrategy(clarity, light, tint)

  return (
    <section className={styles.card}>
      <h2 className={styles.title}>🎣 Lure color</h2>
      <WaterClaritySelector value={clarity} onChange={setClarity} />
      <CollapsibleSection summary={TINT_SUMMARY_LABELS[tint]}>
        <WaterTintSelector value={tint} onChange={setTint} />
      </CollapsibleSection>
      <LureColorRecommendation
        recommendation={recommendation}
        light={light}
        cloudCoverPct={cloudCoverPct}
      />
    </section>
  )
}
