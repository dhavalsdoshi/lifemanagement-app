/**
 * Shared Playwright test helpers.
 *
 * Import from any spec file:
 *   import { openSidebarIfMobile, clearStorage, seedSection, seedSections } from './helpers.js'
 */

/** Open the sidebar drawer if the current viewport is mobile-sized. */
export async function openSidebarIfMobile(page) {
  const vp = page.viewportSize()
  if (vp && vp.width < 768) {
    await page.getByLabel('Open navigation').click()
  }
}

/**
 * Register a script that clears all lm-* localStorage keys before the first page load.
 * Uses sessionStorage as a one-shot guard so reloads within the same test do NOT
 * wipe data that was written by the test itself.
 * Must be called before page.goto().
 */
export function clearStorage(page) {
  return page.addInitScript(`
    if (!sessionStorage.getItem('__lm_cleared__')) {
      Object.keys(localStorage)
        .filter(function(k) { return k.startsWith('lm-') })
        .forEach(function(k) { localStorage.removeItem(k) })
      sessionStorage.setItem('__lm_cleared__', '1')
    }
  `)
}

/**
 * Register a script that seeds one section's data into localStorage before the next page load.
 * Uses sessionStorage as a one-shot guard so subsequent navigations within the same test
 * do NOT re-seed and overwrite data written by the app (e.g. after import).
 * Must be called before page.goto().
 * Inlines the key + JSON-serialized rows directly into the script string to avoid
 * Playwright arg-serialization issues with nested arrays.
 */
export function seedSection(page, key, rows) {
  const storageKey = JSON.stringify(`lm-${key}`)
  const storageValue = JSON.stringify(JSON.stringify(rows))
  const guardKey = JSON.stringify(`__lm_seeded_${key}__`)
  return page.addInitScript(`
    if (!sessionStorage.getItem(${guardKey})) {
      localStorage.setItem(${storageKey}, ${storageValue})
      sessionStorage.setItem(${guardKey}, '1')
    }
  `)
}

/**
 * Register a script that seeds multiple sections at once.
 * sections is an object of { key: rows[] }.
 * Uses sessionStorage guards so re-navigations do not overwrite app-written data.
 * Must be called before page.goto().
 */
export function seedSections(page, sections) {
  const statements = Object.entries(sections)
    .map(([key, rows]) => {
      const k = JSON.stringify(`lm-${key}`)
      const v = JSON.stringify(JSON.stringify(rows))
      const g = JSON.stringify(`__lm_seeded_${key}__`)
      return `if (!sessionStorage.getItem(${g})) { localStorage.setItem(${k}, ${v}); sessionStorage.setItem(${g}, '1') }`
    })
    .join(';')
  return page.addInitScript(statements)
}
