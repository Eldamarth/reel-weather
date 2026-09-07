import type { TemperatureUnit } from '../weather/units'
import styles from './TemperatureUnitToggle.module.css'

export interface TemperatureUnitToggleProps {
  unit: TemperatureUnit
  onChange: (unit: TemperatureUnit) => void
}

export function TemperatureUnitToggle({ unit, onChange }: TemperatureUnitToggleProps) {
  return (
    <div className={styles.toggle} role="radiogroup" aria-label="Temperature unit">
      {(['fahrenheit', 'celsius'] as const).map((option) => (
        <button
          key={option}
          type="button"
          role="radio"
          aria-checked={option === unit}
          className={option === unit ? `${styles.option} ${styles.selected}` : styles.option}
          onClick={() => onChange(option)}
        >
          {option === 'fahrenheit' ? '°F' : '°C'}
        </button>
      ))}
    </div>
  )
}
