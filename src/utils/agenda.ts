import type { Barbeiro } from '@/types/barbeiro'
import type { AgendamentoEnriquecido } from '@/types/agendamento'
import {
  generateTimeSlots,
  minutesToTime,
  timeToMinutes,
} from '@/utils/timeSlots'

export const AGENDA_INICIO = '08:00'
export const AGENDA_FIM = '20:00'
export const AGENDA_SLOT_MINUTES = 15
export const SLOT_HEIGHT_PX = 28

export function getSlots(): string[] {
  return generateTimeSlots(AGENDA_INICIO, AGENDA_FIM, AGENDA_SLOT_MINUTES)
}

export function getAgendaTotalHeight(): number {
  return getSlots().length * SLOT_HEIGHT_PX
}

export function getTopFromHorario(horario: string): number {
  const offset = timeToMinutes(horario) - timeToMinutes(AGENDA_INICIO)
  return (offset / AGENDA_SLOT_MINUTES) * SLOT_HEIGHT_PX
}

export function getHeightFromDuracao(duracaoMinutos: number): number {
  return (duracaoMinutos / AGENDA_SLOT_MINUTES) * SLOT_HEIGHT_PX
}

export function getHorarioFim(horario: string, duracaoMinutos: number): string {
  return minutesToTime(timeToMinutes(horario) + duracaoMinutos)
}

export function appointmentsOverlap(
  startA: string,
  duracaoA: number,
  startB: string,
  duracaoB: number,
): boolean {
  const aStart = timeToMinutes(startA)
  const aEnd = aStart + duracaoA
  const bStart = timeToMinutes(startB)
  const bEnd = bStart + duracaoB
  return aStart < bEnd && bStart < aEnd
}

export function fitsInWorkingHours(
  horario: string,
  duracaoMinutos: number,
  barbeiro: Barbeiro,
): boolean {
  const start = timeToMinutes(horario)
  const end = start + duracaoMinutos
  const workStart = timeToMinutes(barbeiro.horarioInicio)
  const workEnd = timeToMinutes(barbeiro.horarioFim)
  return start >= workStart && end <= workEnd
}

export function isSlotOccupied(
  agendamentos: AgendamentoEnriquecido[],
  barbeiroId: string,
  slotHorario: string,
  excludeId?: string,
): boolean {
  const slotStart = timeToMinutes(slotHorario)
  const slotEnd = slotStart + AGENDA_SLOT_MINUTES

  return agendamentos.some((a) => {
    if (a.barbeiroId !== barbeiroId) return false
    if (a.status === 'cancelado') return false
    if (excludeId && a.id === excludeId) return false

    const agStart = timeToMinutes(a.horario)
    const agEnd = agStart + a.duracaoMinutos
    return slotStart < agEnd && agStart < slotEnd
  })
}

export function isSlotWithinWorkingHours(
  slotHorario: string,
  barbeiro: Barbeiro,
): boolean {
  const slotStart = timeToMinutes(slotHorario)
  const workStart = timeToMinutes(barbeiro.horarioInicio)
  const workEnd = timeToMinutes(barbeiro.horarioFim)
  return slotStart >= workStart && slotStart < workEnd
}

export function getHorariosDisponiveis(
  barbeiro: Barbeiro,
  agendamentos: AgendamentoEnriquecido[],
  duracaoMinutos: number,
  data: string,
  excludeAgendamentoId?: string,
): string[] {
  return getSlots().filter((slot) => {
    if (!fitsInWorkingHours(slot, duracaoMinutos, barbeiro)) return false
    if (
      hasConflict(
        agendamentos,
        data,
        barbeiro.id,
        slot,
        duracaoMinutos,
        excludeAgendamentoId,
      )
    ) {
      return false
    }
    return true
  })
}

export function getPrimeiroHorarioDisponivel(
  barbeiro: Barbeiro,
  agendamentos: AgendamentoEnriquecido[],
  duracaoMinutos: number,
  data: string,
): string | undefined {
  return getHorariosDisponiveis(
    barbeiro,
    agendamentos,
    duracaoMinutos,
    data,
  )[0]
}

export function hasConflict(
  agendamentos: AgendamentoEnriquecido[],
  data: string,
  barbeiroId: string,
  horario: string,
  duracaoMinutos: number,
  excludeId?: string,
): boolean {
  return agendamentos.some((a) => {
    if (a.data !== data) return false
    if (a.barbeiroId !== barbeiroId) return false
    if (a.status === 'cancelado') return false
    if (excludeId && a.id === excludeId) return false
    return appointmentsOverlap(horario, duracaoMinutos, a.horario, a.duracaoMinutos)
  })
}

export function formatHorarioIntervalo(
  inicio: string,
  duracaoMinutos: number,
): string {
  return `${inicio} — ${getHorarioFim(inicio, duracaoMinutos)}`
}
