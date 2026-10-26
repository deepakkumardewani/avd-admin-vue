<script setup lang="ts">
import { computed, ref } from 'vue'
import { Upload, Trash2, RefreshCw } from 'lucide-vue-next'
import DropZone from '@/components/upload/DropZone.vue'
import UploadQueue from '@/components/upload/UploadQueue.vue'
import LectureDateField from '@/components/audio/LectureDateField.vue'
import { useFileUpload } from '@/composables/useFileUpload'
import { useAudio } from '@/composables/useAudio'
import { useAudioStore, AUDIO_PAGE_SIZE } from '@/stores/audio.store'
import { useToast } from '@/composables/useToast'
import { formatApiError } from '@/composables/useApi'
import { formatToday } from '@/utils/lectureDate'
import {
  LECTURE_TITLE_MAX,
  validateLectureTitle,
} from '@/utils/lectureTitle'

const toast = useToast()
const { uploadAudio } = useAudio()
const audioStore = useAudioStore()

const {
  queue, isDragOver, validationError,
  addFiles, removeFromQueue, setStatus, clearSucceeded, clearAll,
  onDragEnter, onDragOver, onDragLeave, onDrop,
} = useFileUpload({
  accept: ['audio/mp3', 'audio/mpeg', 'audio/x-mp3'],
  maxSizeMB: 15,
  multiple: false,
  generatePreview: false,
})

const lectureDate = ref(formatToday())
const lectureTitle = ref('')
const dateValid = ref(true)
const titleTouched = ref(false)

const fieldClass =
  'h-11 w-full px-3 text-sm font-sans text-temple-brown bg-white border border-cream-darker rounded-xl placeholder:text-temple-sand focus:outline-none focus:border-saffron focus:ring-2 focus:ring-saffron/20 transition-all'

const titleValidation = computed(() => validateLectureTitle(lectureTitle.value))

const showTitleError = computed(
  () => titleTouched.value && lectureTitle.value.length > 0 && !titleValidation.value.valid,
)

const uploadableItems = computed(() =>
  queue.value.filter((i) => i.status === 'idle' || i.status === 'error'),
)
const isUploading = computed(() => queue.value.some(i => i.status === 'uploading'))

const canUpload = computed(() => {
  return (
    dateValid.value &&
    lectureDate.value !== '' &&
    titleValidation.value.valid &&
    uploadableItems.value.length > 0 &&
    !isUploading.value
  )
})

async function uploadAll() {
  titleTouched.value = true
  if (uploadableItems.value.length === 0 || !canUpload.value) return

  for (const item of uploadableItems.value) {
    setStatus(item.id, 'uploading', 0)
    try {
      await uploadAudio(
        item.file,
        { date: lectureDate.value, subTitle: titleValidation.value.value },
        (pct) => setStatus(item.id, 'uploading', pct),
      )
      setStatus(item.id, 'success', 100)
      toast.success('Audio uploaded', item.file.name)
      audioStore.load(1, AUDIO_PAGE_SIZE, true)
    } catch (e: unknown) {
      const msg = formatApiError(e)
      setStatus(item.id, 'error', 0, msg)
      toast.error('Upload failed', msg)
    }
  }
}
</script>

<template>
  <div class="w-full max-w-3xl">
    <section
      class="mb-5 overflow-visible rounded-2xl border border-cream-darker/90 bg-white/70 backdrop-blur-sm p-4 sm:p-5 shadow-[0_1px_0_rgba(255,255,255,0.8)_inset]"
      aria-labelledby="lecture-details-heading"
    >
      <h3
        id="lecture-details-heading"
        class="mb-4 text-[11px] font-sans font-semibold uppercase tracking-[0.14em] text-saffron"
      >
        Lecture details
      </h3>
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(11rem,13.5rem)_1fr] sm:items-start sm:gap-4">
        <LectureDateField v-model="lectureDate" @valid="dateValid = $event" />
        <div class="min-w-0">
          <input
            id="lecture-title"
            v-model="lectureTitle"
            type="text"
            autocomplete="off"
            placeholder="Title"
            :maxlength="LECTURE_TITLE_MAX"
            :class="[
              fieldClass,
              showTitleError ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : '',
            ]"
            @blur="titleTouched = true"
          />
          <p v-if="showTitleError" class="mt-1.5 text-xs text-red-500 font-sans">
            {{ titleValidation.message }}
          </p>
        </div>
      </div>
    </section>

    <div
      @dragenter="onDragEnter"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
    >
      <DropZone
        accept="audio/mp3,audio/mpeg"
        :multiple="false"
        :isDragOver="isDragOver"
        hint="MP3 accepted · Max 15 MB"
        @filesSelected="addFiles"
      />
    </div>

    <Transition name="fade">
      <p v-if="validationError" class="mt-3 text-sm text-red-500 font-sans bg-red-50 px-4 py-2.5 rounded-lg border border-red-100">
        {{ validationError }}
      </p>
    </Transition>

    <UploadQueue :items="queue" @remove="removeFromQueue" />

    <Transition name="fade">
      <div v-if="queue.length > 0" class="mt-5 flex items-center gap-3">
        <button
          class="flex items-center gap-2 px-5 py-2.5 bg-saffron-gradient text-white text-sm font-semibold font-sans rounded-xl shadow-temple hover:shadow-temple-lg hover:scale-[1.02] active:scale-100 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
          :disabled="!canUpload"
          @click="uploadAll"
        >
          <span v-if="isUploading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <Upload v-else :size="16" />
          {{ isUploading ? 'Uploading…' : 'Upload Audio' }}
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
          Clear
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
