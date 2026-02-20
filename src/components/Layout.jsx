import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function Layout({ onImport, onExport }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar onImport={onImport} onExport={onExport} />
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  )
}
