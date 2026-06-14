import {
  getStatusLabel,
  getStatusStyles,
} from '@/constants/agendamentoStatus'
import type { HistoricoAtendimento } from '@/types/historico'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatDateBR } from '@/utils/timeSlots'

interface HistoricoTableProps {
  registros: HistoricoAtendimento[]
}

export function HistoricoTable({ registros }: HistoricoTableProps) {
  if (registros.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50 px-6 py-16 text-center">
        <p className="text-sm text-neutral-500">
          Nenhum registro encontrado para os filtros selecionados.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-3 md:hidden">
        {registros.map((registro) => (
          <article
            key={registro.id}
            className="rounded-xl border border-neutral-200 bg-white p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium text-neutral-900">{registro.clienteNome}</p>
                <p className="text-sm text-neutral-500">{registro.servicoNome}</p>
              </div>
              <span
                className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium ${getStatusStyles(registro.status)}`}
              >
                {getStatusLabel(registro.status)}
              </span>
            </div>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-neutral-500">Data</dt>
                <dd className="text-neutral-600">{formatDateBR(registro.data)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-neutral-500">Barbeiro</dt>
                <dd className="text-neutral-600">{registro.barbeiroNome}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-neutral-500">Valor</dt>
                <dd className="font-medium text-neutral-900">
                  {formatCurrency(registro.valor)}
                </dd>
              </div>
            </dl>
          </article>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-xl border border-neutral-200 md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-4 py-3 font-medium text-neutral-500">Data</th>
                <th className="px-4 py-3 font-medium text-neutral-500">Cliente</th>
                <th className="px-4 py-3 font-medium text-neutral-500">Serviço</th>
                <th className="px-4 py-3 font-medium text-neutral-500">Barbeiro</th>
                <th className="px-4 py-3 font-medium text-neutral-500">Valor</th>
                <th className="px-4 py-3 font-medium text-neutral-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 bg-neutral-50">
              {registros.map((registro) => (
                <tr
                  key={registro.id}
                  className="transition-colors hover:bg-neutral-100"
                >
                  <td className="whitespace-nowrap px-4 py-3 text-neutral-600">
                    {formatDateBR(registro.data)}
                  </td>
                  <td className="px-4 py-3 font-medium text-neutral-900">
                    {registro.clienteNome}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    {registro.servicoNome}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    {registro.barbeiroNome}
                  </td>
                  <td className="px-4 py-3 text-neutral-900">
                    {formatCurrency(registro.valor)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${getStatusStyles(registro.status)}`}
                    >
                      {getStatusLabel(registro.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
