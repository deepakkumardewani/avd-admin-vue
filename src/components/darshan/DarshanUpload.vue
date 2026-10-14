<script setup lang="ts">
import { computed } from 'vue'
import { Upload, Trash2, RefreshCw } from 'lucide-vue-next'
import DropZone from '@/components/upload/DropZone.vue'
import UploadQueue from '@/components/upload/UploadQueue.vue'
import { useFileUpload } from '@/composables/useFileUpload'
import { useDarshan } from '@/composables/useDarshan'
import { useDarshanStore } from '@/stores/darshan.store'
import { useToast } from '@/composables/useToast'
import { formatApiError } from '@/composables/useApi'

const toast = useToast()
const { uploadDarshan } = useDarshan()
const darshanStore = useDarshanStore()

const {
  queue, isDragOver, validationError,
  addFiles, removeFromQueue, setStatus, clearSucceeded, clearAll,
  onDragEnter, onDragOver, onDragLeave, onDrop,
} = useFileUpload({
  accept: ['image/png', 'image/jpeg', 'image/jpg'],
  multiple: true,
  generatePreview: true,
})

const idleItems = computed(() => queue.value.filter(i => i.status === 'idle'))
const isUploading = computed(() => queue.value.some(i => i.status === 'uploading'))

async function uploadAll() {
  if (idleItems.value.length === 0) return

  for (const item of idleItems.value) {
    setStatus(item.id, 'uploading', 0)
    try {
      await uploadDarshan(item.file, (pct) => setStatus(item.id, 'uploading', pct))
      setStatus(item.id, 'success', 100)
      toast.success('Uploaded', item.file.name)
    } catch (e: unknown) {
      const msg = formatApiError(e)
      setStatus(item.id, 'error', 0, msg)
      toast.error('Upload failed', msg)
    }
  }

  // Refresh darshan store so the view tab shows new images
  darshanStore.clear()
}
</script>

<template>
  <div class="w-full max-w-3xl flex flex-col gap-4">
    <!-- Drop zone with drag events -->
    <div
      @dragenter="onDragEnter"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
    >
      <DropZone
        accept="image/png,image/jpeg,image/jpg"
        :multiple="true"
        :isDragOver="isDragOver"
        hint="PNG, JPEG accepted"
        @filesSelected="addFiles"
      />
    </div>

    <!-- Validation error -->
    <Transition name="fade">
      <p v-if="validationError" class="mt-3 text-sm text-red-500 font-sans bg-red-50 px-4 py-2.5 rounded-lg border border-red-100">
        {{ validationError }}
      </p>
    </Transition>

    <!-- Upload queue -->
    <UploadQueue :items="queue" @remove="removeFromQueue" />

    <!-- Actions -->
    <Transition name="fade">
      <div v-if="queue.length > 0" class="mt-5 flex items-center gap-3">
        <button
          class="flex items-center gap-2 px-5 py-2.5 bg-saffron-gradient text-white text-sm font-semibold font-sans rounded-xl shadow-temple hover:shadow-temple-lg hover:scale-[1.02] active:scale-100 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
          :disabled="isUploading || idleItems.length === 0"
          @click="uploadAll"
        >
          <span v-if="isUploading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <Upload v-else :size="16" />
          {{ isUploading ? 'Uploading…' : `Upload ${idleItems.length} file${idleItems.length !== 1 ? 's' : ''}` }}
        </button>

        <button
          v-if="queue.some(i => i.status === 'success')"
          class="flex items-center gap-2 px-4 py-2.5 text-sm font-medium font-sans text-temple-muted hover:text-temple-brown border border-cream-darker rounded-xl hover:bg-cream transition-all"
          @click="clearSucceeded"
        >
          <RefreshCw :size="14" />
          Clear done
        </button>

        <button
          v-if="!isUploading"
          class="flex items-center gap-2 px-4 py-2.5 text-sm font-medium font-sans text-temple-muted hover:text-red-500 border border-cream-darker rounded-xl hover:bg-red-50 hover:border-red-100 transition-all ml-auto"
          @click="clearAll"
        >
          <Trash2 :size="14" />
          Clear all
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
