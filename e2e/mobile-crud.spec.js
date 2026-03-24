import { test, expect } from '@playwright/test'

// Force mobile viewport so the card list + bottom sheet UI is active
test.use({ viewport: { width: 390, height: 844 } })

const SEED_ROWS = [
  { id: '1', goal: 'Read a book', category: 'Learning', status: 'In Progress' },
  { id: '2', goal: 'Exercise daily', category: 'Health', status: 'Not Started' },
]

test.describe('Mobile card list', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript((rows) => {
      localStorage.setItem('lm-weekly-goals', JSON.stringify(rows))
    }, SEED_ROWS)
    await page.goto('/weekly-goals')
  })

  test('shows seeded rows as cards', async ({ page }) => {
    await expect(page.getByText('Read a book')).toBeVisible()
    await expect(page.getByText('Exercise daily')).toBeVisible()
  })

  test('shows status badge on each card', async ({ page }) => {
    await expect(page.getByText('In Progress')).toBeVisible()
    await expect(page.getByText('Not Started')).toBeVisible()
  })

  test('search filters cards by content', async ({ page }) => {
    await page.getByPlaceholder('Search...').fill('book')
    await expect(page.getByText('Read a book')).toBeVisible()
    await expect(page.getByText('Exercise daily')).not.toBeVisible()
  })

  test('delete button removes a card', async ({ page }) => {
    await expect(page.getByText('Read a book')).toBeVisible()
    await page.getByLabel('Delete row').first().click()
    await expect(page.getByText('Read a book')).not.toBeVisible()
    await expect(page.getByText('Exercise daily')).toBeVisible()
  })
})

test.describe('Mobile bottom sheet — edit', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript((rows) => {
      localStorage.setItem('lm-weekly-goals', JSON.stringify(rows))
    }, SEED_ROWS)
    await page.goto('/weekly-goals')
  })

  test('tapping edit opens the bottom sheet with row data', async ({ page }) => {
    await page.getByLabel('Edit row').first().click()
    await expect(page.getByText('Edit row')).toBeVisible()
    await expect(page.getByDisplayValue('Read a book')).toBeVisible()
  })

  test('saving edits updates the card', async ({ page }) => {
    await page.getByLabel('Edit row').first().click()
    const input = page.getByDisplayValue('Read a book')
    await input.fill('Write a novel')
    await page.getByRole('button', { name: 'Save changes' }).click()
    await expect(page.getByText('Write a novel')).toBeVisible()
    await expect(page.getByText('Read a book')).not.toBeVisible()
  })

  test('cancel closes the sheet without saving', async ({ page }) => {
    await page.getByLabel('Edit row').first().click()
    const input = page.getByDisplayValue('Read a book')
    await input.fill('Should not save')
    await page.getByRole('button', { name: 'Cancel' }).click()
    await expect(page.getByText('Read a book')).toBeVisible()
    await expect(page.getByText('Should not save')).not.toBeVisible()
  })

  test('tapping the backdrop closes the sheet without saving', async ({ page }) => {
    await page.getByLabel('Edit row').first().click()
    await expect(page.getByText('Edit row')).toBeVisible()
    await page.getByTestId('sheet-backdrop').click()
    await expect(page.getByText('Edit row')).not.toBeVisible()
    await expect(page.getByText('Read a book')).toBeVisible()
  })
})

test.describe('Mobile bottom sheet — add', () => {
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

  test('FAB opens blank add sheet', async ({ page }) => {
    await page.getByLabel('Add row').click()
    await expect(page.getByText('Add row')).toBeVisible()
  })

  test('adding a row via sheet creates a card', async ({ page }) => {
    await page.getByLabel('Add row').click()
    // Fill in the first text field (Goal)
    const inputs = page.getByRole('textbox')
    await inputs.first().fill('New goal')
    await page.getByRole('button', { name: 'Add row' }).click()
    await expect(page.getByText('New goal')).toBeVisible()
  })

  test('new row persists after reload', async ({ page }) => {
    await page.getByLabel('Add row').click()
    await page.getByRole('textbox').first().fill('Persistent goal')
    await page.getByRole('button', { name: 'Add row' }).click()
    await expect(page.getByText('Persistent goal')).toBeVisible()
    await page.reload()
    await expect(page.getByText('Persistent goal')).toBeVisible()
  })
})
