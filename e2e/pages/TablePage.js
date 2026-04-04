/**
 * Page object for the desktop DataTable UI.
 *
 * Targets cells by their data-col attribute (added to each <td>) so tests
 * are immune to column reordering.
 *
 * Usage:
 *   const table = new TablePage(page)
 *   await table.clickCell(0, 'goal')      // first row, goal column
 *   await table.rowCount()                // number of tbody rows
 */
export class TablePage {
  constructor(page) {
    this.page = page
  }

  /** Number of data rows currently visible in the table. */
  async rowCount() {
    return this.page.locator('tbody tr').count()
  }

  /** Click the display span in a specific row + column (by col key). */
  async clickCell(rowIndex, colKey) {
    await this.page
      .locator('tbody tr')
      .nth(rowIndex)
      .locator(`[data-col="${colKey}"] span`)
      .click()
  }

  /** Click the first cell (first column) of a row. */
  async clickFirstCell(rowIndex = 0) {
    await this.page
      .locator('tbody tr')
      .nth(rowIndex)
      .locator('td span')
      .first()
      .click()
  }

  /** Click Add Row button. */
  async addRow() {
    await this.page.getByRole('button', { name: 'Add Row' }).click()
  }

  /** Click a row's delete button by row index. */
  async deleteRow(rowIndex = 0) {
    await this.page.getByLabel('Delete row').nth(rowIndex).click()
  }

  /** Fill the search box. */
  async search(term) {
    await this.page.getByPlaceholder('Search...').fill(term)
  }

  /** Clear the search box. */
  async clearSearch() {
    await this.page.getByPlaceholder('Search...').clear()
  }

  /** Get the text content of a specific cell. */
  async getCellText(rowIndex, colKey) {
    return this.page
      .locator('tbody tr')
      .nth(rowIndex)
      .locator(`[data-col="${colKey}"]`)
      .innerText()
  }
}
