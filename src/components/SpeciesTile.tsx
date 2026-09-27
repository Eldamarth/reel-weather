import type { SpeciesCatalogEntry } from '../fishing/activity/types'
import styles from './SpeciesTile.module.css'

export interface SpeciesTileProps {
  entry: SpeciesCatalogEntry
  onSelect: () => void
}

/**
 * Design brief section 5: "Do not block biology implementation on custom
 * artwork" — a generic fish glyph plus name/scientific-name is enough for V1.
 */
export function SpeciesTile({ entry, onSelect }: SpeciesTileProps) {
  return (
    <button type="button" className={styles.tile} onClick={onSelect}>
      <span className={styles.icon} aria-hidden="true">
        🐟
      </span>
      <span className={styles.name}>{entry.displayName}</span>
      <span className={styles.scientific}>{entry.scientificName}</span>
    </button>
  )
}
