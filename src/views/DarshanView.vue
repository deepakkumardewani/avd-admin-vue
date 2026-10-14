<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SectionTabs from '@/components/nav/SectionTabs.vue'
import DarshanUpload from '@/components/darshan/DarshanUpload.vue'
import DarshanGallery from '@/components/darshan/DarshanGallery.vue'

const route = useRoute()
const router = useRouter()

const activeTab = computed(() => (route.query.tab as string) || 'upload')

function switchTab(tab: string) {
  router.replace({ query: { tab } })
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <header class="flex flex-col items-start gap-4">
      <div class="min-w-0">
        <p class="text-[11px] font-sans font-semibold tracking-[0.16em] uppercase text-saffron-600">Photos</p>
        <h1 class="font-display text-[1.75rem] leading-tight font-semibold text-temple-brown mt-1">Daily Darshan</h1>
        <p class="text-sm text-temple-muted font-sans mt-1.5 max-w-xl">
          {{ activeTab === 'upload' ? 'Upload today\'s darshan. PNG and JPEG.' : 'Review and remove today\'s uploaded images.' }}
        </p>
      </div>
      <SectionTabs section="darshan" :active="activeTab" @change="switchTab" />
    </header>

    <Transition name="tab" mode="out-in">
      <DarshanUpload v-if="activeTab === 'upload'" key="upload" />
      <DarshanGallery v-else key="view" />
    </Transition>
  </div>
</template>

<style scoped>
.tab-enter-active, .tab-leave-active { transition: opacity 0.2s ease; }
.tab-enter-from, .tab-leave-to { opacity: 0; }
</style>
