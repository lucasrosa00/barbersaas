import type { Movimentacao } from '@/types/financeiro'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatDateBR } from '@/utils/timeSlots'

interface MovimentacoesTableProps {
  movimentacoes: Movimentacao[]
}

export function MovimentacoesTable({ movimentacoes }: MovimentacoesTableProps) {
  if (movimentacoes.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50 px-6 py-16 text-center">
        <p className="text-sm text-neutral-500">Nenhuma movimentação registrada.</p>
      </div>
    )
  }

  return (
    <article className="overflow-hidden rounded-xl border border-neutral-200">
      <div className="border-b border-neutral-200 bg-neutral-50 px-4 py-4 sm:px-5">
        <h3 className="text-sm font-semibold text-neutral-900">Movimentações</h3>
        <p className="text-xs text-neutral-500">
          Entradas e saídas financeiras da empresa
        </p>
      </div>

      <div className="space-y-3 p-4 md:hidden">
        {movimentacoes.map((mov) => (
          <div
            key={mov.id}
            className="rounded-lg border border-neutral-200 bg-white p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium text-neutral-900">{mov.descricao}</p>
                {mov.barbeiroNome && (
                  <p className="text-xs text-neutral-500">{mov.barbeiroNome}</p>
                )}
              </div>
              <span
                className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  mov.tipo === 'entrada'
                    ? 'bg-neutral-100 text-neutral-900'
                    : 'bg-neutral-100 text-neutral-600'
                }`}
              >
                {mov.tipo === 'entrada' ? 'Entrada' : 'Saída'}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-neutral-500">{formatDateBR(mov.data)}</span>
              <span
                className={`font-medium ${
                  mov.tipo === 'entrada' ? 'text-neutral-900' : 'text-neutral-600'
                }`}
              >
                {mov.tipo === 'entrada' ? '+' : '-'}
                {formatCurrency(mov.valor)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-200 bg-white">
              <th className="px-4 py-3 font-medium text-neutral-500">Data</th>
              <th className="px-4 py-3 font-medium text-neutral-500">Descrição</th>
              <th className="px-4 py-3 font-medium text-neutral-500">Tipo</th>
              <th className="px-4 py-3 text-right font-medium text-neutral-500">
                Valor
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 bg-neutral-50">
            {movimentacoes.map((mov) => (
              <tr
                key={mov.id}
                className="transition-colors hover:bg-neutral-100"
              >
                <td className="whitespace-nowrap px-4 py-3 text-neutral-600">
                  {formatDateBR(mov.data)}
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-neutral-900">{mov.descricao}</p>
                  {mov.barbeiroNome && (
                    <p className="text-xs text-neutral-500">{mov.barbeiroNome}</p>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      mov.tipo === 'entrada'
                        ? 'bg-neutral-100 text-neutral-900'
                        : 'bg-neutral-100 text-neutral-600'
                    }`}
                  >
                    {mov.tipo === 'entrada' ? 'Entrada' : 'Saída'}
                  </span>
                </td>
                <td
                  className={`px-4 py-3 text-right font-medium ${
                    mov.tipo === 'entrada' ? 'text-neutral-900' : 'text-neutral-600'
                  }`}
                >
                  {mov.tipo === 'entrada' ? '+' : '-'}
                  {formatCurrency(mov.valor)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  )
}
