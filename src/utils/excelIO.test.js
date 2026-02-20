import { describe, it, expect, beforeEach } from 'vitest'
import * as XLSX from 'xlsx'
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
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.aoa_to_sheet([
      ['Goal', 'Category', 'Status'],
      ['Exercise daily', 'Health', 'In Progress'],
      ['Read 1 book', 'Learning', 'Done'],
    ])
    XLSX.utils.book_append_sheet(wb, ws, 'Weekly Goals')

    const result = importFromWorkbook(wb)
    expect(result['weekly-goals']).toHaveLength(2)
    expect(result['weekly-goals'][0]).toMatchObject({
      goal: 'Exercise daily',
      category: 'Health',
      status: 'In Progress',
    })
  })

  it('skips sheets not in config', () => {
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.aoa_to_sheet([['Random'], ['data']])
    XLSX.utils.book_append_sheet(wb, ws, 'Unknown Sheet')

    const result = importFromWorkbook(wb)
    expect(Object.keys(result)).toHaveLength(0)
  })

  it('handles empty sheets', () => {
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.aoa_to_sheet([['Goal', 'Category', 'Status']])
    XLSX.utils.book_append_sheet(wb, ws, 'Weekly Goals')

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
    expect(wb.SheetNames).toContain('Weekly Goals')

    const rows = XLSX.utils.sheet_to_json(wb.Sheets['Weekly Goals'])
    expect(rows).toHaveLength(1)
    expect(rows[0]['Goal']).toBe('Exercise')
  })

  it('creates empty sheets for sections with no data', () => {
    const wb = exportToWorkbook({})
    expect(wb.SheetNames.length).toBeGreaterThan(0)
    // Each sheet should at least have headers
    wb.SheetNames.forEach((name) => {
      const rows = XLSX.utils.sheet_to_json(wb.Sheets[name], { header: 1 })
      expect(rows.length).toBeGreaterThanOrEqual(1)
    })
  })
})
