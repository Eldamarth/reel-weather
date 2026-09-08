import { useState } from 'react'
import { AttributionFooter } from './components/AttributionFooter'
import { CollapsibleSection } from './components/CollapsibleSection'
import { ConsensusCard } from './components/ConsensusCard'
import { FishingCard } from './components/FishingCard'
import { HourlyTimeline } from './components/HourlyTimeline'
import { LocationPicker } from './components/LocationPicker'
import { ModelForecastList } from './components/ModelForecastList'
import { TemperatureUnitToggle } from './components/TemperatureUnitToggle'
import { MODEL_REGISTRY } from './config/modelRegistry'
import { useForecast } from './hooks/useForecast'
import type { SavedLocation } from './hooks/locationPreferences'
import { useTemperatureUnit } from './hooks/useTemperatureUnit'
import { median } from './weather/consensus'
import type { NormalizedForecastPoint } from './weather/models'
import { formatHourLabel } from './weather/time'

function modelName(modelId: string): string {
  return MODEL_REGISTRY.find((m) => m.modelId === modelId)?.name ?? modelId
}

/** Section 12.1/12.2's fishing-rule inputs, summarized across whichever models had data for the selected hour. */
function summarizeLightInputs(modelsAtHour: Record<string, NormalizedForecastPoint>) {
  const points = Object.values(modelsAtHour)
  return {
    isDay: points.find((p) => p.isDay != null)?.isDay ?? null,
    cloudCoverPct: median(points.map((p) => p.cloudCoverPct)),
    shortwaveRadiation: median(points.map((p) => p.shortwaveRadiation ?? null)),
  }
}

function App() {
  const [location, setLocation] = useState<SavedLocation | null>(null)
  const forecast = useForecast(location)
  const { unit, setUnit } = useTemperatureUnit()

  return (
    <>
      <main
        style={{
          padding: '1rem',
          maxWidth: 480,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <TemperatureUnitToggle unit={unit} onChange={setUnit} />
        <LocationPicker onLocationSelected={setLocation} />

        {forecast.status === 'loading' && (
          <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading forecast…</p>
        )}
        {forecast.status === 'error' && (
          <p role="alert" style={{ textAlign: 'center', color: 'var(--color-warning)' }}>
            {forecast.message}
          </p>
        )}

        {forecast.status === 'success' &&
          location &&
          (() => {
            const current = forecast.series[forecast.selectedIndex]
            const isNow = forecast.selectedIndex === forecast.nowIndex
            return (
              <>
                <HourlyTimeline
                  series={forecast.series}
                  selectedIndex={forecast.selectedIndex}
                  nowIndex={forecast.nowIndex}
                  onSelect={forecast.setSelectedIndex}
                  temperatureUnit={unit}
                />
                <ConsensusCard
                  locationName={location.name}
                  timezone={forecast.timezone}
                  timeLabel={isNow ? 'NOW' : formatHourLabel(current.timestamp)}
                  consensus={current.consensus}
                  agreement={current.agreement}
                  temperatureUnit={unit}
                />
                <CollapsibleSection
                  summary={`Forecast models (${forecast.selectedModelIds.length})`}
                >
                  <ModelForecastList
                    models={forecast.selectedModelIds.map((modelId) => ({
                      modelId,
                      name: modelName(modelId),
                      point: current.modelsAtHour[modelId],
                    }))}
                    temperatureUnit={unit}
                  />
                </CollapsibleSection>
                <FishingCard {...summarizeLightInputs(current.modelsAtHour)} />
              </>
            )
          })()}
      </main>
      <AttributionFooter />
    </>
  )
}

export default App
