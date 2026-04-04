import { test, expect } from '@playwright/test'
import { clearStorage, seedSection } from './helpers.js'

// Force mobile viewport so the card list + bottom sheet UI is active
test.use({ viewport: { width: 390, height: 844 } })

const SEED_ROWS = [
  { id: '1', goal: 'Read a book', category: 'Learning', status: 'In Progress' },
  { id: '2', goal: 'Exercise daily', category: 'Health', status: 'Not Started' },
]

test.describe('Mobile card list', () => {
  test.beforeEach(async ({ page }) => {
    await seedSection(page, 'weekly-goals', SEED_ROWS)
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
    await seedSection(page, 'weekly-goals', SEED_ROWS)
    await page.goto('/weekly-goals')
  })

  test('tapping edit opens the bottom sheet with row data', async ({ page }) => {
    await page.getByLabel('Edit row').first().click()
    await expect(page.getByTestId('sheet-title')).toHaveText('Edit row')
    await expect(page.getByTestId('sheet-panel').getByRole('textbox').first()).toHaveValue('Read a book')
  })

  test('saving edits updates the card', async ({ page }) => {
    await page.getByLabel('Edit row').first().click()
    await page.getByTestId('sheet-panel').getByRole('textbox').first().fill('Write a novel')
    await page.getByTestId('sheet-submit').click()
    await expect(page.getByText('Write a novel')).toBeVisible()
    await expect(page.getByText('Read a book')).not.toBeVisible()
  })

  test('cancel closes the sheet without saving', async ({ page }) => {
    await page.getByLabel('Edit row').first().click()
    await page.getByTestId('sheet-panel').getByRole('textbox').first().fill('Should not save')
    await page.getByRole('button', { name: 'Cancel' }).click()
    await expect(page.getByText('Read a book')).toBeVisible()
    await expect(page.getByText('Should not save')).not.toBeVisible()
  })

  test('tapping the backdrop closes the sheet without saving', async ({ page }) => {
    await page.getByLabel('Edit row').first().click()
    await expect(page.getByTestId('sheet-title')).toHaveText('Edit row')
    // Click near the top of the viewport where the backdrop is exposed above the sheet
    await page.getByTestId('sheet-backdrop').click({ position: { x: 195, y: 50 } })
    await expect(page.getByTestId('sheet-title')).not.toBeVisible()
    await expect(page.getByText('Read a book')).toBeVisible()
  })
})

test.describe('Mobile bottom sheet — add', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page)
    await page.goto('/weekly-goals')
  })

  test('shows empty state when no data', async ({ page }) => {
    await expect(page.getByText(/no data yet/i)).toBeVisible()
  })

  test('FAB opens blank add sheet', async ({ page }) => {
    await page.getByLabel('Add row').click()
    await expect(page.getByTestId('sheet-title')).toHaveText('Add row')
  })

  test('adding a row via sheet creates a card', async ({ page }) => {
    await page.getByLabel('Add row').click()
    await page.getByTestId('sheet-panel').getByRole('textbox').first().fill('New goal')
    await page.getByTestId('sheet-submit').click()
    await expect(page.getByText('New goal')).toBeVisible()
  })

  test('new row persists after reload', async ({ page }) => {
    await page.getByLabel('Add row').click()
    await page.getByTestId('sheet-panel').getByRole('textbox').first().fill('Persistent goal')
    await page.getByTestId('sheet-submit').click()
    await expect(page.getByText('Persistent goal')).toBeVisible()
    await page.reload()
    await expect(page.getByText('Persistent goal')).toBeVisible()
  })
})
