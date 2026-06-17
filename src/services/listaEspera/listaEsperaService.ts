import { apiClient } from '@/services/api/client'
import { mapPagedResult } from '@/services/api/paged'
import type { PagedResult } from '@/types/pagination'
import type { ListaEsperaFormData, ListaEsperaItem } from '@/types/listaEspera'
import { buildPaginationQuery } from '@/utils/pagination'

interface ListaEsperaApiDto {
  id: string
  posicao: number
  clienteId: string
  clienteNome: string
  servicoId: string
  servicoNome: string
  barbeiroId: string | null
  barbeiroNome: string
  dataSolicitada: string
}

function mapItem(dto: ListaEsperaApiDto, empresaId: string): ListaEsperaItem {
  return {
    id: dto.id,
    empresaId,
    posicao: dto.posicao,
    clienteId: dto.clienteId,
    clienteNome: dto.clienteNome,
    servicoId: dto.servicoId,
    servicoNome: dto.servicoNome,
    barbeiroId: dto.barbeiroId ?? '',
    barbeiroNome: dto.barbeiroNome,
    dataSolicitada: dto.dataSolicitada,
  }
}

function toRequestBody(data: ListaEsperaFormData) {
  return {
    clienteId: data.clienteId,
    servicoId: data.servicoId,
    barbeiroId: data.barbeiroId || null,
    dataSolicitada: data.dataSolicitada,
  }
}

export const listaEsperaService = {
  async listPaged(
    empresaId: string,
    page: number,
    pageSize: number,
  ): Promise<PagedResult<ListaEsperaItem>> {
    const query = buildPaginationQuery({ page, pageSize })
    const data = await apiClient<PagedResult<ListaEsperaApiDto>>(
      `/lista-espera${query}`,
    )
    return {
      ...mapPagedResult(data),
      items: data.items.map((item) => mapItem(item, empresaId)),
    }
  },

  async create(
    empresaId: string,
    data: ListaEsperaFormData,
  ): Promise<ListaEsperaItem> {
    const created = await apiClient<ListaEsperaApiDto>('/lista-espera', {
      method: 'POST',
      body: JSON.stringify(toRequestBody(data)),
    })
    return mapItem(created, empresaId)
  },

  async remove(id: string): Promise<void> {
    await apiClient<void>(`/lista-espera/${id}`, { method: 'DELETE' })
  },

  async moveUp(id: string): Promise<void> {
    await apiClient<void>(`/lista-espera/${id}/subir`, { method: 'PATCH' })
  },

  async moveDown(id: string): Promise<void> {
    await apiClient<void>(`/lista-espera/${id}/descer`, { method: 'PATCH' })
  },
}
