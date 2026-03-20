import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import TablePage from './pages/TablePage'
import { loadData, saveData } from './utils/storage'
import { parseFile, downloadWorkbook, SHEET_CONFIG } from './utils/excelIO'

function App() {
  async function handleImport(file) {
    try {
      const data = await parseFile(file)
      Object.entries(data).forEach(([key, rows]) => saveData(key, rows))
      window.location.reload()
    } catch (err) {
      alert('Failed to import file: ' + err.message)
    }
  }

  function handleExport() {
    const allData = {}
    Object.keys(SHEET_CONFIG).forEach((key) => { allData[key] = loadData(key) })
    downloadWorkbook(allData)
  }

  return (
    <Routes>
      <Route element={<Layout onImport={handleImport} onExport={handleExport} />}>
        <Route index element={<Dashboard />} />
        {Object.entries(SHEET_CONFIG).map(([key, config]) => (
          <Route
            key={key}
            path={key}
            element={<TablePage storageKey={key} title={config.sheetName} />}
          />
        ))}
      </Route>
    </Routes>
  )
}

export default App
