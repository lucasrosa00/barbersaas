import { forwardRef, type SelectHTMLAttributes } from 'react'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: SelectOption[]
  error?: string
  placeholder?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { label, options, error, id, placeholder, className = '', ...props },
    ref,
  ) => {
    const selectId = id ?? props.name

    return (
      <div className="space-y-1.5">
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-neutral-600"
        >
          {label}
        </label>
        <select
          ref={ref}
          id={selectId}
          className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-neutral-900 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-400/50 ${
            error
              ? 'border-neutral-900 focus:border-neutral-900'
              : 'border-neutral-300 focus:border-neutral-900'
          } ${className}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-neutral-600">{error}</p>}
      </div>
    )
  },
)

Select.displayName = 'Select'
