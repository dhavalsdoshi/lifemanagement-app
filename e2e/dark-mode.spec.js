import { test, expect } from '@playwright/test'
import { openSidebarIfMobile } from './helpers.js'

test('dark mode toggle button is visible in sidebar', async ({ page }) => {
  await page.goto('/')
  await openSidebarIfMobile(page)
  await expect(page.getByTestId('sidebar').getByRole('button', { name: /dark mode/i })).toBeVisible()
})

test('clicking dark mode toggle adds dark class to html', async ({ page }) => {
  await page.goto('/')
  await openSidebarIfMobile(page)
  await page.getByTestId('sidebar').getByRole('button', { name: /dark mode/i }).click()
  const htmlClass = await page.locator('html').getAttribute('class')
  expect(htmlClass).toContain('dark')
})

test('after switching to dark mode, button label changes to Light Mode', async ({ page }) => {
  await page.goto('/')
  await openSidebarIfMobile(page)
  await page.getByTestId('sidebar').getByRole('button', { name: /dark mode/i }).click()
  await expect(page.getByTestId('sidebar').getByRole('button', { name: /light mode/i })).toBeVisible()
})

test('dark mode preference persists across reload', async ({ page }) => {
  await page.goto('/')
  await openSidebarIfMobile(page)
  await page.getByTestId('sidebar').getByRole('button', { name: /dark mode/i }).click()
  await page.reload()
  const htmlClass = await page.locator('html').getAttribute('class')
  expect(htmlClass).toContain('dark')
})

test('clicking Light Mode removes dark class from html', async ({ page }) => {
  await page.goto('/')
  await openSidebarIfMobile(page)
  // Sidebar stays open after theme toggle (no route change)
  await page.getByTestId('sidebar').getByRole('button', { name: /dark mode/i }).click()
  await page.getByTestId('sidebar').getByRole('button', { name: /light mode/i }).click()
  const htmlClass = await page.locator('html').getAttribute('class')
  expect(htmlClass ?? '').not.toContain('dark')
})
