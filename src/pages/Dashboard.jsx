import { Link } from 'react-router-dom'
import { SECTIONS } from '../config/sections'

const QUICK_LINKS = Object.entries(SECTIONS)
  .filter(([, s]) => s.dashLabel)
  .map(([key, s]) => ({ to: `/${key}`, label: s.dashLabel, icon: s.icon, color: s.dashColor }))

export default function Dashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Welcome Back</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Your personal life management dashboard</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {QUICK_LINKS.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="flex flex-col items-center gap-3 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className={`p-3 rounded-full ${link.color} text-white`}>
              <link.icon size={24} />
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{link.label}</span>
          </Link>
        ))}
      </div>

      <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">Getting Started</h2>
        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <li>Use the navigation menu to move between sections</li>
          <li>Click any cell in a table to edit it inline</li>
          <li>Use Import to load your existing Excel spreadsheet</li>
          <li>Use Export to download all data as an Excel file</li>
        </ul>
      </div>
    </div>
  )
}
