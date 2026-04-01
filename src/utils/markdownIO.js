import JSZip from 'jszip'
import { SHEET_CONFIG } from './excelIO'
import { genId } from './id'
import { saveFile } from './platform'

// ── Cell serialization ────────────────────────────────────────────────────────

export function serializeCell(value, colType) {
  if (value === null || value === undefined || value === '') return ''
  const str = String(value)

  if (colType === 'rating') {
    const n = Math.min(5, Math.max(0, Number(str) || 0))
    return '★'.repeat(n) + '☆'.repeat(5 - n)
  }
  if (colType === 'textarea') {
    return str.replace(/\|/g, '\\|').replace(/\n/g, '<br>')
  }
  return str.replace(/\|/g, '\\|')
}

export function deserializeCell(raw, colType) {
  const trimmed = raw.trim()
  if (!trimmed) return ''

  if (colType === 'rating') {
    return String((trimmed.match(/★/g) || []).length)
  }
  const unescaped = trimmed.replace(/\\\|/g, '|')
  if (colType === 'textarea') {
    return unescaped.replace(/<br>/gi, '\n')
  }
  return unescaped
}

// ── Table row parser (handles escaped pipes) ──────────────────────────────────

function parseTableRow(line) {
  const cells = []
  let current = ''
  let i = 0
  // skip leading |
  while (i < line.length && line[i] === '|') i++

  while (i < line.length) {
    if (line[i] === '\\' && line[i + 1] === '|') {
      current += '\\|'
      i += 2
    } else if (line[i] === '|') {
      cells.push(current.trim())
      current = ''
      i++
    } else {
      current += line[i]
      i++
    }
  }
  return cells
}

// ── Section export ────────────────────────────────────────────────────────────

export function sectionToMarkdown(storageKey, rows) {
  const config = SHEET_CONFIG[storageKey]
  const cols = config.columns

  const frontmatter = [
    '---',
    `section: ${config.sheetName}`,
    `storageKey: ${storageKey}`,
    `exportedAt: ${new Date().toISOString()}`,
    '---',
    '',
  ].join('\n')

  const header = '| ' + cols.map((c) => c.header).join(' | ') + ' |'
  const separator = '| ' + cols.map(() => '---').join(' | ') + ' |'
  const dataRows = rows.map(
    (row) => '| ' + cols.map((col) => serializeCell(row[col.key], col.type || 'text')).join(' | ') + ' |'
  )

  return frontmatter + [header, separator, ...dataRows].join('\n') + '\n'
}

// ── Section import ────────────────────────────────────────────────────────────

export function markdownToRows(storageKey, mdString) {
  const config = SHEET_CONFIG[storageKey]
  const cols = config.columns
  const headerToCol = {}
  cols.forEach((col) => { headerToCol[col.header] = col })

  const lines = mdString.split('\n')
  let i = 0

  // Skip YAML frontmatter block (--- ... ---)
  if (lines[i]?.trim() === '---') {
    i++
    while (i < lines.length && lines[i]?.trim() !== '---') i++
    i++ // skip closing ---
  }

  // Skip blank lines; find the header row (first line starting with |)
  while (i < lines.length && !lines[i].trim().startsWith('|')) i++
  if (i >= lines.length) return []

  const headers = parseTableRow(lines[i])
  i++ // skip header
  i++ // skip separator

  const rows = []
  while (i < lines.length && lines[i].trim().startsWith('|')) {
    const cells = parseTableRow(lines[i])
    const row = { id: genId() }
    headers.forEach((header, idx) => {
      const col = headerToCol[header]
      if (col) row[col.key] = deserializeCell(cells[idx] ?? '', col.type || 'text')
    })
    rows.push(row)
    i++
  }

  return rows
}

// ── ZIP export ────────────────────────────────────────────────────────────────

export async function exportToMarkdownZip(allData) {
  const zip = new JSZip()
  Object.keys(SHEET_CONFIG).forEach((storageKey) => {
    zip.file(`${storageKey}.md`, sectionToMarkdown(storageKey, allData[storageKey] || []))
  })
  return zip.generateAsync({ type: 'blob' })
}

// ── ZIP download (wraps exportToMarkdownZip with save dialog) ─────────────────

export async function downloadMarkdownZip(allData, filename = 'life-management.zip') {
  const blob = await exportToMarkdownZip(allData)
  const buffer = await blob.arrayBuffer()
  await saveFile(buffer, {
    filename,
    mimeType: 'application/zip',
    filters: [{ name: 'ZIP', extensions: ['zip'] }],
  })
}

// ── ZIP import ────────────────────────────────────────────────────────────────

export async function importFromMarkdownZip(file) {
  const zip = await JSZip.loadAsync(file)
  const validKeys = new Set(Object.keys(SHEET_CONFIG))
  const result = {}

  await Promise.all(
    Object.entries(zip.files).map(async ([filename, entry]) => {
      if (entry.dir) return
      const storageKey = filename.replace(/\.md$/, '')
      if (!validKeys.has(storageKey)) return
      const content = await entry.async('string')
      result[storageKey] = markdownToRows(storageKey, content)
    })
  )

  return result
}
