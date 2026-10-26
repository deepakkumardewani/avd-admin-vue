<script setup lang="ts">
import { ref, watch, computed, nextTick } from 'vue'
import { Calendar } from 'lucide-vue-next'
import { onClickOutside } from '@vueuse/core'
import LectureDateCalendar from '@/components/audio/LectureDateCalendar.vue'
import {
  formatToday,
  isoToParts,
  partsToIso,
  partsFromToday,
  isValidIsoDateString,
  isDateAllowedForUpload,
  uploadDateRangeMessage,
} from '@/utils/lectureDate'

const model = defineModel<string>({ default: formatToday() })

const emit = defineEmits<{
  valid: [value: boolean]
}>()

const day = ref('')
const month = ref('')
const year = ref('')
const dayRef = ref<HTMLInputElement | null>(null)
const monthRef = ref<HTMLInputElement | null>(null)
const yearRef = ref<HTMLInputElement | null>(null)
const rootRef = ref<HTMLElement | null>(null)
const calendarPopoverRef = ref<HTMLElement | null>(null)
const pickerOpen = ref(false)
const touched = ref(false)
const syncingFromModel = ref(false)

function onlyDigits(value: string, maxLen: number): string {
  return value.replace(/\D/g, '').slice(0, maxLen)
}

function applyPartsFromIso(iso: string) {
  const parts = isoToParts(iso)
  if (parts) {
    day.value = parts.day
    month.value = parts.month
    year.value = parts.year
    return
  }
  const today = partsFromToday()
  day.value = today.day
  month.value = today.month
  year.value = today.year
}

function emitModel() {
  const iso = partsToIso(day.value, month.value, year.value)
  syncingFromModel.value = true
  model.value = iso ?? ''
  syncingFromModel.value = false
}

applyPartsFromIso(model.value || formatToday())
emitModel()

watch(
  () => model.value,
  (iso) => {
    if (syncingFromModel.value) return
    if (iso && isValidIsoDateString(iso)) applyPartsFromIso(iso)
  },
)

const isoFromSegments = computed(() => partsToIso(day.value, month.value, year.value))

const isValid = computed(() => {
  const iso = isoFromSegments.value
  return iso !== null && isDateAllowedForUpload(iso)
})

const dateErrorMessage = computed(() => {
  const iso = isoFromSegments.value
  if (!iso || !isValidIsoDateString(iso)) return 'Invalid date'
  return uploadDateRangeMessage(iso) ?? 'Invalid date'
})

const showError = computed(
  () => touched.value && (day.value.length > 0 || month.value.length > 0 || year.value.length > 0) && !isValid.value,
)

watch(isValid, (v) => emit('valid', v), { immediate: true })

onClickOutside(
  rootRef,
  () => {
    pickerOpen.value = false
  },
  { ignore: [calendarPopoverRef] },
)

function focusSegment(el: HTMLInputElement | null) {
  if (!el) return
  el.focus()
  el.select()
}

function onSegmentInput(
  segment: 'day' | 'month' | 'year',
  raw: string,
  next: HTMLInputElement | null,
) {
  touched.value = true
  const max = segment === 'year' ? 4 : 2
  const digits = onlyDigits(raw, max)

  if (segment === 'day') {
    day.value = digits
    if (digits.length === 2) nextTick(() => focusSegment(next))
    else if (digits.length === 1 && Number(digits) > 3) {
      day.value = `0${digits}`
      nextTick(() => focusSegment(next))
    }
  } else if (segment === 'month') {
    month.value = digits
    if (digits.length === 2) nextTick(() => focusSegment(next))
    else if (digits.length === 1 && Number(digits) > 1) {
      month.value = `0${digits}`
      nextTick(() => focusSegment(next))
    }
  } else {
    year.value = digits
  }

  emitModel()
}

function onSegmentKeydown(
  event: KeyboardEvent,
  segment: 'day' | 'month' | 'year',
  prev: HTMLInputElement | null,
) {
  if (event.key !== 'Backspace') return
  const current =
    segment === 'day' ? day.value : segment === 'month' ? month.value : year.value
  if (current === '' && prev) {
    event.preventDefault()
    focusSegment(prev)
    if (segment === 'month') day.value = day.value.slice(0, -1)
    else if (segment === 'year') month.value = month.value.slice(0, -1)
    emitModel()
  }
}

function onPaste(event: ClipboardEvent) {
  event.preventDefault()
  touched.value = true
  const digits = onlyDigits(event.clipboardData?.getData('text') ?? '', 8)
  if (digits.length >= 8) {
    day.value = digits.slice(0, 2)
    month.value = digits.slice(2, 4)
    year.value = digits.slice(4, 8)
    emitModel()
    nextTick(() => focusSegment(yearRef.value))
  }
}

function onCalendarSelect(iso: string) {
  touched.value = true
  applyPartsFromIso(iso)
  emitModel()
  pickerOpen.value = false
}

const popoverStyle = ref<{ top: string; left: string }>({ top: '0px', left: '0px' })
const CALENDAR_EST_HEIGHT = 300

function updatePopoverPosition() {
  const el = rootRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const gap = 8
  const topAbove = rect.top - CALENDAR_EST_HEIGHT - gap
  const top =
    topAbove >= 8 ? topAbove : Math.max(8, rect.bottom + gap)
  popoverStyle.value = {
    top: `${top}px`,
    left: `${Math.min(rect.left, window.innerWidth - 296)}px`,
  }
}

function togglePicker() {
  pickerOpen.value = !pickerOpen.value
  if (pickerOpen.value) nextTick(updatePopoverPosition)
}

watch(pickerOpen, (open) => {
  if (!open) return
  nextTick(updatePopoverPosition)
})

const shellClass =
  'relative flex h-11 w-full items-center rounded-xl border border-cream-darker bg-white px-2 focus-within:border-saffron focus-within:ring-2 focus-within:ring-saffron/20 transition-all'

const segmentClass =
  'w-full min-w-0 bg-transparent text-center text-sm font-medium tabular-nums text-temple-brown placeholder:text-temple-sand focus:outline-none caret-saffron'
</script>

<template>
  <div ref="rootRef" class="relative w-full">
    <div
      :class="[shellClass, showError ? 'border-red-300 focus-within:border-red-400 focus-within:ring-red-100' : '']"
      @paste="onPaste"
    >
      <input
        ref="dayRef"
        :value="day"
        type="text"
        inputmode="numeric"
        autocomplete="off"
        maxlength="2"
        placeholder="DD"
        :class="[segmentClass, 'max-w-[2.25rem]']"
        aria-label="Day"
        @input="onSegmentInput('day', ($event.target as HTMLInputElement).value, monthRef)"
        @keydown="onSegmentKeydown($event, 'day', null)"
        @focus="($event.target as HTMLInputElement).select()"
      />

      <span class="text-sm text-temple-sand/80 select-none px-0.5" aria-hidden="true">/</span>

      <input
        ref="monthRef"
        :value="month"
        type="text"
        inputmode="numeric"
        autocomplete="off"
        maxlength="2"
        placeholder="MM"
        :class="[segmentClass, 'max-w-[2.25rem]']"
        aria-label="Month"
        @input="onSegmentInput('month', ($event.target as HTMLInputElement).value, yearRef)"
        @keydown="onSegmentKeydown($event, 'month', dayRef)"
        @focus="($event.target as HTMLInputElement).select()"
      />

      <span class="text-sm text-temple-sand/80 select-none px-0.5" aria-hidden="true">/</span>

      <input
        ref="yearRef"
        :value="year"
        type="text"
        inputmode="numeric"
        autocomplete="off"
        maxlength="4"
        placeholder="YYYY"
        :class="[segmentClass, 'max-w-[3.25rem] flex-1']"
        aria-label="Year"
        @input="onSegmentInput('year', ($event.target as HTMLInputElement).value, null)"
        @keydown="onSegmentKeydown($event, 'year', monthRef)"
        @focus="($event.target as HTMLInputElement).select()"
        @blur="touched = true"
      />

      <div class="ml-auto flex shrink-0 items-center pl-1">
        <div class="h-6 w-px bg-cream-darker mr-1" aria-hidden="true" />
        <button
          type="button"
          class="flex h-8 w-8 items-center justify-center rounded-lg text-saffron/90 hover:bg-saffron-50 transition-colors"
          :class="pickerOpen ? 'bg-saffron-50' : ''"
          aria-label="Open calendar"
          @click="togglePicker"
        >
          <Calendar :size="17" />
        </button>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="pickerOpen"
          ref="calendarPopoverRef"
          class="fixed z-[200]"
          :style="popoverStyle"
        >
          <LectureDateCalendar :model-value="model" @select="onCalendarSelect" />
        </div>
      </Transition>
    </Teleport>

    <p v-if="showError" class="mt-1.5 text-xs text-red-500 font-sans">
      {{ dateErrorMessage }}
    </p>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
