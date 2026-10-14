<script setup lang="ts">
import { X, CheckCircle2, AlertCircle, Music2, FileImage } from 'lucide-vue-next'
import type { UploadQueueItem } from '@/types/api'

defineProps<{ item: UploadQueueItem }>()
const emit = defineEmits<{ remove: [id: string] }>()

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
</script>

<template>
  <div
    class="animate-slide-up flex gap-3 bg-white rounded-xl px-4 py-3 border border-cream-darker shadow-sm"
    :class="item.status === 'error' ? 'items-start' : 'items-center'"
  >
    <!-- Preview / Icon -->
    <div class="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-cream-dark flex items-center justify-center">
      <img
        v-if="item.preview"
        :src="item.preview"
        class="w-full h-full object-cover"
        alt=""
      />
      <Music2 v-else-if="item.file.type.startsWith('audio/')" :size="18" class="text-saffron" />
      <FileImage v-else :size="18" class="text-saffron" />
    </div>

    <!-- Info + Progress -->
    <div class="flex-1 min-w-0">
      <p class="text-sm font-medium font-sans text-temple-brown truncate">{{ item.file.name }}</p>
      <div class="flex items-center gap-2 mt-1">
        <span class="text-[11px] text-temple-muted font-sans">{{ formatSize(item.file.size) }}</span>
      </div>
      <p
        v-if="item.status === 'error' && item.errorMessage"
        class="mt-1 text-xs leading-snug text-red-600 font-sans break-words"
      >
        {{ item.errorMessage }}
      </p>

      <!-- Progress bar -->
      <div
        v-if="item.status === 'uploading'"
        class="mt-1.5 h-1 rounded-full bg-cream-dark overflow-hidden"
      >
        <div
          class="h-full bg-saffron-gradient rounded-full transition-all duration-300"
          :style="{ width: `${item.progress}%` }"
        />
      </div>
    </div>

    <!-- Status icon -->
    <div class="shrink-0">
      <span v-if="item.status === 'uploading'" class="text-xs text-saffron font-sans font-medium">
        {{ item.progress }}%
      </span>
      <CheckCircle2 v-else-if="item.status === 'success'" :size="20" class="text-green-500" />
      <AlertCircle  v-else-if="item.status === 'error'"   :size="20" class="text-red-500" />
      <button
        v-else
        class="text-temple-muted hover:text-red-500 transition-colors"
        @click="emit('remove', item.id)"
      >
        <X :size="16" />
      </button>
    </div>
  </div>
</template>
