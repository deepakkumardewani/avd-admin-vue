<script setup lang="ts">
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-vue-next'
import { useToast } from '@/composables/useToast'

const { toasts, remove } = useToast()

const iconMap = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
}

const colorMap = {
  success: 'border-l-green-500 bg-white',
  error:   'border-l-red-500 bg-white',
  warning: 'border-l-amber-500 bg-white',
  info:    'border-l-blue-500 bg-white',
}

const iconColorMap = {
  success: 'text-green-500',
  error:   'text-red-500',
  warning: 'text-amber-500',
  info:    'text-blue-500',
}
</script>

<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-50 flex flex-col gap-2 w-80 pointer-events-none">
      <TransitionGroup
        name="toast"
        tag="div"
        class="flex flex-col gap-2"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl shadow-temple-lg border-l-4 border border-gray-100 cursor-pointer"
          :class="colorMap[toast.type]"
          @click="remove(toast.id)"
        >
          <component
            :is="iconMap[toast.type]"
            :size="18"
            class="shrink-0 mt-0.5"
            :class="iconColorMap[toast.type]"
          />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-temple-brown font-sans leading-tight">{{ toast.title }}</p>
            <p v-if="toast.message" class="text-xs text-temple-muted font-sans mt-0.5 leading-snug break-words">{{ toast.message }}</p>
          </div>
          <button class="shrink-0 text-temple-muted hover:text-temple-brown transition-colors">
            <X :size="14" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-enter-active { animation: slideInRight 0.3s ease-out; }
.toast-leave-active { animation: slideOutRight 0.25s ease-in; }
.toast-move { transition: transform 0.3s ease; }

@keyframes slideInRight {
  from { transform: translateX(110%); opacity: 0; }
  to   { transform: translateX(0);    opacity: 1; }
}
@keyframes slideOutRight {
  from { transform: translateX(0);    opacity: 1; }
  to   { transform: translateX(110%); opacity: 0; }
}
</style>
