import { useEffect, useRef } from 'react'
import { useApp } from '../../context/AppContext'
import { Sun, Cloud, Moon } from 'lucide-react'

const THEMES = [
  { id: 'light', label: 'Light', icon: Sun },
  { id: 'dim',   label: 'Dim',   icon: Cloud },
  { id: 'dark',  label: 'Dark',  icon: Moon },
]

export default function ThemeToggle() {
  const { state, setTheme } = useApp()
  const { theme } = state
  const sliderRef = useRef(null)
  const wrapRef   = useRef(null)

  useEffect(() => {
    const wrap   = wrapRef.current
    const slider = sliderRef.current
    if (!wrap || !slider) return

    const activeBtn = wrap.querySelector(`.tt-btn.${theme}`)
    if (!activeBtn) return

    const wrapRect = wrap.getBoundingClientRect()
    const btnRect  = activeBtn.getBoundingClientRect()
    slider.style.left  = `${btnRect.left - wrapRect.left}px`
    slider.style.width = `${btnRect.width}px`
  }, [theme])

  return (
    <div className="theme-toggle-wrap">
      <div className="theme-toggle-label">Appearance</div>

      <div className="tt-wrap" ref={wrapRef}>
        {/* Sliding pill */}
        <div className="tt-slider" ref={sliderRef} />

        {THEMES.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`tt-btn ${id} ${theme === id ? 'active' : ''}`}
            onClick={() => setTheme(id)}
            aria-pressed={theme === id}
            aria-label={`${label} mode`}
          >
            <div className="tt-icon-wrap">
              <Icon size={14} />
            </div>
            <span className="tt-btn-label">{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}