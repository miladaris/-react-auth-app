import React from 'react'
import clsx from 'clsx'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string | null
  className?: string
  rightElement?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, className, disabled, rightElement, ...rest },
  ref
) {
  return (
    <label className="block text-sm">
      {label && <span className="mb-1 block font-medium text-gray-700">{label}</span>}
      <div className="flex items-center">
        <input
          ref={ref}
          {...rest}
          disabled={disabled}
          aria-invalid={error ? 'true' : 'false'}
          className={clsx(
            'w-full rounded-md border px-3 py-2 text-sm placeholder-gray-400 transition focus:outline-none focus:ring-2',
            error ? 'border-red-500 ring-red-50' : 'border-gray-200 ring-blue-50',
            disabled ? 'opacity-60 bg-gray-50 cursor-not-allowed' : 'bg-white',
            className
          )}
        />
        {rightElement}
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </label>
  )
})

export default Input
