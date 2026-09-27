import styles from './WaterTemperatureInput.module.css'

export interface WaterTemperatureInputProps {
  value: number | null
  onChange: (value: number | null) => void
}

const DEFAULT_TEMP_C = 15

/**
 * Design brief section 14: session-only, optional, never blocks viewing
 * activity. Tapping +/- moves out of "Unknown" starting from a reasonable
 * default rather than requiring the angler to type an initial value.
 */
export function WaterTemperatureInput({ value, onChange }: WaterTemperatureInputProps) {
  const isUnknown = value === null
  const displayValue = value ?? DEFAULT_TEMP_C

  return (
    <div className={styles.row} role="group" aria-label="Water temperature">
      <span className={styles.label}>Water temperature</span>
      <div className={styles.controls}>
        <button
          type="button"
          className={isUnknown ? `${styles.option} ${styles.selected}` : styles.option}
          onClick={() => onChange(null)}
        >
          Unknown
        </button>
        <div className={styles.stepper}>
          <button
            type="button"
            aria-label="Decrease water temperature"
            onClick={() => onChange(displayValue - 1)}
          >
            −
          </button>
          <span className={styles.value}>{isUnknown ? '—' : `${displayValue}°C`}</span>
          <button
            type="button"
            aria-label="Increase water temperature"
            onClick={() => onChange(displayValue + 1)}
          >
            +
          </button>
        </div>
      </div>
      {isUnknown && (
        <p className={styles.note}>
          Temperature modifier unavailable. The base solar/diel profile remains usable.
        </p>
      )}
    </div>
  )
}
