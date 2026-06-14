import { Pencil, Trash2 } from 'lucide-react'
import { MobileCardActions } from '@/components/ui/MobileCardActions'
import type { Cliente } from '@/types/cliente'

interface ClientesTableProps {
  clientes: Cliente[]
  onEdit: (cliente: Cliente) => void
  onDelete: (cliente: Cliente) => void
}

function ActionButtons({
  cliente,
  onEdit,
  onDelete,
}: {
  cliente: Cliente
  onEdit: (cliente: Cliente) => void
  onDelete: (cliente: Cliente) => void
}) {
  return (
    <>
      <button
        type="button"
        onClick={() => onEdit(cliente)}
        className="rounded-lg p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
        aria-label={`Editar ${cliente.nome}`}
      >
        <Pencil className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => onDelete(cliente)}
        className="rounded-lg p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
        aria-label={`Excluir ${cliente.nome}`}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </>
  )
}

export function ClientesTable({
  clientes,
  onEdit,
  onDelete,
}: ClientesTableProps) {
  if (clientes.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50 px-6 py-16 text-center">
        <p className="text-sm text-neutral-500">Nenhum cliente encontrado.</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-3 md:hidden">
        {clientes.map((cliente) => (
          <article
            key={cliente.id}
            className="rounded-xl border border-neutral-200 bg-white p-4"
          >
            <p className="font-medium text-neutral-900">{cliente.nome}</p>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-neutral-500">Telefone</dt>
                <dd className="text-neutral-600">{cliente.telefone}</dd>
              </div>
              {cliente.observacoes && (
                <div>
                  <dt className="text-neutral-500">Observações</dt>
                  <dd className="mt-1 text-neutral-500">{cliente.observacoes}</dd>
                </div>
              )}
            </dl>
            <MobileCardActions>
              <ActionButtons
                cliente={cliente}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </MobileCardActions>
          </article>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-xl border border-neutral-200 md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-4 py-3 font-medium text-neutral-500">Nome</th>
                <th className="px-4 py-3 font-medium text-neutral-500">Telefone</th>
                <th className="px-4 py-3 font-medium text-neutral-500">
                  Observações
                </th>
                <th className="px-4 py-3 text-right font-medium text-neutral-500">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 bg-neutral-50">
              {clientes.map((cliente) => (
                <tr
                  key={cliente.id}
                  className="transition-colors hover:bg-neutral-100"
                >
                  <td className="px-4 py-3 font-medium text-neutral-900">
                    {cliente.nome}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{cliente.telefone}</td>
                  <td className="max-w-xs truncate px-4 py-3 text-neutral-500">
                    {cliente.observacoes || '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <ActionButtons
                        cliente={cliente}
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
