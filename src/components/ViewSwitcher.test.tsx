import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ViewSwitcher } from './ViewSwitcher'

describe('ViewSwitcher', () => {
  it('marks the current view as selected', () => {
    render(<ViewSwitcher value="forecast" onChange={vi.fn()} />)
    expect(screen.getByRole('radio', { name: 'Forecast' })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('radio', { name: 'Fish Activity' })).toHaveAttribute(
      'aria-checked',
      'false',
    )
  })

  it('switches with a single tap', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<ViewSwitcher value="forecast" onChange={onChange} />)

    await user.click(screen.getByRole('radio', { name: 'Fish Activity' }))

    expect(onChange).toHaveBeenCalledOnce()
    expect(onChange).toHaveBeenCalledWith('fish-activity')
  })
})
