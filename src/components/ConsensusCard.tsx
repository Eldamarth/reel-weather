import { mostDisagreementField } from '../weather/agreement'
import { CONDITION_DISPLAY } from '../weather/condition'
import { hazardMessage } from '../weather/hazards'
import type { ConsensusPoint, ForecastAgreement } from '../weather/models'
import { formatDateLabel } from '../weather/time'
import { formatTemperature, type TemperatureUnit } from '../weather/units'
import { AgreementMeter } from './AgreementMeter'
import styles from './ConsensusCard.module.css'

export interface ConsensusCardProps {
  locationName: string
  timezone: string
  /** "NOW" when the selected hour is the live one, else a clock-time label (section 9). */
  timeLabel: string
  consensus: ConsensusPoint
  agreement: ForecastAgreement
  temperatureUnit: TemperatureUnit
}

/** Section 7.2: the large, visually dominant consensus card. */
export function ConsensusCard({
  locationName,
  timezone,
  timeLabel,
  consensus,
  agreement,
  temperatureUnit,
}: ConsensusCardProps) {
  const conditionDisplay = consensus.condition ? CONDITION_DISPLAY[consensus.condition] : null
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
        {conditionDisplay?.emoji} {temp}
      </div>

      <div className={styles.stats}>
        <span>🌧️ {precipFraction} models</span>
        <span>💨 {wind}</span>
        <span>☁️ {cloud}</span>
      </div>

      <AgreementMeter overall={agreement.overall} />
      <div className={styles.modelCount}>Consensus from {consensus.modelCount} models</div>
      <div className={styles.disagreement}>
        Most disagreement: {mostDisagreementField(agreement)}
      </div>
    </div>
  )
}
