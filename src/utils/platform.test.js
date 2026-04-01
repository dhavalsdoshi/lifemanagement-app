import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { saveFile, openFile } from './platform'

// Mock storage to control IS_TAURI
vi.mock('./storage', () => ({ IS_TAURI: false }))

describe('saveFile (browser)', () => {
  let anchor, revokeObjectURL, createObjectURL

  beforeEach(() => {
    anchor = { click: vi.fn(), href: '', download: '' }
    createObjectURL = vi.fn(() => 'blob:mock')
    revokeObjectURL = vi.fn()
    vi.spyOn(document, 'createElement').mockReturnValue(anchor)
    Object.defineProperty(globalThis, 'URL', {
      value: { createObjectURL, revokeObjectURL },
      writable: true,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('creates an anchor and clicks it', async () => {
    const buffer = new Uint8Array([1, 2, 3]).buffer
    await saveFile(buffer, { filename: 'test.xlsx', filters: [] })
    expect(anchor.download).toBe('test.xlsx')
    expect(anchor.click).toHaveBeenCalled()
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:mock')
  })
})

describe('openFile (browser)', () => {
  it('returns null in browser mode', async () => {
    const result = await openFile({ filters: [] })
    expect(result).toBeNull()
  })
})
