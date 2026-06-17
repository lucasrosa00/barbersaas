import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'

export interface ComboboxOption {
  value: string
  label: string
}

interface ComboboxProps {
  label: string
  placeholder?: string
  emptyMessage?: string
  options: ComboboxOption[]
  value: string
  onChange: (value: string) => void
  error?: string
  disabled?: boolean
}

function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
}

export function Combobox({
  label,
  placeholder = 'Digite para buscar...',
  emptyMessage = 'Nenhum resultado encontrado',
  options,
  value,
  onChange,
  error,
  disabled = false,
}: ComboboxProps) {
  const inputId = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  const selectedOption = options.find((opt) => opt.value === value)

  useEffect(() => {
    setQuery(selectedOption?.label ?? '')
  }, [selectedOption?.label, value])

  const filteredOptions = useMemo(() => {
    const term = normalize(query.trim())
    if (!term) return options
    return options.filter((opt) => normalize(opt.label).includes(term))
  }, [options, query])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false)
        setQuery(selectedOption?.label ?? '')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [selectedOption?.label])

  function handleSelect(option: ComboboxOption) {
    onChange(option.value)
    setQuery(option.label)
    setOpen(false)
  }

  function handleInputChange(next: string) {
    setQuery(next)
    setOpen(true)

    const exactMatch = options.find(
      (opt) => normalize(opt.label) === normalize(next.trim()),
    )
    if (exactMatch) {
      onChange(exactMatch.value)
      return
    }

    if (value) onChange('')
  }

  return (
    <div ref={containerRef} className="relative space-y-1.5">
      <label htmlFor={inputId} className="block text-sm font-medium text-neutral-600">
        {label}
      </label>

      <div className="relative">
        <input
          id={inputId}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
          autoComplete="off"
          disabled={disabled}
          placeholder={placeholder}
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => !disabled && setOpen(true)}
          className={`w-full rounded-lg border bg-white py-2.5 pl-3.5 pr-10 text-sm text-neutral-900 placeholder:text-neutral-500 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-400/50 ${
            error
              ? 'border-neutral-900 focus:border-neutral-900'
              : 'border-neutral-300 focus:border-neutral-900'
          } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
        />
        <ChevronDown
          className={`pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400 transition-transform ${
            open ? 'rotate-180' : ''
          }`}
          aria-hidden
        />
      </div>

      {open && !disabled && (
        <ul
          role="listbox"
          className="absolute z-50 mt-1 max-h-48 w-full overflow-auto rounded-lg border border-neutral-200 bg-white py-1 shadow-lg"
        >
          {filteredOptions.length === 0 ? (
            <li className="px-3.5 py-2.5 text-sm text-neutral-500">{emptyMessage}</li>
          ) : (
            filteredOptions.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={option.value === value}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSelect(option)}
                  className={`w-full px-3.5 py-2.5 text-left text-sm transition-colors hover:bg-neutral-100 ${
                    option.value === value
                      ? 'bg-neutral-50 font-medium text-neutral-900'
                      : 'text-neutral-700'
                  }`}
                >
                  {option.label}
                </button>
              </li>
            ))
          )}
        </ul>
      )}

      {error && <p className="text-xs text-neutral-600">{error}</p>}
    </div>
  )
}
