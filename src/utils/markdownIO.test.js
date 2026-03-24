import { describe, it, expect } from 'vitest'
import JSZip from 'jszip'
import {
  serializeCell,
  deserializeCell,
  sectionToMarkdown,
  markdownToRows,
  exportToMarkdownZip,
  importFromMarkdownZip,
} from './markdownIO'
import { SHEET_CONFIG } from './excelIO'

// ── Phase 1: Cell serialization ───────────────────────────────────────────────

describe('serializeCell', () => {
  it('returns empty string for null/undefined/empty', () => {
    expect(serializeCell('', 'text')).toBe('')
    expect(serializeCell(null, 'text')).toBe('')
    expect(serializeCell(undefined, 'text')).toBe('')
  })

  it('escapes pipe chars in text', () => {
    expect(serializeCell('hello | world', 'text')).toBe('hello \\| world')
  })

  it('converts newlines to <br> and escapes pipes in textarea', () => {
    expect(serializeCell('line1\nline2', 'textarea')).toBe('line1<br>line2')
    expect(serializeCell('a | b\nc', 'textarea')).toBe('a \\| b<br>c')
  })

  it('produces filled+empty star chars for rating', () => {
    expect(serializeCell('0', 'rating')).toBe('☆☆☆☆☆')
    expect(serializeCell('3', 'rating')).toBe('★★★☆☆')
    expect(serializeCell('5', 'rating')).toBe('★★★★★')
  })

  it('passes through date, number, url, select unchanged (pipes escaped)', () => {
    expect(serializeCell('2024-01-15', 'date')).toBe('2024-01-15')
    expect(serializeCell('42', 'number')).toBe('42')
    expect(serializeCell('https://example.com', 'url')).toBe('https://example.com')
    expect(serializeCell('In Progress', 'select')).toBe('In Progress')
  })
})

describe('deserializeCell', () => {
  it('returns empty string for empty/whitespace input', () => {
    expect(deserializeCell('', 'text')).toBe('')
    expect(deserializeCell('   ', 'text')).toBe('')
  })

  it('unescapes pipe chars in text', () => {
    expect(deserializeCell('hello \\| world', 'text')).toBe('hello | world')
  })

  it('converts <br> to newlines and unescapes pipes in textarea', () => {
    expect(deserializeCell('line1<br>line2', 'textarea')).toBe('line1\nline2')
    expect(deserializeCell('a \\| b<br>c', 'textarea')).toBe('a | b\nc')
  })

  it('counts filled star chars for rating', () => {
    expect(deserializeCell('☆☆☆☆☆', 'rating')).toBe('0')
    expect(deserializeCell('★★★☆☆', 'rating')).toBe('3')
    expect(deserializeCell('★★★★★', 'rating')).toBe('5')
  })

  it('passes through date, number, url, select unchanged', () => {
    expect(deserializeCell('2024-01-15', 'date')).toBe('2024-01-15')
    expect(deserializeCell('42', 'number')).toBe('42')
    expect(deserializeCell('In Progress', 'select')).toBe('In Progress')
  })
})

// ── Phase 2: Section export ───────────────────────────────────────────────────

describe('sectionToMarkdown', () => {
  const rows = [
    { id: '1', goal: 'Read a book', category: 'Learning', status: 'In Progress' },
    { id: '2', goal: 'Exercise', category: 'Health', status: 'Done' },
  ]

  it('includes frontmatter with section name and storageKey', () => {
    const md = sectionToMarkdown('weekly-goals', rows)
    expect(md).toContain('section: Weekly Goals')
    expect(md).toContain('storageKey: weekly-goals')
    expect(md).toContain('exportedAt:')
  })

  it('includes a header row with column headers', () => {
    const md = sectionToMarkdown('weekly-goals', rows)
    expect(md).toContain('| Goal | Category | Status |')
  })

  it('includes a separator row', () => {
    const md = sectionToMarkdown('weekly-goals', rows)
    expect(md).toContain('| --- | --- | --- |')
  })

  it('includes one data row per item', () => {
    const md = sectionToMarkdown('weekly-goals', rows)
    expect(md).toContain('| Read a book | Learning | In Progress |')
    expect(md).toContain('| Exercise | Health | Done |')
  })

  it('serializes rating columns as star chars', () => {
    const ratingRows = [{ id: '1', title: 'Dune', author: 'Frank', dateFinished: '2024-01-15', rating: '4', notes: '' }]
    const md = sectionToMarkdown('reading-log', ratingRows)
    expect(md).toContain('★★★★☆')
  })

  it('serializes textarea newlines as <br>', () => {
    const notesRows = [{ id: '1', title: 'Dune', author: 'Frank', dateFinished: '', rating: '0', notes: 'line1\nline2' }]
    const md = sectionToMarkdown('reading-log', notesRows)
    expect(md).toContain('line1<br>line2')
  })

  it('produces a valid empty table for an empty section', () => {
    const md = sectionToMarkdown('weekly-goals', [])
    expect(md).toContain('| Goal | Category | Status |')
    expect(md).toContain('| --- | --- | --- |')
  })
})

// ── Phase 3: Section import ───────────────────────────────────────────────────

describe('markdownToRows', () => {
  const md = `---
section: Weekly Goals
storageKey: weekly-goals
exportedAt: 2026-01-01T00:00:00.000Z
---

| Goal | Category | Status |
| --- | --- | --- |
| Read a book | Learning | In Progress |
| Exercise daily | Health | Done |
`

  it('returns one object per data row', () => {
    const rows = markdownToRows('weekly-goals', md)
    expect(rows).toHaveLength(2)
  })

  it('maps headers to column keys', () => {
    const rows = markdownToRows('weekly-goals', md)
    expect(rows[0].goal).toBe('Read a book')
    expect(rows[0].category).toBe('Learning')
    expect(rows[0].status).toBe('In Progress')
  })

  it('assigns a unique id to each row', () => {
    const rows = markdownToRows('weekly-goals', md)
    expect(rows[0].id).toBeTruthy()
    expect(rows[1].id).toBeTruthy()
    expect(rows[0].id).not.toBe(rows[1].id)
  })

  it('ignores unknown columns', () => {
    const mdExtra = `| Goal | Category | Status | Unknown |
| --- | --- | --- | --- |
| Test | A | Done | extra |
`
    const rows = markdownToRows('weekly-goals', mdExtra)
    expect(rows[0]).not.toHaveProperty('unknown')
  })

  it('returns empty array when no data rows', () => {
    const empty = `---
section: Weekly Goals
---

| Goal | Category | Status |
| --- | --- | --- |
`
    expect(markdownToRows('weekly-goals', empty)).toHaveLength(0)
  })

  it('decodes <br> back to newlines in textarea columns', () => {
    const mdNotes = `| Title | Author | Date Finished | Rating | Notes |
| --- | --- | --- | --- | --- |
| Dune | Frank | 2024-01-15 | ★★★★★ | Line1<br>Line2 |
`
    const rows = markdownToRows('reading-log', mdNotes)
    expect(rows[0].notes).toBe('Line1\nLine2')
  })

  it('decodes star chars to numeric string for rating columns', () => {
    const mdRating = `| Title | Author | Date Finished | Rating | Notes |
| --- | --- | --- | --- | --- |
| Dune | Frank | 2024-01-15 | ★★★★☆ | Good |
`
    const rows = markdownToRows('reading-log', mdRating)
    expect(rows[0].rating).toBe('4')
  })

  it('unescapes pipe chars in text columns', () => {
    const mdPipes = `| Goal | Category | Status |
| --- | --- | --- |
| hello \\| world | Test | Done |
`
    const rows = markdownToRows('weekly-goals', mdPipes)
    expect(rows[0].goal).toBe('hello | world')
  })

  it('handles markdown without frontmatter', () => {
    const mdNoFrontmatter = `| Goal | Category | Status |
| --- | --- | --- |
| Just a goal | Work | Not Started |
`
    const rows = markdownToRows('weekly-goals', mdNoFrontmatter)
    expect(rows).toHaveLength(1)
    expect(rows[0].goal).toBe('Just a goal')
  })
})

// ── Phase 4 & 5: ZIP export / import ─────────────────────────────────────────

describe('exportToMarkdownZip', () => {
  function makeAllData(overrides = {}) {
    const allData = {}
    Object.keys(SHEET_CONFIG).forEach((k) => { allData[k] = [] })
    return { ...allData, ...overrides }
  }

  it('returns a Blob', async () => {
    const blob = await exportToMarkdownZip(makeAllData())
    expect(blob).toBeInstanceOf(Blob)
  })

  it('ZIP contains one .md file per section', async () => {
    const blob = await exportToMarkdownZip(makeAllData())
    const zip = await JSZip.loadAsync(blob)
    const files = Object.keys(zip.files)
    expect(files).toHaveLength(Object.keys(SHEET_CONFIG).length)
    expect(files).toContain('weekly-goals.md')
    expect(files).toContain('reading-log.md')
    expect(files).toContain('budget.md')
  })

  it('file content matches sectionToMarkdown output', async () => {
    const rows = [{ id: '1', goal: 'Test goal', category: 'Test', status: 'Done' }]
    const blob = await exportToMarkdownZip(makeAllData({ 'weekly-goals': rows }))
    const zip = await JSZip.loadAsync(blob)
    const content = await zip.file('weekly-goals.md').async('string')
    expect(content).toContain('| Test goal | Test | Done |')
  })
})

describe('importFromMarkdownZip', () => {
  async function makeZipFile(entries) {
    const zip = new JSZip()
    for (const [name, content] of Object.entries(entries)) {
      zip.file(name, content)
    }
    const blob = await zip.generateAsync({ type: 'blob' })
    return new File([blob], 'test.zip', { type: 'application/zip' })
  }

  it('returns rows for known sections in the ZIP', async () => {
    const md = `| Goal | Category | Status |
| --- | --- | --- |
| Test goal | Work | Done |
`
    const file = await makeZipFile({ 'weekly-goals.md': md })
    const result = await importFromMarkdownZip(file)
    expect(result['weekly-goals']).toHaveLength(1)
    expect(result['weekly-goals'][0].goal).toBe('Test goal')
  })

  it('ignores files not matching any storageKey', async () => {
    const file = await makeZipFile({ 'unknown-section.md': '# nothing', 'random.txt': 'hello' })
    const result = await importFromMarkdownZip(file)
    expect(Object.keys(result)).toHaveLength(0)
  })

  it('rejects on a corrupt ZIP', async () => {
    const badFile = new File(
      [new Uint8Array([0x50, 0x4b, 0x03, 0x04, 0xff, 0xff, 0x00, 0x00])],
      'bad.zip',
      { type: 'application/zip' }
    )
    await expect(importFromMarkdownZip(badFile)).rejects.toThrow()
  })
})

// ── Phase 6: Roundtrip fidelity ───────────────────────────────────────────────

describe('Roundtrip fidelity', () => {
  it('export → import preserves all field values across column types', async () => {
    const allData = {}
    Object.keys(SHEET_CONFIG).forEach((k) => { allData[k] = [] })

    allData['weekly-goals'] = [
      { id: '1', goal: 'Pipe | test', category: 'Work', status: 'In Progress' },
    ]
    allData['reading-log'] = [
      { id: '1', title: 'Dune', author: 'Frank Herbert', dateFinished: '2024-01-15', rating: '4', notes: 'Great\nTwo lines' },
    ]
    allData['budget'] = [
      { id: '1', date: '2024-01-15', category: 'Food', description: 'Groceries', amount: '50', type: 'Expense' },
    ]
    allData['day-reflections'] = [
      { id: '1', date: '2024-02-01', rating: '5', highlights: 'Good day\nLine 2', improvements: 'Sleep earlier' },
    ]

    const blob = await exportToMarkdownZip(allData)
    const file = new File([blob], 'test.zip', { type: 'application/zip' })
    const imported = await importFromMarkdownZip(file)

    const wg = imported['weekly-goals']
    expect(wg[0].goal).toBe('Pipe | test')
    expect(wg[0].status).toBe('In Progress')

    const rl = imported['reading-log']
    expect(rl[0].title).toBe('Dune')
    expect(rl[0].rating).toBe('4')
    expect(rl[0].notes).toBe('Great\nTwo lines')

    const b = imported['budget']
    expect(b[0].amount).toBe('50')
    expect(b[0].type).toBe('Expense')

    const dr = imported['day-reflections']
    expect(dr[0].rating).toBe('5')
    expect(dr[0].highlights).toBe('Good day\nLine 2')
  })
})
