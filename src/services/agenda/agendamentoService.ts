import { apiClient } from '@/services/api/client'
import type {
  AgendamentoEnriquecido,
  AgendamentoFormData,
  AgendamentoStatus,
} from '@/types/agendamento'

interface AgendamentoApiDto {
  id: string
  clienteId: string
  clienteNome: string
  barbeiroId: string
  barbeiroNome: string
  servicoId: string
  servicoNome: string
  data: string
  horario: string
  status: AgendamentoStatus
  duracaoMinutos: number
}

function mapAgendamento(dto: AgendamentoApiDto, empresaId: string): AgendamentoEnriquecido {
  return {
    id: dto.id,
    empresaId,
    clienteId: dto.clienteId,
    barbeiroId: dto.barbeiroId,
    servicoId: dto.servicoId,
    data: dto.data,
    horario: dto.horario,
    status: dto.status,
    clienteNome: dto.clienteNome,
    barbeiroNome: dto.barbeiroNome,
    servicoNome: dto.servicoNome,
    duracaoMinutos: dto.duracaoMinutos,
  }
}

function toRequestBody(data: AgendamentoFormData) {
  return {
    clienteId: data.clienteId,
    barbeiroId: data.barbeiroId,
    servicoId: data.servicoId,
    data: data.data,
    horario: data.horario,
    status: data.status,
  }
}

export const agendamentoService = {
  async list(empresaId: string, data?: string): Promise<AgendamentoEnriquecido[]> {
    const query = data ? `?data=${encodeURIComponent(data)}` : ''
    const items = await apiClient<AgendamentoApiDto[]>(`/agendamentos${query}`)
    return items.map((item) => mapAgendamento(item, empresaId))
  },

  async create(
    empresaId: string,
    data: AgendamentoFormData,
  ): Promise<AgendamentoEnriquecido> {
    const created = await apiClient<AgendamentoApiDto>('/agendamentos', {
      method: 'POST',
      body: JSON.stringify(toRequestBody(data)),
    })
    return mapAgendamento(created, empresaId)
  },

  async update(
    empresaId: string,
    id: string,
    data: AgendamentoFormData,
  ): Promise<AgendamentoEnriquecido> {
    const updated = await apiClient<AgendamentoApiDto>(`/agendamentos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(toRequestBody(data)),
    })
    return mapAgendamento(updated, empresaId)
  },

  async cancel(empresaId: string, id: string): Promise<AgendamentoEnriquecido> {
    const canceled = await apiClient<AgendamentoApiDto>(
      `/agendamentos/${id}/cancelar`,
      { method: 'PATCH' },
    )
    return mapAgendamento(canceled, empresaId)
  },
}
