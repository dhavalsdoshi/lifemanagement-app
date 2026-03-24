import { test, expect } from '@playwright/test'
import JSZip from 'jszip'

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

test('Markdown export triggers a zip download', async ({ page }) => {
  await openSidebarIfMobile(page)
  await page.getByRole('button', { name: /export/i }).click()
  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: /markdown/i }).click()
  const download = await downloadPromise
  expect(download.suggestedFilename()).toMatch(/\.zip$/)
})

test('importing a corrupt zip shows an error alert', async ({ page }) => {
  const dialogPromise = page.waitForEvent('dialog')

  const corrupt = Buffer.concat([Buffer.from([0x50, 0x4b, 0x03, 0x04]), Buffer.alloc(64, 0xff)])
  await page.locator('input[accept=".zip"]').setInputFiles({
    name: 'bad.zip',
    mimeType: 'application/zip',
    buffer: corrupt,
  })

  const dialog = await dialogPromise
  expect(dialog.message()).toMatch(/failed to import/i)
  await dialog.accept()
})

test('Markdown import — overwrite replaces existing data', async ({ page }) => {
  // Seed existing data
  await page.addInitScript(() => {
    localStorage.setItem('lm-weekly-goals', JSON.stringify([
      { id: '1', goal: 'Existing goal', category: 'Old', status: 'Done' },
    ]))
  })
  await page.goto('/')

  // Build a valid ZIP with one section
  const zip = new JSZip()
  zip.file('weekly-goals.md', [
    '| Goal | Category | Status |',
    '| --- | --- | --- |',
    '| Imported goal | New | In Progress |',
  ].join('\n') + '\n')
  const blob = await zip.generateAsync({ type: 'nodebuffer' })

  const dialogPromise = page.waitForEvent('dialog')
  await page.locator('input[accept=".zip"]').setInputFiles({
    name: 'import.zip',
    mimeType: 'application/zip',
    buffer: blob,
  })

  // ImportModeModal appears — click Overwrite
  await page.getByRole('button', { name: /overwrite/i }).click()

  // Page reloads — navigate to verify
  await page.goto('/weekly-goals')
  await expect(page.getByText('Imported goal')).toBeVisible()
  await expect(page.getByText('Existing goal')).not.toBeVisible()
})

test('Markdown import — append adds rows without removing existing data', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('lm-weekly-goals', JSON.stringify([
      { id: '1', goal: 'Existing goal', category: 'Old', status: 'Done' },
    ]))
  })
  await page.goto('/')

  const zip = new JSZip()
  zip.file('weekly-goals.md', [
    '| Goal | Category | Status |',
    '| --- | --- | --- |',
    '| Appended goal | New | Not Started |',
  ].join('\n') + '\n')
  const blob = await zip.generateAsync({ type: 'nodebuffer' })

  await page.locator('input[accept=".zip"]').setInputFiles({
    name: 'import.zip',
    mimeType: 'application/zip',
    buffer: blob,
  })

  await page.getByRole('button', { name: /append/i }).click()

  await page.goto('/weekly-goals')
  await expect(page.getByText('Existing goal')).toBeVisible()
  await expect(page.getByText('Appended goal')).toBeVisible()
})

test('Markdown import — cancel closes modal without writing data', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('lm-weekly-goals', JSON.stringify([
      { id: '1', goal: 'Existing goal', category: 'Old', status: 'Done' },
    ]))
  })
  await page.goto('/')

  const zip = new JSZip()
  zip.file('weekly-goals.md', [
    '| Goal | Category | Status |',
    '| --- | --- | --- |',
    '| Should not appear | New | Done |',
  ].join('\n') + '\n')
  const blob = await zip.generateAsync({ type: 'nodebuffer' })

  await page.locator('input[accept=".zip"]').setInputFiles({
    name: 'import.zip',
    mimeType: 'application/zip',
    buffer: blob,
  })

  // Modal appears — click Cancel
  await page.getByRole('button', { name: /cancel/i }).click()

  // Modal dismissed, data unchanged
  await page.goto('/weekly-goals')
  await expect(page.getByText('Existing goal')).toBeVisible()
  await expect(page.getByText('Should not appear')).not.toBeVisible()
})
