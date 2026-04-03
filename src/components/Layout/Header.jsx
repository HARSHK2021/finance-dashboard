import { useApp } from '../../context/AppContext'
import { Bell, Menu, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import PeriodSelector from '../common/PeriodSelector'

const PAGE_INFO = {
  dashboard: { title: 'Dashboard', desc: 'Your financial overview' },
  transactions: { title: 'Transactions', desc: 'Track all your money movements' },
  insights: { title: 'Insights', desc: 'Analyze your spending patterns' },
}

const ROLE_COLORS = {
  admin: 'var(--amber)',
  viewer: 'var(--accent)',
}

const ROLE_LABELS = {
  admin: ' Admin',
  viewer: 'Viewer',
}

export default function Header({ onMenuClick }) {
  const { state } = useApp()
  const { activeTab, role } = state
  const info = PAGE_INFO[activeTab] || PAGE_INFO.dashboard
  const today = format(new Date(), 'EEE, MMM d')

  return (
    <header className="header">
      {/* Hamburger — mobile only */}
      <button className="mobile-menu-btn" onClick={onMenuClick} aria-label="Open menu">
        <Menu size={20} />
      </button>

      {/* Page title */}
      <div className="header-page-info">
        <div className="header-title">{info.title}</div>
        <div className="header-subtitle">{info.desc}</div>
      </div>

      <div className="header-spacer" />

      <PeriodSelector />

      {/* Date — hidden on small screens */}
      <div className="header-date">
        <Calendar size={14} />
        <span>{today}</span>
      </div>

      {/* Role badge */}
      <div
        className="header-role-pill"
        style={{ color: ROLE_COLORS[role] || 'var(--accent)' }}
      >
        <span
          className="role-dot"
          style={{ background: ROLE_COLORS[role] || 'var(--accent)' }}
        />
        {ROLE_LABELS[role] || role}
      </div>

      {/* Notification bell */}
      <button className="header-btn" aria-label="Notifications">
        <Bell size={16} />
        <span className="notif-dot" />
      </button>
    </header>
  )
}
