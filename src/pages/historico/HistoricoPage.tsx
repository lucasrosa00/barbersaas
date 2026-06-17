import { HistoricoFilters } from '@/components/historico/HistoricoFilters'
import { HistoricoTable } from '@/components/historico/HistoricoTable'
import { Pagination } from '@/components/ui/Pagination'
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
    valorTotal,
    filtros,
    page,
    pageSize,
    setPage,
    isLoading,
    updateFiltro,
    limparFiltros,
  } = useHistorico(empresaId)

  const { clientes } = useClientes(empresaId, { all: true })
  const { barbeiros } = useBarbeiros(empresaId)

  if (!user) return null

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-neutral-500">
            {total} {total === 1 ? 'registro encontrado' : 'registros encontrados'}
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

      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-900 border-t-transparent" />
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-neutral-200">
          <HistoricoTable registros={registros} />
          <Pagination
            page={page}
            pageSize={pageSize}
            total={total}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  )
}
