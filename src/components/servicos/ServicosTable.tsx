import { Pencil, Trash2 } from 'lucide-react'
import { MobileCardActions } from '@/components/ui/MobileCardActions'
import type { Servico } from '@/types/servico'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatDuracao } from '@/utils/formatDuracao'

interface ServicosTableProps {
  servicos: Servico[]
  onEdit: (servico: Servico) => void
  onDelete: (servico: Servico) => void
}

function ActionButtons({
  servico,
  onEdit,
  onDelete,
}: {
  servico: Servico
  onEdit: (servico: Servico) => void
  onDelete: (servico: Servico) => void
}) {
  return (
    <>
      <button
        type="button"
        onClick={() => onEdit(servico)}
        className="rounded-lg p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
        aria-label={`Editar ${servico.nome}`}
      >
        <Pencil className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => onDelete(servico)}
        className="rounded-lg p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
        aria-label={`Excluir ${servico.nome}`}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </>
  )
}

export function ServicosTable({
  servicos,
  onEdit,
  onDelete,
}: ServicosTableProps) {
  if (servicos.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50 px-6 py-16 text-center">
        <p className="text-sm text-neutral-500">Nenhum serviço encontrado.</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-3 md:hidden">
        {servicos.map((servico) => (
          <article
            key={servico.id}
            className="rounded-xl border border-neutral-200 bg-white p-4"
          >
            <p className="font-medium text-neutral-900">{servico.nome}</p>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-neutral-500">Valor</dt>
                <dd className="font-medium text-neutral-900">
                  {formatCurrency(servico.valor)}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-neutral-500">Duração</dt>
                <dd className="text-neutral-600">
                  {formatDuracao(servico.duracaoMinutos)}
                </dd>
              </div>
            </dl>
            <MobileCardActions>
              <ActionButtons
                servico={servico}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </MobileCardActions>
          </article>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-xl border border-neutral-200 md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-4 py-3 font-medium text-neutral-500">Nome</th>
                <th className="px-4 py-3 font-medium text-neutral-500">Valor</th>
                <th className="px-4 py-3 font-medium text-neutral-500">Duração</th>
                <th className="px-4 py-3 text-right font-medium text-neutral-500">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 bg-neutral-50">
              {servicos.map((servico) => (
                <tr
                  key={servico.id}
                  className="transition-colors hover:bg-neutral-100"
                >
                  <td className="px-4 py-3 font-medium text-neutral-900">
                    {servico.nome}
                  </td>
                  <td className="px-4 py-3 text-neutral-900">
                    {formatCurrency(servico.valor)}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    {formatDuracao(servico.duracaoMinutos)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <ActionButtons
                        servico={servico}
                        onEdit={onEdit}
                        onDelete={onDelete}
                      />
                    </div>
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
