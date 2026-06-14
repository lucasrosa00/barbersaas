import {
  Calendar,
  ListOrdered,
  TrendingUp,
  Users,
} from 'lucide-react'
import { formatCurrency } from '@/utils/formatCurrency'

interface DashboardKpiCardsProps {
  agendamentosHoje: number
  agendamentosPendentes: number
  faturamentoDia: number
  listaEspera: number
  totalClientes: number
}

export function DashboardKpiCards({
  agendamentosHoje,
  agendamentosPendentes,
  faturamentoDia,
  listaEspera,
  totalClientes,
}: DashboardKpiCardsProps) {
  const cards = [
    {
      label: 'Agendamentos hoje',
      value: String(agendamentosHoje),
      sub: `${agendamentosPendentes} pendentes`,
      icon: Calendar,
      color: 'text-neutral-900',
      bg: 'bg-neutral-100',
    },
    {
      label: 'Faturamento do dia',
      value: formatCurrency(faturamentoDia),
      sub: 'Atendimentos finalizados',
      icon: TrendingUp,
      color: 'text-neutral-700',
      bg: 'bg-neutral-100',
    },
    {
      label: 'Lista de espera',
      value: String(listaEspera),
      sub: listaEspera === 1 ? 'cliente aguardando' : 'clientes aguardando',
      icon: ListOrdered,
      color: 'text-neutral-700',
      bg: 'bg-neutral-100',
    },
    {
      label: 'Total de clientes',
      value: String(totalClientes),
      sub: 'Cadastrados na empresa',
      icon: Users,
      color: 'text-neutral-700',
      bg: 'bg-neutral-100',
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ label, value, sub, icon: Icon, color, bg }) => (
        <article
          key={label}
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
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
          <p className="mt-1 text-xs text-neutral-500">{sub}</p>
        </article>
      ))}
    </div>
  )
}
