/**
 * Page object for Sidebar interactions.
 *
 * Usage:
 *   const sidebar = new SidebarPage(page)
 *   await sidebar.navigate('Weekly Goals')
 *   await sidebar.export('excel')
 */
export class SidebarPage {
  constructor(page) {
    this.page = page
    this.sidebar = page.getByTestId('sidebar')
  }

  /** Open the sidebar drawer if the viewport is mobile-sized. */
  async openIfMobile() {
    const vp = this.page.viewportSize()
    if (vp && vp.width < 768) {
      await this.page.getByLabel('Open navigation').click()
    }
  }

  /** Click a nav link by name, opening the sidebar first on mobile. */
  async navigate(linkName) {
    await this.openIfMobile()
    await this.sidebar.getByRole('link', { name: linkName }).click()
  }

  /** Open the export dropdown and click the format button ('excel' or 'markdown'). */
  async export(format) {
    await this.openIfMobile()
    await this.page.getByRole('button', { name: /export/i }).click()
    await this.page.getByRole('button', { name: new RegExp(format, 'i') }).click()
  }

  /**
   * Set a file on the hidden import input.
   * @param {'xlsx'|'zip'} format
   * @param {{ name, mimeType, buffer }} fileOptions  — Playwright setInputFiles options
   */
  async importFile(format, fileOptions) {
    const accept = format === 'xlsx' ? '.xlsx,.xls' : '.zip'
    await this.page.locator(`input[accept="${accept}"]`).setInputFiles(fileOptions)
  }

  /** Toggle dark/light mode. */
  async toggleTheme() {
    await this.openIfMobile()
    await this.sidebar.getByRole('button', { name: /dark mode|light mode/i }).click()
  }
}
