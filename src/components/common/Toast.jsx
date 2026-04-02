import { CheckCircle, XCircle, Info } from 'lucide-react'

const ICONS = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
}

export default function Toast({ message, variant = 'success' }) {
  const Icon = ICONS[variant] || CheckCircle
  return (
    <div className="toast-container">
      <div className={`toast ${variant}`}>
        <Icon className="toast-icon" size={18} />
        <span>{message}</span>
      </div>
    </div>
  )
}
