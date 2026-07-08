import { formatDateBRWithWeekday } from '@/utils/formatDate'
import { formatHorarioIntervalo } from '@/utils/agenda'
import { buildConfirmacaoPublicUrl } from '@/config/app'

export const WHATSAPP_CONFIRMACAO_PLACEHOLDERS = [
  { token: '{cliente}', description: 'Primeiro nome do cliente' },
  { token: '{data}', description: 'Data do agendamento (ex.: 07/07/2026 (Terça-feira))' },
  { token: '{horario}', description: 'Horário com duração (ex.: 09:00 — 09:30)' },
  { token: '{servico}', description: 'Nome do serviço' },
  { token: '{profissional}', description: 'Nome do profissional' },
  { token: '{empresa}', description: 'Nome da empresa' },
  { token: '{link}', description: 'Link de confirmação gerado pelo sistema' },
] as const

export interface ConfirmacaoWhatsAppVars {
  clienteNome: string
  data: string
  horario: string
  duracaoMinutos: number
  servicoNome: string
  barbeiroNome: string
  empresaNome?: string
  tokenConfirmacao?: string
  enviarLinkConfirmacao?: boolean
}

function getPrimeiroNome(clienteNome: string): string {
  return clienteNome.trim().split(/\s+/)[0] || clienteNome
}

function resolveLink(vars: ConfirmacaoWhatsAppVars): string {
  if (!vars.enviarLinkConfirmacao || !vars.tokenConfirmacao) return ''
  return buildConfirmacaoPublicUrl(vars.tokenConfirmacao)
}

export function renderConfirmacaoWhatsAppMessage(
  template: string | null | undefined,
  vars: ConfirmacaoWhatsAppVars,
): string {
  const trimmed = template?.trim() || WHATSAPP_CONFIRMACAO_TEMPLATE_PADRAO

  const replacements: Record<string, string> = {
    '{cliente}': getPrimeiroNome(vars.clienteNome),
    '{data}': formatDateBRWithWeekday(vars.data),
    '{horario}': formatHorarioIntervalo(vars.horario, vars.duracaoMinutos),
    '{servico}': vars.servicoNome,
    '{profissional}': vars.barbeiroNome,
    '{empresa}': vars.empresaNome?.trim() ?? '',
    '{link}': resolveLink(vars),
  }

  let message = trimmed
  for (const [token, value] of Object.entries(replacements)) {
    message = message.split(token).join(value)
  }

  return message
}

export const WHATSAPP_CONFIRMACAO_TEMPLATE_PADRAO = `Olá {cliente}, tudo bem?

Gostaríamos de confirmar seu agendamento:

Data: {data}
Horário: {horario}
Serviço: {servico}
Profissional: {profissional}

{empresa}

Para confirmar sua presença, acesse o link abaixo:
{link}

Qualquer dúvida, estamos à disposição!`

/** @deprecated Use WHATSAPP_CONFIRMACAO_TEMPLATE_PADRAO */
export const WHATSAPP_CONFIRMACAO_TEMPLATE_EXAMPLE = WHATSAPP_CONFIRMACAO_TEMPLATE_PADRAO

export function getConfirmacaoWhatsAppTemplateForEdit(
  savedTemplate?: string | null,
): string {
  const trimmed = savedTemplate?.trim()
  return trimmed || WHATSAPP_CONFIRMACAO_TEMPLATE_PADRAO
}

export function normalizeMensagemConfirmacaoForSave(
  template: string | null | undefined,
): string | null {
  const trimmed = template?.trim()
  if (!trimmed || trimmed === WHATSAPP_CONFIRMACAO_TEMPLATE_PADRAO) {
    return null
  }
  return trimmed
}
