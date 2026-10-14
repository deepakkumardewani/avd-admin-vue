<script setup lang="ts">
import { ref } from 'vue'
import { Music2, Trash2, PlayCircle, ChevronDown, ChevronUp } from 'lucide-vue-next'
import type { AudioDoc } from '@/types/api'

defineProps<{ audio: AudioDoc }>()
const emit = defineEmits<{ delete: [id: string] }>()

const showPlayer = ref(false)

function formatDate(iso: string): string {
  const date = new Date(iso)
  if (isNaN(date.getTime())) return iso
  return date.toLocaleDateString('en-IN', {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
  })
}
</script>

<template>
  <div class="w-full bg-white rounded-xl border border-cream-darker shadow-sm hover:shadow-temple transition-all duration-200 overflow-hidden animate-slide-up">
    <div class="px-4 py-3.5 flex items-start gap-3">
      <!-- Icon -->
      <div class="w-10 h-10 rounded-xl bg-saffron-50 border border-saffron-100 flex items-center justify-center shrink-0">
        <Music2 :size="18" class="text-saffron" />
      </div>

      <!-- Info -->
      <div class="flex-1 min-w-0">
        <p class="text-sm font-semibold font-sans text-temple-brown truncate">{{ audio.subTitle || audio.fileTitle }}</p>
        <div class="flex items-center flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
          <span class="text-[11px] font-mono text-saffron-600 bg-saffron-50 px-2 py-0.5 rounded-full border border-saffron-100">{{ audio.title }}</span>
          <span class="text-[11px] text-temple-muted font-sans">{{ formatDate(audio.createdAt) }}</span>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-1 shrink-0">
        <button
          class="w-8 h-8 rounded-lg flex items-center justify-center text-temple-muted hover:text-saffron hover:bg-saffron-50 transition-all"
          :title="showPlayer ? 'Hide player' : 'Play audio'"
          @click="showPlayer = !showPlayer"
        >
          <PlayCircle v-if="!showPlayer" :size="18" />
          <ChevronUp v-else :size="18" />
        </button>
        <button
          class="w-8 h-8 rounded-lg flex items-center justify-center text-temple-muted hover:text-red-500 hover:bg-red-50 transition-all"
          title="Delete audio"
          @click="emit('delete', audio._id)"
        >
          <Trash2 :size="16" />
        </button>
      </div>
    </div>

    <!-- Inline audio player -->
    <Transition name="player">
      <div v-if="showPlayer" class="px-4 pb-3.5 border-t border-cream pt-3">
        <audio
          :src="audio.url"
          controls
          preload="none"
          class="w-full h-9 rounded-lg"
          style="accent-color: #FF9933;"
        />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.player-enter-active, .player-leave-active { transition: all 0.25s ease; max-height: 80px; }
.player-enter-from, .player-leave-to { opacity: 0; max-height: 0; }
</style>
