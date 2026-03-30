import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import TablePage from './pages/TablePage'
import ImportModeModal from './components/shared/ImportModeModal'
import { loadData, saveData } from './utils/storage'
import { parseFile, downloadWorkbook, SHEET_CONFIG } from './utils/excelIO'
import { downloadMarkdownZip, importFromMarkdownZip } from './utils/markdownIO'

function App() {
  const [pendingMdImport, setPendingMdImport] = useState(null) // { data, sectionCount }

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
    downloadWorkbook(allData) // async — fire and forget
  }

  async function handleMarkdownImport(file) {
    try {
      const data = await importFromMarkdownZip(file)
      const sectionCount = Object.keys(data).length
      if (sectionCount === 0) {
        alert('No matching sections found in the ZIP file.')
        return
      }
      setPendingMdImport({ data, sectionCount })
    } catch (err) {
      alert('Failed to import file: ' + err.message)
    }
  }

  function applyMdImport(mode) {
    if (!pendingMdImport) return
    Object.entries(pendingMdImport.data).forEach(([key, newRows]) => {
      if (mode === 'append') {
        saveData(key, [...loadData(key), ...newRows])
      } else {
        saveData(key, newRows)
      }
    })
    setPendingMdImport(null)
    window.location.reload()
  }

  function handleMarkdownExport() {
    const allData = {}
    Object.keys(SHEET_CONFIG).forEach((key) => { allData[key] = loadData(key) })
    downloadMarkdownZip(allData)
  }

  return (
    <>
      {pendingMdImport && (
        <ImportModeModal
          sectionCount={pendingMdImport.sectionCount}
          onAppend={() => applyMdImport('append')}
          onOverwrite={() => applyMdImport('overwrite')}
          onCancel={() => setPendingMdImport(null)}
        />
      )}
      <Routes>
        <Route element={
          <Layout
            onImport={handleImport}
            onExport={handleExport}
            onMarkdownImport={handleMarkdownImport}
            onMarkdownExport={handleMarkdownExport}
          />
        }>
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
    </>
  )
}

export default App
