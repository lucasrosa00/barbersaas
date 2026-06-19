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
