<template>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
    <section v-for="col in columns" :key="col.key" class="bg-gray-50 rounded-2xl border p-2">
      <header class="px-2 py-1 flex items-center justify-between">
        <h3 class="font-semibold text-sm">{{ col.label }}</h3>
        <span class="text-xs text-gray-500">{{ (grouped[col.key] || []).length }}</span>
      </header>
      <div class="min-h-[200px] space-y-2 p-1" @dragover.prevent @drop="onDrop(col.key, $event)">
        <article v-for="item in (grouped[col.key] || [])" :key="item.id"
          class="bg-white rounded-2xl shadow-sm border p-3 cursor-grab active:cursor-grabbing"
          draggable="true"
          @dragstart="onDrag(item, col.key, $event)">
          <div class="flex items-start justify-between gap-2">
            <div class="font-medium text-sm truncate">{{ item.title || item.topic || ('#'+item.id) }}</div>
            <span class="text-[10px] px-2 py-0.5 rounded-full bg-gray-100">{{ item.city || item.preferredMode || '' }}</span>
          </div>
          <p v-if="item.details" class="text-xs text-gray-600 line-clamp-3 mt-1">{{ item.details }}</p>
          <div class="flex items-center justify-between mt-2">
            <span class="text-[11px] text-gray-500">#{{ item.id }}</span>
            <div class="flex gap-1">
              <button class="text-[11px] underline" @click="$emit('open', item)">查看</button>
              <button class="text-[11px] underline" @click="$emit('assign', item)">指派</button>
            </div>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  items: { type: Array, default: () => [] },
  columns: { type: Array, default: () => [
    { key: 'triage', label: '分流' },
    { key: 'assigned', label: '已指派' },
    { key: 'in-progress', label: '進行中' },
    { key: 'resolved', label: '已結案' },
  ] }
})
const emit = defineEmits(['move','open','assign'])

const grouped = computed(() => {
  const map = {}
  props.items.forEach(it => {
    const k = it.status || 'triage'
    map[k] ||= []
    map[k].push(it)
  })
  return map
})

function onDrag(item, from, e){
  e.dataTransfer.setData('text/plain', JSON.stringify({ id: item.id, from }))
}
function onDrop(to, e){
  try {
    const data = JSON.parse(e.dataTransfer.getData('text/plain'))
    emit('move', { id: data.id, from: data.from, to })
  } catch {}
}
</script>
