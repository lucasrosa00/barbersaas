import { Cake } from 'lucide-react'
import { AniversariantesList } from '@/components/aniversariantes/AniversariantesList'
import { Select } from '@/components/ui/Select'
import { useAuth } from '@/hooks/useAuth'
import { useAniversariantes } from '@/hooks/useAniversariantes'

const MESES = [
  { value: '1', label: 'Janeiro' },
  { value: '2', label: 'Fevereiro' },
  { value: '3', label: 'Março' },
  { value: '4', label: 'Abril' },
  { value: '5', label: 'Maio' },
  { value: '6', label: 'Junho' },
  { value: '7', label: 'Julho' },
  { value: '8', label: 'Agosto' },
  { value: '9', label: 'Setembro' },
  { value: '10', label: 'Outubro' },
  { value: '11', label: 'Novembro' },
  { value: '12', label: 'Dezembro' },
]

export function AniversariantesPage() {
  const { user } = useAuth()
  const empresaId = user?.empresaId ?? ''
  const { aniversariantes, mes, setMes, isLoading } = useAniversariantes(empresaId)

  if (!user) return null

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-neutral-500">
            {aniversariantes.length}{' '}
            {aniversariantes.length === 1 ? 'aniversariante' : 'aniversariantes'}{' '}
            neste mês
          </p>
          <p className="mt-1 text-xs text-neutral-400">
            Página informativa para oferecer descontos de aniversário aos clientes.
          </p>
        </div>

        <div className="w-full sm:max-w-xs">
          <Select
            label="Mês"
            value={String(mes)}
            onChange={(e) => setMes(Number(e.target.value))}
            options={MESES}
          />
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3">
        <Cake className="mt-0.5 h-5 w-5 shrink-0 text-neutral-500" />
        <p className="text-sm text-neutral-600">
          Use o botão WhatsApp para entrar em contato e oferecer um desconto especial
          ao cliente no dia do aniversário.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-900 border-t-transparent" />
        </div>
      ) : (
        <AniversariantesList aniversariantes={aniversariantes} mes={mes} />
      )}
    </div>
  )
}
