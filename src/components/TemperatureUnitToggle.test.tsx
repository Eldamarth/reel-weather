import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { TemperatureUnitToggle } from './TemperatureUnitToggle'

describe('TemperatureUnitToggle', () => {
  it('marks the current unit as selected', () => {
    render(<TemperatureUnitToggle unit="fahrenheit" onChange={vi.fn()} />)
    expect(screen.getByRole('radio', { name: '°F' })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('radio', { name: '°C' })).toHaveAttribute('aria-checked', 'false')
  })

  it('switches with a single tap', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<TemperatureUnitToggle unit="fahrenheit" onChange={onChange} />)

    await user.click(screen.getByRole('radio', { name: '°C' }))

    expect(onChange).toHaveBeenCalledWith('celsius')
  })
})
