export function formatDuracao(minutos: number): string {
  if (minutos < 60) return `${minutos} min`

  const horas = Math.floor(minutos / 60)
  const resto = minutos % 60

  if (resto === 0) return `${horas}h`
  return `${horas}h ${resto}min`
}
