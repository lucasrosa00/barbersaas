import { HistoricoFilters } from '@/components/historico/HistoricoFilters'
import { HistoricoTable } from '@/components/historico/HistoricoTable'
import { useAuth } from '@/hooks/useAuth'
import { useBarbeiros } from '@/hooks/useBarbeiros'
import { useClientes } from '@/hooks/useClientes'
import { useHistorico } from '@/hooks/useHistorico'
import { formatCurrency } from '@/utils/formatCurrency'

export function HistoricoPage() {
  const { user } = useAuth()
  const empresaId = user?.empresaId ?? ''

  const {
    registros,
    total,
    totalFiltrado,
    valorTotal,
    filtros,
    updateFiltro,
    limparFiltros,
  } = useHistorico(empresaId)

  const { clientes } = useClientes(empresaId)
  const { barbeiros } = useBarbeiros(empresaId)

  if (!user) return null

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-neutral-500">
            Exibindo {totalFiltrado} de {total} registros
          </p>
        </div>

        <div className="rounded-lg border border-neutral-200 bg-white px-4 py-2.5 sm:shrink-0">
          <p className="text-xs text-neutral-500">Total faturado (finalizados)</p>
          <p className="text-lg font-semibold text-neutral-900">
            {formatCurrency(valorTotal)}
          </p>
        </div>
      </div>

      <HistoricoFilters
        filtros={filtros}
        clientes={clientes}
        barbeiros={barbeiros}
        onUpdate={updateFiltro}
        onLimpar={limparFiltros}
      />

      <HistoricoTable registros={registros} />
    </div>
  )
}
