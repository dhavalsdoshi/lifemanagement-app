/**
 * Tests for the IS_TAURI code paths in storage.js.
 *
 * vi.hoisted() runs before all imports, so setting window.__TAURI_INTERNALS__
 * there ensures IS_TAURI is true when storage.js is first evaluated.
 * The same invoke mock is used for all tests; each test controls its behaviour
 * via mockInvoke.mockImplementation().
 */
import { afterEach, describe, expect, it, vi } from 'vitest'

// ─── Setup: inject __TAURI_INTERNALS__ before storage.js loads ──────────────

const { mockInvoke } = vi.hoisted(() => {
  const mockInvoke = vi.fn()
  window.__TAURI_INTERNALS__ = {
    metadata: {
      currentWindow: { label: 'main' },
      currentWebview: { windowLabel: 'main', label: 'main' },
    },
    invoke: mockInvoke,
  }
  return { mockInvoke }
})

// Static import — module evaluates with IS_TAURI = true because __TAURI_INTERNALS__ is set
import { IS_TAURI, initTauriStorage, loadData, saveData, clearAll, ALL_KEYS } from './storage.js'

afterEach(() => {
  mockInvoke.mockReset()
})

/** Drain all pending microtasks and one macrotask tick. */
function flushAsync() {
  return new Promise((resolve) => setTimeout(resolve, 0))
}

// ─── IS_TAURI ────────────────────────────────────────────────────────────────

describe('IS_TAURI', () => {
  it('is true when __TAURI_INTERNALS__ is present', () => {
    expect(IS_TAURI).toBe(true)
  })
})

// ─── initTauriStorage ────────────────────────────────────────────────────────

describe('initTauriStorage', () => {
  it('calls read_section for every known key', async () => {
    mockInvoke.mockResolvedValue([])
    await initTauriStorage()

    const readKeys = mockInvoke.mock.calls
      .filter(([cmd]) => cmd === 'read_section')
      .map(([, args]) => args.key)

    expect(readKeys.length).toBe(ALL_KEYS.length)
    expect(readKeys).toEqual(expect.arrayContaining(ALL_KEYS))
  })

  it('populates the cache so loadData is synchronous', async () => {
    mockInvoke.mockImplementation((cmd, args) => {
      if (cmd === 'read_section' && args.key === 'weekly-goals') {
        return Promise.resolve([{ id: '1', goal: 'Run 5k' }])
      }
      return Promise.resolve([])
    })
    await initTauriStorage()
    expect(loadData('weekly-goals')).toEqual([{ id: '1', goal: 'Run 5k' }])
  })

  it('stores empty array for keys the backend returns []', async () => {
    mockInvoke.mockResolvedValue([])
    await initTauriStorage()
    expect(loadData('budget')).toEqual([])
  })
})

// ─── loadData (Tauri) ────────────────────────────────────────────────────────

describe('loadData (Tauri)', () => {
  it('returns empty array for a key never written to cache', async () => {
    mockInvoke.mockResolvedValue([])
    await initTauriStorage()
    expect(loadData('nonexistent-key')).toEqual([])
  })
})

// ─── saveData (Tauri) ────────────────────────────────────────────────────────

describe('saveData (Tauri)', () => {
  it('updates the cache synchronously', async () => {
    mockInvoke.mockResolvedValue([])
    await initTauriStorage()
    const data = [{ id: '2', goal: 'Meditate' }]
    saveData('weekly-goals', data)
    expect(loadData('weekly-goals')).toEqual(data)
  })

  it('fires write_section with the correct key and data', async () => {
    mockInvoke.mockResolvedValue([])
    await initTauriStorage()
    mockInvoke.mockClear()

    const data = [{ id: '3', goal: 'Sleep early' }]
    saveData('weekly-goals', data)
    await flushAsync()

    const writeCalls = mockInvoke.mock.calls.filter(([cmd]) => cmd === 'write_section')
    expect(writeCalls.length).toBeGreaterThan(0)
    expect(writeCalls[0][1]).toEqual({ key: 'weekly-goals', data })
  })
})

// ─── clearAll (Tauri) ────────────────────────────────────────────────────────

describe('clearAll (Tauri)', () => {
  it('resets every cached key to an empty array', async () => {
    mockInvoke.mockImplementation((cmd) =>
      cmd === 'read_section' ? Promise.resolve([{ id: '1' }]) : Promise.resolve(null)
    )
    await initTauriStorage()
    clearAll()
    ALL_KEYS.forEach((key) => {
      expect(loadData(key)).toEqual([])
    })
  })

  it('writes an empty array to disk for every key', async () => {
    mockInvoke.mockImplementation((cmd) =>
      cmd === 'read_section' ? Promise.resolve([{ id: '1' }]) : Promise.resolve(null)
    )
    await initTauriStorage()
    mockInvoke.mockClear()

    clearAll()
    await flushAsync()

    const writeKeys = mockInvoke.mock.calls
      .filter(([cmd]) => cmd === 'write_section')
      .map(([, args]) => args.key)

    ALL_KEYS.forEach((key) => {
      expect(writeKeys).toContain(key)
    })
  })
})
