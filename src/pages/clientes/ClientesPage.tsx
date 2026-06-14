import { useState } from 'react'
import { Plus } from 'lucide-react'
import { ClienteFormModal } from '@/components/clientes/ClienteFormModal'
import { ClientesTable } from '@/components/clientes/ClientesTable'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { SearchInput } from '@/components/ui/SearchInput'
import { useAuth } from '@/hooks/useAuth'
import { useClientes } from '@/hooks/useClientes'
import type { Cliente, ClienteFormData } from '@/types/cliente'

export function ClientesPage() {
  const { user } = useAuth()
  const {
    clientes,
    total,
    search,
    setSearch,
    createCliente,
    updateCliente,
    deleteCliente,
  } = useClientes(user?.empresaId ?? '')

  const [formOpen, setFormOpen] = useState(false)
  const [editingCliente, setEditingCliente] = useState<Cliente | undefined>()
  const [deletingCliente, setDeletingCliente] = useState<Cliente | undefined>()

  function handleOpenCreate() {
    setEditingCliente(undefined)
    setFormOpen(true)
  }

  function handleOpenEdit(cliente: Cliente) {
    setEditingCliente(cliente)
    setFormOpen(true)
  }

  function handleCloseForm() {
    setFormOpen(false)
    setEditingCliente(undefined)
  }

  function handleSubmit(data: ClienteFormData) {
    if (editingCliente) {
      updateCliente(editingCliente.id, data)
    } else {
      createCliente(data)
    }
  }

  function handleConfirmDelete() {
    if (deletingCliente) {
      deleteCliente(deletingCliente.id)
      setDeletingCliente(undefined)
    }
  }

  if (!user) return null

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-neutral-500">
            {total} {total === 1 ? 'cliente cadastrado' : 'clientes cadastrados'}
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-3 sm:min-w-0 sm:flex-1 sm:grid-cols-[minmax(0,1fr)_minmax(10rem,14rem)] sm:items-center">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Buscar por nome..."
          />
          <Button onClick={handleOpenCreate} className="w-full">
            <Plus className="h-4 w-4" />
            Novo Cliente
          </Button>
        </div>
      </div>

      <ClientesTable
        clientes={clientes}
        onEdit={handleOpenEdit}
        onDelete={setDeletingCliente}
      />

      <ClienteFormModal
        open={formOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        cliente={editingCliente}
      />

      <ConfirmDialog
        open={!!deletingCliente}
        onClose={() => setDeletingCliente(undefined)}
        onConfirm={handleConfirmDelete}
        title="Excluir cliente"
        description={`Tem certeza que deseja excluir "${deletingCliente?.nome}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
      />
    </div>
  )
}
