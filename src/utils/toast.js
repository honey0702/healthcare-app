/* Lightweight toast event bus */
const listeners = new Set()

export function toast(message, type = 'success') {
  const id = Date.now() + Math.random()
  listeners.forEach((fn) => fn({ id, message, type }))
}

export function onToast(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export const toastIcon = {
  success: '✅',
  error: '❌',
  info: 'ℹ️',
}
