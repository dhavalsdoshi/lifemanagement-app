import { describe, it, expect, beforeEach } from 'vitest'
import { loadData, saveData, clearAll, ALL_KEYS } from './storage'

beforeEach(() => {
  localStorage.clear()
})

describe('storage', () => {
  it('returns default value when key has no data', () => {
    expect(loadData('weekly-goals')).toEqual([])
  })

  it('saves and loads data', () => {
    const data = [{ id: 1, goal: 'Exercise' }]
    saveData('weekly-goals', data)
    expect(loadData('weekly-goals')).toEqual(data)
  })

  it('overwrites existing data on save', () => {
    saveData('weekly-goals', [{ id: 1 }])
    saveData('weekly-goals', [{ id: 2 }])
    expect(loadData('weekly-goals')).toEqual([{ id: 2 }])
  })

  it('handles corrupted JSON gracefully', () => {
    localStorage.setItem('lm-weekly-goals', 'not json')
    expect(loadData('weekly-goals')).toEqual([])
  })

  it('clearAll removes all app data', () => {
    saveData('weekly-goals', [{ id: 1 }])
    saveData('budget', [{ id: 2 }])
    localStorage.setItem('other-app-data', 'keep')
    clearAll()
    expect(loadData('weekly-goals')).toEqual([])
    expect(loadData('budget')).toEqual([])
    expect(localStorage.getItem('other-app-data')).toBe('keep')
  })

  it('ALL_KEYS contains expected section keys', () => {
    expect(ALL_KEYS).toContain('weekly-goals')
    expect(ALL_KEYS).toContain('budget')
    expect(ALL_KEYS).toContain('gratitude-journal')
    expect(ALL_KEYS.length).toBeGreaterThan(20)
  })
})
