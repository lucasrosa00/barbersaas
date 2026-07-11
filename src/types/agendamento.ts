export type AgendamentoStatus =
  | 'agendado'
  | 'reservado'
  | 'confirmado'
  | 'em_atendimento'
  | 'finalizado'
  | 'cancelado'

export type { MetodoPagamento } from '@/constants/metodoPagamento'
import type { MetodoPagamento } from '@/constants/metodoPagamento'

export interface Agendamento {
  id: string
  empresaId: string
  clienteId: string
  barbeiroId: string
  servicoIds: string[]
  data: string
  horario: string
  duracaoMinutos: number
  valorComDesconto?: number
  status: AgendamentoStatus
  metodoPagamento?: MetodoPagamento
  tokenConfirmacao?: string
}

export type AgendamentoFormData = Omit<Agendamento, 'id' | 'empresaId'>

export interface AgendamentoEnriquecido extends Agendamento {
  clienteNome: string
  barbeiroNome: string
  servicoNome: string
}
