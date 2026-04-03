# Zorvyn — Modern Finance Dashboard

A polished, browser-only finance dashboard built with **React 18** and **Vite**. Track income and expenses, explore charts, filter and export transactions, and switch themes — with a single **report period** that keeps the dashboard, insights, and table aligned.

---

## Quick start

**Prerequisites:** Node.js 18+

```bash
npm install
npm run dev
```

Open **http://localhost:5173**

```bash
npm run build
npm run preview
```

---

## Features

### Dashboard

- **Executive summary** — Three auto-generated bullets (net position, best month, top spend driver) for the **current report period**.
- **KPI cards** — Balance, income, expenses, savings rate; count-up animation respects **prefers-reduced-motion**.
- **Balance trend** — Area chart from **actual transaction months** (not hard-coded).
- **Spending breakdown** — Donut chart by category for the selected period.
- **Recent activity** — Latest six rows scoped to the same period.

### Report period (header)

- Presets: **All data**, **dataset span**, **Q1 / Q2 / H1 2024** (when data exists).
- **Dashboard**, **Insights**, and **Transactions** (base list) all use this scope.
- **CSV / JSON exports** include whatever is on screen: period scope **plus** table search/filters.

### Transactions

- Search (with **deferred** filtering for smoother typing), category/type/month filters, sortable columns, pagination.
- **Accessible column headers** — sort controls are `<button>`s with **`aria-sort`**.
- **Filter chips** — quick clear for each active filter; full reset still available.
- **Pagination** — stable list keys (no fragment key warnings).

### Insights

- Monthly series and comparisons derived from **scoped** data.
- **Last vs previous month** block uses the **last two months in the period**, not fixed indices.
- Empty states when there are **too few months** for a chart or comparison.
- **What-if slider** — rough “trim top category by X%” savings illustration (clearly labeled as illustrative).

### Roles (RBAC demo)

| Role    | Add | Edit | Delete | View |
|---------|:---:|:----:|:------:|:----:|
| **Admin**  | Yes | Yes  | Yes    | Yes  |
| **Viewer** | No  | No   | No     | Yes  |

- **Role change banner** appears under the header when you switch roles (dismissible).
- **Single toast system** — no duplicate toast libraries.

### Audit trail

- **Recent activity** in the sidebar logs add / edit / delete (demo, last 50 events, persisted in `localStorage`).
- **Admin** can clear the log.

### Themes

- **Dark**, **Dim**, **Light** — CSS custom properties, persisted.

### Data

- Mock transactions in **`src/data/mockData.js`**; state persisted under **`zorvyn_*`** keys in `localStorage`.

---

## Ideas I implemented (portfolio narrative)

These are concrete product concepts I wanted to showcase for an organization review:

1. **One report period for everything** — Avoids the classic demo bug where charts show “all time” but the table is filtered differently. The header selector is the single source of truth.
2. **Executive summary strip** — Gives executives three sentences before they scroll; computed from the same scoped data as the charts.
3. **Audit / activity log** — Signals awareness of enterprise expectations (who changed what), even in a front-end-only demo.
4. **What-if scenario** — Shows you can translate analytics into **action** (rough savings from trimming a top category), with honest labeling that it is not a forecast engine.
5. **Accessible data table** — Sorting is keyboard-focusable and exposes **`aria-sort`**; amounts use **tabular numerals** for alignment.
6. **Motion accessibility** — Respects **prefers-reduced-motion** for staggered animations.
7. **Robust time-axis logic** — Monthly aggregates use **dates present in the data** instead of hard-coded June vs May.

---

## Project structure

```
src/
├── components/
│   ├── common/           # PeriodSelector, ExecutiveSummary, RoleChangeBanner, ActivityLog, ThemeToggle, Toast…
│   ├── Dashboard/
│   ├── Transactions/
│   ├── Insights/          # InsightsPanel, WhatIfScenario
│   └── Layout/
├── context/AppContext.jsx
├── data/mockData.js
├── utils/helpers.js       # formatters, getMonthlyData, report period helpers, export
└── styles/globals.css
```

---

## Tech stack

| Technology | Role |
|------------|------|
| React 18 | UI |
| Vite 5 | Build |
| Recharts | Charts |
| Lucide React | Icons |
| date-fns | Dates |
| Context + useReducer | State |
| localStorage | Persistence |

---

## Production assets

Import images and other bundled assets in components (for example `import logo from '...'`). Paths like `/src/assets/...` work in dev but **fail after `vite build`**; the build hashes files into `dist/assets/`.

---

## Notes

- No backend — all data is local / mocked.
- Delete uses a **double-click confirm** on the trash action.
- **`dist/`** is gitignored; deploy from source (for example **Vercel** runs `npm run build` automatically).
