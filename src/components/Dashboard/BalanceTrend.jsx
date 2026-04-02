import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { useApp } from '../../context/AppContext'
import { getMonthlyData } from '../../utils/helpers'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--bg-elevated)',
      border: '1px solid var(--border)',
      borderRadius: 10,
      padding: '10px 14px',
      fontSize: '0.8rem',
      fontFamily: 'var(--font-body)',
      boxShadow: 'var(--shadow)',
    }}>
      <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6, fontSize: '0.85rem' }}>
        {label} 2024
      </div>
      {payload.map((entry) => (
        <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, background: entry.color }} />
          <span style={{ color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{entry.name}:</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
            ${Number(entry.value).toLocaleString('en-US', { minimumFractionDigits: 0 })}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function BalanceTrend() {
  const { state } = useApp()
  const data = getMonthlyData(state.transactions)

  return (
    <div className="card animate-fade-up-5" style={{ height: '100%', minHeight: 340 }}>
      <div className="chart-header">
        <div>
          <div className="chart-title">Balance Trend</div>
          <div className="chart-subtitle">Monthly income vs expenses — Jan to Jun 2024</div>
        </div>
        <div className="chart-legend">
          <div className="legend-item">
            <div className="legend-dot" style={{ background: '#34d399' }} />
            Income
          </div>
          <div className="legend-item">
            <div className="legend-dot" style={{ background: '#f87171' }} />
            Expenses
          </div>
          <div className="legend-item">
            <div className="legend-dot" style={{ background: '#22d3ee' }} />
            Net
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f87171" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'var(--font-body)' }}
            axisLine={false}
            tickLine={false}
            dy={8}
          />
          <YAxis
            tick={{ fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'var(--font-body)' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            dx={-4}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="income"
            stroke="#34d399"
            strokeWidth={2.5}
            fill="url(#incomeGrad)"
            dot={{ r: 3, fill: '#34d399', strokeWidth: 0 }}
            activeDot={{ r: 5, fill: '#34d399', stroke: 'var(--bg-card)', strokeWidth: 2 }}
          />
          <Area
            type="monotone"
            dataKey="expenses"
            stroke="#f87171"
            strokeWidth={2.5}
            fill="url(#expenseGrad)"
            dot={{ r: 3, fill: '#f87171', strokeWidth: 0 }}
            activeDot={{ r: 5, fill: '#f87171', stroke: 'var(--bg-card)', strokeWidth: 2 }}
          />
          <Area
            type="monotone"
            dataKey="net"
            stroke="#22d3ee"
            strokeWidth={2}
            fill="url(#netGrad)"
            strokeDasharray="5 4"
            dot={{ r: 3, fill: '#22d3ee', strokeWidth: 0 }}
            activeDot={{ r: 5, fill: '#22d3ee', stroke: 'var(--bg-card)', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
