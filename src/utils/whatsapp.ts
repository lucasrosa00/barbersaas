import { renderConfirmacaoWhatsAppMessage, type ConfirmacaoWhatsAppVars } from '@/utils/whatsappConfirmacaoTemplate'

export function normalizePhoneForWhatsApp(telefone: string): string | null {
  const digits = telefone.replace(/\D/g, '')
  if (!digits) return null

  if (digits.startsWith('55') && digits.length >= 12 && digits.length <= 13) {
    return digits
  }

  if (digits.length === 10 || digits.length === 11) {
    return `55${digits}`
  }

  return null
}

export function buildWhatsAppUrl(telefone: string, message: string): string | null {
  const phone = normalizePhoneForWhatsApp(telefone)
  if (!phone) return null

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}

interface AgendamentoConfirmacaoParams extends ConfirmacaoWhatsAppVars {
  mensagemConfirmacaoWhatsApp?: string | null
}

export function buildAgendamentoConfirmacaoMessage({
  mensagemConfirmacaoWhatsApp,
  ...vars
}: AgendamentoConfirmacaoParams): string {
  return renderConfirmacaoWhatsAppMessage(mensagemConfirmacaoWhatsApp, vars)
}

export function buildAgendamentoConfirmacaoWhatsAppUrl(
  telefone: string,
  params: AgendamentoConfirmacaoParams,
): string | null {
  const message = buildAgendamentoConfirmacaoMessage(params)
  return buildWhatsAppUrl(telefone, message)
}

export function buildAniversarioWhatsAppMessage(nome: string): string {
  const primeiroNome = nome.trim().split(/\s+/)[0] || nome

  return [
    `Olá ${primeiroNome}, tudo bem?`,
    '',
    'Passando para desejar um feliz aniversário!',
    '',
    'Temos um desconto especial para você. Entre em contato para agendar!',
  ].join('\n')
}

export function buildAniversarioWhatsAppUrl(telefone: string, nome: string): string | null {
  return buildWhatsAppUrl(telefone, buildAniversarioWhatsAppMessage(nome))
}
