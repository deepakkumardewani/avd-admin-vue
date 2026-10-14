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
  <aside class="hidden lg:flex flex-col w-56 min-h-screen bg-white border-r border-cream-darker shrink-0">
    <!-- Logo / Brand -->
    <div class="px-5 py-6 border-b border-cream-darker">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-lg bg-saffron-gradient flex items-center justify-center shadow-temple shrink-0">
          <span class="text-white font-display text-base font-bold leading-none">ॐ</span>
        </div>
        <div>
          <p class="font-display text-sm font-semibold text-temple-brown leading-tight">Anand Vrindavan</p>
          <p class="text-[10px] text-temple-muted tracking-widest uppercase font-sans mt-0.5">Admin Panel</p>
        </div>
      </div>
    </div>

    <!-- Nav Items -->
    <nav class="flex-1 px-3 py-4 space-y-1">
      <RouterLink
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
        :class="route.path === item.path
          ? 'bg-saffron-50 text-saffron-600 border border-saffron-200 shadow-inner-saffron'
          : 'text-temple-muted hover:bg-cream hover:text-temple-brown'"
      >
        <component
          :is="item.icon"
          :size="18"
          class="shrink-0 transition-transform duration-200 group-hover:scale-110"
          :class="route.path === item.path ? 'text-saffron' : ''"
        />
        <span class="font-sans">{{ item.label }}</span>
        <!-- Active dot -->
        <span
          v-if="route.path === item.path"
          class="ml-auto w-1.5 h-1.5 rounded-full bg-saffron"
        />
      </RouterLink>
    </nav>

    <!-- Footer -->
    <div class="px-5 py-4 border-t border-cream-darker">
      <p class="text-[10px] text-temple-sand font-sans tracking-wide">
        Jai Shri Krishna 🙏
      </p>
    </div>
  </aside>
</template>
