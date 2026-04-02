import { useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts'
import { useApp } from '../../context/AppContext'
import { getMonthlyData, getCategoryBreakdown, formatCurrency } from '../../utils/helpers'
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../../data/mockData'
import {
  TrendingUp, TrendingDown, Award, AlertCircle,
  Zap, Target, DollarSign, Calendar,
} from 'lucide-react'

function StatCard({ icon: Icon, iconColor, label, value, sub, trend, index }) {
  return (
    <div
      className="insight-stat"
      style={{ animationDelay: `${index * 0.06}s` }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div className="insight-label">{label}</div>
        <div style={{
          width: 32, height: 32,
          borderRadius: 'var(--radius-md)',
          background: `${iconColor}18`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={15} color={iconColor} />
        </div>
      </div>
      <div className="insight-value">{value}</div>
      {sub && <div className="insight-sub">{sub}</div>}
      {trend != null && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8 }}>
          {trend >= 0
            ? <TrendingUp size={12} color="var(--income)" />
            : <TrendingDown size={12} color="var(--expense)" />}
          <span style={{
            fontSize: '0.72rem',
            fontWeight: 600,
            color: trend >= 0 ? 'var(--income)' : 'var(--expense)',
          }}>
            {Math.abs(trend).toFixed(1)}% vs last month
          </span>
        </div>
      )}
    </div>
  )
}

const BarTooltip = ({ active, payload, label }) => {
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
      <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>{label} 2024</div>
      {payload.map(p => (
        <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, background: p.color }} />
          <span style={{ color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{p.name}:</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{formatCurrency(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

export default function InsightsPanel() {
  const { state } = useApp()
  const { transactions } = state

  const monthlyData = useMemo(() => getMonthlyData(transactions), [transactions])
  const categoryData = useMemo(() => getCategoryBreakdown(transactions), [transactions])

  // Compute months
  const currentMonth = monthlyData[5]   // Jun
  const prevMonth = monthlyData[4]      // May
  const allMonths = monthlyData

  // Monthly change
  const incomeChange = prevMonth.income > 0
    ? ((currentMonth.income - prevMonth.income) / prevMonth.income) * 100 : 0
  const expenseChange = prevMonth.expenses > 0
    ? ((currentMonth.expenses - prevMonth.expenses) / prevMonth.expenses) * 100 : 0

  // Best month (highest net)
  const bestMonth = [...allMonths].sort((a, b) => b.net - a.net)[0]
  // Worst month
  const worstMonth = [...allMonths].sort((a, b) => a.net - b.net)[0]

  // Average daily spend (all time)
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const uniqueDays = new Set(transactions.filter(t => t.type === 'expense').map(t => t.date)).size
  const avgDailySpend = uniqueDays > 0 ? totalExpenses / uniqueDays : 0

  // Total income & savings
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const totalSavings = totalIncome - totalExpenses
  const savingsRate = totalIncome > 0 ? (totalSavings / totalIncome) * 100 : 0

  // Top category
  const topCategory = categoryData[0]
  const maxCatAmount = categoryData[0]?.value || 1

  // Transaction count by type
  const incomeCount = transactions.filter(t => t.type === 'income').length
  const expenseCount = transactions.filter(t => t.type === 'expense').length

  const statCards = [
    {
      icon: DollarSign,
      iconColor: 'var(--accent)',
      label: 'Avg Daily Spend',
      value: formatCurrency(avgDailySpend),
      sub: `Over ${uniqueDays} active days`,
    },
    {
      icon: Target,
      iconColor: 'var(--purple)',
      label: 'Total Saved',
      value: formatCurrency(totalSavings),
      sub: `${savingsRate.toFixed(1)}% savings rate`,
      trend: savingsRate >= 20 ? 10 : -5,
    },
    {
      icon: Award,
      iconColor: 'var(--amber)',
      label: 'Best Month',
      value: bestMonth.month,
      sub: `Net ${formatCurrency(bestMonth.net)}`,
    },
    {
      icon: AlertCircle,
      iconColor: 'var(--expense)',
      label: 'Highest Spending',
      value: topCategory?.name || '—',
      sub: topCategory ? formatCurrency(topCategory.value) : 'No data',
    },
    {
      icon: Zap,
      iconColor: 'var(--income)',
      label: 'Income Sources',
      value: incomeCount,
      sub: `${formatCurrency(totalIncome)} total`,
    },
    {
      icon: Calendar,
      iconColor: 'var(--text-secondary)',
      label: 'Transactions',
      value: transactions.length,
      sub: `${expenseCount} expenses, ${incomeCount} income`,
    },
  ]

  return (
    <div>
      <div className="page-header animate-fade-up">
        <div>
          <div className="page-title">Financial Insights</div>
          <div className="page-desc">Trends, patterns, and key observations from your data</div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="insights-grid animate-fade-up-1">
        {statCards.map((card, i) => (
          <StatCard key={card.label} {...card} index={i} />
        ))}
      </div>

      {/* Monthly Comparison + Bar Chart */}
      <div className="charts-grid animate-fade-up-2" style={{ marginBottom: 24 }}>
        {/* Bar chart */}
        <div className="card">
          <div className="chart-header">
            <div>
              <div className="chart-title">Monthly Comparison</div>
              <div className="chart-subtitle">Income vs expenses — 6 month view</div>
            </div>
            <div className="chart-legend">
              <div className="legend-item">
                <div className="legend-dot" style={{ background: 'var(--income)' }} />
                Income
              </div>
              <div className="legend-item">
                <div className="legend-dot" style={{ background: 'var(--expense)' }} />
                Expenses
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={monthlyData} barGap={4} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'var(--font-body)' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'var(--font-body)' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={v => `$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<BarTooltip />} />
              <Bar dataKey="income" fill="var(--income)" radius={[5, 5, 0, 0]} opacity={0.85} />
              <Bar dataKey="expenses" fill="var(--expense)" radius={[5, 5, 0, 0]} opacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* This month vs last month */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Current month summary */}
          <div className="card" style={{ flex: 1 }}>
            <div className="chart-title" style={{ marginBottom: 14 }}>Jun vs May 2024</div>
            {[
              {
                label: 'Income',
                cur: currentMonth.income,
                prev: prevMonth.income,
                change: incomeChange,
                color: 'var(--income)',
              },
              {
                label: 'Expenses',
                cur: currentMonth.expenses,
                prev: prevMonth.expenses,
                change: expenseChange,
                color: 'var(--expense)',
              },
              {
                label: 'Net Balance',
                cur: currentMonth.net,
                prev: prevMonth.net,
                change: prevMonth.net !== 0 ? ((currentMonth.net - prevMonth.net) / Math.abs(prevMonth.net)) * 100 : 0,
                color: currentMonth.net >= 0 ? 'var(--income)' : 'var(--expense)',
              },
            ].map(item => (
              <div key={item.label} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, alignItems: 'baseline' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{item.label}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      vs {formatCurrency(item.prev)}
                    </span>
                    <span style={{
                      fontSize: '0.72rem', fontWeight: 700,
                      color: (item.label === 'Expenses' ? item.change <= 0 : item.change >= 0) ? 'var(--income)' : 'var(--expense)',
                    }}>
                      {item.change >= 0 ? '▲' : '▼'} {Math.abs(item.change).toFixed(1)}%
                    </span>
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: item.color }}>
                      {formatCurrency(item.cur)}
                    </span>
                  </div>
                </div>
                <div className="progress-bar-bg">
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${Math.min(100, (item.cur / Math.max(item.cur, item.prev)) * 100)}%`,
                      background: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Quick observations */}
          <div className="card" style={{ flex: 1 }}>
            <div className="chart-title" style={{ marginBottom: 12 }}>🔍 Key Observations</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                expenseChange > 10
                  ? { icon: '⚠️', text: `Expenses rose ${expenseChange.toFixed(0)}% this month`, color: 'var(--amber)' }
                  : { icon: '✅', text: 'Expense growth is under control', color: 'var(--income)' },
                savingsRate >= 20
                  ? { icon: '🌟', text: `Great! You're saving ${savingsRate.toFixed(0)}% of income`, color: 'var(--income)' }
                  : { icon: '💡', text: `Aim to save 20%+ of income (currently ${savingsRate.toFixed(0)}%)`, color: 'var(--amber)' },
                { icon: '🏆', text: `${bestMonth.month} was your best month with ${formatCurrency(bestMonth.net)} net`, color: 'var(--accent)' },
                topCategory
                  ? { icon: '📊', text: `${topCategory.name} is your biggest spend at ${formatCurrency(topCategory.value)}`, color: 'var(--text-secondary)' }
                  : null,
              ].filter(Boolean).map((obs, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 8,
                  padding: '8px 10px',
                  background: 'var(--bg-elevated)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.78rem',
                }}>
                  <span>{obs.icon}</span>
                  <span style={{ color: obs.color }}>{obs.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="card animate-fade-up-3">
        <div className="chart-header" style={{ marginBottom: 20 }}>
          <div>
            <div className="chart-title">Spending by Category</div>
            <div className="chart-subtitle">All-time breakdown with relative share</div>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Total: {formatCurrency(totalExpenses)}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {categoryData.map((cat, i) => (
            <div key={cat.name} style={{ animationDelay: `${i * 0.05}s` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <div style={{
                  width: 32, height: 32,
                  borderRadius: 8,
                  background: `${CATEGORY_COLORS[cat.name]}20`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 15, flexShrink: 0,
                }}>
                  {CATEGORY_ICONS[cat.name]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                      {cat.name}
                    </span>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {cat.pct.toFixed(1)}%
                      </span>
                      <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', minWidth: 80, textAlign: 'right' }}>
                        {formatCurrency(cat.value)}
                      </span>
                    </div>
                  </div>
                  <div className="progress-bar-bg">
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${(cat.value / maxCatAmount) * 100}%`,
                        background: CATEGORY_COLORS[cat.name] || 'var(--accent)',
                        opacity: 0.85,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {categoryData.length === 0 && (
            <div className="empty-state" style={{ padding: '40px 20px' }}>
              <div className="empty-icon">📊</div>
              <div className="empty-title">No expense data</div>
              <div className="empty-desc">Add some expense transactions to see category breakdown</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
