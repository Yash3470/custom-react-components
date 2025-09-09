import React, { forwardRef, useId, useMemo, useState } from 'react'
import { clsx } from 'clsx'

export type InputFieldProps = {
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  label?: string
  placeholder?: string
  helperText?: string
  errorMessage?: string
  disabled?: boolean
  invalid?: boolean
  variant?: 'filled' | 'outlined' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  type?: React.InputHTMLAttributes<HTMLInputElement>['type']
  clearable?: boolean
  passwordToggle?: boolean
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'>

const sizeClasses: Record<NonNullable<InputFieldProps['size']>, string> = {
  sm: 'h-9 text-sm px-3 rounded-lg',
  md: 'h-10 text-base px-3.5 rounded-xl',
  lg: 'h-12 text-base px-4 rounded-2xl'
}

const variantClasses: Record<NonNullable<InputFieldProps['variant']>, string> = {
  filled: 'bg-gray-100 dark:bg-gray-800 border border-transparent focus:border-gray-300',
  outlined: 'bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700',
  ghost: 'bg-transparent border border-transparent focus:border-gray-300'
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(function InputField ({
  value,
  onChange,
  label,
  placeholder,
  helperText,
  errorMessage,
  disabled,
  invalid,
  variant = 'outlined',
  size = 'md',
  type = 'text',
  clearable = false,
  passwordToggle = false,
  id: idProp,
  ...rest
}, ref) {
  const autoId = useId()
  const id = idProp ?? `input-${autoId}`
  const describedBy = useMemo(() => {
    const ids: string[] = []
    if (helperText) ids.push(`${id}-help`)
    if (invalid && errorMessage) ids.push(`${id}-error`)
    return ids.join(' ') || undefined
  }, [id, helperText, invalid, errorMessage])

  const [showPassword, setShowPassword] = useState(false)
  const effectiveType = type === 'password' && passwordToggle ? (showPassword ? 'text' : 'password') : type

  const hasValue = (value ?? rest.defaultValue ?? '') !== ''
  const canClear = clearable && hasValue && !disabled

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block mb-1.5 text-sm font-medium text-gray-800 dark:text-gray-200">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          ref={ref}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          type={effectiveType}
          className={clsx(
            'w-full transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed',
            'placeholder:text-gray-400 dark:placeholder:text-gray-500',
            sizeClasses[size],
            variantClasses[variant],
            invalid && 'border-red-500 focus:ring-red-500 focus:border-red-500',
          )}
          {...rest}
        />
        {type === 'password' && passwordToggle && (
          <button
            type="button"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            onClick={() => setShowPassword(v => !v)}
            className={clsx(
              'absolute inset-y-0 right-1 my-auto px-2 text-sm rounded-md',
              'hover:bg-gray-100 dark:hover:bg-gray-800'
            )}
            tabIndex={-1}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        )}
        {canClear && (
          <button
            type="button"
            aria-label="Clear input"
            onClick={(e) => {
              // Fire onChange with empty value to keep controlled components in sync
              if (onChange) {
                const target = e.currentTarget.previousElementSibling as HTMLInputElement
                const event = Object.create(e, { target: { value: target, enumerable: true }})
                onChange({ ...event, target: { ...target, value: '' } } as React.ChangeEvent<HTMLInputElement>)
              }
            }}
            className="absolute inset-y-0 right-1 my-auto px-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            tabIndex={-1}
          >
            ✕
          </button>
        )}
      </div>
      {helperText && !invalid && (
        <p id={`${id}-help`} className="mt-1 text-xs text-gray-600 dark:text-gray-400">{helperText}</p>
      )}
      {invalid && errorMessage && (
        <p id={`${id}-error`} className="mt-1 text-xs text-red-600">{errorMessage}</p>
      )}
    </div>
  )
})