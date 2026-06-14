export const DIAS_SEMANA = [
  { value: 'seg', label: 'Segunda' },
  { value: 'ter', label: 'Terça' },
  { value: 'qua', label: 'Quarta' },
  { value: 'qui', label: 'Quinta' },
  { value: 'sex', label: 'Sexta' },
  { value: 'sab', label: 'Sábado' },
  { value: 'dom', label: 'Domingo' },
] as const

export type DiaSemana = (typeof DIAS_SEMANA)[number]['value']

export function formatDiasTrabalho(dias: DiaSemana[]): string {
  if (dias.length === 0) return '—'

  const labels = DIAS_SEMANA.filter((d) => dias.includes(d.value)).map(
    (d) => d.label,
  )

  return labels.join(', ')
}

export function getDiaLabel(value: DiaSemana): string {
  return DIAS_SEMANA.find((d) => d.value === value)?.label ?? value
}
