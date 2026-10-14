<script setup lang="ts">
defineProps<{
  count?: number
  variant?: 'card' | 'row' | 'image'
}>()
</script>

<template>
  <div class="space-y-3">
    <div
      v-for="i in (count ?? 1)"
      :key="i"
      class="animate-pulse"
    >
      <!-- Card skeleton -->
      <div v-if="variant === 'card' || !variant" class="bg-white rounded-xl p-4 border border-cream-darker">
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 rounded-lg bg-cream-dark shrink-0" />
          <div class="flex-1 space-y-2">
            <div class="h-3.5 bg-cream-dark rounded-full w-3/4" />
            <div class="h-3 bg-cream rounded-full w-1/2" />
          </div>
          <div class="w-16 h-8 bg-cream-dark rounded-lg shrink-0" />
        </div>
      </div>

      <!-- Row skeleton -->
      <div v-else-if="variant === 'row'" class="flex items-center gap-3 py-3 px-4 bg-white rounded-lg border border-cream-darker">
        <div class="w-8 h-8 rounded-full bg-cream-dark shrink-0" />
        <div class="flex-1 h-3 bg-cream-dark rounded-full" />
        <div class="w-20 h-3 bg-cream rounded-full" />
      </div>

      <!-- Image skeleton -->
      <div v-else-if="variant === 'image'" class="aspect-square bg-cream-dark rounded-xl" />
    </div>
  </div>
</template>
