import '@testing-library/jest-dom'

// Node.js 22+ has a built-in localStorage that conflicts with happy-dom.
// Override globalThis.localStorage with a proper Web Storage implementation.
const store = new Map()
const webStorage = {
  getItem: (key) => store.get(key) ?? null,
  setItem: (key, value) => store.set(key, String(value)),
  removeItem: (key) => store.delete(key),
  clear: () => store.clear(),
  get length() { return store.size },
  key: (index) => [...store.keys()][index] ?? null,
}
Object.defineProperty(globalThis, 'localStorage', { value: webStorage, writable: true })
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'localStorage', { value: webStorage, writable: true })
}
