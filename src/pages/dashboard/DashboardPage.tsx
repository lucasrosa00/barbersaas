import { useDashboard } from '@/hooks/useDashboard'
import { useAuth } from '@/hooks/useAuth'
import { DashboardKpiCards } from '@/components/dashboard/DashboardKpiCards'
import { AgendamentosHojeList } from '@/components/dashboard/AgendamentosHojeList'
import {
  DashboardQuickActions,
} from '@/components/dashboard/DashboardQuickActions'
import { FaturamentoChart } from '@/components/financeiro/FaturamentoChart'
import { formatDateBR, toISODate } from '@/utils/timeSlots'

export function DashboardPage() {
  const { user } = useAuth()
  const { data, isLoading } = useDashboard(user?.empresaId ?? '')

  if (!user) return null

  if (isLoading || !data) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-900 border-t-transparent" />
      </div>
    )
  }

  const hoje = formatDateBR(toISODate(new Date()))

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-neutral-500">
          Olá, {user.nome.split(' ')[0]} · {hoje}
        </p>
        <p className="text-lg font-semibold text-neutral-900">{user.empresa.nome}</p>
      </div>

      <DashboardKpiCards
        agendamentosHoje={data.agendamentosHoje.length}
        agendamentosPendentes={data.agendamentosPendentes}
        faturamentoDia={data.faturamentoDia}
        listaEspera={data.listaEspera}
        totalClientes={data.totalClientes}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <AgendamentosHojeList agendamentos={data.agendamentosHoje} />
        <FaturamentoChart
          title="Faturamento — últimos 7 dias"
          data={data.faturamentoDiario}
        />
      </div>

      <DashboardQuickActions />
    </div>
  )
}
