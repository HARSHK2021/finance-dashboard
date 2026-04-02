# 💎 Finova — Finance Dashboard

A modern, feature-rich personal finance dashboard built with React and JavaScript. Track income, monitor expenses, analyze spending patterns, and manage transactions with a sleek, multi-theme UI.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser
# → http://localhost:5173
```

### Build for Production
```bash
npm run build
npm run preview
```

---

## ✨ Features

### 🎛️ Dashboard Overview
- **4 Summary Cards** — Total Balance, Income, Expenses, Savings Rate with animated number counters
- **Balance Trend Chart** — Area chart showing 6-month income vs expenses vs net trend
- **Spending Breakdown** — Interactive donut chart with category legend
- **Recent Activity** — Latest 6 transactions with merchant info

### 💳 Transactions
- **50+ Mock Transactions** spanning January–June 2024 across 14 categories
- **Smart Filtering** — Search by description/merchant, filter by category, type, and month
- **Sorting** — Click any column header to sort ascending/descending
- **Pagination** — 10 items per page with intuitive page controls
- **Export** — Download filtered transactions as CSV or JSON
- **Live Summary Bar** — Shows filtered income/expense/net totals in real time

### 👥 Role-Based UI (RBAC)
Three simulated roles switchable via the sidebar dropdown:

| Role | Add | Edit | Delete | View |
|------|-----|------|--------|------|
| **Admin** | ✅ | ✅ | ✅ | ✅ |
| **Manager** | ✅ | ❌ | ❌ | ✅ |
| **Viewer** | ❌ | ❌ | ❌ | ✅ |

### 📊 Insights
- **Key Stat Cards** — Avg daily spend, total saved, best month, top spending category
- **Monthly Comparison** — Jun vs May bar chart + progress comparison
- **Key Observations** — Auto-generated financial health insights
- **Category Breakdown** — Animated progress bars for all expense categories

### 🎨 Theme System
Three polished themes toggled from the sidebar:

- 🌙 **Dark** — Deep navy with cyan/emerald accents (default)
- 🌆 **Dim** — Mid-slate, softer contrast (between dark and light)
- ☀️ **Light** — Clean white with blue accents

All themes use CSS custom properties for seamless transitions.

### 💾 Data Persistence
- Transactions, theme preference, and role selection are persisted in **localStorage**
- Data survives page refreshes automatically

### ➕ Add / Edit Transactions (Admin & Manager)
- Income/Expense type toggle
- Form validation with inline error messages
- Category auto-updates based on transaction type
- Double-click delete confirmation for safety

---

## 🏗️ Project Structure

```
src/
├── components/
│   ├── Dashboard/
│   │   ├── DashboardPage.jsx      # Main dashboard layout
│   │   ├── SummaryCards.jsx       # 4 KPI cards with counter animation
│   │   ├── BalanceTrend.jsx       # Recharts AreaChart
│   │   └── SpendingBreakdown.jsx  # Recharts PieChart/donut
│   ├── Transactions/
│   │   ├── TransactionList.jsx    # Full table with filters & pagination
│   │   └── TransactionModal.jsx   # Add/Edit modal form
│   ├── Insights/
│   │   └── InsightsPanel.jsx      # Analytics, bar charts, progress bars
│   ├── Layout/
│   │   ├── Sidebar.jsx            # Navigation + theme/role controls
│   │   └── Header.jsx             # Top bar with date + role pill
│   └── common/
│       ├── ThemeToggle.jsx        # Dark/Dim/Light switcher
│       ├── RoleSelector.jsx       # Role dropdown
│       └── Toast.jsx              # Notification toasts
├── context/
│   └── AppContext.jsx             # useReducer-based global state
├── data/
│   └── mockData.js                # 60+ transactions + metadata
├── hooks/
│   └── useLocalStorage.js         # Custom hook for localStorage sync
├── utils/
│   └── helpers.js                 # Formatters, aggregators, export utils
└── styles/
    └── globals.css                # CSS variables, themes, all component styles
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| React 18 | UI framework |
| Vite 5 | Build tool & dev server |
| Recharts | Charts (area, bar, pie) |
| Lucide React | Icon library |
| date-fns | Date formatting |
| CSS Custom Properties | Theme system |
| localStorage | Data persistence |
| React Context + useReducer | State management |

---

## 🎨 Design Decisions

- **Aesthetic**: Premium fintech — deep navy dark theme with cyan/emerald/red accents
- **Fonts**: Sora (headings) + DM Sans (body) via Google Fonts
- **CSS Architecture**: Single globals.css with CSS variables — no CSS-in-JS, no Tailwind, full control
- **Animations**: CSS keyframe animations (fadeSlideUp, countUp, shimmer) with staggered delays
- **Responsiveness**: CSS Grid with breakpoints at 1200px, 900px, 600px; sidebar collapses to mobile overlay

---

## 📝 Notes

- No backend required — all data is mocked and runs entirely in the browser
- All charts animate on load via Recharts built-in animation
- The delete button requires two clicks as a safety confirmation UX pattern
- Switching roles instantly updates the UI — no page reload needed
