import { mostDisagreementField } from '../weather/agreement'
import { hazardMessage } from '../weather/hazards'
import type { ConsensusPoint, ForecastAgreement } from '../weather/models'
import { formatClockTime, formatDateLabel } from '../weather/time'
import { formatTemperature, type TemperatureUnit } from '../weather/units'
import { AgreementMeter } from './AgreementMeter'
import { WeatherIcon } from './icons/WeatherIcon'
import styles from './ConsensusCard.module.css'

export interface ConsensusCardProps {
  locationName: string
  timezone: string
  /** "NOW" when the selected hour is the live one, else a clock-time label (section 9). */
  timeLabel: string
  consensus: ConsensusPoint
  agreement: ForecastAgreement
  temperatureUnit: TemperatureUnit
  /** Sunset for the *selected* day (section 9's timeline can scroll ahead) — null when unavailable. */
  sunset: string | null
}

/** Section 7.2: the large, visually dominant consensus card. */
export function ConsensusCard({
  locationName,
  timezone,
  timeLabel,
  consensus,
  agreement,
  temperatureUnit,
  sunset,
}: ConsensusCardProps) {
  const temp = formatTemperature(consensus.temperatureC, temperatureUnit)
  const wind = consensus.windSpeedKph != null ? `${Math.round(consensus.windSpeedKph)} km/h` : '—'
  const cloud = consensus.cloudCoverPct != null ? `${Math.round(consensus.cloudCoverPct)}%` : '—'
  const precipFraction = `${consensus.precipitation.modelsPredictingPrecip}/${consensus.precipitation.modelCount}`

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span>{locationName}</span>
        <span>
          {formatDateLabel(consensus.timestamp)} · {timeLabel} ({timezone})
        </span>
      </div>

      {consensus.hazards.map((hazard) => (
        <div key={hazard.type} className={styles.hazard}>
          ⚠ {hazardMessage(hazard)}
        </div>
      ))}

      <div className={styles.temperature}>
        {consensus.condition && <WeatherIcon condition={consensus.condition} size={44} />}
        {temp}
      </div>

      <div className={styles.stats}>
        <span className={styles.stat}>
          <span className={styles.statLabel}>Precip</span>
          <span>🌧️ {precipFraction} models</span>
        </span>
        <span className={styles.stat}>
          <span className={styles.statLabel}>Wind</span>
          <span>💨 {wind}</span>
        </span>
        <span className={styles.stat}>
          <span className={styles.statLabel}>Cloud</span>
          <span>☁️ {cloud}</span>
        </span>
        {sunset && (
          <span className={styles.stat}>
            <span className={styles.statLabel}>Sunset</span>
            <span>🌇 {formatClockTime(sunset)}</span>
          </span>
        )}
      </div>

      <AgreementMeter overall={agreement.overall} />
      <div className={styles.modelCount}>Consensus from {consensus.modelCount} models</div>
      <div className={styles.disagreement}>
        Most disagreement: {mostDisagreementField(agreement)}
      </div>
    </div>
  )
}
