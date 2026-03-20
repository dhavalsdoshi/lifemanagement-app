import { test, expect } from '@playwright/test'

// Seed data for weekly-goals (Goal=text, Category=text, Status=select)
const SEED_ROWS = [
  { id: '1', goal: 'Read a book', category: 'Learning', status: 'In Progress' },
  { id: '2', goal: 'Exercise daily', category: 'Health', status: 'Not Started' },
]

test.describe('Empty state', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      Object.keys(localStorage)
        .filter((k) => k.startsWith('lm-'))
        .forEach((k) => localStorage.removeItem(k))
    })
    await page.goto('/weekly-goals')
  })

  test('shows empty state when no data', async ({ page }) => {
    await expect(page.getByText(/no data yet/i)).toBeVisible()
  })

  test('adds a row via Add Row button', async ({ page }) => {
    await expect(page.getByText(/no data yet/i)).toBeVisible()
    await page.getByRole('button', { name: 'Add Row' }).click()
    await expect(page.getByText(/no data yet/i)).not.toBeVisible()
    await expect(page.locator('tbody tr')).toHaveCount(1)
  })
})

test.describe('Table CRUD with seeded data', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript((rows) => {
      localStorage.setItem('lm-weekly-goals', JSON.stringify(rows))
    }, SEED_ROWS)
    await page.goto('/weekly-goals')
  })

  test('displays seeded rows', async ({ page }) => {
    await expect(page.getByText('Read a book')).toBeVisible()
    await expect(page.getByText('Exercise daily')).toBeVisible()
  })

  test('edits a text cell with Enter to commit', async ({ page }) => {
    // Click the first cell of the first row (Goal column)
    await page.locator('tbody tr').first().locator('td span').first().click()
    const input = page.locator('tbody').locator('input[type="text"]')
    await input.fill('Write a novel')
    await page.keyboard.press('Enter')
    await expect(page.getByText('Write a novel')).toBeVisible()
  })

  test('cancels edit with Escape', async ({ page }) => {
    await page.locator('tbody tr').first().locator('td span').first().click()
    const input = page.locator('tbody').locator('input[type="text"]')
    await input.fill('Should not save')
    await page.keyboard.press('Escape')
    await expect(page.getByText('Should not save')).not.toBeVisible()
    await expect(page.getByText('Read a book')).toBeVisible()
  })

  test('edits a select cell and commits immediately on change', async ({ page }) => {
    // Status is the 3rd column (index 2) — type: select
    const statusCell = page.locator('tbody tr').first().locator('td').nth(2).locator('span')
    await statusCell.click()
    await page.getByRole('combobox').selectOption('Done')
    // After select change, editor closes and cell shows new value
    await expect(page.locator('tbody tr').first().locator('td').nth(2)).toContainText('Done')
  })

  test('deletes a row', async ({ page }) => {
    await expect(page.locator('tbody tr')).toHaveCount(2)
    await page.getByLabel('Delete row').first().click()
    await expect(page.locator('tbody tr')).toHaveCount(1)
  })

  test('search filters rows by content', async ({ page }) => {
    await page.getByPlaceholder('Search...').fill('book')
    await expect(page.getByText('Read a book')).toBeVisible()
    await expect(page.getByText('Exercise daily')).not.toBeVisible()
  })

  test('clearing search restores all rows', async ({ page }) => {
    await page.getByPlaceholder('Search...').fill('book')
    await expect(page.locator('tbody tr')).toHaveCount(1)
    await page.getByPlaceholder('Search...').clear()
    await expect(page.locator('tbody tr')).toHaveCount(2)
  })

})

test.describe('Typed field editors', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      // Budget: date, category, description, amount(number), type(select)
      localStorage.setItem('lm-budget', JSON.stringify([
        { id: '1', date: '2024-01-15', category: 'Food', description: 'Groceries', amount: '50', type: 'Expense' },
      ]))
      // Day Reflections: date, rating(select), highlights(textarea), improvements(textarea)
      localStorage.setItem('lm-day-reflections', JSON.stringify([
        { id: '1', date: '2024-01-15', rating: '4', highlights: 'Good day', improvements: 'Sleep earlier' },
      ]))
    })
  })

  test('date column shows a date picker when editing', async ({ page }) => {
    await page.goto('/budget')
    await page.locator('tbody tr').first().locator('td span').first().click()
    await expect(page.locator('input[type="date"]')).toBeVisible()
  })

  test('date values are displayed in human-readable format', async ({ page }) => {
    await page.goto('/budget')
    await expect(page.getByText('Jan 15, 2024')).toBeVisible()
  })

  test('number column shows a number input when editing', async ({ page }) => {
    await page.goto('/budget')
    // Amount is the 4th column (index 3)
    await page.locator('tbody tr').first().locator('td').nth(3).locator('span').click()
    await expect(page.locator('input[type="number"]')).toBeVisible()
  })

  test('textarea column shows a textarea when editing', async ({ page }) => {
    await page.goto('/day-reflections')
    // highlights is the 3rd column (index 2)
    await page.locator('tbody tr').first().locator('td').nth(2).locator('span').click()
    await expect(page.locator('textarea')).toBeVisible()
  })

  test('textarea Enter adds newline instead of committing', async ({ page }) => {
    await page.goto('/day-reflections')
    await page.locator('tbody tr').first().locator('td').nth(2).locator('span').click()
    const textarea = page.locator('textarea')
    await expect(textarea).toBeVisible()
    await textarea.press('Enter')
    // Textarea should still be open (Enter does not commit)
    await expect(textarea).toBeVisible()
  })
})

// Fresh context (no addInitScript) so reload does not wipe localStorage
test('persists edits to localStorage after reload', async ({ page }) => {
  await page.goto('/weekly-goals')
  await page.getByRole('button', { name: 'Add Row' }).click()
  await page.locator('tbody tr').first().locator('td span').first().click()
  await page.locator('tbody').locator('input[type="text"]').fill('Persisted goal')
  await page.keyboard.press('Enter')
  await page.reload()
  await expect(page.getByText('Persisted goal')).toBeVisible()
})
