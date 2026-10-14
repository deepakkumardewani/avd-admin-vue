<script setup lang="ts">
import { ref } from 'vue'
import { Copy, Check, ExternalLink } from 'lucide-vue-next'
import type { DarshanImageUrl } from '@/types/api'

defineProps<{
  image: DarshanImageUrl
  index: number
}>()

const copied = ref(false)

async function copyUrl(url: string) {
  try {
    await navigator.clipboard.writeText(url)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    // fallback: silently ignore
  }
}
</script>

<template>
  <div class="group relative bg-white rounded-xl overflow-hidden border border-cream-darker shadow-sm hover:shadow-temple transition-all duration-300">
    <!-- Image -->
    <div class="aspect-[4/5] overflow-hidden rounded-t-xl bg-cream-dark">
      <img
        :src="image.placeholder || image.url"
        :data-src="image.url"
        :alt="`Darshan image ${index + 1}`"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
        @load="(e) => { const img = e.target as HTMLImageElement; if (img.dataset.src) img.src = img.dataset.src }"
      />
    </div>

    <!-- URL bar -->
    <div class="px-3 py-3 border-t border-cream-darker flex items-center gap-2.5 min-h-[44px]">
      <p class="flex-1 min-w-0 text-[11px] leading-snug text-temple-muted font-mono truncate">
        {{ image.url }}
      </p>
      <div class="flex gap-1.5 shrink-0">
        <button
          class="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
          :class="copied ? 'bg-green-50 text-green-500' : 'hover:bg-cream text-temple-muted hover:text-saffron'"
          :title="copied ? 'Copied!' : 'Copy URL'"
          @click="copyUrl(image.url)"
        >
          <Check v-if="copied" :size="12" />
          <Copy v-else :size="12" />
        </button>
        <a
          :href="image.url"
          target="_blank"
          rel="noopener"
          class="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-cream text-temple-muted hover:text-saffron transition-colors"
          title="Open in new tab"
        >
          <ExternalLink :size="12" />
        </a>
      </div>
    </div>
  </div>
</template>
