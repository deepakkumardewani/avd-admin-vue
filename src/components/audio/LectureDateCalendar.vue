<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { isValidIsoDateString, toIsoDateString } from '@/utils/lectureDate'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  select: [iso: string]
}>()

const viewYear = ref(new Date().getFullYear())
const viewMonth = ref(new Date().getMonth())

watch(
  () => props.modelValue,
  (iso) => {
    if (!iso || !isValidIsoDateString(iso)) return
    const [y, m] = iso.split('-').map(Number)
    viewYear.value = y
    viewMonth.value = m - 1
  },
  { immediate: true },
)

const monthLabel = computed(() =>
  new Date(viewYear.value, viewMonth.value, 1).toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  }),
)

const weekdayLabels = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

const cells = computed(() => {
  const first = new Date(viewYear.value, viewMonth.value, 1)
  const startPad = first.getDay()
  const daysInMonth = new Date(viewYear.value, viewMonth.value + 1, 0).getDate()
  const prevMonthDays = new Date(viewYear.value, viewMonth.value, 0).getDate()

  type Cell = { day: number; iso: string | null; muted: boolean; selected: boolean; today: boolean }

  const out: Cell[] = []
  for (let i = startPad - 1; i >= 0; i--) {
    const d = prevMonthDays - i
    const m = viewMonth.value === 0 ? 11 : viewMonth.value - 1
    const y = viewMonth.value === 0 ? viewYear.value - 1 : viewYear.value
    out.push(makeCell(y, m, d, true))
  }
  for (let d = 1; d <= daysInMonth; d++) {
    out.push(makeCell(viewYear.value, viewMonth.value, d, false))
  }
  let nextDay = 1
  while (out.length % 7 !== 0) {
    const m = viewMonth.value === 11 ? 0 : viewMonth.value + 1
    const y = viewMonth.value === 11 ? viewYear.value + 1 : viewYear.value
    out.push(makeCell(y, m, nextDay++, true))
  }
  return out
})

function makeCell(y: number, m: number, d: number, muted: boolean) {
  const iso = toIsoDateString({
    year: String(y),
    month: String(m + 1).padStart(2, '0'),
    day: String(d).padStart(2, '0'),
  })
  const valid = isValidIsoDateString(iso)
  const todayIso = toIsoDateString({
    year: String(new Date().getFullYear()),
    month: String(new Date().getMonth() + 1).padStart(2, '0'),
    day: String(new Date().getDate()).padStart(2, '0'),
  })
  return {
    day: d,
    iso: valid ? iso : null,
    muted,
    selected: props.modelValue === iso,
    today: todayIso === iso,
  }
}

function shiftMonth(delta: number) {
  const d = new Date(viewYear.value, viewMonth.value + delta, 1)
  viewYear.value = d.getFullYear()
  viewMonth.value = d.getMonth()
}

function pick(iso: string | null) {
  if (!iso) return
  emit('select', iso)
}
</script>

<template>
  <div
    class="w-[17.5rem] rounded-xl border border-cream-darker bg-white p-3 shadow-temple-lg font-sans"
    role="dialog"
    aria-label="Choose lecture date"
  >
    <div class="mb-3 flex items-center justify-between gap-2">
      <button
        type="button"
        class="flex h-8 w-8 items-center justify-center rounded-lg text-temple-muted hover:bg-saffron-50 hover:text-saffron transition-colors"
        aria-label="Previous month"
        @click="shiftMonth(-1)"
      >
        <ChevronLeft :size="18" />
      </button>
      <p class="text-sm font-semibold text-temple-brown tabular-nums">{{ monthLabel }}</p>
      <button
        type="button"
        class="flex h-8 w-8 items-center justify-center rounded-lg text-temple-muted hover:bg-saffron-50 hover:text-saffron transition-colors"
        aria-label="Next month"
        @click="shiftMonth(1)"
      >
        <ChevronRight :size="18" />
      </button>
    </div>

    <div class="mb-1 grid grid-cols-7 gap-0.5">
      <span
        v-for="wd in weekdayLabels"
        :key="wd"
        class="py-1 text-center text-[10px] font-medium uppercase tracking-wide text-temple-sand"
      >
        {{ wd }}
      </span>
    </div>

    <div class="grid grid-cols-7 gap-0.5">
      <button
        v-for="(cell, idx) in cells"
        :key="idx"
        type="button"
        :disabled="!cell.iso"
        class="flex h-8 w-8 items-center justify-center rounded-lg text-sm tabular-nums transition-colors mx-auto disabled:cursor-default"
        :class="[
          cell.selected
            ? 'bg-saffron-gradient text-white font-semibold shadow-sm'
            : cell.today
              ? 'ring-1 ring-saffron/40 text-saffron font-medium'
              : cell.muted
                ? 'text-temple-sand/70 hover:bg-cream/80'
                : 'text-temple-brown hover:bg-saffron-50',
        ]"
        @click="pick(cell.iso)"
      >
        {{ cell.day }}
      </button>
    </div>
  </div>
</template>
