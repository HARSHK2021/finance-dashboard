import { createContext, useContext, useReducer, useEffect, useMemo } from 'react';
import { initialTransactions } from '../data/mockData';
import { generateId, filterByReportPeriod } from '../utils/helpers';

const AppContext = createContext(null);

const STORAGE_KEYS = {
  transactions: 'zorvyn_transactions',
  theme: 'zorvyn_theme',
  role: 'zorvyn_role',
  reportPeriod: 'zorvyn_report_period',
  auditLog: 'zorvyn_audit_log',
};

const MAX_AUDIT = 50;

const loadFromStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const loadReportPeriod = () => {
  const r = loadFromStorage(STORAGE_KEYS.reportPeriod, null);
  if (!r || typeof r !== 'object') return { mode: 'all' };
  if (r.mode === 'all') return { mode: 'all' };
  if (r.mode === 'range' && r.startMonth && r.endMonth) {
    return { mode: 'range', startMonth: r.startMonth, endMonth: r.endMonth };
  }
  return { mode: 'all' };
};

function pushAuditEntry(log, entry) {
  const item = {
    id: `audit_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    at: Date.now(),
    ...entry,
  };
  return [item, ...log].slice(0, MAX_AUDIT);
}

const loadAuditLog = () => {
  const raw = loadFromStorage(STORAGE_KEYS.auditLog, []);
  return Array.isArray(raw) ? raw.slice(0, MAX_AUDIT) : [];
};

const initialState = {
  transactions: loadFromStorage(STORAGE_KEYS.transactions, initialTransactions),
  theme: loadFromStorage(STORAGE_KEYS.theme, 'dark'),
  role: loadFromStorage(STORAGE_KEYS.role, 'admin'),
  activeTab: 'dashboard',
  reportPeriod: loadReportPeriod(),
  auditLog: loadAuditLog(),
  filters: {
    search: '',
    category: 'all',
    type: 'all',
    sortBy: 'date',
    sortOrder: 'desc',
    monthFilter: 'all',
  },
  toast: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, theme: action.payload };

    case 'SET_ROLE':
      return { ...state, role: action.payload };

    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };

    case 'SET_REPORT_PERIOD':
      return { ...state, reportPeriod: action.payload };

    case 'CLEAR_AUDIT':
      return { ...state, auditLog: [] };

    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };

    case 'RESET_FILTERS':
      return {
        ...state,
        filters: {
          search: '',
          category: 'all',
          type: 'all',
          sortBy: 'date',
          sortOrder: 'desc',
          monthFilter: 'all',
        },
      };

    case 'ADD_TRANSACTION': {
      const newTxn = { ...action.payload, id: generateId() };
      const auditLog = pushAuditEntry(state.auditLog, {
        action: 'add',
        label: 'Added transaction',
        detail: newTxn.description,
      });
      return { ...state, transactions: [newTxn, ...state.transactions], auditLog };
    }

    case 'EDIT_TRANSACTION': {
      const before = state.transactions.find((t) => t.id === action.payload.id);
      const updated = state.transactions.map((t) =>
        t.id === action.payload.id ? { ...t, ...action.payload } : t
      );
      const auditLog = pushAuditEntry(state.auditLog, {
        action: 'edit',
        label: 'Updated transaction',
        detail: action.payload.description ?? before?.description ?? '',
      });
      return { ...state, transactions: updated, auditLog };
    }

    case 'DELETE_TRANSACTION': {
      const id = action.payload;
      const victim = state.transactions.find((t) => t.id === id);
      const filtered = state.transactions.filter((t) => t.id !== id);
      const auditLog = victim
        ? pushAuditEntry(state.auditLog, {
            action: 'delete',
            label: 'Deleted transaction',
            detail: victim.description,
          })
        : state.auditLog;
      return { ...state, transactions: filtered, auditLog };
    }

    case 'SET_TOAST':
      return { ...state, toast: action.payload };

    case 'CLEAR_TOAST':
      return { ...state, toast: null };

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const scopedTransactions = useMemo(
    () => filterByReportPeriod(state.transactions, state.reportPeriod),
    [state.transactions, state.reportPeriod]
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.transactions, JSON.stringify(state.transactions));
  }, [state.transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.theme, JSON.stringify(state.theme));
    document.documentElement.setAttribute('data-theme', state.theme);
  }, [state.theme]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.role, JSON.stringify(state.role));
  }, [state.role]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.reportPeriod, JSON.stringify(state.reportPeriod));
  }, [state.reportPeriod]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.auditLog, JSON.stringify(state.auditLog));
  }, [state.auditLog]);

  useEffect(() => {
    if (state.toast) {
      const t = setTimeout(() => dispatch({ type: 'CLEAR_TOAST' }), 3000);
      return () => clearTimeout(t);
    }
  }, [state.toast]);

  const showToast = (message, variant = 'success') => {
    dispatch({ type: 'SET_TOAST', payload: { message, variant } });
  };

  const actions = {
    setTheme: (theme) => dispatch({ type: 'SET_THEME', payload: theme }),
    setRole: (role) => dispatch({ type: 'SET_ROLE', payload: role }),
    setActiveTab: (tab) => dispatch({ type: 'SET_ACTIVE_TAB', payload: tab }),
    setReportPeriod: (period) => dispatch({ type: 'SET_REPORT_PERIOD', payload: period }),
    clearAuditLog: () => dispatch({ type: 'CLEAR_AUDIT' }),
    setFilters: (filters) => dispatch({ type: 'SET_FILTERS', payload: filters }),
    resetFilters: () => dispatch({ type: 'RESET_FILTERS' }),
    addTransaction: (txn) => {
      dispatch({ type: 'ADD_TRANSACTION', payload: txn });
      showToast('Transaction added successfully!');
    },
    editTransaction: (txn) => {
      dispatch({ type: 'EDIT_TRANSACTION', payload: txn });
      showToast('Transaction updated!');
    },
    deleteTransaction: (id) => {
      dispatch({ type: 'DELETE_TRANSACTION', payload: id });
      showToast('Transaction deleted.', 'error');
    },
    showToast,
  };

  return (
    <AppContext.Provider value={{ state, scopedTransactions, ...actions }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
