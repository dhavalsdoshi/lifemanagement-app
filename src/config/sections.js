/**
 * Single source of truth for all 27 life-management sections.
 *
 * Each entry defines:
 *   - sheetName  — Excel sheet name (used by excelIO)
 *   - columns    — column definitions (used by DataTable, Excel, Markdown)
 *   - navLabel   — label shown in sidebar navigation
 *   - category   — groups sections under a sidebar heading
 *   - icon       — Lucide icon component for sidebar + dashboard
 *   - dashLabel  — shorter label shown on the dashboard card (omit to hide from dashboard)
 *   - dashColor  — Tailwind bg-* class for the dashboard icon badge
 *
 * To add a new section: add one entry here. No other files need to change.
 */
import {
  LayoutDashboard, Target, FolderKanban, Lightbulb, Brain,
  Heart, Users, UserCheck, PlayCircle,
  CalendarCheck, BookHeart, DollarSign, Dumbbell, Clock, Activity, UsersRound,
  BookOpen, BookMarked, Tv, Film, Gamepad2, ChefHat, ListChecks, ShoppingCart, LifeBuoy, Briefcase,
  Coffee,
} from 'lucide-react'

/** Sidebar category headings and their text-colour classes, in display order. */
export const CATEGORIES = [
  { label: 'Planning & Productivity', color: 'text-blue-600 dark:text-blue-400' },
  { label: 'Life & Relationships',    color: 'text-pink-600 dark:text-pink-400' },
  { label: 'Trackers',                color: 'text-green-700 dark:text-green-400' },
  { label: 'Lists',                   color: 'text-amber-600 dark:text-yellow-400' },
  { label: 'Resources',               color: 'text-purple-600 dark:text-purple-400' },
]

export const SECTIONS = {
  // ── Planning & Productivity ───────────────────────────────────────────────
  'day-plan-guide': {
    sheetName: 'Day Plan Guide',
    navLabel: 'Day Plan Guide',
    category: 'Planning & Productivity',
    icon: LayoutDashboard,
    columns: [
      { key: 'step',        header: 'Step',        type: 'text' },
      { key: 'description', header: 'Description', type: 'textarea' },
      { key: 'timeBlock',   header: 'Time Block',  type: 'text' },
    ],
  },
  'weekly-goals': {
    sheetName: 'Weekly Goals',
    navLabel: 'Weekly Goals',
    category: 'Planning & Productivity',
    icon: Target,
    dashLabel: 'Weekly Goals',
    dashColor: 'bg-blue-500',
    columns: [
      { key: 'goal',     header: 'Goal',     type: 'text' },
      { key: 'category', header: 'Category', type: 'text' },
      { key: 'status',   header: 'Status',   type: 'select', options: ['Not Started', 'In Progress', 'Done'] },
    ],
  },
  'current-projects': {
    sheetName: 'Current Projects',
    navLabel: 'Current Projects',
    category: 'Planning & Productivity',
    icon: FolderKanban,
    dashLabel: 'Projects',
    dashColor: 'bg-indigo-500',
    columns: [
      { key: 'project',     header: 'Project',     type: 'text' },
      { key: 'description', header: 'Description', type: 'textarea' },
      { key: 'status',      header: 'Status',      type: 'select', options: ['Not Started', 'In Progress', 'Done', 'On Hold'] },
      { key: 'deadline',    header: 'Deadline',    type: 'date' },
    ],
  },
  'bad-ef-day-notepad': {
    sheetName: 'Bad EF Day Notepad',
    navLabel: 'Bad EF Day Notepad',
    category: 'Planning & Productivity',
    icon: Lightbulb,
    columns: [
      { key: 'task',     header: 'Task',     type: 'text' },
      { key: 'notes',    header: 'Notes',    type: 'textarea' },
      { key: 'priority', header: 'Priority', type: 'select', options: ['High', 'Medium', 'Low'] },
    ],
  },
  'coping-mechanisms': {
    sheetName: 'Coping Mechanisms',
    navLabel: 'Coping Mechanisms',
    category: 'Planning & Productivity',
    icon: Brain,
    columns: [
      { key: 'mechanism',     header: 'Mechanism',     type: 'text' },
      { key: 'category',      header: 'Category',      type: 'text' },
      { key: 'effectiveness', header: 'Effectiveness', type: 'select', options: ['Low', 'Medium', 'High'] },
    ],
  },

  // ── Life & Relationships ──────────────────────────────────────────────────
  'hobbies-goals': {
    sheetName: 'Hobbies & Goals',
    navLabel: 'Hobbies & Goals',
    category: 'Life & Relationships',
    icon: Heart,
    columns: [
      { key: 'hobby',    header: 'Hobby',    type: 'text' },
      { key: 'goal',     header: 'Goal',     type: 'textarea' },
      { key: 'progress', header: 'Progress', type: 'text' },
    ],
  },
  'people-to-hang-out': {
    sheetName: 'People to Hang Out',
    navLabel: 'People to Hang Out',
    category: 'Life & Relationships',
    icon: Users,
    columns: [
      { key: 'name',     header: 'Name',            type: 'text' },
      { key: 'lastSeen', header: 'Last Seen',        type: 'date' },
      { key: 'activity', header: 'Activity Ideas',  type: 'textarea' },
      { key: 'notes',    header: 'Notes',            type: 'textarea' },
    ],
  },
  'check-in-with': {
    sheetName: 'Check In With',
    navLabel: 'Check In With',
    category: 'Life & Relationships',
    icon: UserCheck,
    columns: [
      { key: 'name',        header: 'Name',         type: 'text' },
      { key: 'lastCheckIn', header: 'Last Check In', type: 'date' },
      { key: 'frequency',   header: 'Frequency',    type: 'select', options: ['Daily', 'Weekly', 'Bi-weekly', 'Monthly'] },
      { key: 'notes',       header: 'Notes',        type: 'textarea' },
    ],
  },
  current: {
    sheetName: 'Current',
    navLabel: 'Current',
    category: 'Life & Relationships',
    icon: PlayCircle,
    columns: [
      { key: 'type',     header: 'Type',     type: 'select', options: ['Book', 'Show', 'Movie', 'Game', 'Podcast', 'Other'] },
      { key: 'title',    header: 'Title',    type: 'text' },
      { key: 'progress', header: 'Progress', type: 'text' },
    ],
  },

  // ── Trackers ──────────────────────────────────────────────────────────────
  'day-reflections': {
    sheetName: 'Day Reflections',
    navLabel: 'Day Reflections',
    category: 'Trackers',
    icon: CalendarCheck,
    dashLabel: 'Reflections',
    dashColor: 'bg-amber-500',
    columns: [
      { key: 'date',         header: 'Date',         type: 'date' },
      { key: 'rating',       header: 'Rating',       type: 'rating' },
      { key: 'highlights',   header: 'Highlights',   type: 'textarea' },
      { key: 'improvements', header: 'Improvements', type: 'textarea' },
    ],
  },
  'gratitude-journal': {
    sheetName: 'Gratitude Journal',
    navLabel: 'Gratitude Journal',
    category: 'Trackers',
    icon: BookHeart,
    dashLabel: 'Gratitude',
    dashColor: 'bg-pink-500',
    columns: [
      { key: 'date',  header: 'Date',  type: 'date' },
      { key: 'entry', header: 'Entry', type: 'textarea' },
    ],
  },
  budget: {
    sheetName: 'Budget',
    navLabel: 'Budget',
    category: 'Trackers',
    icon: DollarSign,
    dashLabel: 'Budget',
    dashColor: 'bg-green-500',
    columns: [
      { key: 'date',        header: 'Date',        type: 'date' },
      { key: 'category',    header: 'Category',    type: 'text' },
      { key: 'description', header: 'Description', type: 'text' },
      { key: 'amount',      header: 'Amount',      type: 'number' },
      { key: 'type',        header: 'Type',        type: 'select', options: ['Income', 'Expense'] },
    ],
  },
  gym: {
    sheetName: 'Gym',
    navLabel: 'Gym',
    category: 'Trackers',
    icon: Dumbbell,
    columns: [
      { key: 'date',     header: 'Date',     type: 'date' },
      { key: 'exercise', header: 'Exercise', type: 'text' },
      { key: 'sets',     header: 'Sets',     type: 'number' },
      { key: 'reps',     header: 'Reps',     type: 'number' },
      { key: 'weight',   header: 'Weight',   type: 'number' },
    ],
  },
  'was-i-late': {
    sheetName: 'Was I Late',
    navLabel: 'Was I Late',
    category: 'Trackers',
    icon: Clock,
    columns: [
      { key: 'date',   header: 'Date',   type: 'date' },
      { key: 'event',  header: 'Event',  type: 'text' },
      { key: 'late',   header: 'Late',   type: 'select', options: ['Yes', 'No'] },
      { key: 'reason', header: 'Reason', type: 'textarea' },
    ],
  },
  'symptom-tracker': {
    sheetName: 'Symptom Tracker',
    navLabel: 'Symptom Tracker',
    category: 'Trackers',
    icon: Activity,
    dashLabel: 'Symptoms',
    dashColor: 'bg-rose-500',
    columns: [
      { key: 'date',     header: 'Date',     type: 'date' },
      { key: 'symptom',  header: 'Symptom',  type: 'text' },
      { key: 'severity', header: 'Severity', type: 'select', options: ['Mild', 'Moderate', 'Severe'] },
      { key: 'notes',    header: 'Notes',    type: 'textarea' },
    ],
  },
  'meetup-groups': {
    sheetName: 'Meetup Groups',
    navLabel: 'Meetup Groups',
    category: 'Trackers',
    icon: UsersRound,
    columns: [
      { key: 'group',     header: 'Group',     type: 'text' },
      { key: 'topic',     header: 'Topic',     type: 'text' },
      { key: 'frequency', header: 'Frequency', type: 'select', options: ['Weekly', 'Bi-weekly', 'Monthly', 'Irregular'] },
      { key: 'notes',     header: 'Notes',     type: 'textarea' },
    ],
  },

  // ── Lists ─────────────────────────────────────────────────────────────────
  'books-to-read': {
    sheetName: 'Books to Read',
    navLabel: 'Books to Read',
    category: 'Lists',
    icon: BookOpen,
    dashLabel: 'Books',
    dashColor: 'bg-purple-500',
    columns: [
      { key: 'title',    header: 'Title',    type: 'text' },
      { key: 'author',   header: 'Author',   type: 'text' },
      { key: 'genre',    header: 'Genre',    type: 'text' },
      { key: 'priority', header: 'Priority', type: 'select', options: ['High', 'Medium', 'Low'] },
    ],
  },
  'reading-log': {
    sheetName: 'Reading Log',
    navLabel: 'Reading Log',
    category: 'Lists',
    icon: BookMarked,
    columns: [
      { key: 'title',        header: 'Title',         type: 'text' },
      { key: 'author',       header: 'Author',        type: 'text' },
      { key: 'dateFinished', header: 'Date Finished', type: 'date' },
      { key: 'rating',       header: 'Rating',        type: 'rating' },
      { key: 'notes',        header: 'Notes',         type: 'textarea' },
    ],
  },
  'shows-to-watch': {
    sheetName: 'Shows to Watch',
    navLabel: 'Shows to Watch',
    category: 'Lists',
    icon: Tv,
    dashLabel: 'Shows',
    dashColor: 'bg-red-500',
    columns: [
      { key: 'show',     header: 'Show',     type: 'text' },
      { key: 'platform', header: 'Platform', type: 'text' },
      { key: 'genre',    header: 'Genre',    type: 'text' },
      { key: 'status',   header: 'Status',   type: 'select', options: ['Want to Watch', 'Watching', 'Done'] },
    ],
  },
  'movies-watched': {
    sheetName: 'Movies Watched',
    navLabel: 'Movies Watched',
    category: 'Lists',
    icon: Film,
    columns: [
      { key: 'title',       header: 'Title',        type: 'text' },
      { key: 'dateWatched', header: 'Date Watched', type: 'date' },
      { key: 'rating',      header: 'Rating',       type: 'rating' },
      { key: 'notes',       header: 'Notes',        type: 'textarea' },
    ],
  },
  'games-to-play': {
    sheetName: 'Games to Play',
    navLabel: 'Games to Play',
    category: 'Lists',
    icon: Gamepad2,
    columns: [
      { key: 'game',     header: 'Game',     type: 'text' },
      { key: 'platform', header: 'Platform', type: 'text' },
      { key: 'genre',    header: 'Genre',    type: 'text' },
      { key: 'status',   header: 'Status',   type: 'select', options: ['Want to Play', 'Playing', 'Done'] },
    ],
  },
  'cooking-baking': {
    sheetName: 'Cooking & Baking',
    navLabel: 'Cooking & Baking',
    category: 'Lists',
    icon: ChefHat,
    dashLabel: 'Recipes',
    dashColor: 'bg-orange-500',
    columns: [
      { key: 'recipe',   header: 'Recipe',   type: 'text' },
      { key: 'category', header: 'Category', type: 'text' },
      { key: 'source',   header: 'Source',   type: 'text' },
      { key: 'tried',    header: 'Tried',    type: 'select', options: ['Yes', 'No'] },
      { key: 'rating',   header: 'Rating',   type: 'rating' },
    ],
  },
  habits: {
    sheetName: 'Habits',
    navLabel: 'Habits',
    category: 'Lists',
    icon: ListChecks,
    dashLabel: 'Habits',
    dashColor: 'bg-teal-500',
    columns: [
      { key: 'habit',     header: 'Habit',     type: 'text' },
      { key: 'frequency', header: 'Frequency', type: 'select', options: ['Daily', 'Weekly', 'Monthly'] },
      { key: 'status',    header: 'Status',    type: 'select', options: ['Active', 'Inactive'] },
    ],
  },
  'shopping-list': {
    sheetName: 'Shopping List',
    navLabel: 'Shopping List',
    category: 'Lists',
    icon: ShoppingCart,
    columns: [
      { key: 'item',      header: 'Item',      type: 'text' },
      { key: 'category',  header: 'Category',  type: 'text' },
      { key: 'quantity',  header: 'Quantity',  type: 'number' },
      { key: 'purchased', header: 'Purchased', type: 'select', options: ['Yes', 'No'] },
    ],
  },
  'self-help-resources': {
    sheetName: 'Self-Help Resources',
    navLabel: 'Self-Help Resources',
    category: 'Lists',
    icon: LifeBuoy,
    columns: [
      { key: 'resource', header: 'Resource', type: 'text' },
      { key: 'type',     header: 'Type',     type: 'text' },
      { key: 'topic',    header: 'Topic',    type: 'text' },
      { key: 'notes',    header: 'Notes',    type: 'textarea' },
    ],
  },
  'jobs-applied': {
    sheetName: 'Jobs Applied',
    navLabel: 'Jobs Applied',
    category: 'Lists',
    icon: Briefcase,
    columns: [
      { key: 'company',     header: 'Company',      type: 'text' },
      { key: 'position',    header: 'Position',     type: 'text' },
      { key: 'dateApplied', header: 'Date Applied', type: 'date' },
      { key: 'status',      header: 'Status',       type: 'select', options: ['Applied', 'Interviewing', 'Offer', 'Rejected', 'Withdrawn'] },
      { key: 'notes',       header: 'Notes',        type: 'textarea' },
    ],
  },

  // ── Resources ─────────────────────────────────────────────────────────────
  'morning-coffee-sites': {
    sheetName: 'Morning Coffee Sites',
    navLabel: 'Morning Coffee Sites',
    category: 'Resources',
    icon: Coffee,
    columns: [
      { key: 'site',     header: 'Site',     type: 'text' },
      { key: 'url',      header: 'URL',      type: 'url' },
      { key: 'category', header: 'Category', type: 'text' },
    ],
  },
}
