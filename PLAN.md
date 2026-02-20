# Life Management Web App - Implementation Plan

## Context
The user has an Excel spreadsheet ("Life Management.xlsx") with ~30 tabs that serves as a comprehensive personal life management system. It covers goals, budgets, habits, journals, recipes, trackers, and more. The goal is to build a clean, modern web app that makes it easy to capture and manage this information, with the ability to import/export data in the same Excel format.

## Tech Stack
- **React 18** via Vite (fast, lightweight)
- **TailwindCSS 3** for modern, sleek styling
- **SheetJS (xlsx)** for Excel import/export
- **React Router** for navigation
- **localStorage** for data persistence (no backend needed for individual use)
- **Lucide React** for clean icons

## Architecture

### App Structure
```
lifemanagement-app/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── utils/
│   │   ├── storage.js          # localStorage helpers
│   │   └── excelIO.js          # Import/export logic
│   ├── components/
│   │   ├── Layout.jsx          # Sidebar + main content shell
│   │   ├── Sidebar.jsx         # Navigation sidebar
│   │   └── shared/             # Reusable UI components
│   │       ├── DataTable.jsx   # Editable table component
│   │       ├── Modal.jsx
│   │       └── Card.jsx
│   └── pages/
│       ├── Dashboard.jsx           # Index / welcome page
│       ├── WeeklyGoals.jsx
│       ├── CurrentProjects.jsx
│       ├── HobbiesGoals.jsx
│       ├── Budget.jsx
│       ├── GratitudeJournal.jsx
│       ├── Habits.jsx
│       ├── BooksToRead.jsx
│       ├── ReadingLog.jsx
│       ├── ShowsToWatch.jsx
│       ├── MoviesWatched.jsx
│       ├── GamesToPlay.jsx
│       ├── CookingBaking.jsx
│       ├── DayReflections.jsx
│       ├── PeopleToHangOut.jsx
│       ├── JobsApplied.jsx
│       ├── SymptomTracker.jsx
│       ├── CopingMechanisms.jsx
│       ├── SelfHelpResources.jsx
│       ├── ShoppingList.jsx
│       ├── MeetupGroups.jsx
│       ├── WasILate.jsx
│       ├── Current.jsx
│       ├── CheckInWith.jsx
│       ├── MorningCoffeeSites.jsx
│       ├── DayPlanGuide.jsx
│       └── BadEFDayNotepad.jsx
```

### Sections grouped in sidebar (matching spreadsheet Index):

1. **Planning & Productivity**
   - Day Plan Guide (How to make a day plan)
   - Weekly Goals
   - Current Projects
   - Bad EF Day Notepad
   - Coping Mechanisms

2. **Life & Relationships**
   - Hobbies & Goals
   - People to Hang Out With
   - Check In With...
   - Current (what I'm watching/reading now)

3. **Trackers**
   - How Did Today Go (Day/Week Reflections)
   - Gratitude Journal
   - Budget
   - Gym
   - Was I Late
   - Symptom Tracker
   - Meetup Groups

4. **Lists**
   - Books to Read / Reading Log
   - Shows to Watch / Movies Watched
   - Games to Play
   - Cooking & Baking Recipes
   - Habits to Form
   - Shopping List
   - Self-Help Resources
   - Jobs Applied For

5. **Resources**
   - Morning Coffee Sites

### Key Features
- **Inline editing** - Click to edit any cell directly in tables
- **Add/delete rows** - Easy row management for all list-based sections
- **Search & filter** - Quick filtering across tables
- **Import from Excel** - Parse the exact spreadsheet format and populate all sections
- **Export to Excel** - Generate Excel file matching the original format with all sheet names
- **Auto-save** - All changes persist to localStorage automatically
- **Responsive** - Works on desktop and tablet

### UI Design
- Dark sidebar with categorized navigation
- Clean white content area with cards
- Subtle shadows, rounded corners, smooth transitions
- Color-coded categories
- Consistent typography with Inter font

## Implementation Steps

1. **Scaffold project** - Vite + React + TailwindCSS + dependencies
2. **Build Layout** - Sidebar navigation + main content area
3. **Build shared components** - DataTable, Modal, Card
4. **Build utility modules** - localStorage helpers, Excel import/export
5. **Build all page components** (one per spreadsheet tab)
6. **Wire up routing and navigation**
7. **Implement Excel import/export** matching original format
8. **Test end-to-end**

## Verification
- Run `npm run dev` and verify all pages render
- Test adding/editing/deleting data in each section
- Test exporting data to Excel and verify format matches original
- Test importing the original Excel file and verify data populates correctly
- Verify localStorage persistence across page refreshes
