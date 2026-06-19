import { Modal } from '@/components/ui/Modal'
import { ClienteForm } from '@/components/clientes/ClienteForm'
import type { Cliente, ClienteFormData } from '@/types/cliente'

interface ClienteFormModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: ClienteFormData) => void | Promise<void>
  cliente?: Cliente
  nested?: boolean
}

export function ClienteFormModal({
  open,
  onClose,
  onSubmit,
  cliente,
  nested = false,
}: ClienteFormModalProps) {
  const isEditing = !!cliente

  async function handleSubmit(data: ClienteFormData) {
    await onSubmit(data)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? 'Editar Cliente' : 'Novo Cliente'}
      nested={nested}
    >
      <ClienteForm
        key={cliente?.id ?? 'new'}
        defaultValues={cliente}
        onSubmit={handleSubmit}
        onCancel={onClose}
        submitLabel={isEditing ? 'Salvar alterações' : 'Cadastrar'}
      />
    </Modal>
  )
}
