import { useState } from 'react'
import { AttributionFooter } from './components/AttributionFooter'
import { ConsensusCard } from './components/ConsensusCard'
import { FishingCard } from './components/FishingCard'
import { LocationPicker } from './components/LocationPicker'
import { ModelForecastList } from './components/ModelForecastList'
import { TemperatureUnitToggle } from './components/TemperatureUnitToggle'
import { MODEL_REGISTRY } from './config/modelRegistry'
import { useForecast } from './hooks/useForecast'
import type { SavedLocation } from './hooks/locationPreferences'
import { useTemperatureUnit } from './hooks/useTemperatureUnit'
import { median } from './weather/consensus'
import type { NormalizedForecastPoint } from './weather/models'

function modelName(modelId: string): string {
  return MODEL_REGISTRY.find((m) => m.modelId === modelId)?.name ?? modelId
}

/** Section 12.1/12.2's fishing-rule inputs, summarized across whichever models had data for "now". */
function summarizeLightInputs(modelsAtNow: Record<string, NormalizedForecastPoint>) {
  const points = Object.values(modelsAtNow)
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

        {forecast.status === 'loading' && <p>Loading forecast…</p>}
        {forecast.status === 'error' && <p role="alert">{forecast.message}</p>}

        {forecast.status === 'success' && location && (
          <>
            <ConsensusCard
              locationName={location.name}
              timezone={forecast.timezone}
              consensus={forecast.consensus}
              agreement={forecast.agreement}
              temperatureUnit={unit}
            />
            <ModelForecastList
              models={forecast.selectedModelIds.map((modelId) => ({
                modelId,
                name: modelName(modelId),
                point: forecast.modelsAtNow[modelId],
              }))}
              temperatureUnit={unit}
            />
            <FishingCard {...summarizeLightInputs(forecast.modelsAtNow)} />
          </>
        )}
      </main>
      <AttributionFooter />
    </>
  )
}

export default App
