import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const COPY = {
  admin: 'Admin: you can add, edit, and delete transactions.',
  viewer: 'Viewer: the ledger is read-only. Switch to Admin to make changes.',
};

export default function RoleChangeBanner() {
  const { state } = useApp();
  const { role } = state;
  const prev = useRef(role);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (prev.current !== role) {
      setVisible(true);
      prev.current = role;
    }
  }, [role]);

  if (!visible) return null;

  return (
    <div className="role-change-banner" role="status">
      <span className="role-change-banner-text">{COPY[role] || COPY.viewer}</span>
      <button
        type="button"
        className="role-change-banner-dismiss"
        onClick={() => setVisible(false)}
        aria-label="Dismiss"
      >
        <X size={16} />
      </button>
    </div>
  );
}
