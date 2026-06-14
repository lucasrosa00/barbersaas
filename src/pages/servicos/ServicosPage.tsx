import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { ServicoFormModal } from '@/components/servicos/ServicoFormModal'
import { ServicosTable } from '@/components/servicos/ServicosTable'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { SearchInput } from '@/components/ui/SearchInput'
import { useAuth } from '@/hooks/useAuth'
import { useBarbeiros } from '@/hooks/useBarbeiros'
import { useServicos } from '@/hooks/useServicos'
import type { Servico, ServicoFormData } from '@/types/servico'

export function ServicosPage() {
  const { user } = useAuth()
  const {
    servicos,
    total,
    search,
    setSearch,
    isLoading,
    createServico,
    updateServico,
    deleteServico,
  } = useServicos(user?.empresaId ?? '')

  const { barbeiros } = useBarbeiros(user?.empresaId ?? '')

  const barbeiroOptions = useMemo(
    () => barbeiros.map(({ id, nome }) => ({ id, nome })),
    [barbeiros],
  )

  const [formOpen, setFormOpen] = useState(false)
  const [editingServico, setEditingServico] = useState<Servico | undefined>()
  const [deletingServico, setDeletingServico] = useState<Servico | undefined>()

  function handleOpenCreate() {
    setEditingServico(undefined)
    setFormOpen(true)
  }

  function handleOpenEdit(servico: Servico) {
    setEditingServico(servico)
    setFormOpen(true)
  }

  function handleCloseForm() {
    setFormOpen(false)
    setEditingServico(undefined)
  }

  async function handleSubmit(data: ServicoFormData) {
    if (editingServico) {
      await updateServico(editingServico.id, data)
    } else {
      await createServico(data)
    }
  }

  async function handleConfirmDelete() {
    if (deletingServico) {
      await deleteServico(deletingServico.id)
      setDeletingServico(undefined)
    }
  }

  if (!user) return null

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-neutral-500">
            {total} {total === 1 ? 'serviço cadastrado' : 'serviços cadastrados'}
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
            Novo Serviço
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-900 border-t-transparent" />
        </div>
      ) : (
        <ServicosTable
          servicos={servicos}
          onEdit={handleOpenEdit}
          onDelete={setDeletingServico}
        />
      )}

      <ServicoFormModal
        open={formOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        servico={editingServico}
        barbeiros={barbeiroOptions}
      />

      <ConfirmDialog
        open={!!deletingServico}
        onClose={() => setDeletingServico(undefined)}
        onConfirm={handleConfirmDelete}
        title="Excluir serviço"
        description={`Tem certeza que deseja excluir "${deletingServico?.nome}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
      />
    </div>
  )
}
