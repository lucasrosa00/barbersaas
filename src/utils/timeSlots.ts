export function generateTimeSlots(
  inicio = '08:00',
  fim = '20:00',
  intervaloMinutos = 60,
): string[] {
  const slots: string[] = []
  let current = timeToMinutes(inicio)
  const end = timeToMinutes(fim)

  while (current < end) {
    slots.push(minutesToTime(current))
    current += intervaloMinutos
  }

  return slots
}

export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export function formatDateBR(isoDate: string): string {
  const [year, month, day] = isoDate.split('-')
  return `${day}/${month}/${year}`
}

export function toISODate(date: Date): string {
  return date.toISOString().split('T')[0]
}

export function addDays(isoDate: string, days: number): string {
  const date = new Date(isoDate + 'T12:00:00')
  date.setDate(date.getDate() + days)
  return toISODate(date)
}
