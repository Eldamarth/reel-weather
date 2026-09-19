import { useEffect, useRef } from 'react'
import { agreementTier } from '../weather/agreement'
import type { HourlyForecast } from '../weather/models'
import { dateOf, formatHourLabel, weekdayLabel } from '../weather/time'
import { formatTemperature, type TemperatureUnit } from '../weather/units'
import { WeatherIcon } from './icons/WeatherIcon'
import styles from './HourlyTimeline.module.css'

export interface HourlyTimelineProps {
  series: HourlyForecast[]
  selectedIndex: number
  nowIndex: number
  onSelect: (index: number) => void
  temperatureUnit: TemperatureUnit
}

/**
 * Section 9: eliminates repeated date/time entry. Native horizontal scroll
 * (with scroll-snap) gives the swipe/drag interaction for free rather than
 * hand-rolling gesture handling. Agreement is visible per hour (a small dot)
 * so uncertain periods stand out before they're selected (section 9's own
 * requirement) — using the section 6.5 tier, not a raw percentage, to match
 * the rest of the app's "agreement, not confidence" framing.
 *
 * The day name lives in a divider *between* days, not inside every hour
 * button — an earlier version reserved a day-name row on every button so
 * boundary buttons wouldn't grow an extra line and misalign with their
 * neighbors, but that spent height on all 24 buttons a day for a label
 * that's empty 23 of them. A divider costs nothing on ordinary buttons, and
 * the reclaimed height goes to a larger, easier-to-read condition icon.
 */
export function HourlyTimeline({
  series,
  selectedIndex,
  nowIndex,
  onSelect,
  temperatureUnit,
}: HourlyTimelineProps) {
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([])

  useEffect(() => {
    buttonRefs.current[selectedIndex]?.scrollIntoView?.({
      inline: 'center',
      block: 'nearest',
      behavior: 'smooth',
    })
  }, [selectedIndex])

  return (
    <div className={styles.scroll} role="listbox" aria-label="Forecast hour">
      {series.map((hour, index) => {
        const isNow = index === nowIndex
        const isSelected = index === selectedIndex
        const isNewDay =
          index === 0 || dateOf(series[index - 1].timestamp) !== dateOf(hour.timestamp)

        return (
          <div className={styles.item} key={hour.timestamp}>
            {isNewDay && (
              <div className={styles.dayDivider} aria-hidden="true">
                <span className={styles.dayDividerLabel}>{weekdayLabel(hour.timestamp)}</span>
              </div>
            )}
            <button
              ref={(el) => {
                buttonRefs.current[index] = el
              }}
              type="button"
              role="option"
              aria-selected={isSelected}
              className={isSelected ? `${styles.hour} ${styles.selected}` : styles.hour}
              onClick={() => onSelect(index)}
            >
              <span className={styles.label}>
                {isNow ? 'NOW' : formatHourLabel(hour.timestamp)}
              </span>
              {hour.consensus.condition && (
                <WeatherIcon condition={hour.consensus.condition} size={28} />
              )}
              <span className={styles.temp}>
                {formatTemperature(hour.consensus.temperatureC, temperatureUnit)}
              </span>
              <span
                className={`${styles.agreementDot} ${styles[agreementTier(hour.agreement.overall)]}`}
                aria-hidden="true"
              />
            </button>
          </div>
        )
      })}
    </div>
  )
}
