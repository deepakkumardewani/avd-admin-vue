export interface ParsedLectureDate {
  year: string
  month: string
  day: string
}

function isRealUtcDate(year: number, month: number, day: number): boolean {
  const date = new Date(Date.UTC(year, month - 1, day))
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  )
}

/** Matches backend parseDatePrefix (YYYY-MM-DD, DD.MM.YYYY, etc.). */
export function parseUserDateString(input: string): ParsedLectureDate | null {
  const datePart = input.trim()
  if (!datePart) return null

  const yearFirst = datePart.match(/^(\d{4})[.-](\d{2})[.-](\d{2})$/)
  const dayFirst = datePart.match(/^(\d{2})[.-](\d{2})[.-](\d{4})$/)

  let year: number
  let month: number
  let day: number

  if (yearFirst) {
    year = Number(yearFirst[1])
    month = Number(yearFirst[2])
    day = Number(yearFirst[3])
  } else if (dayFirst) {
    day = Number(dayFirst[1])
    month = Number(dayFirst[2])
    year = Number(dayFirst[3])
  } else {
    return null
  }

  if (!isRealUtcDate(year, month, day)) return null

  return {
    year: String(year),
    month: String(month).padStart(2, '0'),
    day: String(day).padStart(2, '0'),
  }
}

export function toIsoDateString(parsed: ParsedLectureDate): string {
  return `${parsed.year}-${parsed.month}-${parsed.day}`
}

/** Local calendar date as YYYY-MM-DD (for form defaults). */
export function formatToday(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function isoToDisplay(iso: string): string {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!m) return iso
  return `${m[3]}.${m[2]}.${m[1]}`
}

export function userInputToIso(input: string): string | null {
  const parsed = parseUserDateString(input)
  return parsed ? toIsoDateString(parsed) : null
}

export function isValidIsoDateString(iso: string): boolean {
  return userInputToIso(iso) === iso
}

export function isoToParts(iso: string): { day: string; month: string; year: string } | null {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!m || !isValidIsoDateString(iso)) return null
  return { year: m[1], month: m[2], day: m[3] }
}

/** Build ISO from DD / MM / YYYY digit segments (partial segments return null). */
export function partsToIso(day: string, month: string, year: string): string | null {
  if (day.length !== 2 || month.length !== 2 || year.length !== 4) return null
  const parsed = parseUserDateString(`${day}.${month}.${year}`)
  return parsed ? toIsoDateString(parsed) : null
}

export function partsFromToday(): { day: string; month: string; year: string } {
  const iso = formatToday()
  const parts = isoToParts(iso)!
  return parts
}

/** Earliest lecture date allowed in admin uploads (matches backend). */
export const LECTURE_UPLOAD_DATE_MIN = '2015-01-01'

export function isDateAllowedForUpload(iso: string): boolean {
  if (!isValidIsoDateString(iso)) return false
  return iso >= LECTURE_UPLOAD_DATE_MIN && iso <= formatToday()
}

export function uploadDateRangeMessage(iso: string): string | null {
  if (!isValidIsoDateString(iso)) return 'Invalid date'
  if (iso < LECTURE_UPLOAD_DATE_MIN) return 'Date is too far in the past'
  if (iso > formatToday()) return 'Date cannot be in the future'
  return null
}
