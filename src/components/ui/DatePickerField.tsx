import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { DayPicker } from 'react-day-picker'
import { ptBR } from 'react-day-picker/locale'
import { Calendar, X } from 'lucide-react'
import { formatDateBR } from '@/utils/formatDate'
import { parseLocalISODate } from '@/utils/datePicker'
import { toISODate } from '@/utils/timeSlots'
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
  placeholder = 'Selecione a data',
  disabled = false,
  id,
  clearable = false,
  autoWidthDesktop = false,
  hideLabel = false,
}: DatePickerFieldProps) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState<PopoverPosition | null>(null)

  const selected = parseLocalISODate(value)
  const desktopClass = autoWidthDesktop ? 'sm:w-auto sm:max-w-none' : ''

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return

    function updatePosition() {
      if (!triggerRef.current) return
      setPosition(getPopoverPosition(triggerRef.current))
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
    onChange(toISODate(date))
    setOpen(false)
  }

  function handleClear(event: React.MouseEvent) {
    event.stopPropagation()
    onChange('')
    setOpen(false)
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
          <button
            ref={triggerRef}
            id={fieldId}
            type="button"
            disabled={disabled}
            onClick={() => setOpen((current) => !current)}
            className={`flex w-full items-center justify-between gap-2 rounded-lg border bg-white px-3.5 py-2.5 text-left text-[16px] transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-400/50 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm ${desktopClass} ${
              error
                ? 'border-neutral-900 focus:border-neutral-900'
                : 'border-neutral-300 focus:border-neutral-900'
            }`}
          >
            <span className={value ? 'text-neutral-900' : 'text-neutral-500'}>
              {value ? formatDateBR(value) : placeholder}
            </span>
            <Calendar className="h-4 w-4 shrink-0 text-neutral-400" aria-hidden />
          </button>

          {clearable && value && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-10 top-1/2 -translate-y-1/2 rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
              aria-label="Limpar data"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {error && <p className="text-xs text-neutral-600">{error}</p>}
      </div>

      {popover}
    </>
  )
}
