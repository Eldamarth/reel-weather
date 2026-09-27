import styles from './WaterClaritySelector.module.css'

export type AppView = 'forecast' | 'fish-activity'

const OPTIONS: Array<{ value: AppView; label: string }> = [
  { value: 'forecast', label: 'Forecast' },
  { value: 'fish-activity', label: 'Fish Activity' },
]

export interface ViewSwitcherProps {
  value: AppView
  onChange: (view: AppView) => void
}

/**
 * Design brief section 2: a top-level view switch, sibling to the Forecast
 * view, that never touches location/forecast state (that lives in `App`,
 * entirely above this component). Reuses the segmented-control styling
 * already established by `WaterClaritySelector`/`WaterTintSelector` — the
 * pattern is generic, not clarity-specific.
 */
export function ViewSwitcher({ value, onChange }: ViewSwitcherProps) {
  return (
    <div className={styles.selector} role="radiogroup" aria-label="View">
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
