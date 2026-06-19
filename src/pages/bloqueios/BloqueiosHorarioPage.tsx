import { useState } from 'react'
import { Plus } from 'lucide-react'
import { BloqueioHorarioFormModal } from '@/components/bloqueios/BloqueioHorarioFormModal'
import { BloqueiosFilters } from '@/components/bloqueios/BloqueiosFilters'
import { BloqueiosList } from '@/components/bloqueios/BloqueiosList'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useAuth } from '@/hooks/useAuth'
import { useBarbeiros } from '@/hooks/useBarbeiros'
import { useBloqueiosHorario } from '@/hooks/useBloqueiosHorario'
import type { BloqueioHorario, BloqueioHorarioFormData } from '@/types/bloqueioHorario'

export function BloqueiosHorarioPage() {
  const { user } = useAuth()
  const empresaId = user?.empresaId ?? ''

  const {
    bloqueios,
    filtros,
    isLoading,
    createBloqueio,
    updateBloqueio,
    deleteBloqueio,
    updateFiltro,
    limparFiltros,
  } = useBloqueiosHorario(empresaId)

  const { barbeiros } = useBarbeiros(empresaId)

  const [formOpen, setFormOpen] = useState(false)
  const [editingBloqueio, setEditingBloqueio] = useState<BloqueioHorario | undefined>()
  const [deletingBloqueio, setDeletingBloqueio] = useState<BloqueioHorario | undefined>()

  function handleOpenCreate() {
    setEditingBloqueio(undefined)
    setFormOpen(true)
  }

  function handleOpenEdit(bloqueio: BloqueioHorario) {
    setEditingBloqueio(bloqueio)
    setFormOpen(true)
  }

  function handleCloseForm() {
    setFormOpen(false)
    setEditingBloqueio(undefined)
  }

  async function handleSubmit(data: BloqueioHorarioFormData) {
    if (editingBloqueio) {
      await updateBloqueio(editingBloqueio.id, data)
    } else {
      await createBloqueio(data)
    }
  }

  async function handleConfirmDelete() {
    if (deletingBloqueio) {
      await deleteBloqueio(deletingBloqueio.id)
      setDeletingBloqueio(undefined)
    }
  }

  if (!user) return null

  const total = bloqueios.length

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-neutral-500">
            {total}{' '}
            {total === 1 ? 'bloqueio cadastrado' : 'bloqueios cadastrados'}
          </p>
          <p className="mt-1 text-xs text-neutral-400">
            Bloqueios fixos repetem semanalmente; pontuais valem apenas na data
            informada.
          </p>
        </div>

        <Button onClick={handleOpenCreate} className="w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Novo bloqueio
        </Button>
      </div>

      <BloqueiosFilters
        filtros={filtros}
        barbeiros={barbeiros}
        onUpdate={updateFiltro}
        onLimpar={limparFiltros}
      />

      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-900 border-t-transparent" />
        </div>
      ) : (
        <BloqueiosList
          bloqueios={bloqueios}
          onEdit={handleOpenEdit}
          onDelete={setDeletingBloqueio}
        />
      )}

      <BloqueioHorarioFormModal
        open={formOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        barbeiros={barbeiros}
        bloqueio={editingBloqueio}
      />

      <ConfirmDialog
        open={!!deletingBloqueio}
        onClose={() => setDeletingBloqueio(undefined)}
        onConfirm={handleConfirmDelete}
        title="Excluir bloqueio"
        description={`Tem certeza que deseja excluir o bloqueio "${deletingBloqueio?.motivo}"?`}
        confirmLabel="Excluir"
      />
    </div>
  )
}
