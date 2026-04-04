import { test, expect } from '@playwright/test'

// Force a mobile viewport so the hamburger is visible even on the desktop Chromium project
test.use({ viewport: { width: 390, height: 844 } })

test('hamburger button is present in the DOM', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByLabel('Open navigation')).toBeAttached()
})

test('tapping hamburger opens the sidebar drawer', async ({ page }) => {
  await page.goto('/')
  const sidebar = page.getByTestId('sidebar')
  await expect(sidebar).toHaveAttribute('data-sidebar-open', 'false')
  await page.getByLabel('Open navigation').click()
  await expect(sidebar).toHaveAttribute('data-sidebar-open', 'true')
})

test('tapping a nav link closes the drawer', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('Open navigation').click()
  const sidebar = page.getByTestId('sidebar')
  await expect(sidebar).toHaveAttribute('data-sidebar-open', 'true')
  await sidebar.getByRole('link', { name: 'Weekly Goals' }).click()
  await expect(page).toHaveURL(/weekly-goals/)
  await expect(sidebar).toHaveAttribute('data-sidebar-open', 'false')
})

test('tapping the backdrop closes the drawer without navigating', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('Open navigation').click()
  await expect(page.getByTestId('sidebar')).toHaveAttribute('data-sidebar-open', 'true')
  await page.getByTestId('sidebar-backdrop').click()
  await expect(page.getByTestId('sidebar')).toHaveAttribute('data-sidebar-open', 'false')
  await expect(page).toHaveURL('/')
})

test('hamburger icon changes to X when drawer is open', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByLabel('Open navigation')).toBeAttached()
  await page.getByLabel('Open navigation').click()
  await expect(page.getByLabel('Close navigation')).toBeAttached()
})
