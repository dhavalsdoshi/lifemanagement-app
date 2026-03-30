const PREFIX = 'lm-'

export const ALL_KEYS = [
  'weekly-goals',
  'current-projects',
  'hobbies-goals',
  'budget',
  'gratitude-journal',
  'habits',
  'books-to-read',
  'reading-log',
  'shows-to-watch',
  'movies-watched',
  'games-to-play',
  'cooking-baking',
  'day-reflections',
  'people-to-hang-out',
  'jobs-applied',
  'symptom-tracker',
  'coping-mechanisms',
  'self-help-resources',
  'shopping-list',
  'meetup-groups',
  'was-i-late',
  'current',
  'check-in-with',
  'morning-coffee-sites',
  'day-plan-guide',
  'bad-ef-day-notepad',
  'gym',
]

// Detect Tauri runtime (not present in browser or test environments)
export const IS_TAURI = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window

// In-memory cache used in Tauri mode. Pre-populated by initTauriStorage()
// before React mounts, so loadData() stays synchronous everywhere.
const tauriCache = new Map()

/**
 * Call once before rendering React when running inside Tauri.
 * Loads all sections from disk into tauriCache so that subsequent
 * loadData() calls are synchronous (matching the localStorage API shape).
 */
export async function initTauriStorage() {
  if (!IS_TAURI) return
  const { invoke } = await import('@tauri-apps/api/core')
  await Promise.all(
    ALL_KEYS.map(async (key) => {
      const data = await invoke('read_section', { key })
      tauriCache.set(key, Array.isArray(data) ? data : [])
    })
  )
}

export function loadData(key) {
  if (IS_TAURI) {
    return tauriCache.get(key) ?? []
  }
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveData(key, data) {
  if (IS_TAURI) {
    tauriCache.set(key, data)
    // fire-and-forget async write to disk
    import('@tauri-apps/api/core').then(({ invoke }) =>
      invoke('write_section', { key, data })
    )
    return
  }
  localStorage.setItem(PREFIX + key, JSON.stringify(data))
}

export function clearAll() {
  if (IS_TAURI) {
    ALL_KEYS.forEach((key) => {
      tauriCache.set(key, [])
      import('@tauri-apps/api/core').then(({ invoke }) =>
        invoke('write_section', { key, data: [] })
      )
    })
    return
  }
  ALL_KEYS.forEach((key) => localStorage.removeItem(PREFIX + key))
}
