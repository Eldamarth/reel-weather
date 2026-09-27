import { useState } from 'react'
import { buildActivityContext } from '../fishing/activity/buildContext'
import {
  catalogEntryKey,
  EVIDENCE_INDEX,
  findProfile,
  SPECIES_CATALOG,
} from '../fishing/activity/catalog'
import { resolveEvidence } from '../fishing/activity/evidence'
import { estimateSpeciesAccessibility, estimateSpeciesActivity } from '../fishing/activity/engine'
import type { WaterClarity } from '../fishing/types'
import type { DailySunTimes, GeoCoordinates, HourlyForecast } from '../weather/models'
import { dateOf } from '../weather/time'
import { SpeciesAccessibilityDetail } from './SpeciesAccessibilityDetail'
import { SpeciesActivityDetail } from './SpeciesActivityDetail'
import { SpeciesCatalog } from './SpeciesCatalog'
import styles from './FishActivityView.module.css'

export interface FishActivityViewProps {
  coordinates: GeoCoordinates
  /** The Reel Weather-wide currently-selected hour — never changed by this view (design brief section 3). */
  timestamp: string
  daily: DailySunTimes[]
  series: HourlyForecast[]
  sunset: string | null
}

/**
 * Design brief section 20: owns species selection, the optional water
 * clarity/temperature inputs, and derives every activity/accessibility point
 * from the *currently active Reel Weather forecast* — it never fetches its
 * own weather data or holds its own location/time state.
 */
export function FishActivityView({
  coordinates,
  timestamp,
  daily,
  series,
  sunset,
}: FishActivityViewProps) {
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const [waterTemperatureC, setWaterTemperatureC] = useState<number | null>(null)
  const [clarity, setClarity] = useState<WaterClarity>('clear')

  const selectedEntry = selectedKey
    ? SPECIES_CATALOG.find((e) => catalogEntryKey(e) === selectedKey)
    : undefined
  const profile = selectedEntry
    ? findProfile(selectedEntry.speciesId, selectedEntry.variantId)
    : undefined

  if (!profile) {
    return (
      <div className={styles.view}>
        <SpeciesCatalog
          catalog={SPECIES_CATALOG}
          onSelect={(entry) => setSelectedKey(catalogEntryKey(entry))}
        />
      </div>
    )
  }

  const currentModelsAtHour = series.find((h) => h.timestamp === timestamp)?.modelsAtHour ?? {}
  const currentContext = buildActivityContext({
    timestamp,
    modelsAtHour: currentModelsAtHour,
    coordinates,
    daily,
    waterTemperatureC,
    waterClarity: clarity,
  })

  const evidence = resolveEvidence(profile.evidenceIds, EVIDENCE_INDEX)
  const onBack = () => setSelectedKey(null)

  if (profile.modelKind === 'accessibility') {
    return (
      <div className={styles.view}>
        <SpeciesAccessibilityDetail
          profile={profile}
          currentPoint={estimateSpeciesAccessibility(profile, currentContext)}
          evidence={evidence}
          waterTemperatureC={waterTemperatureC}
          onWaterTemperatureChange={setWaterTemperatureC}
          onBack={onBack}
        />
      </div>
    )
  }

  const todaysHours = series.filter((h) => dateOf(h.timestamp) === dateOf(timestamp))
  const hourly = todaysHours.map((hour) => {
    const hourContext = buildActivityContext({
      timestamp: hour.timestamp,
      modelsAtHour: hour.modelsAtHour,
      coordinates,
      daily,
      waterTemperatureC,
      waterClarity: clarity,
    })
    return {
      timestamp: hour.timestamp,
      solarPhase: hourContext.solarPhase,
      point: estimateSpeciesActivity(profile, hourContext),
    }
  })

  return (
    <div className={styles.view}>
      <SpeciesActivityDetail
        profile={profile}
        currentPoint={estimateSpeciesActivity(profile, currentContext)}
        hourly={hourly}
        sunset={sunset}
        evidence={evidence}
        waterTemperatureC={waterTemperatureC}
        onWaterTemperatureChange={setWaterTemperatureC}
        clarity={clarity}
        onClarityChange={setClarity}
        onBack={onBack}
      />
    </div>
  )
}
