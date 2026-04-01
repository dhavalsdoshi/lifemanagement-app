import StarRating from './StarRating'

/**
 * Renders the appropriate input element for a column's type.
 *
 * Used by both RowForm (bottom-sheet form) and CellEditor (inline table editing).
 * Callers control styling via `className` and `style`.
 *
 * Props:
 *   col        — column config { key, type?, options? }
 *   value      — current value string
 *   onChange   — (newValue: string) => void
 *   onCommit?  — called on blur or Enter; for select, called with new value immediately
 *   onCancel?  — called on Escape
 *   inputRef?  — ref forwarded to the underlying input/textarea/select element
 *   className  — CSS classes applied to the element
 *   style      — inline styles applied to the element
 *   rows       — number of rows for textarea (default: 4)
 */
export default function FieldInput({
  col,
  value,
  onChange,
  onCommit,
  onCancel,
  inputRef,
  className = '',
  style,
  rows = 4,
}) {
  const type = col.type || 'text'

  function handleKeyDown(e) {
    if (e.key === 'Escape') { e.preventDefault(); onCancel?.() }
    if (e.key === 'Enter' && type !== 'textarea') { e.preventDefault(); onCommit?.() }
  }

  if (type === 'rating') {
    return <StarRating value={value} onChange={onChange} />
  }

  if (type === 'textarea') {
    return (
      <textarea
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => onCommit?.()}
        onKeyDown={handleKeyDown}
        rows={rows}
        style={style}
        className={`${className} resize-none`}
      />
    )
  }

  if (type === 'select') {
    return (
      <select
        ref={inputRef}
        value={value}
        onChange={(e) => { onChange(e.target.value); onCommit?.(e.target.value) }}
        onKeyDown={handleKeyDown}
        style={style}
        className={className}
      >
        <option value="">—</option>
        {(col.options || []).map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    )
  }

  return (
    <input
      ref={inputRef}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={() => onCommit?.()}
      onKeyDown={handleKeyDown}
      style={style}
      className={className}
    />
  )
}
