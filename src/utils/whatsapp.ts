import { formatDateBR } from '@/utils/formatDate'
import { formatHorarioIntervalo } from '@/utils/agenda'
import { buildConfirmacaoPublicUrl } from '@/config/app'

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

interface AgendamentoConfirmacaoParams {
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

export function buildAgendamentoConfirmacaoMessage({
  clienteNome,
  data,
  horario,
  duracaoMinutos,
  servicoNome,
  barbeiroNome,
  empresaNome,
  tokenConfirmacao,
  enviarLinkConfirmacao = false,
}: AgendamentoConfirmacaoParams): string {
  const primeiroNome = clienteNome.trim().split(/\s+/)[0] || clienteNome
  const intervalo = formatHorarioIntervalo(horario, duracaoMinutos)
  const dataFormatada = formatDateBR(data)

  const lines = [
    `Olá ${primeiroNome}, tudo bem?`,
    '',
    'Gostaríamos de confirmar seu agendamento:',
    '',
    `Data: ${dataFormatada}`,
    `Horário: ${intervalo}`,
    `Serviço: ${servicoNome}`,
    `Profissional: ${barbeiroNome}`,
  ]

  if (empresaNome?.trim()) {
    lines.push('', empresaNome.trim())
  }

  if (enviarLinkConfirmacao && tokenConfirmacao) {
    lines.push(
      '',
      'Para confirmar sua presença, acesse o link abaixo:',
      buildConfirmacaoPublicUrl(tokenConfirmacao),
    )
  }

  lines.push('', 'Qualquer dúvida, estamos à disposição!')

  return lines.join('\n')
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
