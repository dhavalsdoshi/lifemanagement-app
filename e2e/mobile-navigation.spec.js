import { test, expect } from '@playwright/test'

// Force a mobile viewport so the hamburger is visible even on the desktop Chromium project
test.use({ viewport: { width: 390, height: 844 } })

// The hamburger button is always in the DOM; on desktop it is hidden via CSS.

test('hamburger button is present in the DOM', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByLabel('Open navigation')).toBeAttached()
})

test('tapping hamburger opens the sidebar drawer', async ({ page }) => {
  await page.goto('/')
  const aside = page.locator('aside')
  // Before open: sidebar should have -translate-x-full (closed state)
  await expect(aside).toHaveClass(/-translate-x-full/)
  await page.getByLabel('Open navigation').click()
  await expect(aside).not.toHaveClass(/-translate-x-full/)
  await expect(aside).toHaveClass(/translate-x-0/)
})

test('tapping a nav link closes the drawer', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('Open navigation').click()
  const aside = page.locator('aside')
  await expect(aside).toHaveClass(/translate-x-0/)
  await aside.getByRole('link', { name: 'Weekly Goals' }).click()
  await expect(page).toHaveURL(/weekly-goals/)
  await expect(aside).toHaveClass(/-translate-x-full/)
})

test('tapping the backdrop closes the drawer without navigating', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('Open navigation').click()
  await expect(page.locator('aside')).toHaveClass(/translate-x-0/)
  // Click the backdrop (fixed overlay behind the sidebar)
  await page.locator('[aria-hidden="true"].fixed.inset-0').click()
  await expect(page.locator('aside')).toHaveClass(/-translate-x-full/)
  await expect(page).toHaveURL('/')
})

test('hamburger icon changes to X when drawer is open', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByLabel('Open navigation')).toBeAttached()
  await page.getByLabel('Open navigation').click()
  await expect(page.getByLabel('Close navigation')).toBeAttached()
})
