import { Link } from 'react-router-dom'
import { ArrowRight, CalendarPlus, ListOrdered, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function DashboardQuickActions() {
  const actions = [
    {
      label: 'Novo agendamento',
      path: '/agenda',
      icon: CalendarPlus,
    },
    {
      label: 'Adicionar à fila',
      path: '/lista-espera',
      icon: ListOrdered,
    },
    {
      label: 'Novo cliente',
      path: '/clientes',
      icon: UserPlus,
    },
  ]

  return (
    <article className="rounded-xl border border-neutral-200 bg-white p-5">
      <h3 className="mb-4 text-sm font-semibold text-neutral-900">Ações rápidas</h3>
      <div className="grid gap-3 sm:flex sm:flex-wrap">
        {actions.map(({ label, path, icon: Icon }) => (
          <Link key={path} to={path} className="block w-full sm:w-auto">
            <Button variant="secondary" className="w-full sm:w-auto">
              <Icon className="h-4 w-4" />
              {label}
            </Button>
          </Link>
        ))}
      </div>
    </article>
  )
}

interface DashboardAgendamentosHeaderProps {
  total?: number
}

export function DashboardAgendamentosHeader({ total }: DashboardAgendamentosHeaderProps) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h3 className="text-sm font-semibold text-neutral-900">
        Agenda de hoje{total !== undefined ? ` (${total})` : ''}
      </h3>
      <Link
        to="/agenda"
        className="flex items-center gap-1 text-xs text-neutral-900 hover:text-neutral-700"
      >
        Ver agenda completa
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  )
}
