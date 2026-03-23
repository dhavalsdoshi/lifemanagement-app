import { useRef, useEffect } from 'react'

// Renders the appropriate input for a column's type.
// col shape: { key, header, type?, options? }
// type: 'text' (default) | 'date' | 'textarea' | 'number' | 'url' | 'select'
export default function CellEditor({ col, value, onChange, onCommit, onCancel }) {
  const type = col.type || 'text'
  const inputRef = useRef(null)

  // Use setTimeout to reliably trigger the virtual keyboard on iOS
  useEffect(() => {
    const id = setTimeout(() => inputRef.current?.focus(), 0)
    return () => clearTimeout(id)
  }, [])

  function handleKeyDown(e) {
    if (e.key === 'Escape') { e.preventDefault(); onCancel() }
    if (e.key === 'Enter' && type !== 'textarea') { e.preventDefault(); onCommit() }
  }

  const inputClass =
    'w-full px-2 py-2 border border-primary rounded focus:outline-none focus:ring-1 focus:ring-primary bg-white dark:bg-gray-800 dark:text-gray-100'

  // font-size 16px prevents iOS Safari from auto-zooming on input focus
  const mobileStyle = { fontSize: '16px' }

  if (type === 'textarea') {
    return (
      <textarea
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => onCommit()}
        onKeyDown={handleKeyDown}
        rows={3}
        style={mobileStyle}
        className={`${inputClass} resize-none`}
      />
    )
  }

  if (type === 'select') {
    return (
      <select
        ref={inputRef}
        value={value}
        onChange={(e) => { onChange(e.target.value); onCommit(e.target.value) }}
        onKeyDown={handleKeyDown}
        style={mobileStyle}
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
      ref={inputRef}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={() => onCommit()}
      onKeyDown={handleKeyDown}
      style={mobileStyle}
      className={inputClass}
    />
  )
}
