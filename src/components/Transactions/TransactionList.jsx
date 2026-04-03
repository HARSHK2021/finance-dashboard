import { useState, useMemo, useDeferredValue } from 'react'
import { useApp } from '../../context/AppContext'
import CustomSelect from '../common/CustomSelect'
import TransactionModal from './TransactionModal'
import { CATEGORIES, CATEGORY_ICONS } from '../../data/mockData'
import {
  formatCurrency, formatDate, exportToCSV, exportToJSON, getReportPeriodLabel,
} from '../../utils/helpers'
import {
  Search, Plus, Trash2, Edit2, Download, RefreshCw,
  ChevronUp, ChevronDown, ChevronsUpDown,
  ArrowUpRight, ArrowDownRight, X,
} from 'lucide-react'

const PAGE_SIZE = 10

function SortIcon({ field, sortBy, sortOrder }) {
  if (sortBy !== field) {
    return <ChevronsUpDown size={12} className="txn-sort-icon" style={{ opacity: 0.3 }} />
  }
  return sortOrder === 'asc'
    ? <ChevronUp size={12} className="txn-sort-icon" style={{ color: 'var(--accent)' }} />
    : <ChevronDown size={12} className="txn-sort-icon" style={{ color: 'var(--accent)' }} />
}

function SortTh({
  field, sortBy, sortOrder, onSort, children, width, align,
}) {
  const sorted = sortBy === field
  return (
    <th
      scope="col"
      aria-sort={sorted ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}
      style={{
        width,
        textAlign: align === 'right' ? 'right' : undefined,
      }}
    >
      <button
        type="button"
        className={`txn-sort-btn${align === 'right' ? ' txn-sort-btn--end' : ''}`}
        onClick={() => onSort(field)}
      >
        <span>{children}</span>
        <SortIcon field={field} sortBy={sortBy} sortOrder={sortOrder} />
      </button>
    </th>
  )
}

export default function TransactionList() {
  const {
    state, setFilters, resetFilters, deleteTransaction, scopedTransactions,
  } = useApp()
  const { transactions, filters, role } = state

  const [modalOpen, setModalOpen] = useState(false)
  const [editData, setEditData] = useState(null)
  const [page, setPage] = useState(1)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const canEdit = role === 'admin'
  const canAdd = role === 'admin'

  const deferredSearch = useDeferredValue(filters.search)

  const months = useMemo(() => {
      const set = new Set(scopedTransactions.map((t) => t.date.substring(0, 7)))
      return [...set].sort().reverse()
  }, [scopedTransactions])

  const categoryGroups = useMemo(
    () => [
      {
        label: 'Income',
        options: CATEGORIES.income.map((c) => ({
          value: c,
          label: `${CATEGORY_ICONS[c]} ${c}`,
        })),
      },
      {
        label: 'Expenses',
        options: CATEGORIES.expense.map((c) => ({
          value: c,
          label: `${CATEGORY_ICONS[c]} ${c}`,
        })),
      },
    ],
    [],
  )

  const monthSelectOptions = useMemo(() => {
    const head = [{ value: 'all', label: 'All Months (in scope)' }]
    return head.concat(
      months.map((m) => {
        const [y, mo] = m.split('-')
        const label = new Date(+y, +mo - 1).toLocaleString(
          'default',
          { month: 'long', year: 'numeric' },
        )
        return { value: m, label }
      }),
    )
  }, [months])

  const filtered = useMemo(() => {
    let list = [...scopedTransactions]

    if (deferredSearch) {
      const q = deferredSearch.toLowerCase()
      list = list.filter((t) =>
        t.description.toLowerCase().includes(q) ||
        t.merchant?.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q))
    }
    if (filters.category !== 'all') {
      list = list.filter((t) => t.category === filters.category)
    }
    if (filters.type !== 'all') {
      list = list.filter((t) => t.type === filters.type)
    }
    if (filters.monthFilter !== 'all') {
      list = list.filter((t) => t.date.startsWith(filters.monthFilter))
    }

    list.sort((a, b) => {
      let va; let vb
      if (filters.sortBy === 'date') { va = a.date; vb = b.date }
      else if (filters.sortBy === 'amount') { va = a.amount; vb = b.amount }
      else if (filters.sortBy === 'description') {
        va = a.description.toLowerCase()
        vb = b.description.toLowerCase()
      }
      else if (filters.sortBy === 'category') { va = a.category; vb = b.category }
      else { va = a.date; vb = b.date }

      if (va < vb) return filters.sortOrder === 'asc' ? -1 : 1
      if (va > vb) return filters.sortOrder === 'asc' ? 1 : -1
      return 0
    })

    return list
  }, [scopedTransactions, filters, deferredSearch])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleSort = (field) => {
    if (filters.sortBy === field) {
      setFilters({ sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' })
    } else {
      setFilters({ sortBy: field, sortOrder: 'desc' })
    }
    setPage(1)
  }

  const handleFilterChange = (key, val) => {
    setFilters({ [key]: val })
    setPage(1)
  }

  const handleReset = () => {
    resetFilters()
    setPage(1)
  }

  const handleDelete = (id) => {
    if (deleteConfirm === id) {
      deleteTransaction(id)
      setDeleteConfirm(null)
    } else {
      setDeleteConfirm(id)
      setTimeout(() => setDeleteConfirm(null), 3000)
    }
  }

  const openAdd = () => { setEditData(null); setModalOpen(true) }
  const openEdit = (txn) => { setEditData(txn); setModalOpen(true) }
  const closeModal = () => { setModalOpen(false); setEditData(null) }

  const filteredIncome = filtered.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const filteredExpense = filtered.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)

  const pageNums = []
  for (let i = 1; i <= totalPages; i++) pageNums.push(i)
  const visiblePages = pageNums.filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
  )

  const pageButtons = useMemo(() => {
    const out = []
    visiblePages.forEach((p, i) => {
      const prev = visiblePages[i - 1]
      if (prev !== undefined && p - prev > 1) {
        out.push({ kind: 'ellipsis', key: `ellipsis-${p}-after-${prev}` })
      }
      out.push({ kind: 'page', p, key: `page-${p}` })
    })
    return out
  }, [visiblePages])

  const periodLabel = getReportPeriodLabel(state.reportPeriod)
  const hasColumnFilters =
    filters.search ||
    filters.category !== 'all' ||
    filters.type !== 'all' ||
    filters.monthFilter !== 'all'

  const exportTitle =
    'Download rows that match the current report period, table search, and filters (CSV columns: Date, Description, Category, Type, Amount, Merchant).'

  return (
    <div>
      <div className="page-header animate-fade-up">
        <div>
          <div className="page-title">Transactions</div>
          <div className="page-desc">
            <strong>{periodLabel}</strong>
            {' · '}
            {filtered.length} match{filtered.length !== 1 ? 'es' : ''}
            {hasColumnFilters ? ' (filters on)' : ''}
            {scopedTransactions.length !== transactions.length && (
              <span className="page-desc-scope">
                {' '}
                · {scopedTransactions.length} in scope vs {transactions.length} total
              </span>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => exportToCSV(filtered)}
            title={exportTitle}
          >
            <Download size={15} /> CSV
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => exportToJSON(filtered)}
            title={exportTitle}
          >
            <Download size={15} /> JSON
          </button>
          {canAdd && (
            <button type="button" className="btn btn-primary" onClick={openAdd}>
              <Plus size={15} /> Add Transaction
            </button>
          )}
        </div>
      </div>

      <div className="card animate-fade-up-1" style={{ marginBottom: 16, padding: '14px 16px' }}>
        <div className="transactions-filters">
          <div className="search-input-wrap">
            <Search className="search-icon" />
            <input
              className="search-input"
              type="search"
              placeholder="Search transactions…"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              aria-label="Search transactions"
            />
          </div>

          <div className="filter-btn-group">
            {['all', 'income', 'expense'].map((t) => (
              <button
                type="button"
                key={t}
                className={`filter-btn ${filters.type === t ? 'active' : ''}`}
                onClick={() => handleFilterChange('type', t)}
              >
                {t === 'all' ? 'All' : t === 'income' ? '↑ Income' : '↓ Expense'}
              </button>
            ))}
          </div>

          <CustomSelect
            ariaLabel="Filter by category"
            value={filters.category}
            onChange={(v) => handleFilterChange('category', v)}
            options={[{ value: 'all', label: 'All Categories' }]}
            groups={categoryGroups}
            triggerClassName="filter-select"
          />

          <CustomSelect
            ariaLabel="Filter by month"
            value={filters.monthFilter}
            onChange={(v) => handleFilterChange('monthFilter', v)}
            options={monthSelectOptions}
            triggerClassName="filter-select"
          />

          <button type="button" className="btn btn-secondary" onClick={handleReset} title="Reset filters">
            <RefreshCw size={14} />
          </button>
        </div>

        {hasColumnFilters && (
          <div className="filter-chips" role="toolbar" aria-label="Active filters">
            {filters.search && (
              <button
                type="button"
                className="filter-chip"
                onClick={() => handleFilterChange('search', '')}
              >
                Search: {filters.search}
                <X size={12} aria-hidden />
              </button>
            )}
            {filters.type !== 'all' && (
              <button
                type="button"
                className="filter-chip"
                onClick={() => handleFilterChange('type', 'all')}
              >
                Type: {filters.type}
                <X size={12} aria-hidden />
              </button>
            )}
            {filters.category !== 'all' && (
              <button
                type="button"
                className="filter-chip"
                onClick={() => handleFilterChange('category', 'all')}
              >
                {CATEGORY_ICONS[filters.category]} {filters.category}
                <X size={12} aria-hidden />
              </button>
            )}
            {filters.monthFilter !== 'all' && (
              <button
                type="button"
                className="filter-chip"
                onClick={() => handleFilterChange('monthFilter', 'all')}
              >
                Month: {filters.monthFilter}
                <X size={12} aria-hidden />
              </button>
            )}
          </div>
        )}

        <div
          className="txn-summary-bar"
          style={{
            display: 'flex',
            gap: 20,
            paddingTop: 10,
            borderTop: '1px solid var(--border)',
            marginTop: 4,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Showing</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{filtered.length}</span>
            <span style={{ color: 'var(--text-muted)' }}>of {scopedTransactions.length} in period</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem' }}>
            <ArrowUpRight size={12} color="var(--income)" />
            <span className="tabular-nums" style={{ color: 'var(--income)', fontWeight: 600 }}>
              {formatCurrency(filteredIncome)}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem' }}>
            <ArrowDownRight size={12} color="var(--expense)" />
            <span className="tabular-nums" style={{ color: 'var(--expense)', fontWeight: 600 }}>
              {formatCurrency(filteredExpense)}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Net:</span>
            <span
              className="tabular-nums"
              style={{
                color: filteredIncome - filteredExpense >= 0 ? 'var(--income)' : 'var(--expense)',
                fontWeight: 600,
              }}
            >
              {formatCurrency(filteredIncome - filteredExpense)}
            </span>
          </div>
        </div>
      </div>

      <div className="animate-fade-up-2">
        {filtered.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <div className="empty-title">No transactions found</div>
              <div className="empty-desc">
                Try adjusting filters or widening the report period in the header.
              </div>
              <button type="button" className="btn btn-secondary" style={{ marginTop: 16 }} onClick={handleReset}>
                <RefreshCw size={14} /> Clear Filters
              </button>
            </div>
          </div>
        ) : (
          <div className="txn-table-wrap">
            <table className="txn-table">
              <thead>
                <tr>
                  <SortTh
                    field="date"
                    sortBy={filters.sortBy}
                    sortOrder={filters.sortOrder}
                    onSort={handleSort}
                    width={120}
                  >
                    Date
                  </SortTh>
                  <SortTh
                    field="description"
                    sortBy={filters.sortBy}
                    sortOrder={filters.sortOrder}
                    onSort={handleSort}
                  >
                    Description
                  </SortTh>
                  <SortTh
                    field="category"
                    sortBy={filters.sortBy}
                    sortOrder={filters.sortOrder}
                    onSort={handleSort}
                    width={180}
                  >
                    Category
                  </SortTh>
                  <th scope="col" style={{ width: 110 }}>Type</th>
                  <SortTh
                    field="amount"
                    sortBy={filters.sortBy}
                    sortOrder={filters.sortOrder}
                    onSort={handleSort}
                    width={140}
                    align="right"
                  >
                    Amount
                  </SortTh>
                  {canEdit && <th scope="col" style={{ width: 90 }}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {paginated.map((txn, i) => (
                  <tr
                    key={txn.id}
                    style={{ animation: `fadeSlideUp 0.25s ease ${i * 0.03}s both` }}
                  >
                    <td>
                      <div style={{ fontSize: '0.82rem', fontWeight: 500 }}>
                        {formatDate(txn.date).split(',')[0]}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {txn.date.split('-')[0]}
                      </div>
                    </td>
                    <td>
                      <div className="txn-description">{txn.description}</div>
                      <div className="txn-merchant">{txn.merchant}</div>
                    </td>
                    <td>
                      <span className="txn-category-tag">
                        {CATEGORY_ICONS[txn.category]} {txn.category}
                      </span>
                    </td>
                    <td>
                      <span className={`txn-type-badge ${txn.type}`}>
                        {txn.type === 'income'
                          ? <><ArrowUpRight size={11} /> Income</>
                          : <><ArrowDownRight size={11} /> Expense</>}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span className={`txn-amount tabular-nums ${txn.type}`}>
                        {txn.type === 'income' ? '+' : '-'}{formatCurrency(txn.amount)}
                      </span>
                    </td>
                    {canEdit && (
                      <td>
                        <div className="txn-actions">
                          <button
                            type="button"
                            className="btn btn-icon"
                            onClick={() => openEdit(txn)}
                            title="Edit"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            type="button"
                            className={`btn btn-icon ${deleteConfirm === txn.id ? 'btn-danger' : ''}`}
                            onClick={() => handleDelete(txn.id)}
                            title={deleteConfirm === txn.id ? 'Click again to confirm' : 'Delete'}
                            style={deleteConfirm === txn.id ? {
                              background: 'var(--expense-subtle)',
                              color: 'var(--expense)',
                              border: '1px solid rgba(248,113,113,0.3)',
                            } : {}}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pagination">
              <div>
                Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–
                {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
              </div>
              <div className="pagination-btns">
                <button
                  type="button"
                  className="page-btn"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  ‹
                </button>
                {pageButtons.map((item) => (
                  item.kind === 'ellipsis' ? (
                    <span key={item.key} className="page-ellipsis" aria-hidden>…</span>
                  ) : (
                    <button
                      type="button"
                      key={item.key}
                      className={`page-btn ${page === item.p ? 'active' : ''}`}
                      onClick={() => setPage(item.p)}
                    >
                      {item.p}
                    </button>
                  )
                ))}
                <button
                  type="button"
                  className="page-btn"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {!canAdd && (
        <div
          className="viewer-notice"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 14px',
            background: 'var(--accent-subtle)',
            border: '1px solid var(--border-accent)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.78rem',
            color: 'var(--accent)',
            marginTop: 12,
          }}
        >
          You are in <strong>Viewer</strong> mode — switch to Admin in the sidebar to add or edit.
        </div>
      )}

      {modalOpen && <TransactionModal editData={editData} onClose={closeModal} />}
    </div>
  )
}
