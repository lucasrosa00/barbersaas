import { apiClient } from '@/services/api/client'
import type { HistoricoAtendimento, HistoricoFiltros } from '@/types/historico'
import type { AgendamentoStatus } from '@/types/agendamento'

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

function buildQuery(filtros: HistoricoFiltros): string {
  const params = new URLSearchParams()

  if (filtros.clienteId) params.set('clienteId', filtros.clienteId)
  if (filtros.barbeiroId) params.set('barbeiroId', filtros.barbeiroId)
  if (filtros.dataInicio) params.set('dataInicio', filtros.dataInicio)
  if (filtros.dataFim) params.set('dataFim', filtros.dataFim)

  const query = params.toString()
  return query ? `?${query}` : ''
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
  async list(
    empresaId: string,
    filtros: HistoricoFiltros = {
      clienteId: '',
      barbeiroId: '',
      dataInicio: '',
      dataFim: '',
    },
  ): Promise<HistoricoAtendimento[]> {
    const data = await apiClient<HistoricoApiDto[]>(`/historico${buildQuery(filtros)}`)
    return data.map((item) => mapHistorico(item, empresaId))
  },

  async getTotal(filtros: HistoricoFiltros): Promise<number> {
    const data = await apiClient<{ total: number }>(
      `/historico/total${buildQuery(filtros)}`,
    )
    return Number(data.total)
  },
}
