import StarRating from './StarRating'

export default function RowForm({ columns, values, onChange }) {
  return (
    <div className="flex flex-col gap-5 pb-2">
      {columns.map((col) => (
        <div key={col.key} className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            {col.header}
          </label>
          <FieldInput col={col} value={values[col.key] ?? ''} onChange={(v) => onChange(col.key, v)} />
        </div>
      ))}
    </div>
  )
}

function FieldInput({ col, value, onChange }) {
  const type = col.type || 'text'
  const baseClass =
    'w-full h-11 px-3 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20'

  if (type === 'rating') {
    return <StarRating value={value} onChange={onChange} />
  }

  if (type === 'textarea') {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        style={{ fontSize: 16 }}
        className={`${baseClass} h-auto py-2.5 resize-none`}
      />
    )
  }

  if (type === 'select') {
    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ fontSize: 16 }}
        className={`${baseClass} bg-white dark:bg-gray-800`}
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
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ fontSize: 16 }}
      className={baseClass}
    />
  )
}
