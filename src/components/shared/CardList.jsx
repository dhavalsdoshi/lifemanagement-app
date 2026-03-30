import { Pencil, Trash2 } from 'lucide-react'
import StarRating from './StarRating'
import { formatCellValue } from '../../utils/format'

const STATUS_COLORS = {
  'done':        'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  'complete':    'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  'in progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  'not started': 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  'high':        'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  'medium':      'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  'low':         'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
  'expense':     'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  'income':      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
}

function badgeClass(value) {
  return (
    STATUS_COLORS[String(value).toLowerCase()] ||
    'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
  )
}

export default function CardList({ columns, rows, onEdit, onDelete }) {
  if (rows.length === 0) {
    return (
      <p className="py-10 text-center text-gray-400 text-sm">
        No data yet. Tap + to add a row.
      </p>
    )
  }

  const [primaryCol, ...restCols] = columns
  const metaCols = restCols.filter((c) => c.type !== 'textarea')
  const noteCols = restCols.filter((c) => c.type === 'textarea')

  return (
    <div className="flex flex-col gap-3">
      {rows.map((row) => (
        <div
          key={row.id}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 flex flex-col gap-3 shadow-sm"
        >
          {/* Title row */}
          <div className="flex items-start justify-between gap-3">
            <span className="text-base font-semibold text-gray-900 dark:text-gray-100 leading-snug flex-1">
              {formatCellValue(primaryCol, row[primaryCol.key]) || <span className="text-gray-400 italic">—</span>}
            </span>
            <div className="flex gap-1.5 shrink-0">
              <button
                onClick={() => onEdit(row)}
                aria-label="Edit row"
                className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 touch-manipulation"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={() => onDelete(row.id)}
                aria-label="Delete row"
                className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-red-400 touch-manipulation"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          {/* Meta badges */}
          {metaCols.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {metaCols.map((col) => {
                if (col.type === 'rating') {
                  return (
                    <StarRating
                      key={col.key}
                      value={row[col.key]}
                      onChange={() => {}}
                      readOnly
                    />
                  )
                }
                const display = formatCellValue(col, row[col.key])
                if (!display) return null
                return (
                  <span key={col.key} className={`text-xs font-medium px-2.5 py-1 rounded-full ${badgeClass(display)}`}>
                    {display}
                  </span>
                )
              })}
            </div>
          )}

          {/* Note preview */}
          {noteCols.map((col) =>
            row[col.key] ? (
              <p
                key={col.key}
                data-testid="card-note"
                className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-xl px-3 py-2 line-clamp-3"
              >
                {row[col.key]}
              </p>
            ) : null
          )}
        </div>
      ))}
    </div>
  )
}
