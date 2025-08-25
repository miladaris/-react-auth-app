import React from 'react'
import clsx from 'clsx'
import { FaSpinner } from 'react-icons/fa'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean
  variant?: 'primary' | 'ghost' | 'outline'
}

export default function Button({ children, loading, variant = 'primary', className, ...rest }: Props) {
  const base = 'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition focus:outline-none'
  const variants: Record<string, string> = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60',
    ghost: 'bg-transparent text-gray-800',
    outline: 'bg-white border border-gray-200 text-gray-800',
  }

  return (
    <button
      {...rest}
      aria-busy={loading ? 'true' : undefined}
      disabled={loading || rest.disabled}
      className={clsx(base, variants[variant], loading && 'cursor-wait', className)}
    >
      {loading && <FaSpinner className="mr-2 animate-spin" aria-hidden />}
      <span>{children}</span>
    </button>
  )
}
