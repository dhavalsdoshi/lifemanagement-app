import { describe, it, expect } from 'vitest'
import { formatCellValue } from './format'

describe('formatCellValue', () => {
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

  it('returns string value for non-date types', () => {
    expect(formatCellValue({ key: 'name', type: 'text' }, 'hello')).toBe('hello')
  })
})
