/**
 * Tests for the IS_TAURI code paths in platform.js.
 *
 * Uses mockWindows() to set IS_TAURI = true, then vi.doMock() to control
 * @tauri-apps/plugin-dialog and @tauri-apps/plugin-fs behaviour.
 * vi.resetModules() is called before each import so the dynamic imports inside
 * saveFile/openFile pick up the mocked modules.
 */
import { afterEach, describe, expect, it, vi } from 'vitest'
import { mockWindows, clearMocks } from '@tauri-apps/api/mocks'

afterEach(() => {
  clearMocks()
  vi.resetModules()
  vi.restoreAllMocks()
})

// ─── saveFile ────────────────────────────────────────────────────────────────

describe('saveFile (Tauri)', () => {
  it('calls dialog save then writeFile with the chosen path', async () => {
    mockWindows('main')
    vi.resetModules()

    const mockSave = vi.fn().mockResolvedValue('/tmp/export.xlsx')
    const mockWriteFile = vi.fn().mockResolvedValue(undefined)
    vi.doMock('@tauri-apps/plugin-dialog', () => ({ save: mockSave }))
    vi.doMock('@tauri-apps/plugin-fs', () => ({ writeFile: mockWriteFile }))
    vi.doMock('./storage', () => ({ IS_TAURI: true }))

    const { saveFile } = await import('./platform.js')
    const buf = new Uint8Array([1, 2, 3]).buffer
    await saveFile(buf, { filename: 'export.xlsx', mimeType: 'application/octet-stream', filters: [] })

    expect(mockSave).toHaveBeenCalledOnce()
    expect(mockSave).toHaveBeenCalledWith({ defaultPath: 'export.xlsx', filters: [] })
    expect(mockWriteFile).toHaveBeenCalledOnce()
    expect(mockWriteFile).toHaveBeenCalledWith('/tmp/export.xlsx', expect.any(Uint8Array))
  })

  it('does nothing when the save dialog is cancelled (path is null)', async () => {
    mockWindows('main')
    vi.resetModules()

    const mockSave = vi.fn().mockResolvedValue(null)
    const mockWriteFile = vi.fn()
    vi.doMock('@tauri-apps/plugin-dialog', () => ({ save: mockSave }))
    vi.doMock('@tauri-apps/plugin-fs', () => ({ writeFile: mockWriteFile }))
    vi.doMock('./storage', () => ({ IS_TAURI: true }))

    const { saveFile } = await import('./platform.js')
    await saveFile(new Uint8Array().buffer, { filename: 'x.xlsx', filters: [] })

    expect(mockSave).toHaveBeenCalledOnce()
    expect(mockWriteFile).not.toHaveBeenCalled()
  })
})

// ─── openFile ─────────────────────────────────────────────────────────────────

describe('openFile (Tauri)', () => {
  it('returns a File object with the correct name', async () => {
    mockWindows('main')
    vi.resetModules()

    const mockOpen = vi.fn().mockResolvedValue('/Users/test/import.xlsx')
    const mockReadFile = vi.fn().mockResolvedValue(new Uint8Array([10, 20, 30]))
    vi.doMock('@tauri-apps/plugin-dialog', () => ({ open: mockOpen }))
    vi.doMock('@tauri-apps/plugin-fs', () => ({ readFile: mockReadFile }))
    vi.doMock('./storage', () => ({ IS_TAURI: true }))

    const { openFile } = await import('./platform.js')
    const file = await openFile({ filters: [] })

    expect(file).toBeInstanceOf(File)
    expect(file.name).toBe('import.xlsx')
  })

  it('returns null when the open dialog is cancelled', async () => {
    mockWindows('main')
    vi.resetModules()

    vi.doMock('@tauri-apps/plugin-dialog', () => ({ open: vi.fn().mockResolvedValue(null) }))
    vi.doMock('@tauri-apps/plugin-fs', () => ({ readFile: vi.fn() }))
    vi.doMock('./storage', () => ({ IS_TAURI: true }))

    const { openFile } = await import('./platform.js')
    const file = await openFile({ filters: [] })

    expect(file).toBeNull()
  })

  it('passes the correct filters to the open dialog', async () => {
    mockWindows('main')
    vi.resetModules()

    const mockOpen = vi.fn().mockResolvedValue('/tmp/data.zip')
    vi.doMock('@tauri-apps/plugin-dialog', () => ({ open: mockOpen }))
    vi.doMock('@tauri-apps/plugin-fs', () => ({
      readFile: vi.fn().mockResolvedValue(new Uint8Array()),
    }))
    vi.doMock('./storage', () => ({ IS_TAURI: true }))

    const { openFile } = await import('./platform.js')
    const filters = [{ name: 'ZIP', extensions: ['zip'] }]
    await openFile({ filters })

    expect(mockOpen).toHaveBeenCalledWith({ multiple: false, filters })
  })
})
