import { Modal } from '@/components/ui/Modal'
import { BloqueioHorarioForm } from '@/components/bloqueios/BloqueioHorarioForm'
import type { Barbeiro } from '@/types/barbeiro'
import type { BloqueioHorario, BloqueioHorarioFormData } from '@/types/bloqueioHorario'

interface BloqueioHorarioFormModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: BloqueioHorarioFormData) => void | Promise<void>
  barbeiros: Barbeiro[]
  bloqueio?: BloqueioHorario
  prefilled?: Partial<BloqueioHorarioFormData>
}

export function BloqueioHorarioFormModal({
  open,
  onClose,
  onSubmit,
  barbeiros,
  bloqueio,
  prefilled,
}: BloqueioHorarioFormModalProps) {
  const isEditing = !!bloqueio

  async function handleSubmit(data: BloqueioHorarioFormData) {
    await onSubmit(data)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? 'Editar bloqueio' : 'Novo bloqueio de horário'}
    >
      <BloqueioHorarioForm
        key={bloqueio?.id ?? 'new'}
        barbeiros={barbeiros}
        defaultValues={bloqueio}
        prefilled={prefilled}
        onSubmit={handleSubmit}
        onCancel={onClose}
        submitLabel={isEditing ? 'Salvar alterações' : 'Cadastrar bloqueio'}
      />
    </Modal>
  )
}
