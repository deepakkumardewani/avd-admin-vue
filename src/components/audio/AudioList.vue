<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Search, RefreshCw, Music2, X, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import AudioCard from './AudioCard.vue'
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import { useAudioStore, AUDIO_PAGE_SIZE } from '@/stores/audio.store'
import { useAudio } from '@/composables/useAudio'
import { useToast } from '@/composables/useToast'

const store = useAudioStore()
const { deleteAudio } = useAudio()
const toast = useToast()

const searchQuery = ref('')
const pendingDeleteId = ref<string | null>(null)
const deleteLoading = ref(false)
const currentPage = ref(1)

const totalPages = computed(() => Math.max(1, Math.ceil(store.total / AUDIO_PAGE_SIZE)))

const visiblePages = computed((): (number | 'ellipsis')[] => {
  const total = totalPages.value
  const current = currentPage.value
  if (total <= 1) return total === 1 ? [1] : []

  const pageSet = new Set<number>([1, total])
  for (let p = current - 1; p <= current + 1; p++) {
    if (p >= 1 && p <= total) pageSet.add(p)
  }

  const sorted = [...pageSet].sort((a, b) => a - b)
  const result: (number | 'ellipsis')[] = []
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i]! - sorted[i - 1]! > 1) {
      result.push('ellipsis')
    }
    result.push(sorted[i]!)
  }
  return result
})

const filteredAudios = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return store.docs
  return store.docs.filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.subTitle.toLowerCase().includes(q) ||
      a.fileTitle.toLowerCase().includes(q)
  )
})

onMounted(() => store.load(currentPage.value, AUDIO_PAGE_SIZE))

function requestDelete(id: string) {
  pendingDeleteId.value = id
}

async function confirmDelete() {
  if (!pendingDeleteId.value) return
  deleteLoading.value = true
  const id = pendingDeleteId.value
  try {
    await deleteAudio(id)
    store.removeLocal(id)
    toast.success('Audio deleted')
    if (store.docs.length === 0 && currentPage.value > 1) {
      goToPage(currentPage.value - 1)
    }
  } catch (e: unknown) {
    toast.error('Delete failed', (e as Error).message)
  } finally {
    deleteLoading.value = false
    pendingDeleteId.value = null
  }
}

function refresh() {
  store.load(currentPage.value, AUDIO_PAGE_SIZE, true)
}

function goToPage(page: number) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  searchQuery.value = ''
  store.load(page, AUDIO_PAGE_SIZE, true)
}
</script>

<template>
  <div class="w-full flex flex-col">
    <div class="flex items-center justify-between mb-5">
      <p class="text-sm text-temple-muted font-sans">
        <span v-if="store.loading">Loading…</span>
        <span v-else-if="store.fetchError && store.docs.length === 0">Couldn’t load lectures</span>
        <span v-else>
          <span class="font-semibold text-saffron-600">{{ store.total }}</span> lecture{{ store.total !== 1 ? 's' : '' }} total
        </span>
      </p>
      <button
        class="flex items-center gap-2 px-3 py-2 text-xs font-medium font-sans text-temple-muted hover:text-temple-brown border border-cream-darker rounded-lg hover:bg-cream transition-all"
        @click="refresh"
      >
        <RefreshCw :size="13" :class="{ 'animate-spin': store.loading }" />
        Refresh
      </button>
    </div>

    <div class="relative mb-4">
      <Search :size="15" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-temple-muted pointer-events-none" />
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search lectures…"
        class="w-full pl-9 pr-9 py-2.5 text-sm font-sans text-temple-brown bg-white border border-cream-darker rounded-xl placeholder:text-temple-sand focus:outline-none focus:border-saffron focus:ring-2 focus:ring-saffron/20 transition-all"
      />
      <button
        v-if="searchQuery"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-temple-muted hover:text-temple-brown"
        @click="searchQuery = ''"
      >
        <X :size="14" />
      </button>
    </div>

    <div class="overflow-y-auto max-h-[calc(100svh-380px)] lg:max-h-[calc(100svh-240px)] pr-1">
      <SkeletonLoader v-if="store.loading" variant="card" :count="6" />

      <div v-else-if="store.fetchError" class="bg-red-50 border border-red-100 rounded-xl px-5 py-4">
        <p class="text-sm text-red-600 font-sans">{{ store.fetchError }}</p>
        <button class="text-xs text-red-500 underline font-sans mt-2" @click="refresh">Retry</button>
      </div>

      <EmptyState
        v-else-if="filteredAudios.length === 0"
        :icon="Music2"
        :title="searchQuery ? 'No matches found' : 'No audio lectures'"
        :message="searchQuery ? 'No lectures match your search' : 'Uploaded audio lectures will appear here.'"
      />

      <TransitionGroup
        v-else
        name="list"
        tag="div"
        class="space-y-2.5"
      >
        <AudioCard
          v-for="audio in filteredAudios"
          :key="audio._id"
          :audio="audio"
          @delete="requestDelete"
        />
      </TransitionGroup>
    </div>

    <div v-if="!store.loading && !store.fetchError && totalPages > 1" class="flex items-center justify-between mt-4 pt-3 border-t border-cream-darker">
      <p class="text-xs text-temple-muted font-sans">
        Page <span class="font-medium text-temple-brown">{{ currentPage }}</span> of <span class="font-medium text-temple-brown">{{ totalPages }}</span>
      </p>
      <div class="flex items-center gap-1">
        <button
          :disabled="currentPage <= 1"
          class="flex items-center justify-center w-8 h-8 rounded-lg border border-cream-darker text-temple-muted hover:text-temple-brown hover:bg-cream disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          @click="goToPage(currentPage - 1)"
        >
          <ChevronLeft :size="14" />
        </button>

        <template v-for="(entry, idx) in visiblePages" :key="entry === 'ellipsis' ? `e-${idx}` : entry">
          <span
            v-if="entry === 'ellipsis'"
            class="w-8 text-center text-xs text-temple-sand"
          >…</span>
          <button
            v-else
            class="flex items-center justify-center w-8 h-8 rounded-lg border text-xs font-medium font-sans transition-all"
            :class="entry === currentPage
              ? 'bg-saffron text-white border-saffron'
              : 'border-cream-darker text-temple-muted hover:text-temple-brown hover:bg-cream'"
            @click="goToPage(entry)"
          >
            {{ entry }}
          </button>
        </template>

        <button
          :disabled="currentPage >= totalPages"
          class="flex items-center justify-center w-8 h-8 rounded-lg border border-cream-darker text-temple-muted hover:text-temple-brown hover:bg-cream disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          @click="goToPage(currentPage + 1)"
        >
          <ChevronRight :size="14" />
        </button>
      </div>
    </div>

    <ConfirmDialog
      v-if="pendingDeleteId"
      title="Delete this audio?"
      message="This will permanently remove the audio lecture. This action cannot be undone."
      confirmLabel="Delete"
      :loading="deleteLoading"
      @confirm="confirmDelete"
      @cancel="pendingDeleteId = null"
    />
  </div>
</template>

<style scoped>
.list-enter-active { animation: slideUp 0.3s ease-out; }
.list-leave-active { transition: all 0.2s ease; }
.list-leave-to { opacity: 0; transform: translateX(-8px); }
.list-move { transition: transform 0.3s ease; }

@keyframes slideUp {
  from { transform: translateY(8px); opacity: 0; }
  to   { transform: translateY(0);   opacity: 1; }
}
</style>
