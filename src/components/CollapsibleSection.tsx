import type { ReactNode } from 'react'
import styles from './CollapsibleSection.module.css'

export interface CollapsibleSectionProps {
  summary: string
  children: ReactNode
  defaultOpen?: boolean
}

/**
 * Section 7.1's "Collapsed individual model forecasts" / "Collapsed detailed
 * data" — native `<details>` gives touch-friendly, accessible disclosure with
 * no component state of its own.
 */
export function CollapsibleSection({
  summary,
  children,
  defaultOpen = false,
}: CollapsibleSectionProps) {
  return (
    <details className={styles.details} open={defaultOpen}>
      <summary className={styles.summary}>{summary}</summary>
      <div className={styles.content}>{children}</div>
    </details>
  )
}
