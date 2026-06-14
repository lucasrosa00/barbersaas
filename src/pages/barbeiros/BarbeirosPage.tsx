import { useState } from 'react'
import { Plus } from 'lucide-react'
import { BarbeiroFormModal } from '@/components/barbeiros/BarbeiroFormModal'
import { BarbeirosGrid } from '@/components/barbeiros/BarbeirosGrid'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { SearchInput } from '@/components/ui/SearchInput'
import { useAuth } from '@/hooks/useAuth'
import { useBarbeiros } from '@/hooks/useBarbeiros'
import type { Barbeiro, BarbeiroFormData } from '@/types/barbeiro'

export function BarbeirosPage() {
  const { user } = useAuth()
  const {
    barbeiros,
    total,
    search,
    setSearch,
    createBarbeiro,
    updateBarbeiro,
    deleteBarbeiro,
  } = useBarbeiros(user?.empresaId ?? '')

  const [formOpen, setFormOpen] = useState(false)
  const [editingBarbeiro, setEditingBarbeiro] = useState<Barbeiro | undefined>()
  const [deletingBarbeiro, setDeletingBarbeiro] = useState<Barbeiro | undefined>()

  function handleOpenCreate() {
    setEditingBarbeiro(undefined)
    setFormOpen(true)
  }

  function handleOpenEdit(barbeiro: Barbeiro) {
    setEditingBarbeiro(barbeiro)
    setFormOpen(true)
  }

  function handleCloseForm() {
    setFormOpen(false)
    setEditingBarbeiro(undefined)
  }

  function handleSubmit(data: BarbeiroFormData) {
    if (editingBarbeiro) {
      updateBarbeiro(editingBarbeiro.id, data)
    } else {
      createBarbeiro(data)
    }
  }

  function handleConfirmDelete() {
    if (deletingBarbeiro) {
      deleteBarbeiro(deletingBarbeiro.id)
      setDeletingBarbeiro(undefined)
    }
  }

  if (!user) return null

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-neutral-500">
            {total}{' '}
            {total === 1 ? 'barbeiro cadastrado' : 'barbeiros cadastrados'}
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
            Novo Barbeiro
          </Button>
        </div>
      </div>

      <BarbeirosGrid
        barbeiros={barbeiros}
        onEdit={handleOpenEdit}
        onDelete={setDeletingBarbeiro}
      />

      <BarbeiroFormModal
        open={formOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        barbeiro={editingBarbeiro}
      />

      <ConfirmDialog
        open={!!deletingBarbeiro}
        onClose={() => setDeletingBarbeiro(undefined)}
        onConfirm={handleConfirmDelete}
        title="Excluir barbeiro"
        description={`Tem certeza que deseja excluir "${deletingBarbeiro?.nome}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
      />
    </div>
  )
}
