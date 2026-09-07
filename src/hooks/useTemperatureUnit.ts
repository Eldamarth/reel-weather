import { useCallback, useState } from 'react'
import type { TemperatureUnit } from '../weather/units'
import { loadTemperatureUnit, persistTemperatureUnit } from './unitPreference'

export function useTemperatureUnit() {
  const [unit, setUnitState] = useState<TemperatureUnit>(() => loadTemperatureUnit(localStorage))

  const setUnit = useCallback((next: TemperatureUnit) => {
    setUnitState(next)
    persistTemperatureUnit(localStorage, next)
  }, [])

  return { unit, setUnit }
}
