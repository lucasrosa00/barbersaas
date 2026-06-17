import { apiClient } from '@/services/api/client'
import { mapPagedResult } from '@/services/api/paged'
import type { PagedResult } from '@/types/pagination'
import type { Cliente, ClienteFormData } from '@/types/cliente'
import { buildPaginationQuery } from '@/utils/pagination'

interface ClienteApiDto {
  id: string
  nome: string
  telefone: string
  observacoes: string
}

function mapCliente(dto: ClienteApiDto, empresaId: string): Cliente {
  return {
    id: dto.id,
    empresaId,
    nome: dto.nome,
    telefone: dto.telefone,
    observacoes: dto.observacoes ?? '',
  }
}

export const clienteService = {
  async listAll(empresaId: string, search?: string): Promise<Cliente[]> {
    const query = buildPaginationQuery({ all: true }, { search })
    const data = await apiClient<ClienteApiDto[]>(`/clientes${query}`)
    return data.map((item) => mapCliente(item, empresaId))
  },

  async listPaged(
    empresaId: string,
    page: number,
    pageSize: number,
    search?: string,
  ): Promise<PagedResult<Cliente>> {
    const query = buildPaginationQuery({ page, pageSize }, { search })
    const data = await apiClient<PagedResult<ClienteApiDto>>(`/clientes${query}`)
    return {
      ...mapPagedResult(data),
      items: data.items.map((item) => mapCliente(item, empresaId)),
    }
  },

  async create(empresaId: string, data: ClienteFormData): Promise<Cliente> {
    const created = await apiClient<ClienteApiDto>('/clientes', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return mapCliente(created, empresaId)
  },

  async update(
    empresaId: string,
    id: string,
    data: ClienteFormData,
  ): Promise<Cliente> {
    const updated = await apiClient<ClienteApiDto>(`/clientes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    return mapCliente(updated, empresaId)
  },

  async delete(id: string): Promise<void> {
    await apiClient<void>(`/clientes/${id}`, { method: 'DELETE' })
  },
}
