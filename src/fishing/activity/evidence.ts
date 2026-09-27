import type { EvidenceRecord } from './types'

export type EvidenceIndex = Record<string, EvidenceRecord>

export function indexEvidence(records: EvidenceRecord[]): EvidenceIndex {
  return Object.fromEntries(records.map((record) => [record.id, record]))
}

/**
 * Data contract section 14's "every evidenceId resolves" gate, enforced at
 * the point of use rather than only in a separate audit: an unresolved id is
 * a data-authoring bug (a research dossier referencing an evidence record
 * that was never transcribed), and should fail loudly in tests rather than
 * silently rendering nothing.
 */
export function resolveEvidence(ids: string[], index: EvidenceIndex): EvidenceRecord[] {
  return ids.map((id) => {
    const record = index[id]
    if (!record) throw new Error(`Unresolved evidence id: ${id}`)
    return record
  })
}
