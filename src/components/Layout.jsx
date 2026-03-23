import { Outlet, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Sidebar from './Sidebar'
import { useTheme } from '../hooks/useTheme'
import { useSidebar } from '../hooks/useSidebar'

export default function Layout({ onImport, onExport }) {
  const { isDark, toggle } = useTheme()
  const { pathname } = useLocation()
  const { isOpen, open, close, toggle: toggleSidebar } = useSidebar(pathname)

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Backdrop — mobile only */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={close}
          aria-hidden="true"
        />
      )}

      <Sidebar
        onImport={onImport}
        onExport={onExport}
        isDark={isDark}
        onToggleTheme={toggle}
        isOpen={isOpen}
        onClose={close}
      />

      <div className="flex flex-col flex-1 min-w-0">
        {/* Mobile top bar */}
        <header className="md:hidden flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <button
            onClick={toggleSidebar}
            aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
            className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <span className="text-base font-bold tracking-tight text-gray-800 dark:text-white">Life Management</span>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
