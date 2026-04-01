/**
 * Platform abstraction layer.
 *
 * Centralises all Tauri vs browser branching so individual utilities
 * (excelIO, markdownIO, Sidebar) stay platform-agnostic.
 */
import { IS_TAURI } from './storage'

/**
 * Trigger a file save.
 * - Tauri: opens a native Save dialog then writes the file.
 * - Browser: creates a temporary anchor and clicks it.
 *
 * @param {ArrayBuffer|Uint8Array} buffer  File contents
 * @param {{ filename: string, mimeType?: string, filters: Array }} opts
 */
export async function saveFile(buffer, { filename, mimeType, filters }) {
  if (IS_TAURI) {
    const { save } = await import('@tauri-apps/plugin-dialog')
    const { writeFile } = await import('@tauri-apps/plugin-fs')
    const path = await save({ defaultPath: filename, filters })
    if (path) await writeFile(path, new Uint8Array(buffer))
    return
  }
  const blob = new Blob([buffer], mimeType ? { type: mimeType } : undefined)
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

/**
 * Open a native file picker (Tauri only).
 * Returns a File object, or null if running in a browser (caller should
 * fall back to a hidden <input type="file"> in that case).
 *
 * @param {{ filters: Array }} opts
 * @returns {Promise<File|null>}
 */
export async function openFile({ filters }) {
  if (!IS_TAURI) return null
  const { open } = await import('@tauri-apps/plugin-dialog')
  const { readFile } = await import('@tauri-apps/plugin-fs')
  const selected = await open({ multiple: false, filters })
  if (!selected) return null
  const bytes = await readFile(selected)
  return new File([bytes], selected.split('/').pop())
}
