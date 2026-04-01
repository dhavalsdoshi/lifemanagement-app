import { NavLink } from 'react-router-dom'
import { useRef, useState, useEffect } from 'react'
import { SECTIONS, CATEGORIES } from '../config/sections'
import { openFile } from '../utils/platform'
import {
  Download, Upload, Sun, Moon, ChevronUp, Sheet, FileText,
} from 'lucide-react'

const NAV_SECTIONS = CATEGORIES.map(({ label, color }) => ({
  label,
  color,
  items: Object.entries(SECTIONS)
    .filter(([, s]) => s.category === label)
    .map(([key, s]) => ({ to: `/${key}`, label: s.navLabel, icon: s.icon })),
}))

export default function Sidebar({
  onImport, onExport, onMarkdownImport, onMarkdownExport,
  isDark, onToggleTheme, isOpen, onClose,
}) {
  const xlsxInputRef = useRef(null)
  const zipInputRef = useRef(null)
  const [openMenu, setOpenMenu] = useState(null) // 'import' | 'export' | null
  const footerRef = useRef(null)

  // Close menu on outside click
  useEffect(() => {
    if (!openMenu) return
    function handleClick(e) {
      if (footerRef.current && !footerRef.current.contains(e.target)) {
        setOpenMenu(null)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [openMenu])

  function handleXlsxChange(e) {
    const file = e.target.files?.[0]
    if (file && onImport) onImport(file)
    e.target.value = ''
  }

  function handleZipChange(e) {
    const file = e.target.files?.[0]
    if (file && onMarkdownImport) onMarkdownImport(file)
    e.target.value = ''
  }

  function toggleMenu(menu) {
    setOpenMenu((prev) => (prev === menu ? null : menu))
  }

  async function handleImportFormat(format) {
    setOpenMenu(null)
    const filters = format === 'xlsx'
      ? [{ name: 'Excel', extensions: ['xlsx', 'xls'] }]
      : [{ name: 'ZIP', extensions: ['zip'] }]

    const file = await openFile({ filters })
    if (file) {
      if (format === 'xlsx') onImport?.(file)
      else onMarkdownImport?.(file)
      return
    }

    // Browser fallback: trigger hidden file input
    if (format === 'xlsx') xlsxInputRef.current?.click()
    else zipInputRef.current?.click()
  }

  const menuItemClass =
    'w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors'

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-40 w-64
        md:relative md:translate-x-0
        bg-gray-50 dark:bg-sidebar text-gray-800 dark:text-white
        flex flex-col h-screen overflow-y-auto shrink-0
        border-r border-gray-200 dark:border-transparent
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
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
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
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

      {/* Footer with theme toggle + import/export format menus */}
      <div ref={footerRef} className="p-4 border-t border-gray-200 dark:border-white/10 space-y-2">
        <button
          onClick={onToggleTheme}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 rounded-md text-sm transition-colors"
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </button>

        {/* Hidden file inputs (browser fallback) */}
        <input ref={xlsxInputRef} type="file" accept=".xlsx,.xls" onChange={handleXlsxChange} className="hidden" />
        <input ref={zipInputRef} type="file" accept=".zip" onChange={handleZipChange} className="hidden" />

        {/* Import button + dropdown */}
        <div className="relative">
          {openMenu === 'import' && (
            <div className="absolute bottom-full left-0 right-0 mb-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden z-10">
              <button
                className={menuItemClass}
                onClick={() => handleImportFormat('xlsx')}
              >
                <Sheet size={15} className="text-green-600 shrink-0" />
                Excel (.xlsx)
              </button>
              <button
                className={menuItemClass}
                onClick={() => handleImportFormat('zip')}
              >
                <FileText size={15} className="text-blue-500 shrink-0" />
                Markdown (.zip)
              </button>
            </div>
          )}
          <button
            onClick={() => toggleMenu('import')}
            aria-expanded={openMenu === 'import'}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 rounded-md text-sm transition-colors"
          >
            <Upload size={16} />
            Import
            <ChevronUp size={14} className={`ml-auto transition-transform ${openMenu === 'import' ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Export button + dropdown */}
        <div className="relative">
          {openMenu === 'export' && (
            <div className="absolute bottom-full left-0 right-0 mb-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden z-10">
              <button
                className={menuItemClass}
                onClick={() => { onExport?.(); setOpenMenu(null) }}
              >
                <Sheet size={15} className="text-green-600 shrink-0" />
                Excel (.xlsx)
              </button>
              <button
                className={menuItemClass}
                onClick={() => { onMarkdownExport?.(); setOpenMenu(null) }}
              >
                <FileText size={15} className="text-blue-500 shrink-0" />
                Markdown (.zip)
              </button>
            </div>
          )}
          <button
            onClick={() => toggleMenu('export')}
            aria-expanded={openMenu === 'export'}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 rounded-md text-sm transition-colors"
          >
            <Download size={16} />
            Export
            <ChevronUp size={14} className={`ml-auto transition-transform ${openMenu === 'export' ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>
    </aside>
  )
}
