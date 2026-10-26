import { ref } from 'vue'
import type { UploadQueueItem, UploadStatus } from '@/types/api'

interface UseFileUploadOptions {
  accept: string[]    // MIME types e.g. ['image/png', 'image/jpeg']
  maxSizeMB?: number
  multiple?: boolean
  generatePreview?: boolean // create object URL for images
}

export function useFileUpload(opts: UseFileUploadOptions) {
  const queue = ref<UploadQueueItem[]>([])
  const isDragOver = ref(false)
  const validationError = ref<string | null>(null)

  function validateFile(file: File): string | null {
    if (!opts.accept.includes(file.type)) {
      return `Unsupported file type: ${file.type || 'unknown'}. Accepted: ${opts.accept.join(', ')}`
    }
    if (opts.maxSizeMB && file.size > opts.maxSizeMB * 1024 * 1024) {
      return `"${file.name}" exceeds the ${opts.maxSizeMB}MB limit`
    }
    return null
  }

  function addFiles(files: FileList | File[]) {
    validationError.value = null
    const arr = Array.from(files)
    if (!opts.multiple && arr.length > 1) {
      validationError.value = 'Only one file can be uploaded at a time'
      return
    }
    for (const file of arr) {
      const err = validateFile(file)
      if (err) {
        validationError.value = err
        continue
      }
      const preview =
        opts.generatePreview && file.type.startsWith('image/')
          ? URL.createObjectURL(file)
          : undefined

      queue.value.push({
        id: crypto.randomUUID(),
        file,
        status: 'idle',
        progress: 0,
        preview,
      })
    }
  }

  function removeFromQueue(id: string) {
    const item = queue.value.find((i) => i.id === id)
    if (item?.preview) URL.revokeObjectURL(item.preview)
    queue.value = queue.value.filter((i) => i.id !== id)
  }

  function setStatus(id: string, status: UploadStatus, progress = 0, errorMessage?: string) {
    const item = queue.value.find((i) => i.id === id)
    if (item) {
      item.status = status
      item.progress = progress
      if (errorMessage !== undefined) {
        item.errorMessage = errorMessage || undefined
      } else if (status !== 'error') {
        item.errorMessage = undefined
      }
    }
  }

  function clearSucceeded() {
    queue.value
      .filter((i) => i.status === 'success')
      .forEach((i) => { if (i.preview) URL.revokeObjectURL(i.preview) })
    queue.value = queue.value.filter((i) => i.status !== 'success')
  }

  function clearAll() {
    queue.value.forEach((i) => { if (i.preview) URL.revokeObjectURL(i.preview) })
    queue.value = []
  }

  function onDragEnter(e: DragEvent) {
    e.preventDefault()
    isDragOver.value = true
  }
  function onDragOver(e: DragEvent) {
    e.preventDefault()
    isDragOver.value = true
  }
  function onDragLeave() { isDragOver.value = false }
  function onDrop(e: DragEvent) {
    e.preventDefault()
    isDragOver.value = false
    if (e.dataTransfer?.files) addFiles(e.dataTransfer.files)
  }

  return {
    queue,
    isDragOver,
    validationError,
    addFiles,
    removeFromQueue,
    setStatus,
    clearSucceeded,
    clearAll,
    onDragEnter,
    onDragOver,
    onDragLeave,
    onDrop,
  }
}
