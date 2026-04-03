import { useApp } from '../../context/AppContext'
import { Crown, Eye } from 'lucide-react'

const ROLES = [
  { id: 'admin', label: 'Admin', desc: 'Full access' },
  { id: 'viewer', label: 'Viewer', desc: 'Read-only access' },
]

const ROLE_ICONS = { admin: Crown, viewer: Eye }
const ROLE_COLORS = {
  admin: { bg: 'rgba(251,191,36,0.12)', color: 'var(--amber)', border: 'rgba(251,191,36,0.3)' },
  viewer: { bg: 'var(--accent-subtle)', color: 'var(--accent)', border: 'var(--border-accent)' },
}

export default function RoleSelector() {
  const { state, setRole } = useApp()
  const { role } = state
  const Icon = ROLE_ICONS[role] || Eye
  const colors = ROLE_COLORS[role] || ROLE_COLORS.viewer

  return (
    <div className="role-selector-wrap">
      <div className="role-label">Switch Role</div>
      <select
        className="role-select"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        aria-label="Select role"
      >
        {ROLES.map((r) => (
          <option key={r.id} value={r.id}>
            {r.label} — {r.desc}
          </option>
        ))}
      </select>
      <div
        className="role-badge"
        style={{ background: colors.bg, color: colors.color, border: `1px solid ${colors.border}` }}
      >
        <Icon size={11} />
        {role === 'admin' ? 'Can edit all data' : 'View only — no edits'}
      </div>
    </div>
  )
}
