<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SectionTabs from '@/components/nav/SectionTabs.vue'
import AudioUpload from '@/components/audio/AudioUpload.vue'
import AudioList from '@/components/audio/AudioList.vue'

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
        <p class="text-[11px] font-sans font-semibold tracking-[0.16em] uppercase text-saffron-600">Lectures</p>
        <h1 class="font-display text-[1.75rem] leading-tight font-semibold text-temple-brown mt-1">Daily Audio</h1>
        <p class="text-sm text-temple-muted font-sans mt-1.5 max-w-xl">
          {{ activeTab === 'upload' ? 'Choose date and title, then upload MP3 (15 MB max).' : 'Browse, play, and remove uploaded lectures.' }}
        </p>
      </div>
      <SectionTabs section="audio" :active="activeTab" @change="switchTab" />
    </header>

    <AudioUpload v-show="activeTab === 'upload'" />
    <AudioList v-show="activeTab !== 'upload'" />
  </div>
</template>
