import React from 'react'
import clsx from 'clsx'

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: React.ReactNode
  error?: string | null
}

const Checkbox = React.forwardRef<HTMLInputElement, Props>(function Checkbox({ label, error, className, disabled, ...rest }, ref) {
  return (
    <label className="inline-flex items-start gap-2 text-sm">
      <input
        type="checkbox"
        ref={ref}
        {...rest}
        disabled={disabled}
        className={clsx('mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500', className)}
      />
      <div className={clsx('text-sm text-gray-700', disabled && 'opacity-60')}>
        {label}
        {error && <div className="text-xs text-red-600 mt-1">{error}</div>}
      </div>
    </label>
  )
})

export default Checkbox
