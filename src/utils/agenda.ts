import type { Barbeiro } from '@/types/barbeiro'
import type { AgendamentoEnriquecido } from '@/types/agendamento'
import {
  generateTimeSlots,
  minutesToTime,
  timeToMinutes,
} from '@/utils/timeSlots'

export const AGENDA_INICIO = '08:00'
export const AGENDA_FIM = '20:00'
/** Granularidade visual da grade (posicionamento dos blocos) */
export const AGENDA_GRID_MINUTES = 15
/** Passo ao listar horários disponíveis para agendar */
export const AGENDA_BOOKING_STEP_MINUTES = 5
export const AGENDA_SLOT_MINUTES = AGENDA_GRID_MINUTES
export const SLOT_HEIGHT_PX = 44

export function getSlots(
  inicio = AGENDA_INICIO,
  fim = AGENDA_FIM,
): string[] {
  return generateTimeSlots(inicio, fim, AGENDA_GRID_MINUTES)
}

export function getBarbeiroAgendamentosDoDia(
  agendamentos: AgendamentoEnriquecido[],
  data: string,
  barbeiroId: string,
  excludeId?: string,
): AgendamentoEnriquecido[] {
  return agendamentos.filter((agendamento) => {
    if (agendamento.data !== data) return false
    if (agendamento.barbeiroId !== barbeiroId) return false
    if (agendamento.status === 'cancelado') return false
    if (excludeId && agendamento.id === excludeId) return false
    return true
  })
}

export function getBusyBlocks(
  agendamentos: AgendamentoEnriquecido[],
  data: string,
  barbeiroId: string,
  excludeId?: string,
): Array<{ start: number; end: number }> {
  return getBarbeiroAgendamentosDoDia(agendamentos, data, barbeiroId, excludeId)
    .map((agendamento) => ({
      start: timeToMinutes(agendamento.horario),
      end:
        timeToMinutes(agendamento.horario) + agendamento.duracaoMinutos,
    }))
    .sort((a, b) => a.start - b.start)
}

export function getFreeIntervals(
  workStart: number,
  workEnd: number,
  busyBlocks: Array<{ start: number; end: number }>,
): Array<{ start: number; end: number }> {
  const free: Array<{ start: number; end: number }> = []
  let cursor = workStart

  for (const block of busyBlocks) {
    if (block.start > cursor) {
      free.push({ start: cursor, end: block.start })
    }
    cursor = Math.max(cursor, block.end)
  }

  if (cursor < workEnd) {
    free.push({ start: cursor, end: workEnd })
  }

  return free
}

export function getHorariosInFreeGaps(
  barbeiro: Barbeiro,
  agendamentos: AgendamentoEnriquecido[],
  data: string,
  duracaoMinutos: number,
  excludeId?: string,
): string[] {
  const workStart = timeToMinutes(barbeiro.horarioInicio)
  const workEnd = timeToMinutes(barbeiro.horarioFim)
  const busyBlocks = getBusyBlocks(agendamentos, data, barbeiro.id, excludeId)
  const freeIntervals = getFreeIntervals(workStart, workEnd, busyBlocks)
  const candidates = new Set<string>()

  for (const gap of freeIntervals) {
    if (gap.end - gap.start < duracaoMinutos) continue

    for (
      let time = gap.start;
      time + duracaoMinutos <= gap.end;
      time += AGENDA_BOOKING_STEP_MINUTES
    ) {
      candidates.add(minutesToTime(time))
    }

    const snugStart = gap.end - duracaoMinutos
    if (snugStart >= gap.start) {
      candidates.add(minutesToTime(snugStart))
    }
  }

  return Array.from(candidates).sort(
    (a, b) => timeToMinutes(a) - timeToMinutes(b),
  )
}

export function getAppointmentEndTimes(
  agendamentos: AgendamentoEnriquecido[],
  data: string,
  barbeiroId: string,
  excludeId?: string,
): string[] {
  const ends = new Set<string>()

  for (const agendamento of getBarbeiroAgendamentosDoDia(
    agendamentos,
    data,
    barbeiroId,
    excludeId,
  )) {
    ends.add(getHorarioFim(agendamento.horario, agendamento.duracaoMinutos))
  }

  return Array.from(ends)
}

export function isHorarioAlignedToIntervalo(
  horario: string,
  barbeiro: Barbeiro,
  intervaloMinutos: number,
): boolean {
  const offset = timeToMinutes(horario) - timeToMinutes(barbeiro.horarioInicio)
  return offset >= 0 && offset % intervaloMinutos === 0
}

export function getCandidateStartTimes(
  barbeiro: Barbeiro,
  agendamentos: AgendamentoEnriquecido[],
  data: string,
  intervaloMinutos: number,
  duracaoMinutos: number,
  excludeId?: string,
): string[] {
  const candidates = new Set<string>()

  for (const horario of getHorariosInFreeGaps(
    barbeiro,
    agendamentos,
    data,
    duracaoMinutos,
    excludeId,
  )) {
    candidates.add(horario)
  }

  for (const slot of generateTimeSlots(
    barbeiro.horarioInicio,
    barbeiro.horarioFim,
    intervaloMinutos,
  )) {
    candidates.add(slot)
  }

  for (const endTime of getAppointmentEndTimes(
    agendamentos,
    data,
    barbeiro.id,
    excludeId,
  )) {
    if (timeToMinutes(endTime) < timeToMinutes(barbeiro.horarioFim)) {
      candidates.add(endTime)
    }
  }

  return Array.from(candidates).sort(
    (a, b) => timeToMinutes(a) - timeToMinutes(b),
  )
}

export function isInstantOccupied(
  agendamentos: AgendamentoEnriquecido[],
  barbeiroId: string,
  horario: string,
  excludeId?: string,
): boolean {
  const instant = timeToMinutes(horario)

  return agendamentos.some((agendamento) => {
    if (agendamento.barbeiroId !== barbeiroId) return false
    if (agendamento.status === 'cancelado') return false
    if (excludeId && agendamento.id === excludeId) return false

    const start = timeToMinutes(agendamento.horario)
    const end = start + agendamento.duracaoMinutos
    return instant >= start && instant < end
  })
}

export function getClickableHorarios(
  barbeiro: Barbeiro,
  agendamentos: AgendamentoEnriquecido[],
  data: string,
  intervaloMinutos: number,
): string[] {
  const appointmentEnds = new Set(
    getAppointmentEndTimes(agendamentos, data, barbeiro.id),
  )
  const workStart = timeToMinutes(barbeiro.horarioInicio)
  const workEnd = timeToMinutes(barbeiro.horarioFim)
  const busyBlocks = getBusyBlocks(agendamentos, data, barbeiro.id)
  const freeIntervals = getFreeIntervals(workStart, workEnd, busyBlocks)
  const clickable = new Set<string>()

  for (const gap of freeIntervals) {
    if (gap.end - gap.start < AGENDA_BOOKING_STEP_MINUTES) continue

    clickable.add(minutesToTime(gap.start))

    for (
      let time = gap.start;
      time < gap.end;
      time += AGENDA_BOOKING_STEP_MINUTES
    ) {
      const horario = minutesToTime(time)
      if (isInstantOccupied(agendamentos, barbeiro.id, horario)) continue
      if (isSlotOccupied(agendamentos, barbeiro.id, horario)) continue

      const aligned = isHorarioAlignedToIntervalo(
        horario,
        barbeiro,
        intervaloMinutos,
      )
      if (aligned || appointmentEnds.has(horario)) {
        clickable.add(horario)
      }
    }
  }

  for (const endTime of appointmentEnds) {
    if (!isSlotWithinWorkingHours(endTime, barbeiro)) continue
    if (isInstantOccupied(agendamentos, barbeiro.id, endTime)) continue
    if (isSlotOccupied(agendamentos, barbeiro.id, endTime)) continue
    clickable.add(endTime)
  }

  return Array.from(clickable).sort(
    (a, b) => timeToMinutes(a) - timeToMinutes(b),
  )
}

export function getAgendaTotalHeight(
  inicio = AGENDA_INICIO,
  fim = AGENDA_FIM,
): number {
  return getSlots(inicio, fim).length * SLOT_HEIGHT_PX
}

export function getTopFromHorario(
  horario: string,
  inicio = AGENDA_INICIO,
): number {
  const offset = timeToMinutes(horario) - timeToMinutes(inicio)
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
  intervaloMinutos: number,
  excludeAgendamentoId?: string,
  horarioAtual?: string,
): string[] {
  const disponiveis = getCandidateStartTimes(
    barbeiro,
    agendamentos,
    data,
    intervaloMinutos,
    duracaoMinutos,
    excludeAgendamentoId,
  ).filter((slot) => {
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

  if (
    horarioAtual &&
    !disponiveis.includes(horarioAtual) &&
    fitsInWorkingHours(horarioAtual, duracaoMinutos, barbeiro) &&
    !hasConflict(
      agendamentos,
      data,
      barbeiro.id,
      horarioAtual,
      duracaoMinutos,
      excludeAgendamentoId,
    )
  ) {
    return [horarioAtual, ...disponiveis].sort(
      (a, b) => timeToMinutes(a) - timeToMinutes(b),
    )
  }

  return disponiveis
}

export function getPrimeiroHorarioDisponivel(
  barbeiro: Barbeiro,
  agendamentos: AgendamentoEnriquecido[],
  duracaoMinutos: number,
  data: string,
  intervaloMinutos: number,
): string | undefined {
  return getHorariosDisponiveis(
    barbeiro,
    agendamentos,
    duracaoMinutos,
    data,
    intervaloMinutos,
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
