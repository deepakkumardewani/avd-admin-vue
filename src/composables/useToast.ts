import { ref } from 'vue'
import type { Toast, ToastType } from '@/types/api'

// Singleton state — shared across all components
const toasts = ref<Toast[]>([])

export function useToast() {
  function add(type: ToastType, title: string, message?: string) {
    const id = crypto.randomUUID()
    toasts.value.push({ id, type, title, message })
    setTimeout(() => remove(id), 4500)
  }

  function remove(id: string) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  return {
    toasts,
    remove,
    success: (title: string, message?: string) => add('success', title, message),
    error: (title: string, message?: string) => add('error', title, message),
    warning: (title: string, message?: string) => add('warning', title, message),
    info: (title: string, message?: string) => add('info', title, message),
  }
}
