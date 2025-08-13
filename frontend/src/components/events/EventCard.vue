<template>
  <article class="card grid gap-2">
    <header class="flex items-start justify-between gap-4">
      <div>
        <h3 class="text-lg font-semibold">{{ event.title }}</h3>
        <p class="text-sm text-gray-600">
          <span>{{ dateRange }}</span>
          <span v-if="event.city || event.venue"> · {{ [event.venue, event.city].filter(Boolean).join('，') }}</span>
        </p>
      </div>
      <RouterLink class="btn-ghost" :to="`/events/${event.id}`">詳情</RouterLink>
    </header>
    <p v-if="event.description" class="text-sm text-gray-700 line-clamp-3">{{ event.description }}</p>
    <div class="flex flex-wrap gap-2 pt-2">
      <a class="btn-ghost" :href="gcal" target="_blank" rel="noopener">加入 Google 行事曆</a>
      <button class="btn-ghost" @click="download">下載 iCal (.ics)</button>
      <a v-if="event.registration?.url" class="btn-primary" :href="event.registration.url" target="_blank" rel="noopener">前往報名</a>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { googleCalendarUrl, downloadICS } from '@/utils/calendar'

const props = defineProps({ event: { type: Object, required: true }})

const dateRange = computed(() => {
  const s = new Date(props.event.datetimeStart)
  const e = props.event.datetimeEnd ? new Date(props.event.datetimeEnd) : null
  const f = (d) => `${d.getFullYear()}/${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
  return e ? `${f(s)} - ${f(e)}` : f(s)
})

const gcal = computed(() => googleCalendarUrl(props.event))
function download(){ downloadICS(props.event) }
</script>
