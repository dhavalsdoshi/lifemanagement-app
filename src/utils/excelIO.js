import ExcelJS from 'exceljs'
import { IS_TAURI } from './storage'

// Maps storage keys to Excel sheet names and column definitions.
// Each column: { key, header, type?, options? }
// type: 'text' (default) | 'date' | 'textarea' | 'number' | 'url' | 'select'
export const SHEET_CONFIG = {
  'weekly-goals': {
    sheetName: 'Weekly Goals',
    columns: [
      { key: 'goal', header: 'Goal', type: 'text' },
      { key: 'category', header: 'Category', type: 'text' },
      { key: 'status', header: 'Status', type: 'select', options: ['Not Started', 'In Progress', 'Done'] },
    ],
  },
  'current-projects': {
    sheetName: 'Current Projects',
    columns: [
      { key: 'project', header: 'Project', type: 'text' },
      { key: 'description', header: 'Description', type: 'textarea' },
      { key: 'status', header: 'Status', type: 'select', options: ['Not Started', 'In Progress', 'Done', 'On Hold'] },
      { key: 'deadline', header: 'Deadline', type: 'date' },
    ],
  },
  'hobbies-goals': {
    sheetName: 'Hobbies & Goals',
    columns: [
      { key: 'hobby', header: 'Hobby', type: 'text' },
      { key: 'goal', header: 'Goal', type: 'textarea' },
      { key: 'progress', header: 'Progress', type: 'text' },
    ],
  },
  budget: {
    sheetName: 'Budget',
    columns: [
      { key: 'date', header: 'Date', type: 'date' },
      { key: 'category', header: 'Category', type: 'text' },
      { key: 'description', header: 'Description', type: 'text' },
      { key: 'amount', header: 'Amount', type: 'number' },
      { key: 'type', header: 'Type', type: 'select', options: ['Income', 'Expense'] },
    ],
  },
  'gratitude-journal': {
    sheetName: 'Gratitude Journal',
    columns: [
      { key: 'date', header: 'Date', type: 'date' },
      { key: 'entry', header: 'Entry', type: 'textarea' },
    ],
  },
  habits: {
    sheetName: 'Habits',
    columns: [
      { key: 'habit', header: 'Habit', type: 'text' },
      { key: 'frequency', header: 'Frequency', type: 'select', options: ['Daily', 'Weekly', 'Monthly'] },
      { key: 'status', header: 'Status', type: 'select', options: ['Active', 'Inactive'] },
    ],
  },
  'books-to-read': {
    sheetName: 'Books to Read',
    columns: [
      { key: 'title', header: 'Title', type: 'text' },
      { key: 'author', header: 'Author', type: 'text' },
      { key: 'genre', header: 'Genre', type: 'text' },
      { key: 'priority', header: 'Priority', type: 'select', options: ['High', 'Medium', 'Low'] },
    ],
  },
  'reading-log': {
    sheetName: 'Reading Log',
    columns: [
      { key: 'title', header: 'Title', type: 'text' },
      { key: 'author', header: 'Author', type: 'text' },
      { key: 'dateFinished', header: 'Date Finished', type: 'date' },
      { key: 'rating', header: 'Rating', type: 'rating' },
      { key: 'notes', header: 'Notes', type: 'textarea' },
    ],
  },
  'shows-to-watch': {
    sheetName: 'Shows to Watch',
    columns: [
      { key: 'show', header: 'Show', type: 'text' },
      { key: 'platform', header: 'Platform', type: 'text' },
      { key: 'genre', header: 'Genre', type: 'text' },
      { key: 'status', header: 'Status', type: 'select', options: ['Want to Watch', 'Watching', 'Done'] },
    ],
  },
  'movies-watched': {
    sheetName: 'Movies Watched',
    columns: [
      { key: 'title', header: 'Title', type: 'text' },
      { key: 'dateWatched', header: 'Date Watched', type: 'date' },
      { key: 'rating', header: 'Rating', type: 'rating' },
      { key: 'notes', header: 'Notes', type: 'textarea' },
    ],
  },
  'games-to-play': {
    sheetName: 'Games to Play',
    columns: [
      { key: 'game', header: 'Game', type: 'text' },
      { key: 'platform', header: 'Platform', type: 'text' },
      { key: 'genre', header: 'Genre', type: 'text' },
      { key: 'status', header: 'Status', type: 'select', options: ['Want to Play', 'Playing', 'Done'] },
    ],
  },
  'cooking-baking': {
    sheetName: 'Cooking & Baking',
    columns: [
      { key: 'recipe', header: 'Recipe', type: 'text' },
      { key: 'category', header: 'Category', type: 'text' },
      { key: 'source', header: 'Source', type: 'text' },
      { key: 'tried', header: 'Tried', type: 'select', options: ['Yes', 'No'] },
      { key: 'rating', header: 'Rating', type: 'rating' },
    ],
  },
  'day-reflections': {
    sheetName: 'Day Reflections',
    columns: [
      { key: 'date', header: 'Date', type: 'date' },
      { key: 'rating', header: 'Rating', type: 'rating' },
      { key: 'highlights', header: 'Highlights', type: 'textarea' },
      { key: 'improvements', header: 'Improvements', type: 'textarea' },
    ],
  },
  'people-to-hang-out': {
    sheetName: 'People to Hang Out',
    columns: [
      { key: 'name', header: 'Name', type: 'text' },
      { key: 'lastSeen', header: 'Last Seen', type: 'date' },
      { key: 'activity', header: 'Activity Ideas', type: 'textarea' },
      { key: 'notes', header: 'Notes', type: 'textarea' },
    ],
  },
  'jobs-applied': {
    sheetName: 'Jobs Applied',
    columns: [
      { key: 'company', header: 'Company', type: 'text' },
      { key: 'position', header: 'Position', type: 'text' },
      { key: 'dateApplied', header: 'Date Applied', type: 'date' },
      { key: 'status', header: 'Status', type: 'select', options: ['Applied', 'Interviewing', 'Offer', 'Rejected', 'Withdrawn'] },
      { key: 'notes', header: 'Notes', type: 'textarea' },
    ],
  },
  'symptom-tracker': {
    sheetName: 'Symptom Tracker',
    columns: [
      { key: 'date', header: 'Date', type: 'date' },
      { key: 'symptom', header: 'Symptom', type: 'text' },
      { key: 'severity', header: 'Severity', type: 'select', options: ['Mild', 'Moderate', 'Severe'] },
      { key: 'notes', header: 'Notes', type: 'textarea' },
    ],
  },
  'coping-mechanisms': {
    sheetName: 'Coping Mechanisms',
    columns: [
      { key: 'mechanism', header: 'Mechanism', type: 'text' },
      { key: 'category', header: 'Category', type: 'text' },
      { key: 'effectiveness', header: 'Effectiveness', type: 'select', options: ['Low', 'Medium', 'High'] },
    ],
  },
  'self-help-resources': {
    sheetName: 'Self-Help Resources',
    columns: [
      { key: 'resource', header: 'Resource', type: 'text' },
      { key: 'type', header: 'Type', type: 'text' },
      { key: 'topic', header: 'Topic', type: 'text' },
      { key: 'notes', header: 'Notes', type: 'textarea' },
    ],
  },
  'shopping-list': {
    sheetName: 'Shopping List',
    columns: [
      { key: 'item', header: 'Item', type: 'text' },
      { key: 'category', header: 'Category', type: 'text' },
      { key: 'quantity', header: 'Quantity', type: 'number' },
      { key: 'purchased', header: 'Purchased', type: 'select', options: ['Yes', 'No'] },
    ],
  },
  'meetup-groups': {
    sheetName: 'Meetup Groups',
    columns: [
      { key: 'group', header: 'Group', type: 'text' },
      { key: 'topic', header: 'Topic', type: 'text' },
      { key: 'frequency', header: 'Frequency', type: 'select', options: ['Weekly', 'Bi-weekly', 'Monthly', 'Irregular'] },
      { key: 'notes', header: 'Notes', type: 'textarea' },
    ],
  },
  'was-i-late': {
    sheetName: 'Was I Late',
    columns: [
      { key: 'date', header: 'Date', type: 'date' },
      { key: 'event', header: 'Event', type: 'text' },
      { key: 'late', header: 'Late', type: 'select', options: ['Yes', 'No'] },
      { key: 'reason', header: 'Reason', type: 'textarea' },
    ],
  },
  current: {
    sheetName: 'Current',
    columns: [
      { key: 'type', header: 'Type', type: 'select', options: ['Book', 'Show', 'Movie', 'Game', 'Podcast', 'Other'] },
      { key: 'title', header: 'Title', type: 'text' },
      { key: 'progress', header: 'Progress', type: 'text' },
    ],
  },
  'check-in-with': {
    sheetName: 'Check In With',
    columns: [
      { key: 'name', header: 'Name', type: 'text' },
      { key: 'lastCheckIn', header: 'Last Check In', type: 'date' },
      { key: 'frequency', header: 'Frequency', type: 'select', options: ['Daily', 'Weekly', 'Bi-weekly', 'Monthly'] },
      { key: 'notes', header: 'Notes', type: 'textarea' },
    ],
  },
  'morning-coffee-sites': {
    sheetName: 'Morning Coffee Sites',
    columns: [
      { key: 'site', header: 'Site', type: 'text' },
      { key: 'url', header: 'URL', type: 'url' },
      { key: 'category', header: 'Category', type: 'text' },
    ],
  },
  'day-plan-guide': {
    sheetName: 'Day Plan Guide',
    columns: [
      { key: 'step', header: 'Step', type: 'text' },
      { key: 'description', header: 'Description', type: 'textarea' },
      { key: 'timeBlock', header: 'Time Block', type: 'text' },
    ],
  },
  'bad-ef-day-notepad': {
    sheetName: 'Bad EF Day Notepad',
    columns: [
      { key: 'task', header: 'Task', type: 'text' },
      { key: 'notes', header: 'Notes', type: 'textarea' },
      { key: 'priority', header: 'Priority', type: 'select', options: ['High', 'Medium', 'Low'] },
    ],
  },
  gym: {
    sheetName: 'Gym',
    columns: [
      { key: 'date', header: 'Date', type: 'date' },
      { key: 'exercise', header: 'Exercise', type: 'text' },
      { key: 'sets', header: 'Sets', type: 'number' },
      { key: 'reps', header: 'Reps', type: 'number' },
      { key: 'weight', header: 'Weight', type: 'number' },
    ],
  },
}

// Build reverse lookup: sheet name -> storage key
const sheetNameToKey = {}
for (const [key, config] of Object.entries(SHEET_CONFIG)) {
  sheetNameToKey[config.sheetName] = key
}

function cellToString(value) {
  if (value === null || value === undefined) return ''
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  if (typeof value === 'object' && value.text) return String(value.text)
  return String(value)
}

export function importFromWorkbook(workbook) {
  const result = {}

  workbook.eachSheet((sheet) => {
    const storageKey = sheetNameToKey[sheet.name]
    if (!storageKey) return

    const config = SHEET_CONFIG[storageKey]
    const headerToKey = {}
    config.columns.forEach((col) => { headerToKey[col.header] = col.key })

    let headers = null
    let rowIndex = 0
    const rows = []

    sheet.eachRow((row) => {
      rowIndex++
      const values = row.values.slice(1) // exceljs row.values is 1-indexed
      if (rowIndex === 1) {
        headers = values.map(cellToString)
        return
      }
      const item = { id: String(rowIndex - 1) }
      headers.forEach((header, idx) => {
        const key = headerToKey[header]
        if (key) item[key] = cellToString(values[idx])
      })
      rows.push(item)
    })

    result[storageKey] = rows
  })

  return result
}

export function exportToWorkbook(allData) {
  const wb = new ExcelJS.Workbook()

  Object.entries(SHEET_CONFIG).forEach(([storageKey, config]) => {
    const ws = wb.addWorksheet(config.sheetName)
    ws.addRow(config.columns.map((c) => c.header))
    const data = allData[storageKey] || []
    data.forEach((item) => {
      ws.addRow(config.columns.map((col) => item[col.key] ?? ''))
    })
  })

  return wb
}

export async function downloadWorkbook(allData, filename = 'Life Management.xlsx') {
  const wb = exportToWorkbook(allData)
  const buffer = await wb.xlsx.writeBuffer()

  if (IS_TAURI) {
    const { save } = await import('@tauri-apps/plugin-dialog')
    const { writeFile } = await import('@tauri-apps/plugin-fs')
    const path = await save({
      defaultPath: filename,
      filters: [{ name: 'Excel', extensions: ['xlsx'] }],
    })
    if (path) await writeFile(path, new Uint8Array(buffer))
    return
  }

  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function parseFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const wb = new ExcelJS.Workbook()
        await wb.xlsx.load(e.target.result)
        resolve(importFromWorkbook(wb))
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}
