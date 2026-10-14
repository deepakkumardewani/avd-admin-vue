<script setup lang="ts">
import { AlertTriangle, X } from 'lucide-vue-next'

defineProps<{
  title: string
  message: string
  confirmLabel?: string
  loading?: boolean
}>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div
        class="absolute inset-0 bg-temple-brown/40 backdrop-blur-sm"
        @click="emit('cancel')"
      />

      <!-- Dialog -->
      <div class="relative bg-white rounded-2xl shadow-temple-lg w-full max-w-sm p-6 animate-scale-in border border-cream-darker">
        <button
          class="absolute top-4 right-4 text-temple-muted hover:text-temple-brown transition-colors"
          @click="emit('cancel')"
        >
          <X :size="18" />
        </button>

        <div class="flex items-start gap-4">
          <div class="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
            <AlertTriangle :size="20" class="text-red-500" />
          </div>
          <div>
            <h3 class="font-display text-base font-semibold text-temple-brown">{{ title }}</h3>
            <p class="text-sm text-temple-muted font-sans mt-1 leading-relaxed">{{ message }}</p>
          </div>
        </div>

        <div class="flex gap-3 mt-5">
          <button
            class="flex-1 px-4 py-2.5 text-sm font-medium font-sans rounded-xl border border-cream-darker text-temple-muted hover:bg-cream transition-colors"
            @click="emit('cancel')"
          >
            Cancel
          </button>
          <button
            class="flex-1 px-4 py-2.5 text-sm font-medium font-sans rounded-xl bg-red-500 hover:bg-red-600 text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            :disabled="loading"
            @click="emit('confirm')"
          >
            <span v-if="loading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            {{ confirmLabel ?? 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
