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
