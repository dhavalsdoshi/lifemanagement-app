import { Plus } from 'lucide-react'
import { useLocalData } from '../hooks/useLocalData'
import Card from '../components/shared/Card'
import DataTable from '../components/shared/DataTable'
import { SHEET_CONFIG } from '../utils/excelIO'

export default function TablePage({ storageKey, title, description }) {
  const { rows, addRow, updateRow, deleteRow } = useLocalData(storageKey)
  const config = SHEET_CONFIG[storageKey]

  function handleAdd() {
    const defaults = {}
    config.columns.forEach((col) => { defaults[col.key] = '' })
    addRow(defaults)
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        {description && <p className="text-gray-500 mt-1">{description}</p>}
      </div>
      <Card
        actions={
          <button
            onClick={handleAdd}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-md text-sm hover:bg-primary-hover transition-colors"
          >
            <Plus size={16} />
            Add Row
          </button>
        }
      >
        <DataTable
          columns={config.columns}
          rows={rows}
          onUpdate={updateRow}
          onDelete={deleteRow}
        />
      </Card>
    </div>
  )
}
