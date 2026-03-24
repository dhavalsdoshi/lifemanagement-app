export default function ImportModeModal({ sectionCount, onAppend, onOverwrite, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div
        data-testid="modal-backdrop"
        className="absolute inset-0 bg-black/40"
        onClick={onCancel}
        aria-hidden="true"
      />
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-5">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Import Markdown</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {sectionCount} section{sectionCount !== 1 ? 's' : ''} found. How would you like to import?
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={onAppend}
            className="w-full text-left px-4 py-3 rounded-xl border-2 border-primary bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
          >
            <div className="font-semibold text-sm text-gray-900 dark:text-gray-100">Append to existing data</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Adds imported rows — nothing deleted</div>
          </button>

          <button
            onClick={onOverwrite}
            className="w-full text-left px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="font-semibold text-sm text-gray-900 dark:text-gray-100">Overwrite existing data</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Replaces rows in imported sections</div>
          </button>
        </div>

        <button
          onClick={onCancel}
          className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-center transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
