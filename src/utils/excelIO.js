import * as XLSX from 'xlsx'

// Maps storage keys to Excel sheet names and column definitions.
// Each column: { key: internal field name, header: Excel column header }
export const SHEET_CONFIG = {
  'weekly-goals': {
    sheetName: 'Weekly Goals',
    columns: [
      { key: 'goal', header: 'Goal' },
      { key: 'category', header: 'Category' },
      { key: 'status', header: 'Status' },
    ],
  },
  'current-projects': {
    sheetName: 'Current Projects',
    columns: [
      { key: 'project', header: 'Project' },
      { key: 'description', header: 'Description' },
      { key: 'status', header: 'Status' },
      { key: 'deadline', header: 'Deadline' },
    ],
  },
  'hobbies-goals': {
    sheetName: 'Hobbies & Goals',
    columns: [
      { key: 'hobby', header: 'Hobby' },
      { key: 'goal', header: 'Goal' },
      { key: 'progress', header: 'Progress' },
    ],
  },
  budget: {
    sheetName: 'Budget',
    columns: [
      { key: 'date', header: 'Date' },
      { key: 'category', header: 'Category' },
      { key: 'description', header: 'Description' },
      { key: 'amount', header: 'Amount' },
      { key: 'type', header: 'Type' },
    ],
  },
  'gratitude-journal': {
    sheetName: 'Gratitude Journal',
    columns: [
      { key: 'date', header: 'Date' },
      { key: 'entry', header: 'Entry' },
    ],
  },
  habits: {
    sheetName: 'Habits',
    columns: [
      { key: 'habit', header: 'Habit' },
      { key: 'frequency', header: 'Frequency' },
      { key: 'status', header: 'Status' },
    ],
  },
  'books-to-read': {
    sheetName: 'Books to Read',
    columns: [
      { key: 'title', header: 'Title' },
      { key: 'author', header: 'Author' },
      { key: 'genre', header: 'Genre' },
      { key: 'priority', header: 'Priority' },
    ],
  },
  'reading-log': {
    sheetName: 'Reading Log',
    columns: [
      { key: 'title', header: 'Title' },
      { key: 'author', header: 'Author' },
      { key: 'dateFinished', header: 'Date Finished' },
      { key: 'rating', header: 'Rating' },
      { key: 'notes', header: 'Notes' },
    ],
  },
  'shows-to-watch': {
    sheetName: 'Shows to Watch',
    columns: [
      { key: 'show', header: 'Show' },
      { key: 'platform', header: 'Platform' },
      { key: 'genre', header: 'Genre' },
      { key: 'status', header: 'Status' },
    ],
  },
  'movies-watched': {
    sheetName: 'Movies Watched',
    columns: [
      { key: 'title', header: 'Title' },
      { key: 'dateWatched', header: 'Date Watched' },
      { key: 'rating', header: 'Rating' },
      { key: 'notes', header: 'Notes' },
    ],
  },
  'games-to-play': {
    sheetName: 'Games to Play',
    columns: [
      { key: 'game', header: 'Game' },
      { key: 'platform', header: 'Platform' },
      { key: 'genre', header: 'Genre' },
      { key: 'status', header: 'Status' },
    ],
  },
  'cooking-baking': {
    sheetName: 'Cooking & Baking',
    columns: [
      { key: 'recipe', header: 'Recipe' },
      { key: 'category', header: 'Category' },
      { key: 'source', header: 'Source' },
      { key: 'tried', header: 'Tried' },
      { key: 'rating', header: 'Rating' },
    ],
  },
  'day-reflections': {
    sheetName: 'Day Reflections',
    columns: [
      { key: 'date', header: 'Date' },
      { key: 'rating', header: 'Rating' },
      { key: 'highlights', header: 'Highlights' },
      { key: 'improvements', header: 'Improvements' },
    ],
  },
  'people-to-hang-out': {
    sheetName: 'People to Hang Out',
    columns: [
      { key: 'name', header: 'Name' },
      { key: 'lastSeen', header: 'Last Seen' },
      { key: 'activity', header: 'Activity Ideas' },
      { key: 'notes', header: 'Notes' },
    ],
  },
  'jobs-applied': {
    sheetName: 'Jobs Applied',
    columns: [
      { key: 'company', header: 'Company' },
      { key: 'position', header: 'Position' },
      { key: 'dateApplied', header: 'Date Applied' },
      { key: 'status', header: 'Status' },
      { key: 'notes', header: 'Notes' },
    ],
  },
  'symptom-tracker': {
    sheetName: 'Symptom Tracker',
    columns: [
      { key: 'date', header: 'Date' },
      { key: 'symptom', header: 'Symptom' },
      { key: 'severity', header: 'Severity' },
      { key: 'notes', header: 'Notes' },
    ],
  },
  'coping-mechanisms': {
    sheetName: 'Coping Mechanisms',
    columns: [
      { key: 'mechanism', header: 'Mechanism' },
      { key: 'category', header: 'Category' },
      { key: 'effectiveness', header: 'Effectiveness' },
    ],
  },
  'self-help-resources': {
    sheetName: 'Self-Help Resources',
    columns: [
      { key: 'resource', header: 'Resource' },
      { key: 'type', header: 'Type' },
      { key: 'topic', header: 'Topic' },
      { key: 'notes', header: 'Notes' },
    ],
  },
  'shopping-list': {
    sheetName: 'Shopping List',
    columns: [
      { key: 'item', header: 'Item' },
      { key: 'category', header: 'Category' },
      { key: 'quantity', header: 'Quantity' },
      { key: 'purchased', header: 'Purchased' },
    ],
  },
  'meetup-groups': {
    sheetName: 'Meetup Groups',
    columns: [
      { key: 'group', header: 'Group' },
      { key: 'topic', header: 'Topic' },
      { key: 'frequency', header: 'Frequency' },
      { key: 'notes', header: 'Notes' },
    ],
  },
  'was-i-late': {
    sheetName: 'Was I Late',
    columns: [
      { key: 'date', header: 'Date' },
      { key: 'event', header: 'Event' },
      { key: 'late', header: 'Late' },
      { key: 'reason', header: 'Reason' },
    ],
  },
  current: {
    sheetName: 'Current',
    columns: [
      { key: 'type', header: 'Type' },
      { key: 'title', header: 'Title' },
      { key: 'progress', header: 'Progress' },
    ],
  },
  'check-in-with': {
    sheetName: 'Check In With',
    columns: [
      { key: 'name', header: 'Name' },
      { key: 'lastCheckIn', header: 'Last Check In' },
      { key: 'frequency', header: 'Frequency' },
      { key: 'notes', header: 'Notes' },
    ],
  },
  'morning-coffee-sites': {
    sheetName: 'Morning Coffee Sites',
    columns: [
      { key: 'site', header: 'Site' },
      { key: 'url', header: 'URL' },
      { key: 'category', header: 'Category' },
    ],
  },
  'day-plan-guide': {
    sheetName: 'Day Plan Guide',
    columns: [
      { key: 'step', header: 'Step' },
      { key: 'description', header: 'Description' },
      { key: 'timeBlock', header: 'Time Block' },
    ],
  },
  'bad-ef-day-notepad': {
    sheetName: 'Bad EF Day Notepad',
    columns: [
      { key: 'task', header: 'Task' },
      { key: 'notes', header: 'Notes' },
      { key: 'priority', header: 'Priority' },
    ],
  },
  gym: {
    sheetName: 'Gym',
    columns: [
      { key: 'date', header: 'Date' },
      { key: 'exercise', header: 'Exercise' },
      { key: 'sets', header: 'Sets' },
      { key: 'reps', header: 'Reps' },
      { key: 'weight', header: 'Weight' },
    ],
  },
}

// Build reverse lookup: sheet name -> storage key
const sheetNameToKey = {}
for (const [key, config] of Object.entries(SHEET_CONFIG)) {
  sheetNameToKey[config.sheetName] = key
}

export function importFromWorkbook(workbook) {
  const result = {}

  workbook.SheetNames.forEach((sheetName) => {
    const storageKey = sheetNameToKey[sheetName]
    if (!storageKey) return

    const config = SHEET_CONFIG[storageKey]
    const sheet = workbook.Sheets[sheetName]
    const rawRows = XLSX.utils.sheet_to_json(sheet, { defval: '' })

    // Map Excel column headers to internal keys
    const headerToKey = {}
    config.columns.forEach((col) => {
      headerToKey[col.header] = col.key
    })

    result[storageKey] = rawRows.map((row, i) => {
      const item = { id: String(i + 1) }
      Object.entries(row).forEach(([header, value]) => {
        const key = headerToKey[header]
        if (key) item[key] = String(value)
      })
      return item
    })
  })

  return result
}

export function exportToWorkbook(allData) {
  const wb = XLSX.utils.book_new()

  Object.entries(SHEET_CONFIG).forEach(([storageKey, config]) => {
    const data = allData[storageKey] || []
    const headers = config.columns.map((c) => c.header)

    const rows = data.map((item) =>
      config.columns.map((col) => item[col.key] ?? '')
    )

    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows])
    XLSX.utils.book_append_sheet(wb, ws, config.sheetName)
  })

  return wb
}

export function downloadWorkbook(allData, filename = 'Life Management.xlsx') {
  const wb = exportToWorkbook(allData)
  XLSX.writeFile(wb, filename)
}

export function parseFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target.result, { type: 'array' })
        resolve(importFromWorkbook(wb))
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}
