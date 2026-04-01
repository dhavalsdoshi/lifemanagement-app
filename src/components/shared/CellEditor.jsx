import { useRef, useEffect } from 'react'
import FieldInput from './FieldInput'

// Renders the appropriate input for a column's type, with auto-focus.
// col shape: { key, header, type?, options? }
export default function CellEditor({ col, value, onChange, onCommit, onCancel }) {
  const inputRef = useRef(null)

  // Use setTimeout to reliably trigger the virtual keyboard on iOS
  useEffect(() => {
    const id = setTimeout(() => inputRef.current?.focus(), 0)
    return () => clearTimeout(id)
  }, [])

  const inputClass =
    'w-full px-2 py-2 border border-primary rounded focus:outline-none focus:ring-1 focus:ring-primary bg-white dark:bg-gray-800 dark:text-gray-100'

  return (
    <FieldInput
      col={col}
      value={value}
      onChange={onChange}
      onCommit={onCommit}
      onCancel={onCancel}
      inputRef={inputRef}
      className={inputClass}
      style={{ fontSize: '16px' }}
      rows={3}
    />
  )
}
