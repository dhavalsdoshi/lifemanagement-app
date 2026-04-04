import { test, expect } from '@playwright/test'
import { clearStorage, seedSection, seedSections } from './helpers.js'
import { TablePage } from './pages/TablePage.js'

// These tests cover the desktop table UI (inline editing).
// Mobile card+sheet UI is tested in mobile-crud.spec.js.
test.use({ viewport: { width: 1280, height: 800 } })

const SEED_ROWS = [
  { id: '1', goal: 'Read a book', category: 'Learning', status: 'In Progress' },
  { id: '2', goal: 'Exercise daily', category: 'Health', status: 'Not Started' },
]

test.describe('Empty state', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page)
    await page.goto('/weekly-goals')
  })

  test('shows empty state when no data', async ({ page }) => {
    await expect(page.getByText(/no data yet/i)).toBeVisible()
  })

  test('adds a row via Add Row button', async ({ page }) => {
    const table = new TablePage(page)
    await expect(page.getByText(/no data yet/i)).toBeVisible()
    await table.addRow()
    await expect(page.getByText(/no data yet/i)).not.toBeVisible()
    expect(await table.rowCount()).toBe(1)
  })
})

test.describe('Table CRUD with seeded data', () => {
  test.beforeEach(async ({ page }) => {
    await seedSection(page, 'weekly-goals', SEED_ROWS)
    await page.goto('/weekly-goals')
  })

  test('displays seeded rows', async ({ page }) => {
    await expect(page.getByText('Read a book')).toBeVisible()
    await expect(page.getByText('Exercise daily')).toBeVisible()
  })

  test('edits a text cell with Enter to commit', async ({ page }) => {
    const table = new TablePage(page)
    await table.clickCell(0, 'goal')
    await page.locator('tbody').locator('input[type="text"]').fill('Write a novel')
    await page.keyboard.press('Enter')
    await expect(page.getByText('Write a novel')).toBeVisible()
  })

  test('cancels edit with Escape', async ({ page }) => {
    const table = new TablePage(page)
    await table.clickCell(0, 'goal')
    await page.locator('tbody').locator('input[type="text"]').fill('Should not save')
    await page.keyboard.press('Escape')
    await expect(page.getByText('Should not save')).not.toBeVisible()
    await expect(page.getByText('Read a book')).toBeVisible()
  })

  test('edits a select cell and commits immediately on change', async ({ page }) => {
    const table = new TablePage(page)
    await table.clickCell(0, 'status')
    await page.getByRole('combobox').selectOption('Done')
    await expect(page.locator('tbody tr').first().locator('[data-col="status"]')).toContainText('Done')
  })

  test('deletes a row', async ({ page }) => {
    const table = new TablePage(page)
    expect(await table.rowCount()).toBe(2)
    await table.deleteRow(0)
    expect(await table.rowCount()).toBe(1)
  })

  test('search filters rows by content', async ({ page }) => {
    const table = new TablePage(page)
    await table.search('book')
    await expect(page.getByText('Read a book')).toBeVisible()
    await expect(page.getByText('Exercise daily')).not.toBeVisible()
  })

  test('clearing search restores all rows', async ({ page }) => {
    const table = new TablePage(page)
    await table.search('book')
    expect(await table.rowCount()).toBe(1)
    await table.clearSearch()
    expect(await table.rowCount()).toBe(2)
  })
})

test.describe('Typed field editors', () => {
  test.beforeEach(async ({ page }) => {
    await seedSections(page, {
      budget: [
        { id: '1', date: '2024-01-15', category: 'Food', description: 'Groceries', amount: '50', type: 'Expense' },
      ],
      'day-reflections': [
        { id: '1', date: '2024-01-15', rating: '4', highlights: 'Good day', improvements: 'Sleep earlier' },
      ],
    })
  })

  test('date column shows a date picker when editing', async ({ page }) => {
    const table = new TablePage(page)
    await page.goto('/budget')
    await table.clickCell(0, 'date')
    await expect(page.locator('input[type="date"]')).toBeVisible()
  })

  test('date values are displayed in human-readable format', async ({ page }) => {
    await page.goto('/budget')
    await expect(page.getByText('Jan 15, 2024')).toBeVisible()
  })

  test('number column shows a number input when editing', async ({ page }) => {
    const table = new TablePage(page)
    await page.goto('/budget')
    await table.clickCell(0, 'amount')
    await expect(page.locator('input[type="number"]')).toBeVisible()
  })

  test('textarea column shows a textarea when editing', async ({ page }) => {
    const table = new TablePage(page)
    await page.goto('/day-reflections')
    await table.clickCell(0, 'highlights')
    await expect(page.locator('textarea')).toBeVisible()
  })

  test('textarea Enter adds newline instead of committing', async ({ page }) => {
    const table = new TablePage(page)
    await page.goto('/day-reflections')
    await table.clickCell(0, 'highlights')
    const textarea = page.locator('textarea')
    await expect(textarea).toBeVisible()
    await textarea.press('Enter')
    await expect(textarea).toBeVisible()
  })
})

// Fresh context — no clearStorage so reload preserves data written during the test
test('persists edits to localStorage after reload', async ({ page }) => {
  const table = new TablePage(page)
  await page.goto('/weekly-goals')
  await table.addRow()
  await table.clickFirstCell(0)
  await page.locator('tbody').locator('input[type="text"]').fill('Persisted goal')
  await page.keyboard.press('Enter')
  await page.reload()
  await expect(page.getByText('Persisted goal')).toBeVisible()
})
