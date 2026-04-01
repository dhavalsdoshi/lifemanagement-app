import { describe, it, expect } from 'vitest'
import { genId } from './id'

describe('genId', () => {
  it('returns a non-empty string', () => {
    expect(typeof genId()).toBe('string')
    expect(genId().length).toBeGreaterThan(0)
  })

  it('returns unique ids on successive calls', () => {
    const ids = new Set(Array.from({ length: 100 }, () => genId()))
    expect(ids.size).toBe(100)
  })

  it('id contains a timestamp component', () => {
    const before = Date.now()
    const id = genId()
    const after = Date.now()
    const ts = Number(id.split('-')[0])
    expect(ts).toBeGreaterThanOrEqual(before)
    expect(ts).toBeLessThanOrEqual(after)
  })
})
