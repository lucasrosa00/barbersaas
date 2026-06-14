import { Modal } from '@/components/ui/Modal'
import { ServicoForm } from '@/components/servicos/ServicoForm'
import type { Servico, ServicoFormData } from '@/types/servico'

interface BarbeiroOption {
  id: string
  nome: string
}

interface ServicoFormModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: ServicoFormData) => void | Promise<void>
  servico?: Servico
  barbeiros: BarbeiroOption[]
}

export function ServicoFormModal({
  open,
  onClose,
  onSubmit,
  servico,
  barbeiros,
}: ServicoFormModalProps) {
  const isEditing = !!servico

  async function handleSubmit(data: ServicoFormData) {
    await onSubmit(data)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? 'Editar Serviço' : 'Novo Serviço'}
    >
      <ServicoForm
        key={servico?.id ?? 'new'}
        defaultValues={servico}
        barbeiros={barbeiros}
        onSubmit={handleSubmit}
        onCancel={onClose}
        submitLabel={isEditing ? 'Salvar alterações' : 'Cadastrar'}
      />
    </Modal>
  )
}
