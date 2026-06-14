import { Link } from 'react-router-dom'
import {
  getStatusLabel,
  getStatusStyles,
} from '@/constants/agendamentoStatus'
import type { AgendamentoEnriquecido } from '@/types/agendamento'
import { formatHorarioIntervalo } from '@/utils/agenda'
import { DashboardAgendamentosHeader } from '@/components/dashboard/DashboardQuickActions'

interface AgendamentosHojeListProps {
  agendamentos: AgendamentoEnriquecido[]
}

export function AgendamentosHojeList({
  agendamentos,
}: AgendamentosHojeListProps) {
  return (
    <article className="rounded-xl border border-neutral-200 bg-white p-5">
      <DashboardAgendamentosHeader total={agendamentos.length} />

      {agendamentos.length === 0 ? (
        <div className="rounded-lg border border-dashed border-neutral-200 py-10 text-center">
          <p className="text-sm text-neutral-500">
            Nenhum agendamento para hoje.
          </p>
          <Link
            to="/agenda"
            className="mt-2 inline-block text-sm text-neutral-900 hover:text-neutral-700"
          >
            Criar agendamento
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {agendamentos.map((ag) => (
            <div
              key={ag.id}
              className="flex flex-col gap-2 rounded-lg border border-neutral-200 bg-neutral-50 p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="font-medium text-neutral-900">{ag.clienteNome}</p>
                <p className="text-sm text-neutral-500">
                  {ag.servicoNome} · {ag.barbeiroNome}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-neutral-600">
                  {formatHorarioIntervalo(ag.horario, ag.duracaoMinutos)}
                </span>
                <span
                  className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${getStatusStyles(ag.status)}`}
                >
                  {getStatusLabel(ag.status)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </article>
  )
}
