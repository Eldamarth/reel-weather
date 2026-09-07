export type TemperatureUnit = 'celsius' | 'fahrenheit'

export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32
}

/**
 * Display-layer only — the internal normalized model stays Celsius
 * throughout (section 4); unit conversion happens here, at formatting time.
 */
export function formatTemperature(celsius: number | null, unit: TemperatureUnit): string {
  if (celsius === null) return '—'
  const value = unit === 'fahrenheit' ? celsiusToFahrenheit(celsius) : celsius
  const symbol = unit === 'fahrenheit' ? '°F' : '°C'
  return `${Math.round(value)}${symbol}`
}
