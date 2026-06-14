import type { AgendamentoStatus } from '@/types/agendamento'

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
