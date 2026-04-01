import FieldInput from './FieldInput'

export default function RowForm({ columns, values, onChange }) {
  const baseClass =
    'w-full px-3 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20'

  return (
    <div className="flex flex-col gap-5 pb-2">
      {columns.map((col) => {
        const className = col.type === 'textarea'
          ? `${baseClass} h-auto py-2.5`
          : `${baseClass} h-11`
        return (
          <div key={col.key} className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              {col.header}
            </label>
            <FieldInput
              col={col}
              value={values[col.key] ?? ''}
              onChange={(v) => onChange(col.key, v)}
              className={className}
              style={{ fontSize: 16 }}
            />
          </div>
        )
      })}
    </div>
  )
}
