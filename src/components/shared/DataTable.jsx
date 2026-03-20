import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import CellEditor from './CellEditor'

export function formatCellValue(col, value) {
  if (!value) return ''
  if (col.type === 'date') {
    try {
      const d = new Date(value + 'T00:00:00')
      if (isNaN(d)) return value
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    } catch {
      return value
    }
  }
  return String(value)
}

export default function DataTable({ columns, rows, onUpdate, onDelete }) {
  const [search, setSearch] = useState('')
  const [editingCell, setEditingCell] = useState(null) // { rowId, colKey }
  const [editValue, setEditValue] = useState('')

  const filtered = rows.filter((row) =>
    columns.some((col) =>
      String(row[col.key] ?? '').toLowerCase().includes(search.toLowerCase())
    )
  )

  function startEdit(rowId, colKey, value) {
    setEditingCell({ rowId, colKey })
    setEditValue(value ?? '')
  }

  function commitEdit(newValue) {
    if (editingCell) {
      onUpdate(editingCell.rowId, editingCell.colKey, newValue !== undefined ? newValue : editValue)
      setEditingCell(null)
    }
  }

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              {columns.map((col) => (
                <th key={col.key} className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                  {col.header}
                </th>
              ))}
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="py-8 text-center text-gray-400">
                  No data yet. Add a row to get started.
                </td>
              </tr>
            ) : (
              filtered.map((row) => (
                <tr key={row.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  {columns.map((col) => (
                    <td key={col.key} className="py-2 px-4">
                      {editingCell?.rowId === row.id && editingCell?.colKey === col.key ? (
                        <CellEditor
                          col={col}
                          value={editValue}
                          onChange={setEditValue}
                          onCommit={commitEdit}
                          onCancel={() => setEditingCell(null)}
                        />
                      ) : (
                        <span
                          onClick={() => startEdit(row.id, col.key, row[col.key])}
                          className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 px-2 py-1 rounded block min-h-[28px] truncate max-w-xs"
                          title={col.type === 'textarea' ? (row[col.key] || '') : undefined}
                        >
                          {formatCellValue(col, row[col.key]) || '\u00A0'}
                        </span>
                      )}
                    </td>
                  ))}
                  <td className="py-2 px-2">
                    <button
                      onClick={() => onDelete(row.id)}
                      aria-label="Delete row"
                      className="p-1 text-gray-400 hover:text-danger rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
