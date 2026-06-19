import { generateTimeSlots } from '@/utils/timeSlots'

export function generateDayTimeOptions(intervalMinutes = 15) {
  return generateTimeSlots('00:00', '24:00', intervalMinutes).map((time) => ({
    value: time,
    label: time,
  }))
}

export function parseLocalISODate(iso: string): Date | undefined {
  if (!iso) return undefined

  const [year, month, day] = iso.split('-').map(Number)
  if (!year || !month || !day) return undefined

  return new Date(year, month - 1, day)
}

export function toLocalISODate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function formatISODateToBR(iso: string): string {
  if (!iso) return ''

  const [year, month, day] = iso.split('-')
  if (!year || !month || !day) return ''

  return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`
}

export function formatPartialBRDateInput(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 8)
  if (digits.length <= 2) return digits
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
}

/** Converte `dd/mm/aaaa` (ou parcial com 8 dígitos) para ISO local. Retorna `''` se vazio, `null` se inválido. */
export function parseBRDateToISO(input: string): string | null {
  const trimmed = input.trim()
  if (!trimmed) return ''

  const match = trimmed.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/)
  if (!match) return null

  const day = Number(match[1])
  const month = Number(match[2])
  let year = Number(match[3])

  if (year < 100) {
    year += year >= 50 ? 1900 : 2000
  }

  if (month < 1 || month > 12 || day < 1 || day > 31) return null

  const date = new Date(year, month - 1, day)
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null
  }

  return toLocalISODate(date)
}
