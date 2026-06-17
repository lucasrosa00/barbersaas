import { apiClient } from '@/services/api/client'
import { mapPagedResult } from '@/services/api/paged'
import type { PagedResult } from '@/types/pagination'
import type { Servico, ServicoFormData } from '@/types/servico'
import { buildPaginationQuery } from '@/utils/pagination'

interface ServicoApiDto {
  id: string
  nome: string
  valor: number
  duracaoMinutos: number
  barbeirosDisponiveis: string[]
}

function mapServico(dto: ServicoApiDto, empresaId: string): Servico {
  return {
    id: dto.id,
    empresaId,
    nome: dto.nome,
    valor: Number(dto.valor),
    duracaoMinutos: dto.duracaoMinutos,
    barbeirosDisponiveis: dto.barbeirosDisponiveis,
  }
}

export const servicoService = {
  async listAll(empresaId: string, search?: string): Promise<Servico[]> {
    const query = buildPaginationQuery({ all: true }, { search })
    const data = await apiClient<ServicoApiDto[]>(`/servicos${query}`)
    return data.map((item) => mapServico(item, empresaId))
  },

  async listPaged(
    empresaId: string,
    page: number,
    pageSize: number,
    search?: string,
  ): Promise<PagedResult<Servico>> {
    const query = buildPaginationQuery({ page, pageSize }, { search })
    const data = await apiClient<PagedResult<ServicoApiDto>>(`/servicos${query}`)
    return {
      ...mapPagedResult(data),
      items: data.items.map((item) => mapServico(item, empresaId)),
    }
  },

  async create(empresaId: string, data: ServicoFormData): Promise<Servico> {
    const created = await apiClient<ServicoApiDto>('/servicos', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return mapServico(created, empresaId)
  },

  async update(
    empresaId: string,
    id: string,
    data: ServicoFormData,
  ): Promise<Servico> {
    const updated = await apiClient<ServicoApiDto>(`/servicos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    return mapServico(updated, empresaId)
  },

  async delete(id: string): Promise<void> {
    await apiClient<void>(`/servicos/${id}`, { method: 'DELETE' })
  },
}
