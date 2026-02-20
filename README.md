# Life Management Web App

A clean, modern web app for comprehensive personal life management. Built to replace a ~30-tab Excel spreadsheet with an interactive UI that supports inline editing, search/filter, and Excel import/export.

## Tech Stack

- **React 19** via Vite
- **TailwindCSS 4** for styling
- **SheetJS (xlsx)** for Excel import/export
- **React Router** for navigation
- **localStorage** for data persistence (no backend needed)
- **Lucide React** for icons
- **Vitest + React Testing Library** for testing

## Getting Started

```bash
npm install      # Install dependencies
npm run dev      # Start dev server
npm test         # Run tests in watch mode
npm run test:run # Run tests once
npm run build    # Production build
```

## Architecture

| Layer | Files | Purpose |
|-------|-------|---------|
| `src/utils/` | `storage.js`, `excelIO.js` | localStorage persistence, Excel import/export |
| `src/hooks/` | `useLocalData.js` | Reusable CRUD hook with auto-save |
| `src/components/shared/` | `Card`, `Modal`, `DataTable` | Reusable UI components |
| `src/components/` | `Layout`, `Sidebar` | App shell with categorized navigation |
| `src/pages/` | `Dashboard` + 27 section pages | One page per spreadsheet tab |

### Key Design Decisions

- **TablePage pattern** — All 27 section pages are thin wrappers around `TablePage`, which uses `SHEET_CONFIG` from `excelIO.js` for columns. Adding a new section requires only: adding to `SHEET_CONFIG`, `ALL_KEYS`, a 3-line page component, and a route.
- **Single source of truth** — `SHEET_CONFIG` defines both the Excel format and the table columns, so import/export always stays in sync with the UI.
- **useLocalData hook** — Encapsulates all CRUD + persistence logic in one place.

## Sections

### Planning & Productivity
- Day Plan Guide
- Weekly Goals
- Current Projects
- Bad EF Day Notepad
- Coping Mechanisms

### Life & Relationships
- Hobbies & Goals
- People to Hang Out With
- Check In With
- Current (watching/reading/playing)

### Trackers
- Day Reflections
- Gratitude Journal
- Budget
- Gym
- Was I Late
- Symptom Tracker
- Meetup Groups

### Lists
- Books to Read / Reading Log
- Shows to Watch / Movies Watched
- Games to Play
- Cooking & Baking Recipes
- Habits to Form
- Shopping List
- Self-Help Resources
- Jobs Applied For

### Resources
- Morning Coffee Sites

## Features

- **Inline editing** — Click any cell to edit it directly
- **Add/delete rows** — Easy row management for all sections
- **Search & filter** — Quick filtering across tables
- **Import from Excel** — Parse your existing spreadsheet and populate all sections
- **Export to Excel** — Download all data as an Excel file matching the original format
- **Auto-save** — All changes persist to localStorage automatically

## Tests

49 tests across 10 test files covering utilities, hooks, components, and routing.
