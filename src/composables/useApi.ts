import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 60_000,
})

function nonEmptyString(value: unknown): string | undefined {
  if (typeof value === 'string' && value.trim() !== '') return value
  return undefined
}

export class ApiError extends Error {
  readonly detail?: string

  constructor(message: string, detail?: string) {
    super(message)
    this.name = 'ApiError'
    this.detail = detail
  }
}

export function formatApiError(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.detail && error.detail !== error.message) {
      return `${error.message} — ${error.detail}`
    }
    return error.message
  }
  if (error instanceof Error) return error.message
  return 'Network error'
}

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const data = err.response?.data as Record<string, unknown> | undefined
    const msg = nonEmptyString(data?.msg)
    const message = nonEmptyString(data?.message)
    const errorField = nonEmptyString(data?.error)
    const isTimeout =
      err.code === 'ECONNABORTED' ||
      (typeof err.message === 'string' && err.message.includes('timeout'))

    const display =
      msg ??
      message ??
      errorField ??
      (isTimeout
        ? 'Upload timed out. The file may still have uploaded — check View Audios or try again.'
        : undefined) ??
      nonEmptyString(err.message) ??
      'Network error'

    const detail =
      errorField && errorField !== display ? errorField : undefined

    return Promise.reject(new ApiError(display, detail))
  },
)
