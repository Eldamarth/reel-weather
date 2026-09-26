import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { WaterTintSelector } from './WaterTintSelector'

describe('WaterTintSelector', () => {
  it('marks the current value as selected', () => {
    render(<WaterTintSelector value="sediment" onChange={vi.fn()} />)
    expect(screen.getByRole('radio', { name: 'Sediment' })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('radio', { name: 'Unspecified' })).toHaveAttribute(
      'aria-checked',
      'false',
    )
  })

  it('changes with a single tap and no confirmation step', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<WaterTintSelector value="unspecified" onChange={onChange} />)

    await user.click(screen.getByRole('radio', { name: 'Green/Algal' }))

    expect(onChange).toHaveBeenCalledOnce()
    expect(onChange).toHaveBeenCalledWith('green-algal')
  })
})
