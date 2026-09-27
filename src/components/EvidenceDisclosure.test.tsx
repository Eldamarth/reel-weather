import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import type { EvidenceRecord } from '../fishing/activity/types'
import { EvidenceDisclosure } from './EvidenceDisclosure'

const RECORD: EvidenceRecord = {
  id: 'sample-2020',
  citation: 'Someone (2020). A sample study.',
  year: 2020,
  url: 'https://example.com/study',
  speciesId: 'northern-pike',
  evidenceType: 'movement',
  population: { location: 'Sample Lake', habitat: 'lake' },
  study: { method: 'Telemetry' },
  variables: ['time-of-day'],
  finding: { summary: 'Fish moved around.' },
  applicability: 'high',
  limitations: [],
}

describe('EvidenceDisclosure', () => {
  it('is discoverable via a "Research details" summary and reveals citations once expanded', async () => {
    const user = userEvent.setup()
    render(<EvidenceDisclosure evidence={[RECORD]} />)

    expect(screen.getByText('Research details')).toBeInTheDocument()

    await user.click(screen.getByText('Research details'))

    expect(screen.getByText(RECORD.citation)).toBeInTheDocument()
    expect(screen.getByText(/Fish moved around/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: RECORD.citation })).toHaveAttribute('href', RECORD.url)
  })
})
