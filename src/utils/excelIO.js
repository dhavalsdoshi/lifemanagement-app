import ExcelJS from 'exceljs'
import { SECTIONS } from '../config/sections'
import { saveFile } from './platform'

// Derived from SECTIONS — single source of truth in src/config/sections.js
export const SHEET_CONFIG = Object.fromEntries(
  Object.entries(SECTIONS).map(([key, { sheetName, columns }]) => [key, { sheetName, columns }])
)

// Build reverse lookup: sheet name -> storage key
const sheetNameToKey = {}
for (const [key, config] of Object.entries(SHEET_CONFIG)) {
  sheetNameToKey[config.sheetName] = key
}

function cellToString(value) {
  if (value === null || value === undefined) return ''
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  if (typeof value === 'object' && value.text) return String(value.text)
  return String(value)
}

export function importFromWorkbook(workbook) {
  const result = {}

  workbook.eachSheet((sheet) => {
    const storageKey = sheetNameToKey[sheet.name]
    if (!storageKey) return

    const config = SHEET_CONFIG[storageKey]
    const headerToKey = {}
    config.columns.forEach((col) => { headerToKey[col.header] = col.key })

    let headers = null
    let rowIndex = 0
    const rows = []

    sheet.eachRow((row) => {
      rowIndex++
      const values = row.values.slice(1) // exceljs row.values is 1-indexed
      if (rowIndex === 1) {
        headers = values.map(cellToString)
        return
      }
      const item = { id: String(rowIndex - 1) }
      headers.forEach((header, idx) => {
        const key = headerToKey[header]
        if (key) item[key] = cellToString(values[idx])
      })
      rows.push(item)
    })

    result[storageKey] = rows
  })

  return result
}

export function exportToWorkbook(allData) {
  const wb = new ExcelJS.Workbook()

  Object.entries(SHEET_CONFIG).forEach(([storageKey, config]) => {
    const ws = wb.addWorksheet(config.sheetName)
    ws.addRow(config.columns.map((c) => c.header))
    const data = allData[storageKey] || []
    data.forEach((item) => {
      ws.addRow(config.columns.map((col) => item[col.key] ?? ''))
    })
  })

  return wb
}

export async function downloadWorkbook(allData, filename = 'Life Management.xlsx') {
  const wb = exportToWorkbook(allData)
  const buffer = await wb.xlsx.writeBuffer()
  await saveFile(buffer, {
    filename,
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    filters: [{ name: 'Excel', extensions: ['xlsx'] }],
  })
}

export function parseFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const wb = new ExcelJS.Workbook()
        await wb.xlsx.load(e.target.result)
        resolve(importFromWorkbook(wb))
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}
