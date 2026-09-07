import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { CollapsibleSection } from './CollapsibleSection'

describe('CollapsibleSection', () => {
  it('is collapsed by default, with content hidden', () => {
    render(
      <CollapsibleSection summary="Forecast models (6)">
        <p>Row content</p>
      </CollapsibleSection>,
    )
    expect(screen.getByText('Forecast models (6)')).toBeInTheDocument()
    expect(screen.getByText('Row content')).not.toBeVisible()
  })

  it('reveals content on tap', async () => {
    const user = userEvent.setup()
    render(
      <CollapsibleSection summary="Forecast models (6)">
        <p>Row content</p>
      </CollapsibleSection>,
    )

    await user.click(screen.getByText('Forecast models (6)'))

    expect(screen.getByText('Row content')).toBeVisible()
  })

  it('can start open when defaultOpen is set', () => {
    render(
      <CollapsibleSection summary="Details" defaultOpen>
        <p>Always shown</p>
      </CollapsibleSection>,
    )
    expect(screen.getByText('Always shown')).toBeVisible()
  })
})
