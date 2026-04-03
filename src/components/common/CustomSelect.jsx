import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'

const VIEW_MARGIN = 12
const GAP = 8
const DEFAULT_MAX_HEIGHT = 320

function labelForValue(value, topOptions, groups, placeholder) {
  if (value === '' || value === undefined) {
    return placeholder ?? ''
  }
  for (const o of topOptions || []) {
    if (o.value === value) return o.label
  }
  if (groups) {
    for (const g of groups) {
      const o = g.options.find((x) => x.value === value)
      if (o) return o.label
    }
  }
  return placeholder ?? String(value)
}

function computeMenuStyle(triggerRect) {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const maxW = vw - 2 * VIEW_MARGIN
  const width = Math.min(Math.max(triggerRect.width, 120), maxW)

  let left = triggerRect.left
  if (left + width > vw - VIEW_MARGIN) {
    left = vw - VIEW_MARGIN - width
  }
  if (left < VIEW_MARGIN) left = VIEW_MARGIN

  const spaceBelow = vh - triggerRect.bottom - VIEW_MARGIN - GAP
  const spaceAbove = triggerRect.top - VIEW_MARGIN - GAP
  const openUp =
    spaceBelow < 120 && spaceAbove > spaceBelow

  let top
  let bottom
  let maxHeight

  if (openUp) {
    maxHeight = Math.min(DEFAULT_MAX_HEIGHT, spaceAbove)
    bottom = vh - triggerRect.top + GAP
  } else {
    top = triggerRect.bottom + GAP
    maxHeight = Math.min(DEFAULT_MAX_HEIGHT, spaceBelow)
  }

  return {
    position: 'fixed',
    left,
    width,
    maxHeight,
    ...(openUp ? { bottom } : { top }),
  }
}

export default function CustomSelect({
  id: idProp,
  ariaLabel,
  ariaLabelledBy = null,
  value,
  onChange,
  options = [],
  groups = null,
  placeholder = null,
  triggerClassName = '',
  disabled = false,
  title: titleProp,
  listClassName = '',
}) {
  const [open, setOpen] = useState(false)
  const [menuStyle, setMenuStyle] = useState(() => ({}))
  const triggerRef = useRef(null)
  const menuRef = useRef(null)
  const uid = useId()
  const listId = idProp ? `${idProp}-listbox` : `ls-${uid}`
  const buttonId = idProp || `sel-${uid}`

  const topOptions = useMemo(() => options || [], [options])

  const displayLabel = useMemo(
    () => labelForValue(value, topOptions, groups, placeholder),
    [value, topOptions, groups, placeholder],
  )

  const reposition = useCallback(() => {
    const t = triggerRef.current
    if (!t) return
    const r = t.getBoundingClientRect()
    setMenuStyle(computeMenuStyle(r))
  }, [])

  useLayoutEffect(() => {
    if (!open) return
    reposition()
    const t = triggerRef.current
    if (!t) return
    const ro = new ResizeObserver(reposition)
    ro.observe(t)
    window.addEventListener('resize', reposition)
    window.addEventListener('scroll', reposition, true)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', reposition)
      window.removeEventListener('scroll', reposition, true)
    }
  }, [open, reposition])

  useEffect(() => {
    if (!open) return
    const onDoc = (e) => {
      const tr = triggerRef.current
      const m = menuRef.current
      if (tr?.contains(e.target) || m?.contains(e.target)) return
      setOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('pointerdown', onDoc, true)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDoc, true)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const pick = (v) => {
    onChange(v)
    setOpen(false)
    triggerRef.current?.focus()
  }

  const renderOption = (opt) => {
    const selected = opt.value === value
    return (
      <button
        key={String(opt.value)}
        type="button"
        role="option"
        aria-selected={selected}
        className={`custom-select-option${selected ? ' custom-select-option--active' : ''}`}
        onClick={() => pick(opt.value)}
      >
        {opt.label}
      </button>
    )
  }

  const menu = open && !disabled && (
    <div
      ref={menuRef}
      id={listId}
      className={`custom-select-menu${listClassName ? ` ${listClassName}` : ''}`}
      style={menuStyle}
      role="listbox"
      {...(ariaLabelledBy
        ? { 'aria-labelledby': ariaLabelledBy }
        : { 'aria-label': ariaLabel || 'Options' })}
    >
      {topOptions.map((opt) => renderOption(opt))}
      {groups?.map((g) => (
        <div key={g.label} className="custom-select-group">
          <div className="custom-select-group-label" role="presentation">
            {g.label}
          </div>
          {g.options.map((opt) => renderOption(opt))}
        </div>
      ))}
    </div>
  )

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        id={buttonId}
        className={triggerClassName}
        disabled={disabled}
        title={titleProp}
        aria-label={ariaLabelledBy ? undefined : ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => !disabled && setOpen((o) => !o)}
      >
        <span className="custom-select-trigger-label">{displayLabel}</span>
      </button>
      {typeof document !== 'undefined' && menu
        ? createPortal(menu, document.body)
        : null}
    </>
  )
}
