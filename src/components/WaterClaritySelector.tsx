import type { WaterClarity } from '../fishing/types'
import styles from './WaterClaritySelector.module.css'

// Section 21 open question #8: "Stained" vs "Cloudy" vs "Stained / Cloudy" is
// left open for user testing — defaulting to "Stained" for V1.
const OPTIONS: Array<{ value: WaterClarity; label: string }> = [
  { value: 'clear', label: 'Clear' },
  { value: 'stained', label: 'Stained' },
  { value: 'murky', label: 'Murky' },
]

export interface WaterClaritySelectorProps {
  value: WaterClarity
  onChange: (clarity: WaterClarity) => void
}

/** Section 11.3: one tap to change, no confirmation, no separate form. */
export function WaterClaritySelector({ value, onChange }: WaterClaritySelectorProps) {
  return (
    <div className={styles.selector} role="radiogroup" aria-label="Water clarity">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={option.value === value}
          className={option.value === value ? `${styles.option} ${styles.selected}` : styles.option}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
