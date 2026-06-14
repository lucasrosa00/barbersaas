import { apiClient } from '@/services/api/client'
import type { Barbeiro, BarbeiroFormData } from '@/types/barbeiro'

interface BarbeiroApiDto {
  id: string
  nome: string
  telefone: string
  especialidades: string[]
  diasTrabalho: string[]
  horarioInicio: string
  horarioFim: string
}

function mapBarbeiro(dto: BarbeiroApiDto, empresaId: string): Barbeiro {
  return {
    id: dto.id,
    empresaId,
    nome: dto.nome,
    telefone: dto.telefone,
    especialidades: dto.especialidades,
    diasTrabalho: dto.diasTrabalho as Barbeiro['diasTrabalho'],
    horarioInicio: dto.horarioInicio,
    horarioFim: dto.horarioFim,
  }
}

export const barbeiroService = {
  async list(empresaId: string): Promise<Barbeiro[]> {
    const data = await apiClient<BarbeiroApiDto[]>('/barbeiros')
    return data.map((item) => mapBarbeiro(item, empresaId))
  },

  async create(empresaId: string, data: BarbeiroFormData): Promise<Barbeiro> {
    const created = await apiClient<BarbeiroApiDto>('/barbeiros', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return mapBarbeiro(created, empresaId)
  },

  async update(
    empresaId: string,
    id: string,
    data: BarbeiroFormData,
  ): Promise<Barbeiro> {
    const updated = await apiClient<BarbeiroApiDto>(`/barbeiros/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    return mapBarbeiro(updated, empresaId)
  },

  async delete(id: string): Promise<void> {
    await apiClient<void>(`/barbeiros/${id}`, { method: 'DELETE' })
  },
}
