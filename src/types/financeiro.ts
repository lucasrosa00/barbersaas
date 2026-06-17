export type TipoMovimentacao = 'entrada' | 'saida'

export interface Movimentacao {
  id: string
  empresaId: string
  descricao: string
  clienteNome?: string
  servicoNome?: string
  barbeiroId?: string
  barbeiroNome?: string
  agendamentoId?: string
  data: string
  valor: number
  tipo: TipoMovimentacao
}

export interface ResumoFinanceiro {
  faturamentoDia: number
  faturamentoSemana: number
  faturamentoMes: number
}

export interface DadoGrafico {
  label: string
  valor: number
}

import type { PagedResult } from '@/types/pagination'

export interface FinanceiroData {
  resumo: ResumoFinanceiro
  faturamentoDiario: DadoGrafico[]
  faturamentoMensal: DadoGrafico[]
  movimentacoes: PagedResult<Movimentacao>
}

export interface MovimentacaoFormData {
  descricao: string
  data: string
  valor: number
  tipo: TipoMovimentacao
  barbeiroId?: string
}
