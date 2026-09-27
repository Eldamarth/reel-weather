import type {
  AccessibilityLevel,
  AccessibilitySpeciesProfile,
  EvidenceConfidence,
  EvidenceRecord,
  SpeciesAccessibilityPoint,
} from '../fishing/activity/types'
import { EvidenceDisclosure } from './EvidenceDisclosure'
import { WaterTemperatureInput } from './WaterTemperatureInput'
// Reuses SpeciesActivityDetail's CSS — the layout is generic, not activity-specific.
import styles from './SpeciesActivityDetail.module.css'

const ACCESSIBILITY_LEVEL_LABELS: Record<AccessibilityLevel, string> = {
  reduced: 'Reduced',
  neutral: 'Neutral',
  favorable: 'Favorable',
}

const CONFIDENCE_LABELS: Record<EvidenceConfidence, string> = {
  strong: 'Strong',
  moderate: 'Moderate',
  limited: 'Limited',
  insufficient: 'Insufficient',
}

export interface SpeciesAccessibilityDetailProps {
  profile: AccessibilitySpeciesProfile
  currentPoint: SpeciesAccessibilityPoint
  evidence: EvidenceRecord[]
  waterTemperatureC: number | null
  onWaterTemperatureChange: (value: number | null) => void
  onBack: () => void
}

/**
 * Design brief section 9: an accessibility profile (currently just coastal
 * Sea Trout) must never be forced into a fake peaked activity score — no
 * timeline, no "Why?" framing borrowed from the activity page, just the
 * current habitat/accessibility context and whichever rules apply.
 */
export function SpeciesAccessibilityDetail({
  profile,
  currentPoint,
  evidence,
  waterTemperatureC,
  onWaterTemperatureChange,
  onBack,
}: SpeciesAccessibilityDetailProps) {
  return (
    <div className={styles.detail}>
      <button type="button" className={styles.back} onClick={onBack}>
        ← Species
      </button>

      <h2 className={styles.name}>{profile.displayName}</h2>
      <p className={styles.scientific}>{profile.scientificName}</p>

      <div className={styles.currentWindow}>
        <span className={styles.currentLabel}>Current habitat / accessibility context</span>
        <span className={styles.currentLevel}>
          {ACCESSIBILITY_LEVEL_LABELS[currentPoint.level]}
        </span>
      </div>

      {currentPoint.reasons.length > 0 && (
        <>
          <h3 className={styles.sectionHeading}>Research indicates</h3>
          <ul className={styles.reasons}>
            {currentPoint.reasons.map((reason, i) => (
              <li key={`${reason.kind}:${i}`}>{reason.message}</li>
            ))}
          </ul>
        </>
      )}

      <p className={styles.confidence}>
        Evidence confidence: {CONFIDENCE_LABELS[currentPoint.confidence]}
      </p>

      <EvidenceDisclosure evidence={evidence} />

      <div className={styles.optionalInputs}>
        <WaterTemperatureInput value={waterTemperatureC} onChange={onWaterTemperatureChange} />
      </div>

      {profile.cautions.length > 0 && (
        <ul className={styles.cautions}>
          {profile.cautions.map((caution) => (
            <li key={caution}>{caution}</li>
          ))}
        </ul>
      )}

      <p className={styles.disclaimer}>This is not a bite-probability forecast.</p>
    </div>
  )
}
