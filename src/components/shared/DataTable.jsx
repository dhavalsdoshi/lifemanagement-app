import { useState } from 'react'
import { Trash2 } from 'lucide-react'

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

  function commitEdit() {
    if (editingCell) {
      onUpdate(editingCell.rowId, editingCell.colKey, editValue)
      setEditingCell(null)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') commitEdit()
    if (e.key === 'Escape') setEditingCell(null)
  }

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              {columns.map((col) => (
                <th key={col.key} className="text-left py-3 px-4 font-medium text-gray-600">
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
                <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                  {columns.map((col) => (
                    <td key={col.key} className="py-2 px-4">
                      {editingCell?.rowId === row.id && editingCell?.colKey === col.key ? (
                        <input
                          autoFocus
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={commitEdit}
                          onKeyDown={handleKeyDown}
                          className="w-full px-2 py-1 border border-primary rounded text-sm focus:outline-none"
                        />
                      ) : (
                        <span
                          onClick={() => startEdit(row.id, col.key, row[col.key])}
                          className="cursor-pointer hover:bg-blue-50 px-2 py-1 rounded block min-h-[28px]"
                        >
                          {row[col.key] || '\u00A0'}
                        </span>
                      )}
                    </td>
                  ))}
                  <td className="py-2 px-2">
                    <button
                      onClick={() => onDelete(row.id)}
                      aria-label="Delete row"
                      className="p-1 text-gray-400 hover:text-danger rounded hover:bg-red-50"
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
