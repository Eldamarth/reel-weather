import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import App from './App'

vi.stubGlobal(
  'fetch',
  vi.fn(() => new Promise(() => {})),
)

describe('App', () => {
  it('renders the spike harness heading', () => {
    render(<App />)
    expect(screen.getByText('Reel Weather — Phase 1 API Spike')).toBeInTheDocument()
  })
})
