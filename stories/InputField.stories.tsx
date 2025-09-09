import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'
import { InputField, type InputFieldProps } from '../src/components/InputField'
import '../src/index.css'

const meta: Meta<typeof InputField> = {
  title: 'Components/InputField',
  component: InputField,
  parameters: { layout: 'centered' },
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
    helperText: 'We never share your email.',
    variant: 'outlined',
    size: 'md'
  }
}
export default meta
type Story = StoryObj<typeof InputField>

// --------- Basic Story ---------
export const Basic: Story = {
  render: (args: InputFieldProps) => {
    const [value, setValue] = useState('')
    return (
      <div className="w-80">
        <InputField
          {...args}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          clearable
        />
      </div>
    )
  }
}

// --------- Interactive Invalid Story ---------
export const InteractiveInvalid: Story = {
  render: (args: InputFieldProps) => {
    const [value, setValue] = useState('')
    const isInvalid = value.length > 0 && !value.includes('@')
    return (
      <div className="w-80">
        <InputField
          {...args}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          invalid={isInvalid}
          errorMessage="Please enter a valid email"
          clearable
        />
      </div>
    )
  }
}

// --------- Password Toggle Story ---------
export const PasswordToggle: Story = {
  render: (args: InputFieldProps) => {
    const [value, setValue] = useState('')
    return (
      <div className="w-80">
        <InputField
          {...args}
          label="Password"
          placeholder="Enter Password"
          type="password"
          passwordToggle
          value={value}
          onChange={(e) => setValue(e.target.value)}
          clearable
          variant="filled"
        />
      </div>
    )
  }
}

// --------- Variants Story ---------
export const Variants: Story = {
  render: (args: InputFieldProps) => (
    <div className="space-y-3 w-80">
      <InputField {...args} label="Outlined" variant="outlined" />
      <InputField {...args} label="Filled" variant="filled" />
      <InputField {...args} label="Ghost" variant="ghost" />
    </div>
  )
}

// --------- Disabled Story ---------
export const Disabled: Story = {
  render: (args: InputFieldProps) => (
    <InputField {...args} value="Disabled" disabled label="Disabled Field" placeholder="Cannot type here" />
  )
}

// --------- Loading Story ---------
export const Loading: Story = {
  render: (args: InputFieldProps) => (
    <InputField {...args} value="Loading" loading label="Loading Field" placeholder="Please wait..." />
  )
}

// --------- All States Combined Story ---------
export const AllStates: Story = {
  render: (args: InputFieldProps) => {
    const [value, setValue] = useState('')
    const isInvalid = value.length > 0 && !value.includes('@')
    return (
      <div className="space-y-3 w-80">
        {/* Interactive invalid */}
        <InputField
          {...args}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          invalid={isInvalid}
          errorMessage="Please enter a valid email"
          clearable
        />
        {/* Disabled */}
        <InputField {...args} value="Disabled" disabled label="Disabled" />
        {/* Loading */}
        <InputField {...args} value="Loading" loading label="Loading" />
        {/* Password toggle */}
        <InputField {...args} label="Password" placeholder="Enter Password" type="password" passwordToggle />
      </div>
    )
  }
}
