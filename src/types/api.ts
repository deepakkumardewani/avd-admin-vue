export interface DarshanImageUrl {
  url: string
  placeholder: string
}

export interface DarshanResponse {
  _id: string
  type: string
  date: string // format: "DD-MM-YYYY"
  imageUrls: DarshanImageUrl[]
  createdAt: string
  updatedAt: string
}

export interface AudioDoc {
  _id: string
  title: string     // date portion e.g. "2025-03-25"
  subTitle: string  // lecture title
  url: string       // CDN URL
  fileTitle: string
  createdAt: string
  updatedAt: string
}

export interface AudioListResponse {
  total: number
  docs: AudioDoc[]
}

export type UploadStatus = 'idle' | 'uploading' | 'success' | 'error'

export interface UploadQueueItem {
  id: string
  file: File
  status: UploadStatus
  progress: number
  errorMessage?: string
  preview?: string // object URL for image preview
}

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
}
