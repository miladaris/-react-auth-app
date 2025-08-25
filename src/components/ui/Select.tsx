// src\components\ui\Select.tsx
import React from 'react'
import clsx from 'clsx'

type Option = { value: string; label: string }
type Props = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string
  options: Option[]
  error?: string | null
}

const Select = React.forwardRef<HTMLSelectElement, Props>(function Select({ label, options, error, className, ...rest }, ref) {
  return (
    <label className="block text-sm">
      {label && <span className="mb-1 block font-medium text-gray-700">{label}</span>}
      <select
        ref={ref}
        {...rest}
        className={clsx('w-full rounded-md border px-3 py-2 text-sm focus:outline-none', error ? 'border-red-500' : 'border-gray-200', className)}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </label>
  )
})

export default Select
