import { useEffect, useRef, useState } from 'react'
import { useApp } from '../../context/AppContext'
import { getTotals } from '../../utils/helpers'
import { Wallet, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react'

function useCountUp(target, duration = 1000) {
  const [value, setValue] = useState(0)
  const raf = useRef(null)

  useEffect(() => {
    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      setValue(target)
      return undefined
    }
    const start = performance.now()
    const animate = (now) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(eased * target)
      if (progress < 1) raf.current = requestAnimationFrame(animate)
    }
    raf.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf.current)
  }, [target, duration])

  return value
}

function formatVal(num) {
  if (num >= 10000) return `$${(num / 1000).toFixed(1)}k`
  return `$${num.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
}

function SummaryCard({ className, icon: Icon, iconClass, label, value, change, changeDir, index }) {
  const animated = useCountUp(value, 900 + index * 100)

  return (
    <div className={`summary-card ${className} animate-fade-up-${index + 1}`}>
      <div className={`summary-icon ${iconClass}`}>
        <Icon size={20} />
      </div>
      <div className="summary-label">{label}</div>
      <div className="summary-value tabular-nums">{formatVal(animated)}</div>
      {change != null && (
        <div className={`summary-change ${changeDir}`}>
          {changeDir === 'up' ? '↑' : changeDir === 'down' ? '↓' : '◆'} {change}
        </div>
      )}
    </div>
  )
}

export default function SummaryCards() {
  const { scopedTransactions } = useApp()
  const { income, expenses, balance, savingsRate } = getTotals(scopedTransactions)

  const cards = [
    {
      className: 'balance',
      iconClass: 'balance-icon',
      icon: Wallet,
      label: 'Total Balance',
      value: balance,
      change: 'Net position',
      changeDir: balance >= 0 ? 'up' : 'down',
    },
    {
      className: 'income',
      iconClass: 'income-icon',
      icon: TrendingUp,
      label: 'Total Income',
      value: income,
      change: 'All sources',
      changeDir: 'up',
    },
    {
      className: 'expense',
      iconClass: 'expense-icon',
      icon: TrendingDown,
      label: 'Total Expenses',
      value: expenses,
      change: 'All categories',
      changeDir: 'down',
    },
    {
      className: 'savings',
      iconClass: 'savings-icon',
      icon: PiggyBank,
      label: 'Savings Rate',
      value: savingsRate,
      change: `${savingsRate.toFixed(1)}% saved`,
      changeDir: savingsRate >= 20 ? 'up' : 'neutral',
    },
  ]

  // Override the last card formatting for %
  return (
    <div className="summary-grid">
      {cards.map((card, i) => {
        if (card.label === 'Savings Rate') {
          return (
            <div key={card.label} className={`summary-card ${card.className} animate-fade-up-${i + 1}`}>
              <div className={`summary-icon ${card.iconClass}`}>
                <card.icon size={20} />
              </div>
              <div className="summary-label">{card.label}</div>
              <div className="summary-value tabular-nums" style={{ fontSize: '1.5rem' }}>
                {savingsRate.toFixed(1)}%
              </div>
              <div className={`summary-change ${card.changeDir}`}>
                {savingsRate >= 20 ? '↑' : '◆'} {savingsRate >= 20 ? 'Healthy savings' : 'Room to improve'}
              </div>
            </div>
          )
        }
        return <SummaryCard key={card.label} {...card} index={i} />
      })}
    </div>
  )
}
