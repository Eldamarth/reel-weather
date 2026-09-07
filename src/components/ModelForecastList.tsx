import type { NormalizedForecastPoint } from '../weather/models'
import type { TemperatureUnit } from '../weather/units'
import { ModelForecastRow } from './ModelForecastRow'
import styles from './ModelForecastList.module.css'

export interface ModelForecastListProps {
  models: Array<{ modelId: string; name: string; point: NormalizedForecastPoint | undefined }>
  temperatureUnit: TemperatureUnit
}

/** Section 7.3: compact per-model comparison. */
export function ModelForecastList({ models, temperatureUnit }: ModelForecastListProps) {
  return (
    <table className={styles.list}>
      <thead>
        <tr>
          <th>Model</th>
          <th>Condition</th>
          <th>Precip</th>
          <th>Wind</th>
        </tr>
      </thead>
      <tbody>
        {models.map((m) => (
          <ModelForecastRow
            key={m.modelId}
            name={m.name}
            point={m.point}
            temperatureUnit={temperatureUnit}
          />
        ))}
      </tbody>
    </table>
  )
}
