let counter = 0

export function genId() {
  return `${Date.now()}-${++counter}`
}
