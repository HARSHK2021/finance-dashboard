import { useState, useEffect } from 'react'
import { useApp } from './context/AppContext'
import Sidebar from './components/Layout/Sidebar'
import Header from './components/Layout/Header'
import DashboardPage from './components/Dashboard/DashboardPage'
import TransactionList from './components/Transactions/TransactionList'
import InsightsPanel from './components/Insights/InsightsPanel'
import Toast from './components/common/Toast'

export default function App() {
  const { state } = useApp()
  const { activeTab, theme, toast } = state
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // Close sidebar on tab change (mobile)
  useEffect(() => {
    setSidebarOpen(false)
  }, [activeTab])

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="main-content">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <div className="page-wrapper">
          <div className="page-animate" key={activeTab}>
            {activeTab === 'dashboard' && <DashboardPage />}
            {activeTab === 'transactions' && <TransactionList />}
            {activeTab === 'insights' && <InsightsPanel />}
          </div>
        </div>
      </div>

      {toast && <Toast message={toast.message} variant={toast.variant} />}
    </div>
  )
}
