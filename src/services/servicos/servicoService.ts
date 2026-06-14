import { apiClient } from '@/services/api/client'
import type { Servico, ServicoFormData } from '@/types/servico'

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
  async list(empresaId: string): Promise<Servico[]> {
    const data = await apiClient<ServicoApiDto[]>('/servicos')
    return data.map((item) => mapServico(item, empresaId))
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
