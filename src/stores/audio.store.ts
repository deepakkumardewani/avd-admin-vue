import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/composables/useApi'
import type { AudioDoc, AudioListResponse } from '@/types/api'

export const AUDIO_PAGE_SIZE = 15

export const useAudioStore = defineStore('audio', () => {
  const docs = ref<AudioDoc[]>([])
  const total = ref(0)
  const loading = ref(false)
  const fetchError = ref<string | null>(null)

  const loadedKeys = new Set<string>()
  let inFlightKey: string | null = null
  let inFlightPromise: Promise<void> | null = null

  async function load(page = 1, limit = 50, force = false) {
    const key = `${page}:${limit}`

    if (!force && loadedKeys.has(key) && fetchError.value === null) {
      return
    }

    if (!force && inFlightKey === key && inFlightPromise) {
      return inFlightPromise
    }

    loading.value = true
    fetchError.value = null
    inFlightKey = key

    inFlightPromise = (async () => {
      try {
        const { data } = await api.get<AudioListResponse>('/lectures/audio', {
          params: { page, limit },
        })
        docs.value = data.docs
        total.value = data.total
        loadedKeys.add(key)
      } catch (e: unknown) {
        fetchError.value = (e as Error).message
      } finally {
        loading.value = false
        if (inFlightKey === key) {
          inFlightKey = null
          inFlightPromise = null
        }
      }
    })()

    return inFlightPromise
  }

  function removeLocal(id: string) {
    docs.value = docs.value.filter((d) => d._id !== id)
    total.value = Math.max(0, total.value - 1)
  }

  return { docs, total, loading, fetchError, load, removeLocal }
})
