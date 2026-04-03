import { useApp } from '../../context/AppContext'
import ThemeToggle from '../common/ThemeToggle'
import RoleSelector from '../common/RoleSelector'
import toast, { Toaster } from 'react-hot-toast';
import {
  LayoutDashboard,
  ArrowLeftRight,
  TrendingUp,
  Shield,
  Diamond,
  X,
  LogOut,
} from 'lucide-react'

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, desc: 'Overview & summary' },
  { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight, desc: 'All transactions' },
  { id: 'insights', label: 'Insights', icon: TrendingUp, desc: 'Analytics & trends' },
]

export default function Sidebar({ isOpen, onClose }) {
  const { state, setActiveTab } = useApp()
  const { activeTab } = state

  const handleNav = (id) => {
    setActiveTab(id)
    if (onClose) onClose()
  }
const handleLogout = (e)=>{
  e.preventDefault();
  // console.log("login pressed")
  toast.success('Logout Successful', { className:'border border' ,position: 'top-center' })
   
}
  return (
    <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">
          <img src="/src/assets/zorvynlogolight.png" className="logo-image" width={30} height={30} alt="Zorvyn"  />
        </div>
        <span className="logo-text">Zorvyn</span>
        <span className="logo-badge">Beta</span>
        {/* Close button - mobile only */}
        <button className="sidebar-close-btn" onClick={onClose} aria-label="Close sidebar">
          <X size={17} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="nav-section-label">Navigation</div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          return (
            <div
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => handleNav(item.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleNav(item.id)}
            >
              <div className={`nav-item-icon-wrap ${isActive ? 'active' : ''}`}>
                <Icon size={17} />
              </div>
              <div className="nav-item-text">
                <div className="nav-item-label">{item.label}</div>
                <div className="nav-item-desc">{item.desc}</div>
              </div>
              {isActive && <div className="nav-active-dot" />}
            </div>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <ThemeToggle />
        <RoleSelector />
        <div className="sidebar-secure-badge">
          <Shield size={13} color="var(--accent)" />
          <span>Secured & encrypted</span>
        </div>
        <div className="sidebar-secure-badge "onClick={handleLogout}>
          <LogOut  size={13} color="var(--accent)" />
          <span>logout</span>
          <Toaster />
        </div>
      </div>
    </aside>
  )
}
