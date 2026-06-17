import { apiClient } from '@/services/api/client'
import { mapPagedResult } from '@/services/api/paged'
import type { PagedResult } from '@/types/pagination'
import type {
  FinanceiroData,
  Movimentacao,
  MovimentacaoFormData,
  TipoMovimentacao,
} from '@/types/financeiro'
import { buildPaginationQuery } from '@/utils/pagination'

interface MovimentacaoApiDto {
  id: string
  descricao: string
  data: string
  valor: number
  tipo: TipoMovimentacao
  clienteNome?: string | null
  servicoNome?: string | null
  barbeiroId?: string | null
  barbeiroNome?: string | null
  agendamentoId?: string | null
}

interface FinanceiroApiResponse {
  resumo: FinanceiroData['resumo']
  faturamentoDiario: FinanceiroData['faturamentoDiario']
  faturamentoMensal: FinanceiroData['faturamentoMensal']
  movimentacoes: PagedResult<MovimentacaoApiDto>
}

function mapMovimentacao(dto: MovimentacaoApiDto, empresaId: string): Movimentacao {
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
    agendamentoId: dto.agendamentoId ?? undefined,
  }
}

export const financeiroService = {
  async getData(
    empresaId: string,
    page: number,
    pageSize: number,
    barbeiroId?: string,
  ): Promise<FinanceiroData> {
    const query = buildPaginationQuery(
      { page, pageSize },
      { barbeiroId: barbeiroId || undefined },
    )
    const data = await apiClient<FinanceiroApiResponse>(`/financeiro${query}`)

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
      movimentacoes: {
        ...mapPagedResult(data.movimentacoes),
        items: data.movimentacoes.items.map((item) =>
          mapMovimentacao(item, empresaId),
        ),
      },
    }
  },

  async createMovimentacao(
    empresaId: string,
    formData: MovimentacaoFormData,
  ): Promise<Movimentacao> {
    const dto = await apiClient<MovimentacaoApiDto>(
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

  async deleteMovimentacao(id: string): Promise<void> {
    await apiClient(`/financeiro/movimentacoes/${id}`, {
      method: 'DELETE',
    })
  },
}
