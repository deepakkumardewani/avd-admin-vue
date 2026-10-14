<script setup lang="ts">
import UploadQueueItem from './UploadQueueItem.vue'
import type { UploadQueueItem as IUploadQueueItem } from '@/types/api'

defineProps<{ items: IUploadQueueItem[] }>()
const emit = defineEmits<{ remove: [id: string] }>()
</script>

<template>
  <TransitionGroup
    v-if="items.length > 0"
    name="queue"
    tag="div"
    class="mt-4 space-y-2"
  >
    <UploadQueueItem
      v-for="item in items"
      :key="item.id"
      :item="item"
      @remove="emit('remove', $event)"
    />
  </TransitionGroup>
</template>

<style scoped>
.queue-enter-active { animation: slideUp 0.3s ease-out; }
.queue-leave-active { animation: slideUp 0.2s ease-in reverse; }
.queue-move { transition: transform 0.3s ease; }

@keyframes slideUp {
  from { transform: translateY(10px); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}
</style>
