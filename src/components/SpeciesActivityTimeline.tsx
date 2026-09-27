import type { SpeciesActivityPoint } from '../fishing/activity/types'
import { formatClockTime, formatHourLabel, minutesOfDay } from '../weather/time'
import styles from './SpeciesActivityTimeline.module.css'

export interface HourlyActivityEntry {
  timestamp: string
  point: SpeciesActivityPoint
}

export interface SpeciesActivityTimelineProps {
  hourly: HourlyActivityEntry[]
  sunset: string | null
}

/** Design brief section 8's bar-chart timeline, with the sunset marker placed on whichever hour bar is closest to it. */
export function SpeciesActivityTimeline({ hourly, sunset }: SpeciesActivityTimelineProps) {
  if (hourly.length === 0) {
    return <p className={styles.empty}>No forecast hours available for today's timeline.</p>
  }

  const sunsetMinutes = sunset ? minutesOfDay(sunset) : null
  const sunsetIndex =
    sunsetMinutes === null
      ? null
      : hourly.reduce(
          (best, entry, i) =>
            Math.abs(minutesOfDay(entry.timestamp) - sunsetMinutes) <
            Math.abs(minutesOfDay(hourly[best].timestamp) - sunsetMinutes)
              ? i
              : best,
          0,
        )

  return (
    <div className={styles.timeline}>
      <div className={styles.bars} role="img" aria-label="Today's relative activity by hour">
        {hourly.map(({ timestamp, point }, i) => (
          <div key={timestamp} className={styles.column}>
            {i === sunsetIndex && (
              <span className={styles.sunsetMark} aria-hidden="true">
                🌇
              </span>
            )}
            <div
              className={styles.bar}
              style={{ height: `${point.displayScore}%` }}
              title={`${formatHourLabel(timestamp)}: ${point.level}`}
            />
            <span className={styles.hourLabel}>{formatHourLabel(timestamp)}</span>
          </div>
        ))}
      </div>
      {sunset && <p className={styles.sunsetCaption}>🌇 Sunset {formatClockTime(sunset)}</p>}
    </div>
  )
}
