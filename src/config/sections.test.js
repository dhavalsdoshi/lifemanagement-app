import { describe, it, expect } from 'vitest'
import { SECTIONS, CATEGORIES } from './sections'
import { ALL_KEYS } from '../utils/storage'

describe('SECTIONS config', () => {
  it('exports a non-empty object', () => {
    expect(Object.keys(SECTIONS).length).toBeGreaterThan(0)
  })

  it('every section has required fields', () => {
    Object.entries(SECTIONS).forEach(([key, s]) => {
      expect(s.sheetName, `${key}.sheetName`).toBeTruthy()
      expect(s.navLabel, `${key}.navLabel`).toBeTruthy()
      expect(s.category, `${key}.category`).toBeTruthy()
      expect(s.icon, `${key}.icon`).toBeDefined()
      expect(Array.isArray(s.columns), `${key}.columns`).toBe(true)
      expect(s.columns.length, `${key} has at least one column`).toBeGreaterThan(0)
    })
  })

  it('every column has key and header', () => {
    Object.entries(SECTIONS).forEach(([sectionKey, s]) => {
      s.columns.forEach((col, i) => {
        expect(col.key, `${sectionKey}.columns[${i}].key`).toBeTruthy()
        expect(col.header, `${sectionKey}.columns[${i}].header`).toBeTruthy()
      })
    })
  })

  it('every section.category matches a CATEGORIES label', () => {
    const validLabels = new Set(CATEGORIES.map((c) => c.label))
    Object.entries(SECTIONS).forEach(([key, s]) => {
      expect(validLabels.has(s.category), `${key}.category "${s.category}" is valid`).toBe(true)
    })
  })

  it('dashColor is defined when dashLabel is defined', () => {
    Object.entries(SECTIONS).forEach(([key, s]) => {
      if (s.dashLabel) {
        expect(s.dashColor, `${key} has dashColor when dashLabel is set`).toBeTruthy()
      }
    })
  })
})

describe('CATEGORIES', () => {
  it('every category has label and color', () => {
    CATEGORIES.forEach((cat, i) => {
      expect(cat.label, `CATEGORIES[${i}].label`).toBeTruthy()
      expect(cat.color, `CATEGORIES[${i}].color`).toBeTruthy()
    })
  })

  it('covers every category used in SECTIONS', () => {
    const usedCategories = new Set(Object.values(SECTIONS).map((s) => s.category))
    const defined = new Set(CATEGORIES.map((c) => c.label))
    usedCategories.forEach((cat) => {
      expect(defined.has(cat), `category "${cat}" is in CATEGORIES`).toBe(true)
    })
  })
})

describe('storage ALL_KEYS matches SECTIONS', () => {
  it('ALL_KEYS contains exactly the keys in SECTIONS', () => {
    expect(ALL_KEYS).toEqual(Object.keys(SECTIONS))
  })
})
