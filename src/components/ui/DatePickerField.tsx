import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { DayPicker } from 'react-day-picker'
import { ptBR } from 'react-day-picker/locale'
import { Calendar, X } from 'lucide-react'
import {
  formatISODateToBR,
  formatPartialBRDateInput,
  parseBRDateToISO,
  parseLocalISODate,
  toLocalISODate,
} from '@/utils/datePicker'
import 'react-day-picker/style.css'

interface DatePickerFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  placeholder?: string
  disabled?: boolean
  id?: string
  clearable?: boolean
  autoWidthDesktop?: boolean
  hideLabel?: boolean
  fromYear?: number
  toYear?: number
}

interface PopoverPosition {
  top: number
  left: number
  width: number
}

function getPopoverPosition(trigger: HTMLElement): PopoverPosition {
  const rect = trigger.getBoundingClientRect()
  const popoverWidth = Math.max(rect.width, 288)
  const maxLeft = window.innerWidth - popoverWidth - 8
  const left = Math.max(8, Math.min(rect.left, maxLeft))

  return {
    top: rect.bottom + 4,
    left,
    width: popoverWidth,
  }
}

export function DatePickerField({
  label,
  value,
  onChange,
  error,
  placeholder = 'dd/mm/aaaa',
  disabled = false,
  id,
  clearable = false,
  autoWidthDesktop = false,
  hideLabel = false,
  fromYear,
  toYear,
}: DatePickerFieldProps) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState<PopoverPosition | null>(null)
  const [inputText, setInputText] = useState(() => formatISODateToBR(value))
  const [isEditing, setIsEditing] = useState(false)
  const [inputError, setInputError] = useState<string | null>(null)

  const currentYear = new Date().getFullYear()
  const resolvedFromYear = fromYear ?? currentYear - 100
  const resolvedToYear = toYear ?? currentYear + 10

  const selected = parseLocalISODate(value)
  const desktopClass = autoWidthDesktop ? 'sm:w-auto sm:max-w-none' : ''
  const displayError = error ?? inputError ?? undefined

  useEffect(() => {
    if (!isEditing) {
      setInputText(formatISODateToBR(value))
    }
  }, [value, isEditing])

  useLayoutEffect(() => {
    if (!open || !inputRef.current) return

    function updatePosition() {
      if (!inputRef.current) return
      setPosition(getPopoverPosition(inputRef.current))
    }

    updatePosition()
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)

    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [open])

  useEffect(() => {
    if (!open) return

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node
      if (
        containerRef.current?.contains(target) ||
        popoverRef.current?.contains(target)
      ) {
        return
      }
      setOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  function handleSelect(date: Date | undefined) {
    if (!date) return
    const iso = toLocalISODate(date)
    onChange(iso)
    setInputText(formatISODateToBR(iso))
    setInputError(null)
    setIsEditing(false)
    setOpen(false)
  }

  function handleClear(event: React.MouseEvent) {
    event.stopPropagation()
    onChange('')
    setInputText('')
    setInputError(null)
    setOpen(false)
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInputError(null)
    setInputText(formatPartialBRDateInput(event.target.value))
  }

  function handleInputFocus() {
    setIsEditing(true)
    setInputError(null)
  }

  function handleInputBlur() {
    setIsEditing(false)

    if (!inputText.trim()) {
      onChange('')
      setInputText('')
      setInputError(null)
      return
    }

    const parsed = parseBRDateToISO(inputText)
    if (parsed === null) {
      setInputError('Data inválida. Use dd/mm/aaaa.')
      setInputText(formatISODateToBR(value))
      return
    }

    onChange(parsed)
    setInputText(formatISODateToBR(parsed))
    setInputError(null)
  }

  function handleInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault()
      inputRef.current?.blur()
    }

    if (event.key === 'ArrowDown' || event.key === 'F4') {
      event.preventDefault()
      setOpen(true)
    }

    if (event.key === 'Escape') {
      setOpen(false)
      setInputText(formatISODateToBR(value))
      setInputError(null)
      setIsEditing(false)
      inputRef.current?.blur()
    }
  }

  const popover =
    open && !disabled && position
      ? createPortal(
          <div
            ref={popoverRef}
            className="fixed z-[100] rounded-xl border border-neutral-200 bg-white p-3 shadow-xl"
            style={{
              top: position.top,
              left: position.left,
              width: position.width,
            }}
          >
            <DayPicker
              mode="single"
              locale={ptBR}
              selected={selected}
              onSelect={handleSelect}
              defaultMonth={selected}
              captionLayout="dropdown"
              startMonth={new Date(resolvedFromYear, 0)}
              endMonth={new Date(resolvedToYear, 11)}
              className="date-picker-field"
            />
          </div>,
          document.body,
        )
      : null

  return (
    <>
      <div
        ref={containerRef}
        className={`min-w-0 w-full max-w-full space-y-1.5 ${desktopClass}`}
      >
        <label
          htmlFor={fieldId}
          className={`block text-sm font-medium text-neutral-600 ${hideLabel ? 'sr-only' : ''}`}
        >
          {label}
        </label>

        <div className="relative">
          <input
            ref={inputRef}
            id={fieldId}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            disabled={disabled}
            placeholder={placeholder}
            value={inputText}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onKeyDown={handleInputKeyDown}
            className={`box-border min-w-0 max-w-full w-full rounded-lg border bg-white py-2.5 pl-3.5 pr-20 text-[16px] text-neutral-900 placeholder:text-neutral-500 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-400/50 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm ${desktopClass} ${
              displayError
                ? 'border-neutral-900 focus:border-neutral-900'
                : 'border-neutral-300 focus:border-neutral-900'
            }`}
          />

          <div className="absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center gap-0.5">
            {clearable && value && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                aria-label="Limpar data"
                tabIndex={-1}
              >
                <X className="h-4 w-4" />
              </button>
            )}

            <button
              type="button"
              disabled={disabled}
              onClick={() => setOpen((current) => !current)}
              className="rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Abrir calendário"
              tabIndex={-1}
            >
              <Calendar className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>

        {displayError && <p className="text-xs text-neutral-600">{displayError}</p>}
      </div>

      {popover}
    </>
  )
}
