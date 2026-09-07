import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { WaterClaritySelector } from './WaterClaritySelector'

describe('WaterClaritySelector', () => {
  it('marks the current value as selected', () => {
    render(<WaterClaritySelector value="stained" onChange={vi.fn()} />)
    expect(screen.getByRole('radio', { name: 'Stained' })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('radio', { name: 'Clear' })).toHaveAttribute('aria-checked', 'false')
  })

  it('changes with a single tap and no confirmation step', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<WaterClaritySelector value="clear" onChange={onChange} />)

    await user.click(screen.getByRole('radio', { name: 'Murky' }))

    expect(onChange).toHaveBeenCalledOnce()
    expect(onChange).toHaveBeenCalledWith('murky')
  })
})
