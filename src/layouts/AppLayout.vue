<script setup lang="ts">
import AppSidebar from '@/components/nav/AppSidebar.vue'
import MobileTabBar from '@/components/nav/MobileTabBar.vue'
</script>

<template>
  <div class="min-h-screen bg-cream bg-temple-pattern flex">
    <AppSidebar />

    <main class="flex-1 flex flex-col min-h-screen overflow-hidden">
      <!-- Top bar (mobile only) -->
      <header class="lg:hidden sticky top-0 z-30 bg-white/90 backdrop-blur-sm border-b border-cream-darker px-4 py-3 flex items-center gap-3">
        <div class="w-7 h-7 rounded-md bg-saffron-gradient flex items-center justify-center">
          <span class="text-white font-display text-sm font-bold">ॐ</span>
        </div>
        <span class="font-display text-sm font-semibold text-temple-brown">Anand Vrindavan Dham</span>
      </header>

      <!-- Page content -->
      <div class="flex-1 px-4 sm:px-6 lg:px-10 py-6 lg:py-8 pb-24 lg:pb-10 overflow-y-auto">
        <div class="max-w-6xl w-full mx-auto">
          <slot />
        </div>
      </div>
    </main>

    <MobileTabBar />
  </div>
</template>
