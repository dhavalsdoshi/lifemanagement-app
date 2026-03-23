import { NavLink } from 'react-router-dom'
import { useRef } from 'react'
import {
  LayoutDashboard, Target, FolderKanban, Lightbulb, Brain,
  Heart, Users, UserCheck, PlayCircle,
  CalendarCheck, BookHeart, DollarSign, Dumbbell, Clock, Activity, UsersRound,
  BookOpen, BookMarked, Tv, Film, Gamepad2, ChefHat, ListChecks, ShoppingCart, LifeBuoy, Briefcase,
  Coffee, Download, Upload, Sun, Moon,
} from 'lucide-react'

const NAV_SECTIONS = [
  {
    label: 'Planning & Productivity',
    color: 'text-blue-600 dark:text-blue-400',
    items: [
      { to: '/day-plan-guide', label: 'Day Plan Guide', icon: LayoutDashboard },
      { to: '/weekly-goals', label: 'Weekly Goals', icon: Target },
      { to: '/current-projects', label: 'Current Projects', icon: FolderKanban },
      { to: '/bad-ef-day-notepad', label: 'Bad EF Day Notepad', icon: Lightbulb },
      { to: '/coping-mechanisms', label: 'Coping Mechanisms', icon: Brain },
    ],
  },
  {
    label: 'Life & Relationships',
    color: 'text-pink-600 dark:text-pink-400',
    items: [
      { to: '/hobbies-goals', label: 'Hobbies & Goals', icon: Heart },
      { to: '/people-to-hang-out', label: 'People to Hang Out', icon: Users },
      { to: '/check-in-with', label: 'Check In With', icon: UserCheck },
      { to: '/current', label: 'Current', icon: PlayCircle },
    ],
  },
  {
    label: 'Trackers',
    color: 'text-green-700 dark:text-green-400',
    items: [
      { to: '/day-reflections', label: 'Day Reflections', icon: CalendarCheck },
      { to: '/gratitude-journal', label: 'Gratitude Journal', icon: BookHeart },
      { to: '/budget', label: 'Budget', icon: DollarSign },
      { to: '/gym', label: 'Gym', icon: Dumbbell },
      { to: '/was-i-late', label: 'Was I Late', icon: Clock },
      { to: '/symptom-tracker', label: 'Symptom Tracker', icon: Activity },
      { to: '/meetup-groups', label: 'Meetup Groups', icon: UsersRound },
    ],
  },
  {
    label: 'Lists',
    color: 'text-amber-600 dark:text-yellow-400',
    items: [
      { to: '/books-to-read', label: 'Books to Read', icon: BookOpen },
      { to: '/reading-log', label: 'Reading Log', icon: BookMarked },
      { to: '/shows-to-watch', label: 'Shows to Watch', icon: Tv },
      { to: '/movies-watched', label: 'Movies Watched', icon: Film },
      { to: '/games-to-play', label: 'Games to Play', icon: Gamepad2 },
      { to: '/cooking-baking', label: 'Cooking & Baking', icon: ChefHat },
      { to: '/habits', label: 'Habits', icon: ListChecks },
      { to: '/shopping-list', label: 'Shopping List', icon: ShoppingCart },
      { to: '/self-help-resources', label: 'Self-Help Resources', icon: LifeBuoy },
      { to: '/jobs-applied', label: 'Jobs Applied', icon: Briefcase },
    ],
  },
  {
    label: 'Resources',
    color: 'text-purple-600 dark:text-purple-400',
    items: [
      { to: '/morning-coffee-sites', label: 'Morning Coffee Sites', icon: Coffee },
    ],
  },
]

export default function Sidebar({ onImport, onExport, isDark, onToggleTheme }) {
  const fileInputRef = useRef(null)

  function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (file && onImport) onImport(file)
    e.target.value = ''
  }

  return (
    <aside className="w-64 bg-gray-50 dark:bg-sidebar text-gray-800 dark:text-white flex flex-col h-screen overflow-y-auto shrink-0 border-r border-gray-200 dark:border-transparent">
      <div className="px-6 py-5 border-b border-gray-200 dark:border-white/10">
        <h1 className="text-xl font-bold tracking-tight">Life Management</h1>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-6">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            <h3 className={`text-xs font-semibold uppercase tracking-wider px-3 mb-2 ${section.color}`}>
              {section.label}
            </h3>
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                        isActive
                          ? 'bg-sidebar-active text-white'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-sidebar-hover hover:text-gray-900 dark:hover:text-white'
                      }`
                    }
                  >
                    <item.icon size={18} />
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-white/10 space-y-2">
        <button
          onClick={onToggleTheme}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 rounded-md text-sm transition-colors"
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 rounded-md text-sm transition-colors"
        >
          <Upload size={16} />
          Import
        </button>
        <button
          onClick={onExport}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 rounded-md text-sm transition-colors"
        >
          <Download size={16} />
          Export
        </button>
      </div>
    </aside>
  )
}
