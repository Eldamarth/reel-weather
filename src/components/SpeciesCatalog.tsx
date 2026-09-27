import { useState } from 'react'
import { catalogEntryKey, searchCatalog } from '../fishing/activity/catalog'
import type { SpeciesCatalogEntry } from '../fishing/activity/types'
import { SpeciesTile } from './SpeciesTile'
import styles from './SpeciesCatalog.module.css'

export interface SpeciesCatalogProps {
  catalog: SpeciesCatalogEntry[]
  onSelect: (entry: SpeciesCatalogEntry) => void
}

/** Design brief section 5: Pokédex-style catalog, searchable by name/scientific name/alternate names. */
export function SpeciesCatalog({ catalog, onSelect }: SpeciesCatalogProps) {
  const [query, setQuery] = useState('')
  const results = searchCatalog(query, catalog)

  return (
    <div className={styles.catalog}>
      <p className={styles.intro}>What would this species be doing here today?</p>

      <input
        type="search"
        className={styles.search}
        placeholder="Search species…"
        aria-label="Search species"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <p className={styles.disclaimer}>
        Species are not filtered by local occurrence in this version.
      </p>

      {results.length === 0 ? (
        <p className={styles.empty}>No species match “{query}”.</p>
      ) : (
        <div className={styles.grid}>
          {results.map((entry) => (
            <SpeciesTile
              key={catalogEntryKey(entry)}
              entry={entry}
              onSelect={() => onSelect(entry)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
