import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { WaterTemperatureInput } from './WaterTemperatureInput'

describe('WaterTemperatureInput', () => {
  it('shows "Unknown" selected and a placeholder value when null', () => {
    render(<WaterTemperatureInput value={null} onChange={vi.fn()} />)
    expect(screen.getByText('—')).toBeInTheDocument()
    expect(screen.getByText(/Temperature modifier unavailable/)).toBeInTheDocument()
  })

  it('shows the current value in °C when known', () => {
    render(<WaterTemperatureInput value={16} onChange={vi.fn()} />)
    expect(screen.getByText('16°C')).toBeInTheDocument()
    expect(screen.queryByText(/Temperature modifier unavailable/)).not.toBeInTheDocument()
  })

  it('clicking Unknown clears the value', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<WaterTemperatureInput value={16} onChange={onChange} />)

    await user.click(screen.getByRole('button', { name: 'Unknown' }))

    expect(onChange).toHaveBeenCalledWith(null)
  })

  it('increasing from unknown starts from a reasonable default rather than requiring manual entry first', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<WaterTemperatureInput value={null} onChange={onChange} />)

    await user.click(screen.getByRole('button', { name: 'Increase water temperature' }))

    expect(onChange).toHaveBeenCalledWith(16)
  })

  it('decreases the known value by one degree per tap', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<WaterTemperatureInput value={16} onChange={onChange} />)

    await user.click(screen.getByRole('button', { name: 'Decrease water temperature' }))

    expect(onChange).toHaveBeenCalledWith(15)
  })
})
