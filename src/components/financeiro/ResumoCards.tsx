import { Calendar, CalendarDays, TrendingUp } from 'lucide-react'
import type { ResumoFinanceiro } from '@/types/financeiro'
import { formatCurrency } from '@/utils/formatCurrency'

interface ResumoCardsProps {
  resumo: ResumoFinanceiro
}

const cards = [
  {
    key: 'faturamentoDia' as const,
    label: 'Faturamento do dia',
    icon: Calendar,
    color: 'text-neutral-900',
    bg: 'bg-neutral-100',
  },
  {
    key: 'faturamentoSemana' as const,
    label: 'Faturamento da semana',
    icon: CalendarDays,
    color: 'text-neutral-700',
    bg: 'bg-neutral-100',
  },
  {
    key: 'faturamentoMes' as const,
    label: 'Faturamento do mês',
    icon: TrendingUp,
    color: 'text-neutral-700',
    bg: 'bg-neutral-100',
  },
]

export function ResumoCards({ resumo }: ResumoCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {cards.map(({ key, label, icon: Icon, color, bg }) => (
        <article
          key={key}
          className="rounded-xl border border-neutral-200 bg-white p-5"
        >
          <div className="mb-3 flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-lg ${bg}`}
            >
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <p className="text-sm text-neutral-500">{label}</p>
          </div>
          <p className={`text-2xl font-bold ${color}`}>
            {formatCurrency(resumo[key])}
          </p>
        </article>
      ))}
    </div>
  )
}
