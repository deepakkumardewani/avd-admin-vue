<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue'
import ToastNotification from '@/components/ui/ToastNotification.vue'
</script>

<template>
  <AppLayout>
    <RouterView v-slot="{ Component }">
      <Transition name="page" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </AppLayout>

  <ToastNotification />
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
