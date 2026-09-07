import { CONDITION_DISPLAY } from '../weather/condition'
import { weatherCodeToCondition } from '../weather/weatherCodes'
import type { NormalizedForecastPoint } from '../weather/models'
import { formatTemperature, type TemperatureUnit } from '../weather/units'
import styles from './ModelForecastList.module.css'

export interface ModelForecastRowProps {
  name: string
  point: NormalizedForecastPoint | undefined
  temperatureUnit: TemperatureUnit
}

export function ModelForecastRow({ name, point, temperatureUnit }: ModelForecastRowProps) {
  if (!point) {
    return (
      <tr className={styles.row}>
        <td>{name}</td>
        <td colSpan={3} className={styles.unavailable}>
          Unavailable at this horizon
        </td>
      </tr>
    )
  }

  const condition = point.weatherCode != null ? weatherCodeToCondition(point.weatherCode) : null
  const emoji = condition ? CONDITION_DISPLAY[condition].emoji : ''
  const temp = formatTemperature(point.temperatureC, temperatureUnit)
  const wind = point.windSpeedKph != null ? `${Math.round(point.windSpeedKph)} km/h` : '—'
  const precip =
    point.precipitationProbabilityPct != null
      ? `${Math.round(point.precipitationProbabilityPct)}%`
      : '—'

  return (
    <tr className={styles.row}>
      <td>{name}</td>
      <td>
        {emoji} {temp}
      </td>
      <td>🌧️ {precip}</td>
      <td>💨 {wind}</td>
    </tr>
  )
}
