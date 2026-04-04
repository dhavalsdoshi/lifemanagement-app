import { X } from 'lucide-react'

export default function BottomSheet({ isOpen, onClose, title, children, footer }) {
  if (!isOpen) return null

  return (
    <>
      <div
        data-testid="sheet-backdrop"
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div data-testid="sheet-panel" className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 rounded-t-3xl flex flex-col max-h-[85dvh] shadow-2xl">
        <div className="w-9 h-1 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mt-3 shrink-0" />

        <div className="flex items-center justify-between px-5 py-3 shrink-0">
          <span data-testid="sheet-title" className="text-base font-bold text-gray-900 dark:text-gray-100">{title}</span>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400"
          >
            <X size={14} />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-2 flex-1">{children}</div>

        {footer && (
          <div className="px-5 pb-8 pt-3 border-t border-gray-100 dark:border-gray-800 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </>
  )
}
