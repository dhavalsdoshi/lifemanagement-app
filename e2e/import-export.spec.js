import { test, expect } from '@playwright/test'
import ExcelJS from 'exceljs'
import { openSidebarIfMobile, clearStorage } from './helpers.js'
import { SidebarPage } from './pages/SidebarPage.js'

test.beforeEach(async ({ page }) => {
  await clearStorage(page)
  await page.goto('/')
})

test('export Excel triggers an xlsx download', async ({ page }) => {
  const sidebar = new SidebarPage(page)
  await openSidebarIfMobile(page)
  const downloadPromise = page.waitForEvent('download')
  await sidebar.export('excel')
  const download = await downloadPromise
  expect(download.suggestedFilename()).toMatch(/\.xlsx$/)
})

test('xlsx file input is present and accepts xlsx files', async ({ page }) => {
  await expect(page.locator('input[accept=".xlsx,.xls"]')).toBeAttached()
})

test('zip file input is present and accepts zip files', async ({ page }) => {
  await expect(page.locator('input[accept=".zip"]')).toBeAttached()
})

test('importing a corrupt xlsx file shows an error alert', async ({ page }) => {
  const dialogPromise = page.waitForEvent('dialog')
  const corruptZip = Buffer.concat([Buffer.from([0x50, 0x4b, 0x03, 0x04]), Buffer.alloc(64, 0xff)])
  await page.locator('input[accept=".xlsx,.xls"]').setInputFiles({
    name: 'bad.xlsx',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    buffer: corruptZip,
  })
  const dialog = await dialogPromise
  expect(dialog.message()).toMatch(/failed to import/i)
  await dialog.accept()
})

test('importing a valid xlsx file loads data into the correct section', async ({ page }) => {
  // Build a real xlsx workbook with one Weekly Goals row
  const wb = new ExcelJS.Workbook()
  const ws = wb.addWorksheet('Weekly Goals')
  ws.addRow(['Goal', 'Category', 'Status'])
  ws.addRow(['Imported goal', 'Test', 'Done'])
  const buffer = await wb.xlsx.writeBuffer()

  // Start watching for the reload triggered by window.location.reload() before uploading
  const reloadPromise = page.waitForNavigation()
  await page.locator('input[accept=".xlsx,.xls"]').setInputFiles({
    name: 'import.xlsx',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    buffer: Buffer.from(buffer),
  })
  await reloadPromise

  await page.goto('/weekly-goals')
  await expect(page.getByText('Imported goal')).toBeVisible()
})

test('importing xlsx with unknown sheets ignores them silently', async ({ page }) => {
  const wb = new ExcelJS.Workbook()
  const ws = wb.addWorksheet('Unknown Sheet')
  ws.addRow(['Foo'])
  ws.addRow(['bar'])
  const buffer = await wb.xlsx.writeBuffer()

  // No dialog should appear (not an error — just nothing imported)
  let dialogFired = false
  page.on('dialog', () => { dialogFired = true })

  await page.locator('input[accept=".xlsx,.xls"]').setInputFiles({
    name: 'unknown.xlsx',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    buffer: Buffer.from(buffer),
  })

  // Wait a moment then confirm no error dialog
  await page.waitForTimeout(500)
  expect(dialogFired).toBe(false)
})
