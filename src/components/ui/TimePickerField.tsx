import { useMemo } from 'react'
import { Select } from '@/components/ui/Select'
import { generateDayTimeOptions } from '@/utils/datePicker'

interface TimePickerFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  placeholder?: string
  disabled?: boolean
  id?: string
  intervalMinutes?: number
}

export function TimePickerField({
  label,
  value,
  onChange,
  error,
  placeholder = 'Selecione o horário',
  disabled = false,
  id,
  intervalMinutes = 15,
}: TimePickerFieldProps) {
  const options = useMemo(() => {
    const slots = generateDayTimeOptions(intervalMinutes)

    if (value && !slots.some((option) => option.value === value)) {
      return [{ value, label: value }, ...slots]
    }

    return slots
  }, [intervalMinutes, value])

  return (
    <Select
      id={id}
      label={label}
      placeholder={placeholder}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      options={options}
      error={error}
      disabled={disabled}
    />
  )
}
