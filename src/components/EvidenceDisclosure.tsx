import type { EvidenceRecord } from '../fishing/activity/types'
import { CollapsibleSection } from './CollapsibleSection'
import styles from './EvidenceDisclosure.module.css'

export interface EvidenceDisclosureProps {
  evidence: EvidenceRecord[]
}

/** Design brief section 8: "expandable research/evidence notes" — a citation, its method/location, and its finding, per record. */
export function EvidenceDisclosure({ evidence }: EvidenceDisclosureProps) {
  return (
    <CollapsibleSection summary="Research details">
      <ul className={styles.list}>
        {evidence.map((record) => (
          <li key={record.id} className={styles.item}>
            <a href={record.url} target="_blank" rel="noreferrer" className={styles.citation}>
              {record.citation}
            </a>
            <div className={styles.meta}>
              {record.evidenceType} · {record.population.location} · {record.applicability}{' '}
              applicability
            </div>
            <p className={styles.finding}>{record.finding.summary}</p>
          </li>
        ))}
      </ul>
    </CollapsibleSection>
  )
}
