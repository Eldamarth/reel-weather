import { PROPERTY_COLOR_EXAMPLES } from '../config/fishingRules'
import type { VisualProperty } from './types'

/**
 * Section 12.5: maps a set of visual properties to example colors, so
 * revising one property's palette updates every rule that uses it instead of
 * hardcoding colors per clarity/light combination.
 */
export function colorsForProperties(properties: VisualProperty[]): string[] {
  const seen = new Set<string>()
  const colors: string[] = []
  for (const property of properties) {
    for (const color of PROPERTY_COLOR_EXAMPLES[property]) {
      if (!seen.has(color)) {
        seen.add(color)
        colors.push(color)
      }
    }
  }
  return colors
}
