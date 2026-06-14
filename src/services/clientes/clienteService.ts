import { apiClient } from '@/services/api/client'
import type { Cliente, ClienteFormData } from '@/types/cliente'

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
  async list(empresaId: string, search?: string): Promise<Cliente[]> {
    const query = search?.trim() ? `?search=${encodeURIComponent(search.trim())}` : ''
    const data = await apiClient<ClienteApiDto[]>(`/clientes${query}`)
    return data.map((item) => mapCliente(item, empresaId))
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
