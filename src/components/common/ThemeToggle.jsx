import { useApp } from '../../context/AppContext'
import { Sun, Moon, CloudSun } from 'lucide-react'

const THEMES = [
  { id: 'light', label: 'Light', icon: Sun },
  { id: 'dim', label: 'Dim', icon: CloudSun },
  { id: 'dark', label: 'Dark', icon: Moon },
]

export default function ThemeToggle() {
  const { state, setTheme } = useApp()
  const { theme } = state

  return (
    <div className="theme-toggle-wrap">
      <div className="theme-toggle-label">Appearance</div>
      <div className="theme-options">
        {THEMES.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`theme-btn ${theme === id ? 'active' : ''}`}
            onClick={() => setTheme(id)}
            title={`${label} mode`}
          >
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
