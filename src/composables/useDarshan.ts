import { ref } from 'vue'
import { api } from './useApi'
import type { DarshanResponse } from '@/types/api'

export function useDarshan() {
  const darshan = ref<DarshanResponse | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchDarshan() {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.get<DarshanResponse>('/photos/dailyDarshan')
      darshan.value = data
    } catch (e: unknown) {
      error.value = (e as Error).message
      darshan.value = null
    } finally {
      loading.value = false
    }
  }

  async function uploadDarshan(
    file: File,
    onProgress?: (pct: number) => void
  ): Promise<void> {
    const form = new FormData()
    form.append('upload', file)
    await api.post('/photos/dailyDarshan', form, {
      onUploadProgress: (evt) => {
        if (evt.total) onProgress?.(Math.round((evt.loaded / evt.total) * 100))
      },
    })
  }

  async function deleteDarshan(id: string): Promise<void> {
    await api.delete(`/photos/dailyDarshan?id=${id}`)
    darshan.value = null
  }

  return { darshan, loading, error, fetchDarshan, uploadDarshan, deleteDarshan }
}
