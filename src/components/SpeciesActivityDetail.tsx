import type {
  ActivityLevel,
  ActivitySpeciesProfile,
  EvidenceConfidence,
  EvidenceRecord,
  SolarPhase,
  SpeciesActivityPoint,
} from '../fishing/activity/types'
import type { WaterClarity } from '../fishing/types'
import { WaterClaritySelector } from './WaterClaritySelector'
import { EvidenceDisclosure } from './EvidenceDisclosure'
import { SpeciesActivityTimeline, type HourlyActivityEntry } from './SpeciesActivityTimeline'
import { WaterTemperatureInput } from './WaterTemperatureInput'
import styles from './SpeciesActivityDetail.module.css'

const ACTIVITY_LEVEL_LABELS: Record<ActivityLevel, string> = {
  low: 'Low',
  moderate: 'Moderate',
  favorable: 'Favorable',
  high: 'High',
  peak: 'Peak',
}

const CONFIDENCE_LABELS: Record<EvidenceConfidence, string> = {
  strong: 'Strong',
  moderate: 'Moderate',
  limited: 'Limited',
  insufficient: 'Insufficient',
}

const SOLAR_PHASE_LABELS: Record<SolarPhase, string> = {
  'pre-dawn': 'pre-dawn',
  dawn: 'dawn',
  day: 'midday',
  dusk: 'dusk',
  'early-night': 'early evening',
  'late-night': 'late night',
}

export interface SpeciesActivityDetailProps {
  profile: ActivitySpeciesProfile
  currentPoint: SpeciesActivityPoint
  hourly: Array<HourlyActivityEntry & { solarPhase: SolarPhase }>
  sunset: string | null
  evidence: EvidenceRecord[]
  waterTemperatureC: number | null
  onWaterTemperatureChange: (value: number | null) => void
  clarity: WaterClarity
  onClarityChange: (clarity: WaterClarity) => void
  onBack: () => void
}

/** Design brief section 8: single-species activity page. */
export function SpeciesActivityDetail({
  profile,
  currentPoint,
  hourly,
  sunset,
  evidence,
  waterTemperatureC,
  onWaterTemperatureChange,
  clarity,
  onClarityChange,
  onBack,
}: SpeciesActivityDetailProps) {
  const strongest = hourly.reduce<(typeof hourly)[number] | null>(
    (best, entry) => (!best || entry.point.displayScore > best.point.displayScore ? entry : best),
    null,
  )

  return (
    <div className={styles.detail}>
      <button type="button" className={styles.back} onClick={onBack}>
        ← Species
      </button>

      <h2 className={styles.name}>{profile.displayName}</h2>
      <p className={styles.scientific}>{profile.scientificName}</p>

      <div className={styles.currentWindow}>
        <span className={styles.currentLabel}>Current relative window</span>
        <span className={styles.currentLevel}>{ACTIVITY_LEVEL_LABELS[currentPoint.level]}</span>
        <div className={styles.scoreBar}>
          <div className={styles.scoreFill} style={{ width: `${currentPoint.displayScore}%` }} />
        </div>
      </div>

      {strongest && (
        <p className={styles.strongestWindow}>
          Strongest window today: around local {SOLAR_PHASE_LABELS[strongest.solarPhase]}
        </p>
      )}

      <h3 className={styles.sectionHeading}>Today</h3>
      <SpeciesActivityTimeline hourly={hourly} sunset={sunset} />

      <h3 className={styles.sectionHeading}>Why?</h3>
      <ul className={styles.reasons}>
        {currentPoint.reasons.map((reason, i) => (
          <li key={`${reason.kind}:${i}`}>{reason.message}</li>
        ))}
      </ul>

      <p className={styles.confidence}>
        Evidence confidence: {CONFIDENCE_LABELS[currentPoint.confidence]}
      </p>

      <EvidenceDisclosure evidence={evidence} />

      <div className={styles.optionalInputs}>
        <div>
          <span className={styles.label}>Water clarity (optional)</span>
          <WaterClaritySelector value={clarity} onChange={onClarityChange} />
        </div>
        <WaterTemperatureInput value={waterTemperatureC} onChange={onWaterTemperatureChange} />
      </div>

      {profile.cautions.length > 0 && (
        <ul className={styles.cautions}>
          {profile.cautions.map((caution) => (
            <li key={caution}>{caution}</li>
          ))}
        </ul>
      )}

      <p className={styles.disclaimer}>
        Relative research-based activity index — not a probability of catching a fish.
      </p>
    </div>
  )
}
