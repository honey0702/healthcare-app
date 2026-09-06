const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '')

export class ApiError extends Error {
  constructor(message, status, payload) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.payload = payload
  }
}

function formatError(payload) {
  if (!payload) return 'Something went wrong. Please try again.'
  if (typeof payload === 'string') return payload
  if (payload.detail) return payload.detail

  const messages = Object.entries(payload).flatMap(([field, value]) => {
    const values = Array.isArray(value) ? value : [value]
    return values.map((item) => `${field === 'non_field_errors' ? '' : `${field}: `}${item}`)
  })
  return messages.join(' ') || 'Something went wrong. Please try again.'
}

async function request(path, options = {}) {
  const { accessToken, ...fetchOptions } = options
  const headers = new Headers(fetchOptions.headers || {})
  headers.set('Content-Type', 'application/json')
  headers.set('Accept', 'application/json')
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`)

  let response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { ...fetchOptions, headers })
  } catch {
    throw new ApiError('Unable to connect to the backend. Start Django on port 8000 and try again.', 0)
  }

  const contentType = response.headers.get('content-type') || ''
  const payload = contentType.includes('application/json') ? await response.json() : await response.text()
  if (!response.ok) throw new ApiError(formatError(payload), response.status, payload)
  return payload
}

export const api = {
  register: (data) => request('/auth/register/', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => request('/auth/login/', { method: 'POST', body: JSON.stringify(data) }),
  me: (accessToken) => request('/auth/me/', { method: 'GET', accessToken }),
}
