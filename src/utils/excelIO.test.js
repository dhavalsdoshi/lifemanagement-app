import { describe, it, expect, beforeEach } from 'vitest'
import ExcelJS from 'exceljs'
import { importFromWorkbook, exportToWorkbook, SHEET_CONFIG } from './excelIO'

beforeEach(() => {
  localStorage.clear()
})

describe('SHEET_CONFIG', () => {
  it('maps storage keys to sheet names', () => {
    expect(SHEET_CONFIG['weekly-goals']).toBeDefined()
    expect(SHEET_CONFIG['weekly-goals'].sheetName).toBe('Weekly Goals')
    expect(SHEET_CONFIG['budget'].sheetName).toBe('Budget')
  })

  it('each config has sheetName and columns', () => {
    Object.values(SHEET_CONFIG).forEach((config) => {
      expect(config.sheetName).toBeTruthy()
      expect(Array.isArray(config.columns)).toBe(true)
      expect(config.columns.length).toBeGreaterThan(0)
    })
  })
})

describe('importFromWorkbook', () => {
  it('parses sheet data into storage format', () => {
    const wb = new ExcelJS.Workbook()
    const ws = wb.addWorksheet('Weekly Goals')
    ws.addRow(['Goal', 'Category', 'Status'])
    ws.addRow(['Exercise daily', 'Health', 'In Progress'])
    ws.addRow(['Read 1 book', 'Learning', 'Done'])

    const result = importFromWorkbook(wb)
    expect(result['weekly-goals']).toHaveLength(2)
    expect(result['weekly-goals'][0]).toMatchObject({
      goal: 'Exercise daily',
      category: 'Health',
      status: 'In Progress',
    })
  })

  it('skips sheets not in config', () => {
    const wb = new ExcelJS.Workbook()
    const ws = wb.addWorksheet('Unknown Sheet')
    ws.addRow(['Random'])
    ws.addRow(['data'])

    const result = importFromWorkbook(wb)
    expect(Object.keys(result)).toHaveLength(0)
  })

  it('handles empty sheets (header only)', () => {
    const wb = new ExcelJS.Workbook()
    const ws = wb.addWorksheet('Weekly Goals')
    ws.addRow(['Goal', 'Category', 'Status'])

    const result = importFromWorkbook(wb)
    expect(result['weekly-goals']).toEqual([])
  })
})

describe('exportToWorkbook', () => {
  it('creates workbook with sheet data', () => {
    const allData = {
      'weekly-goals': [
        { id: '1', goal: 'Exercise', category: 'Health', status: 'Done' },
      ],
    }

    const wb = exportToWorkbook(allData)
    const ws = wb.getWorksheet('Weekly Goals')
    expect(ws).toBeDefined()

    const dataRows = []
    ws.eachRow((row, rowNumber) => {
      if (rowNumber > 1) dataRows.push(row.values.slice(1).map(String))
    })
    expect(dataRows).toHaveLength(1)
    expect(dataRows[0][0]).toBe('Exercise') // Goal is first column
    expect(dataRows[0][1]).toBe('Health')
    expect(dataRows[0][2]).toBe('Done')
  })

  it('creates a sheet for every section in SHEET_CONFIG', () => {
    const wb = exportToWorkbook({})
    const sheetNames = wb.worksheets.map((ws) => ws.name)
    Object.values(SHEET_CONFIG).forEach((config) => {
      expect(sheetNames).toContain(config.sheetName)
    })
  })

  it('each sheet has a header row', () => {
    const wb = exportToWorkbook({})
    wb.eachSheet((ws) => {
      let rowCount = 0
      ws.eachRow(() => { rowCount++ })
      expect(rowCount).toBeGreaterThanOrEqual(1) // at least the header
    })
  })
})
