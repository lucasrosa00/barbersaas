import { Modal } from '@/components/ui/Modal'
import { labels } from '@/constants/terminology'
import { BarbeiroForm } from '@/components/barbeiros/BarbeiroForm'
import type { Barbeiro, BarbeiroFormData } from '@/types/barbeiro'

interface BarbeiroFormModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: BarbeiroFormData) => void
  barbeiro?: Barbeiro
}

export function BarbeiroFormModal({
  open,
  onClose,
  onSubmit,
  barbeiro,
}: BarbeiroFormModalProps) {
  const isEditing = !!barbeiro

  function handleSubmit(data: BarbeiroFormData) {
    onSubmit(data)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? labels.professional.edit : labels.professional.new}
    >
      <BarbeiroForm
        key={barbeiro?.id ?? 'new'}
        defaultValues={barbeiro}
        onSubmit={handleSubmit}
        onCancel={onClose}
        submitLabel={isEditing ? 'Salvar alterações' : 'Cadastrar'}
      />
    </Modal>
  )
}
