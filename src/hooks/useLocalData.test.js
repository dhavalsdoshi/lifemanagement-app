import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLocalData } from './useLocalData'

beforeEach(() => {
  localStorage.clear()
})

describe('useLocalData', () => {
  it('initializes with empty array', () => {
    const { result } = renderHook(() => useLocalData('test-key'))
    expect(result.current.rows).toEqual([])
  })

  it('adds a row with auto-generated id', () => {
    const { result } = renderHook(() => useLocalData('test-key'))
    act(() => {
      result.current.addRow({ name: 'Test' })
    })
    expect(result.current.rows).toHaveLength(1)
    expect(result.current.rows[0].name).toBe('Test')
    expect(result.current.rows[0].id).toBeTruthy()
  })

  it('updates a row field', () => {
    const { result } = renderHook(() => useLocalData('test-key'))
    act(() => {
      result.current.addRow({ name: 'Old' })
    })
    const id = result.current.rows[0].id
    act(() => {
      result.current.updateRow(id, 'name', 'New')
    })
    expect(result.current.rows[0].name).toBe('New')
  })

  it('deletes a row', () => {
    const { result } = renderHook(() => useLocalData('test-key'))
    act(() => {
      result.current.addRow({ name: 'A' })
      result.current.addRow({ name: 'B' })
    })
    const id = result.current.rows[0].id
    act(() => {
      result.current.deleteRow(id)
    })
    expect(result.current.rows).toHaveLength(1)
    expect(result.current.rows[0].name).toBe('B')
  })

  it('sets all rows at once', () => {
    const { result } = renderHook(() => useLocalData('test-key'))
    act(() => {
      result.current.setRows([{ id: '1', name: 'Bulk' }])
    })
    expect(result.current.rows).toEqual([{ id: '1', name: 'Bulk' }])
  })

  it('persists to localStorage', () => {
    const { result } = renderHook(() => useLocalData('test-key'))
    act(() => {
      result.current.addRow({ name: 'Persist' })
    })
    const stored = JSON.parse(localStorage.getItem('lm-test-key'))
    expect(stored[0].name).toBe('Persist')
  })
})
