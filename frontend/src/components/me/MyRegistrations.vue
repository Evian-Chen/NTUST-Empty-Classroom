<template>
  <section class="space-y-3">
    <div class="flex items-center justify-between">
      <h3 class="font-semibold">我的報名</h3>
      <div class="text-sm text-gray-500">共 {{ items.length }} 筆</div>
    </div>

    <div class="overflow-auto">
      <table class="min-w-full text-sm">
        <thead>
          <tr class="text-left text-gray-500 border-b">
            <th class="py-2 pr-4">活動</th>
            <th class="py-2 pr-4">時間</th>
            <th class="py-2 pr-4">狀態</th>
            <th class="py-2 pr-2 w-56">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in items" :key="r.id" class="border-b">
            <td class="py-2 pr-4">
              <div class="font-medium">{{ r.event?.title || r.title }}</div>
              <div class="text-xs text-gray-500">{{ r.event?.hostName || '' }}</div>
            </td>
            <td class="py-2 pr-4">
              {{ formatDateTime(r.event?.datetimeStart || r.datetimeStart) }}
            </td>
            <td class="py-2 pr-4">
              <span class="text-xs px-2 py-0.5 rounded-full bg-gray-100">{{ r.status || 'registered' }}</span>
            </td>
            <td class="py-2 pr-2">
              <div class="flex gap-2">
                <RouterLink class="btn-ghost" :to="`/events/${r.eventId || r.event?.id}`">查看</RouterLink>
                <button class="btn-ghost" @click="downloadICS(r)">加入行事曆</button>
                <button class="btn-ghost" @click="cancel(r)" v-if="r.status!=='cancelled'">取消</button>
              </div>
            </td>
          </tr>
          <tr v-if="!loading && !items.length">
            <td colspan="4" class="text-center text-gray-500 py-6">尚無報名記錄。</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useRegistrationStore } from '@/stores/registrations'
import { eventToICS } from '@/utils/ics'
import { formatDateTime } from '@/utils/format'

const store = useRegistrationStore()
const items = computed(() => store.items)
const loading = computed(() => store.loading)

function saveAs(filename, content, mime='text/calendar'){
  const blob = new Blob([content], { type: `${mime};charset=utf-8` })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = filename
  document.body.appendChild(a); a.click(); URL.revokeObjectURL(a.href); a.remove()
}
function downloadICS(r){
  const e = r.event || r
  const ics = eventToICS(e)
  saveAs((e.title || 'event') + '.ics', ics)
}
async function cancel(r){ await store.cancel(r.id) }

onMounted(store.list)
</script>
