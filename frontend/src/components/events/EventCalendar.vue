<template>
  <div class="card">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <button class="btn-ghost" @click="prevMonth">‹</button>
        <h3 class="font-semibold">{{ currentLabel }}</h3>
        <button class="btn-ghost" @click="nextMonth">›</button>
      </div>
      <button class="btn-ghost" @click="goToday">今天</button>
    </div>
    <div class="grid grid-cols-7 text-center text-xs font-medium text-gray-600 mb-2">
      <div v-for="d in weekdays" :key="d">{{ d }}</div>
    </div>
    <div class="grid grid-cols-7 gap-1">
      <div v-for="cell in cells" :key="cell.key" class="border rounded-2xl min-h-[96px] p-2 text-xs bg-white">
        <div class="flex justify-between items-center mb-1">
          <span :class="['font-semibold', cell.isCurrentMonth ? '' : 'text-gray-400']">{{ cell.date.getDate() }}</span>
          <span v-if="isToday(cell.date)" class="text-[10px] px-2 py-0.5 rounded-full bg-tmblue text-white">今天</span>
        </div>
        <ul class="space-y-1">
          <li v-for="ev in cell.events" :key="ev.id">
            <button class="text-left w-full truncate hover:underline" @click="$emit('select', ev)">
              • {{ timeLabel(ev.datetimeStart) }} {{ ev.title }}
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  events: { type: Array, default: () => [] },
  initial: { type: Date, default: () => new Date() },
})
const emit = defineEmits(['select'])

const viewDate = ref(new Date(props.initial))

watch(() => props.initial, (v) => { viewDate.value = new Date(v) })

const weekdays = ['日','一','二','三','四','五','六']

const currentLabel = computed(() => {
  const d = viewDate.value
  return `${d.getFullYear()} 年 ${String(d.getMonth()+1).padStart(2,'0')} 月`
})

function startOfMonth(d){ return new Date(d.getFullYear(), d.getMonth(), 1) }
function endOfMonth(d){ return new Date(d.getFullYear(), d.getMonth()+1, 0) }
function addMonths(d, n){ return new Date(d.getFullYear(), d.getMonth()+n, 1) }
function sameDate(a,b){ return a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate() }
function isToday(d){ const t=new Date(); return sameDate(t,d) }
function timeLabel(iso){
  const d = new Date(iso)
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
}

const cells = computed(() => {
  const monthStart = startOfMonth(viewDate.value)
  const monthEnd = endOfMonth(viewDate.value)
  const startWeekday = monthStart.getDay()
  const daysInMonth = monthEnd.getDate()

  // Build a 6-week grid (42 cells) for stable layout
  const grid = []
  const firstCellDate = new Date(monthStart)
  firstCellDate.setDate(firstCellDate.getDate() - startWeekday)

  for(let i=0;i<42;i++){
    const d = new Date(firstCellDate)
    d.setDate(d.getDate() + i)
    const isCurrentMonth = d.getMonth() === viewDate.value.getMonth()
    // collect events for that day
    const events = props.events.filter(ev => sameDate(new Date(ev.datetimeStart), d))
    grid.push({ key: d.toISOString().slice(0,10), date: d, isCurrentMonth, events })
  }
  return grid
})

function prevMonth(){ viewDate.value = addMonths(viewDate.value, -1) }
function nextMonth(){ viewDate.value = addMonths(viewDate.value, +1) }
function goToday(){ viewDate.value = new Date() }

defineExpose({ goToday, nextMonth, prevMonth })
</script>
