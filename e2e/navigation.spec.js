import { test, expect } from '@playwright/test'
import { openSidebarIfMobile, clearStorage } from './helpers.js'

test.beforeEach(async ({ page }) => {
  await clearStorage(page)
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
  await page.getByTestId('sidebar').getByRole('link', { name: 'Weekly Goals' }).click()
  await expect(page).toHaveURL(/weekly-goals/)
  await expect(page.getByRole('heading', { name: 'Weekly Goals' })).toBeVisible()
})

test('navigates to multiple sections', async ({ page }) => {
  await page.goto('/')

  await openSidebarIfMobile(page)
  await page.getByTestId('sidebar').getByRole('link', { name: 'Budget' }).click()
  await expect(page).toHaveURL(/budget/)
  await expect(page.getByRole('heading', { name: 'Budget' })).toBeVisible()

  await openSidebarIfMobile(page)
  await page.getByTestId('sidebar').getByRole('link', { name: 'Gym' }).click()
  await expect(page).toHaveURL(/gym/)
  await expect(page.getByRole('heading', { name: 'Gym' })).toBeVisible()
})

test('highlights the active sidebar link', async ({ page }) => {
  await page.goto('/weekly-goals')
  await openSidebarIfMobile(page)
  const activeLink = page.getByTestId('sidebar').getByRole('link', { name: 'Weekly Goals' })
  await expect(activeLink).toHaveClass(/bg-sidebar-active/)
})

test('clicking a dashboard quick-link navigates correctly', async ({ page }) => {
  await page.goto('/')
  await page.locator('main').getByRole('link', { name: 'Budget' }).click()
  await expect(page).toHaveURL(/budget/)
})
