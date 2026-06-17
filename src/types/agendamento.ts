export type AgendamentoStatus =
  | 'agendado'
  | 'confirmado'
  | 'em_atendimento'
  | 'finalizado'
  | 'cancelado'

export interface Agendamento {
  id: string
  empresaId: string
  clienteId: string
  barbeiroId: string
  servicoId: string
  data: string
  horario: string
  duracaoMinutos: number
  valorComDesconto?: number
  status: AgendamentoStatus
}

export type AgendamentoFormData = Omit<Agendamento, 'id' | 'empresaId'>

export interface AgendamentoEnriquecido extends Agendamento {
  clienteNome: string
  barbeiroNome: string
  servicoNome: string
}
