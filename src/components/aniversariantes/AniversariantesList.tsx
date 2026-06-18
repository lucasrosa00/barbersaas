import { MessageCircle } from 'lucide-react'
import type { Aniversariante } from '@/types/cliente'
import { Button } from '@/components/ui/Button'
import { formatDateBR } from '@/utils/formatDate'
import { buildAniversarioWhatsAppUrl } from '@/utils/whatsapp'

const MESES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]

interface AniversariantesListProps {
  aniversariantes: Aniversariante[]
  mes: number
}

function formatDiaSemana(dataNascimento: string): string {
  const [year, month, day] = dataNascimento.split('-').map(Number)
  if (!year || !month || !day) return ''

  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString('pt-BR', { weekday: 'long' })
}

export function AniversariantesList({
  aniversariantes,
  mes,
}: AniversariantesListProps) {
  if (aniversariantes.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50 px-6 py-16 text-center">
        <p className="text-sm text-neutral-500">
          Nenhum aniversariante em {MESES[mes - 1]?.toLowerCase() ?? 'este mês'}.
        </p>
        <p className="mt-1 text-xs text-neutral-400">
          Cadastre a data de nascimento dos clientes para aparecerem aqui.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {aniversariantes.map((item) => {
        const whatsappUrl = buildAniversarioWhatsAppUrl(item.telefone, item.nome)
        const diaSemana = formatDiaSemana(item.dataNascimento)

        return (
          <article
            key={item.id}
            className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-4 sm:flex-row sm:items-center"
          >
            <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-full bg-neutral-100 text-neutral-900">
              <span className="text-lg font-bold leading-none">
                {item.dataNascimento.split('-')[2]}
              </span>
              <span className="text-[10px] uppercase text-neutral-500">
                {MESES[mes - 1]?.slice(0, 3)}
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <p className="font-semibold text-neutral-900">{item.nome}</p>
              <p className="text-sm text-neutral-500">{item.telefone}</p>
              <p className="mt-1 text-sm capitalize text-neutral-600">
                {formatDateBR(item.dataNascimento)}
                {diaSemana ? ` · ${diaSemana}` : ''}
              </p>
            </div>

            {whatsappUrl ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 sm:w-auto"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            ) : (
              <Button
                type="button"
                variant="secondary"
                className="w-full shrink-0 sm:w-auto"
                disabled
                title="Telefone inválido para WhatsApp"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </Button>
            )}
          </article>
        )
      })}
    </div>
  )
}
