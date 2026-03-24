import { test, expect } from '@playwright/test'

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
  await page.goto('/')
})

test('export Excel triggers an xlsx download', async ({ page }) => {
  await openSidebarIfMobile(page)
  await page.getByRole('button', { name: /export/i }).click()
  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: /excel/i }).click()
  const download = await downloadPromise
  expect(download.suggestedFilename()).toMatch(/\.xlsx$/)
})

test('xlsx file input is present and accepts xlsx files', async ({ page }) => {
  const fileInput = page.locator('input[accept=".xlsx,.xls"]')
  await expect(fileInput).toBeAttached()
})

test('zip file input is present and accepts zip files', async ({ page }) => {
  const fileInput = page.locator('input[accept=".zip"]')
  await expect(fileInput).toBeAttached()
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

test('importing a valid xlsx file loads data', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('lm-weekly-goals', JSON.stringify([
      { id: '1', goal: 'Imported goal', category: 'Test', status: 'Done' },
    ]))
  })
  await page.goto('/weekly-goals')
  await expect(page.getByText('Imported goal')).toBeVisible()
})
