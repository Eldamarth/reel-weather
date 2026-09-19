import { useState } from 'react'
import { recommendLureVisualStrategy } from '../fishing/recommendations'
import type { WaterClarity } from '../fishing/types'
import { deriveLightLevel } from '../weather/lightLevel'
import { LureColorRecommendation } from './LureColorRecommendation'
import { WaterClaritySelector } from './WaterClaritySelector'
import styles from './FishingCard.module.css'

export interface FishingCardProps {
  isDay: boolean | null
  cloudCoverPct: number | null
  shortwaveRadiation: number | null
}

/**
 * Section 11: optional, visually secondary fishing panel. Water clarity is
 * session-only state per section 11.4 — it is never persisted per location,
 * since clarity can change with rain, runoff, algae, wind, or local
 * disturbance independent of the forecast.
 */
export function FishingCard({ isDay, cloudCoverPct, shortwaveRadiation }: FishingCardProps) {
  const [clarity, setClarity] = useState<WaterClarity>('clear')
  const light = deriveLightLevel(isDay, cloudCoverPct, shortwaveRadiation)
  const recommendation = recommendLureVisualStrategy(clarity, light)

  return (
    <section className={styles.card}>
      <h2 className={styles.title}>🎣 Lure color</h2>
      <WaterClaritySelector value={clarity} onChange={setClarity} />
      <LureColorRecommendation
        recommendation={recommendation}
        light={light}
        cloudCoverPct={cloudCoverPct}
      />
    </section>
  )
}
