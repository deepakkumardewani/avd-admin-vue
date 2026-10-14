<script setup lang="ts">
import { useRoute } from 'vue-router'
import { SunMedium, Music2 } from 'lucide-vue-next'

const route = useRoute()
const navItems = [
  { path: '/darshan', label: 'Darshan', icon: SunMedium },
  { path: '/audio',   label: 'Audio',   icon: Music2 },
]
</script>

<template>
  <nav class="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-cream-darker safe-area-pb">
    <div class="flex">
      <RouterLink
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="flex-1 flex flex-col items-center justify-center gap-1 py-3 text-xs font-medium font-sans transition-colors duration-200"
        :class="route.path === item.path
          ? 'text-saffron-600'
          : 'text-temple-muted'"
      >
        <div class="relative">
          <component :is="item.icon" :size="22" />
          <span
            v-if="route.path === item.path"
            class="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-saffron"
          />
        </div>
        <span>{{ item.label }}</span>
      </RouterLink>
    </div>
  </nav>
</template>
