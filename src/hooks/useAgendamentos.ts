import { useCallback, useEffect, useMemo, useState } from 'react'
import { agendamentoService } from '@/services/agenda/agendamentoService'
import { toISODate } from '@/utils/timeSlots'
import type {
  AgendamentoEnriquecido,
  AgendamentoFormData,
} from '@/types/agendamento'

export function useAgendamentos(empresaId: string) {
  const [agendamentos, setAgendamentos] = useState<AgendamentoEnriquecido[]>(
    [],
  )
  const [selectedDate, setSelectedDate] = useState(toISODate(new Date()))
  const [isLoading, setIsLoading] = useState(true)

  const loadAgendamentos = useCallback(async () => {
    if (!empresaId) return
    setIsLoading(true)
    try {
      const data = await agendamentoService.list(empresaId)
      setAgendamentos(data)
    } finally {
      setIsLoading(false)
    }
  }, [empresaId])

  useEffect(() => {
    loadAgendamentos()
  }, [loadAgendamentos])

  const agendamentosDoDia = useMemo(
    () => agendamentos.filter((a) => a.data === selectedDate),
    [agendamentos, selectedDate],
  )

  const createAgendamento = useCallback(
    async (data: AgendamentoFormData) => {
      const novo = await agendamentoService.create(empresaId, data)
      setAgendamentos((prev) => [...prev, novo])
      return novo
    },
    [empresaId],
  )

  const updateAgendamento = useCallback(
    async (id: string, data: AgendamentoFormData) => {
      const atualizado = await agendamentoService.update(empresaId, id, data)
      setAgendamentos((prev) =>
        prev.map((a) => (a.id === id ? atualizado : a)),
      )
      return atualizado
    },
    [empresaId],
  )

  const cancelAgendamento = useCallback(
    async (id: string) => {
      const cancelado = await agendamentoService.cancel(empresaId, id)
      setAgendamentos((prev) => prev.map((a) => (a.id === id ? cancelado : a)))
      return cancelado
    },
    [empresaId],
  )

  return {
    agendamentos: agendamentosDoDia,
    todosAgendamentos: agendamentos,
    selectedDate,
    setSelectedDate,
    isLoading,
    createAgendamento,
    updateAgendamento,
    cancelAgendamento,
    reload: loadAgendamentos,
  }
}
