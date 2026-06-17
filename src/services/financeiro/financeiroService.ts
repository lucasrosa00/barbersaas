import { apiClient } from '@/services/api/client'
import type {
  FinanceiroData,
  Movimentacao,
  MovimentacaoFormData,
  TipoMovimentacao,
} from '@/types/financeiro'

interface FinanceiroApiResponse {
  resumo: FinanceiroData['resumo']
  faturamentoDiario: FinanceiroData['faturamentoDiario']
  faturamentoMensal: FinanceiroData['faturamentoMensal']
  movimentacoes: Array<{
    id: string
    descricao: string
    data: string
    valor: number
    tipo: TipoMovimentacao
    clienteNome?: string | null
    servicoNome?: string | null
    barbeiroId?: string | null
    barbeiroNome?: string | null
  }>
}

function mapMovimentacao(
  dto: FinanceiroApiResponse['movimentacoes'][number],
  empresaId: string,
): Movimentacao {
  return {
    id: dto.id,
    empresaId,
    descricao: dto.descricao,
    data: dto.data,
    valor: Number(dto.valor),
    tipo: dto.tipo,
    clienteNome: dto.clienteNome ?? undefined,
    servicoNome: dto.servicoNome ?? undefined,
    barbeiroId: dto.barbeiroId ?? undefined,
    barbeiroNome: dto.barbeiroNome ?? undefined,
  }
}

export const financeiroService = {
  async getData(empresaId: string): Promise<FinanceiroData> {
    const data = await apiClient<FinanceiroApiResponse>('/financeiro')

    return {
      resumo: {
        faturamentoDia: Number(data.resumo.faturamentoDia),
        faturamentoSemana: Number(data.resumo.faturamentoSemana),
        faturamentoMes: Number(data.resumo.faturamentoMes),
      },
      faturamentoDiario: data.faturamentoDiario.map((item) => ({
        label: item.label,
        valor: Number(item.valor),
      })),
      faturamentoMensal: data.faturamentoMensal.map((item) => ({
        label: item.label,
        valor: Number(item.valor),
      })),
      movimentacoes: data.movimentacoes.map((item) =>
        mapMovimentacao(item, empresaId),
      ),
    }
  },

  async createMovimentacao(
    empresaId: string,
    formData: MovimentacaoFormData,
  ): Promise<Movimentacao> {
    const dto = await apiClient<FinanceiroApiResponse['movimentacoes'][number]>(
      '/financeiro/movimentacoes',
      {
        method: 'POST',
        body: JSON.stringify({
          descricao: formData.descricao,
          data: formData.data,
          valor: formData.valor,
          tipo: formData.tipo,
          barbeiroId: formData.barbeiroId || null,
        }),
      },
    )

    return mapMovimentacao(dto, empresaId)
  },
}
