import { useState } from 'react'
import { Trash2, Plus } from 'lucide-react'
import CellEditor from './CellEditor'
import StarRating from './StarRating'
import CardList from './CardList'
import BottomSheet from './BottomSheet'
import RowForm from './RowForm'
import { formatCellValue } from '../../utils/format'
import { useIsMobile } from '../../hooks/useIsMobile'

export default function DataTable({ columns, rows, onUpdate, onDelete, onAdd }) {
  const [search, setSearch] = useState('')
  const [editingCell, setEditingCell] = useState(null) // { rowId, colKey }
  const [editValue, setEditValue] = useState('')
  const [sheet, setSheet] = useState(null) // null | { mode: 'add'|'edit', row: {...} }
  const isMobile = useIsMobile()

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

  function openAddSheet() {
    const blank = {}
    columns.forEach((col) => { blank[col.key] = '' })
    setSheet({ mode: 'add', row: blank })
  }

  function openEditSheet(row) {
    setSheet({ mode: 'edit', row: { ...row } })
  }

  function handleSheetFieldChange(key, value) {
    setSheet((s) => ({ ...s, row: { ...s.row, [key]: value } }))
  }

  function handleSheetSave() {
    if (!sheet) return
    if (sheet.mode === 'add') {
      onAdd(sheet.row)
    } else {
      columns.forEach((col) => {
        onUpdate(sheet.row.id, col.key, sheet.row[col.key] ?? '')
      })
    }
    setSheet(null)
  }

  const sheetFooter = (
    <div className="flex gap-3">
      <button
        onClick={() => setSheet(null)}
        className="flex-1 h-12 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300"
      >
        Cancel
      </button>
      <button
        onClick={handleSheetSave}
        className="flex-[2] h-12 bg-primary rounded-xl text-sm font-semibold text-white shadow-sm"
      >
        {sheet?.mode === 'add' ? 'Add row' : 'Save changes'}
      </button>
    </div>
  )

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:max-w-xs px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          style={{ fontSize: '16px' }}
        />
      </div>

      {/* Mobile: card list */}
      {isMobile ? (
        <>
          <CardList
            columns={columns}
            rows={filtered}
            onEdit={openEditSheet}
            onDelete={onDelete}
          />
          {onAdd && (
            <button
              onClick={openAddSheet}
              aria-label="Add row"
              className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-white shadow-lg flex items-center justify-center z-10 touch-manipulation"
            >
              <Plus size={22} />
            </button>
          )}
          <BottomSheet
            isOpen={!!sheet}
            onClose={() => setSheet(null)}
            title={sheet?.mode === 'add' ? 'Add row' : 'Edit row'}
            footer={sheetFooter}
          >
            {sheet && (
              <RowForm
                columns={columns}
                values={sheet.row}
                onChange={handleSheetFieldChange}
              />
            )}
          </BottomSheet>
        </>
      ) : (
        /* Desktop: existing table with inline editing */
        <div className="overflow-x-auto overscroll-x-contain">
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
                        {col.type === 'rating' ? (
                          <StarRating
                            value={row[col.key]}
                            onChange={(v) => onUpdate(row.id, col.key, v)}
                          />
                        ) : editingCell?.rowId === row.id && editingCell?.colKey === col.key ? (
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
                            className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 active:bg-blue-100 dark:active:bg-blue-900/30 px-2 py-2.5 rounded flex items-center min-h-[44px] truncate max-w-xs touch-manipulation"
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
                        className="p-2.5 text-gray-400 hover:text-danger rounded hover:bg-red-50 dark:hover:bg-red-900/20 touch-manipulation"
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
      )}
    </div>
  )
}
