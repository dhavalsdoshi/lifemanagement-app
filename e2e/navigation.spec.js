import { test, expect } from '@playwright/test'

// On mobile the sidebar is a hidden drawer — open it before interacting with sidebar links
async function openSidebarIfMobile(page) {
  const vp = page.viewportSize()
  if (vp && vp.width < 768) {
    await page.getByLabel('Open navigation').click()
  }
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    Object.keys(localStorage)
      .filter((k) => k.startsWith('lm-'))
      .forEach((k) => localStorage.removeItem(k))
  })
})

test('loads the dashboard at root', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Welcome Back' })).toBeVisible()
  await expect(page.getByText('Your personal life management dashboard')).toBeVisible()
})

test('shows quick links on dashboard', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('main').getByRole('link', { name: 'Weekly Goals' })).toBeVisible()
  await expect(page.locator('main').getByRole('link', { name: 'Budget' })).toBeVisible()
  await expect(page.locator('main').getByRole('link', { name: 'Habits' })).toBeVisible()
})

test('navigates to a section via sidebar', async ({ page }) => {
  await page.goto('/')
  await openSidebarIfMobile(page)
  await page.locator('aside').getByRole('link', { name: 'Weekly Goals' }).click()
  await expect(page).toHaveURL(/weekly-goals/)
  await expect(page.getByRole('heading', { name: 'Weekly Goals' })).toBeVisible()
})

test('navigates to multiple sections', async ({ page }) => {
  await page.goto('/')

  await openSidebarIfMobile(page)
  await page.locator('aside').getByRole('link', { name: 'Budget' }).click()
  await expect(page).toHaveURL(/budget/)
  await expect(page.getByRole('heading', { name: 'Budget' })).toBeVisible()

  await openSidebarIfMobile(page)
  await page.locator('aside').getByRole('link', { name: 'Gym' }).click()
  await expect(page).toHaveURL(/gym/)
  await expect(page.getByRole('heading', { name: 'Gym' })).toBeVisible()
})

test('highlights the active sidebar link', async ({ page }) => {
  await page.goto('/weekly-goals')
  await openSidebarIfMobile(page)
  const activeLink = page.locator('aside').getByRole('link', { name: 'Weekly Goals' })
  await expect(activeLink).toHaveClass(/bg-sidebar-active/)
})

test('clicking a dashboard quick-link navigates correctly', async ({ page }) => {
  await page.goto('/')
  // Quick links are in the main content area (not the sidebar)
  await page.locator('main').getByRole('link', { name: 'Budget' }).click()
  await expect(page).toHaveURL(/budget/)
})
