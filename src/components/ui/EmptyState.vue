<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  icon?: Component
  title: string
  message?: string
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16 px-6 text-center">
    <div class="w-16 h-16 rounded-2xl bg-saffron-50 border border-saffron-100 flex items-center justify-center mb-4">
      <component v-if="icon" :is="icon" :size="28" class="text-saffron-300" />
      <span v-else class="text-3xl">🙏</span>
    </div>
    <h3 class="font-display text-base font-semibold text-temple-brown">{{ title }}</h3>
    <p v-if="message" class="text-sm text-temple-muted font-sans mt-1.5 max-w-xs leading-relaxed">{{ message }}</p>
    <slot />
  </div>
</template>
