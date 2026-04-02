import { createContext, useContext, useReducer, useEffect } from 'react';
import { initialTransactions } from '../data/mockData';
import { generateId } from '../utils/helpers';

const AppContext = createContext(null);

const STORAGE_KEYS = {
  transactions: 'zorvyn_transactions',
  theme: 'zorvyn_theme',
  role: 'zorvyn_role',
};

const loadFromStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const initialState = {
  transactions: loadFromStorage(STORAGE_KEYS.transactions, initialTransactions),
  theme: loadFromStorage(STORAGE_KEYS.theme, 'dark'),
  role: loadFromStorage(STORAGE_KEYS.role, 'admin'),
  activeTab: 'dashboard',
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
      return { ...state, transactions: [newTxn, ...state.transactions] };
    }

    case 'EDIT_TRANSACTION': {
      const updated = state.transactions.map((t) =>
        t.id === action.payload.id ? { ...t, ...action.payload } : t
      );
      return { ...state, transactions: updated };
    }

    case 'DELETE_TRANSACTION': {
      const filtered = state.transactions.filter((t) => t.id !== action.payload);
      return { ...state, transactions: filtered };
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

  // Persist to localStorage
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

  // Auto-clear toast
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
    <AppContext.Provider value={{ state, ...actions }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
