import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { makeModel } from '../weather/fixtures'
import { ModelForecastList } from './ModelForecastList'

describe('ModelForecastList', () => {
  it('renders a row per model, including unavailable ones without a point', () => {
    render(
      <ModelForecastList
        models={[
          { modelId: 'a', name: 'HRRR', point: makeModel({ modelId: 'a', temperatureC: 20 }) },
          { modelId: 'b', name: 'ICON D2', point: undefined },
        ]}
        temperatureUnit="celsius"
      />,
    )

    expect(screen.getByText('HRRR')).toBeInTheDocument()
    expect(screen.getByText('20°C', { exact: false })).toBeInTheDocument()
    expect(screen.getByText('ICON D2')).toBeInTheDocument()
    expect(screen.getByText('Unavailable at this horizon')).toBeInTheDocument()
  })
})
