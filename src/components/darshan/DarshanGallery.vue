<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RefreshCw, Trash2, Images, Calendar } from 'lucide-vue-next'
import DarshanImageCard from './DarshanImageCard.vue'
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import { useDarshanStore } from '@/stores/darshan.store'
import { useDarshan } from '@/composables/useDarshan'
import { useToast } from '@/composables/useToast'

const store = useDarshanStore()
const { deleteDarshan } = useDarshan()
const toast = useToast()

const showConfirm = ref(false)
const deleteLoading = ref(false)

onMounted(() => store.load())

function formatDate(dateStr: string): string {
  // API returns "DD-MM-YYYY"
  const parts = dateStr.split('-')
  if (parts.length !== 3) return dateStr
  const [day, month, year] = parts
  const date = new Date(`${year}-${month}-${day}`)
  if (isNaN(date.getTime())) return dateStr
  return date.toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })
}

async function confirmDelete() {
  if (!store.current) return
  deleteLoading.value = true
  try {
    await deleteDarshan(store.current._id)
    store.clear()
    toast.success('Darshan deleted', 'Today\'s darshan has been removed')
  } catch (e: unknown) {
    toast.error('Delete failed', (e as Error).message)
  } finally {
    deleteLoading.value = false
    showConfirm.value = false
  }
}
</script>

<template>
  <div class="w-full">
    <!-- Loading -->
    <SkeletonLoader v-if="store.loading" variant="image" :count="4" />

    <!-- Error -->
    <div v-else-if="store.fetchError" class="bg-red-50 border border-red-100 rounded-xl px-5 py-4">
      <p class="text-sm text-red-600 font-sans">{{ store.fetchError }}</p>
      <button class="text-xs text-red-500 underline font-sans mt-2" @click="store.load(true)">Retry</button>
    </div>

    <!-- Empty -->
    <EmptyState
      v-else-if="!store.current || store.current.imageUrls.length === 0"
      :icon="Images"
      title="No darshan today"
      message="Upload today's darshan photos to see them here."
    />

    <!-- Content -->
    <template v-else>
      <!-- Meta toolbar -->
      <div class="flex flex-wrap items-center gap-3 mb-4">
        <div class="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-cream-darker shadow-sm">
          <Calendar :size="14" class="text-saffron" />
          <span class="text-sm font-medium font-sans text-temple-brown">{{ formatDate(store.current.date) }}</span>
        </div>
        <div class="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-cream-darker shadow-sm">
          <Images :size="14" class="text-saffron" />
          <span class="text-sm font-medium font-sans text-temple-brown">
            {{ store.current.imageUrls.length }} image{{ store.current.imageUrls.length !== 1 ? 's' : '' }}
          </span>
        </div>

        <button
          class="flex items-center gap-2 px-3 py-2 text-xs font-medium font-sans text-temple-muted hover:text-temple-brown border border-cream-darker rounded-lg hover:bg-cream transition-all"
          @click="store.load(true)"
        >
          <RefreshCw :size="13" :class="{ 'animate-spin': store.loading }" />
          Refresh
        </button>

        <!-- Delete button -->
        <button
          class="ml-auto flex items-center gap-2 px-4 py-2 text-sm font-medium font-sans text-red-500 hover:text-white bg-white hover:bg-red-500 border border-red-100 hover:border-red-500 rounded-xl transition-all duration-200"
          @click="showConfirm = true"
        >
          <Trash2 :size="14" />
          Delete Today's Darshan
        </button>
      </div>

      <!-- Image grid -->
      <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 animate-fade-in">
        <DarshanImageCard
          v-for="(img, i) in store.current.imageUrls"
          :key="img.url"
          :image="img"
          :index="i"
        />
      </div>
    </template>

    <!-- Confirm delete dialog -->
    <ConfirmDialog
      v-if="showConfirm"
      title="Delete today's darshan?"
      message="This will permanently remove all darshan images uploaded today. This action cannot be undone."
      confirmLabel="Delete All"
      :loading="deleteLoading"
      @confirm="confirmDelete"
      @cancel="showConfirm = false"
    />
  </div>
</template>
