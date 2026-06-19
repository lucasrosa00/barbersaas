import type { AgendamentoStatus } from '@/types/agendamento'
import type { MetodoPagamento } from '@/constants/metodoPagamento'

export interface HistoricoAtendimento {
  id: string
  empresaId: string
  clienteId: string
  clienteNome: string
  servicoId: string
  servicoNome: string
  barbeiroId: string
  barbeiroNome: string
  data: string
  valor: number
  status: AgendamentoStatus
  metodoPagamento?: MetodoPagamento
}

export interface HistoricoFiltros {
  clienteId: string
  barbeiroId: string
  dataInicio: string
  dataFim: string
}

export const historicoFiltrosVazios: HistoricoFiltros = {
  clienteId: '',
  barbeiroId: '',
  dataInicio: '',
  dataFim: '',
}
