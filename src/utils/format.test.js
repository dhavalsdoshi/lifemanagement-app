import { describe, it, expect } from 'vitest'
import { formatCellValue } from './format'

describe('formatCellValue', () => {
  // date type
  it('returns empty string for falsy value', () => {
    expect(formatCellValue({ key: 'date', type: 'date' }, '')).toBe('')
    expect(formatCellValue({ key: 'date', type: 'date' }, null)).toBe('')
  })

  it('formats a valid date string', () => {
    expect(formatCellValue({ key: 'date', type: 'date' }, '2024-01-15')).toBe('Jan 15, 2024')
  })

  it('returns original value for unparseable date', () => {
    expect(formatCellValue({ key: 'date', type: 'date' }, 'not-a-date')).toBe('not-a-date')
  })

  // text type
  it('returns string value for text type', () => {
    expect(formatCellValue({ key: 'name', type: 'text' }, 'hello')).toBe('hello')
  })

  it('returns empty string for falsy text value', () => {
    expect(formatCellValue({ key: 'name', type: 'text' }, '')).toBe('')
    expect(formatCellValue({ key: 'name', type: 'text' }, null)).toBe('')
  })

  // number type
  it('returns string representation of a number', () => {
    expect(formatCellValue({ key: 'amount', type: 'number' }, '42')).toBe('42')
    expect(formatCellValue({ key: 'amount', type: 'number' }, '3.14')).toBe('3.14')
  })

  it('returns empty string for falsy number value', () => {
    expect(formatCellValue({ key: 'amount', type: 'number' }, '')).toBe('')
  })

  // url type
  it('returns the URL string as-is for url type', () => {
    expect(formatCellValue({ key: 'url', type: 'url' }, 'https://example.com')).toBe('https://example.com')
  })

  it('returns empty string for falsy url value', () => {
    expect(formatCellValue({ key: 'url', type: 'url' }, '')).toBe('')
  })

  // select type
  it('returns the selected option string for select type', () => {
    expect(formatCellValue({ key: 'status', type: 'select' }, 'In Progress')).toBe('In Progress')
  })

  // no type (default)
  it('handles missing type gracefully', () => {
    expect(formatCellValue({ key: 'x' }, 'val')).toBe('val')
    expect(formatCellValue({ key: 'x' }, '')).toBe('')
  })
})
