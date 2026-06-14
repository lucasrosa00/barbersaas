import { Modal } from '@/components/ui/Modal'
import { ListaEsperaForm } from '@/components/listaEspera/ListaEsperaForm'
import type { ListaEsperaFormData } from '@/types/listaEspera'
import type { Cliente } from '@/types/cliente'
import type { Barbeiro } from '@/types/barbeiro'
import type { Servico } from '@/types/servico'

interface ListaEsperaFormModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: ListaEsperaFormData) => void | Promise<void>
  clientes: Cliente[]
  barbeiros: Barbeiro[]
  servicos: Servico[]
}

export function ListaEsperaFormModal({
  open,
  onClose,
  onSubmit,
  clientes,
  barbeiros,
  servicos,
}: ListaEsperaFormModalProps) {
  async function handleSubmit(data: ListaEsperaFormData) {
    await onSubmit(data)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Adicionar à Lista de Espera">
      <ListaEsperaForm
        clientes={clientes}
        barbeiros={barbeiros}
        servicos={servicos}
        onSubmit={handleSubmit}
        onCancel={onClose}
      />
    </Modal>
  )
}
