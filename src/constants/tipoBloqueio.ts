export type TipoBloqueioHorario = 'fixo' | 'pontual'

export const TIPOS_BLOQUEIO = [
  {
    value: 'fixo' as const,
    label: 'Fixo',
    description: 'Repete toda semana no mesmo dia e horário (ex.: almoço)',
  },
  {
    value: 'pontual' as const,
    label: 'Pontual',
    description: 'Bloqueio em uma data específica (ex.: médico, dentista)',
  },
] satisfies {
  value: TipoBloqueioHorario
  label: string
  description: string
}[]

export function getTipoBloqueioLabel(tipo: TipoBloqueioHorario): string {
  return TIPOS_BLOQUEIO.find((t) => t.value === tipo)?.label ?? tipo
}
