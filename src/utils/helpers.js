import { format, parseISO } from 'date-fns';

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

/** Transactions visible for dashboard / insights / scoped table (before user filters). */
export const filterByReportPeriod = (transactions, reportPeriod) => {
  if (!reportPeriod || reportPeriod.mode === 'all') return transactions;
  const { startMonth, endMonth } = reportPeriod;
  if (!startMonth || !endMonth) return transactions;
  return transactions.filter((t) => {
    const ym = t.date.substring(0, 7);
    return ym >= startMonth && ym <= endMonth;
  });
};

export const getReportPeriodLabel = (reportPeriod) => {
  if (!reportPeriod || reportPeriod.mode === 'all') return 'All data';
  const { startMonth, endMonth } = reportPeriod;
  if (!startMonth || !endMonth) return 'All data';
  try {
    const s = format(parseISO(`${startMonth}-01`), 'MMM yyyy');
    const e = format(parseISO(`${endMonth}-01`), 'MMM yyyy');
    return startMonth === endMonth ? s : `${s} – ${e}`;
  } catch {
    return 'Custom range';
  }
};

/**
 * Monthly series derived from transaction dates (not hard-coded months).
 */
export const getMonthlyData = (transactions) => {
  const monthSet = new Set(transactions.map((t) => t.date.substring(0, 7)));
  const months = [...monthSet].sort();
  return months.map((ym) => {
    let label = ym;
    let year = 0;
    try {
      const d = parseISO(`${ym}-01`);
      label = format(d, 'MMM');
      year = Number(format(d, 'yyyy'));
    } catch {
      /* keep defaults */
    }
    const monthTxns = transactions.filter((t) => t.date.startsWith(ym));
    const income = monthTxns
      .filter((t) => t.type === 'income')
      .reduce((s, t) => s + t.amount, 0);
    const expenses = monthTxns
      .filter((t) => t.type === 'expense')
      .reduce((s, t) => s + t.amount, 0);
    const net = income - expenses;
    return { month: label, monthKey: ym, year, income, expenses, balance: net, net };
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

/** Three plain-language bullets for the dashboard executive strip. */
export const buildExecutiveBullets = (transactions) => {
  const { income, expenses, balance, savingsRate } = getTotals(transactions);
  const monthly = getMonthlyData(transactions);
  const categoryData = getCategoryBreakdown(transactions);
  const top = categoryData[0];

  if (!transactions.length) {
    return [
      'No transactions fall in the selected report period.',
      'Choose “All data” or widen the range in the header to see your full picture.',
      'Transactions, exports, and charts all respect this same period.',
    ];
  }

  const b1 =
    balance >= 0
      ? `Net position is positive at ${formatCurrency(balance)} (${savingsRate.toFixed(1)}% of income saved).`
      : `Outflows exceed inflows by ${formatCurrency(Math.abs(balance))}; discretionary categories are the first place to optimize.`;

  const sortedByNet = [...monthly].sort((a, b) => b.net - a.net);
  const best = sortedByNet[0];
  const b2 = best
    ? `Strongest month by net: ${best.month}${best.year ? ` ${best.year}` : ''} (${formatCurrency(best.net)}).`
    : 'Add more dated activity to compare months.';

  const b3 = top
    ? `Top spend driver: ${top.name} at ${formatCurrency(top.value)} (${top.pct.toFixed(0)}% of expenses in this period).`
    : 'No expenses in this range—income-only stretch.';

  return [b1, b2, b3];
};

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
