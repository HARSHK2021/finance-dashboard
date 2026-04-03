import { useEffect, useRef } from 'react'
import { useApp } from '../../context/AppContext'
import { Crown, Eye } from 'lucide-react'

const ROLES = [
  {
    id: 'admin',
    label: 'Admin',
    desc: 'Full access',
    icon: Crown,
  },
  {
    id: 'viewer',
    label: 'Viewer',
    desc: 'Read-only',
    icon: Eye,
  },
]

export default function RoleSelector() {
  const { state, setRole } = useApp()
  const { role } = state
  const sliderRef = useRef(null)
  const wrapRef = useRef(null)

  // Animate the sliding indicator
  useEffect(() => {
    const wrap = wrapRef.current
    const slider = sliderRef.current
    if (!wrap || !slider) return

    const activeBtn = wrap.querySelector(`.rs-option.${role}`)
    if (!activeBtn) return

    const wrapRect = wrap.getBoundingClientRect()
    const btnRect = activeBtn.getBoundingClientRect()
    slider.style.left = `${btnRect.left - wrapRect.left}px`
    slider.style.width = `${btnRect.width}px`
  }, [role])

  return (
    <div className="role-selector-wrap">
      <div className="role-label">Switch Role</div>

      {/* Segmented toggle */}
      <div className="rs-wrap" ref={wrapRef}>
        {/* Sliding background pill */}
        <div className="rs-slider" ref={sliderRef} />

        {ROLES.map(({ id, label, desc, icon: Icon }) => (
          <button
            key={id}
            className={`rs-option ${id} ${role === id ? 'active' : ''}`}
            onClick={() => setRole(id)}
            aria-pressed={role === id}
            aria-label={`Switch to ${label} role`}
          >
            <div className="rs-icon-wrap">
              <Icon size={14} />
            </div>
            <span className="rs-opt-label">{label}</span>
            <span className="rs-opt-desc">{desc}</span>
          </button>
        ))}
      </div>

      {/* Status badge */}
      <div className={`rs-badge rs-badge--${role}`}>
        <span className="rs-badge-dot" />
        {role === 'admin' ? 'Can edit all data' : 'View only — no edits'}
      </div>
    </div>
  )
}