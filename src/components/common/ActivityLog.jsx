import { format } from 'date-fns';
import { History, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const ACTION_VERB = {
  add: 'Added',
  edit: 'Edited',
  delete: 'Deleted',
};

export default function ActivityLog() {
  const { state, clearAuditLog } = useApp();
  const { auditLog, role } = state;

  if (auditLog.length === 0) return null;

  return (
    <div className="activity-log">
      <div className="activity-log-header">
        <History size={14} aria-hidden />
        <span className="activity-log-title">Recent activity</span>
        {role === 'admin' && (
          <button
            type="button"
            className="activity-log-clear"
            onClick={() => clearAuditLog()}
            title="Clear history"
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>
      <ul className="activity-log-list">
        {auditLog.slice(0, 8).map((entry) => (
          <li key={entry.id} className="activity-log-item">
            <span className="activity-log-verb">{ACTION_VERB[entry.action] || entry.action}</span>
            <span className="activity-log-detail">{entry.detail || entry.label}</span>
            <time className="activity-log-time" dateTime={new Date(entry.at).toISOString()}>
              {format(entry.at, 'MMM d, h:mm a')}
            </time>
          </li>
        ))}
      </ul>
    </div>
  );
}
