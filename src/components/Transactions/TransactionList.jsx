import { useState, useMemo } from 'react'
import { useApp } from '../../context/AppContext'
import TransactionModal from './TransactionModal'
import { CATEGORIES, CATEGORY_ICONS } from '../../data/mockData'
import { formatCurrency, formatDate, exportToCSV, exportToJSON } from '../../utils/helpers'
import {
  Search, Plus, Trash2, Edit2, Download, RefreshCw,
  ChevronUp, ChevronDown, ChevronsUpDown, Filter,
  ArrowUpRight, ArrowDownRight,
} from 'lucide-react'

const PAGE_SIZE = 10

function SortIcon({ field, sortBy, sortOrder }) {
  if (sortBy !== field) return <ChevronsUpDown size={12} style={{ opacity: 0.3, marginLeft: 4 }} />
  return sortOrder === 'asc'
    ? <ChevronUp size={12} style={{ marginLeft: 4, color: 'var(--accent)' }} />
    : <ChevronDown size={12} style={{ marginLeft: 4, color: 'var(--accent)' }} />
}

export default function TransactionList() {
  const { state, setFilters, resetFilters, deleteTransaction, showToast } = useApp()
  const { transactions, filters, role } = state

  const [modalOpen, setModalOpen] = useState(false)
  const [editData, setEditData] = useState(null)
  const [page, setPage] = useState(1)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const canEdit = role === 'admin'
  const canAdd = role === 'admin'

  // All categories flat list for filter dropdown
  const allCategories = [...CATEGORIES.income, ...CATEGORIES.expense]

  // All months from transactions for filter
  const months = useMemo(() => {
    const set = new Set(transactions.map(t => t.date.substring(0, 7)))
    return [...set].sort().reverse()
  }, [transactions])

  // Filtering + sorting
  const filtered = useMemo(() => {
    let list = [...transactions]

    if (filters.search) {
      const q = filters.search.toLowerCase()
      list = list.filter(t =>
        t.description.toLowerCase().includes(q) ||
        t.merchant?.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      )
    }
    if (filters.category !== 'all') {
      list = list.filter(t => t.category === filters.category)
    }
    if (filters.type !== 'all') {
      list = list.filter(t => t.type === filters.type)
    }
    if (filters.monthFilter !== 'all') {
      list = list.filter(t => t.date.startsWith(filters.monthFilter))
    }

    // Sort
    list.sort((a, b) => {
      let va, vb
      if (filters.sortBy === 'date') { va = a.date; vb = b.date }
      else if (filters.sortBy === 'amount') { va = a.amount; vb = b.amount }
      else if (filters.sortBy === 'description') { va = a.description.toLowerCase(); vb = b.description.toLowerCase() }
      else if (filters.sortBy === 'category') { va = a.category; vb = b.category }
      else { va = a.date; vb = b.date }

      if (va < vb) return filters.sortOrder === 'asc' ? -1 : 1
      if (va > vb) return filters.sortOrder === 'asc' ? 1 : -1
      return 0
    })

    return list
  }, [transactions, filters])

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

  // Summary of filtered
  const filteredIncome = filtered.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const filteredExpense = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)

  const pageNums = []
  for (let i = 1; i <= totalPages; i++) pageNums.push(i)
  const visiblePages = pageNums.filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)

  return (
    <div>
      {/* Page header */}
      <div className="page-header animate-fade-up">
        <div>
          <div className="page-title">Transactions</div>
          <div className="page-desc">
            {filtered.length} transaction{filtered.length !== 1 ? 's' : ''} found
            {filters.search || filters.category !== 'all' || filters.type !== 'all' || filters.monthFilter !== 'all'
              ? ' (filtered)' : ''}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={() => exportToCSV(filtered)} title="Export CSV">
            <Download size={15} /> CSV
          </button>
          <button className="btn btn-secondary" onClick={() => exportToJSON(filtered)} title="Export JSON">
            <Download size={15} /> JSON
          </button>
          {canAdd && (
            <button className="btn btn-primary" onClick={openAdd}>
              <Plus size={15} /> Add Transaction
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="card animate-fade-up-1" style={{ marginBottom: 16, padding: '14px 16px' }}>
        <div className="transactions-filters">
          {/* Search */}
          <div className="search-input-wrap">
            <Search className="search-icon" />
            <input
              className="search-input"
              type="text"
              placeholder="Search transactions..."
              value={filters.search}
              onChange={e => handleFilterChange('search', e.target.value)}
            />
          </div>

          {/* Type filter */}
          <div className="filter-btn-group">
            {['all', 'income', 'expense'].map(t => (
              <button
                key={t}
                className={`filter-btn ${filters.type === t ? 'active' : ''}`}
                onClick={() => handleFilterChange('type', t)}
              >
                {t === 'all' ? 'All' : t === 'income' ? '↑ Income' : '↓ Expense'}
              </button>
            ))}
          </div>

          {/* Category filter */}
          <select
            className="filter-select"
            value={filters.category}
            onChange={e => handleFilterChange('category', e.target.value)}
            style={{ minWidth: 160 }}
          >
            <option value="all">All Categories</option>
            <optgroup label="Income">
              {CATEGORIES.income.map(c => <option key={c} value={c}>{CATEGORY_ICONS[c]} {c}</option>)}
            </optgroup>
            <optgroup label="Expenses">
              {CATEGORIES.expense.map(c => <option key={c} value={c}>{CATEGORY_ICONS[c]} {c}</option>)}
            </optgroup>
          </select>

          {/* Month filter */}
          <select
            className="filter-select"
            value={filters.monthFilter}
            onChange={e => handleFilterChange('monthFilter', e.target.value)}
          >
            <option value="all">All Months</option>
            {months.map(m => {
              const [y, mo] = m.split('-')
              const label = new Date(+y, +mo - 1).toLocaleString('default', { month: 'long', year: 'numeric' })
              return <option key={m} value={m}>{label}</option>
            })}
          </select>

          {/* Reset */}
          <button className="btn btn-secondary" onClick={handleReset} title="Reset filters">
            <RefreshCw size={14} />
          </button>
        </div>

        {/* Filter summary bar */}
        <div style={{ display: 'flex', gap: 20, paddingTop: 10, borderTop: '1px solid var(--border)', marginTop: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Showing</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{filtered.length}</span>
            <span style={{ color: 'var(--text-muted)' }}>of {transactions.length}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem' }}>
            <ArrowUpRight size={12} color="var(--income)" />
            <span style={{ color: 'var(--income)', fontWeight: 600 }}>{formatCurrency(filteredIncome)}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem' }}>
            <ArrowDownRight size={12} color="var(--expense)" />
            <span style={{ color: 'var(--expense)', fontWeight: 600 }}>{formatCurrency(filteredExpense)}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Net:</span>
            <span style={{
              color: filteredIncome - filteredExpense >= 0 ? 'var(--income)' : 'var(--expense)',
              fontWeight: 600,
            }}>
              {formatCurrency(filteredIncome - filteredExpense)}
            </span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="animate-fade-up-2">
        {filtered.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <div className="empty-title">No transactions found</div>
              <div className="empty-desc">
                Try adjusting your filters or search query
              </div>
              <button className="btn btn-secondary" style={{ marginTop: 16 }} onClick={handleReset}>
                <RefreshCw size={14} /> Clear Filters
              </button>
            </div>
          </div>
        ) : (
          <div className="txn-table-wrap">
            <table className="txn-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('date')} style={{ width: 120 }}>
                    Date <SortIcon field="date" sortBy={filters.sortBy} sortOrder={filters.sortOrder} />
                  </th>
                  <th onClick={() => handleSort('description')}>
                    Description <SortIcon field="description" sortBy={filters.sortBy} sortOrder={filters.sortOrder} />
                  </th>
                  <th onClick={() => handleSort('category')} style={{ width: 180 }}>
                    Category <SortIcon field="category" sortBy={filters.sortBy} sortOrder={filters.sortOrder} />
                  </th>
                  <th style={{ width: 110 }}>Type</th>
                  <th onClick={() => handleSort('amount')} style={{ width: 140, textAlign: 'right' }}>
                    Amount <SortIcon field="amount" sortBy={filters.sortBy} sortOrder={filters.sortOrder} />
                  </th>
                  {canEdit && <th style={{ width: 90 }}>Actions</th>}
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
                      <span className={`txn-amount ${txn.type}`}>
                        {txn.type === 'income' ? '+' : '-'}{formatCurrency(txn.amount)}
                      </span>
                    </td>
                    {canEdit && (
                      <td>
                        <div className="txn-actions">
                          <button
                            className="btn btn-icon"
                            onClick={() => openEdit(txn)}
                            title="Edit"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
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

            {/* Pagination */}
            <div className="pagination">
              <div>
                Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
              </div>
              <div className="pagination-btns">
                <button
                  className="page-btn"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  ‹
                </button>
                {visiblePages.map((p, i) => {
                  const prev = visiblePages[i - 1]
                  return (
                    <>
                      {prev && p - prev > 1 && (
                        <button key={`ellipsis-${p}`} className="page-btn" disabled style={{ border: 'none', background: 'transparent' }}>
                          …
                        </button>
                      )}
                      <button
                        key={p}
                        className={`page-btn ${page === p ? 'active' : ''}`}
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </button>
                    </>
                  )
                })}
                <button
                  className="page-btn"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Viewer notice */}
      {!canAdd && (
        <div style={{
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
        }}>
          👁️ You are in <strong>Viewer</strong> mode — switch to Admin to add or edit transactions
        </div>
      )}

      {modalOpen && <TransactionModal editData={editData} onClose={closeModal} />}
    </div>
  )
}
