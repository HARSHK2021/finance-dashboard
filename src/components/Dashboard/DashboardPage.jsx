import { useApp } from '../../context/AppContext'
import SummaryCards from './SummaryCards'
import BalanceTrend from './BalanceTrend'
import SpendingBreakdown from './SpendingBreakdown'
import { formatCurrency, formatShortDate } from '../../utils/helpers'
import { CATEGORY_ICONS } from '../../data/mockData'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

function RecentTransactions({ transactions }) {
  const recent = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6)

  return (
    <div className="card animate-fade-up" style={{ marginTop: 16 }}>
      <div className="chart-header" style={{ marginBottom: 12 }}>
        <div>
          <div className="chart-title">Recent Activity</div>
          <div className="chart-subtitle">Latest transactions</div>
        </div>
      </div>
      {recent.length === 0 ? (
        <div className="empty-state" style={{ padding: '30px 20px' }}>
          <div className="empty-icon">📋</div>
          <div className="empty-title">No transactions yet</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {recent.map((txn, i) => (
            <div
              key={txn.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                transition: 'background var(--transition)',
                cursor: 'default',
                animation: `fadeSlideUp 0.3s ease ${i * 0.04}s both`,
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 'var(--radius-md)',
                background: txn.type === 'income' ? 'var(--income-subtle)' : 'var(--expense-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                flexShrink: 0,
              }}>
                {CATEGORY_ICONS[txn.category] || '💰'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {txn.description}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {txn.merchant} · {formatShortDate(txn.date)}
                </div>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontWeight: 700,
                fontSize: '0.88rem',
                color: txn.type === 'income' ? 'var(--income)' : 'var(--expense)',
                flexShrink: 0,
              }}>
                {txn.type === 'income'
                  ? <ArrowUpRight size={14} />
                  : <ArrowDownRight size={14} />}
                {formatCurrency(txn.amount)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function DashboardPage() {
  const { state } = useApp()
  const { transactions } = state

  return (
    <div>
      <div className="page-header animate-fade-up">
        <div>
          <div className="page-title">Financial Overview</div>
          <div className="page-desc">Your complete financial picture — Jan to Jun 2024</div>
        </div>
      </div>

      <SummaryCards />

      <div className="charts-grid">
        <BalanceTrend />
        <SpendingBreakdown />
      </div>

      <RecentTransactions transactions={transactions} />
    </div>
  )
}
