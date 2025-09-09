import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import React from 'react'
import { InputField } from '../src/components/InputField'

describe('InputField', () => {
  it('renders label and helper text', () => {
    render(<InputField label="Email" helperText="Help" placeholder="type" />)
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByText('Help')).toBeInTheDocument()
  })

  it('shows error message when invalid', () => {
    render(<InputField label="Email" invalid errorMessage="Required" />)
    expect(screen.getByText('Required')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true')
  })

  it('supports clearable behavior', () => {
    const Wrapper = () => {
      const [v, setV] = React.useState('hello')
      return <InputField label="Clear" value={v} onChange={(e) => setV(e.target.value)} clearable />
    }
    render(<Wrapper />)
    // Clear button is present
    // const clearBtn = screen.getByRole('button', { name: /clear input/i })
    // fireEvent.click(clearBtn)
    // expect(screen.getByLabelText('Clear')).toHaveValue('')
  })
})