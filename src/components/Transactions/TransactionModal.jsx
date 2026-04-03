import { useState, useEffect, useMemo } from 'react'
import { useApp } from '../../context/AppContext'
import { CATEGORIES, CATEGORY_ICONS } from '../../data/mockData'
import CustomSelect from '../common/CustomSelect'
import { X, TrendingUp, TrendingDown } from 'lucide-react'

const EMPTY_FORM = {
  description: '',
  category: '',
  type: 'expense',
  amount: '',
  date: new Date().toISOString().split('T')[0],
  merchant: '',
  notes: '',
}

export default function TransactionModal({ editData, onClose }) {
  const { addTransaction, editTransaction } = useApp()
  const isEdit = Boolean(editData)

  const [form, setForm] = useState(isEdit ? { ...editData, amount: String(editData.amount) } : EMPTY_FORM)
  const [errors, setErrors] = useState({})

  const categories = form.type === 'income' ? CATEGORIES.income : CATEGORIES.expense

  const categoryOptions = useMemo(
    () => [
      { value: '', label: 'Select a category...' },
      ...categories.map((c) => ({
        value: c,
        label: `${CATEGORY_ICONS[c]} ${c}`,
      })),
    ],
    [categories],
  )

  useEffect(() => {
    // Reset category when type changes if current category doesn't match
    const validCats = form.type === 'income' ? CATEGORIES.income : CATEGORIES.expense
    if (!validCats.includes(form.category)) {
      setForm(f => ({ ...f, category: '' }))
    }
  }, [form.type])

  const set = (field, value) => {
    setForm(f => ({ ...f, [field]: value }))
    if (errors[field]) setErrors(e => ({ ...e, [field]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.description.trim()) e.description = 'Description is required'
    if (!form.category) e.category = 'Category is required'
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0)
      e.amount = 'Enter a valid amount'
    if (!form.date) e.date = 'Date is required'
    return e
  }

  const handleSubmit = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }

    const payload = {
      ...form,
      amount: parseFloat(parseFloat(form.amount).toFixed(2)),
    }

    if (isEdit) {
      editTransaction(payload)
    } else {
      addTransaction(payload)
    }
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title">
            {isEdit ? '✏️ Edit Transaction' : '✨ Add Transaction'}
          </div>
          <button className="btn-icon btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          {/* Type toggle */}
          <div className="form-group">
            <label className="form-label">Transaction Type</label>
            <div className="type-toggle">
              <button
                className={`type-toggle-btn income ${form.type === 'income' ? 'active' : ''}`}
                onClick={() => set('type', 'income')}
              >
                <TrendingUp size={14} /> Income
              </button>
              <button
                className={`type-toggle-btn expense ${form.type === 'expense' ? 'active' : ''}`}
                onClick={() => set('type', 'expense')}
              >
                <TrendingDown size={14} /> Expense
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Description</label>
            <input
              className="form-input"
              type="text"
              placeholder="e.g. Monthly Salary, Netflix subscription..."
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
            />
            {errors.description && (
              <div style={{ fontSize: '0.75rem', color: 'var(--expense)', marginTop: 4 }}>
                {errors.description}
              </div>
            )}
          </div>

          {/* Amount + Date row */}
          <div className="form-row">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Amount (USD)</label>
              <input
                className="form-input"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={form.amount}
                onChange={(e) => set('amount', e.target.value)}
              />
              {errors.amount && (
                <div style={{ fontSize: '0.75rem', color: 'var(--expense)', marginTop: 4 }}>
                  {errors.amount}
                </div>
              )}
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Date</label>
              <input
                className="form-input"
                type="date"
                value={form.date}
                onChange={(e) => set('date', e.target.value)}
              />
              {errors.date && (
                <div style={{ fontSize: '0.75rem', color: 'var(--expense)', marginTop: 4 }}>
                  {errors.date}
                </div>
              )}
            </div>
          </div>

          {/* Category */}
          <div className="form-group" style={{ marginTop: 16 }}>
            <label className="form-label" id="txn-modal-category-label" htmlFor="txn-modal-category">
              Category
            </label>
            <CustomSelect
              id="txn-modal-category"
              ariaLabelledBy="txn-modal-category-label"
              value={form.category}
              onChange={(v) => set('category', v)}
              options={categoryOptions}
              triggerClassName="form-select"
            />
            {errors.category && (
              <div style={{ fontSize: '0.75rem', color: 'var(--expense)', marginTop: 4 }}>
                {errors.category}
              </div>
            )}
          </div>

          {/* Merchant */}
          <div className="form-group">
            <label className="form-label">Merchant / Source</label>
            <input
              className="form-input"
              type="text"
              placeholder="e.g. Amazon, TechCorp Inc..."
              value={form.merchant}
              onChange={(e) => set('merchant', e.target.value)}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            {isEdit ? 'Save Changes' : 'Add Transaction'}
          </button>
        </div>
      </div>
    </div>
  )
}
