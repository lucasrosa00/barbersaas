import { apiClient } from '@/services/api/client'
import { mapPagedResult } from '@/services/api/paged'
import type { PagedResult } from '@/types/pagination'
import type { Aniversariante, Cliente, ClienteFormData } from '@/types/cliente'
import { buildPaginationQuery } from '@/utils/pagination'

interface ClienteApiDto {
  id: string
  nome: string
  telefone: string
  dataNascimento?: string | null
  observacoes: string
}

interface AniversarianteApiDto {
  id: string
  nome: string
  telefone: string
  dataNascimento: string
}

function isValidBirthDate(value?: string | null): value is string {
  if (!value) return false
  if (value.startsWith('0001-')) return false
  return true
}

function mapCliente(dto: ClienteApiDto, empresaId: string): Cliente {
  return {
    id: dto.id,
    empresaId,
    nome: dto.nome,
    telefone: dto.telefone,
    dataNascimento: isValidBirthDate(dto.dataNascimento)
      ? dto.dataNascimento
      : undefined,
    observacoes: dto.observacoes ?? '',
  }
}

function mapAniversariante(dto: AniversarianteApiDto, empresaId: string): Aniversariante {
  return {
    id: dto.id,
    empresaId,
    nome: dto.nome,
    telefone: dto.telefone,
    dataNascimento: dto.dataNascimento,
  }
}

function toRequestBody(data: ClienteFormData) {
  return {
    nome: data.nome,
    telefone: data.telefone,
    dataNascimento: data.dataNascimento || null,
    observacoes: data.observacoes,
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

  async listAniversariantes(empresaId: string, mes: number): Promise<Aniversariante[]> {
    const data = await apiClient<AniversarianteApiDto[]>(
      `/clientes/aniversariantes?mes=${mes}`,
    )
    return data.map((item) => mapAniversariante(item, empresaId))
  },

  async create(empresaId: string, data: ClienteFormData): Promise<Cliente> {
    const created = await apiClient<ClienteApiDto>('/clientes', {
      method: 'POST',
      body: JSON.stringify(toRequestBody(data)),
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
      body: JSON.stringify(toRequestBody(data)),
    })
    return mapCliente(updated, empresaId)
  },

  async delete(id: string): Promise<void> {
    await apiClient<void>(`/clientes/${id}`, { method: 'DELETE' })
  },
}
