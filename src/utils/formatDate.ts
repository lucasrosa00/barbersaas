function parseISODate(isoDate: string): Date | null {
  if (!isoDate) return null

  const [year, month, day] = isoDate.split('-').map(Number)
  if (!year || !month || !day) return null

  return new Date(year, month - 1, day)
}

export function formatDateBR(isoDate: string): string {
  if (!isoDate) return '—'

  const [year, month, day] = isoDate.split('-')
  if (!year || !month || !day) return isoDate

  return `${day}/${month}/${year}`
}

export function formatWeekdayLong(isoDate: string): string {
  const date = parseISODate(isoDate)
  if (!date) return ''

  const weekday = date.toLocaleDateString('pt-BR', { weekday: 'long' })
  return weekday.charAt(0).toUpperCase() + weekday.slice(1)
}

export function isToday(isoDate: string): boolean {
  const date = parseISODate(isoDate)
  if (!date) return false

  const today = new Date()
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  )
}
