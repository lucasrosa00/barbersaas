import { Modal } from '@/components/ui/Modal'
import { MovimentacaoForm } from '@/components/financeiro/MovimentacaoForm'
import type { MovimentacaoFormData } from '@/types/financeiro'

interface BarbeiroOption {
  id: string
  nome: string
}

interface MovimentacaoFormModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: MovimentacaoFormData) => void | Promise<void>
  barbeiros: BarbeiroOption[]
}

export function MovimentacaoFormModal({
  open,
  onClose,
  onSubmit,
  barbeiros,
}: MovimentacaoFormModalProps) {
  async function handleSubmit(data: MovimentacaoFormData) {
    await onSubmit(data)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Nova movimentação">
      <MovimentacaoForm
        key={open ? 'open' : 'closed'}
        barbeiros={barbeiros}
        onSubmit={handleSubmit}
        onCancel={onClose}
      />
    </Modal>
  )
}
