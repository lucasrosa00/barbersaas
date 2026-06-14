import { forwardRef, type InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className = '', ...props }, ref) => {
    const inputId = id ?? props.name

    return (
      <div className="space-y-1.5">
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-neutral-600"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-500 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-400/50 ${
            error
              ? 'border-neutral-900 focus:border-neutral-900'
              : 'border-neutral-300 focus:border-neutral-900'
          } ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-neutral-600">{error}</p>}
      </div>
    )
  },
)

Input.displayName = 'Input'
