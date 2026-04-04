import { test, expect } from '@playwright/test'
import JSZip from 'jszip'
import { openSidebarIfMobile, clearStorage, seedSection } from './helpers.js'
import { SidebarPage } from './pages/SidebarPage.js'

/** Build a ZIP buffer with a single weekly-goals.md entry. */
async function buildGoalsZip(goal, category = 'Test', status = 'In Progress') {
  const zip = new JSZip()
  zip.file('weekly-goals.md', [
    '| Goal | Category | Status |',
    '| --- | --- | --- |',
    `| ${goal} | ${category} | ${status} |`,
  ].join('\n') + '\n')
  return zip.generateAsync({ type: 'nodebuffer' })
}

test.beforeEach(async ({ page }) => {
  await clearStorage(page)
  await page.goto('/')
})

test('Markdown export triggers a zip download', async ({ page }) => {
  const sidebar = new SidebarPage(page)
  await openSidebarIfMobile(page)
  const downloadPromise = page.waitForEvent('download')
  await sidebar.export('markdown')
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
  await seedSection(page, 'weekly-goals', [
    { id: '1', goal: 'Existing goal', category: 'Old', status: 'Done' },
  ])
  await page.goto('/')

  const blob = await buildGoalsZip('Imported goal', 'New', 'In Progress')
  await page.locator('input[accept=".zip"]').setInputFiles({
    name: 'import.zip', mimeType: 'application/zip', buffer: blob,
  })

  await page.getByRole('button', { name: /overwrite/i }).click()
  await page.waitForLoadState('load')

  await page.goto('/weekly-goals')
  await expect(page.getByText('Imported goal')).toBeVisible()
  await expect(page.getByText('Existing goal')).not.toBeVisible()
})

test('Markdown import — append adds rows without removing existing data', async ({ page }) => {
  await seedSection(page, 'weekly-goals', [
    { id: '1', goal: 'Existing goal', category: 'Old', status: 'Done' },
  ])
  await page.goto('/')

  const blob = await buildGoalsZip('Appended goal', 'New', 'Not Started')
  await page.locator('input[accept=".zip"]').setInputFiles({
    name: 'import.zip', mimeType: 'application/zip', buffer: blob,
  })

  await page.getByRole('button', { name: /append/i }).click()
  await page.waitForLoadState('load')

  await page.goto('/weekly-goals')
  await expect(page.getByText('Existing goal')).toBeVisible()
  await expect(page.getByText('Appended goal')).toBeVisible()
})

test('Markdown import — cancel closes modal without writing data', async ({ page }) => {
  await seedSection(page, 'weekly-goals', [
    { id: '1', goal: 'Existing goal', category: 'Old', status: 'Done' },
  ])
  await page.goto('/')

  const blob = await buildGoalsZip('Should not appear')
  await page.locator('input[accept=".zip"]').setInputFiles({
    name: 'import.zip', mimeType: 'application/zip', buffer: blob,
  })

  await page.getByRole('button', { name: /cancel/i }).click()

  await page.goto('/weekly-goals')
  await expect(page.getByText('Existing goal')).toBeVisible()
  await expect(page.getByText('Should not appear')).not.toBeVisible()
})

test('Markdown import — ZIP with unknown section files shows no-match alert', async ({ page }) => {
  const zip = new JSZip()
  zip.file('not-a-real-section.md', '| Col |\n| --- |\n| val |\n')
  const blob = await zip.generateAsync({ type: 'nodebuffer' })

  const dialogPromise = page.waitForEvent('dialog')
  await page.locator('input[accept=".zip"]').setInputFiles({
    name: 'unknown.zip', mimeType: 'application/zip', buffer: blob,
  })

  // App shows "No matching sections found" alert
  const dialog = await dialogPromise
  expect(dialog.message()).toMatch(/no matching sections/i)
  await dialog.accept()
})
