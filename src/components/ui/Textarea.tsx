import { forwardRef, type TextareaHTMLAttributes } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, id, className = '', ...props }, ref) => {
    const textareaId = id ?? props.name

    return (
      <div className="space-y-1.5">
        <label
          htmlFor={textareaId}
          className="block text-sm font-medium text-neutral-600"
        >
          {label}
        </label>
        <textarea
          ref={ref}
          id={textareaId}
          rows={3}
          className={`w-full resize-none rounded-lg border bg-white px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-500 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-400/50 ${
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

Textarea.displayName = 'Textarea'
