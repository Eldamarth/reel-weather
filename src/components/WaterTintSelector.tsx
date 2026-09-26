import type { WaterTint } from '../fishing/types'
import styles from './WaterClaritySelector.module.css'

// Labels match the research brief's own UI mockup (section 14) exactly.
const OPTIONS: Array<{ value: WaterTint; label: string }> = [
  { value: 'unspecified', label: 'Unspecified' },
  { value: 'sediment', label: 'Sediment' },
  { value: 'green-algal', label: 'Green/Algal' },
  { value: 'tea-humic', label: 'Tea/Brown' },
]

export interface WaterTintSelectorProps {
  value: WaterTint
  onChange: (tint: WaterTint) => void
}

/**
 * Optional refinement of clarity (brief section 14) — never required for
 * normal use, hence rendered inside a collapsed section by the caller.
 * Reuses WaterClaritySelector's segmented-control styling; the pattern is
 * generic, not clarity-specific.
 */
export function WaterTintSelector({ value, onChange }: WaterTintSelectorProps) {
  return (
    <div className={styles.selector} role="radiogroup" aria-label="Water tint">
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
