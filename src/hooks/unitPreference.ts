import type { TemperatureUnit } from '../weather/units'

export const UNIT_STORAGE_KEY = 'reel-weather:temperature-unit'
const DEFAULT_UNIT: TemperatureUnit = 'fahrenheit'

/** Pure, storage-agnostic logic — kept separate from the React hook so it's directly unit-testable. */
export function loadTemperatureUnit(storage: Pick<Storage, 'getItem'>): TemperatureUnit {
  const raw = storage.getItem(UNIT_STORAGE_KEY)
  return raw === 'celsius' || raw === 'fahrenheit' ? raw : DEFAULT_UNIT
}

export function persistTemperatureUnit(
  storage: Pick<Storage, 'setItem'>,
  unit: TemperatureUnit,
): void {
  storage.setItem(UNIT_STORAGE_KEY, unit)
}
