import type { AgendamentoStatus } from '@/types/agendamento'

export const AGENDAMENTO_STATUS = [
  { value: 'agendado', label: 'Agendado' },
  { value: 'confirmado', label: 'Confirmado' },
  { value: 'em_atendimento', label: 'Em atendimento' },
  { value: 'finalizado', label: 'Finalizado' },
  { value: 'cancelado', label: 'Cancelado' },
] as const satisfies { value: AgendamentoStatus; label: string }[]

export function getStatusLabel(status: AgendamentoStatus): string {
  return AGENDAMENTO_STATUS.find((s) => s.value === status)?.label ?? status
}

export function getStatusStyles(status: AgendamentoStatus): string {
  const styles: Record<AgendamentoStatus, string> = {
    agendado: 'bg-neutral-100 text-neutral-600 border-neutral-300',
    confirmado: 'bg-neutral-900 text-white border-neutral-900',
    em_atendimento: 'bg-neutral-200 text-neutral-800 border-neutral-400 border-dashed',
    finalizado: 'bg-neutral-50 text-neutral-500 border-neutral-200',
    cancelado: 'bg-neutral-100 text-neutral-400 border-neutral-200 line-through opacity-60',
  }
  return styles[status]
}

/** Estilos coloridos para blocos na grade da agenda */
export function getAgendaStatusStyles(status: AgendamentoStatus): string {
  const styles: Record<AgendamentoStatus, string> = {
    agendado: 'bg-sky-50 text-sky-950 border-sky-200',
    confirmado: 'bg-emerald-50 text-emerald-950 border-emerald-300',
    em_atendimento: 'bg-amber-50 text-amber-950 border-amber-300 border-dashed',
    finalizado: 'bg-neutral-100 text-neutral-600 border-neutral-300',
    cancelado: 'bg-red-50 text-red-700 border-red-200 line-through opacity-75',
  }
  return styles[status]
}

export function getAgendaStatusLegendColor(status: AgendamentoStatus): string {
  const colors: Record<AgendamentoStatus, string> = {
    agendado: 'border-sky-300 bg-sky-400',
    confirmado: 'border-emerald-400 bg-emerald-400',
    em_atendimento: 'border-amber-400 bg-amber-400',
    finalizado: 'border-neutral-400 bg-neutral-400',
    cancelado: 'border-red-300 bg-red-300',
  }
  return colors[status]
}
