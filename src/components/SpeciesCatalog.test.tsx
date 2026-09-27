import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SPECIES_CATALOG } from '../fishing/activity/catalog'
import { SpeciesCatalog } from './SpeciesCatalog'

describe('SpeciesCatalog', () => {
  it('renders a tile for every species in the catalog', () => {
    render(<SpeciesCatalog catalog={SPECIES_CATALOG} onSelect={vi.fn()} />)
    expect(screen.getByRole('button', { name: /Northern Pike/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Zander/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /European Perch/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Sea Trout/ })).toBeInTheDocument()
  })

  it('filters by an alternate name, case-insensitively', async () => {
    const user = userEvent.setup()
    render(<SpeciesCatalog catalog={SPECIES_CATALOG} onSelect={vi.fn()} />)

    await user.type(screen.getByLabelText('Search species'), 'SANDART')

    expect(screen.getByRole('button', { name: /Zander/ })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Northern Pike/ })).not.toBeInTheDocument()
  })

  it('shows an empty state for a query matching nothing', async () => {
    const user = userEvent.setup()
    render(<SpeciesCatalog catalog={SPECIES_CATALOG} onSelect={vi.fn()} />)

    await user.type(screen.getByLabelText('Search species'), 'nonexistent-fish-xyz')

    expect(screen.getByText(/No species match/)).toBeInTheDocument()
  })

  it('calls onSelect with the tapped species entry', async () => {
    const onSelect = vi.fn()
    const user = userEvent.setup()
    render(<SpeciesCatalog catalog={SPECIES_CATALOG} onSelect={onSelect} />)

    await user.click(screen.getByRole('button', { name: /Northern Pike/ }))

    expect(onSelect).toHaveBeenCalledOnce()
    expect(onSelect.mock.calls[0][0].displayName).toBe('Northern Pike')
  })

  it('shows the non-occurrence-filtering disclaimer (design brief section 5)', () => {
    render(<SpeciesCatalog catalog={SPECIES_CATALOG} onSelect={vi.fn()} />)
    expect(screen.getByText(/not filtered by local occurrence/)).toBeInTheDocument()
  })
})
