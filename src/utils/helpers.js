import { format, parseISO, startOfMonth, isSameMonth } from 'date-fns';

export const formatCurrency = (amount, compact = false) => {
  if (compact && amount >= 1000) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(amount);
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (dateStr) => {
  try {
    return format(parseISO(dateStr), 'MMM dd, yyyy');
  } catch {
    return dateStr;
  }
};

export const formatShortDate = (dateStr) => {
  try {
    return format(parseISO(dateStr), 'MMM dd');
  } catch {
    return dateStr;
  }
};

export const getMonthYear = (dateStr) => {
  try {
    return format(parseISO(dateStr), 'MMMM yyyy');
  } catch {
    return dateStr;
  }
};

export const getMonthlyData = (transactions) => {
  const months = ['2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06'];
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

  return months.map((month, i) => {
    const monthTxns = transactions.filter((t) => t.date.startsWith(month));
    const income = monthTxns
      .filter((t) => t.type === 'income')
      .reduce((s, t) => s + t.amount, 0);
    const expenses = monthTxns
      .filter((t) => t.type === 'expense')
      .reduce((s, t) => s + t.amount, 0);
    const balance = income - expenses;
    return { month: labels[i], income, expenses, balance, net: income - expenses };
  });
};

export const getCategoryBreakdown = (transactions) => {
  const expenseOnly = transactions.filter((t) => t.type === 'expense');
  const categoryMap = {};
  expenseOnly.forEach((t) => {
    categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
  });
  const total = Object.values(categoryMap).reduce((s, v) => s + v, 0);
  return Object.entries(categoryMap)
    .map(([name, value]) => ({ name, value, pct: total > 0 ? (value / total) * 100 : 0 }))
    .sort((a, b) => b.value - a.value);
};

export const getTotals = (transactions) => {
  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0);
  const expenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0);
  const balance = income - expenses;
  const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;
  return { income, expenses, balance, savingsRate };
};

export const getMonthlyTotals = (transactions, monthStr) => {
  const monthTxns = transactions.filter((t) => t.date.startsWith(monthStr));
  return getTotals(monthTxns);
};

export const generateId = () =>
  `txn_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

export const exportToCSV = (transactions) => {
  const headers = ['Date', 'Description', 'Category', 'Type', 'Amount', 'Merchant'];
  const rows = transactions.map((t) =>
    [t.date, t.description, t.category, t.type, t.amount, t.merchant].join(',')
  );
  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'zorvyn_transactions.csv';
  a.click();
  URL.revokeObjectURL(url);
};

export const exportToJSON = (transactions) => {
  const json = JSON.stringify(transactions, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'zorvyn_transactions.json';
  a.click();
  URL.revokeObjectURL(url);
};
