import { apiClient } from '@/services/api/client'
import type { DiaSemana } from '@/constants/diasSemana'
import type { TipoBloqueioHorario } from '@/constants/tipoBloqueio'
import type {
  BloqueioHorario,
  BloqueioHorarioFormData,
  BloqueioHorarioFiltros,
} from '@/types/bloqueioHorario'

interface BloqueioHorarioApiDto {
  id: string
  barbeiroId: string
  barbeiroNome: string
  tipo: TipoBloqueioHorario
  dia?: DiaSemana | null
  data?: string | null
  horarioInicio: string
  horarioFim: string
  motivo: string
}

function mapBloqueio(dto: BloqueioHorarioApiDto): BloqueioHorario {
  return {
    id: dto.id,
    barbeiroId: dto.barbeiroId,
    barbeiroNome: dto.barbeiroNome,
    tipo: dto.tipo,
    dia: dto.dia ?? undefined,
    data: dto.data ?? undefined,
    horarioInicio: dto.horarioInicio,
    horarioFim: dto.horarioFim,
    motivo: dto.motivo,
  }
}

function toRequestBody(data: BloqueioHorarioFormData) {
  return {
    barbeiroId: data.barbeiroId,
    tipo: data.tipo,
    dia: data.tipo === 'fixo' ? data.dia : null,
    data: data.tipo === 'pontual' ? data.data : null,
    horarioInicio: data.horarioInicio,
    horarioFim: data.horarioFim,
    motivo: data.motivo,
  }
}

function buildQuery(filtros?: BloqueioHorarioFiltros, data?: string) {
  const params = new URLSearchParams()
  if (filtros?.barbeiroId) params.set('barbeiroId', filtros.barbeiroId)
  if (filtros?.tipo) params.set('tipo', filtros.tipo)
  if (data) params.set('data', data)
  const query = params.toString()
  return query ? `?${query}` : ''
}

export const bloqueioHorarioService = {
  async list(filtros?: BloqueioHorarioFiltros): Promise<BloqueioHorario[]> {
    const data = await apiClient<BloqueioHorarioApiDto[]>(
      `/bloqueios-horario${buildQuery(filtros)}`,
    )
    return data.map(mapBloqueio)
  },

  async listByDate(data: string): Promise<BloqueioHorario[]> {
    const items = await apiClient<BloqueioHorarioApiDto[]>(
      `/bloqueios-horario?data=${encodeURIComponent(data)}`,
    )
    return items.map(mapBloqueio)
  },

  async create(data: BloqueioHorarioFormData): Promise<BloqueioHorario> {
    const created = await apiClient<BloqueioHorarioApiDto>('/bloqueios-horario', {
      method: 'POST',
      body: JSON.stringify(toRequestBody(data)),
    })
    return mapBloqueio(created)
  },

  async update(
    id: string,
    data: BloqueioHorarioFormData,
  ): Promise<BloqueioHorario> {
    const updated = await apiClient<BloqueioHorarioApiDto>(
      `/bloqueios-horario/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(toRequestBody(data)),
      },
    )
    return mapBloqueio(updated)
  },

  async delete(id: string): Promise<void> {
    await apiClient<void>(`/bloqueios-horario/${id}`, { method: 'DELETE' })
  },
}
