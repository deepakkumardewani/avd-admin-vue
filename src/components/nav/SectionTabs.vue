<script setup lang="ts">
import { Upload, Images, Music2 } from 'lucide-vue-next'

const props = defineProps<{
  active: string
  section: 'darshan' | 'audio'
}>()

const emit = defineEmits<{ change: [tab: string] }>()

const tabConfig = {
  darshan: [
    { key: 'upload', label: 'Upload',      icon: Upload },
    { key: 'view',   label: 'View Darshan', icon: Images },
  ],
  audio: [
    { key: 'upload', label: 'Upload',      icon: Upload },
    { key: 'view',   label: 'View Audios',  icon: Music2 },
  ],
}
</script>

<template>
  <div class="flex shrink-0 gap-1 p-1 bg-white border border-cream-darker rounded-xl w-fit">
    <button
      v-for="tab in tabConfig[section]"
      :key="tab.key"
      @click="emit('change', tab.key)"
      class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-sans transition-all duration-200"
      :class="active === tab.key
        ? 'font-semibold bg-cream text-saffron-600 shadow-temple border border-saffron-200'
        : 'font-medium text-temple-muted hover:text-temple-brown hover:bg-cream/80'"
    >
      <component :is="tab.icon" :size="15" />
      {{ tab.label }}
    </button>
  </div>
</template>
