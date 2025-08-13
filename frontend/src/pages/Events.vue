<template>
  <section class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">活動</h1>
      <div class="flex gap-2">
        <button class="btn-ghost" :class="view==='list' && 'ring-2 ring-tmblue'" @click="view='list'">清單</button>
        <button class="btn-ghost" :class="view==='calendar' && 'ring-2 ring-tmblue'" @click="view='calendar'">月曆</button>
      </div>
    </div>

    <div v-if="view==='list'" class="grid gap-3">
      <EventCard v-for="ev in events" :key="ev.id" :event="ev" />
      <p v-if="!loading && events.length===0" class="text-sm text-gray-500">目前沒有活動。</p>
    </div>

    <div v-else>
      <EventCalendar :events="events" @select="openDetail" />
      <div v-if="selected" class="mt-4 card">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h3 class="text-lg font-semibold">{{ selected.title }}</h3>
            <p class="text-sm text-gray-600">{{ formatRange(selected) }}</p>
          </div>
          <RouterLink class="btn-ghost" :to="`/events/${selected.id}`">查看詳情</RouterLink>
        </div>
        <div class="mt-2 flex gap-2">
          <a class="btn-ghost" :href="gcal(selected)" target="_blank">加入 Google 行事曆</a>
          <button class="btn-ghost" @click="ics(selected)">下載 iCal (.ics)</button>
          <a v-if="selected.registration?.url" class="btn-primary" :href="selected.registration.url" target="_blank">前往報名</a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useEventStore } from '@/stores/events'
import EventCard from '@/components/events/EventCard.vue'
import EventCalendar from '@/components/events/EventCalendar.vue'
import { googleCalendarUrl, downloadICS } from '@/utils/calendar'

const view = ref('calendar')
const selected = ref(null)

const store = useEventStore()
const loading = computed(() => store.loading)
const events = computed(() => store.items)

onMounted(async () => {
  if (!store.items.length) {
    // Fetch this month range (as an example); backend can ignore or use
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const end = new Date(now.getFullYear(), now.getMonth()+1, 0, 23, 59, 59).toISOString()
    await store.fetchEvents({ start, end })
  }
})

function openDetail(ev){ selected.value = ev }
function gcal(ev){ return googleCalendarUrl(ev) }
function ics(ev){ downloadICS(ev) }
function formatRange(ev){
  const s = new Date(ev.datetimeStart)
  const e = ev.datetimeEnd ? new Date(ev.datetimeEnd) : null
  const f = (d) => `${d.getFullYear()}/${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
  return e ? `${f(s)} - ${f(e)}` : f(s)
}
</script>
