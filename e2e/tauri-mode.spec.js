/**
 * Playwright integration tests for the Tauri code paths.
 *
 * Injects window.__TAURI_INTERNALS__ via addInitScript so IS_TAURI evaluates
 * to true inside the React app. When IS_TAURI is true the app uses HashRouter,
 * so routes are accessed via the hash (e.g. /#/weekly-goals).
 */
import { test, expect } from '@playwright/test'

/**
 * Inject a Tauri environment mock before the page loads.
 * - Stores write_section calls in window.__tauriWrites for later inspection.
 * - commandHandlers: { commandName: (args) => returnValue }
 *   Each value function is serialised so it survives the addInitScript boundary.
 */
function injectTauriMock(page, commandHandlers = {}) {
  const serialised = Object.fromEntries(
    Object.entries(commandHandlers).map(([k, fn]) => [k, fn.toString()])
  )
  return page.addInitScript((handlers) => {
    window.__tauriWrites = []
    window.__TAURI_INTERNALS__ = {
      metadata: {
        currentWindow: { label: 'main' },
        currentWebview: { windowLabel: 'main', label: 'main' },
      },
      invoke(cmd, args) {
        if (cmd === 'write_section') {
          window.__tauriWrites.push({ key: args.key, data: args.data })
        }
        if (handlers[cmd]) {
          return Promise.resolve(new Function('args', `return (${handlers[cmd]})(args)`)(args))
        }
        if (cmd === 'read_section') return Promise.resolve([])
        if (cmd === 'write_section') return Promise.resolve(null)
        return Promise.reject(new Error(`Unhandled Tauri command: ${cmd}`))
      },
      transformCallback(cb) { return cb },
    }
  }, serialised)
}

test('Tauri mode: app reads data via read_section invoke on page load', async ({ page }) => {
  await injectTauriMock(page, {
    read_section: (args) => {
      if (args.key === 'weekly-goals') {
        return [{ id: '1', goal: 'Injected goal', category: 'Test', status: 'Done' }]
      }
      return []
    },
  })

  // HashRouter is active when IS_TAURI is true — use hash routes
  await page.goto('/#/weekly-goals')
  await expect(page.getByText('Injected goal')).toBeVisible()
})

test('Tauri mode: read_section returning [] shows empty state', async ({ page }) => {
  await injectTauriMock(page) // all commands return []

  await page.goto('/#/weekly-goals')
  await expect(page.getByText(/no data yet/i)).toBeVisible()
})

test('Tauri mode: app invokes write_section when a row is saved', async ({ page }) => {
  await injectTauriMock(page)

  await page.goto('/#/weekly-goals')
  await page.getByRole('button', { name: 'Add Row' }).click()
  // Click the first cell to enter edit mode, then type and commit
  await page.locator('tbody tr').first().locator('td').first().click()
  await page.locator('tbody').locator('input[type="text"]').fill('New Tauri goal')
  await page.keyboard.press('Enter')

  // Give the fire-and-forget write a moment to execute
  await page.waitForTimeout(200)

  const writes = await page.evaluate(() => window.__tauriWrites)
  expect(writes.some((w) => w.key === 'weekly-goals')).toBe(true)
})
