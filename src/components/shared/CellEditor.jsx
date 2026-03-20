// Renders the appropriate input for a column's type.
// col shape: { key, header, type?, options? }
// type: 'text' (default) | 'date' | 'textarea' | 'number' | 'url' | 'select'
export default function CellEditor({ col, value, onChange, onCommit, onCancel }) {
  const type = col.type || 'text'

  function handleKeyDown(e) {
    if (e.key === 'Escape') { e.preventDefault(); onCancel() }
    if (e.key === 'Enter' && type !== 'textarea') { e.preventDefault(); onCommit() }
  }

  const inputClass =
    'w-full px-2 py-1 border border-primary rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-white dark:bg-gray-800 dark:text-gray-100'

  if (type === 'textarea') {
    return (
      <textarea
        autoFocus
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => onCommit()}
        onKeyDown={handleKeyDown}
        rows={3}
        className={`${inputClass} resize-none`}
      />
    )
  }

  if (type === 'select') {
    return (
      <select
        autoFocus
        value={value}
        onChange={(e) => { onChange(e.target.value); onCommit(e.target.value) }}
        onKeyDown={handleKeyDown}
        className={inputClass}
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
      autoFocus
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={() => onCommit()}
      onKeyDown={handleKeyDown}
      className={inputClass}
    />
  )
}
