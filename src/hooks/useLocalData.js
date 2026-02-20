import { useState, useCallback } from 'react'
import { loadData, saveData } from '../utils/storage'

let counter = 0
function genId() {
  return `${Date.now()}-${++counter}`
}

export function useLocalData(storageKey) {
  const [rows, setRowsState] = useState(() => loadData(storageKey))

  function save(next) {
    setRowsState(next)
    saveData(storageKey, next)
  }

  const addRow = useCallback(
    (defaults = {}) => {
      setRowsState((prev) => {
        const updated = [...prev, { id: genId(), ...defaults }]
        saveData(storageKey, updated)
        return updated
      })
    },
    [storageKey]
  )

  const updateRow = useCallback(
    (id, field, value) => {
      setRowsState((prev) => {
        const updated = prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
        saveData(storageKey, updated)
        return updated
      })
    },
    [storageKey]
  )

  const deleteRow = useCallback(
    (id) => {
      setRowsState((prev) => {
        const updated = prev.filter((r) => r.id !== id)
        saveData(storageKey, updated)
        return updated
      })
    },
    [storageKey]
  )

  const setRows = useCallback(
    (newRows) => save(newRows),
    [storageKey]
  )

  return { rows, addRow, updateRow, deleteRow, setRows }
}
