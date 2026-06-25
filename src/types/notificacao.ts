export type TipoNotificacao = 'confirmacao_presenca'

export interface Notificacao {
  id: string
  tipo: TipoNotificacao
  agendamentoId?: string | null
  titulo: string
  mensagem: string
  lida: boolean
  createdAt: string
  agendamentoData?: string | null
  agendamentoHorario?: string | null
}
