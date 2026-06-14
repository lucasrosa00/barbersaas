import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { DadoGrafico } from '@/types/financeiro'
import { formatCurrency } from '@/utils/formatCurrency'

interface FaturamentoChartProps {
  title: string
  data: DadoGrafico[]
  color?: string
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { value: number }[]
  label?: string
}) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm shadow-lg">
      <p className="text-neutral-500">{label}</p>
      <p className="font-semibold text-neutral-900">
        {formatCurrency(payload[0].value)}
      </p>
    </div>
  )
}

export function FaturamentoChart({
  title,
  data,
  color = '#171717',
}: FaturamentoChartProps) {
  return (
    <article className="rounded-xl border border-neutral-200 bg-white p-4 sm:p-5">
      <h3 className="mb-4 text-sm font-semibold text-neutral-900">{title}</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: '#737373', fontSize: 11 }}
            axisLine={{ stroke: '#d4d4d4' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#737373', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) =>
              v >= 1000 ? `R$${(v / 1000).toFixed(0)}k` : `R$${v}`
            }
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f5f5f540' }} />
          <Bar dataKey="valor" fill={color} radius={[4, 4, 0, 0]} maxBarSize={48} />
        </BarChart>
      </ResponsiveContainer>
    </article>
  )
}
