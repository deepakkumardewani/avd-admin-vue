import { ref } from 'vue'
import { api } from './useApi'
import type { AudioDoc, AudioListResponse } from '@/types/api'

export function useAudio() {
  const audios = ref<AudioDoc[]>([])
  const total = ref(0)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAudios(page = 1, limit = 50): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.get<AudioListResponse>('/lectures/audio', {
        params: { page, limit },
      })
      audios.value = data.docs
      total.value = data.total
    } catch (e: unknown) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  async function uploadAudio(
    file: File,
    onProgress?: (pct: number) => void
  ): Promise<void> {
    // Preserve Angular's audiotitle logic: first word before the first space in the filename
    const audioTitle = file.name.split(' ')[0]
    const form = new FormData()
    form.append('upload', file)
    await api.post('/lectures/audio/daily', form, {
      headers: { audiotitle: audioTitle },
      onUploadProgress: (evt) => {
        if (evt.total) onProgress?.(Math.round((evt.loaded / evt.total) * 100))
      },
    })
  }

  async function deleteAudio(id: string): Promise<void> {
    await api.delete(`/lectures/audio?id=${id}`)
    audios.value = audios.value.filter((a) => a._id !== id)
    total.value = Math.max(0, total.value - 1)
  }

  return { audios, total, loading, error, fetchAudios, uploadAudio, deleteAudio }
}
