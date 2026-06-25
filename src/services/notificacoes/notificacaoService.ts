import { apiClient } from '@/services/api/client'
import type { Notificacao } from '@/types/notificacao'

export const notificacaoService = {
  async list(limit = 20): Promise<Notificacao[]> {
    return apiClient<Notificacao[]>(`/notificacoes?limit=${limit}`)
  },

  async getNaoLidasCount(): Promise<number> {
    const data = await apiClient<{ total: number }>('/notificacoes/nao-lidas/count')
    return data.total
  },

  async marcarComoLida(id: string): Promise<void> {
    await apiClient<void>(`/notificacoes/${id}/lida`, { method: 'PATCH' })
  },

  async marcarTodasComoLidas(): Promise<void> {
    await apiClient<void>('/notificacoes/marcar-todas-lidas', { method: 'PATCH' })
  },
}
