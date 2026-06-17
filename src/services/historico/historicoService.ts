import { apiClient } from '@/services/api/client'
import { mapPagedResult } from '@/services/api/paged'
import type { PagedResult } from '@/types/pagination'
import type { HistoricoAtendimento, HistoricoFiltros } from '@/types/historico'
import type { AgendamentoStatus } from '@/types/agendamento'
import { buildPaginationQuery } from '@/utils/pagination'

interface HistoricoApiDto {
  id: string
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

function buildFilterParams(filtros: HistoricoFiltros) {
  return {
    clienteId: filtros.clienteId || undefined,
    barbeiroId: filtros.barbeiroId || undefined,
    dataInicio: filtros.dataInicio || undefined,
    dataFim: filtros.dataFim || undefined,
  }
}

function mapHistorico(dto: HistoricoApiDto, empresaId: string): HistoricoAtendimento {
  return {
    id: dto.id,
    empresaId,
    clienteId: dto.clienteId,
    clienteNome: dto.clienteNome,
    servicoId: dto.servicoId,
    servicoNome: dto.servicoNome,
    barbeiroId: dto.barbeiroId,
    barbeiroNome: dto.barbeiroNome,
    data: dto.data,
    valor: Number(dto.valor),
    status: dto.status,
  }
}

export const historicoService = {
  async listPaged(
    empresaId: string,
    page: number,
    pageSize: number,
    filtros: HistoricoFiltros = {
      clienteId: '',
      barbeiroId: '',
      dataInicio: '',
      dataFim: '',
    },
  ): Promise<PagedResult<HistoricoAtendimento>> {
    const query = buildPaginationQuery(
      { page, pageSize },
      buildFilterParams(filtros),
    )
    const data = await apiClient<PagedResult<HistoricoApiDto>>(`/historico${query}`)
    return {
      ...mapPagedResult(data),
      items: data.items.map((item) => mapHistorico(item, empresaId)),
    }
  },

  async getTotal(filtros: HistoricoFiltros): Promise<number> {
    const params = new URLSearchParams()
    const filters = buildFilterParams(filtros)
    for (const [key, value] of Object.entries(filters)) {
      if (value) params.set(key, value)
    }
    const query = params.toString()
    const data = await apiClient<{ total: number }>(
      `/historico/total${query ? `?${query}` : ''}`,
    )
    return Number(data.total)
  },
}
