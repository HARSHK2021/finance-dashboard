import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { useApp } from '../../context/AppContext'
import { getCategoryBreakdown, getReportPeriodLabel } from '../../utils/helpers'
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../../data/mockData'

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
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
      <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
        {CATEGORY_ICONS[d.name]} {d.name}
      </div>
      <div style={{ color: 'var(--text-secondary)' }}>
        ${d.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
      <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
        {d.pct.toFixed(1)}% of expenses
      </div>
    </div>
  )
}

export default function SpendingBreakdown() {
  const { state, scopedTransactions } = useApp()
  const data = getCategoryBreakdown(scopedTransactions)
  const periodLabel = getReportPeriodLabel(state.reportPeriod)
  const top5 = data.slice(0, 5)

  if (!data.length) {
    return (
      <div className="card animate-fade-up-6" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 340 }}>
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <div className="empty-title">No expense data</div>
          <div className="empty-desc">Add some transactions to see spending breakdown</div>
        </div>
      </div>
    )
  }

  return (
    <div className="card animate-fade-up-6" style={{ minHeight: 340 }}>
      <div className="chart-header">
        <div>
          <div className="chart-title">Spending Breakdown</div>
          <div className="chart-subtitle">By category — {periodLabel}</div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={3}
            dataKey="value"
            animationBegin={100}
            animationDuration={800}
          >
            {data.map((entry) => (
              <Cell
                key={entry.name}
                fill={CATEGORY_COLORS[entry.name] || '#64748b'}
                stroke="var(--bg-card)"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="pie-legend">
        {top5.map((item) => (
          <div key={item.name} className="pie-legend-item">
            <div
              className="pie-legend-color"
              style={{ background: CATEGORY_COLORS[item.name] || '#64748b' }}
            />
            <span className="pie-legend-name">
              {CATEGORY_ICONS[item.name]} {item.name}
            </span>
            <span className="pie-legend-val">
              ${item.value.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </span>
            <span className="pie-legend-pct">{item.pct.toFixed(1)}%</span>
          </div>
        ))}
        {data.length > 5 && (
          <div className="pie-legend-item" style={{ opacity: 0.6 }}>
            <div className="pie-legend-color" style={{ background: 'var(--text-muted)' }} />
            <span className="pie-legend-name">+{data.length - 5} more</span>
          </div>
        )}
      </div>
    </div>
  )
}
