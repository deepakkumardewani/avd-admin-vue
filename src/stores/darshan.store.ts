import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/composables/useApi'
import type { DarshanResponse } from '@/types/api'

export const useDarshanStore = defineStore('darshan', () => {
  const current = ref<DarshanResponse | null>(null)
  const loading = ref(false)
  const fetchError = ref<string | null>(null)

  async function load(force = false) {
    if (current.value && !force) return
    loading.value = true
    fetchError.value = null
    try {
      const { data } = await api.get<DarshanResponse>('/photos/dailyDarshan')
      current.value = data
    } catch (e: unknown) {
      fetchError.value = (e as Error).message
      current.value = null
    } finally {
      loading.value = false
    }
  }

  function clear() {
    current.value = null
  }

  return { current, loading, fetchError, load, clear }
})
