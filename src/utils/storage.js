const PREFIX = 'lm-'

export const ALL_KEYS = [
  'weekly-goals',
  'current-projects',
  'hobbies-goals',
  'budget',
  'gratitude-journal',
  'habits',
  'books-to-read',
  'reading-log',
  'shows-to-watch',
  'movies-watched',
  'games-to-play',
  'cooking-baking',
  'day-reflections',
  'people-to-hang-out',
  'jobs-applied',
  'symptom-tracker',
  'coping-mechanisms',
  'self-help-resources',
  'shopping-list',
  'meetup-groups',
  'was-i-late',
  'current',
  'check-in-with',
  'morning-coffee-sites',
  'day-plan-guide',
  'bad-ef-day-notepad',
  'gym',
]

export function loadData(key) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveData(key, data) {
  localStorage.setItem(PREFIX + key, JSON.stringify(data))
}

export function clearAll() {
  ALL_KEYS.forEach((key) => localStorage.removeItem(PREFIX + key))
}
