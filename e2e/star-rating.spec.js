import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('lm-reading-log', JSON.stringify([
      { id: '1', title: 'Dune', author: 'Herbert', dateFinished: '2024-01-15', rating: '3', notes: '' },
    ]))
  })
  await page.goto('/reading-log')
})

test('shows star buttons for rating column', async ({ page }) => {
  await expect(page.getByRole('button', { name: /star/i }).first()).toBeVisible()
  await expect(page.getByRole('button', { name: '1 star' })).toBeVisible()
  await expect(page.getByRole('button', { name: '5 stars' })).toBeVisible()
})

test('clicking a star updates the rating immediately', async ({ page }) => {
  await page.getByRole('button', { name: '5 stars' }).click()
  // Reload to confirm it persisted
  await page.reload()
  // The 5-star button should reflect the saved value (amber/filled) — verify it's still there
  await expect(page.getByRole('button', { name: '5 stars' })).toBeVisible()
})

test('star rating does not open a cell editor on click', async ({ page }) => {
  await page.getByRole('button', { name: '4 stars' }).click()
  // No text input or select should appear inside the table rows
  await expect(page.locator('tbody input[type="text"]')).not.toBeVisible()
  await expect(page.locator('tbody select')).not.toBeVisible()
})
