import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { MovimentacaoForm } from '@/components/financeiro/MovimentacaoForm'
import { ApiError } from '@/services/api/client'
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
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(data: MovimentacaoFormData) {
    setError(null)
    try {
      await onSubmit(data)
      onClose()
    } catch (err) {
      setError(
        err instanceof ApiError || err instanceof Error
          ? err.message
          : 'Não foi possível registrar a movimentação.',
      )
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Nova movimentação">
      {error && (
        <p className="mb-4 rounded-lg border border-neutral-300 bg-neutral-50 px-3 py-2 text-sm text-neutral-800">
          {error}
        </p>
      )}
      <MovimentacaoForm
        key={open ? 'open' : 'closed'}
        barbeiros={barbeiros}
        onSubmit={handleSubmit}
        onCancel={onClose}
      />
    </Modal>
  )
}
