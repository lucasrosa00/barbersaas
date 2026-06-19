import { apiClient } from '@/services/api/client'
import type { AgendamentoStatus } from '@/types/agendamento'

export interface ConfirmacaoAgendamento {
  empresaNome: string
  clientePrimeiroNome: string
  data: string
  horario: string
  duracaoMinutos: number
  servicoNome: string
  barbeiroNome: string
  status: AgendamentoStatus
  podeConfirmar: boolean
  mensagem?: string | null
}

export interface ConfirmacaoResult {
  status: AgendamentoStatus
  mensagem: string
  jaConfirmado: boolean
}

export const confirmacaoService = {
  async getByToken(token: string): Promise<ConfirmacaoAgendamento> {
    return apiClient<ConfirmacaoAgendamento>(`/confirmacao/${encodeURIComponent(token)}`, {
      token: null,
    })
  },

  async confirmar(token: string): Promise<ConfirmacaoResult> {
    return apiClient<ConfirmacaoResult>(
      `/confirmacao/${encodeURIComponent(token)}/confirmar`,
      {
        method: 'POST',
        token: null,
      },
    )
  },
}
