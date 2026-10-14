<script setup lang="ts">
import { ref } from 'vue'
import { UploadCloud } from 'lucide-vue-next'

const props = defineProps<{
  accept: string        // for the <input> accept attribute e.g. "image/png,image/jpeg"
  multiple?: boolean
  isDragOver?: boolean
  hint?: string         // e.g. "PNG, JPEG accepted · Max any size"
}>()

const emit = defineEmits<{
  filesSelected: [files: FileList]
}>()

const inputRef = ref<HTMLInputElement | null>(null)

function handleInput(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (files && files.length > 0) {
    emit('filesSelected', files)
    // reset so same file can be re-selected
    if (inputRef.value) inputRef.value.value = ''
  }
}
</script>

<template>
  <div
    class="relative rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer overflow-hidden"
    :class="isDragOver
      ? 'border-saffron bg-saffron-50 scale-[1.01] shadow-temple-glow'
      : 'border-cream-darker bg-white hover:border-saffron-300 hover:bg-saffron-50/40'"
    @click="inputRef?.click()"
  >
    <!-- Inner content -->
    <div class="flex flex-col items-center justify-center min-h-[220px] py-10 px-6 gap-3 select-none">
      <div
        class="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200"
        :class="isDragOver ? 'bg-saffron text-white scale-110 shadow-temple' : 'bg-saffron-50 text-saffron'"
      >
        <UploadCloud :size="28" />
      </div>

      <div class="text-center">
        <p class="text-sm font-semibold font-sans text-temple-brown">
          {{ isDragOver ? 'Drop files here' : 'Drag files here' }}
        </p>
        <p class="text-xs text-temple-muted font-sans mt-1">
          or <span class="text-saffron-600 underline underline-offset-2">click to browse</span>
        </p>
      </div>

      <p v-if="hint" class="text-[11px] text-temple-sand font-sans bg-cream px-3 py-1 rounded-full border border-cream-darker">
        {{ hint }}
      </p>
    </div>

    <!-- Drag overlay shimmer -->
    <div
      v-if="isDragOver"
      class="absolute inset-0 bg-saffron/5 pointer-events-none"
    />

    <!-- Hidden file input -->
    <input
      ref="inputRef"
      type="file"
      class="hidden"
      :accept="accept"
      :multiple="multiple"
      @change="handleInput"
    />
  </div>
</template>
