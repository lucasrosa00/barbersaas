import type { DiaSemana } from '@/constants/diasSemana'
import type { TipoBloqueioHorario } from '@/constants/tipoBloqueio'

export interface BloqueioHorario {
  id: string
  barbeiroId: string
  barbeiroNome: string
  tipo: TipoBloqueioHorario
  dia?: DiaSemana
  data?: string
  horarioInicio: string
  horarioFim: string
  motivo: string
}

export type BloqueioHorarioFormData = Omit<
  BloqueioHorario,
  'id' | 'barbeiroNome'
>

export interface BloqueioHorarioFiltros {
  barbeiroId: string
  tipo: '' | TipoBloqueioHorario
}

export const bloqueioFiltrosVazios: BloqueioHorarioFiltros = {
  barbeiroId: '',
  tipo: '',
}
