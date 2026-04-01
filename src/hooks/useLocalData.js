import { useState, useCallback } from 'react'
import { loadData, saveData } from '../utils/storage'
import { genId } from '../utils/id'

export function useLocalData(storageKey) {
  const [rows, setRowsState] = useState(() => loadData(storageKey))

  const addRow = useCallback(
    (defaults = {}) => {
      setRowsState((prev) => {
        const next = [...prev, { id: genId(), ...defaults }]
        saveData(storageKey, next)
        return next
      })
    },
    [storageKey]
  )

  const updateRow = useCallback(
    (id, field, value) => {
      setRowsState((prev) => {
        const next = prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
        saveData(storageKey, next)
        return next
      })
    },
    [storageKey]
  )

  const deleteRow = useCallback(
    (id) => {
      setRowsState((prev) => {
        const next = prev.filter((r) => r.id !== id)
        saveData(storageKey, next)
        return next
      })
    },
    [storageKey]
  )

  const setRows = useCallback(
    (next) => {
      setRowsState(next)
      saveData(storageKey, next)
    },
    [storageKey]
  )

  return { rows, addRow, updateRow, deleteRow, setRows }
}
