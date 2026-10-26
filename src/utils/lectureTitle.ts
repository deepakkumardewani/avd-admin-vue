export const LECTURE_TITLE_MIN = 5
export const LECTURE_TITLE_MAX = 100

export interface LectureTitleValidation {
  valid: boolean
  value: string
  message?: string
}

export function validateLectureTitle(raw: string): LectureTitleValidation {
  const trimmed = raw.trim()
  if (/[\r\n\t]/.test(raw)) {
    return { valid: false, value: trimmed, message: 'Title cannot contain line breaks' }
  }
  if (trimmed.length < LECTURE_TITLE_MIN) {
    return {
      valid: false,
      value: trimmed,
      message: `Title must be at least ${LECTURE_TITLE_MIN} characters`,
    }
  }
  if (trimmed.length > LECTURE_TITLE_MAX) {
    return {
      valid: false,
      value: trimmed,
      message: `Title must be at most ${LECTURE_TITLE_MAX} characters`,
    }
  }
  return { valid: true, value: trimmed }
}
