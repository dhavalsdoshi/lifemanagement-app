import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import { useTheme } from '../hooks/useTheme'

export default function Layout({ onImport, onExport }) {
  const { isDark, toggle } = useTheme()

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar onImport={onImport} onExport={onExport} isDark={isDark} onToggleTheme={toggle} />
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  )
}
